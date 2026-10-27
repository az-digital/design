// Runs in Node (Storybook's server), never in the browser.
import { existsSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import StyleDictionary from 'style-dictionary';
import { getReferences } from 'style-dictionary/utils';

/**
 * How to reference a token from each of Style Dictionary's built-in formats,
 * given the name Style Dictionary's own transforms produced for it. A custom
 * format declares its own with a `tokenReference(token)` function in that
 * file's `options` in your Style Dictionary config, which also overrides these.
 */
const BUILT_IN_REFERENCES = {
  'css/variables': (name) => `var(--${name})`,
  'scss/variables': (name) => `$${name}`,
  'scss/map-flat': (name) => `$${name}`,
  'less/variables': (name) => `@${name}`,
  'javascript/es6': (name) => name,
  'typescript/es6-declarations': (name) => name,
  'json/flat': (name) => name,
  'android/resources': (name) => `@${name}`,
  'ios-swift/class.swift': (name, file) => `${file.options?.className ?? 'StyleDictionary'}.${name}`,
  'ios-swift/enum.swift': (name, file) => `${file.options?.className ?? 'StyleDictionary'}.${name}`,
};

/** Built-in formats that write each token's derived value into the file. */
const WRITES_VALUE = new Set(['css/variables', 'scss/variables', 'scss/map-flat', 'less/variables', 'javascript/es6', 'json/flat', 'android/resources']);

/** A platform with no transforms: Style Dictionary resolves aliases but leaves values as the source file writes them. */
const SOURCE_PLATFORM = 'storybook-addon-tokens/source';

export function getAliasPath(value, references) {
  if (typeof value !== 'string' || references.length !== 1 || !Array.isArray(references[0].ref)) return undefined;
  const path = references[0].ref.join('.');
  return value.trim() === `{${path}}` ? path : undefined;
}

/**
 * Every token, in source order, as Style Dictionary reads it: its value as the
 * source file writes it, the value Style Dictionary resolves it to (before any
 * platform transform), and the token it aliases, if its whole value is one
 * reference. Style Dictionary also rejects broken and circular references here.
 */
async function readTokens(sd, sourceForPath) {
  const prop = (token, name) => (sd.usesDtcg ? token[`$${name}`] : token[name === 'description' ? 'comment' : name]);
  const source = await sd.extend({ platforms: { [SOURCE_PLATFORM]: {} } });
  const { allTokens, tokens } = await source.getPlatformTokens(SOURCE_PLATFORM);
  return allTokens.map((token) => {
    const value = prop(token.original, 'value');
    const references = getReferences(value, tokens, { usesDtcg: sd.usesDtcg, unfilteredTokens: tokens });
    const aliasOf = getAliasPath(value, references);
    return {
      path: token.path.join('.'),
      type: prop(token, 'type'),
      description: prop(token, 'description'),
      extensions: token.$extensions,
      source: sourceForPath(token.filePath),
      value,
      resolvedValue: prop(token, 'value'),
      aliasOf,
    };
  });
}

function toDisplayValue(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) return `${value.value}${value.unit}`;
  return JSON.stringify(value);
}

/** The nearest directory at or above `dir` containing a `.git` entry (a repo or worktree root), or `dir` itself. */
function findRepoRoot(dir) {
  for (let current = dir; ; current = dirname(current)) {
    if (existsSync(join(current, '.git'))) return current;
    if (dirname(current) === current) return dir;
  }
}

const toPosix = (path) => path.split('\\').join('/');

/**
 * Loads the Style Dictionary config at `configPath` and returns, without
 * writing any files: every token as Style Dictionary reads it, and for every
 * output file in every platform, how each token is referenced in that file and
 * the value Style Dictionary derives for it.
 */
export async function collectTokens(configPath, { repositoryUrl } = {}) {
  const absoluteConfig = resolve(configPath);
  const configDir = dirname(absoluteConfig);
  const repoRoot = findRepoRoot(configDir);
  // Cache-bust so edits to the config are picked up when the addon re-collects.
  const { default: config } = await import(`${pathToFileURL(absoluteConfig).href}?t=${Date.now()}`);

  // Style Dictionary resolves source globs against process.cwd(); make them
  // relative to the config file instead, the way `style-dictionary build`
  // run from the config's own package sees them.
  const fromConfig = (patterns) => patterns?.map((pattern) => (isAbsolute(pattern) ? pattern : join(configDir, pattern)));
  const sd = new StyleDictionary({ ...config, source: fromConfig(config.source), include: fromConfig(config.include) }, { verbosity: 'silent' });
  await sd.hasInitialized;

  const repoPath = (absolutePath) => toPosix(relative(repoRoot, absolutePath));
  const link = (path) => (repositoryUrl ? `${repositoryUrl.replace(/\/?$/, '/')}${path}` : undefined);

  const sourceForPath = (filePath) => {
    if (!filePath) return undefined;
    const path = repoPath(isAbsolute(filePath) ? filePath : resolve(configDir, filePath));
    return { path, url: link(path) };
  };
  const tokens = await readTokens(sd, sourceForPath);
  const aliasOf = new Map(tokens.map((token) => [token.path, token.aliasOf]));

  const artifacts = [];
  for (const [platform, platformConfig] of Object.entries(sd.options.platforms ?? {})) {
    const { allTokens } = await sd.getPlatformTokens(platform);
    for (const file of platformConfig.files ?? []) {
      const builtIn = BUILT_IN_REFERENCES[file.format] ?? ((name) => name);
      const reference = file.options?.tokenReference ?? ((token) => builtIn(token.name, file));
      const byPath = new Map(allTokens.map((token) => [token.path.join('.'), token]));
      // With `outputReferences`, a built-in format writes an alias as a
      // reference to the token it aliases (e.g. `var(--az-color-semantic-...)`)
      // instead of the resolved value, so report what the file really contains.
      const writtenAsReference = (token) => {
        if (!file.options?.outputReferences) return undefined;
        if (typeof file.options.outputReferences === 'function' && !file.options.outputReferences(token, { dictionary: { allTokens } })) return undefined;
        const alias = aliasOf.get(token.path.join('.'));
        const target = alias && byPath.get(alias);
        return target ? builtIn(target.name, file) : undefined;
      };
      const valueOf =
        file.options?.tokenValue ??
        (WRITES_VALUE.has(file.format) ? (token) => writtenAsReference(token) ?? token.$value ?? token.value : () => undefined);
      const written = {};
      for (const token of allTokens) {
        if (typeof file.filter === 'function' && !file.filter(token, platformConfig)) continue;
        written[token.path.join('.')] = { reference: reference(token), value: toDisplayValue(valueOf(token)) };
      }
      const path = repoPath(join(configDir, platformConfig.buildPath ?? '', file.destination));
      artifacts.push({ platform, format: typeof file.format === 'string' ? file.format : 'custom', path, url: link(path), tokens: written });
    }
  }

  const sourceFiles = (config.source ?? []).map((pattern) => {
    const path = repoPath(join(configDir, pattern));
    return { path, url: /[*?{]/.test(pattern) ? undefined : link(path) };
  });

  return {
    data: { tokens, sourceFiles, artifacts },
    watch: [absoluteConfig, ...(fromConfig(config.source) ?? []), ...(fromConfig(config.include) ?? [])],
  };
}
