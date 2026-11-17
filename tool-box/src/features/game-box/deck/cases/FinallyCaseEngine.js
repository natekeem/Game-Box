/**
 * Finally 3D Game Cases Engine (Web Adapter)
 * Ported from: otisabiburada/finally-3d-game-cases-plugin
 * Git commit: 7e748d4bfad4e22ebccb318827724796bfeaf149
 * Original Author: SANSO
 * License: BSD-3-Clause
 *
 * Direct recreation of the 3D game case rendering, shelf transforms,
 * procedural Web Audio SFX, and Web Animations API disc extraction/insertion.
 */

export const STYLE_IDS = [
  'black', 'white', 'red', 'blue', 'green', 'gold', 'purple', 'grey',
  'ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'psp', 'xbox', 'x360', 'wee', 'wee2', 'dreamcast', 'sega', 'pc',
];

export const STYLE_LABELS = {
  black: 'Black (PC)', white: 'White', red: 'Red', blue: 'Blue', green: 'Green (Xbox)',
  gold: 'Gold', purple: 'Purple', grey: 'Grey (Retro)',
  ps1: 'PS1 grey', ps2: 'PS2 dark blue', ps3: 'PS3 crystal gray', ps4: 'PS4 open blue', ps5: 'PS5 blue',
  psp: 'PSP black', xbox: 'Xbox dark green', x360: 'Xbox 360 open green', wee: 'White', wee2: 'Cyan',
  dreamcast: 'Dreamcast', sega: 'Sega Genesis', pc: 'PC big box',
};

export const STYLE_SHORT = {
  black: 'Black', white: 'White', red: 'Secret', blue: 'Blue', green: 'Green', gold: 'Gold', purple: 'Purple', grey: 'Grey',
  ps1: 'PS1', ps2: 'PS2', ps3: 'PS3', ps4: 'PS4', ps5: 'PS5', psp: 'PSP', xbox: 'Xbox', x360: '360', wee: 'Wee', wee2: 'Wee Too',
  dreamcast: 'DC', sega: 'Sega', pc: 'PC',
};

export const PALETTE = {
  black: { a: '#2c2f36', b: '#07080a', band: '#3b3f48', text: '#ffffff', line: 'rgba(255,255,255,.22)' },
  white: { a: '#ffffff', b: '#c9ccd3', band: '#e4e6ea', text: '#1d1f24', line: 'rgba(0,0,0,.18)' },
  red: { a: '#ff2a38', b: '#7d000a', band: '#e60012', text: '#ffffff', line: 'rgba(255,255,255,.28)' },
  blue: { a: '#2b86ff', b: '#05306e', band: '#0070d1', text: '#ffffff', line: 'rgba(255,255,255,.28)' },
  green: { a: '#34c24a', b: '#0b4a16', band: '#107c10', text: '#ffffff', line: 'rgba(255,255,255,.28)' },
  gold: { a: '#f6d365', b: '#8a6a10', band: '#d4a017', text: '#2a1d00', line: 'rgba(255,255,255,.35)' },
  purple: { a: '#a566ee', b: '#3a1566', band: '#7b2fbe', text: '#ffffff', line: 'rgba(255,255,255,.28)' },
  grey: { a: '#c3c7ce', b: '#555961', band: '#8d9199', text: '#101214', line: 'rgba(255,255,255,.3)' },
  ps1: { a: '#9a9da5', b: '#2b2d31', band: '#5b5e66', text: '#ffffff', line: 'rgba(255,255,255,.25)' },
  ps2: { a: '#2547c4', b: '#081552', band: '#0e2a8f', text: '#ffffff', line: 'rgba(255,255,255,.25)' },
  ps3: { a: 'rgba(222,227,236,.55)', b: 'rgba(118,124,138,.70)', band: 'rgba(150,156,170,.75)', text: '#10151c', line: 'rgba(255,255,255,.55)' },
  ps4: { a: '#63bcff', b: '#1f7ae8', band: '#2f94ff', text: '#06203f', line: 'rgba(255,255,255,.35)' },
  ps5: { a: '#3a8fe8', b: '#0b4396', band: '#1560c4', text: '#ffffff', line: 'rgba(255,255,255,.28)' },
  psp: { a: '#34363c', b: '#08080a', band: '#16171a', text: '#ffffff', line: 'rgba(255,255,255,.2)' },
  xbox: { a: '#2e8b2e', b: '#0a380a', band: '#176b17', text: '#ffffff', line: 'rgba(255,255,255,.25)' },
  x360: { a: '#8ae857', b: '#35a81c', band: '#62d42e', text: '#0b2a05', line: 'rgba(255,255,255,.4)' },
  wee: { a: '#fbfcfe', b: '#b7c2cf', band: '#00b4e6', text: '#16202b', line: 'rgba(0,0,0,.18)' },
  wee2: { a: '#52d6ff', b: '#0a7ba8', band: '#00a9e0', text: '#042a3a', line: 'rgba(255,255,255,.4)' },
  dreamcast: { a: '#ffffff', b: '#c9ccd3', band: '#f26a21', text: '#1d1f24', line: 'rgba(0,0,0,.18)' },
  pc: { a: '#2a475e', b: '#0f1a24', band: '#66c0f4', text: '#ffffff', line: 'rgba(255,255,255,.25)' },
  sega: { a: '#30343c', b: '#050507', band: '#0060a8', text: '#ffffff', line: 'rgba(255,255,255,.2)' },
};

export const SHAPE_IDS = ['keepcase', 'cartridge', 'jewel', 'bigbox'];
export const SHAPE_LABELS = {
  auto: 'Auto', keepcase: 'Keepcase', cartridge: 'Cartridge case', jewel: 'Jewel case', bigbox: 'Big box',
};
export const SHAPES = {
  keepcase: { depth: 1, radius: 2, rim: 0 },
  cartridge: { depth: 0.5, radius: 5, rim: 0 },
  jewel: { depth: 0.45, radius: 1, rim: 3 },
  bigbox: { depth: 2.4, radius: 0, rim: 0 },
};
export const SLEEVE_R = { keepcase: 7, cartridge: 10, jewel: 2, bigbox: 2 };
export const STYLE_SHAPE = { red: 'cartridge', psp: 'cartridge', ps1: 'jewel', dreamcast: 'jewel', pc: 'bigbox' };

