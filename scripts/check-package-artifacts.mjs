// Run by the Release workflow after it sets versions and builds, before it
// publishes. npm versions can't be republished, so this checks that each
// tarball npm would publish contains what its package declares. Nothing is
// listed here: every check comes from the packages themselves.
//
// There must be at least one non-private workspace, and each must be in the
// @az-digital scope. For each one, `npm pack --dry-run` must include:
// - something for each entry in package.json `files`
// - each `exports`, `main` and `types` target (a wildcard export must match
//   at least one file)
// - each output in a Style Dictionary config, for a package that has one,
//   since its wildcard exports can't say which outputs should exist
import { execFileSync } from 'node:child_process';
import { existsSync, globSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = JSON.parse(readFileSync('package.json', 'utf8'));
const workspaces = globSync(root.workspaces)
  .filter((dir) => existsSync(join(dir, 'package.json')))
  .map((dir) => ({ dir, manifest: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) }))
  .filter(({ manifest }) => !manifest.private);

if (workspaces.length === 0) {
  throw new Error('No publishable workspaces were found');
}

// GitHub Packages only accepts packages in the owner's scope. Catch others
// here, or `npm publish --workspaces` would publish some packages and then fail.
const unscoped = workspaces.filter(({ manifest }) => !manifest.name?.startsWith('@az-digital/'));
if (unscoped.length > 0) {
  throw new Error(`Non-private workspaces must use the @az-digital scope: ${unscoped.map(({ dir }) => dir).join(', ')}`);
}

// A glob or export pattern as a regular expression over packed paths.
const pattern = (glob) => new RegExp(`^${glob
  .replace(/^\.\//, '')
  .split('**')
  .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*'))
  .join('.*')}$`);

// Every string target in an `exports` value, through conditions and arrays.
const exportTargets = (value) => {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(exportTargets);
  if (value && typeof value === 'object') return Object.values(value).flatMap(exportTargets);
  return [];
};

// Wildcard exports map `*` onto any path, so they match across folders.
const exportPattern = (target) => new RegExp(`^${target
  .replace(/^\.\//, '')
  .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  .replace(/\*/g, '.+')}$`);

const styleDictionaryOutputs = async (dir) => {
  const configPath = join(dir, 'style-dictionary.config.mjs');
  if (!existsSync(configPath)) return [];
  const { default: config } = await import(pathToFileURL(configPath).href);
  return Object.values(config.platforms ?? {}).flatMap((platform) =>
    (platform.files ?? []).map((file) => posix.normalize(posix.join(platform.buildPath ?? '', file.destination))));
};

const problems = [];

for (const { dir, manifest } of workspaces) {
  const [packed] = JSON.parse(execFileSync(
    'npm',
    ['pack', `--workspace=${manifest.name}`, '--dry-run', '--json'],
    { encoding: 'utf8' },
  ));
  const paths = packed.files.map((file) => file.path);
  const has = (regex) => paths.some((path) => regex.test(path));
  const missing = (what) => problems.push(`${manifest.name}: ${what}`);

  for (const entry of manifest.files ?? []) {
    const glob = entry.replace(/\/$/, '');
    if (!has(pattern(glob)) && !has(pattern(`${glob}/**`))) {
      missing(`nothing packed for "files" entry ${entry}`);
    }
  }

  const targets = [
    ...exportTargets(manifest.exports),
    ...[manifest.main, manifest.types].filter(Boolean),
  ];
  for (const target of targets) {
    if (!has(exportPattern(target))) {
      missing(`nothing packed for export target ${target}`);
    }
  }

  for (const output of await styleDictionaryOutputs(dir)) {
    if (!paths.includes(output)) {
      missing(`Style Dictionary output ${output} is not packed`);
    }
  }

  console.log(`Checked ${paths.length} packed files for ${manifest.name}`);
}

if (problems.length > 0) {
  throw new Error(`Packed packages are incomplete:\n- ${problems.join('\n- ')}`);
}
