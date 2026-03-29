export const TITLE_LADDER = [
  {
    level: 1,
    id: 'new-recruit',
    title: 'New Recruit',
    flavor: 'Booting the first workstation.',
    unlocks: ['Starter Loft scene', 'Basic desk rig'],
  },
  {
    level: 3,
    id: 'repo-builder',
    title: 'Repo Builder',
    flavor: 'Shipping consistently and wiring better tools.',
    unlocks: ['Smart Lights upgrade', 'Dual Rig upgrade'],
  },
  {
    level: 5,
    id: 'night-shift-captain',
    title: 'Night Shift Captain',
    flavor: 'Owns the late-night sprint glow.',
    unlocks: ['Neon Loft scene', 'Window Garden upgrade'],
  },
  {
    level: 7,
    id: 'commit-ranger',
    title: 'Commit Ranger',
    flavor: 'Navigates repos with calm precision.',
    unlocks: ['Server Vault scene', 'Scout Prime upgrade'],
  },
  {
    level: 9,
    id: 'merge-specialist',
    title: 'Merge Specialist',
    flavor: 'Turns chaos into release nights.',
    unlocks: ['Helper Drone upgrade', 'Trace Plus upgrade'],
  },
  {
    level: 12,
    id: 'ship-architect',
    title: 'Ship Architect',
    flavor: 'Designs the whole floor, not just the patch.',
    unlocks: ['Sky Forge scene', 'Legendary Rig upgrade'],
  },
  {
    level: 15,
    id: 'pixel-legend',
    title: 'Pixel Legend',
    flavor: 'Your office feels like an endgame build.',
    unlocks: ['Orbital Bay scene', 'Arcade Corner upgrade'],
  },
];

export const THEME_DEFS = {
  starter: {
    id: 'starter',
    name: 'Starter Loft',
    unlockLevel: 1,
    mood: 'Calm studio with warm wood and slate walls.',
    wallTop: '#344564',
    wallMid: '#212d45',
    wallBottom: '#151e30',
    wallGlow: '255, 203, 121',
    accent: '255, 203, 121',
    secondary: '143, 243, 207',
    marker: '#dffef3',
    windowTop: '#3a5a8b',
    windowBottom: '#121b2c',
    floorA: '#3c2934',
    floorB: '#34242d',
    rugs: [
      ['#40516f', '#34445f', '#2c394f'],
      ['#584459', '#463246', '#38293a'],
      ['#66524d', '#4c3b37', '#3c2d2a'],
    ],
  },
  neon: {
    id: 'neon',
    name: 'Neon Loft',
    unlockLevel: 5,
    mood: 'More electric, more contrast, more nightlife energy.',
    wallTop: '#2d355c',
    wallMid: '#1b2140',
    wallBottom: '#11152b',
    wallGlow: '134, 214, 255',
    accent: '255, 143, 207',
    secondary: '125, 255, 236',
    marker: '#e7fffb',
    windowTop: '#4d5cd3',
    windowBottom: '#171b38',
    floorA: '#352237',
    floorB: '#29192f',
    rugs: [
      ['#51407b', '#433266', '#2f244b'],
      ['#593958', '#472b47', '#341d34'],
      ['#243f56', '#1f3144', '#162433'],
    ],
  },
  server: {
    id: 'server',
    name: 'Server Vault',
    unlockLevel: 7,
    mood: 'Cool LEDs, darker room, more ops energy.',
    wallTop: '#29354c',
    wallMid: '#172233',
    wallBottom: '#0e1622',
    wallGlow: '121, 255, 236',
    accent: '121, 255, 236',
    secondary: '124, 169, 255',
    marker: '#ddf6ff',
    windowTop: '#29496f',
    windowBottom: '#0f1624',
    floorA: '#232630',
    floorB: '#1c2028',
    rugs: [
      ['#214a60', '#18384a', '#122937'],
      ['#3a3e56', '#2a2f46', '#1f2236'],
      ['#3f4e52', '#2d3a3d', '#1c2629'],
    ],
  },
  skyforge: {
    id: 'skyforge',
    name: 'Sky Forge',
    unlockLevel: 12,
    mood: 'High-rise creative suite with warm gold detail.',
    wallTop: '#485269',
    wallMid: '#293243',
    wallBottom: '#171d29',
    wallGlow: '255, 214, 142',
    accent: '255, 214, 142',
    secondary: '164, 245, 255',
    marker: '#fff0c7',
    windowTop: '#6d7ba7',
    windowBottom: '#1b2133',
    floorA: '#433124',
    floorB: '#35261d',
    rugs: [
      ['#6b5a3d', '#56492f', '#3f351f'],
      ['#62637d', '#4d4d64', '#37384a'],
      ['#31536b', '#254356', '#18303e'],
    ],
  },
  orbital: {
    id: 'orbital',
    name: 'Orbital Bay',
    unlockLevel: 15,
    mood: 'Endgame tech floor with a polished sci-fi vibe.',
    wallTop: '#2d3144',
    wallMid: '#171b28',
    wallBottom: '#0d1018',
    wallGlow: '255, 174, 121',
    accent: '255, 174, 121',
    secondary: '119, 255, 214',
    marker: '#fff2da',
    windowTop: '#5769b7',
    windowBottom: '#121626',
    floorA: '#26222f',
    floorB: '#1d1a26',
    rugs: [
      ['#5a436d', '#473457', '#332540'],
      ['#395268', '#294150', '#1b2d39'],
      ['#5f4730', '#493621', '#332514'],
    ],
  },
};

