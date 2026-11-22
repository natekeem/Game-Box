export function getGameCaseCoverSrc(game) {
  return game.coverUrl && !game.coverUrl.includes('terminal-1997')
    ? game.coverUrl
    : generateArcadeCoverSvg(game);
}

const palettes = [
  { ink: '#a94032', shade: '#632b2c', light: '#f1bd82', accent: '#f5daaa' },
  { ink: '#286253', shade: '#183d3c', light: '#9ac7a3', accent: '#e0d58b' },
  { ink: '#31547a', shade: '#1c304b', light: '#9db8cb', accent: '#e3bd7e' },
  { ink: '#80582f', shade: '#4c3829', light: '#d6a86c', accent: '#ecd8a9' },
  { ink: '#684a71', shade: '#3e324d', light: '#c4a0bd', accent: '#ead5ac' },
  { ink: '#536247', shade: '#303b35', light: '#b3bb83', accent: '#ebd79b' },
];

// The cover art uses small illustrated scenes, with the title kept in a clean,
// high contrast type area so the pack remains readable at shelf size.
const artwork = {
  bomberman: [0, '<ellipse cx="150" cy="211" rx="77" ry="13" fill="#1e293b" opacity=".28"/><path d="M107 144q5-30 31-40l8-26q3-10 13-8l11 3q8 3 6 12l-3 17q27 14 32 44l-6 50q-3 23-25 25h-42q-24-2-26-25z" fill="url(#hero)"/><path d="M142 110q18-6 38 2l10 26h-56z" fill="#f2c56e"/><ellipse cx="150" cy="158" rx="19" ry="21" fill="#f7e4bf"/><circle cx="145" cy="155" r="3" fill="#23313b"/><circle cx="157" cy="155" r="3" fill="#23313b"/><path d="M143 169q7 7 15 0" fill="none" stroke="#9b4d3a" stroke-width="3" stroke-linecap="round"/><rect x="203" y="80" width="38" height="48" rx="8" fill="#263545"/><path d="M211 91h22m-22 10h22m-22 10h16" stroke="#efcf8b" stroke-width="4" stroke-linecap="round"/>'],
  bombergirl: [3, '<ellipse cx="150" cy="214" rx="81" ry="13" fill="#1e293b" opacity=".24"/><path d="M98 182q7-55 48-73l15-34 16 35q42 20 44 72l-16 31h-98z" fill="url(#hero)"/><path d="M112 120 77 92q-10-9-2-19 8-10 18-3l46 33m43 1 35-30q10-8 18 2 7 9-2 18l-43 38" fill="none" stroke="#f0c77f" stroke-width="15" stroke-linecap="round"/><circle cx="151" cy="145" r="20" fill="#f5e7cc"/><circle cx="145" cy="144" r="3" fill="#303747"/><circle cx="158" cy="144" r="3" fill="#303747"/><path d="M144 157q7 5 14 0" fill="none" stroke="#a94437" stroke-width="3" stroke-linecap="round"/><path d="m89 198 14-22 14 22m67 0 14-22 14 22" fill="#f4e4bd"/>'],
  snakeduel: [1, '<path d="M85 177c-24-25-11-58 17-61 24-3 39 17 60 15 20-2 31-23 51-21 30 3 36 36 13 54-21 17-48 4-65 11-18 8-22 32-50 33-14 0-25-7-29-18" fill="none" stroke="#e4b96f" stroke-width="26" stroke-linecap="round"/><path d="M85 177c-24-25-11-58 17-61 24-3 39 17 60 15 20-2 31-23 51-21 30 3 36 36 13 54-21 17-48 4-65 11-18 8-22 32-50 33-14 0-25-7-29-18" fill="none" stroke="url(#hero)" stroke-width="18" stroke-linecap="round"/><circle cx="220" cy="135" r="4" fill="#f7e7c1"/><path d="m74 117 18-8-5 19m135 24 18 7-18 8" fill="none" stroke="#f3d99d" stroke-width="4" stroke-linecap="round"/>'],
  drawing: [2, '<rect x="80" y="83" width="143" height="108" rx="10" transform="rotate(-7 80 83)" fill="#f2e6cb"/><path d="m106 162 25-46 69-45q10-6 17 4l7 10q6 9-3 16l-67 47-49 14z" fill="url(#hero)"/><path d="m131 116 23 28m42-65 19 27" stroke="#f7dfac" stroke-width="5"/><path d="M101 177q48-23 111-11" fill="none" stroke="#a44d3e" stroke-width="5" stroke-linecap="round"/><circle cx="201" cy="190" r="8" fill="#db9e57"/>'],
  reaction: [4, '<path d="M153 66c-8 38-35 59-31 86 3 21 23 28 39 15 15-12 14-31 13-42 34 25 40 69 13 94-24 22-68 20-90-7-26-32-6-73 20-101 13-15 27-31 36-45z" fill="url(#hero)"/><path d="M154 144c-2 19-18 29-18 46 0 15 11 24 24 21 16-4 20-24 10-39-4-7-11-17-16-28z" fill="#fff0c9" opacity=".78"/><path d="m93 88 7 15m112-8 10-12M80 151l17 3m120 5 15-3" stroke="#f5d697" stroke-width="5" stroke-linecap="round"/>'],
  speedtyping: [5, '<rect x="68" y="110" width="166" height="88" rx="14" fill="url(#hero)"/><rect x="77" y="119" width="148" height="68" rx="8" fill="#293a3d"/><g fill="#f4e6c7"><rect x="88" y="132" width="23" height="17" rx="3"/><rect x="117" y="132" width="23" height="17" rx="3"/><rect x="146" y="132" width="23" height="17" rx="3"/><rect x="175" y="132" width="23" height="17" rx="3"/><rect x="88" y="157" width="23" height="17" rx="3"/><rect x="117" y="157" width="52" height="17" rx="3"/><rect x="175" y="157" width="23" height="17" rx="3"/></g><path d="M95 89h112" stroke="#f3d69b" stroke-width="5" stroke-linecap="round"/><path d="m193 77 14 12-14 12" fill="none" stroke="#f3d69b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'],
  colormatch: [0, '<circle cx="126" cy="145" r="53" fill="#e05a48"/><circle cx="176" cy="136" r="53" fill="#eab454"/><circle cx="153" cy="181" r="53" fill="#416f98"/><path d="M94 117q24-27 49-15m22-7q28 2 43 28m-81 87q30 20 57 4" fill="none" stroke="#fff0cd" stroke-opacity=".75" stroke-width="5" stroke-linecap="round"/><circle cx="151" cy="152" r="13" fill="#f2e2c4"/>'],
  connectfour: [2, '<rect x="78" y="82" width="145" height="143" rx="22" fill="url(#hero)"/><g fill="#213549"><circle cx="110" cy="117" r="14"/><circle cx="151" cy="117" r="14"/><circle cx="192" cy="117" r="14"/><circle cx="110" cy="157" r="14"/><circle cx="151" cy="157" r="14"/><circle cx="192" cy="157" r="14"/><circle cx="110" cy="197" r="14"/><circle cx="151" cy="197" r="14"/><circle cx="192" cy="197" r="14"/></g><g fill="#f3d487"><circle cx="110" cy="117" r="10"/><circle cx="151" cy="157" r="10"/><circle cx="192" cy="197" r="10"/></g><g fill="#eb8a5d"><circle cx="151" cy="117" r="10"/><circle cx="192" cy="157" r="10"/></g>'],
  tictactoe: [1, '<rect x="77" y="78" width="146" height="146" rx="20" fill="#f0e1bf"/><path d="M126 90v122m49-122v122M89 126h122m-122 48h122" stroke="#577b68" stroke-width="7" stroke-linecap="round"/><path d="m96 99 23 22m0-22-23 22m71 48 23 22m0-22-23 22" stroke="#bd5544" stroke-width="7" stroke-linecap="round"/><circle cx="151" cy="109" r="12" fill="none" stroke="#31547a" stroke-width="6"/><circle cx="103" cy="198" r="12" fill="none" stroke="#31547a" stroke-width="6"/>'],
  memorymatch: [4, '<rect x="91" y="94" width="76" height="107" rx="10" transform="rotate(-13 91 94)" fill="#f2e5c7"/><rect x="143" y="83" width="76" height="107" rx="10" transform="rotate(11 143 83)" fill="url(#hero)"/><path d="m127 133 16-19 16 19-16 19z" fill="#bd7b7d"/><path d="m172 141 13-16 13 16-13 16z" fill="#f5e4bf"/><path d="M104 180q24 12 44-2" fill="none" stroke="#4b4160" stroke-width="4" stroke-linecap="round"/>'],
  simonsays: [3, '<circle cx="150" cy="152" r="83" fill="#35443d"/><path d="M150 73a79 79 0 0 0-79 79h79z" fill="#e35d4e"/><path d="M150 73a79 79 0 0 1 79 79h-79z" fill="#e6b64f"/><path d="M71 152a79 79 0 0 0 79 79v-79z" fill="#5a9e87"/><path d="M150 152h79a79 79 0 0 1-79 79z" fill="#547aa3"/><circle cx="150" cy="152" r="17" fill="#f1e6c9"/><path d="M150 71v18m81 63h-18m-63 81v-18m-81-63h18" stroke="#f5e7c6" stroke-width="4"/>'],
  wordchain: [5, '<path d="M102 145c-15-18-13-44 5-57 17-12 42-8 54 8 12 17 10 42-6 55l-12 10m42-1 13-11c16-13 41-10 54 7 13 18 9 42-8 55-18 13-43 9-55-8" fill="none" stroke="url(#hero)" stroke-width="17" stroke-linecap="round"/><path d="m125 175 52-42" stroke="#f4dfad" stroke-width="8" stroke-linecap="round"/><circle cx="101" cy="145" r="5" fill="#f7e9c9"/><circle cx="246" cy="163" r="5" fill="#f7e9c9"/>'],
  anagram: [3, '<rect x="80" y="94" width="140" height="114" rx="17" fill="#f1e3c3"/><g fill="url(#hero)"><path d="M108 176v-54h13l17 29 17-29h13v54h-14v-30l-13 20h-7l-13-20v30z"/><path d="M174 122h35v12h-21v9h19v11h-19v10h22v12h-36z"/></g><path d="M101 91q49-26 99-3" fill="none" stroke="#fff1cf" stroke-width="5" stroke-linecap="round"/>'],
  mathduel: [2, '<rect x="81" y="88" width="138" height="126" rx="18" fill="#f2e5c9"/><path d="M112 126h34m-17-17v34m27-17h34m-34 42h34m-92 0h42" stroke="url(#hero)" stroke-width="9" stroke-linecap="round"/><circle cx="108" cy="192" r="5" fill="#b85c45"/><circle cx="193" cy="111" r="5" fill="#b85c45"/>'],
  numberhunt: [1, '<circle cx="143" cy="139" r="55" fill="#f0e3c6"/><circle cx="143" cy="139" r="45" fill="none" stroke="url(#hero)" stroke-width="8"/><text x="143" y="156" text-anchor="middle" fill="#304d43" font-size="49" font-weight="800">7</text><path d="m183 180 38 39" stroke="#d1a05e" stroke-width="17" stroke-linecap="round"/><path d="M96 208q52 20 105-1" fill="none" stroke="#fff0cf" stroke-width="5" stroke-linecap="round"/>'],
  rpsarena: [0, '<path d="M121 213 94 177l6-34q3-12 14-10l10 4 4-48q2-14 14-12 11 2 10 14l-1 35 9-47q3-14 15-10 10 3 7 16l-7 45 14-34q5-12 16-6 10 6 4 18l-14 40 21-25q9-10 18-1 8 9 0 19l-39 53q-11 14-28 14h-30z" fill="url(#hero)"/><path d="m116 148 12 7m17-22 12 5m9-4 11 5" stroke="#f9e8c9" stroke-width="4" stroke-linecap="round"/><path d="m77 108 9-12m136 17 13-6m-143 95-14 4" stroke="#f3d493" stroke-width="5" stroke-linecap="round"/>'],
  trivia: [4, '<path d="M105 119q3-40 48-43 49 0 51 41 1 24-27 42-21 13-21 33h-22q-1-31 24-50 22-17 22-29-1-18-27-18-24 0-27 25z" fill="url(#hero)"/><circle cx="145" cy="213" r="13" fill="#efca7f"/><path d="M83 100q-10 18-8 35m143-41 10 14m-138 101-12 13" fill="none" stroke="#f3ddab" stroke-width="5" stroke-linecap="round"/>'],
  higherlower: [5, '<path d="M105 191V112m-29 32 29-35 29 35m-29-35v-16" fill="none" stroke="#e8bd6e" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M195 108v79m-29-32 29 35 29-35m-29 35v16" fill="none" stroke="url(#hero)" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M149 103v94" stroke="#f4e6c7" stroke-width="5" stroke-dasharray="6 9"/>'],
  oddoneout: [3, '<g fill="#d9a567"><circle cx="112" cy="116" r="26"/><circle cx="184" cy="116" r="26"/><circle cx="112" cy="188" r="26"/></g><circle cx="184" cy="188" r="26" fill="#557d75"/><path d="M184 151v17" stroke="#f4e6c7" stroke-width="4" stroke-linecap="round"/><circle cx="184" cy="176" r="2.5" fill="#f4e6c7"/><path d="M86 223q65 18 131-1" fill="none" stroke="#f3ddb1" stroke-width="4" stroke-linecap="round"/>'],
};

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateArcadeCoverSvg(game) {
  const [paletteIndex, motif] = artwork[game.id] || [0, '<circle cx="150" cy="150" r="60" fill="url(#hero)"/><circle cx="150" cy="150" r="22" fill="#f2e2c4"/>'];
  const color = palettes[paletteIndex];
  const rawTitle = game.name || 'Arcade Game';
  const [title, korean] = rawTitle.split(' (');
  const titleSize = Math.max(22, Math.min(38, Math.floor(260 / Math.max(title.length, 1)) * 3));
  const subtitle = korean?.replace(/\)$/, '') || game.genre || '';
  const code = String(game.discLabel || 'ARCADE').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
    <defs>
      <linearGradient id="paper" x2="0" y2="1"><stop stop-color="#f6ecd7"/><stop offset="1" stop-color="#e8d9b9"/></linearGradient>
      <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color.light}"/><stop offset=".52" stop-color="${color.ink}"/><stop offset="1" stop-color="${color.shade}"/></linearGradient>
      <linearGradient id="sky" x2="0" y2="1"><stop stop-color="${color.shade}"/><stop offset="1" stop-color="${color.ink}"/></linearGradient>
      <pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 1h7" stroke="#fff4dc" stroke-opacity=".11"/><circle cx="1" cy="5" r=".55" fill="#362b23" fill-opacity=".12"/></pattern>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#18202a" flood-opacity=".24"/></filter>
      <clipPath id="artClip"><rect x="16" y="52" width="268" height="224" rx="8"/></clipPath>
    </defs>
    <rect width="300" height="450" fill="url(#paper)"/>
    <rect x="0" y="0" width="300" height="42" fill="${color.shade}"/>
    <text x="20" y="27" fill="#fff1d7" font-family="Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="2">GAME BOX</text>
    <text x="280" y="27" text-anchor="end" fill="#e8d8b9" font-family="Arial, sans-serif" font-size="9" font-weight="700" letter-spacing="1">${escapeXml(code)}</text>
    <g clip-path="url(#artClip)">
      <rect x="16" y="52" width="268" height="224" fill="url(#sky)"/>
      <circle cx="245" cy="79" r="35" fill="${color.accent}" opacity=".16"/>
      <circle cx="50" cy="248" r="66" fill="${color.light}" opacity=".12"/>
      <path d="M16 236q58-30 112-7t156-1v48H16z" fill="#17242e" opacity=".18"/>
      <g filter="url(#shadow)">${motif}</g>
      <rect x="16" y="52" width="268" height="224" fill="url(#grain)"/>
    </g>
    <rect x="16" y="52" width="268" height="224" rx="8" fill="none" stroke="#fff5df" stroke-opacity=".35"/>
    <path d="M20 294h260" stroke="${color.ink}" stroke-opacity=".28"/>
    <text x="20" y="331" fill="${color.shade}" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="${titleSize}" font-weight="800" letter-spacing="-.7" textLength="260" lengthAdjust="spacingAndGlyphs">${escapeXml(title)}</text>
    <text x="21" y="356" fill="#554b3d" font-family="Arial, 'Malgun Gothic', sans-serif" font-size="15" font-weight="600">${escapeXml(subtitle)}</text>
    <path d="M20 377h260" stroke="${color.ink}" stroke-opacity=".35"/>
    <text x="20" y="408" fill="${color.shade}" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1.4">ARCADE SERIES</text>
    <text x="280" y="408" text-anchor="end" fill="#5b5041" font-family="Arial, sans-serif" font-size="9" letter-spacing=".7">${escapeXml(game.playersLabel || '1 PLAYER')}</text>
    <rect x="0" y="426" width="300" height="24" fill="${color.ink}"/>
    <text x="20" y="442" fill="#fff1d7" font-family="Arial, sans-serif" font-size="9" font-weight="700" letter-spacing="1.5">GAME BOX  /  CLASSIC PLAY</text>
    <text x="280" y="442" text-anchor="end" fill="#fff1d7" font-family="Arial, sans-serif" font-size="8" letter-spacing="1">COMPACT DISC</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
