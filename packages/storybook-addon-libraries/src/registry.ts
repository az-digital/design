// Preview-only: the libraries this addon's Vite plugin discovered.
// @ts-expect-error -- served at build time by this addon's Vite plugin (src/node/vite-plugin.js); it has no file on disk to type.
import { defaultLibrary as discoveredDefault, libraries as discovered } from 'virtual:az-design-libraries';
import { TAG_PREFIX } from './constants';
import type { Library } from './types';

export const libraries = discovered as Library[];
export const defaultLibrary = discoveredDefault as string | undefined;

export const getLibrary = (key: unknown) => libraries.find((library) => library.key === key);

/** Library keys a story's tags name (`lib:html` → `html`), or `undefined` when it names none. */
export function taggedLibraries(tags: readonly string[] = []) {
  const keys = tags.filter((tag) => tag.startsWith(TAG_PREFIX)).map((tag) => tag.slice(TAG_PREFIX.length));
  return keys.length > 0 ? keys : undefined;
}