export const WEAR_IDS = ['none', 'sealed', 'light', 'worn', 'battered', 'faded', 'rental'];
export const WEAR_LABELS = {
  none: 'Mint', sealed: 'Sealed (never opened)', light: 'Light scuffs', worn: 'Well worn', battered: 'Battered', faded: 'Sun-faded', rental: 'Rental sticker',
};
export const SCUFF = 'repeating-linear-gradient(118deg, rgba(255,255,255,.08) 0 1px, transparent 1px 19px)';
export const WEAR_CSS = {
  none: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))',
  sealed: 'linear-gradient(115deg, rgba(255,255,255,.26) 0 7%, transparent 7% 30%, rgba(255,255,255,.16) 30% 33%, transparent 33%), radial-gradient(circle at 86% 91%, #ffd44d 0 4.5%, #b98a12 4.5% 6%, transparent 6.2%), repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 5px)',
  light: `${SCUFF}, repeating-linear-gradient(62deg, rgba(0,0,0,.07) 0 1px, transparent 1px 27px)`,
  worn: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,.38), transparent 14%), radial-gradient(circle at 100% 0%, rgba(255,255,255,.30), transparent 12%), radial-gradient(circle at 100% 100%, rgba(255,255,255,.34), transparent 15%), radial-gradient(circle at 0% 100%, rgba(255,255,255,.30), transparent 12%), repeating-linear-gradient(118deg, rgba(255,255,255,.14) 0 1px, transparent 1px 13px), repeating-linear-gradient(72deg, rgba(0,0,0,.14) 0 1px, transparent 1px 17px), linear-gradient(90deg, rgba(0,0,0,.18), transparent 12%, transparent 88%, rgba(0,0,0,.18))',
  battered: 'radial-gradient(circle at 0% 0%, rgba(255,255,255,.55), transparent 24%), radial-gradient(circle at 100% 0%, rgba(255,255,255,.5), transparent 22%), radial-gradient(circle at 100% 100%, rgba(255,255,255,.55), transparent 26%), radial-gradient(circle at 0% 100%, rgba(255,255,255,.5), transparent 22%), linear-gradient(100deg, transparent 49.6%, rgba(255,255,255,.4) 50%, transparent 50.5%), linear-gradient(0deg, rgba(70,45,20,.30), transparent 34%), repeating-linear-gradient(118deg, rgba(255,255,255,.2) 0 1px, transparent 1px 9px), repeating-linear-gradient(72deg, rgba(0,0,0,.2) 0 1px, transparent 1px 12px), repeating-linear-gradient(160deg, rgba(255,255,255,.12) 0 1px, transparent 1px 21px), linear-gradient(90deg, rgba(0,0,0,.34), transparent 18%, transparent 82%, rgba(0,0,0,.34))',
  faded: 'linear-gradient(180deg, rgba(255,238,200,.34), rgba(255,238,200,.12) 70%, rgba(255,238,200,.05)), linear-gradient(rgba(190,170,120,.12), rgba(190,170,120,.12))',
  rental: `linear-gradient(90deg, #d33 0 12%, #f3f0e4 12% 100%) 7% 92% / 38% 5.5% no-repeat, ${SCUFF}`,
};

export const DEFAULT_CASE_SETTINGS = {
  enabled: true,
  angle: 32,
  depth: 24,
  color: 'black',
  gloss: true,
  shadow: true,
  band: true,
  spineTitle: true,
  float: true,
  idleTilt: 0,
  shape: 'auto',
  wear: 'none',
  shine: true,
  sleeve: true,
  pickup: true,
  neighbors: true,
  speed: 'normal',
  insertSound: true,
  insertTarget: 'auto',
};

export function shapeFor(settings, styleId) {
  if (settings && settings.shape && settings.shape !== 'auto') return settings.shape;
  return STYLE_SHAPE[styleId] || 'keepcase';
}

export function paletteFor(styleId) {
  return PALETTE[styleId] || PALETTE.black;
}

export function lookFor(game, customSettings = {}) {
  const s = { ...DEFAULT_CASE_SETTINGS, ...customSettings };
  const style = game.caseStyle || game.style || 'black';
  const pal = game.casePalette || paletteFor(style);
  const shapeId = shapeFor(s, style);
  const base = SHAPES[shapeId] || SHAPES.keepcase;
  const shape = s.sleeve ? { ...base, radius: SLEEVE_R[shapeId] || base.radius } : base;
  const depthPx = Math.max(4, Math.round(s.depth * shape.depth));
  const wear = game.wear || s.wear || 'none';
  return {
    style,
    pal,
    shapeId,
    shape,
    depthPx,
    wear,
  };
}

/**
 * Builds the complete CSS stylesheet directly ported from finally-3d-game-cases engine.ts
 */
