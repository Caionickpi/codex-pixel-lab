import { THEME_DEFS, computeRpgState, getCurrentTitle, getThemeById, getUpgradeById } from './rpg.js';

const TILE_SIZE = 16;
const OFFICE_COLS = 22;
const OFFICE_ROWS = 13;
const RPG_STORAGE_KEY = 'codex-pixel-lab-rpg-v1';

const ASSET_MANIFEST = {
  floors: [
    '/assets/floors/floor_1.png',
    '/assets/floors/floor_2.png',
    '/assets/floors/floor_5.png',
    '/assets/floors/floor_6.png',
  ],
  furniture: {
    desk: '/assets/furniture/DESK/DESK_FRONT.png',
    pc1: '/assets/furniture/PC/PC_FRONT_ON_1.png',
    pc2: '/assets/furniture/PC/PC_FRONT_ON_2.png',
    pc3: '/assets/furniture/PC/PC_FRONT_ON_3.png',
    board: '/assets/furniture/WHITEBOARD/WHITEBOARD.png',
    bookshelf: '/assets/furniture/DOUBLE_BOOKSHELF/DOUBLE_BOOKSHELF.png',
    sofa: '/assets/furniture/SOFA/SOFA_FRONT.png',
    plant: '/assets/furniture/LARGE_PLANT/LARGE_PLANT.png',
    hangingPlant: '/assets/furniture/HANGING_PLANT/HANGING_PLANT.png',
    painting: '/assets/furniture/SMALL_PAINTING/SMALL_PAINTING.png',
    clock: '/assets/furniture/CLOCK/CLOCK.png',
    table: '/assets/furniture/COFFEE_TABLE/COFFEE_TABLE.png',
    mug: '/assets/furniture/COFFEE/COFFEE.png',
  },
  characters: {
    codex: '/assets/characters/char_0.png',
    trace: '/assets/characters/char_2.png',
    scout: '/assets/characters/char_5.png',
  },
};

const STATIONS = {
  mainDesk: {
    home: { x: 9.5, y: 7.1, face: 'down' },
    idle: [
      { x: 8.45, y: 9.15 },
      { x: 10.55, y: 9.05 },
    ],
  },
  traceDesk: {
    home: { x: 15.65, y: 6.45, face: 'down' },
    idle: [
      { x: 16.8, y: 8.05 },
      { x: 14.2, y: 8.05 },
    ],
  },
  board: {
    home: { x: 4.95, y: 7.65, face: 'right' },
    idle: [
      { x: 3.8, y: 9.35 },
      { x: 6.25, y: 9.1 },
    ],
  },
};

const FURNITURE_LAYOUT = [
  { image: 'painting', col: 3, row: 1 },
  { image: 'board', col: 13, row: 1 },
  { image: 'bookshelf', col: 18, row: 1 },
  { image: 'clock', col: 20, row: 1 },
  { image: 'hangingPlant', col: 5, row: 1 },
  { image: 'hangingPlant', col: 16, row: 1 },
  { image: 'desk', col: 8, row: 7 },
  { image: 'desk', col: 14, row: 6 },
  { image: 'table', col: 3, row: 9 },
  { image: 'mug', col: 4, row: 9 },
  { image: 'sofa', col: 2, row: 10 },
  { image: 'plant', col: 1, row: 7 },
  { image: 'plant', col: 19, row: 8 },
];

const dom = {
  canvas: document.getElementById('officeCanvas'),
  stage: document.getElementById('stage'),
  bubbleLayer: document.getElementById('bubbleLayer'),
  connectForm: document.getElementById('connectForm'),
  workspaceInput: document.getElementById('workspaceInput'),
  latestButton: document.getElementById('latestButton'),
  recentProjects: document.getElementById('recentProjects'),
  connectionPill: document.getElementById('connectionPill'),
  projectPill: document.getElementById('projectPill'),
  modelBadge: document.getElementById('modelBadge'),
  runtimeBadge: document.getElementById('runtimeBadge'),
  projectBadge: document.getElementById('projectBadge'),
  headline: document.getElementById('headline'),
  summary: document.getElementById('summary'),
  toolLabel: document.getElementById('toolLabel'),
  debugLabel: document.getElementById('debugLabel'),
  gitLabel: document.getElementById('gitLabel'),
  feedLabel: document.getElementById('feedLabel'),
  playerGlance: document.getElementById('playerGlance'),
  playerAvatarMini: document.getElementById('playerAvatarMini'),
  playerNameMini: document.getElementById('playerNameMini'),
  playerLevelMini: document.getElementById('playerLevelMini'),
  playerCommitMini: document.getElementById('playerCommitMini'),
  playerCoinMini: document.getElementById('playerCoinMini'),
  profileModal: document.getElementById('profileModal'),
  profileBackdrop: document.getElementById('profileBackdrop'),
  profileClose: document.getElementById('profileClose'),
  playerRefreshButton: document.getElementById('playerRefreshButton'),
  profileSource: document.getElementById('profileSource'),
  playerAvatar: document.getElementById('playerAvatar'),
  playerName: document.getElementById('playerName'),
  playerHandle: document.getElementById('playerHandle'),
  playerBio: document.getElementById('playerBio'),
  playerLevel: document.getElementById('playerLevel'),
  playerRank: document.getElementById('playerRank'),
  playerProgressBar: document.getElementById('playerProgressBar'),
  playerProgressText: document.getElementById('playerProgressText'),
  playerWallet: document.getElementById('playerWallet'),
  playerStats: document.getElementById('playerStats'),
  titleRoadmap: document.getElementById('titleRoadmap'),
  playerLoadout: document.getElementById('playerLoadout'),
  sceneSwitcher: document.getElementById('sceneSwitcher'),
  upgradeShop: document.getElementById('upgradeShop'),
  playerProjects: document.getElementById('playerProjects'),
  recentWorkspaceList: document.getElementById('recentWorkspaceList'),
};

const ctx = dom.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const state = {
  snapshot: null,
  socket: null,
  images: new Map(),
  actors: new Map(),
  actorBounds: [],
  hoveredActorId: null,
  selectedActorId: null,
  player: null,
  rpg: null,
  rpgStorage: loadStoredRpgState(),
  playerLoading: false,
  lastPlayerWorkspace: '',
  inputDirty: false,
  lastFrameAt: performance.now(),
};

function safeJsonParse(input, fallback = null) {
  try {
    return JSON.parse(String(input || ''));
  } catch {
    return fallback;
  }
}

function loadStoredRpgState() {
  try {
    const stored = window.localStorage.getItem(RPG_STORAGE_KEY);
    return safeJsonParse(stored, { purchasedIds: [], activeThemeId: '' }) || {
      purchasedIds: [],
      activeThemeId: '',
    };
  } catch {
    return {
      purchasedIds: [],
      activeThemeId: '',
    };
  }
}

function persistRpgState() {
  if (!state.rpg?.storage) return;
  state.rpgStorage = { ...state.rpg.storage };
  try {
    window.localStorage.setItem(RPG_STORAGE_KEY, JSON.stringify(state.rpgStorage));
  } catch {
    // Ignore localStorage persistence failures.
  }
}

function refreshRpgState() {
  state.rpg = state.player?.ok ? computeRpgState(state.player, state.rpgStorage) : null;
}

function activeTheme() {
  return state.rpg?.activeTheme || THEME_DEFS.starter;
}

