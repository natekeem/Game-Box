import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { secureRandomFloat, shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * LOTTO 6/45 — 실제 3D 물리 구멍 배출 추첨기 (Genuine Physics Aperture Draw)
 *
 * Open-source provenance:
 * - 3D Lottery Machine Architecture & Ball Texture Atlas Technique adapted from
 *   `steller102/3d-lottery` (`public/three/million.js`, MIT License, Copyright (c) 2025 Steller).
 * - Lotto 6/45 Color Ranges & Ticket Rank Checker adapted from
 *   `Tae-sung-Kim/pickle-eight` (`src/features/lotto/utils/lotto.util.ts`, MIT License, Copyright (c) 2025 Tae-sung Kim).
 *
 * Genuine 3D Physics Extraction (No Pre-Rigged Teleportation):
 * - All 45 numbered 3D balls (1..45) receive unbiased Web Crypto randomized initial positions & velocities.
 * - The spherical chamber has a REAL physical top aperture hole (`HOLE_RADIUS`) guarded by a sliding mechanical gate.
 * - When the gate opens (`gateOpen = true`), whichever real 3D ball physically bounces/floats up into the top hole
 *   under gravity, air-jet updraft, dual-paddle impacts, and 45x45 elastic sphere collisions is captured by the aperture,
 *   immediately closes the mechanical gate behind it, rolls through the transparent curved exit tube, and lands on the display tray.
 */

const TOTAL_BALLS = 45;
const CHAMBER_RADIUS = 3.1;
const BALL_RADIUS = 0.27;
const HOLE_RADIUS = 0.62;

const NAME_BALL_PALETTE = [
  '#d97706', '#2563eb', '#dc2626', '#16a34a',
  '#9333ea', '#0d9488', '#ea580c', '#db2777',
  '#4f46e5', '#65a30d', '#ca8a04', '#0284c7',
];

const LOTTO_MODES = [
  { id: 'lotto645', label: '🎱 기본 6/45', desc: '45구 중 6개 + 보너스 1개' },
  { id: 'customCount', label: '🔢 개수 지정', desc: '원하는 숫자 개수(1~10개)만 뽑기' },
  { id: 'redBlue', label: '🔴🔵 레드/블루', desc: '빨간볼·파란볼 비율 대결 추첨' },
  { id: 'names', label: '👤 이름 공 (중복)', desc: '참가자 이름별 공 개수 투입 추첨' },
];

const DEFAULT_NAME_ENTRIES = [
  { id: 'n1', name: '김성민', count: 3 },
  { id: 'n2', name: '이지훈', count: 2 },
  { id: 'n3', name: '박수진', count: 2 },
  { id: 'n4', name: '최민호', count: 1 },
  { id: 'n5', name: '정하늘', count: 2 },
];

export function getLottoBallColor(num) {
  if (num <= 10) return '#eab308'; // 1~10 Yellow
  if (num <= 20) return '#3b82f6'; // 11~20 Blue
  if (num <= 30) return '#ef4444'; // 21~30 Red
  if (num <= 40) return '#64748b'; // 31~40 Gray
  return '#22c55e';                // 41~45 Green
}

export function drawUnbiasedLotto645() {
  const pool = Array.from({ length: TOTAL_BALLS }, (_, i) => i + 1);
  const shuffled = shuffleUnbiased(pool);
  const extractionOrder = shuffled.slice(0, 7);
  const mainNumbers = [...extractionOrder.slice(0, 6)].sort((a, b) => a - b);
  const bonusNumber = extractionOrder[6];
  return { extractionOrder, mainNumbers, bonusNumber };
}

export function checkLottoTicketRank(mainNumbers, bonusNumber, myTicket) {
  if (!Array.isArray(myTicket) || myTicket.length !== 6) return null;
  const mainSet = new Set(mainNumbers);
  const matchedMain = myTicket.filter(n => mainSet.has(n));
  const bonusMatched = myTicket.includes(bonusNumber);
  const count = matchedMain.length;

  let rank = 0;
  let label = '미당첨 (다음 기회에)';
  if (count === 6) {
    rank = 1;
    label = '🏆 1등 당첨! (6개 번호 모두 일치)';
  } else if (count === 5 && bonusMatched) {
    rank = 2;
    label = '🥈 2등 당첨! (5개 번호 + 보너스 볼 일치)';
  } else if (count === 5) {
    rank = 3;
    label = '🥉 3등 당첨! (5개 번호 일치)';
  } else if (count === 4) {
    rank = 4;
    label = '🎉 4등 당첨! (4개 번호 일치)';
  } else if (count === 3) {
    rank = 5;
    label = '🎈 5등 당첨! (3개 번호 일치)';
  }

  return { rank, label, matchedMain, bonusMatched };
}

function createBallTexture({ label, color, isText = false }) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const baseColor = color || '#eab308';

  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, baseColor);
  grad.addColorStop(0.58, baseColor);
  grad.addColorStop(1, '#1a1816');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(0, 50, 256, 28);

  const textStr = String(label ?? '');
  const shortText = textStr.length > 5 ? textStr.slice(0, 5) : textStr;

  [64, 192].forEach((cx) => {
    ctx.save();
    ctx.beginPath();
    if (isText) {
      ctx.ellipse(cx, 64, 48, 30, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(cx, 64, 34, 0, Math.PI * 2);
    }
    ctx.fillStyle = '#faf6ef';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(25, 27, 27, 0.25)';
    ctx.stroke();

    ctx.fillStyle = '#191b1b';
    const fontSize = isText
      ? (shortText.length >= 4 ? 19 : shortText.length === 3 ? 23 : 27)
      : (shortText.length >= 3 ? 25 : 34);
    ctx.font = `900 ${fontSize}px "Arial Black", Pretendard, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shortText, cx, 65);

    if (!isText && (shortText === '6' || shortText === '9')) {
      ctx.fillRect(cx - 10, 84, 20, 3);
    }
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export default function Lotto3DGame({ onBack }) {
  const [drawMode, setDrawMode] = useState('lotto645'); // 'lotto645' | 'customCount' | 'redBlue' | 'names'
  const [customMaxNum, setCustomMaxNum] = useState('45');
  const [customDrawCount, setCustomDrawCount] = useState('3');
  const [redCount, setRedCount] = useState('15');
  const [blueCount, setBlueCount] = useState('15');
  const [redBlueDrawCount, setRedBlueDrawCount] = useState('3');
  const [nameEntries, setNameEntries] = useState(DEFAULT_NAME_ENTRIES);
  const [nameDrawCount, setNameDrawCount] = useState('1');

  const [drawOutcome, setDrawOutcome] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'blowing' | 'completed'
  const [extractedBalls, setExtractedBalls] = useState([]);
  const [gateIsOpen, setGateIsOpen] = useState(false);
  const [blowerPower, setBlowerPower] = useState(1.2);
  const [myTicket, setMyTicket] = useState([3, 11, 19, 27, 34, 42]);
  const [history, setHistory] = useState([]);

  const mountRef = useRef(null);
  const sceneStateRef = useRef(null);

  // Build active physical ball definitions & target draw count from current mode
  const ballPoolConfig = useMemo(() => {
    if (drawMode === 'lotto645') {
      return {
        targetCount: 7,
        balls: Array.from({ length: 45 }, (_, i) => ({
          id: `num-${i + 1}`,
          num: i + 1,
          label: String(i + 1),
          color: getLottoBallColor(i + 1),
          isText: false,
          team: null,
        })),
      };
    }

    if (drawMode === 'customCount') {
      const parsedMax = parseInt(customMaxNum, 10);
      const maxN = Math.max(2, Math.min(60, Number.isFinite(parsedMax) ? parsedMax : 45));
      const parsedCnt = parseInt(customDrawCount, 10);
      const count = Math.max(1, Math.min(10, Math.min(maxN, Number.isFinite(parsedCnt) ? parsedCnt : 3)));
      return {
        targetCount: count,
        balls: Array.from({ length: maxN }, (_, i) => ({
          id: `cnum-${i + 1}`,
          num: i + 1,
          label: String(i + 1),
          color: getLottoBallColor(((i % 45) + 1)),
          isText: false,
          team: null,
        })),
      };
    }

    if (drawMode === 'redBlue') {
      const parsedR = parseInt(redCount, 10);
      const parsedB = parseInt(blueCount, 10);
      const rCnt = Math.max(0, Math.min(30, Number.isFinite(parsedR) ? parsedR : 15));
      const bCnt = Math.max(0, Math.min(30, Number.isFinite(parsedB) ? parsedB : 15));
      const list = [];
      for (let i = 0; i < rCnt; i += 1) {
        list.push({
          id: `red-${i + 1}`,
          num: i + 1,
          label: `R${i + 1}`,
          displayName: `레드 #${i + 1}`,
          color: '#dc2626',
          isText: true,
          team: 'RED',
        });
      }
      for (let i = 0; i < bCnt; i += 1) {
        list.push({
          id: `blue-${i + 1}`,
          num: rCnt + i + 1,
          label: `B${i + 1}`,
          displayName: `블루 #${i + 1}`,
          color: '#2563eb',
          isText: true,
          team: 'BLUE',
        });
      }
      if (list.length === 0) {
        list.push({ id: 'red-1', num: 1, label: 'R1', displayName: '레드 #1', color: '#dc2626', isText: true, team: 'RED' });
      }
      const count = Math.max(1, Math.min(10, Math.min(list.length, Number(redBlueDrawCount) || 1)));
      return { targetCount: count, balls: list };
    }

    // 'names' mode (supports multiple duplicate balls per person!)
    const validEntries = nameEntries
      .map((e, idx) => ({
        name: String(e.name || '').trim(),
        count: Math.max(1, Math.min(15, Number(e.count) || 1)),
        color: NAME_BALL_PALETTE[idx % NAME_BALL_PALETTE.length],
      }))
      .filter(e => e.name.length > 0);

    const list = [];
    let serial = 1;
    validEntries.forEach((entry, pIdx) => {
      for (let c = 0; c < entry.count; c += 1) {
        list.push({
          id: `name-${pIdx}-${c}-${entry.name}`,
          num: serial,
          label: entry.name,
          displayName: entry.name,
          color: entry.color,
          isText: true,
          team: null,
        });
        serial += 1;
      }
    });
    if (list.length === 0) {
      list.push({ id: 'name-empty', num: 1, label: '참가자', displayName: '참가자', color: '#d97706', isText: true, team: null });
    }
    const count = Math.max(1, Math.min(10, Math.min(list.length, Number(nameDrawCount) || 1)));
    return { targetCount: count, balls: list };
  }, [drawMode, customMaxNum, customDrawCount, redCount, blueCount, redBlueDrawCount, nameEntries, nameDrawCount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = Math.max(480, container.clientWidth || 860);
    const height = Math.max(360, container.clientHeight || 540);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x151716);
    scene.fog = new THREE.FogExp2(0x151716, 0.022);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, -0.25, 13.8);
    camera.lookAt(0, -0.45, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    } catch {
      return undefined;
    }

    // Warm Studio Lighting matching GAMEBOX Charcoal & Terracotta aesthetic
    const ambient = new THREE.AmbientLight(0xf5eadb, 1.15);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.5);
    keyLight.position.set(6, 10, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcf8050, 1.5);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0xd3a56a, 2.0, 11);
    bottomGlow.position.set(0, -2.9, 0.5);
    scene.add(bottomGlow);

    const gateGlow = new THREE.PointLight(0xfacc15, 0.4, 5.5);
    gateGlow.position.set(0, CHAMBER_RADIUS + 0.1, 0);
    scene.add(gateGlow);

    const machineGroup = new THREE.Group();
    machineGroup.position.y = 0.25;
    scene.add(machineGroup);

    // Warm Charcoal, Brushed Steel & Brass Materials
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x2a2d2b,
      metalness: 0.72,
      roughness: 0.28,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8d3c8,
      metalness: 0.88,
      roughness: 0.16,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xcf8050,
      metalness: 0.82,
      roughness: 0.22,
    });
    const gateRingMat = new THREE.MeshStandardMaterial({
      color: 0xd3a56a,
      emissive: 0x6b3f1e,
      emissiveIntensity: 0.5,
      metalness: 0.75,
      roughness: 0.2,
    });

    // 1. Warm Charcoal Studio Floor Disc & Pedestal (tapered neatly behind the front display tray)
    const floorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(7.2, 7.6, 0.18, 48),
      new THREE.MeshStandardMaterial({ color: 0x1e201f, metalness: 0.4, roughness: 0.55 })
    );
    floorDisc.position.set(0, -4.35, 0);
    machineGroup.add(floorDisc);

    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.25, 1.05, 40), baseMat);
    baseCyl.position.set(0, -3.62, -0.15);
    machineGroup.add(baseCyl);

    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.09, 16, 48), brassMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.set(0, -3.08, -0.15);
    machineGroup.add(baseRing);

    const nozzleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.85, 0.45, 24),
      chromeMat
    );
    nozzleMesh.position.set(0, -2.95, 0);
    machineGroup.add(nozzleMesh);

    // 2. Transparent Smoked Acrylic Spherical Chamber
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4eee4,
      metalness: 0.04,
      roughness: 0.07,
      transmission: 0.85,
      transparent: true,
      opacity: 0.28,
      ior: 1.45,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const chamberMesh = new THREE.Mesh(
      new THREE.SphereGeometry(CHAMBER_RADIUS, 48, 36),
      glassMat
    );
    machineGroup.add(chamberMesh);

    const equatorRing = new THREE.Mesh(
      new THREE.TorusGeometry(CHAMBER_RADIUS + 0.03, 0.04, 16, 64),
      chromeMat
    );
    equatorRing.rotation.x = Math.PI / 2;
    machineGroup.add(equatorRing);

    const meridianRing = new THREE.Mesh(
      new THREE.TorusGeometry(CHAMBER_RADIUS + 0.03, 0.035, 16, 64),
      chromeMat
    );
    machineGroup.add(meridianRing);

    // 3. Dual Counter-Rotating Mixing Paddles (L_pale1, L_pale2)
    const paddleGroup1 = new THREE.Group();
    const paddleGroup2 = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(CHAMBER_RADIUS * 1.56, 0.12, 0.22);
    const blade1 = new THREE.Mesh(bladeGeo, chromeMat);
    const blade2 = new THREE.Mesh(bladeGeo, brassMat);
    paddleGroup1.add(blade1);
    paddleGroup2.add(blade2);
    paddleGroup2.rotation.z = Math.PI / 2;
    machineGroup.add(paddleGroup1);
    machineGroup.add(paddleGroup2);

    const centerHub = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), brassMat);
    machineGroup.add(centerHub);

    // 4. Physical Top Aperture Hole, Sliding Mechanical Gate & Transparent Exit Pipe
    const apertureRim = new THREE.Mesh(
      new THREE.TorusGeometry(HOLE_RADIUS, 0.055, 16, 36),
      gateRingMat
    );
    apertureRim.rotation.x = Math.PI / 2;
    apertureRim.position.set(0, CHAMBER_RADIUS - 0.14, 0);
    machineGroup.add(apertureRim);

    // Physical Sliding Valve Gate Disc (visibly slides open/closed across the top hole!)
    const gateDiscMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(HOLE_RADIUS * 0.92, HOLE_RADIUS * 0.92, 0.09, 24),
      new THREE.MeshStandardMaterial({ color: 0x9b3826, metalness: 0.7, roughness: 0.25 })
    );
    gateDiscMesh.position.set(0, CHAMBER_RADIUS - 0.1, 0);
    machineGroup.add(gateDiscMesh);

    const outerFunnelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, HOLE_RADIUS * 0.92, 0.55, 24, 1, true),
      chromeMat
    );
    outerFunnelMesh.position.set(0, CHAMBER_RADIUS + 0.18, 0);
    machineGroup.add(outerFunnelMesh);

    // Transparent Smoked-Glass Curved Exit Pipe — rounds gently at the bottom elbow so balls roll out SIDEWAYS onto the tray!
    const chuteCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, CHAMBER_RADIUS - 0.1, 0),
      new THREE.Vector3(0, CHAMBER_RADIUS + 0.62, 0.12),
      new THREE.Vector3(2.15, CHAMBER_RADIUS + 0.6, 0.85),
      new THREE.Vector3(4.3, 1.35, 1.72),
      new THREE.Vector3(4.42, -1.95, 2.65),
      new THREE.Vector3(4.26, -3.38, 3.08),
      new THREE.Vector3(3.75, -3.69, 3.15),
      new THREE.Vector3(3.18, -3.69, 3.15),
    ]);
    const chuteGeo = new THREE.TubeGeometry(chuteCurve, 72, 0.34, 20, false);
    const chuteMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6dccb,
      transparent: true,
      opacity: 0.24,
      roughness: 0.1,
      metalness: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const chuteMesh = new THREE.Mesh(chuteGeo, chuteMat);
    machineGroup.add(chuteMesh);

    // Metallic Side-Facing Exit Collar Ring (facing LEFT horizontally along the display tray!)
    const exitCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 14, 32),
      brassMat
    );
    exitCollar.position.set(3.18, -3.69, 3.15);
    exitCollar.rotation.set(0, Math.PI / 2, 0);
    machineGroup.add(exitCollar);

    // Front Display Tray placed cleanly in front of pedestal (z = 3.15, clear of side exit mouth!)
    const trayMesh = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.24, 0.94), baseMat);
    trayMesh.position.set(0.18, -4.08, 3.15);
    machineGroup.add(trayMesh);

    const trayRingsGroup = new THREE.Group();
    machineGroup.add(trayRingsGroup);

    const ballsGroup = new THREE.Group();
    machineGroup.add(ballsGroup);

    const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 24, 20);
    const ringGeo = new THREE.TorusGeometry(0.29, 0.045, 12, 24);

    const state = {
      scene,
      camera,
      renderer,
      balls: [],
      ballsGroup,
      trayRingsGroup,
      slotPositions: [],
      paddleGroup1,
      paddleGroup2,
      gateDiscMesh,
      chuteCurve,
      bottomGlow,
      gateGlow,
      gateRingMat,
      isBlowing: false,
      blowerStrength: 1.2,
      paddleAngle: 0,
      targetDrawCount: 7,
      isLotto645Mode: true,
      // Genuine Physics Aperture Gate Control:
      gateOpen: false,
      gateOpenedAt: 0,
      nextGateOpenAt: 0,
      extractedOrder: [],
      onGateChange: null,
      onBallCaptured: null,
      onAllBallsSettled: null,
      rebuildBalls: null,
    };

    const rebuildBalls = (configs, targetCount, isLotto645) => {
      // Clear previous balls & dispose textures/materials
      state.balls.forEach((b) => {
        if (b.mesh.material?.map) b.mesh.material.map.dispose();
        if (b.mesh.material) b.mesh.material.dispose();
        ballsGroup.remove(b.mesh);
      });
      state.balls = [];

      // Clear previous tray slot rings
      while (trayRingsGroup.children.length > 0) {
        trayRingsGroup.remove(trayRingsGroup.children[0]);
      }

      const count = Math.max(1, Math.min(10, targetCount));
      state.targetDrawCount = count;
      state.isLotto645Mode = Boolean(isLotto645);
      state.extractedOrder = [];
      state.gateOpen = false;
      state.isBlowing = false;

      // Dynamically compute evenly spaced slot positions on the front display tray (clear of exit mouth at x=3.78!)
      const nextSlots = [];
      if (isLotto645 && count === 7) {
        const coords = [-2.95, -2.13, -1.31, -0.49, 0.33, 1.15, 2.25];
        coords.forEach((x) => nextSlots.push(new THREE.Vector3(x, -3.69, 3.15)));
      } else {
        const spacing = count <= 7 ? 0.84 : 0.66;
        const totalSpan = (count - 1) * spacing;
        const centerShift = -0.35;
        for (let i = 0; i < count; i += 1) {
          const x = centerShift - totalSpan / 2 + i * spacing;
          nextSlots.push(new THREE.Vector3(x, -3.69, 3.15));
        }
      }
      state.slotPositions = nextSlots;

      nextSlots.forEach((pos, idx) => {
        const ring = new THREE.Mesh(
          ringGeo,
          isLotto645 && idx === 6 ? brassMat : chromeMat
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.copy(pos).setY(-3.93);
        trayRingsGroup.add(ring);
      });

      // Spawn physical 3D balls for this mode
      const slotOrder = shuffleUnbiased(Array.from({ length: configs.length }, (_, i) => i));
      const perLayer = Math.max(8, Math.ceil(configs.length / 3));
      configs.forEach((cfg, idx) => {
        const tex = createBallTexture({ label: cfg.label, color: cfg.color, isText: cfg.isText });
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.18,
          metalness: 0.12,
        });
        const mesh = new THREE.Mesh(ballGeo, mat);

        const posIdx = slotOrder[idx];
        const layer = Math.floor(posIdx / perLayer);
        const angle = (posIdx % perLayer) * ((Math.PI * 2) / perLayer) + layer * 0.42;
        const rad = 0.55 + (posIdx % 3) * 0.62;
        const px = Math.cos(angle) * rad;
        const pz = Math.sin(angle) * rad;
        const py = -1.85 + layer * 0.58;

        mesh.position.set(px, py, pz);
        ballsGroup.add(mesh);

        state.balls.push({
          ...cfg,
          mesh,
          pos: new THREE.Vector3(px, py, pz),
          vel: new THREE.Vector3(
            (secureRandomFloat() - 0.5) * 3,
            (secureRandomFloat() - 0.5) * 3,
            (secureRandomFloat() - 0.5) * 3
          ),
          state: 'chamber', // 'chamber' | 'chute' | 'tray'
          chuteProgress: 0,
          traySlotIndex: -1,
        });
      });
    };

    state.rebuildBalls = rebuildBalls;
    sceneStateRef.current = state;

    // Initial build with default 45 balls
    rebuildBalls(
      Array.from({ length: TOTAL_BALLS }, (_, i) => ({
        id: `num-${i + 1}`,
        num: i + 1,
        label: String(i + 1),
        color: getLottoBallColor(i + 1),
        isText: false,
        team: null,
      })),
      7,
      true
    );

    let rafId = null;
    let lastTime = performance.now();
    const maxWallR = CHAMBER_RADIUS - BALL_RADIUS - 0.04;
    const minDist = BALL_RADIUS * 2;

    const stepPhysics = (dt, nowMs) => {
      const subSteps = 3;
      const subDt = Math.min(0.032, dt) / subSteps;
      const blowing = state.isBlowing;
      const power = state.blowerStrength;

      // Rotate dual mixing paddles vertically (scooping balls upward from bottom into the air-jet!)
      const paddleSpeed = blowing ? 4.2 * power : 0.45;
      state.paddleAngle += paddleSpeed * dt;
      paddleGroup1.rotation.z = state.paddleAngle;
      paddleGroup2.rotation.z = -state.paddleAngle + Math.PI / 2;
      paddleGroup1.rotation.y = 0;
      paddleGroup2.rotation.x = 0;

      // Precompute 3D unit axis vectors of the two physical rotating paddles for real ball-paddle collision
      const p1Cos = Math.cos(state.paddleAngle);
      const p1Sin = Math.sin(state.paddleAngle);
      const p2Cos = Math.cos(-state.paddleAngle + Math.PI / 2);
      const p2Sin = Math.sin(-state.paddleAngle + Math.PI / 2);
      const bladeHalfLen = CHAMBER_RADIUS * 0.78;

      bottomGlow.intensity = blowing ? 3.2 + Math.sin(state.paddleAngle * 4) * 1.0 : 1.1;

      // Open the mechanical top aperture gate only after cooldown AND after the previous ball exits the chute
      const balls = state.balls;
      const slotPositions = state.slotPositions;
      const targetCount = state.targetDrawCount;
      const hasBallInChute = balls.some(b => b.state === 'chute');
      if (
        blowing &&
        !state.gateOpen &&
        !hasBallInChute &&
        state.extractedOrder.length < targetCount &&
        nowMs >= state.nextGateOpenAt
      ) {
        state.gateOpen = true;
        state.gateOpenedAt = nowMs;
        if (state.onGateChange) state.onGateChange(true);
      }

      // Animate the physical sliding gate disc
      const targetGateX = state.gateOpen ? -1.15 : 0;
      gateDiscMesh.position.x += (targetGateX - gateDiscMesh.position.x) * Math.min(1, dt * 14);
      gateRingMat.emissive.setHex(state.gateOpen ? 0xd99b43 : 0x5c301c);
      gateRingMat.emissiveIntensity = state.gateOpen ? 1.5 : 0.45;
      gateGlow.intensity = state.gateOpen ? 3.4 : 0.5;

      for (let s = 0; s < subSteps; s += 1) {
        for (let i = 0; i < balls.length; i += 1) {
          const b = balls[i];
          if (b.state !== 'chamber') continue;

          // Gravity
          b.vel.y -= 9.8 * subDt;

          if (blowing) {
            const distXZ = Math.hypot(b.pos.x, b.pos.z) + 0.001;

            // 1. Vertical Air-Jet Fountain (pushes balls straight UP the center column without excessive sideways spin!)
            if (distXZ < 1.9) {
              const jetStrength = (1 - distXZ / 1.9) * (32.0 * power);
              b.vel.y += jetStrength * subDt;
              // Gently guide rising balls inward toward the center air column
              b.vel.x -= b.pos.x * 2.8 * subDt;
              b.vel.z -= b.pos.z * 2.8 * subDt;
            } else {
              // Outer balls fall back down and get funneled smoothly back toward bottom center nozzle
              b.vel.x -= b.pos.x * 3.8 * subDt;
              b.vel.z -= b.pos.z * 3.8 * subDt;
            }

            // Mild turbulence so balls don't lock into symmetrical paths
            b.vel.x += Math.sin(state.paddleAngle * 2.3 + i * 1.7) * 3.2 * power * subDt;
            b.vel.z += Math.cos(state.paddleAngle * 2.1 + i * 1.3) * 3.2 * power * subDt;

            // Bottom air nozzle kick
            if (b.pos.y < -1.5) {
              b.vel.y += (14.5 + (i % 5) * 2.0) * power * subDt;
              b.vel.x -= b.pos.x * 4.5 * subDt;
              b.vel.z -= b.pos.z * 4.5 * subDt;
            }

            // 2. REAL 3D PHYSICAL COLLISION WITH THE 2 ROTATING MIXING PADDLES (Bars scoop & kick balls!)
            const blades = [
              { cx: p1Cos, cy: p1Sin, omega: paddleSpeed },
              { cx: p2Cos, cy: p2Sin, omega: -paddleSpeed },
            ];
            for (let k = 0; k < 2; k += 1) {
              const bl = blades[k];
              // Only collide if ball is near the Z=0 plane where the two physical paddles sweep
              if (Math.abs(b.pos.z) < BALL_RADIUS + 0.16) {
                const proj = Math.max(-bladeHalfLen, Math.min(bladeHalfLen, b.pos.x * bl.cx + b.pos.y * bl.cy));
                const closestX = proj * bl.cx;
                const closestY = proj * bl.cy;
                const dx = b.pos.x - closestX;
                const dy = b.pos.y - closestY;
                const dist2D = Math.hypot(dx, dy);
                const hitRadius = BALL_RADIUS + 0.12;
                if (dist2D < hitRadius && dist2D > 0.0001) {
                  // Push ball out of paddle bar & impart real tangential scoop velocity!
                  const nx = dx / dist2D;
                  const ny = dy / dist2D;
                  b.pos.x += nx * (hitRadius - dist2D);
                  b.pos.y += ny * (hitRadius - dist2D);
                  // Tangential velocity of rotating bar at projection radius `proj`
                  const tangVx = -bl.cy * proj * bl.omega;
                  const tangVy = bl.cx * proj * bl.omega;
                  b.vel.x = b.vel.x * 0.4 + tangVx * 0.85 + nx * 2.2;
                  b.vel.y = b.vel.y * 0.4 + Math.abs(tangVy) * 0.9 + 2.8;
                }
              }
            }

            // 3. Organic Top Aperture Low-Pressure Air Suction when Gate is OPEN
            // Keeps natural suspense (~0.7-2.2s per ball) instead of robotic vacuum capture
            if (state.gateOpen) {
              const openElapsedSec = Math.max(0, (nowMs - (state.gateOpenedAt || nowMs)) / 1000);
              const assistBoost = openElapsedSec > 2.6 ? Math.min(1.8, (openElapsedSec - 2.6) * 0.65) : 0;
              if (b.pos.y > 1.7 - assistBoost * 0.35 && distXZ < 1.05 + assistBoost * 0.25) {
                b.vel.y += (10.5 + assistBoost * 6.5) * subDt;
                b.vel.x -= b.pos.x * (3.8 + assistBoost * 2.2) * subDt;
                b.vel.z -= b.pos.z * (3.8 + assistBoost * 2.2) * subDt;
              }
            }

            // Dampen excessive sideways velocity so balls stay energetic vertically rather than orbiting the equator
            b.vel.x *= 0.992;
            b.vel.z *= 0.992;
          } else {
            b.vel.multiplyScalar(0.98);
          }

          const speed = b.vel.length();
          const maxSpeed = blowing ? 11.4 * power : 4.2;
          if (speed > maxSpeed) {
            b.vel.multiplyScalar(maxSpeed / speed);
          }

          b.pos.addScaledVector(b.vel, subDt);

          // GENUINE PHYSICAL APERTURE CHECK:
          // If the gate is open and THIS real 3D ball physically enters the top hole opening!
          const horizR = Math.hypot(b.pos.x, b.pos.z);
          if (
            blowing &&
            state.gateOpen &&
            b.pos.y >= CHAMBER_RADIUS - 0.52 &&
            horizR <= HOLE_RADIUS
          ) {
            const slotIdx = state.extractedOrder.length;
            b.state = 'chute';
            b.chuteProgress = 0;
            b.traySlotIndex = slotIdx;
            const ballItem = {
              id: b.id,
              num: b.num,
              label: b.label,
              displayName: b.displayName || b.label,
              color: b.color,
              team: b.team,
            };
            state.extractedOrder.push(ballItem);

            state.gateOpen = false;
            // Authentic broadcast draw pacing: 2.2s cooldown between main balls, 2.9s suspense before bonus ball
            const isBeforeBonus = state.isLotto645Mode && slotIdx === 5;
            const cooldownMs = isBeforeBonus ? 2900 : 2100;
            state.nextGateOpenAt = nowMs + cooldownMs;
            if (state.onGateChange) state.onGateChange(false);

            drawSound.playBallExtract(state.isLotto645Mode && slotIdx === 6);
            if (state.onBallCaptured) {
              state.onBallCaptured(ballItem, [...state.extractedOrder]);
            }
            continue;
          }

          // Spherical Chamber Wall Collision & Restitution
          const distFromCenter = b.pos.length();
          if (distFromCenter > maxWallR) {
            const normal = b.pos.clone().divideScalar(distFromCenter || 1);
            b.pos.copy(normal).multiplyScalar(maxWallR);
            const velDot = b.vel.dot(normal);
            if (velDot > 0) {
              const restitution = blowing ? 0.88 : 0.42;
              b.vel.addScaledVector(normal, -(1 + restitution) * velDot);
            }
          }

          // Center Hub Collision
          if (distFromCenter < 0.56) {
            const normal = b.pos.clone().divideScalar(distFromCenter || 1);
            b.pos.copy(normal).multiplyScalar(0.56);
            const velDot = b.vel.dot(normal);
            if (velDot < 0) {
              b.vel.addScaledVector(normal, -1.6 * velDot);
            }
          }
        }

        // 45 x 45 Sphere-Sphere Elastic Collisions
        for (let i = 0; i < balls.length; i += 1) {
          const a = balls[i];
          if (a.state !== 'chamber') continue;
          for (let j = i + 1; j < balls.length; j += 1) {
            const b = balls[j];
            if (b.state !== 'chamber') continue;

            const dx = b.pos.x - a.pos.x;
            const dy = b.pos.y - a.pos.y;
            const dz = b.pos.z - a.pos.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < minDist * minDist && distSq > 0.00001) {
              const dist = Math.sqrt(distSq);
              const overlap = (minDist - dist) * 0.5;
              const nx = dx / dist;
              const ny = dy / dist;
              const nz = dz / dist;

              a.pos.x -= nx * overlap;
              a.pos.y -= ny * overlap;
              a.pos.z -= nz * overlap;
              b.pos.x += nx * overlap;
              b.pos.y += ny * overlap;
              b.pos.z += nz * overlap;

              const rvx = b.vel.x - a.vel.x;
              const rvy = b.vel.y - a.vel.y;
              const rvz = b.vel.z - a.vel.z;
              const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

              if (velAlongNormal < 0) {
                const restitution = blowing ? 0.86 : 0.4;
                const impulse = -(1 + restitution) * velAlongNormal * 0.5;
                a.vel.x -= impulse * nx;
                a.vel.y -= impulse * ny;
                a.vel.z -= impulse * nz;
                b.vel.x += impulse * nx;
                b.vel.y += impulse * ny;
                b.vel.z += impulse * nz;
              }
            }
          }
        }
      }

      // 3. Update Mesh Transforms & Smooth Side-Exit Chute -> Tray Progression
      let allInTray = state.extractedOrder.length === targetCount;
      for (let i = 0; i < balls.length; i += 1) {
        const b = balls[i];
        if (b.state === 'chamber') {
          b.mesh.position.copy(b.pos);
          b.mesh.rotation.x += b.vel.z * dt * 1.5;
          b.mesh.rotation.y += b.vel.x * dt * 1.5;
        } else if (b.state === 'chute') {
          allInTray = false;
          b.chuteProgress = Math.min(1, b.chuteProgress + dt * 0.85);
          const pt = chuteCurve.getPointAt(b.chuteProgress);
          b.mesh.position.copy(pt);
          b.mesh.rotation.z -= dt * 7.5;
          if (b.chuteProgress >= 1) {
            b.state = 'tray';
          }
        } else if (b.state === 'tray') {
          const targetSlot = slotPositions[b.traySlotIndex] || slotPositions[0];
          if (targetSlot) {
            b.mesh.position.lerp(targetSlot, 0.18);
          }
          b.mesh.rotation.set(0, 0, 0);
        }
      }

      if (blowing && allInTray) {
        state.isBlowing = false;
        state.gateOpen = false;
        if (state.onGateChange) state.onGateChange(false);
        if (state.onAllBallsSettled) {
          state.onAllBallsSettled([...state.extractedOrder]);
        }
      }
    };

    const animate = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      stepPhysics(dt, now);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(360, container.clientWidth || 860);
      const h = Math.max(300, container.clientHeight || 500);
      camera.aspect = w / h;
      camera.position.z = camera.aspect < 1.35 ? 14.8 : 13.0;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(handleResize)
      : null;
    if (resizeObserver) resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.blowerStrength = blowerPower;
    }
  }, [blowerPower]);

  // Sync Three.js physical balls & tray slots whenever mode or ball pool configuration changes
  useEffect(() => {
    const st = sceneStateRef.current;
    if (!st || !st.rebuildBalls) return;
    st.rebuildBalls(ballPoolConfig.balls, ballPoolConfig.targetCount, drawMode === 'lotto645');
    setDrawOutcome(null);
    setExtractedBalls([]);
    setGateIsOpen(false);
    setPhase('idle');
  }, [ballPoolConfig, drawMode]);

  const randomizeChamberBalls = () => {
    const st = sceneStateRef.current;
    if (!st) return;
    st.gateOpen = false;
    st.extractedOrder = [];
    const total = st.balls.length;
    const perLayer = Math.max(8, Math.ceil(total / 3));
    const slotOrder = shuffleUnbiased(Array.from({ length: total }, (_, i) => i));
    st.balls.forEach((b, idx) => {
      const posIdx = slotOrder[idx];
      const layer = Math.floor(posIdx / perLayer);
      const angle = (posIdx % perLayer) * ((Math.PI * 2) / perLayer) + layer * 0.42 + secureRandomFloat() * 0.25;
      const rad = 0.55 + (posIdx % 3) * 0.65;
      b.state = 'chamber';
      b.chuteProgress = 0;
      b.traySlotIndex = -1;
      b.pos.set(Math.cos(angle) * rad, -1.8 + layer * 0.6, Math.sin(angle) * rad);
      b.vel.set(
        (secureRandomFloat() - 0.5) * 9,
        3 + secureRandomFloat() * 7,
        (secureRandomFloat() - 0.5) * 9
      );
    });
  };

  const finalizeDrawOutcome = (finalOrder) => {
    const isLotto645 = drawMode === 'lotto645';
    const mainNumbers = isLotto645
      ? [...finalOrder.slice(0, 6).map(b => b.num)].sort((a, b) => a - b)
      : finalOrder.map(b => b.num);
    const bonusNumber = isLotto645 && finalOrder[6] ? finalOrder[6].num : null;
    const outcome = {
      mode: drawMode,
      extractionOrder: finalOrder,
      mainNumbers,
      bonusNumber,
    };

    setDrawOutcome(outcome);
    setExtractedBalls(finalOrder);
    setGateIsOpen(false);
    setPhase('completed');
    drawSound.playFanfare();

    const modeMeta = LOTTO_MODES.find(m => m.id === drawMode);
    setHistory(prev => [
      {
        id: `lotto-${Date.now()}`,
        time: formatDrawTime(),
        mode: drawMode,
        modeLabel: modeMeta ? modeMeta.label : drawMode,
        balls: finalOrder,
        mainNumbers,
        bonusNumber,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleStartLottoDraw = () => {
    randomizeChamberBalls();
    setDrawOutcome(null);
    setExtractedBalls([]);
    setGateIsOpen(false);
    setPhase('blowing');

    const st = sceneStateRef.current;
    if (st) {
      st.isBlowing = true;
      st.gateOpen = false;
      st.extractedOrder = [];
      // Let balls mix energetically for 2.4s before opening the gate for ball #1
      st.nextGateOpenAt = performance.now() + 2400;

      st.onGateChange = (isOpen) => {
        setGateIsOpen(isOpen);
      };

      st.onBallCaptured = (_ballItem, currentList) => {
        setExtractedBalls(currentList);
      };

      st.onAllBallsSettled = (finalOrder) => {
        st.onGateChange = null;
        st.onBallCaptured = null;
        st.onAllBallsSettled = null;
        finalizeDrawOutcome(finalOrder);
      };
    }
  };

  const handleQuickComplete = () => {
    const st = sceneStateRef.current;
    if (!st) return;
    st.isBlowing = false;
    st.gateOpen = false;
    st.onGateChange = null;
    st.onBallCaptured = null;
    st.onAllBallsSettled = null;

    const already = [...st.extractedOrder];
    const remainingBalls = st.balls.filter(b => b.state === 'chamber');
    const needed = Math.max(0, st.targetDrawCount - already.length);
    const extraObjs = shuffleUnbiased(remainingBalls).slice(0, needed);
    const extraItems = extraObjs.map(b => ({
      id: b.id,
      num: b.num,
      label: b.label,
      displayName: b.displayName || b.label,
      color: b.color,
      team: b.team,
    }));
    const finalOrder = [...already, ...extraItems];

    finalOrder.forEach((item, idx) => {
      const ballObj = st.balls.find(b => b.id === item.id);
      if (ballObj) {
        ballObj.state = 'tray';
        ballObj.traySlotIndex = idx;
      }
    });
    st.extractedOrder = finalOrder;
    finalizeDrawOutcome(finalOrder);
  };

  const handleAutoPickMyTicket = () => {
    const picked = drawUnbiasedLotto645().mainNumbers;
    setMyTicket(picked);
  };

  const toggleMyTicketNumber = (num) => {
    if (myTicket.includes(num)) {
      if (myTicket.length > 1) {
        setMyTicket(myTicket.filter(n => n !== num));
      }
    } else if (myTicket.length < 6) {
      setMyTicket([...myTicket, num].sort((a, b) => a - b));
    }
  };

  const handleUpdateNameEntry = (idx, field, value) => {
    setNameEntries(prev => prev.map((row, i) => (
      i === idx ? { ...row, [field]: field === 'count' ? Math.max(1, Math.min(15, Number(value) || 1)) : value } : row
    )));
  };

  const handleAddNameEntry = () => {
    setNameEntries(prev => [...prev, { id: `n-${Date.now()}`, name: '', count: 1 }]);
  };

  const handleRemoveNameEntry = (idx) => {
    setNameEntries(prev => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length > 0 ? next : [{ id: `n-${Date.now()}`, name: '', count: 1 }];
    });
  };

  const totalBallCount = ballPoolConfig.balls.length;
  const targetCount = ballPoolConfig.targetCount;
  const isLotto645 = drawMode === 'lotto645';

  const visibleMainBalls = isLotto645 ? extractedBalls.slice(0, 6) : extractedBalls;
  const visibleBonusBall = isLotto645 && extractedBalls.length >= 7 ? extractedBalls[6] : null;

  const ticketCheckResult = useMemo(() => {
    if (!isLotto645 || phase !== 'completed' || !drawOutcome || myTicket.length !== 6) return null;
    return checkLottoTicketRank(drawOutcome.mainNumbers, drawOutcome.bonusNumber, myTicket);
  }, [isLotto645, phase, drawOutcome, myTicket]);

  const redBlueSummary = useMemo(() => {
    if (drawMode !== 'redBlue' || extractedBalls.length === 0) return null;
    const redHits = extractedBalls.filter(b => b.team === 'RED').length;
    const blueHits = extractedBalls.filter(b => b.team === 'BLUE').length;
    return { redHits, blueHits };
  }, [drawMode, extractedBalls]);

  return (
    <div className="rpz-game-shell" data-testid="game-lotto-3d">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← 추첨 게임 목록
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 02 · GENUINE 3D PHYSICS APERTURE LOTTERY</span>
            <h2>🎱 3D 물리 추첨기 — {LOTTO_MODES.find(m => m.id === drawMode)?.label}</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          {phase === 'idle' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="lotto-start-btn"
              onClick={handleStartLottoDraw}
              disabled={totalBallCount < 1}
            >
              🌪️ 송풍 가동 및 물리 추첨 시작
            </button>
          )}
          {phase === 'blowing' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="lotto-instant-btn"
              onClick={handleQuickComplete}
            >
              ⚡ 남은 공 즉시 완료 ({extractedBalls.length}/{targetCount})
            </button>
          )}
          {phase === 'completed' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="lotto-reroll-btn"
              onClick={handleStartLottoDraw}
            >
              🔄 새 회차 3D 재추첨
            </button>
          )}
        </div>
      </header>

      <div className="rpz-game-workspace">
        <section className="rpz-stage-panel">
          <div className="rpz-stage-status-bar">
            <span className={`rpz-phase-pill phase-${phase}`} data-testid="lotto-phase-badge">
              {phase === 'idle' && `투명 3D 추첨실 대기 중 — 총 ${totalBallCount}구 중 ${targetCount}구를 실제 3D 물리 충돌로 배출합니다`}
              {phase === 'blowing' && (
                gateIsOpen
                  ? `🔓 상단 배출 구멍 OPEN — 충돌 후 구멍에 먼저 진입하는 공이 실제 배출됩니다! (${extractedBalls.length}/${targetCount}구)`
                  : `🔒 게이트 닫힘 · ${totalBallCount}구 에어제트 교반 중 (${extractedBalls.length}/${targetCount}구 배출 완료)`
              )}
              {phase === 'completed' && drawOutcome && (
                isLotto645
                  ? `🎉 물리 추첨 완료! 당첨 번호: ${drawOutcome.mainNumbers.join(', ')} + 보너스 ${drawOutcome.bonusNumber}`
                  : `🎉 물리 추첨 완료! 결과 (${targetCount}구): ${drawOutcome.extractionOrder.map(b => b.displayName || b.label).join(', ')}`
              )}
            </span>

            <div className="rpz-mode-badges">
              <span className="rpz-chip active">추첨실 잔여 {Math.max(0, totalBallCount - extractedBalls.length)}구</span>
              <span className={`rpz-chip ${gateIsOpen ? 'active' : ''}`}>
                {gateIsOpen ? '🔓 상단 밸브 열림' : '🔒 상단 밸브 닫힘'}
              </span>
            </div>
          </div>

          <div className="rpz-lotto-3d-viewport-wrap">
            <div
              ref={mountRef}
              className="rpz-lotto-3d-mount"
              data-testid="lotto-3d-canvas-container"
            />
          </div>

          <div className="rpz-lotto-bottom-bar" data-testid="lotto-ball-rack">
            {isLotto645 ? (
              <>
                <div className="rpz-rack-group">
                  <span className="rpz-rack-label">당첨 번호 (6구)</span>
                  <div className="rpz-rack-slots">
                    {Array.from({ length: 6 }, (_, idx) => {
                      const num = phase === 'completed' && drawOutcome
                        ? drawOutcome.mainNumbers[idx]
                        : visibleMainBalls[idx]?.num;
                      return (
                        <div
                          key={idx}
                          className={`rpz-lotto-slot ${num ? 'filled' : 'empty'}`}
                          data-testid={`lotto-main-ball-${idx}`}
                          style={num ? { background: getLottoBallColor(num) } : undefined}
                        >
                          {num || '?'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <span className="rpz-rack-plus">+</span>

                <div className="rpz-rack-group">
                  <span className="rpz-rack-label">보너스</span>
                  <div
                    className={`rpz-lotto-slot bonus ${visibleBonusBall ? 'filled' : 'empty'}`}
                    data-testid="lotto-bonus-ball"
                    style={visibleBonusBall ? { background: getLottoBallColor(visibleBonusBall.num) } : undefined}
                  >
                    {visibleBonusBall ? visibleBonusBall.num : 'B'}
                  </div>
                </div>

                {phase === 'completed' && drawOutcome && ticketCheckResult && (
                  <div className="rpz-lotto-inline-result" data-testid="lotto-result-panel">
                    <span data-testid="lotto-ticket-check">
                      내 번호 [{myTicket.join(', ')}] → <strong>{ticketCheckResult.label}</strong>
                      {' '}(일치: {ticketCheckResult.matchedMain.length > 0 ? ticketCheckResult.matchedMain.join(', ') : '없음'}
                      {ticketCheckResult.bonusMatched ? ` + 보너스 ${drawOutcome.bonusNumber}` : ''})
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="rpz-rack-group">
                  <span className="rpz-rack-label">
                    추첨 결과 ({extractedBalls.length}/{targetCount}구)
                  </span>
                  <div className="rpz-rack-slots">
                    {Array.from({ length: targetCount }, (_, idx) => {
                      const item = visibleMainBalls[idx];
                      const isTextPill = drawMode === 'names' || drawMode === 'redBlue';
                      return (
                        <div
                          key={idx}
                          className={`rpz-lotto-slot ${isTextPill ? 'is-pill' : ''} ${item ? 'filled' : 'empty'}`}
                          data-testid={`lotto-main-ball-${idx}`}
                          style={item ? { background: item.color } : undefined}
                        >
                          {item ? (drawMode === 'redBlue' ? item.displayName : item.label) : idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {redBlueSummary && (
                  <div className="rpz-lotto-inline-result">
                    <span>
                      🔴 레드 <strong>{redBlueSummary.redHits}</strong>구 vs 🔵 블루 <strong>{redBlueSummary.blueHits}</strong>구
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 추첨 모드 선택</h3>
            <div className="rpz-mode-grid-2x2">
              {LOTTO_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-testid={`lotto-mode-${m.id}`}
                  className={`rpz-preset-btn ${drawMode === m.id ? 'active' : ''}`}
                  disabled={phase === 'blowing'}
                  onClick={() => setDrawMode(m.id)}
                >
                  <div>{m.label}</div>
                </button>
              ))}
            </div>

            {drawMode === 'customCount' && (
              <div className="rpz-mode-config-box">
                <div className="rpz-row-2col">
                  <label className="rpz-field">
                    <span>전체 번호 (1~N)</span>
                    <input
                      type="number"
                      className="rpz-input"
                      min={2}
                      max={60}
                      value={customMaxNum}
                      disabled={phase === 'blowing'}
                      onChange={e => setCustomMaxNum(e.target.value)}
                      onBlur={() => {
                        const v = parseInt(customMaxNum, 10);
                        setCustomMaxNum(String(Math.max(2, Math.min(60, Number.isFinite(v) ? v : 45))));
                      }}
                    />
                  </label>
                  <label className="rpz-field">
                    <span>뽑을 개수 (1~10)</span>
                    <input
                      type="number"
                      className="rpz-input"
                      min={1}
                      max={10}
                      value={customDrawCount}
                      disabled={phase === 'blowing'}
                      onChange={e => setCustomDrawCount(e.target.value)}
                      onBlur={() => {
                        const v = parseInt(customDrawCount, 10);
                        setCustomDrawCount(String(Math.max(1, Math.min(10, Number.isFinite(v) ? v : 1))));
                      }}
                    />
                  </label>
                </div>
                <div className="rpz-preset-row">
                  {[1, 2, 3, 5, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`rpz-btn-xs ${Number(customDrawCount) === n ? 'active' : ''}`}
                      disabled={phase === 'blowing'}
                      onClick={() => setCustomDrawCount(String(n))}
                    >
                      {n}개 뽑기
                    </button>
                  ))}
                </div>
              </div>
            )}

            {drawMode === 'redBlue' && (
              <div className="rpz-mode-config-box">
                <div className="rpz-row-2col">
                  <label className="rpz-field">
                    <span>🔴 빨간 공 개수</span>
                    <input
                      type="number"
                      className="rpz-input"
                      min={0}
                      max={30}
                      value={redCount}
                      disabled={phase === 'blowing'}
                      onChange={e => setRedCount(e.target.value)}
                      onBlur={() => {
                        const v = parseInt(redCount, 10);
                        setRedCount(String(Math.max(0, Math.min(30, Number.isFinite(v) ? v : 15))));
                      }}
                    />
                  </label>
                  <label className="rpz-field">
                    <span>🔵 파란 공 개수</span>
                    <input
                      type="number"
                      className="rpz-input"
                      min={0}
                      max={30}
                      value={blueCount}
                      disabled={phase === 'blowing'}
                      onChange={e => setBlueCount(e.target.value)}
                      onBlur={() => {
                        const v = parseInt(blueCount, 10);
                        setBlueCount(String(Math.max(0, Math.min(30, Number.isFinite(v) ? v : 15))));
                      }}
                    />
                  </label>
                </div>
                <label className="rpz-field">
                  <span>뽑을 개수 (1~10개)</span>
                  <input
                    type="number"
                    className="rpz-input"
                    min={1}
                    max={10}
                    value={redBlueDrawCount}
                    disabled={phase === 'blowing'}
                    onChange={e => setRedBlueDrawCount(e.target.value)}
                    onBlur={() => {
                      const v = parseInt(redBlueDrawCount, 10);
                      setRedBlueDrawCount(String(Math.max(1, Math.min(10, Number.isFinite(v) ? v : 1))));
                    }}
                  />
                </label>
              </div>
            )}

            {drawMode === 'names' && (
              <div className="rpz-mode-config-box">
                <label className="rpz-field">
                  <span>뽑을 개수 (1~10개 · 총 투입 {totalBallCount}구)</span>
                  <input
                    type="number"
                    className="rpz-input"
                    min={1}
                    max={10}
                    value={nameDrawCount}
                    disabled={phase === 'blowing'}
                    onChange={e => setNameDrawCount(e.target.value)}
                    onBlur={() => {
                      const v = parseInt(nameDrawCount, 10);
                      setNameDrawCount(String(Math.max(1, Math.min(10, Number.isFinite(v) ? v : 1))));
                    }}
                  />
                </label>
                <div className="rpz-item-editor-list">
                  {nameEntries.map((entry, idx) => (
                    <div key={entry.id} className="rpz-item-row">
                      <span
                        className="rpz-color-dot"
                        style={{ background: NAME_BALL_PALETTE[idx % NAME_BALL_PALETTE.length] }}
                      />
                      <input
                        type="text"
                        className="rpz-input"
                        value={entry.name}
                        disabled={phase === 'blowing'}
                        placeholder="참가자 이름"
                        onChange={e => handleUpdateNameEntry(idx, 'name', e.target.value)}
                      />
                      <input
                        type="number"
                        className="rpz-input rpz-count-input"
                        min={1}
                        max={15}
                        title="투입할 공 개수 (중복 허용)"
                        value={entry.count}
                        disabled={phase === 'blowing'}
                        onChange={e => handleUpdateNameEntry(idx, 'count', e.target.value)}
                      />
                      <button
                        type="button"
                        className="rpz-item-remove-btn"
                        disabled={phase === 'blowing'}
                        onClick={() => handleRemoveNameEntry(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="rpz-add-row-btn"
                  disabled={phase === 'blowing'}
                  onClick={handleAddNameEntry}
                >
                  + 참가자 공 추가 (이름별 중복 개수 설정)
                </button>
              </div>
            )}
          </div>

          <div className="rpz-card">
            <h3>2. 3D 에어제트 송풍기 출력</h3>
            <label className="rpz-field">
              <span>에어제트 상승 풍압 ({Math.round(blowerPower * 100)}%)</span>
              <input
                type="range"
                min="0.9"
                max="1.6"
                step="0.05"
                value={blowerPower}
                onChange={e => setBlowerPower(Number(e.target.value))}
              />
            </label>
          </div>

          {isLotto645 && (
            <div className="rpz-card">
              <div className="rpz-card-head-between">
                <h3>3. 내 로또 번호 선택 ({myTicket.length}/6)</h3>
                <button
                  type="button"
                  className="rpz-btn-xs"
                  onClick={handleAutoPickMyTicket}
                >
                  🎲 자동 선택
                </button>
              </div>
              <div className="rpz-lotto-number-grid">
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
                  const selected = myTicket.includes(num);
                  const isDrawnMain = phase === 'completed' && drawOutcome?.mainNumbers.includes(num);
                  const isDrawnBonus = phase === 'completed' && drawOutcome?.bonusNumber === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      className={`rpz-num-cell ${selected ? 'selected' : ''} ${isDrawnMain ? 'hit-main' : ''} ${isDrawnBonus ? 'hit-bonus' : ''}`}
                      onClick={() => toggleMyTicketNumber(num)}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rpz-card">
            <h3>{isLotto645 ? '4.' : '3.'} 회차별 추첨 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 3D 추첨 기록이 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="lotto-history-list">
                {history.map((item, idx) => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>제 {history.length - idx}회 · {item.modeLabel}</strong>
                      <small>{item.time}</small>
                    </div>
                    <div className="rpz-mini-ball-row">
                      {item.mode === 'lotto645' ? (
                        <>
                          {item.mainNumbers.map(n => (
                            <span
                              key={n}
                              className="rpz-mini-ball"
                              style={{ background: getLottoBallColor(n) }}
                            >
                              {n}
                            </span>
                          ))}
                          <span className="rpz-mini-plus">+</span>
                          <span
                            className="rpz-mini-ball bonus"
                            style={{ background: getLottoBallColor(item.bonusNumber) }}
                          >
                            {item.bonusNumber}
                          </span>
                        </>
                      ) : (
                        item.balls.map((b, bIdx) => (
                          <span
                            key={`${b.id}-${bIdx}`}
                            className="rpz-mini-ball is-pill"
                            style={{ background: b.color }}
                          >
                            {b.label}
                          </span>
                        ))
                      )}
                    </div>
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
