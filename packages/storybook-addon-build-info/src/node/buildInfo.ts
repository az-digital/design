import { execFileSync } from 'node:child_process';
import { existsSync, globSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { discoverLibraries } from '@az-digital/storybook-addon-libraries/node';

export const repositoryUrl = 'https://github.com/az-digital/design';

export type BuildKind = 'release' | 'prerelease' | 'preview' | 'local';

export interface PublishedPackage {
  name: string;
  url: string;
}

export interface LibrarySource {
  key: string;
  title: string;
  path: string;
}

export interface BuildInfo {
  kind: BuildKind;
  version?: string;
  tag?: string;
  branch?: string;
  pullRequest?: number;
  commit?: string;
  commitOnGitHub: boolean;
  uncommittedChanges?: boolean;
  sourceRef?: string;
  repositoryUrl: string;
  packages: PublishedPackage[];
  libraries: LibrarySource[];
}

export interface GitState {
  commit?: string;
  branch?: string;
  uncommittedChanges?: boolean;
}

const releaseVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?$/;
const commitSha = /^[a-f0-9]{40}$/i;

export function resolveBuildInfo(
  env: Record<string, string | undefined>,
  git: GitState,
  packages: PublishedPackage[],
  libraries: LibrarySource[] = [],
): BuildInfo {
  const base = { repositoryUrl, packages, libraries };

  // Releases are published from main, and the workflow validates the tag against this SHA.
  if (env.AZ_DESIGN_VERSION || env.AZ_DESIGN_TAG || env.AZ_DESIGN_SHA) {
    const version = env.AZ_DESIGN_VERSION;
    const tag = version && `v${version}`;
    const commit = env.AZ_DESIGN_SHA;
    if (!version || !releaseVersion.test(version) || env.AZ_DESIGN_TAG !== tag ||
        env.STORYBOOK_GIT_REF !== tag || !commit || !commitSha.test(commit)) {
      throw new Error('Storybook release metadata is incomplete or inconsistent with the release tag.');
    }
    if (git.commit && git.commit.toLowerCase() !== commit.toLowerCase()) {
      throw new Error('Storybook release commit does not match the checked-out source.');
    }
    return {
      ...base,
      kind: version.includes('-') ? 'prerelease' : 'release',
      version,
      tag,
      branch: 'main', // The release workflow only publishes from main.
      commit,
      commitOnGitHub: true,
      sourceRef: tag,
    };
  }

  if (env.GITHUB_ACTIONS === 'true') {
    // The checked-out PR merge commit, not the head branch, is what was built.
    const commit = git.commit || (env.GITHUB_REPOSITORY === 'az-digital/design' ? env.GITHUB_SHA : undefined);
    if (commit && !commitSha.test(commit)) {
      throw new Error('Storybook preview commit must be a full Git SHA.');
    }
    const prNumber = env.STORYBOOK_PR_NUMBER;
    if (prNumber && (!/^[1-9]\d*$/.test(prNumber) || !Number.isSafeInteger(Number(prNumber)))) {
      throw new Error('STORYBOOK_PR_NUMBER must be a positive integer.');
    }
    return {
      ...base,
      kind: 'preview',
      branch: env.GITHUB_HEAD_REF || env.STORYBOOK_GIT_REF || undefined,
      pullRequest: prNumber ? Number(prNumber) : undefined,
      commit,
      commitOnGitHub: Boolean(commit),
      sourceRef: commit,
    };
  }

  return {
    ...base,
    kind: 'local',
    branch: git.branch,
    commit: git.commit,
    commitOnGitHub: false,
    uncommittedChanges: git.uncommittedChanges,
    // Local commits and uncommitted files may not exist on GitHub.
    sourceRef: env.STORYBOOK_GIT_REF || 'main',
  };
}

function readGitState(cwd: string): GitState {
  const git = (...args: string[]) => {
    try {
      return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (error) {
      console.warn(`Storybook could not read Git metadata (${args.join(' ')}): ${error instanceof Error ? error.message : String(error)}`);
      return undefined;
    }
  };
  const status = git('status', '--porcelain');
  return {
    commit: git('rev-parse', 'HEAD'),
    branch: git('branch', '--show-current') || undefined,
    uncommittedChanges: status === undefined ? undefined : status !== '',
  };
}

function workspaceDirectories(repoRoot: string): string[] {
  const root: { workspaces?: string[] } = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  if (!Array.isArray(root.workspaces)) {
    throw new Error('The repository package.json must declare workspace patterns.');
  }
  return globSync(root.workspaces, { cwd: repoRoot }).map((directory) => join(repoRoot, directory));
}

// Use the same workspace selection as scripts/check-package-artifacts.mjs.
export function readPublishedPackages(repoRoot: string): PublishedPackage[] {
  const packages = workspaceDirectories(repoRoot)
    .map((directory) => join(directory, 'package.json'))
    .filter(existsSync)
    .map((file) => {
      const manifest: { name?: string; private?: boolean } = JSON.parse(readFileSync(file, 'utf8'));
      if (manifest.private) return undefined;
      if (!manifest.name?.startsWith('@az-digital/')) {
        throw new Error(`${file}: non-private workspaces must use the @az-digital scope.`);
      }
      const packageName = manifest.name.slice('@az-digital/'.length);
      return { name: manifest.name, url: `${repositoryUrl}/pkgs/npm/${encodeURIComponent(packageName)}` };
    })
    .filter((entry): entry is PublishedPackage => entry !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name));
  if (packages.length === 0) throw new Error('No publishable workspaces were found.');
  return packages;
}

function readLibrarySources(repoRoot: string): LibrarySource[] {
  const workspaces = new Set(workspaceDirectories(repoRoot));
  return discoverLibraries(join(repoRoot, 'packages/storybook')).flatMap((library) => {
    if (!library.adapterFile || !workspaces.has(library.packageDir)) return [];
    const path = relative(repoRoot, library.adapterFile);
    if (path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)) return [];
    return [{ key: library.key, title: library.title, path: path.split(sep).join('/') }];
  });
}

export function readBuildInfo(repoRoot: string, env = process.env): BuildInfo {
  return resolveBuildInfo(env, readGitState(repoRoot), readPublishedPackages(repoRoot), readLibrarySources(repoRoot));
}