function hasUpgrade(upgradeId) {
  return Boolean(state.rpg?.purchasedIds?.includes(upgradeId));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

async function loadAssets() {
  const imageEntries = [
    ...ASSET_MANIFEST.floors.map((src, index) => [`floor-${index}`, src]),
    ...Object.entries(ASSET_MANIFEST.furniture),
    ...Object.entries(ASSET_MANIFEST.characters),
  ];

  await Promise.all(
    imageEntries.map(async ([key, src]) => {
      const image = await loadImage(src);
      state.images.set(key, image);
    }),
  );
}

function getWsUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}`;
}

function connectSocket() {
  const socket = new WebSocket(getWsUrl());
  state.socket = socket;

  socket.addEventListener('open', () => {
    dom.connectionPill.textContent = 'Local bridge online';
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'snapshot') {
      state.snapshot = message.data;
      renderDashboard();
    }
  });

  socket.addEventListener('close', () => {
    dom.connectionPill.textContent = 'Reconnecting local bridge...';
    setTimeout(connectSocket, 1000);
  });
}

function sendConnect(workspacePath) {
  if (!state.socket || state.socket.readyState !== WebSocket.OPEN) return;
  state.socket.send(JSON.stringify({ type: 'connect', workspacePath }));
}

function resizeCanvas() {
  const rect = dom.stage.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  dom.canvas.width = Math.floor(rect.width * ratio);
  dom.canvas.height = Math.floor(rect.height * ratio);
  dom.canvas.style.width = `${rect.width}px`;
  dom.canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function getScale() {
  const rect = dom.stage.getBoundingClientRect();
  const worldWidth = OFFICE_COLS * TILE_SIZE;
  const worldHeight = OFFICE_ROWS * TILE_SIZE;
  const zoom = Math.max(2, Math.floor(Math.min((rect.width - 32) / worldWidth, (rect.height - 32) / worldHeight)));
  return {
    rect,
    zoom,
    offsetX: Math.floor((rect.width - worldWidth * zoom) / 2),
    offsetY: Math.floor((rect.height - worldHeight * zoom) / 2),
  };
}

function formatProjectLabel(snapshot) {
  return snapshot?.session?.label || snapshot?.requestedWorkspace || 'No project linked';
}

function shortProjectName(snapshot) {
  const label = formatProjectLabel(snapshot);
  return String(label).split(/[\\/]/).pop();
}

function compactText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, max = 72) {
  const text = compactText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(1, max - 3))}...`;
}

function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

