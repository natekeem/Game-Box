/**
 * GAME DECK 3D Console Scene Engine
 * Ported from: brayanspagnol/ps2-web
 * Git commit: 654114aed6b85aacb1b3e68793808b3eb3feca13
 * Original Author: Brayan Spagnol
 * License: BSD-2-Clause
 *
 * Port of the procedural PS2 console, tray and LEDs, with a shared Game Deck case stage.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { generateArcadeCoverSvg, getGameCaseCoverSrc } from '../cases/gameCoverGenerator.js';

export const LIVE_LAYER = 1;
const MM = 0.001;

// Dimensions (mm)
const W = 301, D = 182;
const XL = -W / 2, XR = W / 2, ZB = -D / 2, ZF = D / 2;
const BASE = { x1: 130, zf: 72, y0: 2.5, y1: 40 };
const LID = [71, 78];
const FINS = [[64.5, 69], [58, 62.5], [51.5, 56], [45, 49.5], [40, 43]];
const GROOVE_DEPTH = 3.5;

// Disc tray
const TRAY = { x0: -4.5, x1: 126.5, y0: 40, y1: 56 };
const TRAY_X = ((TRAY.x0 + TRAY.x1) / 2) * MM;
const TRAY_W = TRAY.x1 - TRAY.x0;
const TRAY_LEN = 0.15, TRAY_TRAVEL = 0.142;
const TRAY_Y = 0.0475;
const DISC_R = 0.06, DISC_HOLE = 0.0075, DISC_T = 0.0012;
const CASE_W = 0.134, CASE_H = 0.190;
const DISC_NORMAL = new THREE.Vector3(0, 1, 0);

const LED_OFF = new THREE.Color('#ff2a1a'); // standby
const LED_ON = new THREE.Color('#2bff6a');  // disc loaded
const LED_EJECT = new THREE.Color('#2a7bff');
const EJECT_DIM = new THREE.Color('#0c1a3a');

const ease = {
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  smooth: (t) => t * t * (3 - 2 * t),
  linear: (t) => t,
};

function box(x0, x1, y0, y1, z0, z1, r) {
  const g = new RoundedBoxGeometry((x1 - x0) * MM, (y1 - y0) * MM, (z1 - z0) * MM, 1, r * MM);
  g.translate(((x0 + x1) / 2) * MM, ((y0 + y1) / 2) * MM, ((z0 + z1) / 2) * MM);
  return g;
}

function grainTexture() {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const img = g.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = 110 + Math.random() * 60;
    img.data.set([v, v, v, 255], i * 4);
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 10);
  return t;
}

function radialTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.2, 'rgba(255,255,255,0.5)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const SANS = "'Helvetica Neue', Arial, sans-serif";

function emboss(g, text, x, y, px) {
  g.fillStyle = 'rgba(255,255,255,0.12)';
  g.fillText(text, x - px * 0.04, y - px * 0.04);
  g.fillStyle = '#0a0b0d';
  g.fillText(text, x, y);
}

// Top lid graphics: GAME DECK branding
function drawDeckTop(g, w, h) {
  const k = w / W;
  const X = (mm) => (mm - XL) * k, Z = (mm) => (mm - ZB) * k;

  g.save();
  g.translate(X(16), Z(-4));
  g.rotate(Math.PI / 2);

  const len = 128 * k, s = len / 1575;
  g.scale(s, s);
  g.translate(-952, -640);

  // Stylized GAME DECK logo vectors
  const grd = g.createLinearGradient(0, 500, 0, 770);
  grd.addColorStop(0, '#38bdf8');
  grd.addColorStop(1, '#2563eb');
  g.strokeStyle = grd;
  g.lineWidth = 18;
  g.lineJoin = 'miter';
  g.lineCap = 'butt';

  // "GD" Monogram
  const poly = (pts) => {
    g.beginPath();
    g.moveTo(...pts[0]);
    for (const p of pts.slice(1)) g.lineTo(...p);
    g.stroke();
  };
  poly([[168, 505], [645, 505], [645, 630], [180, 630], [180, 768]]);
  poly([[662, 760], [940, 760], [940, 510], [1228, 510]]);
  poly([[1253, 505], [1730, 505], [1730, 630], [1265, 630], [1265, 760], [1738, 760]]);

  g.font = `800 112px ${SANS}`;
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  emboss(g, 'TOOL-BOX ARCADE DECK', 945, 975, 112);
  g.restore();

  // Format marks along front edge
  g.font = `700 ${4.2 * k}px ${SANS}`;
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  let x = X(28);
  for (const t of ['COMPACT DISC', 'ARCADE MATRIX', 'DIGITAL CORE', 'TOOL-BOX 2026', '60 FPS']) {
    emboss(g, t, x, Z(84), 4.2 * k);
    x += g.measureText(t).width + 6 * k;
  }
}

// Upper front markings: ports, labels, GAME-BOX
function drawDeckUpperFront(g, w, h) {
  const k = w / W;
  const X = (mm) => (mm - XL) * k, Y = (mm) => (LID[1] - mm) * k;
  const rr = (x, y, ww, hh, r) => {
    g.beginPath();
    g.roundRect(X(x - ww / 2), Y(y + hh / 2), ww * k, hh * k, r * k);
  };
  g.textAlign = 'center';
  g.textBaseline = 'middle';

  for (const [i, cx] of [[1, -105], [2, -52]]) {
    rr(cx, 60.25, 44, 4.3, 0.8);
    g.fillStyle = '#1f2024';
    g.fill();
    rr(cx, 61.1, 40, 1.5, 0.5);
    g.fillStyle = '#010101';
    g.fill();
    g.fillStyle = '#8d9097';
    g.font = `500 ${1.35 * k}px ${SANS}`;
    g.fillText('EXPANSION SLOT', X(cx), Y(59.3));
    g.font = `500 ${2.6 * k}px ${SANS}`;
    g.fillText(String(i), X(cx), Y(66.8));

    // Controller port
    rr(cx, 50.5, 37, 6.4, 2.6);
    g.fillStyle = '#26272c';
    g.fill();
    rr(cx, 50.5, 35, 4.8, 2);
    g.fillStyle = '#020203';
    g.fill();
    for (let gi = -1; gi <= 1; gi++) {
      for (let p = -1; p <= 1; p++) {
        rr(cx + gi * 10 + p * 2.7, 50.5, 1.6, 2.1, 0.7);
        g.fillStyle = '#5b5e66';
        g.fill();
      }
    }
  }

  g.fillStyle = '#38bdf8';
  g.font = `700 ${1.8 * k}px ${SANS}`;
  g.fillText('TOOL-BOX', X(-78.5), Y(63.4));

  // GAME-BOX brand on right end
  g.save();
  g.translate(X(148.3), Y(57));
  g.rotate(Math.PI / 2);
  g.font = `800 ${3.6 * k}px ${SANS}`;
  g.fillStyle = '#e2e8f0';
  g.fillText('GAME-BOX', 0, 0);
  g.restore();
}

// Base front
function drawDeckBaseFront(g, w, h) {
  const k = w / (BASE.x1 - XL);
  const X = (mm) => (mm - XL) * k, Y = (mm) => (BASE.y1 - mm) * k;
  const rect = (x0, y0, x1, y1, fill, r = 0) => {
    g.beginPath();
    g.roundRect(X(x0), Y(y1), (x1 - x0) * k, (y1 - y0) * k, r * k);
    g.fillStyle = fill;
    g.fill();
  };
  rect(XL - 1, BASE.y0 - 1, BASE.x1 + 1, BASE.y1 + 1, '#151619');

  // Blue panel
  rect(-146, 7, -113, 36, '#1d4ed8', 1);
  const pg = g.createLinearGradient(0, Y(36), 0, Y(7));
  pg.addColorStop(0, 'rgba(255,255,255,0.22)');
  pg.addColorStop(1, 'rgba(0,0,0,0.18)');
  rect(-146, 7, -113, 36, pg, 1);

  for (const y of [28.5, 19.5]) {
    rect(-143, y - 3, -130, y + 3, '#0b0c10', 0.6);
    rect(-141.5, y - 0.2, -131.5, y + 1.6, '#9aa0aa', 0.2);
  }
  rect(-125, 28.5 - 2.3, -119, 28.5 + 2.3, '#0b0c10', 0.8);
  g.fillStyle = '#cfe0ff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `700 ${4 * k}px ${SANS}`;
  g.fillText('i', X(-122), Y(20));
  g.font = `700 ${2.6 * k}px ${SANS}`;
  g.fillText('⇆', X(-127.5), Y(13));

  // Vent grille
  rect(-104, 6, 124, 35, '#1e1f23', 0.8);
  const cols = 15, rows = 8, gx = 1.6, gy = 1.3;
  const cw = (228 - gx * (cols + 1)) / cols, ch = (29 - gy * (rows + 1)) / rows;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x0 = -104 + gx + c * (cw + gx), y0 = 6 + gy + r * (ch + gy);
      rect(x0, y0, x0 + cw, y0 + ch, '#000000', 0.3);
      rect(x0, y0, x0 + cw, y0 + ch * 0.22, 'rgba(255,255,255,0.06)');
    }
  }
}

// GD Badge on tray front
function drawDeckBadge(g, s) {
  g.clearRect(0, 0, s, s);
  g.save();
  g.translate(s * 0.5, s * 0.5);

  const grd = g.createLinearGradient(-s * 0.4, -s * 0.4, s * 0.4, s * 0.4);
  grd.addColorStop(0, '#38bdf8');
  grd.addColorStop(1, '#2563eb');

  g.fillStyle = grd;
  g.beginPath();
  g.roundRect(-s * 0.42, -s * 0.42, s * 0.84, s * 0.84, s * 0.18);
  g.fill();

  g.fillStyle = '#ffffff';
  g.font = `900 ${s * 0.44}px ${SANS}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('GD', 0, 0);

  g.restore();
}

function drawPowerIcon(g, s) {
  g.strokeStyle = '#fff';
  g.lineWidth = s * 0.09;
  g.lineCap = 'round';
  g.beginPath();
  g.arc(s / 2, s * 0.54, s * 0.24, -Math.PI * 0.3, Math.PI * 1.3);
  g.stroke();
  g.beginPath();
  g.moveTo(s / 2, s * 0.2);
  g.lineTo(s / 2, s * 0.5);
  g.stroke();
}

function drawEjectIcon(g, s) {
  g.fillStyle = '#fff';
  g.beginPath();
  g.moveTo(s / 2, s * 0.22);
  g.lineTo(s * 0.78, s * 0.56);
  g.lineTo(s * 0.22, s * 0.56);
  g.closePath();
  g.fill();
  g.fillRect(s * 0.22, s * 0.64, s * 0.56, s * 0.1);
}

function drawRecess(g, s) {
  const c = s / 2, k = s / TRAY_W;
  g.clearRect(0, 0, s, s);
  g.fillStyle = '#050506';
  g.beginPath();
  g.arc(c, c, 61 * k, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.07)';
  g.lineWidth = 0.8 * k;
  g.beginPath();
  g.arc(c, c, 61 * k, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(c, c, 40.5 * k, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#000';
  g.beginPath();
  g.arc(c, c, 16 * k, 0, Math.PI * 2);
  g.fill();
}

function drawDiscLabel(g, S, game, coverArt) {
  const c = S / 2, R = S / 2, mm = R / (DISC_R / MM);
  const ring = (r0, r1) => {
    g.beginPath();
    g.arc(c, c, r1, 0, Math.PI * 2);
    g.arc(c, c, r0, 0, Math.PI * 2, true);
  };

  g.fillStyle = '#c3c7cf';
  g.fillRect(0, 0, S, S);

  const baseCol = game.caseColor || '#2563eb';
  const grd = g.createLinearGradient(0, S, S, 0);
  grd.addColorStop(0, '#08111d');
  grd.addColorStop(0.44, baseCol);
  grd.addColorStop(0.9, '#101929');
  g.fillStyle = grd;
  ring(19 * mm, R - 1.5 * mm);
  g.fill();

  if (coverArt) {
    g.save();
    g.clip();
    g.globalAlpha = 0.55;
    const { naturalWidth: w, naturalHeight: h } = coverArt;
    g.drawImage(coverArt, 0, h * 0.22, w, h * 0.43, 0, R * 0.30, S, R * 1.38);
    g.restore();
  }

  // Clear plastic hub
  const hub = g.createRadialGradient(c, c, 7 * mm, c, c, 19 * mm);
  hub.addColorStop(0, '#9ea3ad');
  hub.addColorStop(0.55, '#d9dce2');
  hub.addColorStop(1, '#aeb3bc');
  g.fillStyle = hub;
  ring(7.5 * mm, 19 * mm);
  g.fill();

  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 1.2 * mm;
  g.beginPath();
  g.arc(c, c, 11 * mm, 0, Math.PI * 2);
  g.stroke();

  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 0.5 * mm;
  g.beginPath();
  g.arc(c, c, 19 * mm, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(c, c, R - 3.3 * mm, 0, Math.PI * 2);
  g.stroke();

  // Disc typography
  const title = (game.name || 'GAME-BOX').split(' (')[0].toUpperCase();
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.shadowColor = 'rgba(0,0,0,0.6)';
  g.shadowBlur = 12;
  g.font = `900 ${S * 0.094}px ${SANS}`;
  g.fillText(title, c, c - R * 0.56, R * 1.55);

  g.shadowBlur = 0;
  g.font = `700 ${S * 0.038}px monospace`;
  g.fillStyle = '#cbd5e1';
  g.fillText(game.discLabel || 'ARC-001', c, c + R * 0.52);
  g.font = `600 ${S * 0.032}px ${SANS}`;
  g.fillStyle = 'rgba(255,255,255,0.7)';
  g.fillText('TOOL-BOX ARCADE DECK', c, c + R * 0.65);
}

function drawDiscUnderside(g, S) {
  const c = S / 2, R = S / 2, mm = R / (DISC_R / MM);
  const grd = g.createRadialGradient(c, c, 22 * mm, c, c, R);
  grd.addColorStop(0, '#8a96c8');
  grd.addColorStop(0.5, '#6f7fc4');
  grd.addColorStop(1, '#9aa6d6');
  g.fillStyle = grd;
  g.beginPath();
  g.arc(c, c, R, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = '#d4d7de';
  g.beginPath();
  g.arc(c, c, 22 * mm, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = '#b5b9c2';
  g.beginPath();
  g.arc(c, c, 17 * mm, 0, Math.PI * 2);
  g.fill();
}

function loadCoverImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function disposeObject(root) {
  if (!root) return;
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of ms) {
      if (m.map && !m.map.userData?.shared) m.map.dispose();
      m.dispose();
    }
  });
}

/**
 * Creates and mounts the 3D console scene into container element
 */
