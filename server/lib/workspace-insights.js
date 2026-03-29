import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { compactText, displayPath } from './utils.js';

const execFileAsync = promisify(execFile);

async function runGit(cwd, args) {
  const { stdout } = await execFileAsync('git', args, {
    cwd,
    timeout: 3000,
    windowsHide: true,
    maxBuffer: 1024 * 1024,
  });
  return stdout;
}

export async function collectWorkspaceInsights(workspacePath) {
  const cwd = displayPath(workspacePath || '');
  const projectName = path.basename(cwd || process.cwd());
  const base = {
    cwd,
    projectName,
    exists: !!cwd && fs.existsSync(cwd),
    isGit: false,
    branch: null,
    dirtyCount: 0,
    clean: null,
    changedFiles: [],
    checkedAt: new Date().toISOString(),
  };

  if (!base.exists) {
    return base;
  }

  try {
    const status = await runGit(cwd, ['status', '--porcelain', '--branch']);
    const lines = status.replace(/\r/g, '').split('\n').filter(Boolean);
    if (!lines.length) {
      return { ...base, isGit: true, clean: true };
    }

    const [headLine, ...fileLines] = lines;
    const branchMatch = headLine.match(/^##\s+([^\s.]+)/);
    const changedFiles = fileLines.map((line) => {
      const code = line.slice(0, 2).trim() || '??';
      const file = compactText(line.slice(3));
      return { code, file };
    });

    return {
      ...base,
      isGit: true,
      branch: branchMatch?.[1] || 'detached',
      dirtyCount: changedFiles.length,
      clean: changedFiles.length === 0,
      changedFiles: changedFiles.slice(0, 8),
    };
  } catch {
    return base;
  }
}
