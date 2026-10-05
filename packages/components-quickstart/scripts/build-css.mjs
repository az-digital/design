// Builds each component's CSS from its .src.css file.
//
// Quickstart pages don't load tokens.css, so a bare var(--az-…) would resolve
// to nothing there. Source files reference tokens as token(<token path>);
// this replaces each with a var() chain that follows the token's own aliases
// and ends in its resolved value:
//
//   var(--az-component-button-solid-container-color,
//     var(--az-color-semantic-action-default,
//       var(--az-color-brand-red, #ab0520)))
//
// A page that loads tokens.css, or overrides any one layer of the chain, wins;
// a page that loads nothing still gets the design system's value. Same chains
// as components-web's scripts/build-tokens.mjs.

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(__dirname, '..');
const tokensFile = resolve(packageDir, '../tokens/tokens.json');
const ALIAS = /^\{([^}]+)\}$/;

const sd = new StyleDictionary({ source: [tokensFile], log: { verbosity: 'silent' }, platforms: { css: { transformGroup: 'css' } } });
const dictionary = await sd.getPlatformTokens('css');
const byPath = new Map(dictionary.allTokens.map((token) => [token.path.join('.'), token]));

const chain = (token) => {
  const alias = typeof token.original.$value === 'string' && token.original.$value.match(ALIAS);
  const target = alias && byPath.get(alias[1]);
  return `var(--${token.name}, ${target ? chain(target) : token.$value})`;
};

for await (const source of glob('components/**/*.src.css', { cwd: packageDir })) {
  const sourcePath = resolve(packageDir, source);
  const css = (await readFile(sourcePath, 'utf8')).replace(/token\(([\w.-]+)\)/g, (_, path) => {
    const token = byPath.get(path);
    if (!token) throw new Error(`${source}: unknown token ${path}`);
    return chain(token);
  });
  const outPath = sourcePath.replace(/\.src\.css$/, '.css');
  await writeFile(outPath, `/* Generated from ${source.split('/').pop()} by scripts/build-css.mjs. Don't edit. */\n${css}`);
  console.log(`✔︎ ${source.replace(/\.src\.css$/, '.css')}`);
}
