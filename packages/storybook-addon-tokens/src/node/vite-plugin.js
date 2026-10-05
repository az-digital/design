// Runs in Node (Storybook's server), never in the browser.
import { dirname, resolve } from 'node:path';
import { collectTokens } from './collect.js';

export const VIRTUAL_ID = 'virtual:az-design-tokens';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

const isGlob = (pattern) => /[*?{[]/.test(pattern);
/** The fixed directory a glob pattern starts from, e.g. `/a/tokens/**\/*.json` → `/a/tokens`. */
const globBase = (pattern) => {
  const parts = pattern.split('/');
  const firstGlob = parts.findIndex(isGlob);
  return parts.slice(0, firstGlob).join('/') || dirname(pattern);
};

/**
 * Serves the collected token data to the preview as `virtual:az-design-tokens`,
 * and re-collects it (then reloads the preview) whenever the Style Dictionary
 * config or one of its source files changes, so token edits show up without
 * restarting Storybook.
 */
export function tokensPlugin({ styleDictionary, repositoryUrl, modes, baseModeLabel }) {
  let collected;
  const collect = async () => {
    collected = await collectTokens(styleDictionary, { repositoryUrl, modes, baseModeLabel });
    return collected;
  };
  const isWatched = (file) =>
    collected?.watch.some((pattern) => (isGlob(pattern) ? resolve(file).startsWith(globBase(pattern)) && file.endsWith('.json') : resolve(file) === resolve(pattern)));

  return {
    name: 'az-design-tokens',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return undefined;
      const { data } = collected ?? (await collect());
      return `export default ${JSON.stringify(data)};`;
    },
    async configureServer(server) {
      await collect();
      // The config and token sources usually live outside Storybook's own
      // directory, so Vite doesn't watch them unless told to.
      server.watcher.add(collected.watch.map((pattern) => (isGlob(pattern) ? globBase(pattern) : pattern)));
      server.watcher.on('change', async (file) => {
        if (!isWatched(file)) return;
        await collect();
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
