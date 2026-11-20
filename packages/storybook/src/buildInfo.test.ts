import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { readPublishedPackages, resolveBuildInfo } from '../.storybook/buildInfo';

const sha = 'a'.repeat(40);
const releaseEnv = {
  GITHUB_ACTIONS: 'true',
  AZ_DESIGN_VERSION: '1.2.3',
  AZ_DESIGN_TAG: 'v1.2.3',
  AZ_DESIGN_SHA: sha,
  STORYBOOK_GIT_REF: 'v1.2.3',
};

describe('Storybook build metadata', () => {
  it('uses the verified release metadata rather than the URL alias', () => {
    const build = resolveBuildInfo(releaseEnv, { commit: sha }, []);
    expect(build).toMatchObject({
      kind: 'release',
      version: '1.2.3',
      tag: 'v1.2.3',
      commit: sha,
      sourceRef: 'v1.2.3',
    });
  });

  it('distinguishes a prerelease and rejects inconsistent release metadata', () => {
    const prerelease = {
      ...releaseEnv,
      AZ_DESIGN_VERSION: '2.0.0-beta.1',
      AZ_DESIGN_TAG: 'v2.0.0-beta.1',
      STORYBOOK_GIT_REF: 'v2.0.0-beta.1',
    };
    expect(resolveBuildInfo(prerelease, { commit: sha }, []).kind).toBe('prerelease');
    expect(() => resolveBuildInfo({ ...releaseEnv, STORYBOOK_GIT_REF: 'main' }, { commit: sha }, [])).toThrow(/release metadata/);
    expect(() => resolveBuildInfo(releaseEnv, { commit: 'b'.repeat(40) }, [])).toThrow(/checked-out source/);
  });

  it('links PR previews to the checked-out merge commit instead of the head branch', () => {
    const build = resolveBuildInfo({
      GITHUB_ACTIONS: 'true',
      GITHUB_REPOSITORY: 'az-digital/design',
      GITHUB_HEAD_REF: 'feature/button',
      GITHUB_SHA: 'b'.repeat(40),
      STORYBOOK_PR_NUMBER: '166',
    }, { commit: sha }, []);
    expect(build).toMatchObject({
      kind: 'preview',
      branch: 'feature/button',
      pullRequest: 166,
      commit: sha,
      sourceRef: sha,
    });
    expect(build.version).toBeUndefined();
  });

  it('does not fabricate a source revision when CI metadata is unavailable', () => {
    const build = resolveBuildInfo({ GITHUB_ACTIONS: 'true' }, {}, []);
    expect(build.kind).toBe('preview');
    expect(build.commit).toBeUndefined();
    expect(build.sourceRef).toBeUndefined();
  });

  it('labels local work as unreleased even if its source ref looks like a tag', () => {
    const build = resolveBuildInfo(
      { STORYBOOK_GIT_REF: 'v1.2.3' },
      { branch: 'feature', commit: sha, uncommittedChanges: true },
      [],
    );
    expect(build).toMatchObject({ kind: 'local', branch: 'feature', commitOnGitHub: false, uncommittedChanges: true });
    expect(build.version).toBeUndefined();
  });
});

describe('publishable workspace discovery', () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
  });

  it('includes only non-private workspaces and rejects invalid publishable names', () => {
    const root = mkdtempSync(join(tmpdir(), 'storybook-build-info-'));
    directories.push(root);
    writeFileSync(join(root, 'package.json'), JSON.stringify({ workspaces: ['packages/*'] }));
    for (const [directory, manifest] of [
      ['tokens', { name: '@az-digital/tokens' }],
      ['preview', { name: '@az-digital/preview', private: true }],
    ] as const) {
      mkdirSync(join(root, 'packages', directory), { recursive: true });
      writeFileSync(join(root, 'packages', directory, 'package.json'), JSON.stringify(manifest));
    }

    expect(readPublishedPackages(root).map((pkg) => pkg.name)).toEqual(['@az-digital/tokens']);
    writeFileSync(join(root, 'packages/tokens/package.json'), JSON.stringify({ name: 'unscoped' }));
    expect(() => readPublishedPackages(root)).toThrow(/non-private workspaces/);
  });
});
