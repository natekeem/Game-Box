/**
 * Procedural Retro Arcade Cover Art Generator (2:3 Portrait Aspect Ratio, 300x450)
 * Generates crisp SVG artwork for each game case in the collection.
 */

export function generateArcadeCoverSvg(game) {
  const accent = game.caseColor || '#3b82f6';
  const label = game.discLabel || 'ARC-001';
  const genre = game.genre || 'ARCADE ACTION';
  const title = (game.name || 'ARCADE GAME').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const subtitle = (game.subtitle || 'CLASSIC COLLECTION').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const players = game.playersLabel || '1~2 PLAYERS';

  // Distinctive graphical motif based on game id
  let motifSvg = '';
  const gid = game.id || '';

  if (gid.includes('bomb')) {
    motifSvg = `
      <circle cx="150" cy="210" r="48" fill="#1e293b" stroke="#f59e0b" stroke-width="4"/>
      <path d="M150 162 L150 142 Q165 130 175 145" fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>
      <circle cx="178" cy="145" r="8" fill="#ef4444" />
      <polygon points="178,135 183,142 191,140 185,147 188,155 180,150 172,155 174,147 168,141 176,142" fill="#fbbf24"/>
      <circle cx="140" cy="200" r="10" fill="#ffffff" opacity="0.4"/>
    `;
  } else if (gid.includes('snake')) {
    motifSvg = `
      <rect x="70" y="150" width="160" height="120" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="3"/>
      <path d="M85 240 L150 240 L150 190 L120 190 L120 170 L210 170 L210 200" fill="none" stroke="#34d399" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="210" cy="200" r="6" fill="#facc15"/>
      <circle cx="170" cy="240" r="6" fill="#ef4444"/>
    `;
  } else if (gid.includes('roulette')) {
    motifSvg = `
      <circle cx="150" cy="210" r="54" fill="#831843" stroke="#f472b6" stroke-width="4"/>
      <circle cx="150" cy="210" r="38" fill="#be185d" stroke="#fbcfe8" stroke-width="2" stroke-dasharray="6,4"/>
      <circle cx="150" cy="210" r="14" fill="#fdf2f8"/>
      <circle cx="130" cy="180" r="8" fill="#38bdf8"/>
      <circle cx="170" cy="190" r="8" fill="#eab308"/>
      <circle cx="140" cy="240" r="8" fill="#a855f7"/>
    `;
  } else if (gid.includes('reaction') || gid.includes('speed')) {
    motifSvg = `
      <polygon points="150,140 120,210 148,210 135,270 185,195 155,195" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
      <circle cx="150" cy="210" r="64" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="8,6"/>
    `;
  } else if (gid.includes('four') || gid.includes('tic') || gid.includes('math') || gid.includes('match')) {
    motifSvg = `
      <rect x="85" y="150" width="130" height="120" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="3"/>
      <circle cx="110" cy="180" r="14" fill="#ef4444"/>
      <circle cx="150" cy="180" r="14" fill="#eab308"/>
      <circle cx="190" cy="180" r="14" fill="#ef4444"/>
      <circle cx="110" cy="220" r="14" fill="#eab308"/>
      <circle cx="150" cy="220" r="14" fill="#ef4444"/>
      <circle cx="190" cy="220" r="14" fill="#eab308"/>
    `;
  } else {
    motifSvg = `
      <circle cx="150" cy="210" r="50" fill="#0f172a" stroke="${accent}" stroke-width="4"/>
      <polygon points="140,190 170,210 140,230" fill="${accent}"/>
      <circle cx="150" cy="210" r="62" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="60%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="foil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
        <stop offset="40%" stop-color="rgba(255,255,255,0)"/>
        <stop offset="70%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.25)"/>
      </linearGradient>
    </defs>

    <!-- Main Card Body -->
    <rect x="0" y="0" width="300" height="450" fill="url(#bg)"/>

    <!-- Top Console Spine/Header -->
    <rect x="0" y="0" width="300" height="46" fill="url(#headerGrad)"/>
    <text x="16" y="24" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="12" letter-spacing="1.5">TOOL-BOX ARCADE DECK</text>
    <text x="284" y="24" fill="#ffffff" font-family="monospace" font-weight="700" font-size="10" text-anchor="end" opacity="0.9">${label}</text>
    <line x1="0" y1="46" x2="300" y2="46" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>

    <!-- Genre Tag -->
    <rect x="16" y="58" width="130" height="18" rx="4" fill="rgba(255,255,255,0.1)"/>
    <text x="24" y="71" fill="#94a3b8" font-family="monospace" font-weight="700" font-size="9" letter-spacing="0.5">${genre}</text>

    <!-- Center Stage Visual Motif -->
    <g transform="translate(0, 5)">
      ${motifSvg}
    </g>

    <!-- Title & Subtitle Banner -->
    <rect x="14" y="300" width="272" height="96" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="26" y="332" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="900" font-size="18">${title}</text>
    <text x="26" y="356" fill="${accent}" font-family="system-ui, sans-serif" font-weight="700" font-size="12">${subtitle}</text>
    <text x="26" y="380" fill="#94a3b8" font-family="monospace" font-weight="600" font-size="10.5">PLAYERS: ${players}</text>

    <!-- Bottom Footer Bar -->
    <rect x="0" y="420" width="300" height="30" fill="#090d16"/>
    <text x="16" y="439" fill="#64748b" font-family="monospace" font-size="9.5">GAME-BOX ARCADE // COMPACT DISC</text>
    <rect x="254" y="425" width="30" height="18" rx="2" fill="#334155"/>
    <text x="269" y="438" fill="#f8fafc" font-family="monospace" font-weight="800" font-size="9" text-anchor="middle">20</text>

    <!-- Gloss Highlight Overlay -->
    <rect x="0" y="0" width="300" height="450" fill="url(#foil)" pointer-events="none"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
