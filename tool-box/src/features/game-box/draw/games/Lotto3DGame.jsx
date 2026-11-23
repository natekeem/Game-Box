import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { shuffleUnbiased, formatDrawTime } from '../shared/randomEngine.js';
import { drawSound } from '../shared/soundEngine.js';

/**
 * LOTTO 6/45 — 실제 3D 물리 추첨기 미니게임
 *
 * Open-source provenance:
 * - 3D Lottery Machine Architecture & Ball Texture Atlas Technique adapted from
 *   `steller102/3d-lottery` (`public/three/million.js`, MIT License, Copyright (c) 2025 Steller).
 * - Lotto 6/45 Color Ranges & Ticket Rank Checker adapted from
 *   `Tae-sung-Kim/pickle-eight` (`src/features/lotto/utils/lotto.util.ts`, MIT License, Copyright (c) 2025 Tae-sung Kim).
 *
 * Continuous 3D Air-Jet Physics & Top Suction Extraction:
 * - No teleportation or separate fake ball animation:
 *   All 45 numbered 3D balls (1..45) live inside the transparent spherical chamber.
 * - When the air-jet blower starts, upward air streams + dual counter-rotating paddles lift and circulate
 *   the balls all the way to the top dome of the chamber.
 * - When the top extraction valve opens (`suctionActive`), balls near the central air column are physically
 *   pulled upward into the top suction funnel (`y = +3.25`), enter the transparent curved exit tube,
 *   roll down the tube, and settle onto the 3D front display rack slots (1..6 + Bonus).
 */

const TOTAL_BALLS = 45;
const CHAMBER_RADIUS = 3.1;
const BALL_RADIUS = 0.27;

export function getLottoBallColor(num) {
  if (num <= 10) return '#eab308'; // 1~10 Yellow
  if (num <= 20) return '#3b82f6'; // 11~20 Blue
  if (num <= 30) return '#ef4444'; // 21~30 Red
  if (num <= 40) return '#64748b'; // 31~40 Slate Gray
  return '#22c55e';                // 41~45 Green
}

export function drawUnbiasedLotto645() {
  const pool = Array.from({ length: TOTAL_BALLS }, (_, i) => i + 1);
  const shuffled = shuffleUnbiased(pool);
  const extractionOrder = shuffled.slice(0, 7);
  const mainNumbers = [...extractionOrder.slice(0, 6)].sort((a, b) => a - b);
  const bonusNumber = extractionOrder[6];
  return {
    extractionOrder,
    mainNumbers,
    bonusNumber,
  };
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

  return {
    rank,
    label,
    matchedMain,
    bonusMatched,
  };
}

