// Runs in Node (Storybook's server, and tests), never in the browser.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

const schema = JSON.parse(readFileSync(new URL('../../library.schema.json', import.meta.url), 'utf8'));
const validate = new Ajv2020({ allErrors: true, strictTypes: false, validateFormats: false }).compile(schema);

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

/** The nearest directory at or above `start` whose package.json declares `workspaces`. */
function findWorkspaceRoot(start) {
  for (let directory = start; ; directory = dirname(directory)) {
    const file = join(directory, 'package.json');
    if (existsSync(file) && readJson(file).workspaces) return directory;
    if (dirname(directory) === directory) return undefined;
  }
}

/** Package directories matched by the root's `workspaces` patterns (`dir` or `dir/*`). */
function workspacePackageDirs(root) {
  const { workspaces } = readJson(join(root, 'package.json'));
  const patterns = Array.isArray(workspaces) ? workspaces : (workspaces.packages ?? []);
  return patterns.flatMap((pattern) => {
    if (!pattern.endsWith('/*')) return [resolve(root, pattern)];
    const parent = resolve(root, pattern.slice(0, -2));
    if (!existsSync(parent)) return [];
    return readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(parent, entry.name));
  });
}

/** Package directories of the Storybook project's own dependencies. */
function dependencyPackageDirs(projectDir) {
  const file = join(projectDir, 'package.json');
  if (!existsSync(file)) return [];
  const { dependencies = {}, devDependencies = {} } = readJson(file);
  // npm hoists most dependencies to the workspace root's node_modules.
  const nodeModules = [join(projectDir, 'node_modules'), findWorkspaceRoot(projectDir) && join(findWorkspaceRoot(projectDir), 'node_modules')].filter(Boolean);
  return Object.keys({ ...dependencies, ...devDependencies }).flatMap((name) => {
    const directory = nodeModules.map((parent) => join(parent, name)).find((candidate) => existsSync(join(candidate, 'package.json')));
    return directory ? [directory] : [];
  });
}

/** The file a package's subpath export (e.g. `./storybook`) points at. */
function resolveExport(packageDir, packageJson, subpath) {
  const target = packageJson.exports?.[subpath];
  const file = typeof target === 'string' ? target : (target?.import ?? target?.default);
  if (!file) throw new Error(`${packageJson.name}: azDesign.library.adapter is "${subpath}", but package.json has no "exports" entry for it.`);
  return resolve(packageDir, file);
}

/**
 * The paths discovery derives from a manifest: `adapterFile` from the
 * `adapter` export, and `readme` and local `stylesheets` resolved against the
 * package directory. Absolute paths and `http(s)` URLs pass through.
 */
function resolveManifestPaths(manifest, packageDir, packageJson) {
  return {
    adapterFile: manifest.adapter ? resolveExport(packageDir, packageJson, manifest.adapter) : undefined,
    readme: manifest.readme ? resolve(packageDir, manifest.readme) : undefined,
    stylesheets: (manifest.stylesheets ?? []).map((sheet) => (/^https?:\/\//.test(sheet) ? sheet : resolve(packageDir, sheet))),
  };
}

/**
 * Finds every component library: a workspace package or a dependency of the
 * Storybook project whose package.json has an `azDesign.library` manifest.
 * Invalid manifests throw, so a broken library stops Storybook with a clear
 * message instead of silently disappearing from the toolbar.
 *
 * Each library comes back as its manifest plus `packageName`, `packageDir`,
 * `adapterFile` (absolute path, when it has an adapter) and `stylesheets`
 * as absolute URLs or file paths.
 */
export function discoverLibraries(projectDir) {
  const root = findWorkspaceRoot(projectDir);
  const directories = [...(root ? workspacePackageDirs(root) : []), ...dependencyPackageDirs(projectDir)];
  const byName = new Map();

  for (const packageDir of directories) {
    const file = join(packageDir, 'package.json');
    if (!existsSync(file)) continue;
    const packageJson = readJson(file);
    const manifest = packageJson.azDesign?.library;
    if (!manifest || byName.has(packageJson.name)) continue;

    if (!validate(manifest)) {
      const errors = validate.errors.map((error) => `  azDesign.library${error.instancePath} ${error.message}`).join('\n');
      throw new Error(`${packageJson.name}: invalid azDesign.library manifest\n${errors}`);
    }

    byName.set(packageJson.name, {
      ...manifest,
      packageName: packageJson.name,
      packageDir,
      ...resolveManifestPaths(manifest, packageDir, packageJson),
    });
  }

  return assertUniqueKeys([...byName.values()]);
}

/** Throws when two libraries share a key, since the toolbar could only reach one of them. */
function assertUniqueKeys(libraries) {
  const keys = new Set();
  for (const library of libraries) {
    if (keys.has(library.key)) throw new Error(`Two component libraries use the key "${library.key}".`);
    keys.add(library.key);
  }
  return libraries;
}

/**
 * Applies this Storybook's addon options to the discovered libraries:
 * `disable` (keys to leave out), `overrides` (manifest fields by key, with
 * `adapter`, `readme` and `stylesheets` re-resolved like the manifest's own,
 * relative to the library's package), `order` (keys first, in this order; the
 * rest follow by title) and `default` (the initially selected key; the first
 * library otherwise).
 */
export function configureLibraries(discovered, { order = [], disable = [], overrides = {}, default: defaultKey } = {}) {
  const position = (key) => (order.includes(key) ? order.indexOf(key) : order.length);
  const libraries = discovered
    .filter((library) => !disable.includes(library.key))
    .map((library) => {
      const override = overrides[library.key];
      if (!override) return library;
      const merged = { ...library, ...override };
      return { ...merged, ...resolveManifestPaths(merged, library.packageDir, readJson(join(library.packageDir, 'package.json'))) };
    })
    .sort((a, b) => position(a.key) - position(b.key) || a.title.localeCompare(b.title));
  // An override can change a key, so check them again.
  assertUniqueKeys(libraries);

  if (defaultKey && !libraries.some((library) => library.key === defaultKey)) {
    throw new Error(`@az-digital/storybook-addon-libraries: the default library "${defaultKey}" isn't registered (registered: ${libraries.map((library) => library.key).join(', ') || 'none'}).`);
  }
  return { libraries, defaultLibrary: defaultKey ?? libraries[0]?.key };
}
