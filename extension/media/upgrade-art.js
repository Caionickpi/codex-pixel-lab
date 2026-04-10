const CYAN = '#7ef0ff';
const WARM = '#ffd48c';
const ROSE = '#ff9fb9';
const INK = '#09111b';
const PANEL = '#0f1928';
const GLASS = '#13253b';
const GRID = '#21354f';

function svg(strings, ...values) {
  return String.raw({ raw: strings }, ...values);
}

function rect(x, y, width, height, extra = '') {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${extra}/>`;
}

function line(x1, y1, x2, y2, extra = '') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
}

function circle(cx, cy, r, extra = '') {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
}

function monitor(x, y, width, height, options = {}) {
  const {
    accent = 'currentColor',
    glow = CYAN,
    bars = 2,
    radius = 7,
    stand = true,
    standX = x + width / 2 - 3,
    standWidth = 6,
  } = options;
  const inner = [];
  for (let index = 0; index < bars; index += 1) {
    const barWidth = Math.max(12, width - 18 - index * 12);
    inner.push(
      rect(
        x + 8,
        y + 8 + index * 8,
        barWidth,
        index === 0 ? 3 : 2,
        `rx="1.5" fill="${index === 0 ? accent : glow}" opacity="${index === 0 ? '0.72' : '0.34'}"`,
      ),
    );
  }

  return svg`
    <g>
      ${rect(x, y, width, height, `rx="${radius}" fill="${INK}" stroke="currentColor" stroke-opacity="0.44" stroke-width="1.6"`)}
      ${rect(x + 3, y + 3, width - 6, height - 6, `rx="${Math.max(4, radius - 2)}" fill="${GLASS}" stroke="${glow}" stroke-opacity="0.18" stroke-width="1"`)}
      ${inner.join('')}
      ${
        stand
          ? svg`
              ${rect(standX, y + height, standWidth, 8, `rx="2" fill="${GRID}"`)}
              ${rect(x + width / 2 - 14, y + height + 7, 28, 4, `rx="2" fill="${accent}" opacity="0.3"`)}
            `
          : ''
      }
    </g>
  `;
}

function tower(x, y, width, height, accent = 'currentColor') {
  return svg`
    <g>
      ${rect(x, y, width, height, `rx="6" fill="${INK}" stroke="${accent}" stroke-opacity="0.4" stroke-width="1.6"`)}
      ${rect(x + 4, y + 5, width - 8, height - 10, `rx="4" fill="${PANEL}" stroke="${CYAN}" stroke-opacity="0.16" stroke-width="1"`)}
      ${rect(x + 8, y + 10, width - 16, 3, `rx="1.5" fill="${accent}" opacity="0.72"`)}
      ${rect(x + 8, y + 18, width - 20, 3, `rx="1.5" fill="${CYAN}" opacity="0.42"`)}
      ${rect(x + 8, y + 26, width - 14, 3, `rx="1.5" fill="${CYAN}" opacity="0.24"`)}
      ${circle(x + width / 2, y + height - 11, 3, `fill="${accent}" opacity="0.88"`)}
    </g>
  `;
}

function cablePath(points, color = 'currentColor', opacity = 0.84) {
  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function shell(content) {
  return svg`
    <svg class="upgrade-art-svg" viewBox="0 0 128 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="panelGlow" x1="0" x2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="${CYAN}" stop-opacity="0.18"/>
        </linearGradient>
        <linearGradient id="frameFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0b1523"/>
          <stop offset="100%" stop-color="#08111b"/>
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="118" height="86" rx="15" fill="#06101a" stroke="url(#panelGlow)" stroke-width="1.5"/>
      <rect x="10" y="10" width="108" height="76" rx="11" fill="url(#frameFill)"/>
      <rect x="14" y="14" width="100" height="10" rx="5" fill="currentColor" opacity="0.08"/>
      <circle cx="26" cy="24" r="17" fill="currentColor" opacity="0.08"/>
      <circle cx="103" cy="22" r="15" fill="${CYAN}" opacity="0.06"/>
      <path d="M18 72 H110" stroke="currentColor" stroke-opacity="0.14" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 77 H98" stroke="${CYAN}" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 26 H58" stroke="currentColor" stroke-opacity="0.08" stroke-width="2" stroke-linecap="round"/>
      <path d="M72 26 H112" stroke="${CYAN}" stroke-opacity="0.06" stroke-width="2" stroke-linecap="round"/>
      ${content}
    </svg>
  `;
}

const ART = {
  'dual-rig': () =>
    shell(svg`
      ${monitor(20, 22, 34, 22, { bars: 2 })}
      ${monitor(66, 18, 40, 26, { bars: 3, standX: 82 })}
      ${rect(32, 58, 62, 6, `rx="3" fill="currentColor" opacity="0.3"`)}
    `),

  'smart-lights': () =>
    shell(svg`
      ${rect(18, 18, 92, 6, `rx="3" fill="currentColor" opacity="0.82"`)}
      ${rect(24, 30, 80, 4, `rx="2" fill="${CYAN}" opacity="0.28"`)}
      <path d="M30 24 L22 56" stroke="currentColor" stroke-opacity="0.22" stroke-width="4" stroke-linecap="round"/>
      <path d="M98 24 L106 56" stroke="currentColor" stroke-opacity="0.22" stroke-width="4" stroke-linecap="round"/>
      ${rect(36, 44, 56, 18, `rx="8" fill="${CYAN}" opacity="0.14"`)}
      ${rect(48, 50, 32, 4, `rx="2" fill="currentColor" opacity="0.52"`)}
    `),

  'router-node': () =>
    shell(svg`
      ${tower(50, 28, 28, 38)}
      ${line(64, 24, 64, 12, `stroke="currentColor" stroke-width="3" stroke-linecap="round"`)}
      <path d="M53 20 Q64 8 75 20" fill="none" stroke="${CYAN}" stroke-opacity="0.7" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M48 26 Q64 8 80 26" fill="none" stroke="currentColor" stroke-opacity="0.38" stroke-width="2.5" stroke-linecap="round"/>
    `),

  'poster-pack': () =>
    shell(svg`
      ${rect(22, 20, 26, 38, `rx="4" fill="${INK}" stroke="currentColor" stroke-opacity="0.48" stroke-width="2"`)}
      ${rect(26, 24, 18, 30, `rx="3" fill="${WARM}" opacity="0.85"`)}
      ${rect(58, 16, 32, 44, `rx="4" fill="${INK}" stroke="${CYAN}" stroke-opacity="0.44" stroke-width="2"`)}
      ${rect(62, 20, 24, 36, `rx="3" fill="${ROSE}" opacity="0.72"`)}
      <path d="M30 48 L40 34 L44 42" stroke="#1d2534" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M68 46 Q74 30 82 44" fill="none" stroke="#152133" stroke-width="3" stroke-linecap="round"/>
    `),

  'espresso-bar': () =>
    shell(svg`
      ${rect(26, 28, 42, 28, `rx="7" fill="${INK}" stroke="currentColor" stroke-opacity="0.44" stroke-width="2"`)}
      ${rect(34, 34, 20, 10, `rx="4" fill="${WARM}" opacity="0.68"`)}
      ${rect(72, 42, 18, 14, `rx="4" fill="${GLASS}" stroke="${CYAN}" stroke-opacity="0.32" stroke-width="1.5"`)}
      <path d="M84 42 Q92 42 92 48 Q92 54 84 54" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M76 34 Q79 28 82 34" fill="none" stroke="${CYAN}" stroke-opacity="0.52" stroke-width="2" stroke-linecap="round"/>
      <path d="M82 34 Q85 28 88 34" fill="none" stroke="${CYAN}" stroke-opacity="0.38" stroke-width="2" stroke-linecap="round"/>
    `),

  'window-garden': () =>
    shell(svg`
      ${rect(20, 18, 44, 40, `rx="6" fill="${INK}" stroke="${CYAN}" stroke-opacity="0.3" stroke-width="1.8"`)}
      ${line(42, 18, 42, 58, `stroke="${CYAN}" stroke-opacity="0.24" stroke-width="2"`)}
      ${line(20, 38, 64, 38, `stroke="${CYAN}" stroke-opacity="0.2" stroke-width="2"`)}
      <path d="M82 26 Q70 34 78 48 Q86 34 96 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M76 32 Q68 44 76 58 Q84 46 92 36" fill="none" stroke="${CYAN}" stroke-opacity="0.58" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${rect(72, 60, 26, 6, `rx="3" fill="${WARM}" opacity="0.44"`)}
    `),

  'cable-raceway': () =>
    shell(svg`
      ${rect(18, 54, 88, 8, `rx="4" fill="${GRID}"`)}
      ${cablePath([
        [26, 26],
        [44, 26],
        [44, 48],
        [82, 48],
        [82, 34],
        [100, 34],
      ])}
      ${circle(26, 26, 5, `fill="${WARM}" opacity="0.82"`)}
      ${circle(100, 34, 5, `fill="${CYAN}" opacity="0.78"`)}
      ${rect(44, 48, 40, 6, `rx="3" fill="currentColor" opacity="0.22"`)}
    `),

  'mech-board': () =>
    shell(svg`
      ${rect(22, 40, 84, 22, `rx="8" fill="${INK}" stroke="currentColor" stroke-opacity="0.44" stroke-width="1.8"`)}
      ${rect(26, 44, 76, 14, `rx="5" fill="${PANEL}" stroke="${CYAN}" stroke-opacity="0.18" stroke-width="1"`)}
      ${Array.from({ length: 8 }, (_, index) => rect(30 + index * 9, 48, 6, 4, `rx="1.5" fill="${index % 2 === 0 ? 'currentColor' : CYAN}" opacity="${index % 2 === 0 ? '0.74' : '0.38'}"`)).join('')}
      ${rect(36, 60, 56, 4, `rx="2" fill="currentColor" opacity="0.36"`)}
    `),

  'scout-prime': () =>
    shell(svg`
      ${circle(64, 40, 18, `fill="${INK}" stroke="currentColor" stroke-opacity="0.42" stroke-width="2"`)}
      ${circle(64, 40, 9, `fill="${GLASS}" stroke="${CYAN}" stroke-opacity="0.3" stroke-width="1.5"`)}
      ${circle(64, 40, 3.5, `fill="currentColor"`)}
      <path d="M34 58 Q64 34 94 58" fill="none" stroke="${CYAN}" stroke-opacity="0.3" stroke-width="3" stroke-linecap="round"/>
      ${rect(42, 62, 44, 6, `rx="3" fill="currentColor" opacity="0.28"`)}
    `),

  'focus-pulse': () =>
    shell(svg`
      ${monitor(18, 24, 92, 34, { bars: 0, stand: false, radius: 10 })}
      <path d="M28 44 H42 L48 34 L56 52 L66 30 L74 44 H98" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
      ${rect(36, 62, 56, 4, `rx="2" fill="${CYAN}" opacity="0.22"`)}
    `),

  'server-rack': () =>
    shell(svg`
      ${tower(44, 18, 40, 52)}
      ${Array.from({ length: 5 }, (_, index) => rect(52, 24 + index * 8, 24, 3, `rx="1.5" fill="${index % 2 === 0 ? 'currentColor' : CYAN}" opacity="${index % 2 === 0 ? '0.72' : '0.42'}"`)).join('')}
    `),

  ultrawide: () =>
    shell(svg`
      ${monitor(16, 24, 96, 28, { bars: 3, radius: 14, standX: 60, standWidth: 8 })}
      <path d="M18 30 Q64 18 110 30" fill="none" stroke="${CYAN}" stroke-opacity="0.18" stroke-width="2"/>
    `),

  'liquid-loop': () =>
    shell(svg`
      ${tower(74, 24, 24, 42)}
      ${cablePath([
        [72, 34],
        [54, 34],
        [46, 44],
        [56, 56],
        [76, 56],
      ], CYAN, 0.82)}
      ${circle(52, 44, 10, `fill="${INK}" stroke="currentColor" stroke-opacity="0.42" stroke-width="2"`)}
      ${circle(52, 44, 5, `fill="${CYAN}" opacity="0.78"`)}
    `),

  'trace-plus': () =>
    shell(svg`
      ${monitor(18, 24, 56, 34, { bars: 1, standX: 42 })}
      ${circle(90, 36, 10, `fill="${INK}" stroke="currentColor" stroke-opacity="0.44" stroke-width="2"`)}
      ${line(96, 42, 106, 52, `stroke="${WARM}" stroke-width="4" stroke-linecap="round"`)}
      <path d="M30 48 Q38 36 48 44 Q54 30 62 40" fill="none" stroke="${CYAN}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    `),

  'helper-drone': () =>
    shell(svg`
      ${rect(44, 36, 40, 16, `rx="8" fill="${INK}" stroke="currentColor" stroke-opacity="0.42" stroke-width="2"`)}
      ${rect(54, 42, 20, 4, `rx="2" fill="${CYAN}" opacity="0.74"`)}
      ${line(38, 34, 30, 26, `stroke="currentColor" stroke-width="3" stroke-linecap="round"`)}
      ${line(90, 34, 98, 26, `stroke="currentColor" stroke-width="3" stroke-linecap="round"`)}
      ${line(38, 54, 30, 62, `stroke="currentColor" stroke-width="3" stroke-linecap="round"`)}
      ${line(90, 54, 98, 62, `stroke="currentColor" stroke-width="3" stroke-linecap="round"`)}
      ${circle(30, 26, 5, `fill="${CYAN}" opacity="0.52"`)}
      ${circle(98, 26, 5, `fill="${CYAN}" opacity="0.52"`)}
    `),

  'holo-board': () =>
    shell(svg`
      ${rect(18, 18, 92, 18, `rx="8" fill="${CYAN}" opacity="0.12" stroke="${CYAN}" stroke-opacity="0.46" stroke-width="1.8"`)}
      ${rect(24, 24, 80, 10, `rx="5" fill="currentColor" opacity="0.22"`)}
      ${rect(32, 42, 64, 20, `rx="10" fill="${CYAN}" opacity="0.08" stroke="currentColor" stroke-opacity="0.22" stroke-width="1.2"`)}
      ${line(46, 36, 38, 48, `stroke="${CYAN}" stroke-width="2"`)}
      ${line(82, 36, 90, 48, `stroke="${CYAN}" stroke-width="2"`)}
    `),

  'mini-fridge': () =>
    shell(svg`
      ${rect(44, 20, 38, 50, `rx="8" fill="${INK}" stroke="currentColor" stroke-opacity="0.42" stroke-width="2"`)}
      ${rect(48, 24, 30, 42, `rx="5" fill="#d5deeb" opacity="0.92"`)}
      ${line(48, 43, 78, 43, `stroke="${GRID}" stroke-width="2"`)}
      ${rect(74, 34, 3, 10, `rx="1.5" fill="${WARM}" opacity="0.88"`)}
    `),

  'speaker-stack': () =>
    shell(svg`
      ${tower(22, 24, 24, 44)}
      ${tower(82, 24, 24, 44)}
      ${circle(34, 40, 6, `fill="${CYAN}" opacity="0.7"`)}
      ${circle(94, 40, 6, `fill="${CYAN}" opacity="0.7"`)}
      ${circle(34, 56, 8, `fill="currentColor" opacity="0.68"`)}
      ${circle(94, 56, 8, `fill="currentColor" opacity="0.68"`)}
    `),

  'wall-terminal': () =>
    shell(svg`
      ${monitor(18, 20, 92, 40, { bars: 0, stand: false, radius: 10 })}
      ${rect(28, 30, 16, 3, `rx="1.5" fill="currentColor" opacity="0.82"`)}
      ${rect(28, 38, 48, 3, `rx="1.5" fill="${CYAN}" opacity="0.46"`)}
      ${rect(28, 46, 36, 3, `rx="1.5" fill="${CYAN}" opacity="0.24"`)}
      <path d="M82 34 L88 40 L82 46" fill="none" stroke="${WARM}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    `),

  'patch-bay': () =>
    shell(svg`
      ${rect(18, 30, 92, 24, `rx="10" fill="${INK}" stroke="currentColor" stroke-opacity="0.44" stroke-width="2"`)}
      ${Array.from({ length: 6 }, (_, index) => circle(28 + index * 14, 42, 3.4, `fill="${index % 2 === 0 ? CYAN : 'currentColor'}" opacity="${index % 2 === 0 ? '0.72' : '0.6'}"`)).join('')}
      ${cablePath([
        [84, 42],
        [96, 42],
        [102, 50],
        [110, 50],
      ], WARM, 0.86)}
    `),

  'legendary-rig': () =>
    shell(svg`
      ${monitor(14, 26, 30, 20, { bars: 1, standX: 26 })}
      ${monitor(44, 18, 40, 26, { bars: 3, standX: 60 })}
      ${monitor(84, 26, 30, 20, { bars: 1, standX: 96 })}
      ${rect(26, 58, 76, 6, `rx="3" fill="currentColor" opacity="0.28"`)}
      ${rect(34, 66, 60, 4, `rx="2" fill="${CYAN}" opacity="0.2"`)}
    `),

  'plant-lab': () =>
    shell(svg`
      ${rect(22, 58, 20, 10, `rx="4" fill="${WARM}" opacity="0.54"`)}
      ${rect(82, 58, 20, 10, `rx="4" fill="${WARM}" opacity="0.54"`)}
      <path d="M32 58 Q24 42 34 28 Q44 42 32 58" fill="${CYAN}" fill-opacity="0.34" stroke="currentColor" stroke-opacity="0.62" stroke-width="2"/>
      <path d="M92 58 Q84 42 94 24 Q104 42 92 58" fill="currentColor" fill-opacity="0.28" stroke="${CYAN}" stroke-opacity="0.62" stroke-width="2"/>
      ${rect(52, 18, 24, 6, `rx="3" fill="currentColor" opacity="0.74"`)}
      ${line(64, 24, 64, 44, `stroke="currentColor" stroke-opacity="0.44" stroke-width="2"`)}
    `),

  'monitor-wall': () =>
    shell(svg`
      ${Array.from({ length: 3 }, (_, column) => monitor(16 + column * 34, 18, 28, 18, { bars: 1, stand: false, radius: 5 })).join('')}
      ${Array.from({ length: 3 }, (_, column) => monitor(16 + column * 34, 42, 28, 18, { bars: 1, stand: false, radius: 5 })).join('')}
      ${rect(24, 66, 80, 4, `rx="2" fill="currentColor" opacity="0.26"`)}
    `),

  'neon-signage': () =>
    shell(svg`
      <path d="M26 34 H52 L64 20 L102 20" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 52 H50 L64 66 L102 66" fill="none" stroke="${CYAN}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>
      ${rect(18, 24, 92, 40, `rx="14" fill="none" stroke="currentColor" stroke-opacity="0.28" stroke-width="2"`)}
    `),

  'trophy-shelf': () =>
    shell(svg`
      ${rect(22, 56, 84, 6, `rx="3" fill="${WARM}" opacity="0.44"`)}
      <path d="M56 30 H72 V44 Q72 54 64 54 Q56 54 56 44 Z" fill="currentColor" opacity="0.82"/>
      <path d="M52 34 H46 Q44 34 44 38 Q44 42 48 42" fill="none" stroke="${CYAN}" stroke-width="3" stroke-linecap="round"/>
      <path d="M76 34 H82 Q84 34 84 38 Q84 42 80 42" fill="none" stroke="${CYAN}" stroke-width="3" stroke-linecap="round"/>
      ${rect(60, 54, 8, 6, `rx="2" fill="${CYAN}" opacity="0.46"`)}
    `),

  'arcade-corner': () =>
    shell(svg`
      <path d="M44 18 H84 L90 34 V68 H38 V34 Z" fill="${INK}" stroke="currentColor" stroke-opacity="0.46" stroke-width="2"/>
      ${rect(48, 26, 32, 18, `rx="4" fill="${GLASS}" stroke="${CYAN}" stroke-opacity="0.22" stroke-width="1"`)}
      ${rect(52, 50, 24, 5, `rx="2.5" fill="currentColor" opacity="0.66"`)}
      ${circle(58, 60, 4, `fill="${WARM}" opacity="0.84"`)}
      ${circle(70, 60, 4, `fill="${CYAN}" opacity="0.72"`)}
    `),

  'quantum-core': () =>
    shell(svg`
      ${circle(64, 42, 16, `fill="${INK}" stroke="currentColor" stroke-opacity="0.46" stroke-width="2"`)}
      ${circle(64, 42, 8, `fill="${CYAN}" opacity="0.84"`)}
      <ellipse cx="64" cy="42" rx="30" ry="12" fill="none" stroke="${CYAN}" stroke-opacity="0.48" stroke-width="2"/>
      <ellipse cx="64" cy="42" rx="14" ry="30" fill="none" stroke="currentColor" stroke-opacity="0.32" stroke-width="2"/>
      ${rect(48, 64, 32, 4, `rx="2" fill="currentColor" opacity="0.32"`)}
    `),

  'night-vending': () =>
    shell(svg`
      ${rect(42, 16, 40, 56, `rx="8" fill="${INK}" stroke="currentColor" stroke-opacity="0.46" stroke-width="2"`)}
      ${rect(48, 22, 28, 28, `rx="5" fill="${GLASS}" stroke="${CYAN}" stroke-opacity="0.22" stroke-width="1.5"`)}
      ${Array.from({ length: 3 }, (_, row) => Array.from({ length: 3 }, (_, column) => rect(52 + column * 8, 26 + row * 7, 5, 4, `rx="1.5" fill="${row === 0 ? WARM : CYAN}" opacity="${row === 0 ? '0.82' : '0.34'}"`)).join('')).join('')}
      ${rect(52, 56, 20, 4, `rx="2" fill="currentColor" opacity="0.48"`)}
      ${circle(74, 60, 3, `fill="${WARM}" opacity="0.82"`)}
    `),

  'master-desk': () =>
    shell(svg`
      ${monitor(14, 22, 28, 18, { bars: 1, stand: false, radius: 6 })}
      ${monitor(38, 16, 52, 24, { bars: 3, stand: false, radius: 10 })}
      ${monitor(86, 22, 28, 18, { bars: 1, stand: false, radius: 6 })}
      <path d="M26 58 H102 L94 68 H34 Z" fill="${PANEL}" stroke="currentColor" stroke-opacity="0.38" stroke-width="1.8" stroke-linejoin="round"/>
      ${rect(30, 66, 68, 4, `rx="2" fill="${CYAN}" opacity="0.2"`)}
      ${line(20, 70, 20, 84, `stroke="currentColor" stroke-opacity="0.28" stroke-width="3" stroke-linecap="round"`)}
      ${line(108, 70, 108, 84, `stroke="currentColor" stroke-opacity="0.28" stroke-width="3" stroke-linecap="round"`)}
    `),
};

function fallbackArt() {
  return shell(svg`
    ${monitor(24, 22, 80, 30, { bars: 2, standX: 58, standWidth: 8 })}
    ${rect(30, 62, 68, 4, `rx="2" fill="currentColor" opacity="0.28"`)}
  `);
}

export function renderUpgradeArt(icon, variant = 'card') {
  const markup = (ART[icon] || fallbackArt)();
  return `<span class="upgrade-art upgrade-art--${variant}" data-art="${icon}">${markup}</span>`;
}
