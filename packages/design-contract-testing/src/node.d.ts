import type { ContractData } from './browser.js';

export type LoadedContracts = {
  data: ContractData;
  manifest: Record<string, unknown>;
  /** The contents of `@az-digital/tokens/dist/tokens.css`. */
  tokens: string;
  versions: { contracts: string; tokens: string };
};

export function loadContracts(options?: { from?: string }): LoadedContracts;
