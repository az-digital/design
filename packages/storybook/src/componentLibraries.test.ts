import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { discoverLibraries } from '@az-digital/storybook-addon-libraries/node';
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';

const storybookDir = fileURLToPath(new URL('../', import.meta.url));
const libraries = discoverLibraries(storybookDir);
const requiredSections = ['## What it is / Best for', '## Install / use', '## How it consumes tokens', '## Contribute to it', '## Verification'];

const adapters = new Map<string, LibraryAdapter>(
  await Promise.all(
    libraries
      .filter((library) => library.adapterFile)
      .map(async (library) => [library.key, (await import(pathToFileURL(library.adapterFile).href)).default] as const),
  ),
);

// Each story file that uses componentStories: its component id and its lib:* tags.
const storyFiles = Object.entries(
  import.meta.glob('../stories/**/*.stories.tsx', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>,
).flatMap(([path, source]) => {
  const component = source.match(/componentStories\(\s*'([^']+)'/)?.[1];
  if (!component) return [];
  const tags = [...(source.match(/^ {2}tags: \[([^\]]*)\]/m)?.[1] ?? '').matchAll(/'lib:([^']+)'/g)].map((match) => match[1]);
  return [{ path: relative(storybookDir, resolve(storybookDir, 'src', path)), component, tags }];
});

describe('component libraries', () => {
  it('registers Arizona Bootstrap and Web Components', () => {
    expect(libraries.map((library) => library.key)).toEqual(expect.arrayContaining(['html', 'web']));
  });

  it.each(libraries.map((library) => [library.packageName, library] as const))('%s has an adapter or a ref', (_name, library) => {
    expect(Boolean(library.adapterFile) !== Boolean(library.ref)).toBe(true);
    if (library.adapterFile) expect(adapters.get(library.key)?.components).toBeTypeOf('object');
  });

  it.each(libraries.map((library) => [library.packageName, library] as const))('%s has a README with the standard sections', (_name, library) => {
    expect(library.readme, 'set azDesign.library.readme').toBeTruthy();
    const readme = readFileSync(library.readme, 'utf8');
    for (const section of requiredSections) expect(readme).toContain(section);
  });

  it('finds component stories to check', () => {
    expect(storyFiles.length).toBeGreaterThan(0);
  });

  it.each(storyFiles.map((file) => [file.path, file] as const))('%s: every lib:* tag has the component', (_path, { component, tags }) => {
    expect(tags.length, 'list the libraries the component has as lib:* tags').toBeGreaterThan(0);
    for (const key of tags) {
      const library = libraries.find((candidate) => candidate.key === key);
      expect(library, `no library is registered as "${key}"`).toBeDefined();
      if (library?.ref) continue;
      expect(adapters.get(key)?.components[component], `${library?.packageName}'s adapter has no "${component}"`).toBeDefined();
    }
  });
});
