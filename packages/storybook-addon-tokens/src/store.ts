import { useSyncExternalStore } from 'react';

/** A DTCG token group or token, as the source file writes it. */
export type TokenTree = Record<string, unknown>;

/** One output file from one Style Dictionary platform, and how each token appears in it. */
export type TokenArtifact = {
  /** Platform name from your Style Dictionary config, e.g. `css`. */
  platform: string;
  /** Style Dictionary format, e.g. `css/variables`. */
  format: string;
  /** Output file path, relative to the repository root. */
  path: string;
  /** Link to the file, when the addon has a `repositoryUrl`. */
  url?: string;
  /** Per token path: how to reference it in this file, and the value this file derives for it (if the format writes one). */
  tokens: Record<string, { reference: string; value?: string }>;
};

/** Everything the addon knows, collected from your Style Dictionary config when Storybook starts. */
export type TokensData = {
  /** The source token tree, exactly as your source files write it. */
  tokens: TokenTree;
  /** The Style Dictionary config's `source` files, relative to the repository root. */
  sourceFiles: Array<{ path: string; url?: string }>;
  artifacts: TokenArtifact[];
};

const EMPTY: TokensData = { tokens: {}, sourceFiles: [], artifacts: [] };

let current: TokensData = EMPTY;
let version = 0;
const listeners = new Set<() => void>();

/**
 * One copy of the token data per JavaScript context. The preview sets it from
 * the build-time data; the manager (the Tokens tab) from what the preview
 * sends it over Storybook's channel.
 */
export function setTokensData(data: TokensData) {
  current = data;
  version += 1;
  listeners.forEach((listener) => listener());
}

export function getTokensData(): TokensData {
  return current;
}

/** Changes every time the data does, for caches derived from it. */
export function getTokensVersion(): number {
  return version;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Re-renders when the token data changes (e.g. when the Tokens tab first receives it). */
export function useTokensData(): TokensData {
  return useSyncExternalStore(subscribe, getTokensData, getTokensData);
}
