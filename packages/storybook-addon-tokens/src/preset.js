// Storybook preset: runs in Node when Storybook starts or builds.
// Storybook also loads this package's `./manager` export (the Tokens tab) and
// `./preview` export (which hands the Tab its data) on its own, so they aren't
// registered here.
import { isAbsolute, resolve } from 'node:path';

/**
 * Adds the Vite plugin that runs your Style Dictionary config and serves its
 * results to the preview. Options (from this addon's entry in `main.ts`):
 * - `styleDictionary` (required): path to your Style Dictionary config,
 *   relative to Storybook's config directory.
 * - `repositoryUrl`: base URL that repo-relative file paths are appended to
 *   for links, e.g. `https://github.com/org/repo/blob/main/`.
 * - `modes`: token modes such as dark, by name. Each lists `source` files
 *   (relative to the Style Dictionary config, like its own `source`) layered
 *   over the config's source, and the Storybook `globals` that select it, e.g.
 *   `{ dark: { source: ['tokens.dark.json'], globals: { theme: 'Dark' } } }`.
 *   An optional `label` names it in the Tokens tab.
 * - `baseModeLabel`: what to call the base values when there are modes, e.g.
 *   `Light`. Defaults to `Default`.
 */
export const viteFinal = async (config, options) => {
  if (!options.styleDictionary) {
    throw new Error('@az-digital/storybook-addon-tokens: set the `styleDictionary` option to your Style Dictionary config path.');
  }
  const { tokensPlugin } = await import('./node/vite-plugin.js');
  const styleDictionary = isAbsolute(options.styleDictionary) ? options.styleDictionary : resolve(options.configDir, options.styleDictionary);
  return { ...config, plugins: [...(config.plugins ?? []), tokensPlugin({ styleDictionary, repositoryUrl: options.repositoryUrl, modes: options.modes, baseModeLabel: options.baseModeLabel })] };
};
