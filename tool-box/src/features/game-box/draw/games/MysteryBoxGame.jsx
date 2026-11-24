import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { secureRandomInt, shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * MYSTERY BOX — 리얼 Three.js 3D 추첨함 제비뽑기 미니게임
 *
 * Open-source provenance:
 * - Reference repository: `hongjiapeng/lottery-draw` (`lottery.html`, MIT License, Copyright (c) 2025 hongjiapeng).
 * - Original repo state: 2D card shake & non-repeating question pool (`usedQuestions`).
 * - Upgraded for GAMEBOX:
 *   1) Real Three.js WebGL 3D Walnut Wood & Brass Lottery Box with transparent front acrylic viewing window,
 *      circular top hand-hole rim, and real 3D folded paper slips tumbling inside!
 *   2) Physics-driven 3D box shake & tumbling interior slips -> single folded 3D paper slip rising out
 *      of the top circular slot -> 3-fold parchment paper unfolding animation with red seal stamp.
 *   3) Full Custom Preset ("직접 입력") + Individual <input> Item List with "+ 제비 항목 추가" button
 *      + Bulk Entry mode (separated by Enter or comma `,`).
 */

const PRESET_MODES = {
  prize: {
    label: '🎁 경품 · 당첨 제비 (1등~꽝)',
    items: [
      '🏆 1등: 백화점 상품권 10만원',
      '🥈 2등: 무선 노이즈캔슬링 이어폰',
      '🥉 3등: 프리미엄 커피 기프티콘',
      '🥉 3등: 프리미엄 커피 기프티콘',
      '🍬 참가상: 비타민 음료',
      '🍬 참가상: 비타민 음료',
      '💨 꽝! 다음 기회에',
      '💨 꽝! 다음 기회에',
    ],
  },
  coffee: {
    label: '☕ 커피 · 간식 내기 제비',
    items: [
      '💣 오늘 커피 전체 쏘기 당첨!',
      '🍰 디저트 쏘기 당첨!',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
      '🛡️ 안전 통과 (무료 시음권)',
    ],
  },
  names: {
    label: '🙋 발표자 · 당번 이름 뽑기',
    items: ['김성민', '이지훈', '박수진', '최민호', '정하늘', '강동원', '윤서연', '한지민'],
  },
  icebreaker: {
    label: '💬 팀 빌딩 질문 제비 (원본 스타일)',
    items: [
      '하루 동안 어느 식당이든 무료로 먹을 수 있다면 어디로 갈까요?',
      '무인도에 딱 한 가지 물건만 가져갈 수 있다면 무엇을 챙기겠습니까?',
      '순간이동 능력이 생겨서 5분 동안만 어디든 다녀올 수 있다면?',
      '오늘 나의 정신 상태를 음식 하나로 표현한다면 무엇인가요?',
      '우리 팀에서 내가 맡고 싶은 숨은 캐릭터(역할)는 무엇인가요?',
      '올해 안에 반드시 마스터하고 싶은 새로운 기술이나 취미가 있다면?',
    ],
  },
  custom: {
    label: '✏️ 직접 입력 (커스텀 빈 상자)',
    items: ['', '', ''],
  },
};

