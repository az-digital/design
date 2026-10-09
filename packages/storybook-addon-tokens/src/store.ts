import { useSyncExternalStore } from 'react';

/** One token, as Style Dictionary reads it from your source files. */
export type TokenRecord = {
  /** Dot-path in the token tree, e.g. `az.color.brand.red`. */
  path: string;
  /** DTCG `$type`, e.g. `color`, `dimension`, `number`. */
  type?: string;
  description?: string;
  /** The token's `$extensions`, e.g. CMYK or Pantone values for a brand color. */
  extensions?: Record<string, unknown>;
  /** The token's value exactly as the source file writes it: a literal, or an `{alias}`. */
  value: unknown;
  /** The value Style Dictionary resolves every alias to, as the source file writes it (no platform transforms). */
  resolvedValue: unknown;
  /** The token this one's value aliases, when the whole value is one reference. */
  aliasOf?: string;
};

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
  /** Every token, in the order your source files list them. */
  tokens: TokenRecord[];
  /** The Style Dictionary config's `source` files, relative to the repository root. */
  sourceFiles: Array<{ path: string; url?: string }>;
  artifacts: TokenArtifact[];
};

const EMPTY: TokensData = { tokens: [], sourceFiles: [], artifacts: [] };

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