export function buildCss(s = DEFAULT_CASE_SETTINGS) {
  const d = Math.round(s.depth || 24);
  const T = s.speed === 'calm' ? 0.8 : s.speed === 'snappy' ? 0.28 : 0.5;
  const EASE = 'cubic-bezier(.22,.8,.26,1)';
  const A = s.angle || 32;

  const STATE = ':is(:hover, .gpfocus, .selected, :focus-within)';
  const P = '[data-sanso-pop]';
  const ACT = (inner, extra, st) => `${P}${extra}${st}${inner}, .selected ${P}${extra}${inner}`;
  const ACTC = (inner, st) => `[data-sanso-pop]${st} [data-sanso-case]${inner}, [data-sanso-case][data-sanso-pop]${st}${inner}, .selected [data-sanso-case]${inner}`;
  const ANG = `var(--c3d-ang, ${A}deg)`;
  const TR = `transform ${T}s ${EASE}, rotate ${T}s ${EASE}, translate ${T}s ${EASE}, scale ${T}s ${EASE}, box-shadow ${T}s ${EASE}, transform-origin ${T}s ${EASE}`;
  const XF = (dx, dy, ang) => `perspective(1600px) translate3d(${dx}, ${dy}, 16px) rotateY(${ang})`;

  const gloss = s.gloss
    ? `linear-gradient(112deg, rgba(255,255,255,.36) 0%, rgba(255,255,255,.10) 15%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 60%, rgba(255,255,255,.12) 72%, rgba(255,255,255,0) 73.5%),
       linear-gradient(180deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 22%),`
    : '';

  const band = s.band
    ? `linear-gradient(180deg, var(--c3d-band) 0, var(--c3d-band) 5.2%, rgba(0,0,0,.35) 5.2%, rgba(0,0,0,.35) calc(5.2% + 1px), transparent calc(5.2% + 1px)),`
    : '';

  const idleShadow = s.shadow ? `box-shadow: 4px 6px 12px rgba(0,0,0,.45) !important;` : '';
  const popShadow = s.shadow
    ? `box-shadow: ${Math.round(d * 1.1)}px ${Math.round(d * 1.5)}px 28px rgba(0,0,0,.65), ${Math.round(d * 0.3)}px ${Math.round(d * 0.4)}px 8px rgba(0,0,0,.4) !important;`
    : '';

  const f = Math.min(1, Math.max(0.3, A / 32));
  const x = (v) => `${(v * f).toFixed(1)}px`;
  const floatKf = s.float
    ? `@keyframes sanso-drift {
  0%, 100% { translate: 0 0 -.4px; rotate: 0 1 0 0deg; }
  25% { translate: ${x(-1.5)} -1.5px -.4px; rotate: 0 1 0 ${(1.5 * f).toFixed(2)}deg; }
  50% { translate: 0 .5px -.4px; rotate: 0 1 0 0deg; }
  75% { translate: ${x(-1)} 1.5px -.4px; rotate: 0 1 0 ${(-1.2 * f).toFixed(2)}deg; }
}`
    : '';

  const shine = s.shine
    ? `
[data-sanso-faces] > [data-f="shine"] {
  top: 0; right: 0; bottom: 0; left: 0; transform: translateZ(2px); border-radius: var(--c3d-r, 2px);
  background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.6) 50%, transparent 62%) 160% 0 / 260% 100% no-repeat;
}
@keyframes sanso-shine { from { background-position: 160% 0; } to { background-position: -60% 0; } }`
    : `[data-sanso-faces] > [data-f="shine"] { display: none; }`;

  const activeRules = `
${ACT('', ':not(img)', STATE)}, ${ACTC('[data-sanso-case="box"]', STATE)} { transform-style: preserve-3d !important; }
${ACT('', '', STATE)} { transition: ${TR}, transform-style 0s linear 0s !important; }
${ACTC('[data-sanso-case="box"] > img', STATE)} { translate: 0 0 .6px; transition: filter ${T}s ${EASE}, translate 0s linear 0s; }
${ACTC('[data-sanso-case="box"]::after', STATE)} { transform: translateZ(1px); transition: transform 0s linear 0s; }
${ACT('', ':not([data-sanso-own])', STATE)} { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; transform-origin: 100% 50% !important; z-index: 12; opacity: 1 !important; }
${ACT('', '[data-sanso-own]', STATE)} { transform: ${XF('0px', '8px', ANG)}; transform-origin: 100% 50% !important; z-index: 12; opacity: 1 !important; }
${ACT('', ':not(img)', STATE)} { ${popShadow} }
${s.float ? `${ACTC(':not([data-sanso-pop])', STATE)} { animation: sanso-drift 6s ease-in-out ${(T + 0.05).toFixed(2)}s infinite; }` : ''}
${ACTC('[data-sanso-case="box"] > img', STATE)} { filter: brightness(1.05); }
${ACTC('[data-sanso-case="box"]', STATE)} { opacity: 1 !important; }
${ACTC(' > [data-sanso-faces]', STATE)} { display: block !important; transition-delay: 0s; }
${s.shine ? `${ACTC(' > [data-sanso-faces] > [data-f="shine"]', STATE)} { animation: sanso-shine 1.1s ease-out .15s 1 both; }` : ''}
`;

  const PICK = (ang, z, dy) => `perspective(1600px) translate3d(0, ${dy}px, ${z}px) rotateY(${ang === A ? ANG : ang + 'deg'})`;
  const pick = s.pickup ? `
@keyframes sanso-pick { 0% { transform: ${PICK(A, 16, 8)}; } 45% { transform: ${PICK(Math.round(A * 0.35), 70, -4)}; } 100% { transform: ${PICK(A, 16, 8)}; } }
@keyframes sanso-pick-i { 0% { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; } 45% { rotate: 0 1 0 ${Math.round(A * 0.35)}deg; translate: 0 -4px 70px; } 100% { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; } }
${P}[data-sanso-pick][data-sanso-own] { animation: sanso-pick .42s cubic-bezier(.3,.7,.3,1) both; z-index: 20 !important; }
${P}[data-sanso-pick]:not([data-sanso-own]) { animation: sanso-pick-i .42s cubic-bezier(.3,.7,.3,1) both; z-index: 20 !important; }` : '';

  const LEAN = 9;
  const NB = (sel, left) => `${sel} ${P}[data-sanso-own] { transform: perspective(1600px) translateZ(-6px) rotateY(${left ? LEAN : -LEAN}deg); transform-origin: ${left ? '0% 50%' : '100% 50%'} !important; }
${sel} ${P}:not([data-sanso-own]) { rotate: 0 1 0 ${left ? LEAN : -LEAN}deg; translate: 0 0 -6px; transform-origin: ${left ? '0% 50%' : '100% 50%'} !important; }`;
  const neighbors = s.neighbors ? `
${NB('[data-sanso-cell]:hover + [data-sanso-cell]', false)}
${NB('[data-sanso-cell]:has(+ [data-sanso-cell]:hover)', true)}
${NB('[data-sanso-cell].selected + [data-sanso-cell]', false)}
${NB('[data-sanso-cell]:has(+ [data-sanso-cell].selected)', true)}` : '';

  return `
/* Finally 3D Game Cases Engine CSS - Original Geometry and Lighting */
${floatKf}
[data-sanso-stage="big"] { perspective: 1600px !important; perspective-origin: 50% 50% !important; }
[data-sanso-stage="small"] { perspective: 1100px !important; perspective-origin: 50% -30% !important; }
[data-sanso-stage="own"] { perspective: none !important; }

[data-sanso-pop] {
  transform-origin: 100% 50% !important;
  transition: ${TR}, transform-style 0s linear ${T}s !important;
  transition-behavior: allow-discrete !important;
  display: inline-block;
  cursor: pointer;
  position: relative;
}

[data-sanso-pop]:not(img), [data-sanso-case="box"] {
  overflow: visible !important;
  filter: none !important;
  contain: none !important;
}

[data-sanso-case="box"] {
  border-radius: var(--c3d-r, 2px);
  ${idleShadow}
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  background-color: var(--c3d-b, #111);
}

[data-sanso-case="box"] img {
  border-radius: var(--c3d-r, 2px);
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

[data-sanso-case="box"] > img {
  filter: brightness(.92);
  transition: filter ${T}s ${EASE}, translate 0s linear ${T}s;
}

/* resting cover: physical overlay with gloss, sleeve seam, and wear textures */
[data-sanso-case="box"]::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: var(--c3d-r, 2px);
  transition: transform 0s linear ${T}s;
  background:
    var(--c3d-wear, linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))),
    ${gloss}
    ${band}
    ${s.sleeve ? `linear-gradient(90deg, transparent 3.2%, rgba(255,255,255,.34) 3.2%, rgba(255,255,255,.34) 3.9%, rgba(0,0,0,.30) 3.9%, rgba(0,0,0,.30) 5%, rgba(255,255,255,.06) 5%, transparent 9%),
    linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0) 1.6%, rgba(255,255,255,0) 98.4%, rgba(0,0,0,.25)),` : ''}
    linear-gradient(90deg, rgba(0,0,0,.42) 0, rgba(255,255,255,.22) 1.5%, rgba(0,0,0,.16) 3.2%, rgba(0,0,0,0) 7.5%);
  box-shadow: inset 0 0 0 1px var(--c3d-line), inset 0 0 0 var(--c3d-rim, 0px) rgba(255,255,255,.5), inset 0 0 0 3px rgba(0,0,0,.18)${s.sleeve ? ', inset 0 0 0 4px rgba(255,255,255,.10), inset 0 0 0 5px rgba(0,0,0,.16)' : ''};
}

/* 3D Faces */
[data-sanso-faces] {
  display: none;
  transition-property: display;
  transition-duration: 0s;
  transition-delay: ${T}s;
  transition-behavior: allow-discrete;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 3;
}

[data-sanso-faces] > div {
  position: absolute;
  box-sizing: border-box;
}

[data-sanso-faces] > [data-f="front"] {
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateZ(1px);
  border-radius: var(--c3d-r, 2px);
}

[data-sanso-faces] > [data-f="spine"] {
  top: 0; bottom: 0; left: 0;
  width: var(--c3d-d, ${d}px);
  min-width: 12px;
  transform-origin: left center;
  transform: rotateY(90deg);
  background:
    linear-gradient(180deg, var(--c3d-band) 0, var(--c3d-band) 5.2%, rgba(0,0,0,.35) 5.2%, rgba(0,0,0,.35) calc(5.2% + 1px), transparent calc(5.2% + 1px)),
    linear-gradient(90deg, var(--c3d-a), var(--c3d-b));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.2);
}

[data-sanso-faces] > [data-f="spine"] > span {
  writing-mode: vertical-rl;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 86%;
  margin-top: 8%;
  font-weight: 800;
  font-family: sans-serif;
  line-height: 1;
  font-size: max(10px, calc(var(--c3d-d, ${d}px) * .72));
  color: var(--c3d-text);
  transform: scaleX(-1);
  letter-spacing: .05em;
  text-shadow: 0 0 2px rgba(0,0,0,.75), 0 1px 1px rgba(0,0,0,.6);
}

[data-sanso-faces] > [data-f="top"] {
  top: 0; left: 0; right: 0;
  height: var(--c3d-d, ${d}px);
  transform-origin: center top;
  transform: rotateX(-90deg);
  background: linear-gradient(0deg, var(--c3d-b), var(--c3d-a));
}

[data-sanso-faces] > [data-f="bottom"] {
  bottom: 0; left: 0; right: 0;
  height: var(--c3d-d, ${d}px);
  transform-origin: center bottom;
  transform: rotateX(90deg);
  background: linear-gradient(180deg, var(--c3d-b), #000);
}

[data-sanso-faces] > [data-f="right"] {
  top: 0; bottom: 0; right: 0;
  width: var(--c3d-d, ${d}px);
  transform-origin: right center;
  transform: rotateY(-90deg);
  background: linear-gradient(270deg, var(--c3d-b), var(--c3d-a));
}

[data-sanso-faces] > [data-f="back"] {
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateZ(calc(var(--c3d-d, ${d}px) * -1)) rotateY(180deg);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: var(--c3d-b);
}

${shine}
${activeRules}
${neighbors}
${pick}
`;
}

