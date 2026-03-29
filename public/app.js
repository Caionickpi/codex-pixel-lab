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
    home: { x: 3.65, y: 6.85, face: 'down' },
    idle: [
      { x: 2.8, y: 8.3 },
      { x: 5.2, y: 8.1 },
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
  { image: 'desk', col: 2, row: 6 },
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
  menuButton: document.getElementById('menuButton'),
  gameMenu: document.getElementById('gameMenu'),
  gameMenuBackdrop: document.getElementById('gameMenuBackdrop'),
  menuClose: document.getElementById('menuClose'),
  menuTabShop: document.getElementById('menuTabShop'),
  menuTabScenes: document.getElementById('menuTabScenes'),
  menuTabInventory: document.getElementById('menuTabInventory'),
  menuPanelShop: document.getElementById('menuPanelShop'),
  menuPanelScenes: document.getElementById('menuPanelScenes'),
  menuPanelInventory: document.getElementById('menuPanelInventory'),
  menuCoinCount: document.getElementById('menuCoinCount'),
  menuHeroCopy: document.getElementById('menuHeroCopy'),
  menuOwnedCount: document.getElementById('menuOwnedCount'),
  menuOwnedCopy: document.getElementById('menuOwnedCopy'),
  menuThemeName: document.getElementById('menuThemeName'),
  menuThemeMood: document.getElementById('menuThemeMood'),
  menuShopSpotlight: document.getElementById('menuShopSpotlight'),
  menuShopFilters: document.getElementById('menuShopFilters'),
  menuShopGrid: document.getElementById('menuShopGrid'),
  menuSceneGrid: document.getElementById('menuSceneGrid'),
  menuInventoryGrid: document.getElementById('menuInventoryGrid'),
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
  menuTab: 'shop',
  shopFilter: 'all',
  inputDirty: false,
  lastFrameAt: performance.now(),
};