export function createGameDeckConsoleScene(container, opts = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: opts.antialias ?? true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.maxPixelRatio ?? 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 1.0;
  renderer.shadowMap.enabled = opts.shadows ?? true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
  container.appendChild(renderer.domElement);

  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const scene = new THREE.Scene();
  const bg = new THREE.Color('#07080b');
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, 1.6, 4.2);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.35;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 20);

  // Lighting
  const key = new THREE.SpotLight('#fff1e0', 6, 4, 0.55, 0.85, 1.6);
  key.position.set(0.75, 1.25, 0.9);
  key.target.position.set(0, 0.05, -0.12);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 3;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.003;
  scene.add(key, key.target);

  const rim = new THREE.DirectionalLight('#a9bfff', 1.0);
  rim.position.set(-1.2, 0.8, -1.4);
  scene.add(rim);

  const rim2 = new THREE.DirectionalLight('#ffd2a8', 0.8);
  rim2.position.set(1.4, 0.4, -0.9);
  scene.add(rim2);

  const fill = new THREE.DirectionalLight('#dfe6ff', 0.38);
  fill.position.set(0.2, 0.3, 1.5);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight('#9fb4ff', '#0b0b0e', 0.28));

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshLambertMaterial({ color: '#161920' }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Textures and Materials
  const textures = [];
  const colorTexture = (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    return t;
  };
  const drawTexture = (w, h, draw) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    return colorTexture(new THREE.CanvasTexture(c));
  };
  const canvasTex = (w, h, draw) => {
    const t = drawTexture(w, h, draw);
    t.userData.shared = true;
    textures.push(t);
    return t;
  };

  const grain = grainTexture();
  textures.push(grain);

  const BODY = '#111214';
  const mat = {
    shell: new THREE.MeshPhysicalMaterial({ color: BODY, roughness: 0.7, bumpMap: grain, bumpScale: 0.6, clearcoat: 0.08, clearcoatRoughness: 0.6 }),
    fin: new THREE.MeshPhysicalMaterial({ color: '#121316', roughness: 0.34, clearcoat: 0.45, clearcoatRoughness: 0.3 }),
    core: new THREE.MeshStandardMaterial({ color: '#060607', roughness: 0.9 }),
    hole: new THREE.MeshBasicMaterial({ color: '#020203' }),
    button: new THREE.MeshPhysicalMaterial({ color: '#16171b', roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
    tray: new THREE.MeshStandardMaterial({ color: '#09090b', roughness: 0.85, envMapIntensity: 0.4 }),
  };
  const decalMat = (map, extra = {}) => new THREE.MeshStandardMaterial({
    map, transparent: true, depthWrite: false, roughness: 0.45, polygonOffset: true, polygonOffsetFactor: -2, ...extra,
  });

  const consoleGroup = new THREE.Group();
  scene.add(consoleGroup);

  const addMesh = (geo, m, parent = consoleGroup, shadow = true) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Lid and Fins
  const lidGeo = box(XL, XR, LID[0], LID[1], ZB, ZF, 2.5);
  const lidN = lidGeo.attributes.position.count;
  const finGeos = [lidGeo];
  for (const [y0, y1] of FINS) {
    const inTray = y1 <= TRAY.y1 + 0.01;
    if (!inTray) {
      finGeos.push(box(XL, XR, y0, y1, ZB, ZF, 1.2));
      continue;
    }
    finGeos.push(box(XL, TRAY.x0 - 1, y0, y1, ZB, ZF, 1.2));
    finGeos.push(box(TRAY.x1 + 1, XR, y0, y1, ZB, ZF, 1.2));
    finGeos.push(box(TRAY.x0 - 1, TRAY.x1 + 1, y0, y1, ZB, ZF - 30, 1.2));
  }
  finGeos.push(box(XL, XL + 4, FINS.at(-1)[0] + 0.5, LID[0], ZB + 0.5, ZF - 6, 0.5));
  const lidFins = mergeGeometries(finGeos);
  finGeos.forEach((g) => g.dispose());
  lidFins.addGroup(0, lidN, 0);
  lidFins.addGroup(lidN, Infinity, 1);
  addMesh(lidFins, [mat.shell, mat.fin]);

  addMesh(box(XL, XR - GROOVE_DEPTH, FINS.at(-1)[0], LID[0], ZB, ZF - GROOVE_DEPTH, 0.5), mat.core, consoleGroup, false);
  addMesh(box(XL, BASE.x1, BASE.y0, BASE.y1 + 0.5, ZB, BASE.zf, 1.5), mat.shell);

  // Feet
  const tabs = [];
  for (const [x, z] of [[-130, -70], [110, -70], [-130, 55], [110, 55]]) tabs.push(box(x - 6, x + 6, 0, BASE.y0 + 0.5, z - 6, z + 6, 0.8));
  for (const [y, z] of [[60, -78], [60, 76], [20, -78], [20, 60]]) tabs.push(box(XL - 0.8, XL + 1, y - 5, y + 5, z - 4, z + 4, 0.5));
  addMesh(mergeGeometries(tabs), mat.core, consoleGroup, false);
  tabs.forEach((g) => g.dispose());

  // Top graphics
  const topTex = canvasTex(2048, Math.round(2048 * D / W), drawDeckTop);
  const top = addMesh(new THREE.PlaneGeometry((W - 4) * MM, (D - 4) * MM), decalMat(topTex, { emissive: '#ffffff', emissiveMap: topTex, emissiveIntensity: 0.08 }), consoleGroup, false);
  top.rotation.x = -Math.PI / 2;
  top.position.y = LID[1] * MM + 0.00005;

  // Front graphics
  const frontH = LID[1] - FINS.at(-1)[0];
  const frontTex = canvasTex(4096, Math.round(4096 * frontH / W), drawDeckUpperFront);
  const frontDecal = addMesh(new THREE.PlaneGeometry(W * MM, frontH * MM), decalMat(frontTex), consoleGroup, false);
  frontDecal.position.set(0, (FINS.at(-1)[0] + frontH / 2) * MM, ZF * MM + 0.0003);

  // Base front
  const baseW = BASE.x1 - XL, baseH = BASE.y1 - BASE.y0;
  const baseTex = canvasTex(2048, Math.round(2048 * baseH / baseW), drawDeckBaseFront);
  const baseFront = addMesh(new THREE.PlaneGeometry((baseW - 2) * MM, (baseH - 1.5) * MM),
    new THREE.MeshStandardMaterial({ map: baseTex, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 }), consoleGroup, false);
  baseFront.position.set(((XL + BASE.x1) / 2) * MM, ((BASE.y0 + BASE.y1) / 2 + 0.25) * MM, BASE.zf * MM + 0.0002);

  // Dark opening behind tray
  const opening = addMesh(new THREE.PlaneGeometry((TRAY_W + 2) * MM, (TRAY.y1 - TRAY.y0) * MM), mat.hole, consoleGroup, false);
  opening.position.set(TRAY_X, ((TRAY.y0 + TRAY.y1) / 2) * MM, (ZF - GROOVE_DEPTH + 0.1) * MM);

  // Buttons & LEDs
  const btnGeo = new RoundedBoxGeometry(15 * MM, 10.5 * MM, 3 * MM, 2, 1 * MM);
  const btnPower = addMesh(btnGeo, mat.button);
  btnPower.position.set(137 * MM, 63.6 * MM, (ZF + 0.2) * MM);
  const btnEject = addMesh(btnGeo, mat.button);
  btnEject.position.set(137 * MM, 47.3 * MM, (ZF + 0.2) * MM);

  const iconPlane = new THREE.PlaneGeometry(7 * MM, 7 * MM);
  const powerIcon = canvasTex(128, 128, (g, s) => drawPowerIcon(g, s));
  const ejectIcon = canvasTex(128, 128, (g, s) => drawEjectIcon(g, s));
  const ledMat = new THREE.MeshBasicMaterial({ map: powerIcon, color: LED_OFF.clone(), transparent: true, depthWrite: false });
  const ejectLedMat = new THREE.MeshBasicMaterial({ map: ejectIcon, color: EJECT_DIM.clone(), transparent: true, depthWrite: false });
  const led = new THREE.Mesh(iconPlane, ledMat);
  led.position.set(0, 1.4 * MM, 1.55 * MM);
  btnPower.add(led);
  const ejectLed = new THREE.Mesh(iconPlane, ejectLedMat);
  ejectLed.position.set(0, 0.6 * MM, 1.55 * MM);
  btnEject.add(ejectLed);

  const resetTex = canvasTex(256, 64, (g, w, h) => {
    g.fillStyle = '#38bdf8';
    g.font = `700 ${h * 0.62}px ${SANS}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('POWER', w / 2, h / 2);
  });
  const reset = new THREE.Mesh(new THREE.PlaneGeometry(9 * MM, 2.25 * MM), new THREE.MeshBasicMaterial({ map: resetTex, transparent: true, depthWrite: false }));
  reset.position.set(0, -3.3 * MM, 1.55 * MM);
  btnPower.add(reset);

  const glowTex = radialTexture();
  glowTex.userData.shared = true;
  textures.push(glowTex);
  const makeGlow = (color, size) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, opacity: 0.55,
    }));
    s.scale.setScalar(size);
    s.renderOrder = 10;
    return s;
  };
  const ledGlow = makeGlow(LED_OFF.clone(), 0.016);
  ledGlow.position.z = 0.001; led.add(ledGlow);
  const ejectGlow = makeGlow(LED_EJECT.clone(), 0.016);
  ejectGlow.position.z = 0.001; ejectGlow.material.opacity = 0; ejectLed.add(ejectGlow);

  // Tray Unit
  const tray = new THREE.Group();
  const trayClosedZ = ZF * MM;
  tray.position.set(TRAY_X, 0, trayClosedZ);
  consoleGroup.add(tray);

  const hw = TRAY_W / 2;
  const trayFins = [];
  for (const [y0, y1] of FINS) {
    if (y1 <= TRAY.y1 + 0.01) trayFins.push(box(-hw, hw, y0, y1, -GROOVE_DEPTH, 0, 1.0));
  }
  trayFins.push(box(-hw + 0.5, hw - 0.5, TRAY.y0, TRAY.y1, -GROOVE_DEPTH - 1.5, -GROOVE_DEPTH + 0.6, 0.3));
  addMesh(mergeGeometries(trayFins), mat.fin, tray);
  trayFins.forEach((g) => g.dispose());

  // GD Badge on tray front
  const gdBadgeTex = canvasTex(256, 256, drawDeckBadge);
  const gdBadge = addMesh(new THREE.PlaneGeometry(10 * MM, 10 * MM), decalMat(gdBadgeTex, { roughness: 0.3 }), tray, false);
  gdBadge.position.set(6 * MM, 47.25 * MM, 0.0003);

  // Tray bed
  const seatZ = -(GROOVE_DEPTH + 1.5) * MM - TRAY_LEN / 2;
  const bed = addMesh(new THREE.BoxGeometry((TRAY_W - 3) * MM, 3 * MM, TRAY_LEN), mat.tray, tray);
  bed.position.set(0, TRAY_Y - 0.0015, seatZ);

  const recessTex = canvasTex(512, 512, drawRecess);
  const well = addMesh(new THREE.PlaneGeometry(TRAY_W * MM - 0.004, TRAY_W * MM - 0.004), new THREE.MeshStandardMaterial({ map: recessTex, roughness: 0.7, transparent: true }), tray, false);
  well.rotation.x = -Math.PI / 2;
  well.position.set(0, TRAY_Y + 0.0001, seatZ);
  const traySeat = new THREE.Object3D();
  traySeat.name = 'tray-disc-seat';
  traySeat.position.set(0, TRAY_Y + DISC_T / 2 + 0.0003, seatZ);
  tray.add(traySeat);

  // Tweens and render loop
  const tweens = new Set();
  let raf = 0, disposed = false;

  function invalidate() {
    if (raf || disposed) return;
    raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    raf = 0;
    if (disposed) return;
    for (const tw of [...tweens]) {
      const p = THREE.MathUtils.clamp((now - tw.t0) / tw.ms, 0, 1);
      tw.fn(tw.ease(p));
      if (p >= 1) {
        tweens.delete(tw);
        tw.done();
      }
    }

    renderer.render(scene, camera);

    if (tweens.size) invalidate();
  }

  function tween(ms, fn, easing = ease.inOut) {
    if (disposed) return Promise.resolve();
    return new Promise((done) => {
      tweens.add({ t0: performance.now(), ms, fn, ease: easing, done });
      invalidate();
    });
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  // Frame the whole loading area once, including the case and the extended tray.
  const cameraTarget = new THREE.Vector3(0, 0.125, 0.035);
  const cameraDirection = new THREE.Vector3(0.42, 0.45, 1).normalize();
  let width = 0, height = 0;

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    // The launcher temporarily hides this canvas; preserve its last frame and pose.
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const halfFrustum = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(0.465, 0.46 / camera.aspect) / (2 * halfFrustum);
    camera.position.copy(cameraTarget).addScaledVector(cameraDirection, distance);
    camera.lookAt(cameraTarget);
    invalidate();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // Disc mesh
  const discUnderTex = canvasTex(512, 512, drawDiscUnderside);

  function makeDisc(game, coverArt) {
    const tex = drawTexture(1024, 1024, (g, s) => drawDiscLabel(g, s, game, coverArt));
    const g = new THREE.Group();
    g.name = 'game-disc';
    const ring = new THREE.RingGeometry(DISC_HOLE, DISC_R, 96, 1);
    const topMesh = new THREE.Mesh(ring, new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.75, envMapIntensity: 0.25,
      emissiveMap: tex, emissive: '#ffffff', emissiveIntensity: 0.36,
    }));
    topMesh.name = 'disc-print';
    topMesh.rotation.x = -Math.PI / 2;
    topMesh.position.y = DISC_T / 2;

    const bottomMesh = new THREE.Mesh(ring, new THREE.MeshPhysicalMaterial({
      map: discUnderTex, color: '#cfd6ff', roughness: 0.1, metalness: 1, iridescence: 0.8, iridescenceIOR: 1.5,
      iridescenceThicknessRange: [250, 650],
    }));
    bottomMesh.rotation.x = Math.PI / 2;
    bottomMesh.position.y = -DISC_T / 2;

    const edgeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(DISC_R, DISC_R, DISC_T, 96, 1, true),
      new THREE.MeshStandardMaterial({ color: '#9aa0ad', roughness: 0.3, metalness: 0.6 }),
    );

    g.add(topMesh, bottomMesh, edgeMesh);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    return g;
  }

  // The back shell and its CD share a local XY plane; the lid hinges on their left edge.
  const caseRest = new THREE.Vector3(0, 0.214, -0.034);
  caseRest.x = cameraTarget.x + (caseRest.z - cameraTarget.z) * cameraDirection.x / cameraDirection.z;
  const caseTilt = new THREE.Euler(-0.10, 0.28, 0);
  const caseRight = new THREE.Vector3(1, 0, 0).applyEuler(caseTilt);

  function mountDisc(disc, seat) {
    seat.add(disc);
    disc.position.set(0, 0, 0);
    disc.quaternion.identity();
  }

  function make3DCase(game, coverArt) {
    const group = new THREE.Group();
    group.name = 'game-case';
    group.rotation.copy(caseTilt);
    group.position.copy(caseRest);

    const w = CASE_W / (2 * MM), h = CASE_H / (2 * MM);
    const plastic = new THREE.MeshPhysicalMaterial({ color: '#202634', roughness: 0.48, clearcoat: 0.24 });
    const liner = new THREE.MeshStandardMaterial({ color: '#121720', roughness: 0.62 });
    const hub = new THREE.MeshStandardMaterial({ color: '#505b6b', roughness: 0.42 });
    addMesh(box(-w, w, -h, h, -6.5, -2, 1.7), plastic, group);
    const edges = [
      box(-w, -w + 2.4, -h, h, -3, 4.7, 1),
      box(w - 2.4, w, -h, h, -3, 4.7, 1),
      box(-w + 2, w - 2, h - 2.4, h, -3, 4.7, 1),
      box(-w + 2, w - 2, -h, -h + 2.4, -3, 4.7, 1),
    ];
    addMesh(mergeGeometries(edges), plastic, group);
    edges.forEach((geometry) => geometry.dispose());

    const cylinder = (radius, depth, z, material) => {
      const mesh = addMesh(new THREE.CylinderGeometry(radius, radius, depth, 64), material, group);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.z = z;
    };
    cylinder(DISC_R + 0.003, 0.002, -0.0011, liner);
    const ridge = addMesh(new THREE.RingGeometry(DISC_R + 0.0008, DISC_R + 0.0024, 64), plastic, group, false);
    ridge.position.z = 0.0001;
    cylinder(0.010, 0.0044, 0.0002, plastic);
    cylinder(DISC_HOLE - 0.0006, 0.0037, 0.0029, hub);

    const seat = new THREE.Object3D();
    seat.name = 'case-disc-seat';
    seat.position.z = 0.003;
    seat.rotation.x = Math.PI / 2; // CD label normal (+Y) points through the lid (+Z).
    group.add(seat);
    const disc = makeDisc(game, coverArt);
    mountDisc(disc, seat);

    const coverPivot = new THREE.Group();
    coverPivot.name = 'case-hinge';
    coverPivot.position.set(-CASE_W / 2, 0, 0.006);
    group.add(coverPivot);
    addMesh(box(0, 2 * w, -h, h, -1.3, 1.3, 1), plastic, coverPivot);
    for (const y of [-h + 27, h - 27]) {
      addMesh(box(w + 42, w + 58, y - 3, y + 3, -3.2, -1, 0.8), liner, coverPivot);
    }

    if (coverArt) {
      const map = colorTexture(new THREE.Texture(coverArt));
      map.needsUpdate = true;
      const print = addMesh(new THREE.PlaneGeometry(CASE_W - 0.004, CASE_H - 0.004),
        new THREE.MeshBasicMaterial({ map, toneMapped: false }), coverPivot, false);
      print.position.set(CASE_W / 2, 0, 0.00135);
    }
    return { id: game.id, group, coverPivot, seat, disc };
  }

  function poseCase(pack, open) {
    const angle = -Math.PI * 0.84 * open;
    pack.coverPivot.rotation.y = angle;
    // Recenter the combined silhouette as the lid swings left.
    pack.group.position.copy(caseRest).addScaledVector(caseRight, CASE_W * (1 - Math.cos(angle)) / 4);
  }

  function makeDiscTransfer(caseSeat, traySeat) {
    const start = caseSeat.getWorldPosition(new THREE.Vector3());
    const end = traySeat.getWorldPosition(new THREE.Vector3());
    const from = caseSeat.getWorldQuaternion(new THREE.Quaternion());
    const to = traySeat.getWorldQuaternion(new THREE.Quaternion());
    const caseNormal = DISC_NORMAL.clone().applyQuaternion(from);
    const trayNormal = DISC_NORMAL.clone().applyQuaternion(to);
    const clearCase = start.clone().addScaledVector(caseNormal, 0.047);
    const aboveTray = end.clone().addScaledVector(trayNormal, 0.039);
    const arc = new THREE.CubicBezierCurve3(
      clearCase,
      clearCase.clone().addScaledVector(caseNormal, 0.08).add(new THREE.Vector3(0.068, 0.05, 0)),
      aboveTray.clone().addScaledVector(trayNormal, 0.12),
      aboveTray,
    );
    const spin = new THREE.Quaternion();

    return (disc, t) => {
      if (t <= 0.22) {
        disc.position.lerpVectors(start, clearCase, ease.smooth(t / 0.22));
        disc.quaternion.copy(from);
      } else if (t < 0.81) {
        const p = ease.smooth((t - 0.22) / 0.59);
        arc.getPoint(p, disc.position);
        disc.quaternion.slerpQuaternions(from, to, p);
        // Spin around the printed face's own normal so the label never flips over.
        disc.quaternion.multiply(spin.setFromAxisAngle(DISC_NORMAL, 2 * Math.PI * p));
      } else {
        disc.position.lerpVectors(aboveTray, end, ease.smooth((t - 0.81) / 0.19));
        disc.quaternion.copy(to);
      }
    };
  }

  // Animation methods
  const trayOpenPos = () => trayClosedZ + TRAY_TRAVEL;
  const ejectZ = btnEject.position.z;

  function moveTray(open, ms = 750) {
    const z0 = tray.position.z, z1 = open ? trayOpenPos() : trayClosedZ;
    return Promise.all([
      tween(ms, (t) => { tray.position.z = lerp(z0, z1, t); }, ease.inOut),
      tween(220, (t) => { btnEject.position.z = ejectZ - Math.sin(Math.PI * t) * 0.0012; }),
    ]);
  }

  function setLed(color, ms = 500) {
    const c0 = ledMat.color.clone();
    return tween(ms, (t) => {
      ledMat.color.copy(c0).lerp(color, t);
      ledGlow.material.color.copy(ledMat.color);
    });
  }

  function blinkEject(ms) {
    return tween(ms, (t) => {
      const on = t < 1 && Math.sin(t * ms / 1000 * Math.PI * 2 * 2.2) > 0;
      ejectLedMat.color.copy(on ? LED_EJECT : EJECT_DIM);
      ejectGlow.material.opacity = on ? 0.8 : 0;
    }, (t) => t);
  }

  let queue = Promise.resolve();
  const serial = (fn) => (...args) => {
    const run = () => disposed ? undefined : fn(...args);
    return queue = queue.then(run, run);
  };
  let activeCase = null;
  let pendingCase = null;

  function selectCase(game) {
    if (!game || disposed) return Promise.resolve(null);
    if (pendingCase?.id === game.id) return pendingCase.ready;
    if (activeCase?.id === game.id) {
      pendingCase = null;
      return Promise.resolve(activeCase);
    }

    const request = { id: game.id };
    pendingCase = request;
    request.ready = (async () => {
      const src = getGameCaseCoverSrc(game);
      let artwork = await loadCoverImage(src);
      if (!artwork && game.coverUrl && src === game.coverUrl) {
        artwork = await loadCoverImage(generateArcadeCoverSvg(game));
      }
      if (disposed || pendingCase !== request) return null;
      pendingCase = null;
      const pack = make3DCase(game, artwork);
      if (activeCase) {
        activeCase.disc.removeFromParent();
        disposeObject(activeCase.disc);
        activeCase.group.removeFromParent();
        disposeObject(activeCase.group);
      }
      activeCase = pack;
      scene.add(pack.group);
      invalidate();
      return pack;
    })();
    return request.ready;
  }

  const trayDuration = 780;
  const flightDuration = 1420;
  const swingCase = (pack, open) => tween(595, (p) => poseCase(pack, open ? p : 1 - p), ease.smooth);

  async function transferDisc(pack, inserting) {
    const { disc, seat } = pack;
    const sample = makeDiscTransfer(seat, traySeat);
    scene.attach(disc);
    await tween(flightDuration, (t) => sample(disc, inserting ? t : 1 - t), ease.linear);
    if (!disposed) mountDisc(disc, inserting ? traySeat : seat);
  }

  function setDiscAtRest(pack, inserted) {
    mountDisc(pack.disc, inserted ? traySeat : pack.seat);
    poseCase(pack, 0);
    tray.position.z = trayClosedZ;
    ledMat.color.copy(inserted ? LED_ON : LED_OFF);
    ledGlow.material.color.copy(ledMat.color);
    invalidate();
  }

  async function doEject({ animate = true } = {}) {
    const pack = activeCase;
    if (pack?.disc.parent !== traySeat) return;
    if (!animate) {
      setDiscAtRest(pack, false);
      return;
    }

    blinkEject(trayDuration * 2 + flightDuration);
    setLed(LED_OFF, 450);
    await Promise.all([moveTray(true, trayDuration), swingCase(pack, true)]);
    if (disposed) return;
    await transferDisc(pack, false);
    if (disposed) return;
    await Promise.all([moveTray(false, trayDuration), swingCase(pack, false)]);
  }

  async function doInsert(game, { animate = true } = {}) {
    if (activeCase?.disc.parent === traySeat) await doEject({ animate });
    const pack = await selectCase(game);
    if (disposed || !pack) return;
    if (!animate) {
      setDiscAtRest(pack, true);
      return;
    }

    blinkEject(trayDuration * 2 + flightDuration);
    await Promise.all([moveTray(true, trayDuration), swingCase(pack, true)]);
    if (disposed) return;
    await transferDisc(pack, true);
    if (disposed) return;
    await Promise.all([moveTray(false, trayDuration), swingCase(pack, false)]);
    await setLed(LED_ON, 300);
  }

  const api = {
    scene,
    camera,
    renderer,
    selectCase,
    insertDisc: serial(doInsert),
    ejectDisc: serial(doEject),
    openTray: () => moveTray(true),
    closeTray: () => moveTray(false),
    setPower: (on) => setLed(on ? LED_ON : LED_OFF),
    invalidate,
    resize,
    hasDisc: () => activeCase?.disc.parent === traySeat,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      for (const tw of tweens) tw.done();
      tweens.clear();
      pendingCase = null;
      disposeObject(scene);
      for (const t of textures) t.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  invalidate();
  return api;
}