function formatRelativeDate(dateLike) {
  if (!dateLike) return 'recently';
  const delta = Date.now() - new Date(dateLike).getTime();
  const minutes = Math.max(1, Math.round(delta / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

function runtimePalette(status) {
  const theme = activeTheme();

  switch (status) {
    case 'working':
      return {
        accent: theme.accent,
        secondary: theme.secondary,
        marker: '#ffe7bb',
      };
    case 'research':
      return {
        accent: theme.secondary,
        secondary: '136, 183, 255',
        marker: theme.marker,
      };
    case 'error':
      return {
        accent: '255, 145, 123',
        secondary: theme.accent,
        marker: '#ffd5cd',
      };
    case 'talking':
      return {
        accent: '136, 183, 255',
        secondary: theme.secondary,
        marker: '#dce6ff',
      };
    default:
      return {
        accent: theme.accent,
        secondary: theme.secondary,
        marker: theme.marker,
      };
  }
}

function ensureActorVisual(actor) {
  if (!state.actors.has(actor.id)) {
    const station = STATIONS[actor.station] || STATIONS.mainDesk;
    state.actors.set(actor.id, {
      x: station.home.x,
      y: station.home.y,
      targetX: station.home.x,
      targetY: station.home.y,
      dir: station.home.face,
      idleIndex: 0,
      idleTimer: 0,
      pulse: Math.random() * Math.PI * 2,
    });
  }
  return state.actors.get(actor.id);
}

function getStationPoint(actor, active) {
  const station = STATIONS[actor.station] || STATIONS.mainDesk;
  if (active) return station.home;
  const visual = state.actors.get(actor.id);
  const idleIndex = (visual?.idleIndex || 0) % station.idle.length;
  return { ...station.idle[idleIndex], face: visual?.dir || station.home.face };
}

function updateActors(deltaSeconds) {
  if (!state.snapshot?.actors) return;

  for (const actor of state.snapshot.actors) {
    const visual = ensureActorVisual(actor);
    const isActive = ['working', 'research', 'talking', 'error'].includes(actor.status);
    const target = getStationPoint(actor, isActive);

    if (isActive) {
      visual.targetX = target.x;
      visual.targetY = target.y;
      visual.idleTimer = 0;
      visual.idleIndex = 0;
    } else {
      visual.idleTimer -= deltaSeconds;
      const distanceToTarget = Math.hypot(visual.targetX - visual.x, visual.targetY - visual.y);
      if (visual.idleTimer <= 0 && distanceToTarget < 0.12) {
        visual.idleIndex = (visual.idleIndex + 1) % STATIONS[actor.station].idle.length;
        const roam = getStationPoint(actor, false);
        visual.targetX = roam.x;
        visual.targetY = roam.y;
        visual.idleTimer = 4 + Math.random() * 1.4;
      }
    }

    const dx = visual.targetX - visual.x;
    const dy = visual.targetY - visual.y;
    const distance = Math.hypot(dx, dy);
    const speed = 1.95;

    if (distance > 0.02) {
      visual.x += (dx / distance) * speed * deltaSeconds;
      visual.y += (dy / distance) * speed * deltaSeconds;
      visual.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
    } else {
      visual.x = visual.targetX;
      visual.y = visual.targetY;
      if (target.face) visual.dir = target.face;
    }
  }
}

function actorAnimation(actor, visual) {
  const distance = Math.hypot(visual.targetX - visual.x, visual.targetY - visual.y);
  if (distance > 0.06) return 'walk';
  if (actor.status === 'research') return 'read';
  if (actor.status === 'working' || actor.status === 'talking' || actor.status === 'error') return 'type';
  return 'idle';
}

function frameIndex(animation, timeSeconds) {
  if (animation === 'walk') return [0, 1, 2, 1][Math.floor(timeSeconds / 0.16) % 4];
  if (animation === 'type') return [3, 4][Math.floor(timeSeconds / 0.32) % 2];
  if (animation === 'read') return [5, 6][Math.floor(timeSeconds / 0.42) % 2];
  return 0;
}

function drawSpriteFrame(image, sx, sy, sw, sh, dx, dy, dw, dh, flip = false) {
  ctx.save();
  if (flip) {
    ctx.translate(dx + dw, dy);
    ctx.scale(-1, 1);
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, dw, dh);
  } else {
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }
  ctx.restore();
}

function drawActorSprite(image, sx, sy, worldX, worldY, scaleZoom, options = {}) {
  const width = 16 * scaleZoom;
  const height = 32 * scaleZoom;
  const scaleX = options.scaleX ?? 1;
  const scaleY = options.scaleY ?? 1;
  const rotation = options.rotation ?? 0;
  const flip = options.flip ?? false;

  ctx.save();
  ctx.translate(worldX, worldY);
  ctx.rotate(rotation);
  ctx.scale(flip ? -scaleX : scaleX, scaleY);
  ctx.drawImage(image, sx, sy, 16, 32, -width / 2, -height, width, height);
  ctx.restore();

  return {
    width: width * scaleX,
    height: height * scaleY,
  };
}

function drawRoomShell(scale, timeSeconds) {
  const width = OFFICE_COLS * TILE_SIZE * scale.zoom;
  const height = OFFICE_ROWS * TILE_SIZE * scale.zoom;
  const wallHeight = 4.5 * TILE_SIZE * scale.zoom;
  const floorY = scale.offsetY + wallHeight;
  const palette = runtimePalette(state.snapshot?.runtime?.status);
  const theme = activeTheme();

  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, dom.stage.clientWidth, dom.stage.clientHeight);

  const wallGradient = ctx.createLinearGradient(0, scale.offsetY, 0, floorY + TILE_SIZE * scale.zoom);
  wallGradient.addColorStop(0, theme.wallTop);
  wallGradient.addColorStop(0.45, theme.wallMid);
  wallGradient.addColorStop(1, theme.wallBottom);
  ctx.fillStyle = wallGradient;
  ctx.fillRect(scale.offsetX, scale.offsetY, width, height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fillRect(scale.offsetX, scale.offsetY, width, TILE_SIZE * scale.zoom);

  const ceilingGlow = ctx.createLinearGradient(0, scale.offsetY, 0, scale.offsetY + 2.75 * TILE_SIZE * scale.zoom);
  ceilingGlow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  ceilingGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = ceilingGlow;
  ctx.fillRect(scale.offsetX, scale.offsetY, width, 3 * TILE_SIZE * scale.zoom);

  for (let panel = 0; panel < 6; panel += 1) {
    const x = scale.offsetX + panel * 3.66 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = panel % 2 === 0 ? 'rgba(255, 255, 255, 0.018)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(x, scale.offsetY + 2 * TILE_SIZE * scale.zoom, 2, floorY - scale.offsetY);
  }

  drawWindow(scale, 2, 1, 5, 2.4, timeSeconds);
  drawWindow(scale, 8.4, 1, 5, 2.4, timeSeconds + 0.65);
  drawWindow(scale, 14.8, 1, 5, 2.4, timeSeconds + 1.3);

  ctx.fillStyle = 'rgba(228, 235, 255, 0.2)';
  ctx.fillRect(scale.offsetX, floorY - 5, width, 5);

  ctx.fillStyle = `rgba(${palette.accent}, 0.09)`;
  ctx.fillRect(scale.offsetX + 6.5 * TILE_SIZE * scale.zoom, floorY, 6.2 * TILE_SIZE * scale.zoom, 5.7 * TILE_SIZE * scale.zoom);
  ctx.fillStyle = `rgba(${palette.secondary}, 0.06)`;
  ctx.fillRect(scale.offsetX + 13.3 * TILE_SIZE * scale.zoom, floorY - 0.4 * TILE_SIZE * scale.zoom, 5.8 * TILE_SIZE * scale.zoom, 4.5 * TILE_SIZE * scale.zoom);

  drawCeilingLamp(scale, 6.6, timeSeconds + 0.3);
  drawCeilingLamp(scale, 15.2, timeSeconds + 0.9);
}

function drawWindow(scale, col, row, widthTiles, heightTiles, timeSeconds) {
  const x = scale.offsetX + col * TILE_SIZE * scale.zoom;
  const y = scale.offsetY + row * TILE_SIZE * scale.zoom;
  const width = widthTiles * TILE_SIZE * scale.zoom;
  const height = heightTiles * TILE_SIZE * scale.zoom;
  const theme = activeTheme();

  ctx.fillStyle = '#0b111b';
  ctx.fillRect(x, y, width, height);

  const sky = ctx.createLinearGradient(0, y, 0, y + height);
  sky.addColorStop(0, theme.windowTop);
  sky.addColorStop(0.6, theme.windowBottom);
  sky.addColorStop(1, '#101727');
  ctx.fillStyle = sky;
  ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.52)';
  for (let i = 0; i < 7; i += 1) {
    const starX = x + 6 + ((i * 11 + Math.floor(timeSeconds * 4)) % Math.max(10, width - 12));
    const starY = y + 6 + ((i * 9) % Math.max(8, height - 12));
    ctx.fillRect(starX, starY, 2, 2);
  }

  ctx.fillStyle = `rgba(${theme.wallGlow}, 0.26)`;
  for (let i = 0; i < 6; i += 1) {
    const bx = x + 8 + i * (width / 7);
    const bh = 6 + ((i * 7) % 16);
    ctx.fillRect(bx, y + height - bh - 4, 5, bh);
  }

  ctx.fillStyle = '#7a879f';
  ctx.fillRect(x - 2, y - 2, width + 4, 3);
  ctx.fillRect(x - 2, y + height - 1, width + 4, 3);
  ctx.fillRect(x - 2, y - 2, 3, height + 4);
  ctx.fillRect(x + width - 1, y - 2, 3, height + 4);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(x + width / 2 - 2, y, 4, height);
}

function drawCeilingLamp(scale, col, timeSeconds) {
  const x = scale.offsetX + col * TILE_SIZE * scale.zoom;
  const y = scale.offsetY + 0.55 * TILE_SIZE * scale.zoom;
  const width = 1.1 * TILE_SIZE * scale.zoom;
  const height = 0.45 * TILE_SIZE * scale.zoom;

  ctx.fillStyle = '#d9d4c5';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#7c7368';
  ctx.fillRect(x + width / 2 - 2, y - 10, 4, 10);

  const glow = ctx.createRadialGradient(
    x + width / 2,
    y + height / 2,
    8,
    x + width / 2,
    y + height / 2,
    120,
  );
  glow.addColorStop(0, `rgba(255, 225, 163, ${0.14 + Math.sin(timeSeconds * 1.2) * 0.02})`);
  glow.addColorStop(1, 'rgba(255, 225, 163, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - 120, y - 20, 240, 180);
}

function drawRug(scale, col, row, widthTiles, heightTiles, colors) {
  const x = scale.offsetX + col * TILE_SIZE * scale.zoom;
  const y = scale.offsetY + row * TILE_SIZE * scale.zoom;
  const width = widthTiles * TILE_SIZE * scale.zoom;
  const height = heightTiles * TILE_SIZE * scale.zoom;

  ctx.fillStyle = colors[0];
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = colors[1];
  ctx.fillRect(x + 4, y + 4, width - 8, height - 8);
  ctx.fillStyle = colors[2];
  ctx.fillRect(x + 10, y + 10, width - 20, height - 20);
}

function drawFloor(scale) {
  const startY = scale.offsetY + 4.5 * TILE_SIZE * scale.zoom;
  const plankHeight = Math.max(4, Math.floor(scale.zoom * 4));
  const width = OFFICE_COLS * TILE_SIZE * scale.zoom;
  const height = OFFICE_ROWS * TILE_SIZE * scale.zoom - (startY - scale.offsetY);
  const theme = activeTheme();

  ctx.fillStyle = theme.floorA;
  ctx.fillRect(scale.offsetX, startY, width, height);

  for (let y = 0; y < height; y += plankHeight) {
    const band = Math.floor(y / plankHeight);
    ctx.fillStyle = band % 2 === 0 ? theme.floorA : theme.floorB;
    ctx.fillRect(scale.offsetX, startY + y, width, plankHeight);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(scale.offsetX, startY + y, width, 1);
  }

  drawRug(scale, 6.85, 7.15, 5.6, 3.45, theme.rugs[0]);
  drawRug(scale, 14.25, 6.4, 4.7, 2.9, theme.rugs[1]);
  drawRug(scale, 2.35, 9.15, 4.7, 2.7, theme.rugs[2]);
}

function drawAmbient(scale, timeSeconds) {
  const palette = runtimePalette(state.snapshot?.runtime?.status);
  const warm = ctx.createRadialGradient(
    scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
    scale.offsetY + 7.6 * TILE_SIZE * scale.zoom,
    14,
    scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
    scale.offsetY + 7.6 * TILE_SIZE * scale.zoom,
    250,
  );
  warm.addColorStop(0, `rgba(${palette.accent}, 0.22)`);
  warm.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, dom.stage.clientWidth, dom.stage.clientHeight);

  const coolAlpha = 0.08 + Math.sin(timeSeconds * 1.6) * 0.02;
  ctx.fillStyle = `rgba(${palette.secondary},${coolAlpha})`;
  ctx.fillRect(scale.offsetX + 14.3 * TILE_SIZE * scale.zoom, scale.offsetY + 5.1 * TILE_SIZE * scale.zoom, 1.25 * TILE_SIZE * scale.zoom, 0.85 * TILE_SIZE * scale.zoom);
  ctx.fillRect(scale.offsetX + 8.35 * TILE_SIZE * scale.zoom, scale.offsetY + 6.1 * TILE_SIZE * scale.zoom, 1.3 * TILE_SIZE * scale.zoom, 0.85 * TILE_SIZE * scale.zoom);

  ctx.fillStyle = `rgba(${palette.secondary}, 0.06)`;
  for (let i = 0; i < 8; i += 1) {
    const particleX = scale.offsetX + (((timeSeconds * 26 + i * 38) % (OFFICE_COLS * TILE_SIZE)) * scale.zoom);
    const particleY = scale.offsetY + 1.6 * TILE_SIZE * scale.zoom + Math.sin(timeSeconds * 0.9 + i) * 8 + (i % 3) * 22;
    ctx.fillRect(Math.round(particleX), Math.round(particleY), 2, 2);
  }

  const vignette = ctx.createLinearGradient(0, scale.offsetY, 0, scale.offsetY + OFFICE_ROWS * TILE_SIZE * scale.zoom);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(0,0,0,0.16)');
  ctx.fillStyle = vignette;
  ctx.fillRect(scale.offsetX, scale.offsetY, OFFICE_COLS * TILE_SIZE * scale.zoom, OFFICE_ROWS * TILE_SIZE * scale.zoom);
}

function drawFurniture(scale, timeSeconds) {
  const pcFrame = ['pc1', 'pc2', 'pc3'][Math.floor(timeSeconds * 5) % 3];
  const palette = runtimePalette(state.snapshot?.runtime?.status);
  const dynamicItems = [
    ...FURNITURE_LAYOUT,
    { image: pcFrame, col: 8, row: 6 },
    { image: pcFrame, col: 14, row: 5 },
  ];

  if (hasUpgrade('dual-rig') || hasUpgrade('legendary-rig')) {
    dynamicItems.push({ image: pcFrame, col: 9, row: 6 });
  }

  if (hasUpgrade('window-garden')) {
    dynamicItems.push({ image: 'plant', col: 17, row: 8 }, { image: 'plant', col: 20, row: 7 });
  }

  const items = dynamicItems
    .map((item) => {
      const image = state.images.get(item.image);
      if (!image) return null;
      return { ...item, image, z: item.row + image.height / TILE_SIZE };
    })
    .filter(Boolean)
    .sort((a, b) => a.z - b.z);

  for (const item of items) {
    const width = item.image.width * scale.zoom;
    const height = item.image.height * scale.zoom;
    const sway =
      item.image === state.images.get('hangingPlant')
        ? Math.sin(timeSeconds * 1.6 + item.col) * Math.max(1, scale.zoom * 0.45)
        : 0;
    const x = scale.offsetX + item.col * TILE_SIZE * scale.zoom + sway;
    const y = scale.offsetY + (item.row + 1) * TILE_SIZE * scale.zoom - height;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x + 4, y + height - 8, width - 8, 8);
    ctx.drawImage(item.image, x, y, width, height);
  }

  const glowAlpha = 0.12 + Math.sin(timeSeconds * 3.6) * 0.04;
  ctx.fillStyle = `rgba(${palette.secondary}, ${glowAlpha})`;
  ctx.fillRect(scale.offsetX + 8.35 * TILE_SIZE * scale.zoom, scale.offsetY + 6.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
  ctx.fillRect(scale.offsetX + 14.35 * TILE_SIZE * scale.zoom, scale.offsetY + 5.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);

  ctx.fillStyle = `rgba(${palette.accent}, 0.18)`;
  ctx.fillRect(scale.offsetX + 4.35 * TILE_SIZE * scale.zoom, scale.offsetY + 8.2 * TILE_SIZE * scale.zoom - Math.sin(timeSeconds * 2.4) * 2, 2, 12);
  ctx.fillRect(scale.offsetX + 4.75 * TILE_SIZE * scale.zoom, scale.offsetY + 8.0 * TILE_SIZE * scale.zoom - Math.sin(timeSeconds * 2.4 + 0.6) * 2, 2, 10);

  drawOfficeUpgrades(scale, timeSeconds, palette);
}

function drawOfficeUpgrades(scale, timeSeconds, palette) {
  if (hasUpgrade('smart-lights')) {
    ctx.fillStyle = `rgba(${palette.accent}, 0.1)`;
    ctx.fillRect(scale.offsetX + 0.9 * TILE_SIZE * scale.zoom, scale.offsetY + 0.7 * TILE_SIZE * scale.zoom, 8.2 * TILE_SIZE * scale.zoom, 0.28 * TILE_SIZE * scale.zoom);
    ctx.fillRect(scale.offsetX + 12.9 * TILE_SIZE * scale.zoom, scale.offsetY + 0.7 * TILE_SIZE * scale.zoom, 8.2 * TILE_SIZE * scale.zoom, 0.28 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('server-rack')) {
    const rackX = scale.offsetX + 18.9 * TILE_SIZE * scale.zoom;
    const rackY = scale.offsetY + 6.05 * TILE_SIZE * scale.zoom;
    const rackW = 1.8 * TILE_SIZE * scale.zoom;
    const rackH = 2.85 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.95)';
    ctx.fillRect(rackX, rackY, rackW, rackH);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeRect(rackX, rackY, rackW, rackH);

    for (let i = 0; i < 5; i += 1) {
      const ledY = rackY + 10 + i * 11;
      const ledAlpha = 0.5 + Math.sin(timeSeconds * 2.6 + i) * 0.18;
      ctx.fillStyle = `rgba(${palette.secondary}, ${ledAlpha})`;
      ctx.fillRect(rackX + 8, ledY, rackW - 16, 3);
    }
  }

  if (hasUpgrade('holo-board')) {
    const holoX = scale.offsetX + 13.1 * TILE_SIZE * scale.zoom;
    const holoY = scale.offsetY + 1.15 * TILE_SIZE * scale.zoom;
    const holoW = 3.7 * TILE_SIZE * scale.zoom;
    const holoH = 1.1 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = `rgba(${palette.secondary}, 0.08)`;
    ctx.fillRect(holoX, holoY, holoW, holoH);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.35)`;
    ctx.strokeRect(holoX, holoY, holoW, holoH);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.3)`;
    ctx.fillRect(holoX + 8, holoY + holoH / 2 - 2, holoW - 16, 4);
  }

  if (hasUpgrade('helper-drone')) {
    const droneX = scale.offsetX + 17.2 * TILE_SIZE * scale.zoom + Math.sin(timeSeconds * 1.8) * 10;
    const droneY = scale.offsetY + 4.4 * TILE_SIZE * scale.zoom + Math.cos(timeSeconds * 2.1) * 6;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.92)';
    ctx.fillRect(droneX - 9, droneY - 5, 18, 10);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.82)`;
    ctx.fillRect(droneX - 5, droneY - 1, 10, 2);
    ctx.fillRect(droneX - 1, droneY - 5, 2, 10);
  }

  if (hasUpgrade('arcade-corner')) {
    const cabinetX = scale.offsetX + 1.25 * TILE_SIZE * scale.zoom;
    const cabinetY = scale.offsetY + 8.2 * TILE_SIZE * scale.zoom;
    const cabinetW = 1.35 * TILE_SIZE * scale.zoom;
    const cabinetH = 2.5 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#181521';
    ctx.fillRect(cabinetX, cabinetY, cabinetW, cabinetH);
    ctx.fillStyle = `rgba(${palette.accent}, 0.88)`;
    ctx.fillRect(cabinetX + 6, cabinetY + 6, cabinetW - 12, 10);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.8)`;
    ctx.fillRect(cabinetX + cabinetW / 2 - 2, cabinetY + 24, 4, 4);
    ctx.fillRect(cabinetX + cabinetW / 2 - 8, cabinetY + 31, 16, 4);
  }
}