export const UPGRADE_DEFS = [
  {
    id: 'dual-rig',
    name: 'Dual Rig',
    unlockLevel: 3,
    cost: 120,
    type: 'rig',
    description: 'Adds a second monitor and better workstation glow.',
  },
  {
    id: 'smart-lights',
    name: 'Smart Lights',
    unlockLevel: 3,
    cost: 140,
    type: 'ambient',
    description: 'Reactive ceiling and wall lighting follows runtime mood.',
  },
  {
    id: 'window-garden',
    name: 'Window Garden',
    unlockLevel: 5,
    cost: 160,
    type: 'decor',
    description: 'Adds more plants and motion to the office skyline wall.',
  },
  {
    id: 'scout-prime',
    name: 'Scout Prime',
    unlockLevel: 7,
    cost: 240,
    type: 'agent',
    description: 'Upgrades Scout into a sharper watcher with a cleaner label.',
  },
  {
    id: 'trace-plus',
    name: 'Trace Plus',
    unlockLevel: 9,
    cost: 260,
    type: 'agent',
    description: 'Turns Trace into the senior debugger of the room.',
  },
  {
    id: 'server-rack',
    name: 'Server Rack',
    unlockLevel: 9,
    cost: 300,
    type: 'ops',
    description: 'Installs a rack with status LEDs and more ops atmosphere.',
  },
  {
    id: 'helper-drone',
    name: 'Helper Drone',
    unlockLevel: 9,
    cost: 340,
    type: 'assistant',
    description: 'A floating helper bot patrols the room and boosts the vibe.',
  },
  {
    id: 'holo-board',
    name: 'Holo Board',
    unlockLevel: 10,
    cost: 360,
    type: 'display',
    description: 'Replaces the sync board with a more futuristic display layer.',
  },
  {
    id: 'legendary-rig',
    name: 'Legendary Rig',
    unlockLevel: 12,
    cost: 480,
    type: 'rig',
    description: 'Transforms the main desk into a true endgame setup.',
  },
  {
    id: 'arcade-corner',
    name: 'Arcade Corner',
    unlockLevel: 15,
    cost: 620,
    type: 'decor',
    description: 'Adds a celebratory arcade cabinet and trophy glow.',
  },
];

