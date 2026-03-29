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
    unlocks: ['Signal Hub scene', 'Dual Rig upgrade'],
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
    unlocks: ['Cloud Deck scene', 'Helper Drone upgrade'],
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
  {
    level: 18,
    id: 'release-conductor',
    title: 'Release Conductor',
    flavor: 'Every system in the room answers to your shipping rhythm.',
    unlocks: ['Afterglow Deck scene', 'Night Shift Vending upgrade'],
  },
  {
    level: 22,
    id: 'studio-overlord',
    title: 'Studio Overlord',
    flavor: 'The office now feels like a legendary dev base.',
    unlocks: ['Prestige aura', 'Studio trophy flex'],
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
  signal: {
    id: 'signal',
    name: 'Signal Hub',
    unlockLevel: 3,
    mood: 'Cleaner walls, cooler signal tones, and a more focused monitoring vibe.',
    wallTop: '#32405f',
    wallMid: '#202a41',
    wallBottom: '#141d30',
    wallGlow: '166, 226, 255',
    accent: '166, 226, 255',
    secondary: '143, 243, 207',
    marker: '#dbfbff',
    windowTop: '#3f5d88',
    windowBottom: '#101a2a',
    floorA: '#31303c',
    floorB: '#262632',
    rugs: [
      ['#49617b', '#394e65', '#293a4d'],
      ['#4e4a5d', '#3d3a4a', '#2a2735'],
      ['#4c5f58', '#394a44', '#26332f'],
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
  cloud: {
    id: 'cloud',
    name: 'Cloud Deck',
    unlockLevel: 9,
    mood: 'Airier glass tones, cool steel, and a calmer high-scale ops floor.',
    wallTop: '#445470',
    wallMid: '#2d3950',
    wallBottom: '#192331',
    wallGlow: '164, 245, 255',
    accent: '164, 245, 255',
    secondary: '255, 214, 142',
    marker: '#ecffff',
    windowTop: '#6b86b4',
    windowBottom: '#1b2639',
    floorA: '#2c323b',
    floorB: '#232831',
    rugs: [
      ['#51708a', '#3f5b72', '#2b4155'],
      ['#5f5e74', '#4c4b61', '#353449'],
      ['#766345', '#5f5038', '#453924'],
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
  afterglow: {
    id: 'afterglow',
    name: 'Afterglow Deck',
    unlockLevel: 18,
    mood: 'Late-night neon gold mix with a premium post-launch atmosphere.',
    wallTop: '#3e3650',
    wallMid: '#241e33',
    wallBottom: '#14101c',
    wallGlow: '255, 189, 117',
    accent: '255, 189, 117',
    secondary: '150, 255, 235',
    marker: '#fff1d4',
    windowTop: '#6659aa',
    windowBottom: '#1a1530',
    floorA: '#35263a',
    floorB: '#291c2e',
    rugs: [
      ['#7d5a46', '#654736', '#462f24'],
      ['#554e74', '#40395c', '#2d2843'],
      ['#29535a', '#1f4147', '#153036'],
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
    icon: 'rig',
    preview: 'RIG',
    description: 'Adds a second monitor and better workstation glow.',
    impact: ['Adds a second screen to the main desk', 'Boosts workstation glow'],
  },
  {
    id: 'smart-lights',
    name: 'Smart Lights',
    unlockLevel: 3,
    cost: 140,
    type: 'ambient',
    icon: 'light',
    preview: 'LUX',
    description: 'Reactive ceiling and wall lighting follows runtime mood.',
    impact: ['Adds ceiling strips', 'Makes lighting react harder to runtime state'],
  },
  {
    id: 'signal-router',
    name: 'Signal Router',
    unlockLevel: 4,
    cost: 150,
    type: 'ops',
    icon: 'signal',
    preview: 'NET',
    description: 'Installs a tiny signal router with blinking uplink markers.',
    impact: ['Adds a signal uplink node', 'Gives the room a more connected ops feel'],
  },
  {
    id: 'dev-poster-pack',
    name: 'Dev Poster Pack',
    unlockLevel: 4,
    cost: 110,
    type: 'decor',
    icon: 'poster',
    preview: 'ART',
    description: 'Hangs bold wall posters that make the office feel more lived-in.',
    impact: ['Adds wall art', 'Warms up the left side of the office'],
  },
  {
    id: 'coffee-station',
    name: 'Coffee Station',
    unlockLevel: 4,
    cost: 135,
    type: 'comfort',
    icon: 'coffee',
    preview: 'BREW',
    description: 'Upgrades the side table into a real coffee corner.',
    impact: ['Adds a coffee machine setup', 'Makes the lounge corner richer'],
  },
  {
    id: 'window-garden',
    name: 'Window Garden',
    unlockLevel: 5,
    cost: 160,
    type: 'decor',
    icon: 'plant',
    preview: 'PLANT',
    description: 'Adds more plants and motion to the office skyline wall.',
    impact: ['Adds more plants to the scene', 'Makes the skyline wall feel alive'],
  },
  {
    id: 'cable-management',
    name: 'Cable Management',
    unlockLevel: 5,
    cost: 145,
    type: 'rig',
    icon: 'cable',
    preview: 'CBL',
    description: 'Tightens the desk setup with cleaner cable runs and less clutter.',
    impact: ['Adds under-desk cable lanes', 'Makes the setup feel more premium'],
  },
  {
    id: 'keyboard-upgrade',
    name: 'Mechanical Keyboard',
    unlockLevel: 5,
    cost: 170,
    type: 'rig',
    icon: 'keyboard',
    preview: 'KEY',
    description: 'Swaps in a glowing keyboard strip for the main desk.',
    impact: ['Adds a keyboard glow bar', 'Improves the main desk silhouette'],
  },
  {
    id: 'scout-prime',
    name: 'Scout Prime',
    unlockLevel: 7,
    cost: 240,
    type: 'agent',
    icon: 'agent',
    preview: 'AI',
    description: 'Upgrades Scout into a sharper watcher with a cleaner label.',
    impact: ['Upgrades Scout status', 'Makes the watcher role feel stronger'],
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    unlockLevel: 7,
    cost: 180,
    type: 'display',
    icon: 'timer',
    preview: 'FOCUS',
    description: 'Mounts a tiny wall timer to make the office feel more active.',
    impact: ['Adds a wall timer display', 'Supports the active sprint vibe'],
  },
  {
    id: 'server-rack',
    name: 'Server Rack',
    unlockLevel: 7,
    cost: 300,
    type: 'ops',
    icon: 'rack',
    preview: 'OPS',
    description: 'Installs a rack with status LEDs and more ops atmosphere.',
    impact: ['Adds a live server rack', 'Pushes the room deeper into ops mode'],
  },
  {
    id: 'trace-plus',
    name: 'Trace Plus',
    unlockLevel: 9,
    cost: 260,
    type: 'agent',
    icon: 'agent',
    preview: 'DBG',
    description: 'Turns Trace into the senior debugger of the room.',
    impact: ['Upgrades Trace role presentation', 'Strengthens debugger identity'],
  },
  {
    id: 'helper-drone',
    name: 'Helper Drone',
    unlockLevel: 9,
    cost: 340,
    type: 'assistant',
    icon: 'drone',
    preview: 'BOT',
    description: 'A floating helper bot patrols the room and boosts the vibe.',
    impact: ['Adds a floating helper drone', 'Makes the office feel more game-like'],
  },
  {
    id: 'holo-board',
    name: 'Holo Board',
    unlockLevel: 10,
    cost: 360,
    type: 'display',
    icon: 'display',
    preview: 'HUD',
    description: 'Replaces the sync board with a more futuristic display layer.',
    impact: ['Adds a holographic board overlay', 'Makes sync surfaces feel more advanced'],
  },
  {
    id: 'mini-fridge',
    name: 'Mini Fridge',
    unlockLevel: 10,
    cost: 220,
    type: 'comfort',
    icon: 'fridge',
    preview: 'COOL',
    description: 'Adds a mini fridge to the lounge edge for more studio energy.',
    impact: ['Adds a compact fridge block', 'Enriches the break area'],
  },
  {
    id: 'ambient-speakers',
    name: 'Ambient Speakers',
    unlockLevel: 10,
    cost: 210,
    type: 'audio',
    icon: 'audio',
    preview: 'SND',
    description: 'Mounts a pair of speakers for a more premium workstation setup.',
    impact: ['Adds speaker stacks', 'Strengthens the premium desk feel'],
  },
  {
    id: 'wall-terminal',
    name: 'Wall Terminal',
    unlockLevel: 11,
    cost: 310,
    type: 'display',
    icon: 'terminal',
    preview: 'TERM',
    description: 'Installs a side-wall terminal for ambient telemetry.',
    impact: ['Adds an extra wall display', 'Makes the office feel more technical'],
  },
  {
    id: 'patch-bay',
    name: 'Patch Bay',
    unlockLevel: 11,
    cost: 295,
    type: 'ops',
    icon: 'patch',
    preview: 'PATCH',
    description: 'Adds a connection bay with live status strips near the ops rack.',
    impact: ['Adds a patch panel near the rack', 'Deepens the backstage systems vibe'],
  },
  {
    id: 'legendary-rig',
    name: 'Legendary Rig',
    unlockLevel: 12,
    cost: 480,
    type: 'rig',
    icon: 'legend',
    preview: 'XL',
    description: 'Transforms the main desk into a true endgame setup.',
    impact: ['Upgrades the main desk to endgame tier', 'Makes the workstation unmistakably elite'],
  },
  {
    id: 'plant-lab',
    name: 'Plant Lab',
    unlockLevel: 12,
    cost: 255,
    type: 'decor',
    icon: 'plant',
    preview: 'BIO',
    description: 'Turns the office into a richer green studio with extra foliage.',
    impact: ['Adds more hanging and floor plants', 'Softens the technical room with organic detail'],
  },
  {
    id: 'neon-signage',
    name: 'Neon Signage',
    unlockLevel: 13,
    cost: 320,
    type: 'ambient',
    icon: 'neon',
    preview: 'GLOW',
    description: 'Adds a glowing neon sign to the wall for real late-night identity.',
    impact: ['Adds a glowing wall sign', 'Makes the room read instantly as a dev studio'],
  },
  {
    id: 'arcade-corner',
    name: 'Arcade Corner',
    unlockLevel: 15,
    cost: 620,
    type: 'decor',
    icon: 'arcade',
    preview: 'PLAY',
    description: 'Adds a celebratory arcade cabinet and trophy glow.',
    impact: ['Adds an arcade cabinet', 'Gives the office a visible victory corner'],
  },
  {
    id: 'trophy-shelf',
    name: 'Trophy Shelf',
    unlockLevel: 15,
    cost: 360,
    type: 'decor',
    icon: 'trophy',
    preview: 'WIN',
    description: 'Places glowing trophies on the shelf to celebrate the grind.',
    impact: ['Adds shelf trophies', 'Makes high-level progression visible at a glance'],
  },
  {
    id: 'night-shift-vending',
    name: 'Night Shift Vending',
    unlockLevel: 16,
    cost: 420,
    type: 'comfort',
    icon: 'vendor',
    preview: '24H',
    description: 'Brings in a vending machine that makes the office feel like a real studio floor.',
    impact: ['Adds a vending machine prop', 'Fills the lounge with more world-building detail'],
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
      purchasedIds.includes('helper-drone') ? 'Helper Drone' : 'Codex support',
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