function drawSyncBeacon(scale, timeSeconds) {
  const online = Boolean(state.snapshot?.ok);
  const palette = runtimePalette(state.snapshot?.runtime?.status);
  const beaconWidth = 3.8 * TILE_SIZE * scale.zoom;
  const beaconHeight = 1.2 * TILE_SIZE * scale.zoom;
  const beaconX = scale.offsetX + 1.1 * TILE_SIZE * scale.zoom;
  const beaconY = scale.offsetY + 0.95 * TILE_SIZE * scale.zoom;

  ctx.fillStyle = 'rgba(7, 11, 18, 0.78)';
  ctx.fillRect(beaconX, beaconY, beaconWidth, beaconHeight);
  ctx.strokeStyle = online ? `rgba(${palette.secondary},0.34)` : 'rgba(255,145,123,0.34)';
  ctx.lineWidth = 2;
  ctx.strokeRect(beaconX, beaconY, beaconWidth, beaconHeight);

  const pulse = 0.5 + Math.sin(timeSeconds * 4.5) * 0.18;
  ctx.fillStyle = online ? `rgba(${palette.secondary},${0.75 + pulse * 0.15})` : `rgba(255,145,123,${0.75 + pulse * 0.15})`;
  ctx.fillRect(beaconX + 6, beaconY + beaconHeight / 2 - 4, 8, 8);

  ctx.fillStyle = online ? palette.marker : '#ffe1d8';
  ctx.font = `${Math.max(9, Math.floor(scale.zoom * 4.2))}px "IBM Plex Mono", monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(shortProjectName(state.snapshot || {})).slice(0, 11), beaconX + 20, beaconY + beaconHeight / 2);
}

function drawActors(scale, timeSeconds) {
  if (!state.snapshot?.actors) return [];
  const anchors = [];
  const hitboxes = [];
  const palette = runtimePalette(state.snapshot?.runtime?.status);
  const playerLevel = state.player?.progression?.level || 1;

  for (const actor of state.snapshot.actors) {
    const visual = ensureActorVisual(actor);
    const animation = actorAnimation(actor, visual);
    const frame = frameIndex(animation, timeSeconds + visual.pulse);
    const image = state.images.get(actor.id);
    if (!image) continue;

    const rowMap = { down: 0, up: 1, right: 2, left: 2 };
    const sx = frame * 16;
    const sy = rowMap[visual.dir] * 32;
    const worldX = scale.offsetX + visual.x * TILE_SIZE * scale.zoom;
    const worldY = scale.offsetY + visual.y * TILE_SIZE * scale.zoom;
    const walkWave = Math.sin(timeSeconds * 11 + visual.pulse);
    const idleBreath = Math.sin(timeSeconds * 2.1 + visual.pulse) * 0.045;
    const isHovered = state.hoveredActorId === actor.id;
    const isSelected = state.selectedActorId === actor.id && !dom.profileModal.hidden;
    const hoverBoost = isHovered || isSelected ? 0.06 : 0;
    const scaleX = 1 + (animation === 'walk' ? walkWave * 0.04 : idleBreath * 0.5) + hoverBoost;
    const scaleY = 1 - (animation === 'walk' ? Math.abs(walkWave) * 0.04 : idleBreath * 0.65) + hoverBoost;
    const bobble = animation === 'idle' ? Math.sin(timeSeconds * 2.2 + visual.pulse) * 2.2 : animation === 'walk' ? Math.abs(walkWave) * 1.8 : 0;
    const drawBottomY = Math.round(worldY + bobble);
    const rotation = animation === 'walk' ? walkWave * 0.035 : Math.sin(timeSeconds * 1.35 + visual.pulse) * 0.012;

    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.beginPath();
    ctx.ellipse(worldX, worldY + 4 * scale.zoom, 8 * scale.zoom * scaleX, 3 * scale.zoom * (1 + hoverBoost), 0, 0, Math.PI * 2);
    ctx.fill();

    if (actor.id === 'codex' && state.snapshot?.ok) {
      const aura = ctx.createRadialGradient(worldX, drawBottomY - 18 * scale.zoom, 6, worldX, drawBottomY - 18 * scale.zoom, 34 + playerLevel * 1.4);
      aura.addColorStop(0, `rgba(${palette.secondary}, 0.24)`);
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = aura;
      ctx.fillRect(worldX - 50, drawBottomY - 88, 100, 120);
    }

    if (actor.status === 'error') {
      ctx.fillStyle = 'rgba(255,143,122,0.14)';
      ctx.fillRect(worldX - 14 * scale.zoom, drawBottomY - 34 * scale.zoom, 28 * scale.zoom, 34 * scale.zoom);
    }

    const spriteBox = drawActorSprite(image, sx, sy, worldX, drawBottomY, scale.zoom, {
      flip: visual.dir === 'left',
      scaleX,
      scaleY,
      rotation,
    });

    const drawWidth = spriteBox.width;
    const drawHeight = spriteBox.height;
    const drawX = Math.round(worldX - drawWidth / 2);
    const drawY = Math.round(drawBottomY - drawHeight);

    if (actor.id === 'codex' && state.player?.ok) {
      const badgeWidth = 1.15 * TILE_SIZE * scale.zoom;
      const badgeHeight = 0.7 * TILE_SIZE * scale.zoom;
      const badgeX = worldX + 0.55 * TILE_SIZE * scale.zoom;
      const badgeY = drawY + 4;
      ctx.fillStyle = 'rgba(8, 13, 22, 0.9)';
      ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.strokeStyle = `rgba(${palette.accent}, 0.6)`;
      ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.fillStyle = '#ffe6b9';
      ctx.font = `${Math.max(8, Math.floor(scale.zoom * 3.6))}px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`LV${playerLevel}`, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2 + 1);
    }

    if (actor.status === 'working' || actor.status === 'research' || isHovered || isSelected) {
      const sparkColor = actor.status === 'error' ? '255,145,123' : palette.secondary;
      for (let spark = 0; spark < 3; spark += 1) {
        const sparkX = worldX + Math.sin(timeSeconds * 3 + visual.pulse + spark) * (8 + spark * 3);
        const sparkY = drawY - 6 - spark * 6 + Math.cos(timeSeconds * 4 + spark) * 2;
        ctx.fillStyle = `rgba(${sparkColor}, ${0.55 - spark * 0.12})`;
        ctx.fillRect(Math.round(sparkX), Math.round(sparkY), 3, 3);
      }
    }

    if (isHovered || isSelected) {
      ctx.strokeStyle = `rgba(${palette.secondary}, 0.55)`;
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX - 4, drawY - 4, drawWidth + 8, drawHeight + 8);
    }

    anchors.push({
      x: drawX + drawWidth / 2,
      y: drawY - 6,
      bubble: actor.bubble,
      status: actor.status,
      name: actor.name,
    });

    hitboxes.push({
      id: actor.id,
      name: actor.name,
      left: drawX - 6,
      top: drawY - 8,
      right: drawX + drawWidth + 6,
      bottom: drawBottomY + 6,
      z: worldY,
    });
  }

  state.actorBounds = hitboxes.sort((left, right) => left.z - right.z);

  return anchors;
}

