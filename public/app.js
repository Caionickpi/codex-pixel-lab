import { THEME_DEFS, computeRpgState, getCurrentTitle, getThemeById, getUpgradeById } from './rpg.js';

import { renderUpgradeArt } from './upgrade-art.js';

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
  devTrackLevel: document.getElementById('devTrackLevel'),
  devTrackFill: document.getElementById('devTrackFill'),
  devTrackCurrent: document.getElementById('devTrackCurrent'),
  devTrackNext: document.getElementById('devTrackNext'),
  officeTrackLevel: document.getElementById('officeTrackLevel'),
  officeTrackFill: document.getElementById('officeTrackFill'),
  officeTrackCurrent: document.getElementById('officeTrackCurrent'),
  officeTrackNext: document.getElementById('officeTrackNext'),
  nextUnlockLabel: document.getElementById('nextUnlockLabel'),
  playerGlance: document.getElementById('playerGlance'),
  playerAvatarMini: document.getElementById('playerAvatarMini'),
  playerNameMini: document.getElementById('playerNameMini'),
  playerLevelMini: document.getElementById('playerLevelMini'),
  playerCommitMini: document.getElementById('playerCommitMini'),
  playerCoinMini: document.getElementById('playerCoinMini'),
  playerGlanceFill: document.getElementById('playerGlanceFill'),
  playerGlanceNext: document.getElementById('playerGlanceNext'),
  menuButton: document.getElementById('menuButton'),
  gameMenu: document.getElementById('gameMenu'),
  gameMenuBackdrop: document.getElementById('gameMenuBackdrop'),
  menuClose: document.getElementById('menuClose'),
  menuTabHQ: document.getElementById('menuTabHQ'),
  menuTabShop: document.getElementById('menuTabShop'),
  menuTabScenes: document.getElementById('menuTabScenes'),
  menuTabInventory: document.getElementById('menuTabInventory'),
  menuPanelHQ: document.getElementById('menuPanelHQ'),
  menuPanelShop: document.getElementById('menuPanelShop'),
  menuPanelScenes: document.getElementById('menuPanelScenes'),
  menuPanelInventory: document.getElementById('menuPanelInventory'),
  menuCoinLabel: document.getElementById('menuCoinLabel'),
  menuCoinCount: document.getElementById('menuCoinCount'),
  menuHeroCopy: document.getElementById('menuHeroCopy'),
  menuDevLabel: document.getElementById('menuDevLabel'),
  menuDevCount: document.getElementById('menuDevCount'),
  menuDevCopy: document.getElementById('menuDevCopy'),
  menuDevFill: document.getElementById('menuDevFill'),
  menuOwnedLabel: document.getElementById('menuOwnedLabel'),
  menuOwnedCount: document.getElementById('menuOwnedCount'),
  menuOwnedCopy: document.getElementById('menuOwnedCopy'),
  menuOwnedFill: document.getElementById('menuOwnedFill'),
  menuThemeLabel: document.getElementById('menuThemeLabel'),
  menuThemeName: document.getElementById('menuThemeName'),
  menuThemeMood: document.getElementById('menuThemeMood'),
  menuBuilderGrid: document.getElementById('menuBuilderGrid'),
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
  menuTab: 'hq',
  shopFilter: 'all',
  inputDirty: false,
  lastFrameAt: performance.now(),
};