export default function MysteryBoxGame({ onBack }) {
  const [presetKey, setPresetKey] = useState('prize');
  const [itemRows, setItemRows] = useState(() => [...PRESET_MODES.prize.items]);
  const [inputMode, setInputMode] = useState('rows'); // 'rows' (individual inputs + add btn) | 'bulk' (newline/comma)
  const [bulkText, setBulkText] = useState(() => PRESET_MODES.prize.items.join('\n'));
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [drawnTicketIds, setDrawnTicketIds] = useState([]);

  // Separated states:
  // 1) Locked drawn ticket (`currentTicket`)
  // 2) Animation state (`phase`: 'idle' | 'shaking' | 'pulling' | 'flying' | 'unfolding' | 'revealed')
  const [currentTicket, setCurrentTicket] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [flyOffset, setFlyOffset] = useState({ x: -340, y: -60 });
  const [history, setHistory] = useState([]);

  const timersRef = useRef([]);
  const webglMountRef = useRef(null);
  const unfoldZoneRef = useRef(null);
  const threeStateRef = useRef(null);

  const clearTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  // Build valid non-empty tickets from `itemRows`
  const allTickets = useMemo(() => {
    const clean = itemRows.map(s => String(s || '').trim()).filter(Boolean);
    return clean.map((label, idx) => {
      const isHighlight = /1등|2등|3등|당첨|쏘기|🏆|🥈|🥉|💣/.test(label) && !/꽝/.test(label);
      return {
        id: `slip-${idx}-${label}`,
        serialNumber: idx + 1,
        label,
        isHighlight,
      };
    });
  }, [itemRows]);

  const drawnSet = useMemo(() => new Set(drawnTicketIds), [drawnTicketIds]);

  const remainingTickets = useMemo(() => {
    if (!preventDuplicates) return allTickets;
    return allTickets.filter(t => !drawnSet.has(t.id));
  }, [allTickets, drawnSet, preventDuplicates]);

  // ─── Three.js Real 3D Walnut & Acrylic Lottery Box Renderer ───
  useEffect(() => {
    const container = webglMountRef.current;
    if (!container) return undefined;

    const width = Math.max(320, container.clientWidth || 520);
    const height = Math.max(280, container.clientHeight || 420);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x161817);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.3, 8.2);
    camera.lookAt(0, 0.25, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.18;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch {
      return undefined;
    }

    // Warm Studio Lights
    scene.add(new THREE.AmbientLight(0xf6ecdc, 1.1));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.4);
    keyLight.position.set(5, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcf8050, 1.3);
    fillLight.position.set(-6, 4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xd3a56a, 1.8, 12);
    rimLight.position.set(0, 3.6, -2);
    scene.add(rimLight);

    // Pedestal Table Surface
    const tableMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(4.4, 4.8, 0.25, 48),
      new THREE.MeshStandardMaterial({ color: 0x202220, metalness: 0.25, roughness: 0.65 })
    );
    tableMesh.position.set(0, -1.78, 0);
    scene.add(tableMesh);

    // Master Box Rig (shakes and rotates as a single physical unit)
    const boxRig = new THREE.Group();
    scene.add(boxRig);

    // Materials: Walnut Wood, Brushed Brass, Clear Acrylic Front Window, Dark Velvet Interior
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4b3424,
      roughness: 0.48,
      metalness: 0.12,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x2d1f16,
      roughness: 0.6,
      metalness: 0.1,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd3a56a,
      metalness: 0.85,
      roughness: 0.22,
    });
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xfaf5eb,
      transparent: true,
      opacity: 0.22,
      roughness: 0.06,
      metalness: 0.05,
      transmission: 0.82,
      ior: 1.48,
      clearcoat: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const W = 3.2;
    const H = 3.0;
    const D = 3.0;
    const T = 0.14;

    // Bottom, Back, Left, Right Wood Panels
    const bottomPanel = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), darkWoodMat);
    bottomPanel.position.set(0, -H / 2, 0);
    boxRig.add(bottomPanel);

    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), woodMat);
    backPanel.position.set(0, 0, -D / 2);
    boxRig.add(backPanel);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), woodMat);
    leftPanel.position.set(-W / 2, 0, 0);
    boxRig.add(leftPanel);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(T, H, D), woodMat);
    rightPanel.position.set(W / 2, 0, 0);
    boxRig.add(rightPanel);

    // Front Transparent Acrylic Viewing Window + Wooden Border Frame
    const frontGlass = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.36, H - 0.36), acrylicMat);
    frontGlass.position.set(0, 0, D / 2 - 0.02);
    boxRig.add(frontGlass);

    // Brass Corner Trim Pillars
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.18, H + 0.12, 0.18), brassMat);
      pillar.position.set(sx * (W / 2), 0, sz * (D / 2));
      boxRig.add(pillar);
    });

    // Front Brass Frame Bars (Top & Bottom)
    const frontTopBar = new THREE.Mesh(new THREE.BoxGeometry(W + 0.08, 0.18, 0.18), brassMat);
    frontTopBar.position.set(0, H / 2, D / 2);
    boxRig.add(frontTopBar);

    const frontBotBar = new THREE.Mesh(new THREE.BoxGeometry(W + 0.08, 0.18, 0.18), brassMat);
    frontBotBar.position.set(0, -H / 2, D / 2);
    boxRig.add(frontBotBar);

    // Top Lid with Real Circular Hand-Slot Hole (Extruded shape with circular hole!)
    const topShape = new THREE.Shape();
    topShape.moveTo(-W / 2, -D / 2);
    topShape.lineTo(W / 2, -D / 2);
    topShape.lineTo(W / 2, D / 2);
    topShape.lineTo(-W / 2, D / 2);
    topShape.closePath();

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.82, 0, Math.PI * 2, true);
    topShape.holes.push(holePath);

    const topLidGeo = new THREE.ExtrudeGeometry(topShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    const topLidMesh = new THREE.Mesh(topLidGeo, woodMat);
    topLidMesh.rotation.x = Math.PI / 2;
    topLidMesh.position.set(0, H / 2 + 0.08, 0);
    boxRig.add(topLidMesh);

    // Brass Circular Hand-Hole Rim
    const holeRim = new THREE.Mesh(new THREE.TorusGeometry(0.84, 0.065, 16, 40), brassMat);
    holeRim.rotation.x = Math.PI / 2;
    holeRim.position.set(0, H / 2 + 0.08, 0);
    boxRig.add(holeRim);

    // Helper: Build a real 3D Z-folded / tri-folded paper slip mesh (so slips inside look genuinely folded!)
    const foldSpineGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8);
    const leafGeo = new THREE.BoxGeometry(0.46, 0.014, 0.28);
    const bandGeo = new THREE.BoxGeometry(0.09, 0.018, 0.285);
    const creaseMat = new THREE.MeshStandardMaterial({ color: 0xcab68e, roughness: 0.85, metalness: 0.02 });
    const stampRedMat = new THREE.MeshStandardMaterial({ color: 0x9b3826, roughness: 0.45, metalness: 0.1 });

    const createFoldedSlipMesh = (paperHex, scale = 1, withRedSeal = false) => {
      const grp = new THREE.Group();
      const paperMat = new THREE.MeshStandardMaterial({
        color: paperHex,
        roughness: 0.72,
        metalness: 0.04,
      });

      // Layer 1 (Bottom leaf)
      const leaf1 = new THREE.Mesh(leafGeo, paperMat);
      leaf1.position.set(0, -0.032, 0);
      leaf1.rotation.z = -0.05;
      grp.add(leaf1);

      // Fold hinge 1 (right crease)
      const hinge1 = new THREE.Mesh(foldSpineGeo, creaseMat);
      hinge1.rotation.x = Math.PI / 2;
      hinge1.position.set(0.225, -0.012, 0);
      grp.add(hinge1);

      // Layer 2 (Middle folded leaf, slightly ajar for realistic folded silhouette)
      const leaf2 = new THREE.Mesh(leafGeo, paperMat);
      leaf2.position.set(0, 0.008, 0);
      leaf2.rotation.z = 0.09;
      grp.add(leaf2);

      // Fold hinge 2 (left crease)
      const hinge2 = new THREE.Mesh(foldSpineGeo, creaseMat);
      hinge2.rotation.x = Math.PI / 2;
      hinge2.position.set(-0.225, 0.028, 0);
      grp.add(hinge2);

      // Layer 3 (Top folded flap)
      const leaf3 = new THREE.Mesh(leafGeo, paperMat);
      leaf3.position.set(0.01, 0.046, 0);
      leaf3.rotation.z = -0.08;
      grp.add(leaf3);

      // Subtle paper band or red seal
      if (withRedSeal) {
        const band = new THREE.Mesh(bandGeo, stampRedMat);
        band.position.set(0.01, 0.048, 0);
        band.rotation.z = -0.08;
        grp.add(band);
      }

      grp.scale.setScalar(scale);
      return grp;
    };

    // Interior 3D Folded Paper Slips Group
    const slipsGroup = new THREE.Group();
    boxRig.add(slipsGroup);

    const slipColors = [0xf7eed8, 0xf2e3be, 0xead5a8, 0xfaf4e6, 0xe8cc99];
    const interiorSlips = [];

    for (let i = 0; i < 24; i += 1) {
      const mesh = createFoldedSlipMesh(slipColors[i % slipColors.length], 1.0, i % 3 === 0);
      const px = (Math.random() - 0.5) * 2.05;
      const pz = (Math.random() - 0.5) * 1.85;
      const py = -1.24 + Math.floor(i / 6) * 0.19 + Math.random() * 0.1;
      mesh.position.set(px, py, pz);
      mesh.rotation.set(
        (Math.random() - 0.5) * 0.65,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.65
      );
      slipsGroup.add(mesh);

      interiorSlips.push({
        mesh,
        basePos: new THREE.Vector3(px, py, pz),
        vel: new THREE.Vector3(),
      });
    }

    // Hero Extracted 3D Folded Paper Slip (rises STRAIGHT UP out of the top circular hole, never crossing canvas edge!)
    const heroSlipGroup = createFoldedSlipMesh(0xfbf4e3, 1.55, true);
    heroSlipGroup.visible = false;
    boxRig.add(heroSlipGroup);

    const state = {
      phase: 'idle',
      remainingCount: 8,
      yawOffset: -0.35,
      extractProgress: 0,
      shakeTime: 0,
    };
    threeStateRef.current = state;

    let rafId = null;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Sync visible interior slip count
      const visCount = Math.min(interiorSlips.length, Math.max(0, state.remainingCount * 2));
      for (let i = 0; i < interiorSlips.length; i += 1) {
        interiorSlips[i].mesh.visible = i < visCount;
      }

      if (state.phase === 'shaking') {
        state.shakeTime += dt;
        const s = state.shakeTime * 26;
        boxRig.position.x = Math.sin(s) * 0.24;
        boxRig.position.y = Math.abs(Math.cos(s * 0.85)) * 0.26;
        boxRig.rotation.z = Math.sin(s * 0.9) * 0.18;
        boxRig.rotation.x = Math.cos(s * 0.7) * 0.12;
        boxRig.rotation.y = state.yawOffset + Math.sin(s * 0.5) * 0.25;

        // Tumble interior 3D paper slips energetically inside the acrylic box!
        interiorSlips.forEach((sl, idx) => {
          if (!sl.mesh.visible) return;
          sl.mesh.position.y = -0.3 + Math.sin(s * 0.7 + idx * 1.3) * 0.9;
          sl.mesh.position.x = Math.cos(s * 0.5 + idx * 1.7) * 1.05;
          sl.mesh.position.z = Math.sin(s * 0.6 + idx * 1.1) * 0.95;
          sl.mesh.rotation.x += dt * 7;
          sl.mesh.rotation.y += dt * 6;
        });
        heroSlipGroup.visible = false;
      } else {
        // Gentle idle settle
        boxRig.position.lerp(new THREE.Vector3(0, 0, 0), 0.12);
        boxRig.rotation.x += (0 - boxRig.rotation.x) * 0.12;
        boxRig.rotation.z += (0 - boxRig.rotation.z) * 0.12;
        const idleY = state.yawOffset + Math.sin(now * 0.0007) * 0.14;
        boxRig.rotation.y += (idleY - boxRig.rotation.y) * 0.08;

        // Settle interior slips back down
        interiorSlips.forEach((sl) => {
          if (!sl.mesh.visible) return;
          sl.mesh.position.lerp(sl.basePos, 0.1);
        });

        if (state.phase === 'pulling') {
          heroSlipGroup.visible = true;
          state.extractProgress = Math.min(1, state.extractProgress + dt * 2.2);
          const ease = 1 - Math.pow(1 - state.extractProgress, 3);
          // Rise straight up out of the circular top hole cleanly inside the left 3D viewport!
          const riseY = 0.25 + ease * 2.15;
          heroSlipGroup.position.set(0, riseY, ease * 0.45);
          heroSlipGroup.rotation.x = 0.45 + (1 - ease) * 0.9;
          heroSlipGroup.rotation.y = ease * 0.6;
          heroSlipGroup.rotation.z = Math.sin(ease * Math.PI) * 0.12;
        } else {
          // Hand off cleanly to the single unclipped DOM folded slip at the exact top-hole coordinates!
          heroSlipGroup.visible = false;
          if (state.phase === 'idle') {
            state.extractProgress = 0;
          }
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(280, container.clientWidth || 500);
      const h = Math.max(240, container.clientHeight || 400);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (ro) ro.observe(container);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, []);

  // Sync React phase & count to Three.js state
  useEffect(() => {
    if (threeStateRef.current) {
      threeStateRef.current.phase = phase;
      threeStateRef.current.remainingCount = remainingTickets.length;
      if (phase === 'shaking') {
        threeStateRef.current.shakeTime = 0;
        threeStateRef.current.extractProgress = 0;
      }
    }
  }, [phase, remainingTickets.length]);

  const finalizeTicketReveal = (locked, nextDrawnIds) => {
    clearTimers();
    setCurrentTicket(locked);
    if (preventDuplicates && nextDrawnIds) {
      setDrawnTicketIds(nextDrawnIds);
    }
    setPhase('revealed');
    drawSound.playFanfare();

    setHistory(prev => [
      {
        id: `box-${Date.now()}`,
        time: formatDrawTime(),
        serialNumber: locked.serialNumber,
        label: locked.label,
        remainingAfter: preventDuplicates
          ? Math.max(0, allTickets.length - (nextDrawnIds?.length || drawnTicketIds.length))
          : allTickets.length,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const computeBoxToRevealOffset = () => {
    const leftEl = webglMountRef.current;
    const rightEl = unfoldZoneRef.current;
    if (!leftEl || !rightEl) return { x: -340, y: -60 };
    const lr = leftEl.getBoundingClientRect();
    const rr = rightEl.getBoundingClientRect();
    // Point directly above the 3D box's circular top mouth in the left viewport
    const startX = lr.left + lr.width * 0.5;
    const startY = lr.top + lr.height * 0.26;
    const endX = rr.left + rr.width * 0.5;
    const endY = rr.top + rr.height * 0.5;
    return {
      x: Math.round(startX - endX),
      y: Math.round(startY - endY),
    };
  };

  const handleDrawOneTicket = () => {
    if (phase === 'shaking' || phase === 'pulling' || phase === 'flying' || phase === 'unfolding') return;
    if (remainingTickets.length === 0) return;

    clearTimers();
    setFlyOffset(computeBoxToRevealOffset());

    const pickIdx = secureRandomInt(remainingTickets.length);
    const locked = remainingTickets[pickIdx];
    const nextDrawnIds = preventDuplicates ? [...drawnTicketIds, locked.id] : drawnTicketIds;

    setCurrentTicket(locked);
    setPhase('shaking');
    drawSound.playBoxShake();

    // 1) Rise straight up out of the 3D box's top circular hole
    const t1 = setTimeout(() => {
      setPhase('pulling');
      drawSound.playTick(0.45, 'pop');
    }, 650);

    // 2) Seamlessly hand off at the top hole and fly in an unclipped arc to the right reveal pad
    const t2 = setTimeout(() => {
      setFlyOffset(computeBoxToRevealOffset());
      setPhase('flying');
    }, 1150);

    // 3) Land right in place on the right pad and unfold the 3-fold creases
    const t3 = setTimeout(() => {
      setPhase('unfolding');
      drawSound.playPaperUnfold();
    }, 1780);

    // 4) Fully unfolded parchment result
    const t4 = setTimeout(() => {
      finalizeTicketReveal(locked, nextDrawnIds);
    }, 2400);

    timersRef.current.push(t1, t2, t3, t4);
  };

  const handleShakeBoxOnly = () => {
    if (phase !== 'idle' && phase !== 'revealed') return;
    if (allTickets.length < 2) return;
    clearTimers();
    setPhase('shaking');
    drawSound.playBoxShake();
    const shuffled = shuffleUnbiased(itemRows.filter(s => s.trim()));
    setItemRows(shuffled);
    setBulkText(shuffled.join('\n'));
    const t = setTimeout(() => {
      setPhase('idle');
    }, 600);
    timersRef.current.push(t);
  };

  const handleInstantUnfold = () => {
    if (!currentTicket) return;
    const nextDrawnIds = preventDuplicates && !drawnSet.has(currentTicket.id)
      ? [...drawnTicketIds, currentTicket.id]
      : drawnTicketIds;
    finalizeTicketReveal(currentTicket, nextDrawnIds);
  };

  const handleResetBox = () => {
    clearTimers();
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  const handleApplyPreset = (key) => {
    const preset = PRESET_MODES[key];
    if (!preset) return;
    clearTimers();
    setPresetKey(key);
    setItemRows([...preset.items]);
    setBulkText(preset.items.filter(Boolean).join('\n'));
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  // Individual Row Input Handlers
  const handleRowChange = (idx, value) => {
    const next = [...itemRows];
    next[idx] = value;
    setItemRows(next);
    setBulkText(next.filter(Boolean).join('\n'));
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  const handleAddRow = () => {
    const next = [...itemRows, ''];
    setItemRows(next);
  };

  const handleRemoveRow = (idx) => {
    const next = itemRows.filter((_, i) => i !== idx);
    setItemRows(next.length > 0 ? next : ['']);
    setBulkText(next.filter(Boolean).join('\n'));
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  // Bulk Input Handler (Enter or Comma `,` separated)
  const handleBulkChange = (text) => {
    setBulkText(text);
    const parsed = text
      .split(/[,\r\n]+/)
      .map(s => s.trim())
      .filter(Boolean);
    setItemRows(parsed.length > 0 ? parsed : ['']);
    setDrawnTicketIds([]);
    setCurrentTicket(null);
    setPhase('idle');
  };

  const isBusy = phase === 'shaking' || phase === 'pulling' || phase === 'flying' || phase === 'unfolding';

  return (
    <div className="rpz-game-shell" data-testid="game-mystery-box">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← 추첨 게임 목록
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 05 · REAL 3D WALNUT & ACRYLIC LOTTERY BOX</span>
            <h2>🎁 MYSTERY BOX — 3D 제비뽑기</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          <button
            type="button"
            className="rpz-btn rpz-btn-secondary"
            data-testid="box-shake-btn"
            onClick={handleShakeBoxOnly}
            disabled={isBusy || allTickets.length < 2}
          >
            🫨 상자 흔들어 섞기
          </button>

          {(phase === 'idle' || phase === 'revealed') && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="box-draw-btn"
              onClick={handleDrawOneTicket}
              disabled={remainingTickets.length === 0}
            >
              {allTickets.length === 0
                ? '제비 항목을 입력하세요'
                : remainingTickets.length === 0
                  ? '모든 제비 소진됨 (리셋 필요)'
                  : phase === 'revealed'
                    ? `✋ 다음 제비 뽑기 (남은 ${remainingTickets.length}장)`
                    : `✋ 제비 한 장 뽑기 (남은 ${remainingTickets.length}장)`}
            </button>
          )}

          {isBusy && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="box-instant-btn"
              onClick={handleInstantUnfold}
            >
              ⚡ 종이 즉시 펼치기
            </button>
          )}

          <button
            type="button"
            className="rpz-btn rpz-btn-ghost"
            data-testid="box-reset-btn"
            onClick={handleResetBox}
          >
            ♻️ 제비 전체 다시 넣기
          </button>
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="box-phase-badge">
              {phase === 'idle' && (
                allTickets.length === 0
                  ? '커스텀 상자가 비어 있습니다 — 우측에서 제비 항목을 입력하고 + 추가하세요'
                  : `3D 원목 아크릴 추첨함 대기 중 — 상자 안 남은 제비 ${remainingTickets.length}장 / 전체 ${allTickets.length}장`
              )}
              {phase === 'shaking' && '🫨 3D 추첨함을 흔들어 내부 접힌 종이 제비를 섞는 중...'}
              {phase === 'pulling' && '✉️ 상단 원형 투입구에서 접힌 종이 제비 한 장을 꺼내는 중...'}
              {phase === 'flying' && '📨 꺼낸 접힌 종이를 오른쪽 펼침 영역으로 옮기는 중...'}
              {phase === 'unfolding' && '📜 접힌 한지 제비를 3단으로 펼치는 중...'}
              {phase === 'revealed' && currentTicket && `🎉 제비 공개 완료! [제비 #${currentTicket.serialNumber}] ${currentTicket.label}`}
            </span>

            <div className="rpz-mode-badges">
              <button
                type="button"
                data-testid="box-duplicate-toggle"
                className={`rpz-chip ${preventDuplicates ? 'active' : ''}`}
                onClick={() => setPreventDuplicates(v => !v)}
              >
                🔒 중복 추첨 방지 {preventDuplicates ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Real Three.js 3D Box + Realistic Folded Paper Unfold Stage */}
          <div className="rpz-mystery-3d-stage" data-testid="box-3d-stage">
            <div className="rpz-mystery-webgl-wrap">
              <div
                ref={webglMountRef}
                className="rpz-mystery-webgl-mount"
                onClick={handleDrawOneTicket}
                title="클릭하여 3D 추첨함에서 제비 한 장 뽑기"
              />
              <div className="rpz-mystery-3d-hud">
                <span>남은 제비 <strong>{remainingTickets.length}</strong> / {allTickets.length}장</span>
                <button
                  type="button"
                  className="rpz-btn-xs"
                  onClick={() => { if (threeStateRef.current) threeStateRef.current.yawOffset -= 0.45; }}
                >
                  ◀ 좌회전
                </button>
                <button
                  type="button"
                  className="rpz-btn-xs"
                  onClick={() => { if (threeStateRef.current) threeStateRef.current.yawOffset += 0.45; }}
                >
                  우회전 ▶
                </button>
              </div>
            </div>

            {/* 3-Fold Realistic Parchment Paper Slip Unfolding Panel (Seamless Unclipped Flight from Left 3D Box) */}
            <div className="rpz-paper-unfold-zone" ref={unfoldZoneRef}>
              {!currentTicket || phase === 'idle' || phase === 'shaking' || phase === 'pulling' ? (
                <div className="rpz-paper-placeholder" onClick={handleDrawOneTicket}>
                  <span className="rpz-paper-icon">
                    {phase === 'shaking' ? '🫨' : phase === 'pulling' ? '✋' : '✉️'}
                  </span>
                  <strong>
                    {phase === 'shaking'
                      ? '왼쪽 3D 추첨함을 흔들어 접힌 제비를 섞는 중...'
                      : phase === 'pulling'
                        ? '왼쪽 상자 투입구에서 접힌 종이 한 장을 꺼내는 중...'
                        : allTickets.length === 0
                          ? '우측 [2. 상자 속 제비 목록 편집]에 항목을 입력하세요'
                          : '왼쪽 3D 추첨함을 클릭하거나 [제비 한 장 뽑기]를 누르세요'}
                  </strong>
                  <p>왼쪽 상자에서 뽑힌 접힌 종이가 끊김 없이 이곳으로 날아와 3단 접힘을 펼치며 결과를 공개합니다.</p>
                </div>
              ) : (
                <div
                  className={`rpz-tri-fold-stage phase-${phase}`}
                  data-testid="box-paper-slip"
                  style={{
                    '--fly-start-x': `${flyOffset.x}px`,
                    '--fly-start-y': `${flyOffset.y}px`,
                  }}
                >
                  {/* Top Folded Flap (Unfolds upward from crease 1) */}
                  <div className="rpz-fold-panel rpz-fold-top">
                    <div className="rpz-fold-face rpz-fold-front">
                      <span>GAMEBOX OFFICIAL DRAW SLIP · NO.{String(currentTicket.serialNumber).padStart(2, '0')}</span>
                      <span className="rpz-fold-seal-tag">밀봉 해제</span>
                    </div>
                    <div className="rpz-fold-face rpz-fold-back">
                      <span>제비 #{currentTicket.serialNumber}</span>
                    </div>
                  </div>

                  {/* Center Main Body with Realistic Horizontal & Vertical Crease Marks */}
                  <div className="rpz-fold-panel rpz-fold-center">
                    <div className="rpz-paper-crease-v" aria-hidden="true" />
                    <div className="rpz-paper-crease-h top" aria-hidden="true" />
                    <div className="rpz-paper-crease-h bottom" aria-hidden="true" />

                    {phase === 'flying' && (
                      <div className="rpz-paper-stage-msg">✉️ 접힌 제비(#{currentTicket.serialNumber}) 이동 중...</div>
                    )}
                    {phase === 'unfolding' && (
                      <div className="rpz-paper-stage-msg">📜 접힌 종이를 펼치는 중...</div>
                    )}
                    {phase === 'revealed' && (
                      <div className="rpz-paper-revealed-content" data-testid="box-revealed-result">
                        <span className="rpz-paper-serial">제비 번호 #{currentTicket.serialNumber}</span>
                        <strong className="rpz-paper-result-text">{currentTicket.label}</strong>
                        <span className="rpz-paper-stamp">
                          {currentTicket.isHighlight ? '당첨 확정' : '추첨 확인'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Folded Flap (Unfolds downward from crease 2) */}
                  <div className="rpz-fold-panel rpz-fold-bottom">
                    <div className="rpz-fold-face rpz-fold-front">
                      <span>
                        {preventDuplicates
                          ? `중복 추첨 방지 적용 · 상자 잔여 ${remainingTickets.length}장`
                          : '복원 추출 모드'}
                      </span>
                    </div>
                    <div className="rpz-fold-face rpz-fold-back">
                      <span>GAMEBOX RANDOM ZONE</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rpz-ticket-pool-strip" data-testid="box-pool-strip">
            <div className="rpz-pool-header">
              <strong>상자 속 제비 현황 ({remainingTickets.length}장 남음 / {drawnTicketIds.length}장 뽑힘)</strong>
            </div>
            <div className="rpz-pool-chips">
              {allTickets.length === 0 ? (
                <span className="rpz-empty">등록된 제비가 없습니다.</span>
              ) : (
                allTickets.map((t) => {
                  const isDrawn = preventDuplicates && drawnSet.has(t.id);
                  return (
                    <span
                      key={t.id}
                      className={`rpz-slip-badge ${isDrawn ? 'drawn' : 'inside'}`}
                      title={isDrawn ? `이미 뽑힘: ${t.label}` : '상자 안에 들어있는 미추첨 제비'}
                    >
                      #{t.serialNumber} {isDrawn ? `(${t.label.slice(0, 12)})` : '접힌 제비'}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 제비 프리셋 / 커스텀 선택</h3>
            <div className="rpz-preset-col">
              {Object.entries(PRESET_MODES).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  data-testid={`box-preset-${key}`}
                  className={`rpz-preset-btn ${presetKey === key ? 'active' : ''}`}
                  disabled={isBusy}
                  onClick={() => handleApplyPreset(key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rpz-card">
            <div className="rpz-card-head-between">
              <h3>2. 상자 속 제비 목록 편집 ({allTickets.length}장)</h3>
              <div className="rpz-preset-row">
                <button
                  type="button"
                  className={`rpz-btn-xs ${inputMode === 'rows' ? 'active' : ''}`}
                  onClick={() => setInputMode('rows')}
                >
                  개별 입력
                </button>
                <button
                  type="button"
                  className={`rpz-btn-xs ${inputMode === 'bulk' ? 'active' : ''}`}
                  onClick={() => {
                    setBulkText(itemRows.filter(Boolean).join('\n'));
                    setInputMode('bulk');
                  }}
                >
                  엔터/쉼표 일괄
                </button>
              </div>
            </div>

            {inputMode === 'rows' ? (
              <>
                <div className="rpz-item-editor-list" data-testid="box-rows-editor">
                  {itemRows.map((val, idx) => (
                    <div key={idx} className="rpz-item-row">
                      <span className="rpz-item-index">#{String(idx + 1).padStart(2, '0')}</span>
                      <input
                        type="text"
                        className="rpz-input"
                        value={val}
                        disabled={isBusy}
                        placeholder={`제비 #${idx + 1} 내용 입력...`}
                        onChange={e => handleRowChange(idx, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRow();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="rpz-item-remove-btn"
                        disabled={isBusy}
                        title="항목 삭제"
                        onClick={() => handleRemoveRow(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="rpz-add-row-btn"
                  data-testid="box-add-item-btn"
                  disabled={isBusy}
                  onClick={handleAddRow}
                >
                  + 제비 항목 추가
                </button>
              </>
            ) : (
              <>
                <textarea
                  className="rpz-textarea"
                  rows={6}
                  value={bulkText}
                  disabled={isBusy}
                  onChange={e => handleBulkChange(e.target.value)}
                  placeholder="엔터(줄바꿈) 또는 쉼표(,)로 구분하여 여러 제비를 한 번에 입력하세요"
                  data-testid="box-tickets-textarea"
                />
                <small className="rpz-hint">
                  엔터(줄바꿈) 또는 쉼표(,)로 구분된 각 항목이 접힌 종이 제비 1장이 됩니다.
                </small>
              </>
            )}
          </div>

          <div className="rpz-card">
            <h3>3. 뽑은 제비 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 뽑은 제비가 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="box-history-list">
                {history.map(item => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>제비 #{item.serialNumber}: {item.label}</strong>
                      <small>{item.time}</small>
                    </div>
                    <small>추첨 후 상자 잔여: {item.remainingAfter}장</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