function renderBubbles(anchors) {
  dom.bubbleLayer.innerHTML = anchors
    .map(
      (anchor) => `
        <div class="bubble" data-status="${anchor.status}" style="left:${anchor.x}px; top:${anchor.y}px;">
          <strong>${anchor.name}</strong><br />
          ${anchor.bubble}
        </div>
      `,
    )
    .join('');
}

function actorAtPointer(event) {
  const rect = dom.stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const hit = [...state.actorBounds]
    .reverse()
    .find((bounds) => x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom);
  return hit || null;
}

function renderScene(timestamp) {
  const timeSeconds = timestamp / 1000;
  const deltaSeconds = Math.min(0.1, (timestamp - state.lastFrameAt) / 1000);
  state.lastFrameAt = timestamp;

  resizeCanvas();
  const scale = getScale();
  ctx.clearRect(0, 0, dom.stage.clientWidth, dom.stage.clientHeight);

  drawRoomShell(scale, timeSeconds);
  drawFloor(scale);
  drawFurniture(scale, timeSeconds);
  drawAmbient(scale, timeSeconds);
  drawSyncBeacon(scale, timeSeconds);
  updateActors(deltaSeconds);
  const anchors = drawActors(scale, timeSeconds);
  renderBubbles(anchors);

  requestAnimationFrame(renderScene);
}