const MENU_TABS = ['hq', 'shop', 'scenes', 'inventory'];
const SHOP_FILTERS = [
  { id: 'all', label: 'All systems', copy: 'Full collection' },
  { id: 'computer', label: 'Computer Lab', copy: 'Rigs and command decks' },
  { id: 'systems', label: 'Studio Systems', copy: 'Ops and live signal gear' },
  { id: 'atmosphere', label: 'Atmosphere', copy: 'Mood, lounge, identity' },
  { id: 'agents', label: 'Agents', copy: 'Specialists and support bots' },
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
    return safeJsonParse(stored, { purchasedIds: [], activeThemeId: '', visitedThemeIds: [], builderXp: 0, builderActions: 0, purchaseCosts: {} }) || {
      purchasedIds: [],
      activeThemeId: '',
      visitedThemeIds: [],
      builderXp: 0,
      builderActions: 0,
      purchaseCosts: {},
    };
  } catch {
    return {
      purchasedIds: [],
      activeThemeId: '',
      visitedThemeIds: [],
      builderXp: 0,
      builderActions: 0,
      purchaseCosts: {},
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
  drawSceneMood(scale, timeSeconds, theme, palette);

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

  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 2, y + 2, width - 4, height - 4);
  ctx.clip();
  drawWindowSceneLayer(x, y, width, height, timeSeconds, theme);
  ctx.restore();

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

function drawWindowSceneLayer(x, y, width, height, timeSeconds, theme) {
  if (theme.id === 'cloud' || theme.id === 'skyforge') {
    ctx.fillStyle = theme.id === 'cloud' ? 'rgba(235, 246, 255, 0.12)' : 'rgba(255, 228, 180, 0.14)';
    for (let i = 0; i < 3; i += 1) {
      const drift = ((timeSeconds * 10 + i * 36) % (width + 36)) - 30;
      ctx.fillRect(x + drift, y + 10 + i * 10, 24 + i * 8, 6);
      ctx.fillRect(x + drift + 8, y + 14 + i * 10, 18 + i * 6, 5);
    }
  }

  if (theme.id === 'orbital') {
    ctx.fillStyle = 'rgba(255, 176, 122, 0.22)';
    ctx.beginPath();
    ctx.arc(x + width * 0.76, y + height * 0.34, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(164, 230, 255, 0.38)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + width * 0.76, y + height * 0.34, 18, 7, -0.32, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (theme.id === 'afterglow' || theme.id === 'neon') {
    const haze = ctx.createLinearGradient(0, y + height * 0.2, 0, y + height);
    haze.addColorStop(0, theme.id === 'afterglow' ? 'rgba(255, 188, 122, 0.12)' : 'rgba(255, 143, 207, 0.08)');
    haze.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
  }

  if (theme.id === 'signal' || theme.id === 'server') {
    ctx.fillStyle = theme.id === 'signal' ? 'rgba(166, 226, 255, 0.16)' : 'rgba(121, 255, 236, 0.14)';
    for (let i = 0; i < 5; i += 1) {
      const barHeight = 10 + ((i * 5) % 14);
      ctx.fillRect(x + 10 + i * ((width - 20) / 5), y + height - barHeight - 5, 4, barHeight);
    }
  }
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

function drawSceneMood(scale, timeSeconds, theme, palette) {
  const unit = TILE_SIZE * scale.zoom;
  const x = scale.offsetX;
  const y = scale.offsetY;
  const width = OFFICE_COLS * unit;

  if (theme.id === 'signal') {
    ctx.strokeStyle = 'rgba(166, 226, 255, 0.18)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      const lineY = y + (1.2 + i * 0.48) * unit + Math.sin(timeSeconds * 1.2 + i) * 1.2;
      ctx.beginPath();
      ctx.moveTo(x + 1.2 * unit, lineY);
      ctx.lineTo(x + width - 1.2 * unit, lineY);
      ctx.stroke();
    }
  }

  if (theme.id === 'neon') {
    const glow = 0.14 + Math.sin(timeSeconds * 2.4) * 0.05;
    ctx.fillStyle = `rgba(${theme.accent}, ${glow})`;
    ctx.fillRect(x + 1.1 * unit, y + 4.18 * unit, width - 2.2 * unit, 0.12 * unit);
    ctx.fillStyle = `rgba(${theme.secondary}, ${glow * 0.75})`;
    ctx.fillRect(x + 1.4 * unit, y + 4.36 * unit, width - 2.8 * unit, 0.08 * unit);
  }

  if (theme.id === 'server') {
    ctx.fillStyle = 'rgba(121, 255, 236, 0.05)';
    for (let i = 0; i < 5; i += 1) {
      const ventX = x + (1.4 + i * 4.1) * unit;
      ctx.fillRect(ventX, y + 4.24 * unit, 1.3 * unit, 0.08 * unit);
    }
    ctx.fillStyle = 'rgba(180, 220, 255, 0.04)';
    ctx.fillRect(x + 0.8 * unit, y + 4.35 * unit, width - 1.6 * unit, 0.22 * unit);
  }

  if (theme.id === 'cloud') {
    ctx.fillStyle = 'rgba(236, 245, 255, 0.09)';
    ctx.fillRect(x + 1.8 * unit, y + 0.8 * unit, 2.1 * unit, 0.18 * unit);
    ctx.fillRect(x + 17.1 * unit, y + 0.8 * unit, 2.1 * unit, 0.18 * unit);
  }

  if (theme.id === 'skyforge') {
    const beam = ctx.createLinearGradient(x + 16 * unit, y, x + 21 * unit, y + 4 * unit);
    beam.addColorStop(0, 'rgba(255, 214, 142, 0)');
    beam.addColorStop(1, 'rgba(255, 214, 142, 0.18)');
    ctx.fillStyle = beam;
    ctx.fillRect(x + 14.6 * unit, y + 0.2 * unit, 6 * unit, 4.2 * unit);
  }

  if (theme.id === 'orbital') {
    ctx.strokeStyle = 'rgba(119, 255, 214, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 10.9 * unit, y + 2.2 * unit, 2.7 * unit, Math.PI * 1.05, Math.PI * 1.88);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 10.9 * unit, y + 2.2 * unit, 3.3 * unit, Math.PI * 1.08, Math.PI * 1.84);
    ctx.stroke();
  }

  if (theme.id === 'afterglow') {
    const floorGlow = ctx.createLinearGradient(0, y + 4.1 * unit, 0, y + 9 * unit);
    floorGlow.addColorStop(0, 'rgba(255, 189, 117, 0.04)');
    floorGlow.addColorStop(1, 'rgba(150, 255, 235, 0.07)');
    ctx.fillStyle = floorGlow;
    ctx.fillRect(x + 0.9 * unit, y + 4.1 * unit, width - 1.8 * unit, 5.2 * unit);
  }
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
  const officeLevel = state.rpg?.office?.level || 1;
  const officePower = state.rpg?.office?.power || 0;
  const prestigeBoost = Math.min(0.14, officeLevel * 0.012);
  const powerGlow = Math.min(0.1, officePower / 22000);
  const warm = ctx.createRadialGradient(
    scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
    scale.offsetY + 7.6 * TILE_SIZE * scale.zoom,
    14,
    scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
    scale.offsetY + 7.6 * TILE_SIZE * scale.zoom,
    250,
  );
  warm.addColorStop(0, `rgba(${palette.accent}, ${0.2 + prestigeBoost + powerGlow})`);
  warm.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = warm;
  ctx.fillRect(0, 0, dom.stage.clientWidth, dom.stage.clientHeight);

  const coolAlpha = 0.08 + prestigeBoost * 0.8 + powerGlow * 0.6 + Math.sin(timeSeconds * 1.6) * 0.02;
  ctx.fillStyle = `rgba(${palette.secondary},${coolAlpha})`;
  ctx.fillRect(scale.offsetX + 14.3 * TILE_SIZE * scale.zoom, scale.offsetY + 5.1 * TILE_SIZE * scale.zoom, 1.25 * TILE_SIZE * scale.zoom, 0.85 * TILE_SIZE * scale.zoom);
  ctx.fillRect(scale.offsetX + 8.35 * TILE_SIZE * scale.zoom, scale.offsetY + 6.1 * TILE_SIZE * scale.zoom, 1.3 * TILE_SIZE * scale.zoom, 0.85 * TILE_SIZE * scale.zoom);

  ctx.fillStyle = `rgba(${palette.secondary}, ${0.06 + prestigeBoost * 0.5})`;
  const particleCount = 8 + Math.floor(officeLevel * 1.2);
  for (let i = 0; i < particleCount; i += 1) {
    const particleX = scale.offsetX + (((timeSeconds * 26 + i * 38) % (OFFICE_COLS * TILE_SIZE)) * scale.zoom);
    const particleY = scale.offsetY + 1.6 * TILE_SIZE * scale.zoom + Math.sin(timeSeconds * 0.9 + i) * 8 + (i % 3) * 22;
    ctx.fillRect(Math.round(particleX), Math.round(particleY), 2, 2);
  }

  if (officeLevel >= 5) {
    const halo = ctx.createRadialGradient(
      scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
      scale.offsetY + 7.8 * TILE_SIZE * scale.zoom,
      10,
      scale.offsetX + 9.6 * TILE_SIZE * scale.zoom,
      scale.offsetY + 7.8 * TILE_SIZE * scale.zoom,
      170,
    );
    halo.addColorStop(0, `rgba(${palette.secondary}, ${0.12 + powerGlow})`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(scale.offsetX + 4 * TILE_SIZE * scale.zoom, scale.offsetY + 4.6 * TILE_SIZE * scale.zoom, 12 * TILE_SIZE * scale.zoom, 7 * TILE_SIZE * scale.zoom);
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
  const pulseFast = 0.5 + Math.sin(timeSeconds * 3.4) * 0.5;
  const pulseSlow = 0.5 + Math.sin(timeSeconds * 1.6) * 0.5;
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
    const sweepX = offsetX + (1.1 + pulseFast * 18.5) * unit;
    ctx.fillStyle = `rgba(${palette.accent}, ${0.08 + pulseFast * 0.08})`;
    ctx.fillRect(sweepX, offsetY + 0.7 * unit, 0.8 * unit, 3.9 * unit);
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
    ctx.strokeStyle = `rgba(${palette.secondary}, ${0.24 + pulseFast * 0.26})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(routerX + 9, routerY + 8);
    ctx.lineTo(routerX - 36 + pulseFast * 18, routerY + 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(routerX + 9, routerY + 8);
    ctx.lineTo(routerX + 44 - pulseFast * 16, routerY + 18);
    ctx.stroke();
  }

  if (hasUpgrade('dev-poster-pack')) {
    ctx.fillStyle = 'rgba(255, 145, 123, 0.72)';
    ctx.fillRect(scale.offsetX + 2.9 * TILE_SIZE * scale.zoom, scale.offsetY + 1.4 * TILE_SIZE * scale.zoom, 0.8 * TILE_SIZE * scale.zoom, 1.1 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.78)`;
    ctx.fillRect(scale.offsetX + 4.1 * TILE_SIZE * scale.zoom, scale.offsetY + 1.45 * TILE_SIZE * scale.zoom, 0.9 * TILE_SIZE * scale.zoom, 1.25 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.accent}, ${0.12 + pulseSlow * 0.08})`;
    ctx.fillRect(scale.offsetX + 3.1 * TILE_SIZE * scale.zoom, scale.offsetY + 1.56 * TILE_SIZE * scale.zoom, 0.18 * TILE_SIZE * scale.zoom, 0.92 * TILE_SIZE * scale.zoom);
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
    ctx.strokeStyle = `rgba(255, 240, 220, ${0.28 + pulseSlow * 0.18})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(stationX + 5, stationY + 2);
    ctx.quadraticCurveTo(stationX + 2, stationY - 6 - pulseSlow * 6, stationX + 6, stationY - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(stationX + 9, stationY + 2);
    ctx.quadraticCurveTo(stationX + 12, stationY - 4 - pulseFast * 5, stationX + 10, stationY - 11);
    ctx.stroke();
  }

  if (hasUpgrade('window-garden')) {
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.12 + pulseSlow * 0.1})`;
    for (let i = 0; i < 4; i += 1) {
      const px = offsetX + (16.8 + i * 0.62 + Math.sin(timeSeconds + i) * 0.08) * unit;
      const py = offsetY + (4.2 + i * 0.32 - pulseSlow * 0.16) * unit;
      ctx.fillRect(px, py, 3, 3);
    }
  }

  if (hasUpgrade('cable-management')) {
    ctx.strokeStyle = 'rgba(90, 105, 132, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scale.offsetX + 8.8 * TILE_SIZE * scale.zoom, scale.offsetY + 7.8 * TILE_SIZE * scale.zoom);
    ctx.lineTo(scale.offsetX + 8.8 * TILE_SIZE * scale.zoom, scale.offsetY + 9.1 * TILE_SIZE * scale.zoom);
    ctx.lineTo(scale.offsetX + 9.7 * TILE_SIZE * scale.zoom, scale.offsetY + 9.1 * TILE_SIZE * scale.zoom);
    ctx.stroke();
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.45 + pulseFast * 0.28})`;
    ctx.fillRect(scale.offsetX + (8.7 + pulseFast * 0.9) * unit, scale.offsetY + 9.02 * unit, 0.14 * unit, 0.14 * unit);
  }

  if (hasUpgrade('keyboard-upgrade')) {
    const keyboardX = scale.offsetX + 8.55 * TILE_SIZE * scale.zoom;
    const keyboardY = scale.offsetY + 6.86 * TILE_SIZE * scale.zoom;
    const segmentWidth = 0.18 * unit;
    for (let i = 0; i < 4; i += 1) {
      const alpha = 0.46 + ((pulseFast + i * 0.18) % 1) * 0.3;
      ctx.fillStyle = i % 2 === 0 ? `rgba(${palette.accent}, ${alpha})` : `rgba(${palette.secondary}, ${alpha * 0.9})`;
      ctx.fillRect(keyboardX + i * segmentWidth, keyboardY, segmentWidth, 0.12 * unit);
    }
  }

  if (hasUpgrade('focus-timer')) {
    const timerX = scale.offsetX + 20.1 * TILE_SIZE * scale.zoom;
    const timerY = scale.offsetY + 2.7 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
    ctx.fillRect(timerX, timerY, 22, 12);
    ctx.fillStyle = `rgba(${palette.secondary}, ${pulseFast > 0.45 ? 0.85 : 0.28})`;
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
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.1 + pulseFast * 0.08})`;
    ctx.fillRect(rackX - 0.2 * unit, rackY + rackH, rackW + 0.4 * unit, 0.1 * unit);
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
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.16 + pulseFast * 0.12})`;
    ctx.fillRect(holoX + pulseFast * (holoW - 12), holoY + 4, 8, holoH - 8);
  }

  if (hasUpgrade('mini-fridge')) {
    const fridgeX = scale.offsetX + 0.95 * TILE_SIZE * scale.zoom;
    const fridgeY = scale.offsetY + 9.2 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#d7dde5';
    ctx.fillRect(fridgeX, fridgeY, 0.9 * TILE_SIZE * scale.zoom, 1.45 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = '#a7b4c7';
    ctx.fillRect(fridgeX + 3, fridgeY + 8, 0.9 * TILE_SIZE * scale.zoom - 6, 2);
    ctx.fillStyle = `rgba(150, 220, 255, ${0.14 + pulseSlow * 0.12})`;
    ctx.fillRect(fridgeX + 4, fridgeY + 4, 0.9 * TILE_SIZE * scale.zoom - 8, 0.36 * TILE_SIZE * scale.zoom);
  }

  if (hasUpgrade('ambient-speakers')) {
    const speakerY = scale.offsetY + 5.55 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#171a24';
    ctx.fillRect(scale.offsetX + 7.45 * TILE_SIZE * scale.zoom, speakerY, 10, 18);
    ctx.fillRect(scale.offsetX + 10.15 * TILE_SIZE * scale.zoom, speakerY, 10, 18);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.7)`;
    ctx.fillRect(scale.offsetX + 7.95 * TILE_SIZE * scale.zoom, speakerY + 4, 6, 6);
    ctx.fillRect(scale.offsetX + 10.65 * TILE_SIZE * scale.zoom, speakerY + 4, 6, 6);
    ctx.strokeStyle = `rgba(${palette.secondary}, ${0.16 + pulseFast * 0.14})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(scale.offsetX + 8.3 * TILE_SIZE * scale.zoom, speakerY + 8, 8 + pulseFast * 4, -0.4, 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(scale.offsetX + 10.95 * TILE_SIZE * scale.zoom, speakerY + 8, 8 + pulseFast * 4, Math.PI - 0.4, Math.PI + 0.4);
    ctx.stroke();
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
    ctx.fillStyle = `rgba(${palette.accent}, ${pulseFast > 0.5 ? 0.74 : 0.18})`;
    ctx.fillRect(terminalX + 6 + 0.75 * TILE_SIZE * scale.zoom - 6, terminalY + 5, 4, 4);
  }

  if (hasUpgrade('patch-bay')) {
    const bayX = scale.offsetX + 18.92 * TILE_SIZE * scale.zoom;
    const bayY = scale.offsetY + 9.08 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = '#171b27';
    ctx.fillRect(bayX, bayY, 1.75 * TILE_SIZE * scale.zoom, 0.55 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.secondary}, 0.35)`;
    for (let i = 0; i < 5; i += 1) {
      const active = Math.floor(timeSeconds * 6 + i) % 5 === i;
      ctx.fillStyle = active ? `rgba(${palette.secondary}, 0.9)` : `rgba(${palette.secondary}, 0.28)`;
      ctx.fillRect(bayX + 6 + i * 7, bayY + 4, 3, 3);
    }
  }

  if (hasUpgrade('plant-lab')) {
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.14 + pulseSlow * 0.08})`;
    for (let i = 0; i < 5; i += 1) {
      const sporeX = offsetX + (17.8 + Math.sin(timeSeconds * 1.3 + i) * 0.5) * unit;
      const sporeY = offsetY + (6.6 + i * 0.45 + Math.cos(timeSeconds * 1.1 + i) * 0.22) * unit;
      ctx.fillRect(sporeX, sporeY, 2, 2);
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
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.08 + pulseSlow * 0.08})`;
    ctx.beginPath();
    ctx.moveTo(droneX, droneY + 6);
    ctx.lineTo(droneX - 16, droneY + 24);
    ctx.lineTo(droneX + 16, droneY + 24);
    ctx.closePath();
    ctx.fill();
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
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.2 + pulseFast * 0.22})`;
    ctx.fillRect(cabinetX + 8 + pulseFast * (cabinetW - 18), cabinetY + 8, 6, 6);
  }

  if (hasUpgrade('neon-signage')) {
    const signX = scale.offsetX + 6.1 * TILE_SIZE * scale.zoom;
    const signY = scale.offsetY + 1.25 * TILE_SIZE * scale.zoom;
    const flicker = pulseFast > 0.12 && pulseFast < 0.9;
    ctx.strokeStyle = `rgba(${palette.accent}, ${flicker ? 0.95 : 0.42})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(signX, signY, 1.8 * TILE_SIZE * scale.zoom, 0.75 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.accent}, ${flicker ? 0.24 : 0.08})`;
    ctx.fillRect(signX, signY, 1.8 * TILE_SIZE * scale.zoom, 0.75 * TILE_SIZE * scale.zoom);
    ctx.fillStyle = `rgba(${palette.accent}, ${flicker ? 0.08 : 0.02})`;
    ctx.fillRect(signX + 0.3 * unit, signY + 2.9 * unit, 2.1 * unit, 0.1 * unit);
  }

  if (hasUpgrade('trophy-shelf')) {
    const trophyX = scale.offsetX + 18.55 * TILE_SIZE * scale.zoom;
    const trophyY = scale.offsetY + 1.18 * TILE_SIZE * scale.zoom;
    ctx.fillStyle = `rgba(${palette.accent}, 0.92)`;
    ctx.fillRect(trophyX, trophyY, 7, 8);
    ctx.fillRect(trophyX - 2, trophyY + 2, 2, 4);
    ctx.fillRect(trophyX + 7, trophyY + 2, 2, 4);
    ctx.fillRect(trophyX + 2, trophyY + 8, 3, 5);
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.32 + pulseFast * 0.26})`;
    ctx.fillRect(trophyX - 4, trophyY - 2, 2, 2);
    ctx.fillRect(trophyX + 10, trophyY + 1, 2, 2);
    ctx.fillRect(trophyX + 4, trophyY - 5, 2, 2);
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
    for (let i = 0; i < 3; i += 1) {
      const alpha = ((Math.floor(timeSeconds * 8) + i) % 3 === 0) ? 0.9 : 0.3;
      ctx.fillStyle = `rgba(${palette.secondary}, ${alpha})`;
      ctx.fillRect(vendorX + 5, vendorY + 24 + i * 7, vendorW - 10, 3);
    }
  }

  if (hasUpgrade('monitor-wall')) {
    const waveX = offsetX + (6.6 + pulseFast * 3.8) * unit;
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.1 + pulseFast * 0.12})`;
    ctx.fillRect(waveX, offsetY + 2.18 * unit, 0.22 * unit, 0.78 * unit);
  }

  if (hasUpgrade('quantum-core')) {
    const orbitX = offsetX + 12.55 * unit + Math.cos(timeSeconds * 2.2) * 0.62 * unit;
    const orbitY = offsetY + 7.45 * unit + Math.sin(timeSeconds * 2.2) * 0.38 * unit;
    ctx.fillStyle = `rgba(${palette.accent}, ${0.36 + pulseFast * 0.22})`;
    ctx.fillRect(orbitX, orbitY, 3, 3);
    ctx.fillStyle = `rgba(${palette.secondary}, ${0.3 + pulseSlow * 0.18})`;
    ctx.fillRect(offsetX + 12.55 * unit - Math.cos(timeSeconds * 2.2) * 0.44 * unit, offsetY + 7.45 * unit - Math.sin(timeSeconds * 2.2) * 0.26 * unit, 2, 2);
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

    if (actor.id === 'scout' && hasUpgrade('scout-prime')) {
      ctx.strokeStyle = `rgba(${palette.secondary}, ${0.18 + Math.abs(Math.sin(timeSeconds * 1.9)) * 0.16})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(worldX, drawBottomY - 18 * scale.zoom, 9 * scale.zoom + Math.abs(Math.sin(timeSeconds * 1.9)) * 6 * scale.zoom, -1.2, -0.25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(worldX, drawBottomY - 18 * scale.zoom);
      ctx.lineTo(worldX + 15 * scale.zoom, drawBottomY - 28 * scale.zoom);
      ctx.stroke();
    }

    if (actor.id === 'trace' && hasUpgrade('trace-plus')) {
      ctx.strokeStyle = `rgba(${palette.accent}, ${0.18 + Math.abs(Math.sin(timeSeconds * 3.1)) * 0.18})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(worldX - 10 * scale.zoom, drawBottomY - 33 * scale.zoom, 20 * scale.zoom, 22 * scale.zoom);
      ctx.fillStyle = `rgba(${palette.accent}, ${0.2 + Math.abs(Math.sin(timeSeconds * 4.4)) * 0.18})`;
      ctx.fillRect(worldX - 13 * scale.zoom, drawBottomY - 22 * scale.zoom, 3, 3);
      ctx.fillRect(worldX + 10 * scale.zoom, drawBottomY - 29 * scale.zoom, 3, 3);
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
  const alreadyVisited = state.rpg.storage?.visitedThemeIds?.includes(themeId);
  const xpGain = alreadyVisited
    ? 0
    : Math.round(55 * (1 + (state.rpg.office?.bonuses?.editXpBonus || 0)));
  state.rpgStorage = {
    ...(state.rpg?.storage || {}),
    activeThemeId: themeId,
    visitedThemeIds: alreadyVisited
      ? [...(state.rpg.storage?.visitedThemeIds || [])]
      : [...new Set([...(state.rpg.storage?.visitedThemeIds || []), themeId])],
    builderXp: Math.max(0, Number(state.rpg.storage?.builderXp || 0) + xpGain),
    builderActions: Math.max(0, Number(state.rpg.storage?.builderActions || 0) + (alreadyVisited ? 0 : 1)),
  };
  refreshRpgState();
  persistRpgState();
  renderPlayerProfile();
  renderGameMenu();
}

function purchaseUpgrade(upgradeId) {
  if (!state.player?.ok || !upgradeId) return;
  const upgrade = getUpgradeById(upgradeId);
  const catalogUpgrade = state.rpg?.upgradeCatalog?.find((entry) => entry.id === upgradeId);
  if (!upgrade || !state.rpg || !catalogUpgrade) return;
  if (state.rpg.purchasedIds.includes(upgradeId)) return;
  if (state.rpg.level < upgrade.unlockLevel || state.rpg.coins < catalogUpgrade.price) return;

  const xpGain = Math.round(catalogUpgrade.builderXpReward * (1 + (state.rpg.office?.bonuses?.editXpBonus || 0)));

  state.rpgStorage = {
    ...(state.rpg.storage || {}),
    purchasedIds: [...state.rpg.purchasedIds, upgradeId],
    builderXp: Math.max(0, Number(state.rpg.storage?.builderXp || 0) + xpGain),
    builderActions: Math.max(0, Number(state.rpg.storage?.builderActions || 0) + 1),
    purchaseCosts: {
      ...(state.rpg.storage?.purchaseCosts || {}),
      [upgradeId]: catalogUpgrade.price,
    },
  };
  refreshRpgState();
  persistRpgState();
  renderPlayerProfile();
  renderGameMenu();
}

function renderWalletStrip(rpg) {
  const office = rpg.office;
  dom.playerWallet.innerHTML = `
    <div class="wallet-card wallet-card--coins">
      <span class="wallet-label">Coins</span>
      <strong>${formatCount(rpg.coins)}</strong>
      <span class="wallet-copy">${formatCount(rpg.coinsEarned)} earned | ${formatCount(rpg.coinsSpent)} spent</span>
    </div>
    <div class="wallet-card wallet-card--track">
      <span class="wallet-label">Dev XP</span>
      <strong>Level ${state.player?.progression?.level || 1}</strong>
      <div class="wallet-track">
        <div class="wallet-track-fill" style="width:${Math.max(6, clampPercent(state.player?.progression?.progress || 0.04))}%"></div>
      </div>
      <span class="wallet-copy">${formatCount(state.player?.progression?.commitsToNextLevel || 0)} commits to next</span>
    </div>
    <div class="wallet-card wallet-card--track">
      <span class="wallet-label">Studio XP</span>
      <strong>${formatCount(office.builderXp)}</strong>
      <div class="wallet-track">
        <div class="wallet-track-fill" style="width:${Math.max(6, clampPercent(office.progress))}%"></div>
      </div>
      <span class="wallet-copy">${formatCount(office.xpToNext)} XP to ${office.nextTier ? office.nextTier.name : 'cap'}</span>
    </div>
    <div class="wallet-card">
      <span class="wallet-label">HQ power</span>
      <strong>${formatCount(office.power)}</strong>
      <span class="wallet-copy">${office.currentExpansion.name} | ${office.modules.filter((module) => module.unlocked).length} modules online</span>
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
          <div class="title-unlocks">
            ${(title.perks || []).map((perk) => `<span>${perk}</span>`).join('')}
            <span>${title.unlocks[0]}</span>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderLoadout(rpg) {
  const office = rpg.office;
  dom.playerLoadout.innerHTML = [
    ['Current title', rpg.currentTitle.title, (rpg.currentTitle.perks || []).join(' | ') || rpg.currentTitle.flavor],
    ['Builder HQ', office.currentTier.name, office.currentExpansion.name],
    ['Scene', rpg.loadout.scene, themeTraitList(rpg.activeTheme).join(' | ')],
    ['Desk rig', rpg.loadout.deskRig, 'Main workstation online'],
    ['Office power', formatCount(office.power), 'Power from gear + modules'],
    [
      'Service modules',
      rpg.loadout.modules.length ? rpg.loadout.modules.join(' | ') : 'Starter planner only',
      'Persistent systems online',
    ],
    ['Agents', rpg.loadout.agents.join(' | '), 'Active team in the room'],
    [
      'Office perks',
      rpg.loadout.officePerks.length ? rpg.loadout.officePerks.join(' | ') : 'Starter setup',
      'Upgrades currently applied',
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
  if (!upgrade.affordable) return `Need ${formatCount(upgrade.price)} coins`;
  return `Buy for ${formatCount(upgrade.price)} coins`;
}

function renderUpgradeShop(rpg) {
  dom.upgradeShop.innerHTML = rpg.upgradeCatalog
    .map(
      (upgrade) => `
        <article class="upgrade-card ${upgrade.owned ? 'is-owned' : ''} ${upgrade.unlocked ? '' : 'is-locked'}">
          <div class="upgrade-card-top">
            <div class="upgrade-card-art" style="--art-accent:${menuAccent(upgrade.type)}; --art-rarity:${menuRarityTone(upgrade.rarity)};">
              ${renderUpgradeArt(upgrade.icon, 'mini')}
            </div>
            <div class="upgrade-card-head">
              <span>${menuCategoryLabel(upgrade.category)} | ${menuRarityLabel(upgrade.rarity)}</span>
              <strong>${upgrade.name}</strong>
            </div>
          </div>
          <div class="upgrade-chip-row">
            ${upgradeTraitList(upgrade).slice(0, 2).map((item) => `<span>${item}</span>`).join('')}
          </div>
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

const UPGRADE_VISUAL_TRAITS = {
  'dual-rig': ['Dual view', 'Desk sync', 'Screen flicker'],
  'smart-lights': ['Light sweep', 'Wall glow', 'Floor tint'],
  'signal-router': ['Signal pulses', 'Link beams', 'Live routing'],
  'dev-poster-pack': ['Poster shine', 'Color swap', 'Wall pop'],
  'coffee-station': ['Steam', 'Warm corner', 'Break zone'],
  'window-garden': ['Leaf sway', 'Pollen drift', 'Skyline life'],
  'cable-management': ['Cable pulse', 'Clean lanes', 'Under-desk flow'],
  'keyboard-upgrade': ['RGB wave', 'Desk line', 'Input glow'],
  'scout-prime': ['Radar sweep', 'Scout aura', 'Watcher boost'],
  'focus-timer': ['Blink loop', 'Sprint pulse', 'Focus beacon'],
  'server-rack': ['LED scan', 'Ops hum', 'Rack glow'],
  ultrawide: ['Scanline', 'Wide HUD', 'Center rig'],
  'liquid-loop': ['Coolant flow', 'Core pulse', 'Loop tubes'],
  'trace-plus': ['Debug sparks', 'Trace brackets', 'Verifier aura'],
  'helper-drone': ['Hover route', 'Scan cone', 'Support bot'],
  'holo-board': ['Grid scan', 'Glass flicker', 'HUD overlay'],
  'mini-fridge': ['Cool blink', 'Blue hum', 'Lounge prop'],
  'speaker-stack': ['Bass pulse', 'Wave rings', 'Room rhythm'],
  'wall-terminal': ['Cursor blink', 'Status feed', 'Command wall'],
  'patch-bay': ['Port chase', 'Cable route', 'Backstage vibe'],
  'legendary-rig': ['Elite rails', 'Triple glow', 'Battle desk'],
  'plant-lab': ['Bio shimmer', 'Leaf sway', 'Soft particles'],
  'monitor-wall': ['Wall graphs', 'Data wave', 'Command grid'],
  'neon-signage': ['Neon flicker', 'Floor reflection', 'Studio sign'],
  'trophy-shelf': ['Sparkles', 'Prestige shelf', 'Win aura'],
  'arcade-corner': ['Attract mode', 'Cabinet glow', 'Play lane'],
  'quantum-core': ['Orbital core', 'Energy ring', 'Compute pulse'],
  'night-vending': ['Marquee chase', 'Snack glow', '24/7 prop'],
  'master-desk': ['Command beams', 'Deck rails', 'Master glow'],
};

const THEME_VISUAL_TRAITS = {
  starter: ['Warm wood', 'Studio calm', 'Soft amber'],
  signal: ['Cool monitors', 'Data focus', 'Signal blue'],
  neon: ['Pink glow', 'Night arcade', 'City pulse'],
  server: ['Cold ops', 'Rack energy', 'Vault steel'],
  cloud: ['Glass air', 'Steel calm', 'Scale floor'],
  skyforge: ['Gold detail', 'Creative suite', 'Forge glow'],
  orbital: ['Sci-fi bay', 'Deep space', 'Command chrome'],
  afterglow: ['Gold neon', 'Late launch', 'Luxury night'],
};

function upgradeTraitList(upgrade) {
  return UPGRADE_VISUAL_TRAITS[upgrade.icon] || [upgrade.preview, 'Room upgrade', 'Reactive'];
}

function themeTraitList(theme) {
  return THEME_VISUAL_TRAITS[theme.id] || ['Scene', 'Theme', 'Mood'];
}

function renderScenePreview(theme) {
  return `
    <div class="scene-preview scene-preview--${theme.id}">
      <div class="scene-preview-sky"></div>
      <div class="scene-preview-window-grid">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="scene-preview-orb"></div>
      <div class="scene-preview-strip"></div>
      <div class="scene-preview-floor"></div>
      <div class="scene-preview-rug"></div>
    </div>
  `;
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

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value || 0) * 100)));
}

