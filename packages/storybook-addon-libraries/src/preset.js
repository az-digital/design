// Storybook preset: runs in Node when Storybook starts or builds.
// Storybook also loads this package's `./manager` export (the Library toolbar)
// and `./preview` export (the `library` global, rendering and Code panel
// source) on its own, so they aren't registered here.
import { dirname } from 'node:path';

/**
 * Adds the Vite plugin that discovers component libraries and serves them to
 * the preview. Options (from this addon's entry in `main.ts`), all optional:
 * - `order`: library keys in toolbar order; unlisted libraries follow by title.
 * - `default`: the key selected when Storybook opens; the first library otherwise.
 * - `disable`: keys of discovered libraries this Storybook leaves out.
 * - `overrides`: manifest fields to replace in this Storybook, by key,
 *   e.g. `{ web: { title: 'Custom elements' } }`.
 */
export const viteFinal = async (config, options) => {
  const { librariesPlugin } = await import('./node/vite-plugin.js');
  const { order, default: defaultKey, disable, overrides } = options;
  const plugin = librariesPlugin({ projectDir: dirname(options.configDir), options: { order, default: defaultKey, disable, overrides } });
  return { ...config, plugins: [...(config.plugins ?? []), plugin] };
};