function runtimeLabel(status) {
  switch (status) {
    case 'working':
      return 'Editing live';
    case 'research':
      return 'Researching';
    case 'thinking':
      return 'Planning';
    case 'talking':
      return 'Reporting';
    case 'waiting':
      return 'Synced';
    case 'error':
      return 'Needs fix';
    default:
      return 'Idle';
  }
}

function gitSummary(workspace) {
  if (!workspace?.isGit) return workspace?.cwd ? 'Workspace linked' : 'No repo';
  if (workspace.dirtyCount) {
    return `${workspace.branch || 'detached'} | ${workspace.dirtyCount} changed`;
  }
  return workspace.branch ? `${workspace.branch} | clean` : 'Git clean';
}

function currentToolLabel(snapshot) {
  const runtime = snapshot?.runtime || {};
  if (runtime.currentTool?.kind === 'shell') {
    return truncate(runtime.currentTool.command || runtime.currentTool.label || 'Shell', 30);
  }
  if (runtime.currentTool?.label) {
    return truncate(runtime.currentTool.label, 30);
  }
  if (runtime.lastTool?.headline) {
    return truncate(runtime.lastTool.headline, 30);
  }
  return 'Standing by';
}

function feedSummary(feed) {
  const item = feed?.[0];
  if (!item) return 'Waiting for activity';
  return truncate(item.detail || item.title || 'Waiting for activity', 34);
}

function setAvatarImage(element, url) {
  if (!element) return;
  element.src = url || '';
  element.hidden = !url;
}

function openProfile(actorId = 'codex') {
  state.selectedActorId = actorId;
  dom.profileModal.hidden = false;
  renderPlayerProfile();
  if (!state.player && !state.playerLoading) {
    loadPlayerProfile();
  }
}

function closeProfile() {
  state.selectedActorId = null;
  dom.profileModal.hidden = true;
}

async function loadPlayerProfile(force = false) {
  if (state.playerLoading) return;
  state.playerLoading = true;

  try {
    const workspacePath = state.snapshot?.requestedWorkspace || state.snapshot?.session?.cwd || dom.workspaceInput.value.trim();
    const params = new URLSearchParams();
    if (workspacePath) params.set('workspacePath', workspacePath);
    if (force) params.set('refresh', '1');
    const response = await fetch(`/api/player?${params.toString()}`);
    const payload = await response.json();
    state.player = payload;
    refreshRpgState();
    state.lastPlayerWorkspace = workspacePath;
    renderPlayerProfile();
  } catch {
    state.player = {
      ok: false,
      error: 'Unable to load GitHub player profile.',
    };
    refreshRpgState();
    renderPlayerProfile();
  } finally {
    state.playerLoading = false;
  }
}

function renderRecentWorkspaceList() {
  const projects = state.snapshot?.recentProjects || [];
  if (!projects.length) {
    dom.recentWorkspaceList.innerHTML = '<div class="profile-empty">No recent Codex workspaces yet.</div>';
    return;
  }

  dom.recentWorkspaceList.innerHTML = projects
    .slice(0, 6)
    .map(
      (project) => `
        <button class="profile-project" type="button" data-workspace="${project.cwd}">
          <strong>${project.label}</strong>
          <span class="profile-project-meta">${project.cwd}</span>
        </button>
      `,
    )
    .join('');

  dom.recentWorkspaceList.querySelectorAll('.profile-project').forEach((button) => {
    button.addEventListener('click', () => {
      state.inputDirty = false;
      dom.workspaceInput.value = button.dataset.workspace;
      sendConnect(button.dataset.workspace);
      closeProfile();
    });
  });
}

function activateTheme(themeId) {
  if (!state.player?.ok || !themeId) return;
  const nextTheme = getThemeById(themeId);
  if (!nextTheme || nextTheme.id !== themeId) return;
  if (!state.rpg?.unlockedThemes?.some((theme) => theme.id === themeId)) return;
  state.rpgStorage = {
    ...(state.rpg?.storage || {}),
    activeThemeId: themeId,
  };
  refreshRpgState();
  persistRpgState();
  renderPlayerProfile();
}

function purchaseUpgrade(upgradeId) {
  if (!state.player?.ok || !upgradeId) return;
  const upgrade = getUpgradeById(upgradeId);
  if (!upgrade || !state.rpg) return;
  if (state.rpg.purchasedIds.includes(upgradeId)) return;
  if (state.rpg.level < upgrade.unlockLevel || state.rpg.coins < upgrade.cost) return;

  state.rpgStorage = {
    ...(state.rpg.storage || {}),
    purchasedIds: [...state.rpg.purchasedIds, upgradeId],
  };
  refreshRpgState();
  persistRpgState();
  renderPlayerProfile();
}