export function ensureCaseStyle(doc = document, settings = DEFAULT_CASE_SETTINGS) {
  const STYLE_ID = 'sanso-3d-cases-style';
  let st = doc.getElementById(STYLE_ID);
  const css = buildCss(settings);
  if (!st) {
    st = doc.createElement('style');
    st.id = STYLE_ID;
    (doc.head || doc.documentElement).appendChild(st);
  }
  if (st.textContent !== css) {
    st.textContent = css;
  }
  return st;
}

/**
 * Web Audio procedural sound synthesis directly ported from engine.ts
 */
export function insertSounds(view = window, card = false, volume = 0.85, mode = 'insert', warp = (ms) => ms) {
  try {
    const AC = view.AudioContext || view.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    const master = ctx.createGain();
    master.gain.value = Math.max(0, Math.min(1, volume));
    master.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.03;

    const noise = (len) => {
      const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
      const ch = b.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      return b;
    };

    const click = (ms, freq, len, gain, q = 2) => {
      const s = ctx.createBufferSource();
      s.buffer = noise(len);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      const at = t0 + warp(ms) / 1000;
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(gain, at + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(at);
      s.stop(at + len + 0.02);
    };

    const thump = (ms, freq, len, gain) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      const g = ctx.createGain();
      const at = t0 + warp(ms) / 1000;
      o.frequency.setValueAtTime(freq * 1.6, at);
      o.frequency.exponentialRampToValueAtTime(freq, at + len * 0.6);
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(gain, at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      o.connect(g);
      g.connect(master);
      o.start(at);
      o.stop(at + len + 0.02);
    };

    const slide = (ms, len, f1, f2, gain) => {
      const s = ctx.createBufferSource();
      s.buffer = noise(len);
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.Q.value = 1.2;
      const at = t0 + warp(ms) / 1000;
      f.frequency.setValueAtTime(f1, at);
      f.frequency.exponentialRampToValueAtTime(f2, at + len);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(gain, at + len * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(at);
      s.stop(at + len + 0.02);
    };

    const motor = (ms, len, gain) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      const g = ctx.createGain();
      const at = t0 + warp(ms) / 1000;
      o.frequency.setValueAtTime(70, at);
      o.frequency.exponentialRampToValueAtTime(240, at + len);
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(gain, at + len * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      o.connect(lp);
      lp.connect(g);
      g.connect(master);
      o.start(at);
      o.stop(at + len + 0.02);
    };

    if (mode === 'eject') {
      const spinDown = (ms, len, gain) => {
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 900;
        const g = ctx.createGain();
        const at = t0 + warp(ms) / 1000;
        o.frequency.setValueAtTime(240, at);
        o.frequency.exponentialRampToValueAtTime(60, at + len);
        g.gain.setValueAtTime(0, at);
        g.gain.linearRampToValueAtTime(gain, at + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0008, at + len);
        o.connect(lp);
        lp.connect(g);
        g.connect(master);
        o.start(at);
        o.stop(at + len + 0.02);
      };

      click(330, 3200, 0.03, 0.5);
      thump(350, 140, 0.08, 0.22);
      if (!card) spinDown(420, 0.45, 0.05);
      click(600, 2200, 0.04, 0.45, 3);
      thump(610, 110, 0.1, 0.4);
      slide(620, 0.3, 2600, 900, card ? 0.35 : 0.28);
      if (card) {
        click(1300, 4200, 0.025, 0.4);
      } else {
        click(1290, 3600, 0.03, 0.3);
        click(1310, 5200, 0.02, 0.35);
      }
      click(1820, 2800, 0.035, 0.55);
      thump(1840, 160, 0.08, 0.3);
      view.setTimeout(() => { try { ctx.close(); } catch {} }, 3200);
      return;
    }

    // Insert sequence
    click(380, 3200, 0.03, 0.55);
    thump(400, 140, 0.08, 0.25);
    click(880, 2400, 0.04, 0.35);
    if (card) {
      click(900, 4200, 0.025, 0.4);
    } else {
      click(890, 5200, 0.02, 0.35);
      click(915, 3600, 0.03, 0.3);
    }
    slide(1320, 0.3, 900, 2600, card ? 0.35 : 0.28);
    if (card) {
      click(1575, 1800, 0.05, 0.6, 3);
      thump(1580, 110, 0.12, 0.5);
    } else {
      thump(1585, 95, 0.14, 0.5);
      click(1580, 2200, 0.04, 0.45, 3);
      motor(1600, 0.55, 0.06);
    }
    click(1850, 2800, 0.035, 0.5);
    thump(1855, 160, 0.07, 0.25);

    view.setTimeout(() => { try { ctx.close(); } catch {} }, 3200);
  } catch {}
}

function boxEl(doc, css) {
  const e = doc.createElement('div');
  e.style.cssText = 'position:absolute;box-sizing:border-box;' + css;
  return e;
}

/**
 * Executes the complete 3D case open, disc extract, and insertion into slot animation
 * Directly ported from engine.ts runInsert
 */
export function runInsert(
  doc = document,
  src,
  target = 'auto',
  sound = true,
  opts = {}
) {
  return new Promise((resolve) => {
    const view = doc.defaultView || window;
    if (!view || !doc.body || typeof doc.body.animate !== 'function') {
      resolve(false);
      return;
    }

    // Support reduced motion
    const prefersReducedMotion =
      typeof view.matchMedia === 'function' &&
      view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (opts.onStateChange) opts.onStateChange('done');
      resolve(true);
      return;
    }

    const old = doc.getElementById('sanso-insert');
    if (old) old.remove();

    const W = view.innerWidth, H = view.innerHeight;
    if (W < 200 || H < 200) {
      resolve(false);
      return;
    }

    const variant = target === 'auto' ? (W >= 1800 ? 'console' : 'handheld') : target;
    const L = src.look;
    const pal = L.pal;
    const art = src.art ? `url(${JSON.stringify(src.art)})` : `linear-gradient(160deg, ${pal.a}, ${pal.b})`;
    const card = L.shapeId === 'cartridge';
    const rad = Math.max(3, L.shape.radius + 2);

    const ch = Math.round(Math.min(H * 0.56, W * 0.42 * 1.5));
    const cw = Math.round(ch / 1.5);
    const cx = Math.round(W * 0.54 - cw / 2);
    const cy = Math.round(H * 0.42 - ch / 2);
    const d = Math.max(10, Math.round(cw * (card ? 0.06 : 0.1)));

    const r0 = src.rect && src.rect.width > 30 && src.rect.top < H && src.rect.top + src.rect.height > 0 ? src.rect : null;
    const s0 = r0 ? r0.width / cw : 0.82;
    const x0 = r0 ? r0.left + r0.width / 2 - (cx + cw / 2) : 0;
    const y0 = r0 ? r0.top + r0.height / 2 - (cy + ch / 2) : 30;

    const root = boxEl(
      doc,
      `position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:2147483000;pointer-events:none;overflow:hidden;perspective:1500px;perspective-origin:50% 38%;`
    );
    root.id = 'sanso-insert';

    const shade = boxEl(doc, `inset:0;background:radial-gradient(120% 95% at 55% 40%, rgba(16,21,32,0.85), rgba(3,4,8,0.92));opacity:0;`);
    root.appendChild(shade);

    const glow = boxEl(
      doc,
      `left:${Math.round(cx - cw * 0.9)}px;top:${Math.round(cy - ch * 0.35)}px;width:${Math.round(cw * 2.8)}px;height:${Math.round(ch * 1.7)}px;border-radius:50%;background:radial-gradient(closest-side, ${pal.a}, transparent);opacity:0;filter:blur(30px);`
    );
    root.appendChild(glow);

    const wrap = boxEl(doc, `left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;perspective:1400px;perspective-origin:50% 35%;`);
    const floor = boxEl(doc, `left:-8%;right:-8%;bottom:-9%;height:12%;border-radius:50%;background:radial-gradient(closest-side, rgba(0,0,0,.7), rgba(0,0,0,0));`);
    wrap.appendChild(floor);

    const stage = boxEl(doc, `inset:0;transform-style:preserve-3d;`);
    wrap.appendChild(stage);

    const shell = `linear-gradient(135deg, rgba(255,255,255,.10), rgba(0,0,0,.25)), ${pal.b}`;
    stage.appendChild(boxEl(doc, `inset:0;border-radius:${rad}px;background:${shell};transform:translateZ(-${d}px);box-shadow:0 30px 60px rgba(0,0,0,.55);`));

    const tray = card
      ? `linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.2)), repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, transparent 2px 6px), #15171c`
      : `radial-gradient(circle at 50% 50%, #3d424b 0 4.5%, #0b0c0f 5% 6.5%, #2c3038 7% 10.5%, #121418 11% 42%, rgba(255,255,255,.07) 42.6% 43.4%, #14161b 44% 100%)`;
    stage.appendChild(boxEl(doc, `left:4%;top:3%;right:4%;bottom:3%;border-radius:${Math.max(2, rad - 2)}px;background:${tray};transform:translateZ(-${d - 2}px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06), inset 0 8px 18px rgba(0,0,0,.5);`));

    // Walls
    stage.appendChild(boxEl(doc, `top:0;bottom:0;left:0;width:${d}px;transform-origin:left center;transform:rotateY(90deg);background:linear-gradient(90deg, ${pal.a}, ${pal.b});`));
    stage.appendChild(boxEl(doc, `top:0;bottom:0;right:0;width:${d}px;transform-origin:right center;transform:rotateY(-90deg);background:linear-gradient(270deg, ${pal.b}, ${pal.a});`));
    stage.appendChild(boxEl(doc, `left:0;right:0;top:0;height:${d}px;transform-origin:center top;transform:rotateX(-90deg);background:linear-gradient(0deg, ${pal.b}, ${pal.a});`));
    stage.appendChild(boxEl(doc, `left:0;right:0;bottom:0;height:${d}px;transform-origin:center bottom;transform:rotateX(90deg);background:linear-gradient(180deg, ${pal.b}, #000);`));

    // Front Cover
    const cover = boxEl(doc, `inset:0;transform-origin:left center;transform-style:preserve-3d;`);
    cover.appendChild(boxEl(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;background:${art} center/cover no-repeat, ${pal.b};box-shadow:inset 0 0 0 1px ${pal.line};`));
    cover.appendChild(boxEl(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:translateZ(.6px);background:linear-gradient(90deg, rgba(0,0,0,.35) 0, rgba(255,255,255,.28) 1.6%, rgba(0,0,0,.15) 3.4%, transparent 7%), linear-gradient(115deg, rgba(255,255,255,.34), rgba(255,255,255,0) 32%, rgba(255,255,255,0) 62%, rgba(255,255,255,.12) 74%, transparent 76%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3), inset 0 0 0 4px rgba(255,255,255,.08);`));

    const glint = boxEl(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:translateZ(.8px);overflow:hidden;`);
    const glintBar = boxEl(doc, `top:-20%;bottom:-20%;left:-60%;width:45%;background:linear-gradient(100deg, transparent, rgba(255,255,255,.38), transparent);transform:skewX(-14deg);`);
    glint.appendChild(glintBar);
    cover.appendChild(glint);
    cover.appendChild(boxEl(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(rgba(12,14,19,.84), rgba(12,14,19,.92)), ${art} center/cover no-repeat;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);`));
    stage.appendChild(cover);
    root.appendChild(wrap);

    // Slot setup
    const handheld = variant !== 'console';
    // If custom target coordinates passed in opts.slotRect, use them
    let slotY = H - 12;
    let slotX = W - 12;
    if (opts.slotRect) {
      slotX = Math.round(opts.slotRect.left + opts.slotRect.width / 2);
      slotY = Math.round(opts.slotRect.top + opts.slotRect.height / 2);
    }

    const D = Math.round(card ? cw * 0.5 : cw * 0.76);
    const DH = card ? Math.round(D * 1.16) : D;
    const dcx = cx + cw / 2;
    const dcy = cy + ch * (card ? 0.36 : 0.5);

    const layer = boxEl(doc, `inset:0;${handheld ? `clip-path:inset(0 0 ${Math.max(0, H - slotY)}px 0);` : `clip-path:inset(0 ${Math.max(0, W - slotX)}px 0 0);`}`);
    const holder = boxEl(doc, `left:${Math.round(dcx - D / 2)}px;top:${Math.round(dcy - DH / 2)}px;width:${D}px;height:${DH}px;opacity:0;will-change:transform,opacity;`);
    const shadow = boxEl(doc, `left:6%;top:9%;width:88%;height:88%;border-radius:${card ? '10px' : '50%'};background:rgba(0,0,0,.55);filter:blur(10px);`);
    holder.appendChild(shadow);

    const makeItem = () => {
      const el = boxEl(doc, 'inset:0;');
      if (card) {
        const c = boxEl(doc, `inset:0;border-radius:7px;clip-path:polygon(0 0, 80% 0, 100% 12%, 100% 100%, 0 100%);background:linear-gradient(180deg,#2c2f36,#101216);box-shadow:inset 0 0 0 2px rgba(255,255,255,.18);`);
        c.appendChild(boxEl(doc, `left:7%;top:6%;right:7%;height:62%;border-radius:4px;background:${art} center/cover no-repeat;box-shadow:0 0 0 2px rgba(255,255,255,.85);`));
        c.appendChild(boxEl(doc, `left:14%;right:14%;bottom:6%;height:10%;background:repeating-linear-gradient(90deg,#e0bf55 0 3px,#8a6d1c 3px 4px,transparent 4px 7px);border-radius:2px;`));
        c.appendChild(boxEl(doc, `inset:0;background:linear-gradient(120deg, rgba(255,255,255,.28), rgba(255,255,255,0) 40%);`));
        el.appendChild(c);
        return { el, spin: null };
      }
      const hole = 'radial-gradient(circle, transparent 0 6.2%, #000 6.6%)';
      const spin = boxEl(doc, `inset:0;border-radius:50%;background:${art} center/cover no-repeat, ${pal.b};-webkit-mask:${hole};mask:${hole};`);
      spin.appendChild(boxEl(doc, `inset:0;border-radius:50%;background:radial-gradient(circle, transparent 0 6.4%, rgba(230,236,245,.62) 6.8% 15.2%, rgba(255,255,255,.95) 15.5% 16.1%, rgba(0,0,0,.25) 16.4% 17%, transparent 17.4% 95.6%, rgba(255,255,255,.7) 96.2% 97.4%, rgba(0,0,0,.45) 98%);`));
      el.appendChild(spin);
      el.appendChild(boxEl(doc, `inset:0;border-radius:50%;-webkit-mask:${hole};mask:${hole};background:conic-gradient(from 40deg, rgba(255,255,255,0) 0, rgba(255,255,255,.30) 6%, rgba(160,220,255,.14) 11%, rgba(255,255,255,0) 17%, rgba(255,255,255,0) 50%, rgba(255,255,255,.26) 56%, rgba(255,190,240,.12) 61%, rgba(255,255,255,0) 67%);`));
      return { el, spin };
    };

    const flying = makeItem();
    holder.appendChild(flying.el);
    const spinner = flying.spin;

    const seated = makeItem();
    const seat = boxEl(doc, `left:${Math.round(cw / 2 - D / 2)}px;top:${Math.round(ch * (card ? 0.36 : 0.5) - DH / 2)}px;width:${D}px;height:${DH}px;transform:translateZ(-${d - 3}px);`);
    seat.appendChild(seated.el);
    stage.appendChild(seat);
    layer.appendChild(holder);
    root.appendChild(layer);

    const slot = handheld
      ? boxEl(doc, `left:${Math.round(W / 2 - D * 0.62)}px;top:${slotY - 3}px;width:${Math.round(D * 1.24)}px;height:7px;border-radius:4px;background:linear-gradient(180deg,#000,#1b1e24);box-shadow:0 0 0 1px rgba(255,255,255,.16), 0 -1px 0 rgba(255,255,255,.25);opacity:0;`)
      : boxEl(doc, `left:${slotX - 3}px;top:${Math.round(H / 2 - D * 0.62)}px;width:7px;height:${Math.round(D * 1.24)}px;border-radius:4px;background:linear-gradient(90deg,#000,#1b1e24);box-shadow:0 0 0 1px rgba(255,255,255,.16), -1px 0 0 rgba(255,255,255,.25);opacity:0;`);
    const bezel = handheld
      ? boxEl(doc, `left:${Math.round(W / 2 - D * 0.8)}px;top:${slotY - 12}px;width:${Math.round(D * 1.6)}px;height:24px;border-radius:12px;background:linear-gradient(180deg, #2a2e36, #121418);box-shadow:inset 0 1px 0 rgba(255,255,255,.12), 0 6px 18px rgba(0,0,0,.6);opacity:0;`)
      : boxEl(doc, `left:${slotX - 12}px;top:${Math.round(H / 2 - D * 0.8)}px;width:24px;height:${Math.round(D * 1.6)}px;border-radius:12px;background:linear-gradient(90deg, #2a2e36, #121418);box-shadow:inset 1px 0 0 rgba(255,255,255,.12), 0 6px 18px rgba(0,0,0,.6);opacity:0;`);
    const streak = boxEl(
      doc,
      handheld
        ? `left:0;top:2px;width:30%;height:2px;border-radius:2px;background:linear-gradient(90deg, transparent, rgba(150,215,255,.95), transparent);opacity:0;`
        : `top:0;left:2px;height:30%;width:2px;border-radius:2px;background:linear-gradient(180deg, transparent, rgba(150,215,255,.95), transparent);opacity:0;`
    );
    slot.appendChild(streak);
    root.insertBefore(bezel, layer);
    root.appendChild(slot);
    doc.body.appendChild(root);

    const fx = [];
    const A = (el, kf, opt) => {
      fx.push(el.animate(kf, { fill: 'both', ...opt }));
    };

    const eject = !!opts.eject;
    const T_END = 2200;
    const at = (ms) => Math.min(1, Math.max(0, ms / T_END));

    A(shade, [{ opacity: 0 }, { opacity: 1, offset: at(200) }, { opacity: 1, offset: at(1880) }, { opacity: 0 }], { duration: T_END, easing: 'ease-in-out' });
    A(seat, [{ opacity: 1 }, { opacity: 1, offset: at(880) }, { opacity: 0, offset: at(881) }, { opacity: 0 }], { duration: T_END, easing: 'linear' });

    const back = r0 ? `translate(${x0}px,${y0}px) scale(${s0})` : `translate(0,${Math.round(ch * 0.08)}px) scale(.88)`;
    A(glow, [{ opacity: 0 }, { opacity: 0.55, offset: at(500) }, { opacity: 0.4, offset: at(1500) }, { opacity: 0, offset: at(1900) }, { opacity: 0 }], { duration: T_END, easing: 'ease-in-out' });

    A(wrap, [
      { transform: `translate(${x0}px,${y0}px) scale(${s0})`, opacity: 1, easing: 'cubic-bezier(.2,.8,.3,1)' },
      { transform: 'translate(0,-6px) scale(1.035)', opacity: 1, offset: at(360), easing: 'cubic-bezier(.4,0,.3,1)' },
      { transform: 'translate(0,0) scale(1)', opacity: 1, offset: at(520) },
      { transform: 'translate(0,0) scale(1)', opacity: 1, offset: at(1640), easing: 'cubic-bezier(.6,0,.4,1)' },
      { transform: back, opacity: 1, offset: at(1900), easing: 'ease-in' },
      { transform: back, opacity: 0, offset: at(1990) },
      { transform: back, opacity: 0 },
    ], { duration: T_END });

    A(floor, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)', offset: at(420) }, { opacity: 1, transform: 'scale(1)', offset: at(1640) }, { opacity: 0, transform: 'scale(.7)', offset: at(1880) }, { opacity: 0 }], { duration: T_END, easing: 'ease-out' });
    A(glintBar, [{ transform: 'translateX(0) skewX(-14deg)' }, { transform: 'translateX(0) skewX(-14deg)', offset: at(80) }, { transform: `translateX(${Math.round(cw * 2.6)}px) skewX(-14deg)`, offset: at(560) }, { transform: `translateX(${Math.round(cw * 2.6)}px) skewX(-14deg)` }], { duration: T_END, easing: 'cubic-bezier(.4,0,.2,1)' });

    A(stage, [
      { transform: 'rotateX(0deg) rotateY(0deg)', easing: 'cubic-bezier(.2,.8,.3,1)' },
      { transform: 'rotateX(8deg) rotateY(-22deg)', offset: at(480), easing: 'ease-in-out' },
      { transform: 'rotateX(6deg) rotateY(-14deg)', offset: at(1500), easing: 'ease-in-out' },
      { transform: 'rotateX(5deg) rotateY(-10deg)', offset: at(1830), easing: 'ease-out' },
      { transform: 'rotateX(3deg) rotateY(-12deg)', offset: at(1870), easing: 'ease-in-out' },
      { transform: 'rotateX(0deg) rotateY(0deg)' },
    ], { duration: T_END });

    A(cover, [
      { transform: 'rotateY(0deg)' },
      { transform: 'rotateY(0deg)', offset: at(380), easing: 'cubic-bezier(.5,0,.3,1)' },
      { transform: 'rotateY(-168deg)', offset: at(860), easing: 'ease-in-out' },
      { transform: 'rotateY(-157deg)', offset: at(960), easing: 'ease-in-out' },
      { transform: 'rotateY(-160deg)', offset: at(1040) },
      { transform: 'rotateY(-160deg)', offset: at(1520), easing: 'cubic-bezier(.55,0,.85,.35)' },
      { transform: 'rotateY(0deg)', offset: at(1830) },
      { transform: 'rotateY(0deg)' },
    ], { duration: T_END });

    const tx = handheld ? W / 2 - dcx : slotX + D * 0.7 - dcx;
    const ty = handheld ? slotY + DH * 0.62 - dcy : H / 2 - dcy;
    const preX = handheld ? W / 2 - dcx : slotX - D * 0.8 - dcx;
    const preY = handheld ? slotY - DH * 0.75 - dcy : H / 2 - dcy;
    const midX = handheld ? preX * 0.5 - D * 0.18 : preX * 0.5;
    const midY = handheld ? preY * 0.42 : preY * 0.5 - DH * 0.25;
    const edge = handheld ? (card ? 'rotateX(0deg)' : 'rotateX(72deg)') : (card ? 'rotateY(0deg)' : 'rotateY(72deg)');
    const half = handheld ? (card ? 'rotateX(0deg) rotateZ(-6deg)' : 'rotateX(30deg) rotateZ(-4deg)') : (card ? 'rotateY(0deg)' : 'rotateY(30deg)');
    const inTray = 'rotateX(6deg) rotateY(-14deg)';
    const Ppos = (px, py, pr, ps) => `perspective(1000px) translate(${Math.round(px)}px,${Math.round(py)}px) ${pr} scale(${ps})`;

    A(holder, [
      { opacity: 0, transform: Ppos(0, 0, inTray, 0.97) },
      { opacity: 0, transform: Ppos(0, 0, inTray, 0.97), offset: at(879) },
      { opacity: 1, transform: Ppos(0, 0, inTray, 0.97), offset: at(880), easing: 'cubic-bezier(.2,.8,.3,1)' },
      { opacity: 1, transform: Ppos(0, -ch * 0.06, 'rotateX(-4deg) rotateY(3deg)', 1.07), offset: at(1010), easing: 'ease-in-out' },
      { opacity: 1, transform: Ppos(0, -ch * 0.055, 'rotateX(2deg) rotateY(-2deg)', 1.06), offset: at(1080), easing: 'cubic-bezier(.45,0,.55,1)' },
      { opacity: 1, transform: Ppos(midX, midY, half, 0.95), offset: at(1250), easing: 'cubic-bezier(.45,0,.55,1)' },
      { opacity: 1, transform: Ppos(preX, preY, edge, 0.84), offset: at(1430), easing: 'cubic-bezier(.6,0,1,.5)' },
      { opacity: 1, transform: Ppos(tx, ty, edge, 0.82), offset: at(1580) },
      { opacity: 0, transform: Ppos(tx, ty, edge, 0.82) },
    ], { duration: T_END });

    A(root, [{ transform: 'translate(0,0)' }, { transform: 'translate(0,0)', offset: at(1575) }, { transform: 'translate(0,2.5px)', offset: at(1605) }, { transform: 'translate(0,-1px)', offset: at(1650) }, { transform: 'translate(0,0)', offset: at(1700) }, { transform: 'translate(0,0)' }], { duration: T_END, easing: 'ease-out' });
    A(bezel, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 0, transform: 'translateY(10px)', offset: at(900) }, { opacity: 1, transform: 'translateY(0)', offset: at(1120) }, { opacity: 1, transform: 'translateY(0)', offset: at(1760) }, { opacity: 0, transform: 'translateY(8px)', offset: at(2000) }, { opacity: 0 }], { duration: T_END, easing: 'cubic-bezier(.2,.8,.3,1)' });
    A(streak, handheld
      ? [{ opacity: 0, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(0)', offset: at(1560) }, { opacity: 1, transform: `translateX(${Math.round(D * 0.6)}px)`, offset: at(1650) }, { opacity: 0, transform: `translateX(${Math.round(D * 1.24)}px)`, offset: at(1780) }, { opacity: 0 }]
      : [{ opacity: 0, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(0)', offset: at(1560) }, { opacity: 1, transform: `translateY(${Math.round(D * 0.6)}px)`, offset: at(1650) }, { opacity: 0, transform: `translateY(${Math.round(D * 1.24)}px)`, offset: at(1780) }, { opacity: 0 }],
      { duration: T_END, easing: 'linear' });
    A(shadow, [{ opacity: 0.9, transform: 'translate(0,0)' }, { opacity: 0.9, transform: 'translate(0,0)', offset: at(880) }, { opacity: 0.45, transform: `translate(${Math.round(D * 0.06)}px,${Math.round(D * 0.1)}px)`, offset: at(1060) }, { opacity: 0, offset: at(1400) }, { opacity: 0 }], { duration: T_END, easing: 'linear' });

    if (spinner) {
      A(spinner, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(0deg)', offset: at(900), easing: 'cubic-bezier(.5,0,.8,.5)' }, { transform: 'rotate(1080deg)', offset: at(1580) }, { transform: 'rotate(1080deg)' }], { duration: T_END });
    }

    A(slot, [
      { opacity: 0, transform: 'scale(.9)' },
      { opacity: 0, transform: 'scale(.9)', offset: at(950) },
      { opacity: 1, transform: 'scale(1)', offset: at(1150) },
      { opacity: 1, transform: 'scale(1)', offset: at(1480) },
      { opacity: 1, transform: 'scale(1.05)', boxShadow: '0 0 0 1px rgba(170,225,255,.95), 0 0 24px 7px rgba(80,170,255,.8)', offset: at(1600) },
      { opacity: 1, transform: 'scale(1)', boxShadow: '0 0 0 1px rgba(170,225,255,.6), 0 0 14px 3px rgba(80,170,255,.4)', offset: at(1800) },
      { opacity: 0, transform: 'scale(1)' },
    ], { duration: T_END, easing: 'ease-out' });

    if (eject) {
      fx.forEach((a) => {
        try { a.reverse(); } catch {}
      });
    }

    if (sound) {
      insertSounds(view, card, 0.85, eject ? 'eject' : 'insert');
    }

    // State callbacks if listener provided
    if (opts.onStateChange) {
      if (eject) {
        setTimeout(() => opts.onStateChange('eject-started'), 50);
        setTimeout(() => opts.onStateChange('disc-ejected'), 600);
        setTimeout(() => opts.onStateChange('disc-returned'), 1290);
        setTimeout(() => opts.onStateChange('case-closed'), 1830);
      } else {
        setTimeout(() => opts.onStateChange('case-flying'), 50);
        setTimeout(() => opts.onStateChange('case-opened'), 860);
        setTimeout(() => opts.onStateChange('disc-extracted'), 1010);
        setTimeout(() => opts.onStateChange('disc-inserting'), 1430);
        setTimeout(() => opts.onStateChange('disc-inserted'), 1580);
        setTimeout(() => opts.onStateChange('case-closed'), 1830);
      }
    }

    const done = () => {
      fx.forEach((a) => {
        try { a.cancel(); } catch {}
      });
      try {
        if (root.isConnected) root.remove();
      } catch {}
      if (opts.onStateChange) opts.onStateChange('done');
      resolve(true);
    };

    setTimeout(done, T_END + 80);
  });
}
