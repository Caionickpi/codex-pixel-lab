import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CACHE_TTL_MS = 5 * 60 * 1000;

function safeJsonParse(input, fallback = null) {
  try {
    return JSON.parse(String(input || ''));
  } catch {
    return fallback;
  }
}

async function runGhJson(args) {
  const { stdout } = await execFileAsync('gh', args, {
    windowsHide: true,
    timeout: 15_000,
    maxBuffer: 1024 * 1024 * 8,
  });
  return safeJsonParse(stdout, {});
}

async function runGit(args, cwd) {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: cwd || undefined,
      windowsHide: true,
      timeout: 5_000,
      maxBuffer: 1024 * 1024,
    });
    return String(stdout || '')
      .replace(/\r/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function buildContributionQuery(years) {
  const defs = years
    .flatMap((_, index) => [`$from${index}: DateTime!`, `$to${index}: DateTime!`])
    .join(', ');
  const fields = years
    .map(
      (year, index) =>
        `y${year}: contributionsCollection(from: $from${index}, to: $to${index}) { totalCommitContributions }`,
    )
    .join('\n');

  return `query(${defs}) {\n  viewer {\n    ${fields}\n  }\n}`;
}

function buildContributionArgs(years) {
  return years.flatMap((year, index) => [
    '-F',
    `from${index}=${year}-01-01T00:00:00Z`,
    '-F',
    `to${index}=${year}-12-31T23:59:59Z`,
  ]);
}

function levelTitle(level) {
  if (level >= 20) return 'Pixel Legend';
  if (level >= 15) return 'Ship Architect';
  if (level >= 10) return 'Merge Specialist';
  if (level >= 6) return 'Commit Ranger';
  if (level >= 3) return 'Repo Builder';
  return 'New Recruit';
}

function deriveLevel(totalCommits) {
  const xp = Math.max(0, Number(totalCommits) || 0);
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 12)) + 1);
  const currentFloor = Math.max(0, Math.pow(level - 1, 2) * 12);
  const nextLevelAt = Math.pow(level, 2) * 12;
  const span = Math.max(1, nextLevelAt - currentFloor);
  const progress = Math.min(1, Math.max(0, (xp - currentFloor) / span));

  return {
    xp,
    level,
    title: levelTitle(level),
    currentFloor,
    nextLevelAt,
    progress,
    commitsToNextLevel: Math.max(0, nextLevelAt - xp),
  };
}

function normalizeRepo(node) {
  const authoredCommits = node?.defaultBranchRef?.target?.history?.totalCount ?? 0;
  return {
    id: node?.nameWithOwner || node?.name || '',
    name: node?.name || '',
    nameWithOwner: node?.nameWithOwner || node?.name || '',
    url: node?.url || '',
    description: node?.description || '',
    isPrivate: Boolean(node?.isPrivate),
    stars: node?.stargazerCount ?? 0,
    forks: node?.forkCount ?? 0,
    pushedAt: node?.pushedAt || node?.updatedAt || null,
    language: node?.primaryLanguage?.name || 'Unknown',
    languageColor: node?.primaryLanguage?.color || null,
    authoredCommits,
  };
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean)));
}

export class GitHubProfileService {
  constructor() {
    this.cache = null;
  }

  async getProfile({ workspacePath = '', force = false } = {}) {
    const now = Date.now();
    if (!force && this.cache && now - this.cache.cachedAt < CACHE_TTL_MS) {
      return this.cache.payload;
    }

    const payload = await this.fetchProfile(workspacePath);
    this.cache = {
      cachedAt: now,
      payload,
    };
    return payload;
  }

  async fetchProfile(workspacePath = '') {
    const emailCandidates = uniqueValues([
      ...(await runGit(['config', '--get-all', 'user.email'], workspacePath)),
      ...(await runGit(['config', '--global', '--get-all', 'user.email'])),
    ]);
    const primaryEmail = emailCandidates[0] || '';

    let viewerPayload;
    try {
      viewerPayload = await runGhJson([
        'api',
        'graphql',
        '--raw-field',
        'query=query($email: String!) { viewer { login name avatarUrl(size: 160) url bio company location createdAt followers { totalCount } following { totalCount } repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) { totalCount nodes { name nameWithOwner url description isPrivate stargazerCount forkCount pushedAt updatedAt primaryLanguage { name color } defaultBranchRef { name target { ... on Commit { history(author: {emails: [$email]}) { totalCount } } } } } } } }',
        '-F',
        `email=${primaryEmail}`,
      ]);
    } catch (error) {
      return {
        ok: false,
        error: 'GitHub profile unavailable. Run gh auth login to enable player progression.',
        detail: error instanceof Error ? error.message : String(error),
      };
    }

    const viewer = viewerPayload?.data?.viewer;
    if (!viewer?.login) {
      return {
        ok: false,
        error: 'No GitHub viewer is authenticated in gh.',
      };
    }

    const createdYear = new Date(viewer.createdAt || Date.now()).getUTCFullYear();
    const currentYear = new Date().getUTCFullYear();
    const years = [];
    for (let year = createdYear; year <= currentYear; year += 1) {
      years.push(year);
    }

    let contributionTotal = 0;
    if (years.length) {
      try {
        const contributionPayload = await runGhJson([
          'api',
          'graphql',
          '--raw-field',
          `query=${buildContributionQuery(years)}`,
          ...buildContributionArgs(years),
        ]);

        const contributionViewer = contributionPayload?.data?.viewer || {};
        contributionTotal = years.reduce(
          (sum, year) => sum + (contributionViewer[`y${year}`]?.totalCommitContributions ?? 0),
          0,
        );
      } catch {
        contributionTotal = 0;
      }
    }

    const repos = (viewer.repositories?.nodes || []).map(normalizeRepo);
    const ownedRepoCommitTotal = repos.reduce((sum, repo) => sum + repo.authoredCommits, 0);
    const totalCommits = Math.max(contributionTotal, ownedRepoCommitTotal);
    const level = deriveLevel(totalCommits);

    return {
      ok: true,
      profile: {
        login: viewer.login,
        name: viewer.name || viewer.login,
        avatarUrl: viewer.avatarUrl,
        url: viewer.url,
        bio: viewer.bio || 'GitHub account linked through gh CLI.',
        company: viewer.company || null,
        location: viewer.location || null,
        createdAt: viewer.createdAt,
        followers: viewer.followers?.totalCount ?? 0,
        following: viewer.following?.totalCount ?? 0,
        repositories: viewer.repositories?.totalCount ?? repos.length,
        primaryEmail,
      },
      progression: {
        totalCommits,
        contributionCommits: contributionTotal,
        ownedRepoCommits: ownedRepoCommitTotal,
        source: contributionTotal >= ownedRepoCommitTotal ? 'github-contributions' : 'owned-repositories',
        ...level,
      },
      projects: repos
        .sort((left, right) => {
          const leftTime = new Date(left.pushedAt || 0).getTime();
          const rightTime = new Date(right.pushedAt || 0).getTime();
          if (rightTime !== leftTime) return rightTime - leftTime;
          return right.authoredCommits - left.authoredCommits;
        })
        .slice(0, 6),
      meta: {
        cachedAt: new Date().toISOString(),
        emailCandidates,
      },
    };
  }
}