const MENU_TABS = ['shop', 'scenes', 'inventory'];
const SHOP_FILTERS = [
  { id: 'all', label: 'All systems', copy: 'Everything available for the studio.' },
  { id: 'computer', label: 'Computer Lab', copy: 'Rigs, displays, cooling, and endgame desk tech.' },
  { id: 'systems', label: 'Studio Systems', copy: 'Ops, telemetry, sync, and reactive control surfaces.' },
  { id: 'atmosphere', label: 'Atmosphere', copy: 'Lighting, lounge, decor, and room identity.' },
  { id: 'agents', label: 'Agents', copy: 'Specialist upgrades for Scout, Trace, and support bots.' },
];

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
    { image: pcFrame, col: 2, row: 5 },
    { image: pcFrame, col: 8, row: 6 },
    { image: pcFrame, col: 14, row: 5 },
  ];

  if (hasUpgrade('dual-rig') || hasUpgrade('ultrawide-array') || hasUpgrade('legendary-rig') || hasUpgrade('master-control-desk')) {
    dynamicItems.push({ image: pcFrame, col: 9, row: 6 });
  }

  if (hasUpgrade('ultrawide-array') || hasUpgrade('quantum-core') || hasUpgrade('master-control-desk')) {
    dynamicItems.push({ image: pcFrame, col: 7, row: 6 });
  }

  if (hasUpgrade('legendary-rig') || hasUpgrade('master-control-desk')) {
    dynamicItems.push({ image: pcFrame, col: 3, row: 5 }, { image: pcFrame, col: 15, row: 5 });
  }

  if (hasUpgrade('window-garden')) {
    dynamicItems.push({ image: 'plant', col: 17, row: 8 }, { image: 'plant', col: 20, row: 7 });
  }

  if (hasUpgrade('plant-lab')) {
    dynamicItems.push(
      { image: 'hangingPlant', col: 9, row: 1 },
      { image: 'hangingPlant', col: 19, row: 1 },
      { image: 'plant', col: 18, row: 8 },
    );
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
  ctx.fillStyle = `rgba(${palette.secondary}, ${glowAlpha * 0.9})`;
  ctx.fillRect(scale.offsetX + 2.35 * TILE_SIZE * scale.zoom, scale.offsetY + 5.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
  ctx.fillStyle = `rgba(${palette.secondary}, ${glowAlpha})`;
  ctx.fillRect(scale.offsetX + 8.35 * TILE_SIZE * scale.zoom, scale.offsetY + 6.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
  ctx.fillRect(scale.offsetX + 14.35 * TILE_SIZE * scale.zoom, scale.offsetY + 5.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);

  if (hasUpgrade('dual-rig') || hasUpgrade('ultrawide-array') || hasUpgrade('legendary-rig') || hasUpgrade('master-control-desk')) {
    ctx.fillRect(scale.offsetX + 9.35 * TILE_SIZE * scale.zoom, scale.offsetY + 6.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('legendary-rig') || hasUpgrade('master-control-desk')) {
    ctx.fillRect(scale.offsetX + 3.35 * TILE_SIZE * scale.zoom, scale.offsetY + 5.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
    ctx.fillRect(scale.offsetX + 15.35 * TILE_SIZE * scale.zoom, scale.offsetY + 5.05 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom);
  }

  ctx.fillStyle = `rgba(${palette.accent}, 0.18)`;
  ctx.fillRect(scale.offsetX + 4.35 * TILE_SIZE * scale.zoom, scale.offsetY + 8.2 * TILE_SIZE * scale.zoom - Math.sin(timeSeconds * 2.4) * 2, 2, 12);
  ctx.fillRect(scale.offsetX + 4.75 * TILE_SIZE * scale.zoom, scale.offsetY + 8.0 * TILE_SIZE * scale.zoom - Math.sin(timeSeconds * 2.4 + 0.6) * 2, 2, 10);

  drawOfficeUpgrades(scale, timeSeconds, palette);
}

function drawOfficeUpgrades(scale, timeSeconds, palette) {
  const unit = TILE_SIZE * scale.zoom;
  const offsetX = scale.offsetX;
  const offsetY = scale.offsetY;
  const hasAdvancedRig =
    hasUpgrade('ultrawide-array') ||
    hasUpgrade('legendary-rig') ||
    hasUpgrade('quantum-core') ||
    hasUpgrade('master-control-desk');

  if (hasUpgrade('master-control-desk')) {
    const railAlpha = 0.16 + Math.sin(timeSeconds * 2.2) * 0.05;
    ctx.fillStyle = `rgba(${palette.secondary}, ${railAlpha})`;
    ctx.fillRect(offsetX + 6.6 * unit, offsetY + 10.1 * unit, 5.2 * unit, 0.14 * unit);
    ctx.fillRect(offsetX + 6.6 * unit, offsetY + 4.85 * unit, 0.14 * unit, 5.25 * unit);
    ctx.fillRect(offsetX + 11.66 * unit, offsetY + 4.85 * unit, 0.14 * unit, 5.25 * unit);
    ctx.fillStyle = `rgba(${palette.accent}, ${railAlpha * 0.9})`;
    ctx.fillRect(offsetX + 6.95 * unit, offsetY + 10.45 * unit, 4.5 * unit, 0.12 * unit);

    const beam = ctx.createLinearGradient(offsetX + 7.1 * unit, 0, offsetX + 11.3 * unit, 0);
    beam.addColorStop(0, 'rgba(0,0,0,0)');
    beam.addColorStop(0.5, `rgba(${palette.secondary}, 0.35)`);
    beam.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = beam;
    ctx.fillRect(offsetX + 7.1 * unit, offsetY + 3.2 * unit, 4.2 * unit, 0.22 * unit);

    ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
    ctx.fillRect(offsetX + 6.88 * unit, offsetY + 6.18 * unit, 0.46 * unit, 1.58 * unit);
    ctx.fillRect(offsetX + 10.98 * unit, offsetY + 6.18 * unit, 0.46 * unit, 1.58 * unit);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.34)`;
    ctx.strokeRect(offsetX + 6.88 * unit, offsetY + 6.18 * unit, 0.46 * unit, 1.58 * unit);
    ctx.strokeRect(offsetX + 10.98 * unit, offsetY + 6.18 * unit, 0.46 * unit, 1.58 * unit);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.54)`;
    ctx.fillRect(offsetX + 7.0 * unit, offsetY + 6.45 * unit, 0.22 * unit, 0.88 * unit);
    ctx.fillRect(offsetX + 11.1 * unit, offsetY + 6.45 * unit, 0.22 * unit, 0.88 * unit);
    ctx.fillStyle = `rgba(${palette.accent}, ${railAlpha * 1.2})`;
    ctx.fillRect(offsetX + 7.15 * unit, offsetY + 4.2 * unit, 4.05 * unit, 0.16 * unit);
  }

  if (hasUpgrade('monitor-wall') || hasUpgrade('master-control-desk')) {
    const wallPanels = hasUpgrade('master-control-desk') ? 4 : 3;
    const panelWidth = hasUpgrade('master-control-desk') ? 1.4 * unit : 1.58 * unit;
    for (let i = 0; i < wallPanels; i += 1) {
      const panelX = offsetX + (6.45 + i * 1.56) * unit;
      const panelY = offsetY + (2.1 + (i % 2) * 0.04) * unit;
      ctx.fillStyle = 'rgba(9, 14, 24, 0.94)';
      ctx.fillRect(panelX, panelY, panelWidth, 0.92 * unit);
      ctx.strokeStyle = `rgba(${palette.secondary}, 0.34)`;
      ctx.strokeRect(panelX, panelY, panelWidth, 0.92 * unit);
      ctx.fillStyle = `rgba(${palette.secondary}, 0.16)`;
      ctx.fillRect(panelX + 3, panelY + 3, panelWidth - 6, 0.92 * unit - 6);
      ctx.fillStyle = `rgba(${palette.secondary}, 0.68)`;
      ctx.fillRect(panelX + 6, panelY + 8, panelWidth - 12, 2);
      for (let bar = 0; bar < 4; bar += 1) {
        ctx.fillRect(panelX + 6 + bar * 10, panelY + 15 + ((bar + i) % 2) * 2, 4, 6 + ((bar + i) % 3) * 3);
      }
    }
  }

  if (hasAdvancedRig) {
    const screenX = offsetX + 7.4 * unit;
    const screenY = offsetY + 5.55 * unit;
    const screenW = 3.05 * unit;
    const screenH = 0.98 * unit;
    ctx.fillStyle = 'rgba(8, 12, 20, 0.96)';
    ctx.fillRect(screenX, screenY, screenW, screenH);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.34)`;
    ctx.strokeRect(screenX, screenY, screenW, screenH);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.18)`;
    ctx.fillRect(screenX + 4, screenY + 4, screenW - 8, screenH - 8);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.7)`;
    ctx.fillRect(screenX + 8, screenY + 8, screenW - 16, 2);
    ctx.fillRect(screenX + 8, screenY + 14, screenW * 0.4, 4);
    ctx.fillRect(screenX + 8 + screenW * 0.46, screenY + 14, screenW * 0.26, 10);
    ctx.fillRect(screenX + 8, screenY + screenH - 8, screenW - 16, 2);
  }

  if (hasUpgrade('legendary-rig') || hasUpgrade('master-control-desk')) {
    ctx.fillStyle = `rgba(${palette.accent}, 0.2)`;
    ctx.fillRect(offsetX + 7.2 * unit, offsetY + 7.74 * unit, 3.5 * unit, 0.15 * unit);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.14)`;
    ctx.fillRect(offsetX + 7.15 * unit, offsetY + 6.36 * unit, 0.16 * unit, 1.38 * unit);
    ctx.fillRect(offsetX + 10.55 * unit, offsetY + 6.36 * unit, 0.16 * unit, 1.38 * unit);
  }

  if (hasUpgrade('liquid-cooling-loop') || hasUpgrade('quantum-core') || hasUpgrade('master-control-desk')) {
    const towerX = offsetX + 11.45 * unit;
    const towerY = offsetY + 6.05 * unit;
    const towerW = 0.72 * unit;
    const towerH = 1.5 * unit;
    ctx.fillStyle = 'rgba(9, 13, 22, 0.96)';
    ctx.fillRect(towerX, towerY, towerW, towerH);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.35)`;
    ctx.strokeRect(towerX, towerY, towerW, towerH);
    const coolantAlpha = 0.5 + Math.sin(timeSeconds * 3.4) * 0.16;
    ctx.fillStyle = `rgba(${palette.secondary}, ${coolantAlpha})`;
    ctx.fillRect(towerX + 3, towerY + 5, towerW - 6, towerH - 10);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.45)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(towerX + 4, towerY + 8);
    ctx.lineTo(offsetX + 10.45 * unit, offsetY + 6.75 * unit);
    ctx.lineTo(offsetX + 9.6 * unit, offsetY + 6.95 * unit);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(towerX + towerW - 4, towerY + 16);
    ctx.lineTo(offsetX + 10.55 * unit, offsetY + 7.35 * unit);
    ctx.lineTo(offsetX + 9.8 * unit, offsetY + 7.45 * unit);
    ctx.stroke();
  }

  if (hasUpgrade('quantum-core') || hasUpgrade('master-control-desk')) {
    const coreX = offsetX + 12.55 * unit;
    const coreY = offsetY + 7.45 * unit;
    const pulse = 0.24 + Math.sin(timeSeconds * 2.8) * 0.06;
    ctx.fillStyle = 'rgba(9, 13, 22, 0.94)';
    ctx.fillRect(coreX - 0.35 * unit, coreY - 0.35 * unit, 0.7 * unit, 0.7 * unit);
    ctx.strokeStyle = `rgba(${palette.accent}, 0.42)`;
    ctx.strokeRect(coreX - 0.35 * unit, coreY - 0.35 * unit, 0.7 * unit, 0.7 * unit);
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.52 + pulse})`;
    ctx.fillRect(coreX - 0.16 * unit, coreY - 0.16 * unit, 0.32 * unit, 0.32 * unit);
    ctx.strokeStyle = `rgba(${palette.secondary}, ${0.26 + pulse})`;
    ctx.strokeRect(coreX - 0.5 * unit, coreY - 0.5 * unit, unit, unit);
  }

  if (hasUpgrade('smart-lights')) {
    ctx.fillStyle = `rgba(${palette.accent}, 0.1)`;
    ctx.fillRect(scale.offsetX + 0.9 * TILE_SIZE * scale.zoom, scale.offsetY + 0.7 * TILE_SIZE * scale.zoom, 8.2 * TILE_SIZE * scale.zoom, 0.28 * TILE_SIZE * scale.zoom);
    ctx.fillRect(scale.offsetX + 12.9 * TILE_SIZE * scale.zoom, scale.offsetY + 0.7 * TILE_SIZE * scale.zoom, 8.2 * TILE_SIZE * scale.zoom, 0.28 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('signal-router')) {
    const routerX = scale.offsetX + 11.1 * TILE_SIZE * scale.zoom;
    const routerY = scale.offsetY + 1.05 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(13, 18, 28, 0.9)';
    ctx.fillRect(routerX, routerY, 18, 10);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.85)`;
    ctx.fillRect(routerX + 4, routerY + 3, 10, 2);
    ctx.fillRect(routerX + 7, routerY - 6, 2, 6);
    ctx.fillRect(routerX + 13, routerY - 4, 2, 4);
  }

  if (hasUpgrade('dev-poster-pack')) {
    ctx.fillStyle = 'rgba(255, 145, 123, 0.72)';
    ctx.fillRect(scale.offsetX + 2.9 * TILE_SIZE * scale.zoom, scale.offsetY + 1.4 * TILE_SIZE * scale.zoom, 0.8 * TILE_SIZE * scale.zoom, 1.1 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.78)`;
    ctx.fillRect(scale.offsetX + 4.1 * TILE_SIZE * scale.zoom, scale.offsetY + 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom, 1.25 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('coffee-station')) {
    const stationX = scale.offsetX + 4.25 * TILE_SIZE * scale.zoom;
    const stationY = scale.offsetY + 8.55 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(15, 12, 10, 0.92)';
    ctx.fillRect(stationX, stationY, 12, 14);
    ctx.fillStyle = `rgba(${palette.accent}, 0.82)`;
    ctx.fillRect(stationX + 2, stationY + 2, 8, 4);
    ctx.fillStyle = '#f8edd1';
    ctx.fillRect(stationX + 14, stationY + 7, 5, 5);
  }

  if (hasUpgrade('cable-management')) {
    ctx.strokeStyle = 'rgba(90, 105, 132, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scale.offsetX + 8.8 * TILE_SIZE * scale.zoom, scale.offsetY + 7.8 * TILE_SIZE * scale.zoom);
    ctx.lineTo(scale.offsetX + 8.8 * TILE_SIZE * scale.zoom, scale.offsetY + 9.1 * TILE_SIZE * scale.zoom);
    ctx.lineTo(scale.offsetX + 9.7 * TILE_SIZE * scale.zoom, scale.offsetY + 9.1 * TILE_SIZE * scale.zoom);
    ctx.stroke();
  }

  if (hasUpgrade('keyboard-upgrade')) {
    ctx.fillStyle = `rgba(${palette.accent}, 0.76)`;
    ctx.fillRect(scale.offsetX + 8.55 * TILE_SIZE * scale.zoom, scale.offsetY + 6.86 * TILE_SIZE * scale.zoom, 0.72 * TILE_SIZE * scale.zoom, 0.12 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('focus-timer')) {
    const timerX = scale.offsetX + 20.1 * TILE_SIZE * scale.zoom;
    const timerY = scale.offsetY + 2.7 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
    ctx.fillRect(timerX, timerY, 22, 12);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.85)`;
    ctx.fillRect(timerX + 4, timerY + 4, 14, 4);
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

  if (hasUpgrade('mini-fridge')) {
    const fridgeX = scale.offsetX + 0.95 * TILE_SIZE * scale.zoom;
    const fridgeY = scale.offsetY + 9.2 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#d7dde5';
    ctx.fillRect(fridgeX, fridgeY, 0.9 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = '#a7b4c7';
    ctx.fillRect(fridgeX + 3, fridgeY + 8, 0.9 * TILE_SIZE * scale.zoom - 6, 2);
  }

  if (hasUpgrade('ambient-speakers')) {
    const speakerY = scale.offsetY + 5.55 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#171a24';
    ctx.fillRect(scale.offsetX + 7.45 * TILE_SIZE * scale.zoom, speakerY, 10, 18);
    ctx.fillRect(scale.offsetX + 10.15 * TILE_SIZE * scale.zoom, speakerY, 10, 18);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.7)`;
    ctx.fillRect(scale.offsetX + 7.95 * TILE_SIZE * scale.zoom, speakerY + 4, 6, 6);
    ctx.fillRect(scale.offsetX + 10.65 * TILE_SIZE * scale.zoom, speakerY + 4, 6, 6);
  }

  if (hasUpgrade('wall-terminal')) {
    const terminalX = scale.offsetX + 17.2 * TILE_SIZE * scale.zoom;
    const terminalY = scale.offsetY + 2.25 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(13, 18, 28, 0.95)';
    ctx.fillRect(terminalX, terminalY, 1.35 * TILE_SIZE * scale.zoom, 0.82 * TILE_SIZE * scale.zoom);
    ctx.strokeStyle = `rgba(${palette.secondary}, 0.4)`;
    ctx.strokeRect(terminalX, terminalY, 1.35 * TILE_SIZE * scale.zoom, 0.82 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.75)`;
    ctx.fillRect(terminalX + 6, terminalY + 5, 0.75 * TILE_SIZE * scale.zoom, 4);
  }

  if (hasUpgrade('patch-bay')) {
    const bayX = scale.offsetX + 18.92 * TILE_SIZE * scale.zoom;
    const bayY = scale.offsetY + 9.08 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#171b27';
    ctx.fillRect(bayX, bayY, 1.75 * TILE_SIZE * scale.zoom, 0.55 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.8)`;
    for (let i = 0; i < 5; i += 1) {
      ctx.fillRect(bayX + 6 + i * 7, bayY + 4, 3, 3);
    }
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

  if (hasUpgrade('neon-signage')) {
    const signX = scale.offsetX + 6.1 * TILE_SIZE * scale.zoom;
    const signY = scale.offsetY + 1.25 * TILE_SIZE * scale.zoom;
    ctx.strokeStyle = `rgba(${palette.accent}, 0.95)`;
    ctx.lineWidth = 3;
    ctx.strokeRect(signX, signY, 1.8 * TILE_SIZE * scale.zoom, 0.75 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.accent}, 0.24)`;
    ctx.fillRect(signX, signY, 1.8 * TILE_SIZE * scale.zoom, 0.75 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('trophy-shelf')) {
    const trophyX = scale.offsetX + 18.55 * TILE_SIZE * scale.zoom;
    const trophyY = scale.offsetY + 1.18 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = `rgba(${palette.accent}, 0.92)`;
    ctx.fillRect(trophyX, trophyY, 7, 8);
    ctx.fillRect(trophyX - 2, trophyY + 2, 2, 4);
    ctx.fillRect(trophyX + 7, trophyY + 2, 2, 4);
    ctx.fillRect(trophyX + 2, trophyY + 8, 3, 5);
  }

  if (hasUpgrade('night-shift-vending')) {
    const vendorX = scale.offsetX + 0.85 * TILE_SIZE * scale.zoom;
    const vendorY = scale.offsetY + 6.55 * TILE_SIZE * scale.zoom;
    const vendorW = 1.15 * TILE_SIZE * scale.zoom;
    const vendorH = 2.45 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#111521';
    ctx.fillRect(vendorX, vendorY, vendorW, vendorH);
    ctx.fillStyle = `rgba(${palette.accent}, 0.82)`;
    ctx.fillRect(vendorX + 5, vendorY + 5, vendorW - 10, 14);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.8)`;
    ctx.fillRect(vendorX + 5, vendorY + 24, vendorW - 10, 3);
    ctx.fillRect(vendorX + 5, vendorY + 31, vendorW - 10, 3);
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
  closeMenu();
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
  renderGameMenu();
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
  renderGameMenu();
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
            <span>${menuCategoryLabel(upgrade.category)} | ${menuRarityLabel(upgrade.rarity)}</span>
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

function menuTypeLabel(type) {
  const labels = {
    rig: 'Desk rig',
    ambient: 'Ambient',
    ops: 'Ops',
    decor: 'Decor',
    comfort: 'Comfort',
    agent: 'Agent',
    assistant: 'Assistant',
    display: 'Display',
    audio: 'Audio',
  };
  return labels[type] || 'Upgrade';
}

function menuAccent(type) {
  const accents = {
    rig: '#ffcb79',
    ambient: '#8ff3cf',
    ops: '#88b7ff',
    decor: '#f7c9ae',
    comfort: '#ffdf9c',
    agent: '#f7b4d8',
    assistant: '#8ff3cf',
    display: '#93f0ff',
    audio: '#d6b3ff',
  };
  return accents[type] || '#ffcb79';
}

function menuCategoryLabel(category) {
  const labels = {
    computer: 'Computer lab',
    systems: 'Studio systems',
    atmosphere: 'Atmosphere',
    agents: 'Agents',
  };
  return labels[category] || 'Upgrade';
}

function menuRarityLabel(rarity) {
  const labels = {
    common: 'Standard',
    rare: 'Advanced',
    epic: 'Elite',
    legendary: 'Legendary',
    mythic: 'Master',
  };
  return labels[rarity] || 'Standard';
}

function menuRarityTone(rarity) {
  const tones = {
    common: '#8ff3cf',
    rare: '#88b7ff',
    epic: '#ffcb79',
    legendary: '#ff8fcf',
    mythic: '#93f0ff',
  };
  return tones[rarity] || '#8ff3cf';
}

function filteredUpgradeCatalog(rpg) {
  if (!rpg) return [];
  if (state.shopFilter === 'all') return rpg.upgradeCatalog;
  return rpg.upgradeCatalog.filter((upgrade) => upgrade.category === state.shopFilter);
}

function setShopFilter(filterId) {
  if (!SHOP_FILTERS.some((filter) => filter.id === filterId)) return;
  state.shopFilter = filterId;
  renderGameMenu();
}

function menuShopButtonLabel(upgrade) {
  if (upgrade.owned) return 'Owned';
  if (!upgrade.unlocked) return `Level ${upgrade.unlockLevel}`;
  if (!upgrade.affordable) return 'Save coins';
  return 'Buy now';
}

function menuThemeButtonLabel(theme, rpg) {
  if (rpg.activeThemeId === theme.id) return 'Equipped';
  if (rpg.unlockedThemes.some((entry) => entry.id === theme.id)) return 'Equip';
  return `Unlock Lv ${theme.unlockLevel}`;
}

function renderShopFilters(rpg) {
  dom.menuShopFilters.innerHTML = SHOP_FILTERS.map((filter) => {
    const count =
      filter.id === 'all'
        ? rpg.upgradeCatalog.length
        : rpg.upgradeCatalog.filter((upgrade) => upgrade.category === filter.id).length;
    return `
      <button
        class="shop-filter ${state.shopFilter === filter.id ? 'is-active' : ''}"
        type="button"
        data-shop-filter="${filter.id}"
      >
        <strong>${filter.label}</strong>
        <span>${count} upgrades</span>
      </button>
    `;
  }).join('');

  dom.menuShopFilters.querySelectorAll('[data-shop-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      setShopFilter(button.dataset.shopFilter);
    });
  });
}