function renderWalletStrip(rpg) {
  dom.playerWallet.innerHTML = `
    <div class="wallet-card wallet-card--coins">
      <span class="wallet-label">Coins</span>
      <strong>${formatCount(rpg.coins)}</strong>
      <span class="wallet-copy">Spend them on office upgrades.</span>
    </div>
    <div class="wallet-card">
      <span class="wallet-label">Earned</span>
      <strong>${formatCount(rpg.coinsEarned)}</strong>
      <span class="wallet-copy">Generated from commits, repos, followers, and level.</span>
    </div>
    <div class="wallet-card">
      <span class="wallet-label">Spent</span>
      <strong>${formatCount(rpg.coinsSpent)}</strong>
      <span class="wallet-copy">Already invested back into the room.</span>
    </div>
    <div class="wallet-card">
      <span class="wallet-label">Theme</span>
      <strong>${rpg.activeTheme.name}</strong>
      <span class="wallet-copy">${rpg.activeTheme.mood}</span>
    </div>
  `;
}

function renderTitleRoadmap(rpg) {
  dom.titleRoadmap.innerHTML = rpg.titleRoadmap
    .map(
      (title) => `
        <article class="title-card ${title.unlocked ? 'is-unlocked' : ''} ${title.current ? 'is-current' : ''} ${title.upcoming ? 'is-upcoming' : ''}">
          <div class="title-card-top">
            <span>Level ${title.level}</span>
            <strong>${title.title}</strong>
          </div>
          <p>${title.flavor}</p>
          <div class="title-unlocks">${title.unlocks.join(' | ')}</div>
        </article>
      `,
    )
    .join('');
}

function renderLoadout(rpg) {
  dom.playerLoadout.innerHTML = [
    ['Current title', rpg.currentTitle.title, rpg.currentTitle.flavor],
    ['Scene', rpg.loadout.scene, rpg.loadout.sceneMood],
    ['Desk rig', rpg.loadout.deskRig, 'Hardware tier currently active in the office.'],
    ['Agents', rpg.loadout.agents.join(' | '), 'Roles and upgrades currently represented in the room.'],
    [
      'Office perks',
      rpg.loadout.officePerks.length ? rpg.loadout.officePerks.join(' | ') : 'Starter setup',
      'Owned upgrades already applied to the environment.',
    ],
  ]
    .map(
      ([label, value, copy]) => `
        <article class="loadout-card">
          <span class="loadout-label">${label}</span>
          <strong>${value}</strong>
          <p>${copy}</p>
        </article>
      `,
    )
    .join('');
}

function renderSceneSwitcher(rpg) {
  dom.sceneSwitcher.innerHTML = rpg.unlockedThemes
    .map(
      (theme) => `
        <button
          class="scene-button ${theme.id === rpg.activeThemeId ? 'is-active' : ''}"
          type="button"
          data-theme-id="${theme.id}"
        >
          <strong>${theme.name}</strong>
          <span>Unlock level ${theme.unlockLevel}</span>
        </button>
      `,
    )
    .join('');

  dom.sceneSwitcher.querySelectorAll('[data-theme-id]').forEach((button) => {
    button.addEventListener('click', () => {
      activateTheme(button.dataset.themeId);
    });
  });
}

function upgradeStatusLabel(upgrade) {
  if (upgrade.owned) return 'Owned';
  if (!upgrade.unlocked) return `Unlocks at level ${upgrade.unlockLevel}`;
  if (!upgrade.affordable) return `Need ${formatCount(upgrade.cost)} coins`;
  return `Buy for ${formatCount(upgrade.cost)} coins`;
}

function renderUpgradeShop(rpg) {
  dom.upgradeShop.innerHTML = rpg.upgradeCatalog
    .map(
      (upgrade) => `
        <article class="upgrade-card ${upgrade.owned ? 'is-owned' : ''} ${upgrade.unlocked ? '' : 'is-locked'}">
          <div class="upgrade-card-head">
            <span>${upgrade.type}</span>
            <strong>${upgrade.name}</strong>
          </div>
          <p>${upgrade.description}</p>
          <div class="upgrade-meta">
            <span>${upgradeStatusLabel(upgrade)}</span>
            <button
              class="upgrade-buy"
              type="button"
              data-upgrade-id="${upgrade.id}"
              ${upgrade.owned || !upgrade.unlocked || !upgrade.affordable ? 'disabled' : ''}
            >
              ${upgrade.owned ? 'Owned' : 'Unlock'}
            </button>
          </div>
        </article>
      `,
    )
    .join('');

  dom.upgradeShop.querySelectorAll('[data-upgrade-id]').forEach((button) => {
    button.addEventListener('click', () => {
      purchaseUpgrade(button.dataset.upgradeId);
    });
  });
}