function compactMilestoneLabel(rpg, player = state.player) {
  if (!rpg) return 'Next unlock: link GitHub progress';
  if (rpg.developer?.nextAvailableUpgrade) {
    return `Next unlock: ${rpg.developer.nextAvailableUpgrade.name} is ready in the shop`;
  }
  if (rpg.developer?.nextTitle && player?.progression) {
    return `Next unlock: ${rpg.developer.nextTitle.title} in ${formatCount(player.progression.commitsToNextLevel)} commits`;
  }
  if (rpg.office?.nextExpansion) {
    return `Next unlock: ${rpg.office.nextExpansion.name} at HQ Lv ${rpg.office.nextExpansion.level}`;
  }
  if (rpg.developer?.nextThemeUnlock) {
    return `Next unlock: ${rpg.developer.nextThemeUnlock.name} at Lv ${rpg.developer.nextThemeUnlock.unlockLevel}`;
  }
  if (rpg.developer?.nextUpgradeUnlock) {
    return `Next unlock: ${rpg.developer.nextUpgradeUnlock.name} at Lv ${rpg.developer.nextUpgradeUnlock.unlockLevel}`;
  }
  return 'Next unlock: current prestige cap reached';
}

function renderProgressRail() {
  if (!state.player?.ok || !state.rpg) {
    dom.devTrackLevel.textContent = 'Level 1';
    dom.devTrackFill.style.width = '6%';
    dom.devTrackCurrent.textContent = '0 commits';
    dom.devTrackNext.textContent = 'sync GitHub to load';
    dom.officeTrackLevel.textContent = 'Workbench Den';
    dom.officeTrackFill.style.width = '6%';
    dom.officeTrackCurrent.textContent = '0 studio XP';
    dom.officeTrackNext.textContent = '0 to next tier';
    dom.nextUnlockLabel.textContent = 'Next unlock: link GitHub progress';
    dom.playerGlanceFill.style.width = '6%';
    dom.playerGlanceNext.textContent = 'sync required';
    return;
  }

  const progression = state.player.progression;
  const rpg = state.rpg;
  dom.devTrackLevel.textContent = `Level ${progression.level}`;
  dom.devTrackFill.style.width = `${Math.max(6, clampPercent(progression.progress))}%`;
  dom.devTrackCurrent.textContent = `${formatCount(progression.totalCommits)} commits banked`;
  dom.devTrackNext.textContent = `${formatCount(progression.commitsToNextLevel)} to next level`;

  dom.officeTrackLevel.textContent = rpg.office.currentTier.name;
  dom.officeTrackFill.style.width = `${Math.max(6, clampPercent(rpg.office.progress))}%`;
  dom.officeTrackCurrent.textContent = `${formatCount(rpg.office.builderXp)} studio XP`;
  dom.officeTrackNext.textContent = rpg.office.nextTier
    ? `${formatCount(rpg.office.xpToNext)} to ${rpg.office.nextTier.name}`
    : 'HQ prestige cap reached';

  dom.nextUnlockLabel.textContent = compactMilestoneLabel(rpg, state.player);
  dom.playerGlanceFill.style.width = `${Math.max(6, clampPercent(progression.progress))}%`;
  dom.playerGlanceNext.textContent = `${formatCount(progression.commitsToNextLevel)} to next`;
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
      ? 'Where the office becomes elite.'
      : filter.copy;
  const rarityHeadline = nextUpgrade ? `${menuRarityLabel(nextUpgrade.rarity)} unlock path` : 'Collection completed';
  const nextLabel = nextUpgrade
    ? nextUpgrade.unlocked
      ? `${nextUpgrade.name} ready to buy`
      : `${nextUpgrade.name} at level ${nextUpgrade.unlockLevel}`
    : 'All upgrades in this lane purchased';
  const spotlightTraits = nextUpgrade ? upgradeTraitList(nextUpgrade).slice(0, 3) : ['Collection clear', 'Prestige room', 'Fully built'];

  dom.menuShopSpotlight.className = `menu-shop-spotlight ${state.shopFilter === 'computer' ? 'is-computer' : ''}`;
  dom.menuShopSpotlight.innerHTML = `
    <div class="menu-shop-spotlight-copy">
      <span class="info-kicker">${filter.label}</span>
      <h4>${heroTitle}</h4>
      <div class="menu-impact menu-impact--visual">
        ${spotlightTraits.map((item) => `<span>${item}</span>`).join('')}
      </div>
      <div class="menu-shop-hero-visual">
        ${renderUpgradeArt(nextUpgrade?.icon || (state.shopFilter === 'computer' ? 'master-desk' : 'monitor-wall'), 'card')}
      </div>
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
      <div class="shop-metric">
        <span>HQ power</span>
        <strong>${formatCount(rpg.office.power)}</strong>
      </div>
    </div>
  `;
}