function renderShopSpotlight(rpg, catalog) {
  const filter = SHOP_FILTERS.find((entry) => entry.id === state.shopFilter) || SHOP_FILTERS[0];
  const owned = catalog.filter((upgrade) => upgrade.owned);
  const unlocked = catalog.filter((upgrade) => upgrade.unlocked);
  const nextUpgrade = catalog.find((upgrade) => !upgrade.owned && upgrade.unlocked) || catalog.find((upgrade) => !upgrade.owned);
  const heroTitle =
    state.shopFilter === 'computer'
      ? rpg.loadout.deskRig
      : state.shopFilter === 'systems'
        ? 'Control surfaces online'
        : state.shopFilter === 'agents'
          ? `${owned.length}/${catalog.length} specialists enhanced`
          : `${owned.length}/${catalog.length} upgrades owned`;
  const heroCopy =
    state.shopFilter === 'computer'
      ? 'This lane is where the office stops looking starter and starts looking elite.'
      : filter.copy;
  const rarityHeadline = nextUpgrade ? `${menuRarityLabel(nextUpgrade.rarity)} unlock path` : 'Collection completed';
  const nextLabel = nextUpgrade
    ? nextUpgrade.unlocked
      ? `${nextUpgrade.name} ready to buy`
      : `${nextUpgrade.name} at level ${nextUpgrade.unlockLevel}`
    : 'All upgrades in this lane purchased';

  dom.menuShopSpotlight.className = `menu-shop-spotlight ${state.shopFilter === 'computer' ? 'is-computer' : ''}`;
  dom.menuShopSpotlight.innerHTML = `
    <div class="menu-shop-spotlight-copy">
      <span class="info-kicker">${filter.label}</span>
      <h4>${heroTitle}</h4>
      <p>${heroCopy}</p>
    </div>
    <div class="menu-shop-spotlight-metrics">
      <div class="shop-metric">
        <span>Owned</span>
        <strong>${owned.length}/${catalog.length}</strong>
      </div>
      <div class="shop-metric">
        <span>Unlocked</span>
        <strong>${unlocked.length}</strong>
      </div>
      <div class="shop-metric">
        <span>${rarityHeadline}</span>
        <strong>${nextLabel}</strong>
      </div>
      <div class="shop-metric">
        <span>Wallet</span>
        <strong>${formatCount(rpg.coins)} coins</strong>
      </div>
    </div>
  `;
}