function createNumberedBallTexture(num) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const baseColor = getLottoBallColor(num);

  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, baseColor);
  grad.addColorStop(0.55, baseColor);
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(0, 52, 256, 24);

  [64, 192].forEach((cx) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, 64, 34, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 34px "Arial Black", Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(num), cx, 65);

    if (num === 6 || num === 9) {
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
  const [drawOutcome, setDrawOutcome] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'blowing' | 'completed'
  const [extractedBalls, setExtractedBalls] = useState([]);
  const [currentlyRisingBall, setCurrentlyRisingBall] = useState(null);
  const [blowerPower, setBlowerPower] = useState(1.15);
  const [myTicket, setMyTicket] = useState([3, 11, 19, 27, 34, 42]);
  const [history, setHistory] = useState([]);

  const mountRef = useRef(null);
  const sceneStateRef = useRef(null);

  // Build Three.js 3D Lottery Machine & 45 Rigid-Body Physics Balls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = Math.max(480, container.clientWidth || 860);
    const height = Math.max(360, container.clientHeight || 540);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b12);
    scene.fog = new THREE.FogExp2(0x070b12, 0.025);

    // Camera framed so the entire machine (top suction pipe y=+3.8 down to pedestal & display tray y=-4.4)
    // fits comfortably without any bottom clipping
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, -0.35, 13.2);
    camera.lookAt(0, -0.45, 0);

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

    // Lights
    const ambient = new THREE.AmbientLight(0xe0f2fe, 1.25);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 10, 9);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.7);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x0ea5e9, 2.4, 12);
    bottomGlow.position.set(0, -2.9, 0.5);
    scene.add(bottomGlow);

    const suctionGlow = new THREE.PointLight(0xfacc15, 0.5, 6);
    suctionGlow.position.set(0, CHAMBER_RADIUS + 0.2, 0);
    scene.add(suctionGlow);

    const machineGroup = new THREE.Group();
    // Shift slightly up so pedestal + front tray have generous breathing room at the bottom
    machineGroup.position.y = 0.25;
    scene.add(machineGroup);

    // Materials
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.82,
      roughness: 0.24,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.92,
      roughness: 0.12,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.86,
      roughness: 0.18,
    });
    const suctionRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2,
    });

    // 1. Studio Floor Disc & Base Pedestal
    const floorDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(6.8, 7.2, 0.18, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.4 })
    );
    floorDisc.position.set(0, -4.35, 0);
    machineGroup.add(floorDisc);

    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.65, 1.05, 40), baseMat);
    baseCyl.position.set(0, -3.62, 0);
    machineGroup.add(baseCyl);

    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.09, 16, 48), goldMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.set(0, -3.08, 0);
    machineGroup.add(baseRing);

    // Internal Air-Jet Nozzle Cone at bottom of sphere
    const nozzleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.9, 0.45, 24),
      chromeMat
    );
    nozzleMesh.position.set(0, -2.95, 0);
    machineGroup.add(nozzleMesh);

    // 2. Transparent Spherical Mixing Chamber
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      metalness: 0.04,
      roughness: 0.07,
      transmission: 0.84,
      transparent: true,
      opacity: 0.3,
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

    // Equator & Meridian Chrome Structural Rings
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
    const bladeGeo = new THREE.BoxGeometry(CHAMBER_RADIUS * 1.58, 0.11, 0.2);
    const blade1 = new THREE.Mesh(bladeGeo, chromeMat);
    const blade2 = new THREE.Mesh(bladeGeo, goldMat);
    paddleGroup1.add(blade1);
    paddleGroup2.add(blade2);
    paddleGroup2.rotation.z = Math.PI / 2;
    machineGroup.add(paddleGroup1);
    machineGroup.add(paddleGroup2);

    const centerHub = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), goldMat);
    machineGroup.add(centerHub);

    // 4. Top Suction Intake Funnel & Inner Vertical Guide Tube
    // Inner suction mouth inside top of sphere (y = +2.55 to +3.15) so user sees balls get sucked in!
    const innerSuctionTube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.58, 0.65, 24, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.38,
        roughness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    innerSuctionTube.position.set(0, CHAMBER_RADIUS - 0.22, 0);
    machineGroup.add(innerSuctionTube);

    const suctionLipRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.045, 14, 32),
      suctionRingMat
    );
    suctionLipRing.rotation.x = Math.PI / 2;
    suctionLipRing.position.set(0, CHAMBER_RADIUS - 0.54, 0);
    machineGroup.add(suctionLipRing);

    const outerFunnelMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.45, 24, 1, true),
      chromeMat
    );
    outerFunnelMesh.position.set(0, CHAMBER_RADIUS + 0.22, 0);
    machineGroup.add(outerFunnelMesh);

    // Curved exit tube path: starts right at the top suction mouth (0, CHAMBER_RADIUS - 0.3, 0),
    // rises out of the top valve (0, CHAMBER_RADIUS + 0.45, 0), arches right and down to the front display tray!
    const chuteCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, CHAMBER_RADIUS - 0.3, 0),
      new THREE.Vector3(0, CHAMBER_RADIUS + 0.48, 0.05),
      new THREE.Vector3(1.75, CHAMBER_RADIUS + 0.55, 0.55),
      new THREE.Vector3(3.85, 1.35, 1.15),
      new THREE.Vector3(3.65, -1.75, 1.65),
      new THREE.Vector3(2.85, -3.65, 2.05),
    ]);
    const chuteGeo = new THREE.TubeGeometry(chuteCurve, 56, 0.35, 18, false);
    const chuteMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const chuteMesh = new THREE.Mesh(chuteGeo, chuteMat);
    machineGroup.add(chuteMesh);

    // Front Display Tray for 6 Winning Balls + 1 Bonus Ball
    const trayMesh = new THREE.Mesh(
      new THREE.BoxGeometry(6.6, 0.22, 0.86),
      baseMat
    );
    trayMesh.position.set(0, -4.02, 2.05);
    machineGroup.add(trayMesh);

    const slotPositions = [
      new THREE.Vector3(-2.6, -3.68, 2.05),
      new THREE.Vector3(-1.76, -3.68, 2.05),
      new THREE.Vector3(-0.92, -3.68, 2.05),
      new THREE.Vector3(-0.08, -3.68, 2.05),
      new THREE.Vector3(0.76, -3.68, 2.05),
      new THREE.Vector3(1.6, -3.68, 2.05),
      new THREE.Vector3(2.65, -3.68, 2.05), // 7th Bonus Slot
    ];

    slotPositions.forEach((pos, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.29, 0.04, 12, 24),
        idx === 6 ? goldMat : chromeMat
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(pos).setY(-3.88);
      machineGroup.add(ring);
    });

    // 5. Create 45 Physical 3D Numbered Balls (1..45)
    const ballGeo = new THREE.SphereGeometry(BALL_RADIUS, 24, 20);
    const balls = [];

    for (let i = 0; i < TOTAL_BALLS; i += 1) {
      const num = i + 1;
      const tex = createNumberedBallTexture(num);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.18,
        metalness: 0.12,
      });
      const mesh = new THREE.Mesh(ballGeo, mat);

      const layer = Math.floor(i / 15);
      const angle = (i % 15) * ((Math.PI * 2) / 15) + layer * 0.4;
      const rad = 0.65 + (i % 3) * 0.62;
      const px = Math.cos(angle) * rad;
      const pz = Math.sin(angle) * rad;
      const py = -1.85 + layer * 0.58;

      mesh.position.set(px, py, pz);
      machineGroup.add(mesh);

      balls.push({
        num,
        mesh,
        pos: new THREE.Vector3(px, py, pz),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        // Ball lifecycle states:
        // 'chamber': bouncing & mixing freely in 3D sphere
        // 'rising': caught by central air-jet suction column, physically rising from its current position into the top intake mouth
        // 'chute': travelling continuously from the top intake mouth through the curved tube
        // 'tray': settled on its display rack slot
        state: 'chamber',
        chuteProgress: 0,
        traySlotIndex: -1,
      });
    }

    const state = {
      scene,
      camera,
      renderer,
      balls,
      paddleGroup1,
      paddleGroup2,
      chuteCurve,
      slotPositions,
      bottomGlow,
      suctionGlow,
      suctionRingMat,
      isBlowing: false,
      blowerStrength: 1.15,
      paddleAngle: 0,
      // Queue of target balls to physically rise & be sucked into the top intake
      extractionQueue: [],
      activeRisingBall: null,
      nextSuctionTimestamp: 0,
      extractedOrder: [],
      onBallEnteredChute: null,
      onAllBallsSettled: null,
    };
    sceneStateRef.current = state;

    let rafId = null;
    let lastTime = performance.now();
    const maxWallR = CHAMBER_RADIUS - BALL_RADIUS - 0.05;
    const minDist = BALL_RADIUS * 2;
    const suctionMouthPos = new THREE.Vector3(0, CHAMBER_RADIUS - 0.3, 0);

    const stepPhysics = (dt, nowMs) => {
      const subSteps = 3;
      const subDt = Math.min(0.032, dt) / subSteps;
      const blowing = state.isBlowing;
      const power = state.blowerStrength;

      // Rotate mixing paddles
      const paddleSpeed = blowing ? 5.6 * power : 0.65;
      state.paddleAngle += paddleSpeed * dt;
      paddleGroup1.rotation.z = state.paddleAngle;
      paddleGroup2.rotation.z = -state.paddleAngle + Math.PI / 2;
      paddleGroup1.rotation.y = Math.sin(state.paddleAngle * 0.5) * 0.38;
      paddleGroup2.rotation.x = Math.cos(state.paddleAngle * 0.5) * 0.38;

      bottomGlow.intensity = blowing ? 3.5 + Math.sin(state.paddleAngle * 4) * 1.2 : 1.2;

      // Check if it's time to engage top suction on the next ball in queue
      if (blowing && !state.activeRisingBall && state.extractionQueue.length > 0 && nowMs >= state.nextSuctionTimestamp) {
        const nextSpec = state.extractionQueue.shift();
        const targetBall = balls.find(b => b.num === nextSpec.ballNum && b.state === 'chamber');
        if (targetBall) {
          targetBall.state = 'rising';
          targetBall.traySlotIndex = nextSpec.slotIdx;
          state.activeRisingBall = targetBall;
          suctionRingMat.emissive.setHex(0xfacc15);
          suctionRingMat.emissiveIntensity = 1.6;
          suctionGlow.intensity = 3.5;
          if (state.onBallRising) state.onBallRising(targetBall.num);
        }
      }

      for (let s = 0; s < subSteps; s += 1) {
        for (let i = 0; i < balls.length; i += 1) {
          const b = balls[i];

          if (b.state === 'rising') {
            // Physically propel this ball from its ACTUAL current 3D position in the chamber
            // straight up the central air-jet suction column into the top funnel mouth!
            const toMouth = suctionMouthPos.clone().sub(b.pos);
            const distToMouth = toMouth.length();

            if (distToMouth < 0.24) {
              // Smoothly hand off right into the top of the exit chute tube (chuteProgress = 0)
              b.pos.copy(suctionMouthPos);
              b.state = 'chute';
              b.chuteProgress = 0;
              state.activeRisingBall = null;
              state.nextSuctionTimestamp = nowMs + 520; // Next ball starts rising shortly after
              suctionRingMat.emissive.setHex(0x0284c7);
              suctionRingMat.emissiveIntensity = 0.7;
              suctionGlow.intensity = 1.0;

              drawSound.playBallExtract(b.traySlotIndex === 6);
              if (state.onBallEnteredChute) {
                state.onBallEnteredChute(b.num, b.traySlotIndex);
              }
            } else {
              // Strong upward suction stream + radial centering toward (x=0, z=0)
              const dir = toMouth.normalize();
              const pullSpeed = 7.8;
              b.vel.lerp(dir.multiplyScalar(pullSpeed), 0.22);
              // Pull horizontally toward the center suction axis
              b.pos.x *= 0.94;
              b.pos.z *= 0.94;
              b.pos.addScaledVector(b.vel, subDt);
            }
            continue;
          }

          if (b.state === 'chamber') {
            // Gravity
            b.vel.y -= 9.8 * subDt;

            if (blowing) {
              // Full-chamber turbulent air-jet circulation so balls energetically bounce all the way to the top dome!
              const distXZ = Math.hypot(b.pos.x, b.pos.z) + 0.001;

              // Central upward air jet column reaching from bottom (-3.0) to top (+2.8)
              if (distXZ < 1.95) {
                const jetFactor = (1 - distXZ / 1.95) * (21.5 * power);
                b.vel.y += jetFactor * subDt;
              }

              // Outer circulation downdraft/swirl so balls cycle around the full sphere
              b.vel.x += (-b.pos.z * 4.2 + Math.sin(state.paddleAngle * 1.7 + i) * 6.5) * power * subDt;
              b.vel.z += (b.pos.x * 4.2 + Math.cos(state.paddleAngle * 1.4 + i) * 6.5) * power * subDt;
              b.vel.y += Math.sin(state.paddleAngle * 2.3 + i * 0.9) * 7.8 * power * subDt;

              // Floor bounce kick so balls never sit stagnant at the bottom during blowing
              if (b.pos.y < -1.8) {
                b.vel.y += (8.5 + (i % 5) * 1.8) * power * subDt;
              }
            } else {
              b.vel.multiplyScalar(0.982);
            }

            const speed = b.vel.length();
            const maxSpeed = blowing ? 11.5 * power : 4.5;
            if (speed > maxSpeed) {
              b.vel.multiplyScalar(maxSpeed / speed);
            }

            b.pos.addScaledVector(b.vel, subDt);

            // Spherical Chamber Wall Restitution
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
        }

        // Sphere-Sphere Elastic Collision Resolution (including rising ball knocking others aside)
        for (let i = 0; i < balls.length; i += 1) {
          const a = balls[i];
          if (a.state !== 'chamber' && a.state !== 'rising') continue;
          for (let j = i + 1; j < balls.length; j += 1) {
            const b = balls[j];
            if (b.state !== 'chamber' && b.state !== 'rising') continue;

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

              if (a.state === 'chamber') {
                a.pos.x -= nx * overlap;
                a.pos.y -= ny * overlap;
                a.pos.z -= nz * overlap;
              }
              if (b.state === 'chamber') {
                b.pos.x += nx * overlap;
                b.pos.y += ny * overlap;
                b.pos.z += nz * overlap;
              }

              const rvx = b.vel.x - a.vel.x;
              const rvy = b.vel.y - a.vel.y;
              const rvz = b.vel.z - a.vel.z;
              const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

              if (velAlongNormal < 0) {
                const restitution = blowing ? 0.85 : 0.4;
                const impulse = -(1 + restitution) * velAlongNormal * 0.5;
                if (a.state === 'chamber') {
                  a.vel.x -= impulse * nx;
                  a.vel.y -= impulse * ny;
                  a.vel.z -= impulse * nz;
                }
                if (b.state === 'chamber') {
                  b.vel.x += impulse * nx;
                  b.vel.y += impulse * ny;
                  b.vel.z += impulse * nz;
                }
              }
            }
          }
        }
      }

      // 3. Update Mesh Transforms & Chute -> Tray Progression
      let all7InTray = state.extractedOrder.length === 7;
      for (let i = 0; i < balls.length; i += 1) {
        const b = balls[i];
        if (b.state === 'chamber' || b.state === 'rising') {
          b.mesh.position.copy(b.pos);
          b.mesh.rotation.x += b.vel.z * dt * 1.5;
          b.mesh.rotation.y += b.vel.x * dt * 1.5;
        } else if (b.state === 'chute') {
          all7InTray = false;
          b.chuteProgress = Math.min(1, b.chuteProgress + dt * 1.35);
          const pt = chuteCurve.getPointAt(b.chuteProgress);
          b.mesh.position.copy(pt);
          b.mesh.rotation.z -= dt * 9;
          if (b.chuteProgress >= 1) {
            b.state = 'tray';
          }
        } else if (b.state === 'tray') {
          const targetSlot = slotPositions[b.traySlotIndex] || slotPositions[0];
          b.mesh.position.lerp(targetSlot, 0.2);
          b.mesh.rotation.set(0, 0, 0);
        }
      }

      if (blowing && all7InTray && state.extractionQueue.length === 0 && !state.activeRisingBall) {
        state.isBlowing = false;
        if (state.onAllBallsSettled) {
          state.onAllBallsSettled();
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
      // Dynamically adjust camera distance if aspect ratio is narrow so bottom never clips
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

  const resetBallsToChamber = () => {
    const st = sceneStateRef.current;
    if (!st) return;
    st.extractionQueue = [];
    st.activeRisingBall = null;
    st.extractedOrder = [];
    st.balls.forEach((b, i) => {
      const layer = Math.floor(i / 15);
      const angle = (i % 15) * ((Math.PI * 2) / 15) + layer * 0.4;
      const rad = 0.65 + (i % 3) * 0.62;
      b.state = 'chamber';
      b.chuteProgress = 0;
      b.traySlotIndex = -1;
      b.pos.set(Math.cos(angle) * rad, -1.8 + layer * 0.58, Math.sin(angle) * rad);
      b.vel.set((Math.random() - 0.5) * 6, 3 + Math.random() * 6, (Math.random() - 0.5) * 6);
    });
  };

  const finalizeDrawSession = (lockedOutcome) => {
    const st = sceneStateRef.current;
    if (st) {
      st.isBlowing = false;
      st.extractionQueue = [];
      st.activeRisingBall = null;
      st.onBallEnteredChute = null;
      st.onAllBallsSettled = null;
      st.onBallRising = null;
      lockedOutcome.extractionOrder.forEach((ballNum, idx) => {
        const ballObj = st.balls.find(b => b.num === ballNum);
        if (ballObj) {
          ballObj.state = 'tray';
          ballObj.traySlotIndex = idx;
        }
      });
    }
    setCurrentlyRisingBall(null);
    setExtractedBalls(lockedOutcome.extractionOrder);
    setPhase('completed');
    drawSound.playFanfare();

    setHistory(prev => [
      {
        id: `lotto-${Date.now()}`,
        time: formatDrawTime(),
        mainNumbers: lockedOutcome.mainNumbers,
        bonusNumber: lockedOutcome.bonusNumber,
      },
      ...prev.slice(0, 14),
    ]);
  };

  const handleStartLottoDraw = () => {
    resetBallsToChamber();

    // 1. Lock unbiased 6 + 1 draw result before starting blower animation
    const locked = drawUnbiasedLotto645();
    setDrawOutcome(locked);
    setExtractedBalls([]);
    setCurrentlyRisingBall(null);
    setPhase('blowing');

    const st = sceneStateRef.current;
    if (st) {
      st.isBlowing = true;
      st.extractedOrder = [];
      st.extractionQueue = locked.extractionOrder.map((ballNum, slotIdx) => ({
        ballNum,
        slotIdx,
      }));
      // Allow 0.8s of full-chamber air-jet mixing before the 1st ball is sucked upward into the top funnel
      st.nextSuctionTimestamp = performance.now() + 800;

      st.onBallRising = (ballNum) => {
        setCurrentlyRisingBall(ballNum);
      };

      st.onBallEnteredChute = (ballNum) => {
        st.extractedOrder.push(ballNum);
        setCurrentlyRisingBall(null);
        setExtractedBalls([...st.extractedOrder]);
      };

      st.onAllBallsSettled = () => {
        finalizeDrawSession(locked);
      };
    }
  };

  const handleQuickComplete = () => {
    if (!drawOutcome) {
      const locked = drawUnbiasedLotto645();
      setDrawOutcome(locked);
      finalizeDrawSession(locked);
    } else {
      finalizeDrawSession(drawOutcome);
    }
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

  const visibleMainBalls = extractedBalls.slice(0, 6);
  const visibleBonusBall = extractedBalls.length >= 7 ? extractedBalls[6] : null;

  const ticketCheckResult = useMemo(() => {
    if (phase !== 'completed' || !drawOutcome || myTicket.length !== 6) return null;
    return checkLottoTicketRank(drawOutcome.mainNumbers, drawOutcome.bonusNumber, myTicket);
  }, [phase, drawOutcome, myTicket]);

  return (
    <div className="rpz-game-shell" data-testid="game-lotto-3d">
      <header className="rpz-game-topbar">
        <div className="rpz-game-title-group">
          <button type="button" className="rpz-back-btn" onClick={onBack}>
            ← 추첨 게임 목록
          </button>
          <div>
            <span className="rpz-game-Tag">GAME 02 · THREE.JS 3D AIR-JET SUCTION CHAMBER</span>
            <h2>🎱 LOTTO 6/45 — 실제 3D 추첨기</h2>
          </div>
        </div>

        <div className="rpz-top-actions">
          {phase === 'idle' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-primary"
              data-testid="lotto-start-btn"
              onClick={handleStartLottoDraw}
            >
              🌪️ 에어제트 송풍 및 추첨 시작
            </button>
          )}
          {phase === 'blowing' && (
            <button
              type="button"
              className="rpz-btn rpz-btn-accent"
              data-testid="lotto-instant-btn"
              onClick={handleQuickComplete}
            >
              ⚡ 6+1 번호 즉시 배출 완료 ({extractedBalls.length}/7)
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
              {phase === 'idle' && '투명 3D 추첨실 대기 중 — 45개 번호 공(1~45) 물리 시뮬레이션 가동 중'}
              {phase === 'blowing' && (
                currentlyRisingBall
                  ? `🌪️ 에어제트 송풍 중 — [${currentlyRisingBall}번 공]이 상단 흡입구로 상승 포획 중! (${extractedBalls.length}/7구 배출)`
                  : `🌪️ 에어제트 송풍 교반 및 상단 배출 통로 추첨 중 (${extractedBalls.length}/7구 배출)`
              )}
              {phase === 'completed' && drawOutcome && `🎉 추첨 완료! 당첨 번호: ${drawOutcome.mainNumbers.join(', ')} + 보너스 ${drawOutcome.bonusNumber}`}
            </span>

            <div className="rpz-mode-badges">
              <span className="rpz-chip active">추첨실 잔여 {TOTAL_BALLS - extractedBalls.length}구</span>
              <span className="rpz-chip active">상단 흡입 → 배출 파이프 연동</span>
            </div>
          </div>

          {/* 3D WebGL Viewport — Full unclipped view of machine & bottom tray */}
          <div className="rpz-lotto-3d-viewport-wrap">
            <div
              ref={mountRef}
              className="rpz-lotto-3d-mount"
              data-testid="lotto-3d-canvas-container"
            />
          </div>

          {/* Separated Bottom Ball Rack & Result Bar (Never covers the 3D machine base!) */}
          <div className="rpz-lotto-bottom-bar" data-testid="lotto-ball-rack">
            <div className="rpz-rack-group">
              <span className="rpz-rack-label">당첨 번호 (6구)</span>
              <div className="rpz-rack-slots">
                {Array.from({ length: 6 }, (_, idx) => {
                  const num = phase === 'completed' && drawOutcome
                    ? drawOutcome.mainNumbers[idx]
                    : visibleMainBalls[idx];
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
                style={visibleBonusBall ? { background: getLottoBallColor(visibleBonusBall) } : undefined}
              >
                {visibleBonusBall || 'B'}
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
          </div>
        </section>

        <aside className="rpz-sidebar-panel">
          <div className="rpz-card">
            <h3>1. 3D 에어제트 송풍기 출력 제어</h3>
            <label className="rpz-field">
              <span>에어제트 상승 풍압 ({Math.round(blowerPower * 100)}%)</span>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={blowerPower}
                onChange={e => setBlowerPower(Number(e.target.value))}
              />
            </label>
            <p className="rpz-hint">
              하단 노즐에서 분사되는 상승 기류와 양방향 패들이 45개 공을 추첨실 상단까지 실제로 띄워 올리며, 상단 흡입구로 빨려 들어간 공이 투명 배출관을 타고 내려옵니다.
            </p>
          </div>

          <div className="rpz-card">
            <div className="rpz-card-head-between">
              <h3>2. 내 로또 번호 선택 ({myTicket.length}/6)</h3>
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

          <div className="rpz-card">
            <h3>3. 회차별 추첨 기록 ({history.length})</h3>
            {history.length === 0 ? (
              <p className="rpz-empty">아직 3D 로또 추첨 기록이 없습니다.</p>
            ) : (
              <ul className="rpz-history-list" data-testid="lotto-history-list">
                {history.map((item, idx) => (
                  <li key={item.id}>
                    <div className="rpz-history-head">
                      <strong>제 {history.length - idx}회 추첨</strong>
                      <small>{item.time}</small>
                    </div>
                    <div className="rpz-mini-ball-row">
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
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rpz-license-box">
            <small>
              <strong>오픈소스 라이선스 고지:</strong> 3D 추첨기 구조 <code>steller102/3d-lottery</code> (MIT License, Copyright © 2025 Steller) 및 로또 채점/번호대 규칙 <code>Tae-sung-Kim/pickle-eight</code> (MIT License) 활용 · 45구 3D 구체 상승 흡입 및 6+1 배출 통로 물리 엔진 구현.
            </small>
          </div>
        </aside>
      </div>
    </div>
  );
}