export function getCurrentTitle(level) {
  return [...TITLE_LADDER].reverse().find((entry) => level >= entry.level) || TITLE_LADDER[0];
}

export function getNextTitle(level) {
  return TITLE_LADDER.find((entry) => entry.level > level) || null;
}

export function getUnlockedThemes(level) {
  return Object.values(THEME_DEFS)
    .filter((theme) => level >= theme.unlockLevel)
    .sort((left, right) => left.unlockLevel - right.unlockLevel);
}

export function getThemeById(id) {
  return THEME_DEFS[id] || THEME_DEFS.starter;
}

export function getUpgradeById(id) {
  return UPGRADE_DEFS.find((upgrade) => upgrade.id === id) || null;
}

function normalizeStoredState(stored = {}) {
  return {
    purchasedIds: Array.isArray(stored.purchasedIds) ? [...new Set(stored.purchasedIds)] : [],
    activeThemeId: typeof stored.activeThemeId === 'string' ? stored.activeThemeId : '',
  };
}

function deriveCoinsEarned(player) {
  const commits = Number(player?.progression?.totalCommits || 0);
  const repos = Number(player?.profile?.repositories || 0);
  const followers = Number(player?.profile?.followers || 0);
  const level = Number(player?.progression?.level || 1);
  return Math.max(180, Math.floor(commits * 3.6 + repos * 90 + followers * 28 + level * 120));
}

function spentCoins(purchasedIds) {
  return purchasedIds.reduce((sum, id) => sum + (getUpgradeById(id)?.cost || 0), 0);
}

export function computeRpgState(player, stored = {}) {
  const normalized = normalizeStoredState(stored);
  const level = Number(player?.progression?.level || 1);
  const currentTitle = getCurrentTitle(level);
  const nextTitle = getNextTitle(level);
  const unlockedThemes = getUnlockedThemes(level);
  const purchasedIds = normalized.purchasedIds.filter((id) => Boolean(getUpgradeById(id)));
  const coinsEarned = deriveCoinsEarned(player);
  const coinsSpent = spentCoins(purchasedIds);
  const coins = Math.max(0, coinsEarned - coinsSpent);
  const defaultTheme = unlockedThemes[unlockedThemes.length - 1] || THEME_DEFS.starter;
  const activeThemeId = unlockedThemes.some((theme) => theme.id === normalized.activeThemeId)
    ? normalized.activeThemeId
    : defaultTheme.id;
  const activeTheme = getThemeById(activeThemeId);
  const upgradeCatalog = UPGRADE_DEFS.map((upgrade) => ({
    ...upgrade,
    unlocked: level >= upgrade.unlockLevel,
    owned: purchasedIds.includes(upgrade.id),
    affordable: coins >= upgrade.cost,
  }));

  const loadout = {
    scene: activeTheme.name,
    sceneMood: activeTheme.mood,
    deskRig: purchasedIds.includes('legendary-rig')
      ? 'Legendary Rig'
      : purchasedIds.includes('dual-rig')
        ? 'Dual Rig'
        : 'Starter Rig',
    agents: [
      purchasedIds.includes('trace-plus') ? 'Trace Plus' : 'Trace',
      purchasedIds.includes('scout-prime') ? 'Scout Prime' : 'Scout',
      'Codex',
    ],
    officePerks: upgradeCatalog.filter((upgrade) => upgrade.owned).map((upgrade) => upgrade.name),
  };

  return {
    level,
    currentTitle,
    nextTitle,
    titleRoadmap: TITLE_LADDER.map((entry) => ({
      ...entry,
      unlocked: level >= entry.level,
      current: entry.id === currentTitle.id,
      upcoming: nextTitle?.id === entry.id,
    })),
    unlockedThemes,
    activeThemeId,
    activeTheme,
    purchasedIds,
    upgradeCatalog,
    coinsEarned,
    coinsSpent,
    coins,
    storage: {
      purchasedIds,
      activeThemeId,
    },
    loadout,
  };
}