function openMenu(tab = state.menuTab) {
  closeProfile();
  state.menuTab = MENU_TABS.includes(tab) ? tab : 'shop';
  dom.gameMenu.hidden = false;
  renderGameMenu();
  if (!state.player && !state.playerLoading) {
    loadPlayerProfile();
  }
}

function closeMenu() {
  dom.gameMenu.hidden = true;
}

function setMenuTab(tab) {
  if (!MENU_TABS.includes(tab)) return;
  state.menuTab = tab;
  renderGameMenu();
}

function renderMenuTabs() {
  const tabMap = {
    shop: dom.menuTabShop,
    scenes: dom.menuTabScenes,
    inventory: dom.menuTabInventory,
  };
  const panelMap = {
    shop: dom.menuPanelShop,
    scenes: dom.menuPanelScenes,
    inventory: dom.menuPanelInventory,
  };

  for (const tab of MENU_TABS) {
    tabMap[tab].classList.toggle('is-active', state.menuTab === tab);
    panelMap[tab].classList.toggle('is-active', state.menuTab === tab);
  }
}

function renderMenuShop(rpg) {
  const catalog = filteredUpgradeCatalog(rpg);
  renderShopFilters(rpg);
  renderShopSpotlight(rpg, catalog);
  dom.menuShopGrid.className = `menu-card-grid ${state.shopFilter === 'computer' ? 'menu-card-grid--computer' : ''}`;
  dom.menuShopGrid.innerHTML = catalog
    .map(
      (upgrade) => `
        <article
          class="menu-card menu-card--shop ${upgrade.category === 'computer' ? 'menu-card--computer' : ''} ${upgrade.owned ? 'is-owned' : ''} ${upgrade.unlocked ? '' : 'is-locked'}"
          style="--card-accent:${menuAccent(upgrade.type)}; --rarity-accent:${menuRarityTone(upgrade.rarity)};"
        >
          <div class="menu-thumb" data-icon="${upgrade.icon}" data-type="${upgrade.type}">
            <span class="menu-thumb-label">${upgrade.preview}</span>
          </div>
          <div class="menu-card-copy">
            <div class="menu-card-head">
              <span class="menu-card-tag">${menuTypeLabel(upgrade.type)}</span>
              <strong>${upgrade.name}</strong>
            </div>
            <div class="menu-card-meta">
              <span>${menuCategoryLabel(upgrade.category)}</span>
              <span>${menuRarityLabel(upgrade.rarity)}</span>
              <span>Lv ${upgrade.unlockLevel}</span>
            </div>
            <p>${upgrade.description}</p>
            <div class="menu-impact">
              ${upgrade.impact.map((item) => `<span>${item}</span>`).join('')}
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">${upgrade.owned ? 'Owned' : `${formatCount(upgrade.cost)} coins`}</span>
              <button
                class="menu-card-action"
                type="button"
                data-upgrade-id="${upgrade.id}"
                ${upgrade.owned || !upgrade.unlocked || !upgrade.affordable ? 'disabled' : ''}
              >
                ${menuShopButtonLabel(upgrade)}
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join('');

  dom.menuShopGrid.querySelectorAll('[data-upgrade-id]').forEach((button) => {
    button.addEventListener('click', () => {
      purchaseUpgrade(button.dataset.upgradeId);
    });
  });
}

function renderMenuScenes(rpg) {
  const allThemes = Object.values(THEME_DEFS).sort((left, right) => left.unlockLevel - right.unlockLevel);
  dom.menuSceneGrid.innerHTML = allThemes
    .map(
      (theme) => `
        <article
          class="menu-card menu-card--scene ${rpg.activeThemeId === theme.id ? 'is-active' : ''} ${rpg.unlockedThemes.some((entry) => entry.id === theme.id) ? '' : 'is-locked'}"
          style="--scene-wall-top:${theme.wallTop}; --scene-wall-mid:${theme.wallMid}; --scene-wall-bottom:${theme.wallBottom}; --scene-floor-a:${theme.floorA}; --scene-floor-b:${theme.floorB}; --scene-accent:rgb(${theme.accent}); --scene-secondary:rgb(${theme.secondary});"
        >
          <div class="scene-thumb">
            <span class="scene-thumb-pill">Lv ${theme.unlockLevel}</span>
          </div>
          <div class="menu-card-copy">
            <div class="menu-card-head">
              <span class="menu-card-tag">Scene</span>
              <strong>${theme.name}</strong>
            </div>
            <p>${theme.mood}</p>
            <div class="menu-card-footer">
              <span class="menu-price">${rpg.unlockedThemes.some((entry) => entry.id === theme.id) ? 'Unlocked' : 'Locked'}</span>
              <button
                class="menu-card-action"
                type="button"
                data-theme-id="${theme.id}"
                ${rpg.unlockedThemes.some((entry) => entry.id === theme.id) ? '' : 'disabled'}
              >
                ${menuThemeButtonLabel(theme, rpg)}
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join('');

  dom.menuSceneGrid.querySelectorAll('[data-theme-id]').forEach((button) => {
    button.addEventListener('click', () => {
      activateTheme(button.dataset.themeId);
    });
  });
}

function renderMenuInventory(rpg) {
  const ownedUpgrades = rpg.upgradeCatalog.filter((upgrade) => upgrade.owned);
  const inventoryHighlights = [
    {
      label: 'Current title',
      value: rpg.currentTitle.title,
      copy: rpg.currentTitle.flavor,
    },
    {
      label: 'Equipped scene',
      value: rpg.activeTheme.name,
      copy: rpg.activeTheme.mood,
    },
    {
      label: 'Main rig',
      value: rpg.loadout.deskRig,
      copy: 'Hardware tier currently active in the room.',
    },
    {
      label: 'Active agents',
      value: rpg.loadout.agents.join(' | '),
      copy: 'Specialists currently represented inside the office.',
    },
    {
      label: 'Next title',
      value: rpg.nextTitle ? `${rpg.nextTitle.title} at level ${rpg.nextTitle.level}` : 'All title tiers unlocked',
      copy: rpg.nextTitle ? rpg.nextTitle.flavor : 'You reached the current title cap.',
    },
  ];

  const ownedMarkup = ownedUpgrades.length
    ? ownedUpgrades
        .map(
          (upgrade) => `
            <div class="inventory-chip" style="--chip-accent:${menuAccent(upgrade.type)};">
              <span class="inventory-chip-icon" data-icon="${upgrade.icon}"></span>
              <strong>${upgrade.name}</strong>
              <span>${menuTypeLabel(upgrade.type)}</span>
            </div>
          `,
        )
        .join('')
    : '<div class="profile-empty">No purchased upgrades yet. Start with the shop tab.</div>';

  dom.menuInventoryGrid.innerHTML = `
    ${inventoryHighlights
      .map(
        (item) => `
          <article class="inventory-card">
            <span class="loadout-label">${item.label}</span>
            <strong>${item.value}</strong>
            <p>${item.copy}</p>
          </article>
        `,
      )
      .join('')}
    <article class="inventory-card inventory-card--wide">
      <span class="loadout-label">Owned upgrades</span>
      <div class="inventory-chip-grid">${ownedMarkup}</div>
    </article>
  `;
}

function renderGameMenu() {
  renderMenuTabs();

  if (!state.player?.ok || !state.rpg) {
    dom.menuCoinCount.textContent = '0 coins';
    dom.menuHeroCopy.textContent = 'Link GitHub progress to unlock the full shop.';
    dom.menuOwnedCount.textContent = '0 items';
    dom.menuOwnedCopy.textContent = 'Starter office loadout.';
    dom.menuThemeName.textContent = 'Starter Loft';
    dom.menuThemeMood.textContent = 'Calm studio with warm wood and slate walls.';
    dom.menuShopSpotlight.className = 'menu-shop-spotlight';
    dom.menuShopSpotlight.innerHTML = `
      <div class="menu-shop-spotlight-copy">
        <span class="info-kicker">Office Shop</span>
        <h4>Waiting for player sync</h4>
        <p>Link GitHub progress to unlock the catalog, computer lab, and prestige-tier office upgrades.</p>
      </div>
    `;
    dom.menuShopFilters.innerHTML = '';
    dom.menuShopGrid.className = 'menu-card-grid';
    dom.menuShopGrid.innerHTML = '<div class="profile-empty">The shop will unlock after the player profile loads.</div>';
    dom.menuSceneGrid.innerHTML = '<div class="profile-empty">Scene previews appear after progression data is available.</div>';
    dom.menuInventoryGrid.innerHTML = '<div class="profile-empty">Inventory appears after the player sync finishes.</div>';
    return;
  }

  const rpg = state.rpg;
  const ownedCount = rpg.upgradeCatalog.filter((upgrade) => upgrade.owned).length;
  dom.menuCoinCount.textContent = `${formatCount(rpg.coins)} coins`;
  dom.menuHeroCopy.textContent = `${formatCount(rpg.coinsEarned)} earned, ${formatCount(rpg.coinsSpent)} already spent.`;
  dom.menuOwnedCount.textContent = `${ownedCount} ${ownedCount === 1 ? 'item' : 'items'}`;
  dom.menuOwnedCopy.textContent = ownedCount
    ? `${rpg.loadout.officePerks.slice(0, 3).join(' | ')}${ownedCount > 3 ? ' | ...' : ''}`
    : 'Starter office loadout.';
  dom.menuThemeName.textContent = rpg.activeTheme.name;
  dom.menuThemeMood.textContent = rpg.activeTheme.mood;

  renderMenuShop(rpg);
  renderMenuScenes(rpg);
  renderMenuInventory(rpg);
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
    renderGameMenu();
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
  renderGameMenu();
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

dom.menuButton.addEventListener('click', () => {
  openMenu('shop');
});

dom.menuClose.addEventListener('click', closeMenu);
dom.gameMenuBackdrop.addEventListener('click', closeMenu);
dom.menuTabShop.addEventListener('click', () => setMenuTab('shop'));
dom.menuTabScenes.addEventListener('click', () => setMenuTab('scenes'));
dom.menuTabInventory.addEventListener('click', () => setMenuTab('inventory'));

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
  if (event.key.toLowerCase() === 'm') {
    if (dom.gameMenu.hidden) openMenu('shop');
    else closeMenu();
  }

  if (event.key === 'Escape') {
    if (!dom.profileModal.hidden) closeProfile();
    if (!dom.gameMenu.hidden) closeMenu();
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