function openMenu(tab = state.menuTab) {
  closeProfile();
  state.menuTab = MENU_TABS.includes(tab) ? tab : 'hq';
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
    hq: dom.menuTabHQ,
    shop: dom.menuTabShop,
    scenes: dom.menuTabScenes,
    inventory: dom.menuTabInventory,
  };
  const panelMap = {
    hq: dom.menuPanelHQ,
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
            ${renderUpgradeArt(upgrade.icon, 'card')}
            <span class="menu-thumb-label">${upgrade.preview}</span>
          </div>
          <div class="menu-card-copy menu-card-copy--visual">
            <div class="menu-card-head">
              <span class="menu-card-tag">${menuTypeLabel(upgrade.type)}</span>
              <strong>${upgrade.name}</strong>
            </div>
            <div class="menu-card-meta">
              <span>${menuCategoryLabel(upgrade.category)}</span>
              <span>${menuRarityLabel(upgrade.rarity)}</span>
              <span>Lv ${upgrade.unlockLevel}</span>
            </div>
            <div class="menu-card-stats">
              <div class="menu-mini-stat">
                <span>XP</span>
                <strong>+${formatCount(upgrade.builderXpReward)}</strong>
              </div>
              <div class="menu-mini-stat">
                <span>Power</span>
                <strong>+${formatCount(upgrade.officePower)}</strong>
              </div>
              <div class="menu-mini-stat">
                <span>FX</span>
                <strong>${upgradeTraitList(upgrade)[0]}</strong>
              </div>
            </div>
            <div class="menu-impact menu-impact--visual">
              ${upgradeTraitList(upgrade)
                .map((item) => `<span>${item}</span>`)
                .join('')}
            </div>
            <div class="menu-card-footer">
              <span class="menu-price">${upgrade.owned ? 'Owned' : `${formatCount(upgrade.price)} coins`}</span>
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
            ${renderScenePreview(theme)}
            <span class="scene-thumb-pill">Lv ${theme.unlockLevel}</span>
          </div>
          <div class="menu-card-copy menu-card-copy--visual">
            <div class="menu-card-head">
              <span class="menu-card-tag">Scene</span>
              <strong>${theme.name}</strong>
            </div>
            <div class="menu-impact menu-impact--visual">
              ${themeTraitList(theme)
                .map((item) => `<span>${item}</span>`)
                .join('')}
            </div>
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
              <span class="inventory-chip-icon" data-icon="${upgrade.icon}" style="--art-accent:${menuAccent(upgrade.type)};">
                ${renderUpgradeArt(upgrade.icon, 'chip')}
              </span>
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
    const previewRpg = computeRpgState(
      {
        ok: false,
        profile: {
          name: 'Builder Offline',
          login: 'local',
          repositories: 0,
          followers: 0,
          following: 0,
        },
        progression: {
          level: 1,
          totalCommits: 0,
          commitsToNextLevel: 120,
          progress: 0.04,
          contributionCommits: 0,
          ownedRepoCommits: 0,
        },
      },
      state.rpgStorage,
    );
    dom.menuCoinLabel.textContent = 'Wallet';
    dom.menuCoinCount.textContent = `${formatCount(previewRpg.coins)} coins`;
    dom.menuHeroCopy.textContent = 'Preview wallet for the builder loop.';
    dom.menuDevLabel.textContent = 'Dev track';
    dom.menuDevCount.textContent = 'Level 1';
    dom.menuDevCopy.textContent = 'Link GitHub to load real commit XP.';
    dom.menuDevFill.style.width = '6%';
    dom.menuOwnedLabel.textContent = 'Builder HQ';
    dom.menuOwnedCount.textContent = previewRpg.office.currentTier.name;
    dom.menuOwnedCopy.textContent = `${formatCount(previewRpg.office.xpToNext)} XP to next tier`;
    dom.menuOwnedFill.style.width = `${Math.max(6, clampPercent(previewRpg.office.progress))}%`;
    dom.menuThemeLabel.textContent = 'Active scene';
    dom.menuThemeName.textContent = previewRpg.activeTheme.name;
    dom.menuThemeMood.textContent = 'Preview loadout for the office-builder loop.';
    renderMenuHQ(previewRpg);
    dom.menuShopSpotlight.className = 'menu-shop-spotlight';
    dom.menuShopSpotlight.innerHTML = `
      <div class="menu-shop-spotlight-copy">
        <span class="info-kicker">Office Shop</span>
        <h4>Preview mode</h4>
        <div class="menu-impact menu-impact--visual">
          <span>Wallet locked</span>
          <span>Live shop after sync</span>
          <span>GitHub-powered progress</span>
        </div>
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
  dom.menuCoinLabel.textContent = 'Wallet';
  dom.menuCoinCount.textContent = `${formatCount(rpg.coins)} coins`;
  dom.menuHeroCopy.textContent = `${formatCount(rpg.coinsSpent)} spent | ${formatCount(rpg.coinsEarned)} earned`;
  dom.menuDevLabel.textContent = 'Dev track';
  dom.menuDevCount.textContent = `Level ${state.player.progression.level}`;
  dom.menuDevCopy.textContent = `${formatCount(state.player.progression.commitsToNextLevel)} commits to ${state.player.progression.level + 1}`;
  dom.menuDevFill.style.width = `${Math.max(6, clampPercent(state.player.progression.progress))}%`;
  dom.menuOwnedLabel.textContent = 'Builder HQ';
  dom.menuOwnedCount.textContent = rpg.office.currentTier.name;
  dom.menuOwnedCopy.textContent = rpg.office.nextTier
    ? `${formatCount(rpg.office.xpToNext)} XP to ${rpg.office.nextTier.name}`
    : 'Mythic office tier reached';
  dom.menuOwnedFill.style.width = `${Math.max(6, clampPercent(rpg.office.progress))}%`;
  dom.menuThemeLabel.textContent = 'Active scene';
  dom.menuThemeName.textContent = rpg.activeTheme.name;
  dom.menuThemeMood.textContent = `${ownedCount} owned upgrades | ${formatCount(rpg.office.power)} power`;

  renderMenuHQ(rpg);
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
    dom.playerGlanceNext.textContent = 'sync required';

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
    renderProgressRail();
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
  dom.playerGlanceNext.textContent = `${formatCount(progression.commitsToNextLevel)} to next`;

  dom.profileSource.textContent = sourceLabel;
  dom.playerName.textContent = profile.name;
  dom.playerHandle.textContent = `@${profile.login}`;
  dom.playerBio.textContent = profile.bio || 'GitHub account linked through gh CLI.';
  dom.playerLevel.textContent = `Level ${progression.level}`;
  dom.playerRank.textContent = currentTitle.title;
  dom.playerProgressBar.style.width = `${Math.max(6, Math.round(progression.progress * 100))}%`;
  dom.playerProgressText.textContent = `${formatCount(progression.totalCommits)} commits banked | ${formatCount(progression.commitsToNextLevel)} to level ${progression.level + 1}`;
  renderWalletStrip(rpg);

  dom.playerStats.innerHTML = [
    ['Total commits', formatCount(progression.totalCommits)],
    ['Repositories', formatCount(profile.repositories)],
    ['Followers', formatCount(profile.followers)],
    ['Following', formatCount(profile.following)],
    ['Contribution XP', formatCount(progression.contributionCommits)],
    ['Owned repo XP', formatCount(progression.ownedRepoCommits)],
    ['Studio XP', formatCount(rpg.office.builderXp)],
    ['Office power', formatCount(rpg.office.power)],
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
  renderProgressRail();
  renderGameMenu();
}

function renderMenuHQ(rpg) {
  const office = rpg.office;
  const devProgress = state.player?.progression || {
    level: rpg.level,
    totalCommits: 0,
    commitsToNextLevel: 120,
    progress: 0.04,
  };
  const nextTierLabel = office.nextTier ? `${office.nextTier.name} at Lv ${office.nextTier.level}` : 'Mythic cap reached';
  const moduleMarkup = office.modules
    .map(
      (module) => `
        <article class="builder-module-card ${module.unlocked ? 'is-unlocked' : 'is-locked'} ${module.maxed ? 'is-maxed' : ''}">
          <div class="builder-module-top">
            <div class="builder-icon-shell">
              ${renderUpgradeArt(module.artIcon, 'chip')}
            </div>
            <div class="builder-module-copy">
              <span>${module.unlocked ? `Lv ${module.level}` : `Unlock Lv ${module.unlockLevel}`}</span>
              <strong>${module.name}</strong>
            </div>
          </div>
          <div class="builder-module-level">
            ${Array.from({ length: 4 }, (_, index) => `<span class="${index < module.level ? 'is-on' : ''}"></span>`).join('')}
          </div>
          <div class="builder-module-state">${module.maxed ? 'Maxed module' : module.unlocked ? module.effect : `Unlock at Lv ${module.unlockLevel}`}</div>
        </article>
      `,
    )
    .join('');

  const expansionMarkup = office.expansions
    .map(
      (expansion) => `
        <article class="builder-expansion-card ${expansion.current ? 'is-current' : ''} ${expansion.unlocked ? 'is-unlocked' : 'is-locked'} ${expansion.upcoming ? 'is-upcoming' : ''}">
          <div class="builder-expansion-art">
            ${renderUpgradeArt(expansion.artIcon, 'card')}
          </div>
          <div class="builder-expansion-copy">
            <div class="builder-expansion-head">
              <span>${expansion.unlocked ? `Unlocked at Lv ${expansion.level}` : `Unlock Lv ${expansion.level}`}</span>
              <strong>${expansion.name}</strong>
            </div>
            <div class="builder-expansion-reward">${expansion.reward}</div>
          </div>
        </article>
      `,
    )
    .join('');

  const bonusItems = [
    {
      label: 'Studio XP',
      value: `+${Math.round(office.bonuses.editXpBonus * 100)}%`,
      copy: 'Faster room growth',
    },
    {
      label: 'Fabrication',
      value: `-${Math.round(office.bonuses.fabricationDiscount * 100)}%`,
      copy: 'Cheaper upgrades',
    },
    {
      label: 'Power grid',
      value: `+${Math.round(office.bonuses.officePowerBonus * 100)}%`,
      copy: 'More room power',
    },
    {
      label: 'Room slots',
      value: `${office.bonuses.roomSlots}`,
      copy: 'Support lanes online',
    },
    {
      label: 'Prestige',
      value: `+${Math.round(office.bonuses.prestigeBonus * 100)}%`,
      copy: 'Late game aura',
    },
    {
      label: 'Builder actions',
      value: `${formatCount(office.builderActions)}`,
      copy: 'Tracked build steps',
    },
  ]
    .map(
      (bonus) => `
        <article class="builder-bonus-card">
          <span>${bonus.label}</span>
          <strong>${bonus.value}</strong>
          <p>${bonus.copy}</p>
        </article>
      `,
    )
    .join('');

  const milestoneCards = [
    rpg.nextTitle
      ? {
          label: 'Next title',
          value: rpg.nextTitle.title,
          meta: `${formatCount(devProgress.commitsToNextLevel)} commits left`,
          art: 'trophy-shelf',
        }
      : {
          label: 'Next title',
          value: 'Title cap reached',
          meta: 'All titles unlocked',
          art: 'trophy-shelf',
        },
    rpg.developer?.nextThemeUnlock
      ? {
          label: 'Next scene',
          value: rpg.developer.nextThemeUnlock.name,
          meta: `Unlocks at Lv ${rpg.developer.nextThemeUnlock.unlockLevel}`,
          art: 'monitor-wall',
        }
      : {
          label: 'Next scene',
          value: rpg.activeTheme.name,
          meta: 'Highest scene unlocked',
          art: 'monitor-wall',
        },
    rpg.developer?.nextAvailableUpgrade
      ? {
          label: 'Shop target',
          value: rpg.developer.nextAvailableUpgrade.name,
          meta: `${formatCount(rpg.developer.nextAvailableUpgrade.price)} coins`,
          art: rpg.developer.nextAvailableUpgrade.icon,
        }
      : rpg.developer?.nextUpgradeUnlock
        ? {
            label: 'Shop target',
            value: rpg.developer.nextUpgradeUnlock.name,
            meta: `Unlocks at Lv ${rpg.developer.nextUpgradeUnlock.unlockLevel}`,
            art: rpg.developer.nextUpgradeUnlock.icon,
          }
        : {
            label: 'Shop target',
            value: 'Catalog cleared',
            meta: 'All major upgrades owned',
            art: 'master-desk',
          },
    office.nextExpansion
      ? {
          label: 'Base growth',
          value: office.nextExpansion.name,
          meta: `${formatCount(office.xpToNext)} XP to unlock`,
          art: office.nextExpansion.artIcon,
        }
      : office.nextModule
        ? {
            label: 'Base growth',
            value: office.nextModule.name,
            meta: `Unlocks at HQ Lv ${office.nextModule.unlockLevel}`,
            art: office.nextModule.artIcon,
          }
        : {
            label: 'Base growth',
            value: 'Mythic cap',
            meta: 'All office lanes online',
            art: 'master-desk',
          },
  ]
    .map(
      (item) => `
        <article class="builder-milestone-card">
          <div class="builder-milestone-art">${renderUpgradeArt(item.art, 'chip')}</div>
          <div class="builder-milestone-copy">
            <span>${item.label}</span>
            <strong>${item.value}</strong>
            <em>${item.meta}</em>
          </div>
        </article>
      `,
    )
    .join('');

  dom.menuBuilderGrid.innerHTML = `
    <section class="builder-panel builder-panel--hero">
      <div class="builder-rank-card">
        <div
          class="builder-rank-art builder-rank-art--scene"
          style="--scene-wall-top:${rpg.activeTheme.wallTop}; --scene-wall-mid:${rpg.activeTheme.wallMid}; --scene-wall-bottom:${rpg.activeTheme.wallBottom}; --scene-floor-a:${rpg.activeTheme.floorA}; --scene-floor-b:${rpg.activeTheme.floorB}; --scene-accent:rgb(${rpg.activeTheme.accent}); --scene-secondary:rgb(${rpg.activeTheme.secondary});"
        >
          ${renderScenePreview(rpg.activeTheme)}
          <div class="builder-rank-badge">
            ${renderUpgradeArt(office.currentExpansion.artIcon || 'master-desk', 'chip')}
          </div>
        </div>
        <div class="builder-rank-copy">
          <span class="info-kicker">Studio rank</span>
          <h4>${office.currentTier.name}</h4>
          <p>${office.currentTier.flavor}</p>
          <div class="builder-kpi-row">
            <div class="builder-kpi">
              <span>Office level</span>
              <strong>Lv ${office.level}</strong>
            </div>
            <div class="builder-kpi">
              <span>Office power</span>
              <strong>${formatCount(office.power)}</strong>
            </div>
            <div class="builder-kpi">
              <span>Current wing</span>
              <strong>${office.currentExpansion.name}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="builder-command-stack">
        <div class="builder-progress-card builder-progress-card--dual">
          <div class="builder-track-headline">
            <span class="info-kicker">Developer track</span>
            <strong>Level ${devProgress.level}</strong>
          </div>
          <div class="builder-progress-bar">
            <div class="builder-progress-fill" style="width:${Math.max(6, clampPercent(devProgress.progress))}%"></div>
          </div>
          <div class="builder-progress-foot">
            <span>${formatCount(devProgress.totalCommits)} commits total</span>
            <span>${formatCount(devProgress.commitsToNextLevel)} to next level</span>
          </div>
          <div class="builder-unlock-row">
            ${(rpg.developer?.currentPerks || []).map((unlock) => `<span>${unlock}</span>`).join('')}
          </div>
        </div>
        <div class="builder-progress-card builder-progress-card--dual">
          <div class="builder-track-headline">
            <span class="info-kicker">Builder HQ</span>
            <strong>${formatCount(office.builderXp)} XP</strong>
          </div>
          <div class="builder-progress-bar">
            <div class="builder-progress-fill" style="width:${Math.max(6, clampPercent(office.progress))}%"></div>
          </div>
          <div class="builder-progress-foot">
            <span>${formatCount(office.xpIntoLevel)} / ${formatCount(office.xpForLevel)} inside this tier</span>
            <span>${office.nextTier ? `${formatCount(office.xpToNext)} to ${nextTierLabel}` : 'Top office tier unlocked'}</span>
          </div>
          <div class="builder-unlock-row">
            ${office.currentTier.unlocks.map((unlock) => `<span>${unlock}</span>`).join('')}
          </div>
        </div>
        <div class="builder-milestone-grid">
          ${milestoneCards}
        </div>
      </div>
    </section>

    <section class="builder-panel builder-panel--bonuses">
      <div class="builder-section-head">
        <div>
          <div class="info-kicker">Office systems</div>
          <h4>Live bonuses</h4>
        </div>
        <span class="menu-panel-copy">Passive boosts now coming from titles, modules, and room buildout.</span>
      </div>
      <div class="builder-bonus-grid">
        ${bonusItems}
      </div>
    </section>

    <section class="builder-panel">
      <div class="builder-section-head">
        <div>
          <div class="info-kicker">Service room</div>
          <h4>Support modules</h4>
        </div>
        <span class="menu-panel-copy">Upgrade pips show how far each system has been developed.</span>
      </div>
      <div class="builder-module-grid">
        ${moduleMarkup}
      </div>
    </section>

    <section class="builder-panel">
      <div class="builder-section-head">
        <div>
          <div class="info-kicker">Base growth</div>
          <h4>Room expansions</h4>
        </div>
        <span class="menu-panel-copy">Each wing changes the office fantasy and unlock routing.</span>
      </div>
      <div class="builder-expansion-grid">
        ${expansionMarkup}
      </div>
    </section>
  `;
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
    renderProgressRail();
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
  openMenu('hq');
});

dom.menuClose.addEventListener('click', closeMenu);
dom.gameMenuBackdrop.addEventListener('click', closeMenu);
dom.menuTabHQ.addEventListener('click', () => setMenuTab('hq'));
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
    if (dom.gameMenu.hidden) openMenu('hq');
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
