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

/**
 * Every token, in source order, as Style Dictionary reads it: its value as the
 * source file writes it, the value Style Dictionary resolves it to (before any
 * platform transform), and the token it aliases, if its whole value is one
 * reference. Style Dictionary also rejects broken and circular references here.
 */
async function readTokens(sd) {
  const prop = (token, name) => (sd.usesDtcg ? token[`$${name}`] : token[name === 'description' ? 'comment' : name]);
  const source = await sd.extend({ platforms: { [SOURCE_PLATFORM]: {} } });
  const { allTokens, tokens } = await source.getPlatformTokens(SOURCE_PLATFORM);
  return allTokens.map((token) => {
    const value = prop(token.original, 'value');
    const references = getReferences(value, tokens, { usesDtcg: sd.usesDtcg, unfilteredTokens: tokens });
    const aliasOf = references.length === 1 && value === references[0].key ? references[0].path.join('.') : undefined;
    return {
      path: token.path.join('.'),
      type: prop(token, 'type'),
      description: prop(token, 'description'),
      extensions: token.$extensions,
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
export async function collectTokens(configPath, { repositoryUrl, modes = {}, baseModeLabel } = {}) {
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

  const tokens = await readTokens(sd);
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

  // Modes (e.g. dark): each layers its own files over the config's source, so a
  // mode's file only holds the tokens whose value changes in it. Read the same
  // way as the base tokens; the preview and the Tokens tab show whichever mode
  // matches Storybook's current globals.
  const modeRecords = [];
  for (const [name, mode] of Object.entries(modes)) {
    const modeSd = new StyleDictionary(
      { ...config, source: [...(fromConfig(config.source) ?? []), ...fromConfig(mode.source ?? [])], include: fromConfig(config.include) },
      { verbosity: 'silent' },
    );
    await modeSd.hasInitialized;
    modeRecords.push({ name, label: mode.label ?? name, globals: mode.globals ?? {}, tokens: await readTokens(modeSd) });
  }

  const sourceFiles = (config.source ?? []).map((pattern) => {
    const path = repoPath(join(configDir, pattern));
    return { path, url: /[*?{]/.test(pattern) ? undefined : link(path) };
  });

  return {
    data: { tokens, sourceFiles, artifacts, modes: modeRecords, baseLabel: baseModeLabel ?? 'Default' },
    watch: [
      absoluteConfig,
      ...(fromConfig(config.source) ?? []),
      ...(fromConfig(config.include) ?? []),
      ...Object.values(modes).flatMap((mode) => fromConfig(mode.source ?? [])),
    ],
  };
}