function renderPlayerProfile() {
  const player = state.player;
  const actorId = state.selectedActorId || 'codex';
  const actorName = actorId === 'trace' ? 'Trace' : actorId === 'scout' ? 'Scout' : 'Codex';

  if (!player?.ok) {
    setAvatarImage(dom.playerAvatarMini, '');
    setAvatarImage(dom.playerAvatar, '');
    dom.playerNameMini.textContent = state.playerLoading ? 'Loading GitHub profile...' : 'GitHub not linked';
    dom.playerLevelMini.textContent = 'Level unavailable';
    dom.playerCommitMini.textContent = player?.error || 'Run gh auth login';
    dom.playerCoinMini.textContent = '0 coins';

    dom.profileSource.textContent = `Selected via ${actorName}`;
    dom.playerName.textContent = state.playerLoading ? 'Loading profile...' : 'GitHub not linked';
    dom.playerHandle.textContent = '@local';
    dom.playerBio.textContent = player?.error || 'Authenticate with gh to unlock GitHub-based player progression.';
    dom.playerLevel.textContent = 'Level unavailable';
    dom.playerRank.textContent = 'Offline';
    dom.playerProgressBar.style.width = '4%';
    dom.playerProgressText.textContent = 'GitHub CLI auth is required for commit XP.';
    dom.playerWallet.innerHTML = '<div class="profile-empty">Wallet data becomes available after GitHub sync.</div>';
    dom.playerStats.innerHTML = '<div class="profile-empty">No player stats available yet.</div>';
    dom.titleRoadmap.innerHTML = '<div class="profile-empty">Title unlocks appear after the player profile loads.</div>';
    dom.playerLoadout.innerHTML = '<div class="profile-empty">Office loadout is waiting for player progression.</div>';
    dom.sceneSwitcher.innerHTML = '<div class="profile-empty">Unlock scenes by linking GitHub progress.</div>';
    dom.upgradeShop.innerHTML = '<div class="profile-empty">Upgrade shop will appear once coins are available.</div>';
    dom.playerProjects.innerHTML = '<div class="profile-empty">No GitHub projects available.</div>';
    renderRecentWorkspaceList();
    return;
  }

  const profile = player.profile;
  const progression = player.progression;
  const rpg = state.rpg || computeRpgState(player, state.rpgStorage);
  const currentTitle = getCurrentTitle(progression.level);
  const sourceLabel =
    actorId === 'trace' ? 'Selected via Trace debugger' : actorId === 'scout' ? 'Selected via Scout watcher' : 'Selected via Codex';

  state.rpg = rpg;
  setAvatarImage(dom.playerAvatarMini, profile.avatarUrl);
  setAvatarImage(dom.playerAvatar, profile.avatarUrl);

  dom.playerNameMini.textContent = profile.name;
  dom.playerLevelMini.textContent = `Level ${progression.level} | ${currentTitle.title}`;
  dom.playerCommitMini.textContent = `${formatCount(progression.totalCommits)} commits`;
  dom.playerCoinMini.textContent = `${formatCount(rpg.coins)} coins`;

  dom.profileSource.textContent = sourceLabel;
  dom.playerName.textContent = profile.name;
  dom.playerHandle.textContent = `@${profile.login}`;
  dom.playerBio.textContent = profile.bio || 'GitHub account linked through gh CLI.';
  dom.playerLevel.textContent = `Level ${progression.level}`;
  dom.playerRank.textContent = currentTitle.title;
  dom.playerProgressBar.style.width = `${Math.max(6, Math.round(progression.progress * 100))}%`;
  dom.playerProgressText.textContent = `${formatCount(progression.commitsToNextLevel)} commits to reach level ${progression.level + 1}`;
  renderWalletStrip(rpg);

  dom.playerStats.innerHTML = [
    ['Total commits', formatCount(progression.totalCommits)],
    ['Repositories', formatCount(profile.repositories)],
    ['Followers', formatCount(profile.followers)],
    ['Following', formatCount(profile.following)],
    ['Contribution XP', formatCount(progression.contributionCommits)],
    ['Owned repo XP', formatCount(progression.ownedRepoCommits)],
  ]
    .map(
      ([label, value]) => `
        <div class="profile-stat">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join('');

  renderTitleRoadmap(rpg);
  renderLoadout(rpg);
  renderSceneSwitcher(rpg);
  renderUpgradeShop(rpg);

  if (!player.projects?.length) {
    dom.playerProjects.innerHTML = '<div class="profile-empty">No GitHub repositories found for this player.</div>';
  } else {
    dom.playerProjects.innerHTML = player.projects
      .map(
        (project) => `
          <a class="profile-project" href="${project.url}" target="_blank" rel="noreferrer">
            <strong>${project.nameWithOwner}</strong>
            <span class="profile-project-desc">${truncate(project.description || 'No repository description.', 96)}</span>
            <span class="profile-project-meta">${formatCount(project.authoredCommits)} authored commits | ${project.language} | pushed ${formatRelativeDate(project.pushedAt)}</span>
          </a>
        `,
      )
      .join('');
  }

  renderRecentWorkspaceList();
}

function renderRecentProjects(projects) {
  if (!projects?.length) {
    dom.recentProjects.innerHTML = '<div class="feed-empty">No recent Codex projects found.</div>';
    return;
  }

  dom.recentProjects.innerHTML = projects
    .map(
      (project) => `
        <button class="chip" type="button" data-cwd="${project.cwd}">
          ${project.label}
        </button>
      `,
    )
    .join('');

  dom.recentProjects.querySelectorAll('.chip').forEach((button) => {
    button.addEventListener('click', () => {
      state.inputDirty = false;
      dom.workspaceInput.value = button.dataset.cwd;
      sendConnect(button.dataset.cwd);
    });
  });
}

function renderDashboard() {
  const snapshot = state.snapshot;
  if (!snapshot) return;

  if (!state.inputDirty && (snapshot.requestedWorkspace || snapshot.session?.cwd)) {
    dom.workspaceInput.value = snapshot.requestedWorkspace || snapshot.session?.cwd || '';
  }

  const runtimeState = snapshot.runtime?.status || 'idle';
  const connectionText = snapshot.ok ? 'Live sync' : 'No sync';

  dom.connectionPill.dataset.state = snapshot.ok ? 'online' : 'offline';
  dom.connectionPill.textContent = connectionText;
  dom.projectPill.textContent = snapshot.ok ? shortProjectName(snapshot) : 'No workspace linked';
  dom.modelBadge.textContent = snapshot.runtime?.model || 'gpt-5.4';
  dom.runtimeBadge.dataset.state = runtimeState;
  dom.runtimeBadge.textContent = runtimeLabel(runtimeState);
  dom.headline.textContent = snapshot.highlights?.headline || 'Transcript synced';
  dom.summary.textContent = snapshot.highlights?.summary || 'Watching your Codex workspace in real time.';
  dom.toolLabel.textContent = currentToolLabel(snapshot);
  dom.debugLabel.textContent = truncate(snapshot.runtime?.lastError?.headline || snapshot.highlights?.debug || 'No recent errors', 32);
  dom.gitLabel.textContent = gitSummary(snapshot.workspace);
  dom.feedLabel.textContent = feedSummary(snapshot.feed);
  dom.projectBadge.textContent = snapshot.ok
    ? `Watching ${formatProjectLabel(snapshot)}`
    : snapshot.error || 'Connect a workspace folder to follow the latest Codex session.';

  renderRecentProjects(snapshot.recentProjects || []);

  const activeWorkspace = snapshot.requestedWorkspace || snapshot.session?.cwd || '';
  if (!state.player || state.lastPlayerWorkspace !== activeWorkspace) {
    loadPlayerProfile();
  } else {
    renderPlayerProfile();
  }
}

dom.connectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.inputDirty = false;
  sendConnect(dom.workspaceInput.value.trim());
});

dom.workspaceInput.addEventListener('input', () => {
  state.inputDirty = true;
});

dom.latestButton.addEventListener('click', () => {
  state.inputDirty = false;
  dom.workspaceInput.value = '';
  sendConnect('');
});

dom.playerGlance.addEventListener('click', () => {
  openProfile('codex');
});

dom.profileClose.addEventListener('click', closeProfile);
dom.profileBackdrop.addEventListener('click', closeProfile);
dom.playerRefreshButton.addEventListener('click', async () => {
  await loadPlayerProfile(true);
});

dom.stage.addEventListener('pointermove', (event) => {
  const hit = actorAtPointer(event);
  state.hoveredActorId = hit?.id || null;
  dom.stage.dataset.hot = hit ? 'true' : 'false';
});

dom.stage.addEventListener('pointerleave', () => {
  state.hoveredActorId = null;
  dom.stage.dataset.hot = 'false';
});

dom.stage.addEventListener('click', (event) => {
  const hit = actorAtPointer(event);
  if (hit) {
    openProfile(hit.id);
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !dom.profileModal.hidden) {
    closeProfile();
  }
});

window.render_game_to_text = () =>
  JSON.stringify({
    sync: Boolean(state.snapshot?.ok),
    project: formatProjectLabel(state.snapshot),
    runtime: state.snapshot?.runtime?.status || 'idle',
    playerLevel: state.player?.progression?.level || 0,
    coins: state.rpg?.coins || 0,
    activeTheme: state.rpg?.activeTheme?.name || 'Starter Loft',
    selectedActor: state.selectedActorId,
    hitboxes: state.actorBounds.map((bounds) => ({
      id: bounds.id,
      left: Math.round(bounds.left),
      top: Math.round(bounds.top),
      right: Math.round(bounds.right),
      bottom: Math.round(bounds.bottom),
    })),
    actors: Array.from(state.actors.entries()).map(([id, visual]) => ({
      id,
      x: Number(visual.x.toFixed(2)),
      y: Number(visual.y.toFixed(2)),
    })),
  });

window.addEventListener('resize', resizeCanvas);

await loadAssets();
if (document.fonts?.ready) {
  await document.fonts.ready;
}
connectSocket();
resizeCanvas();
requestAnimationFrame(renderScene);

