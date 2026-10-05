import { getActiveMode, getTokensData, type TokenRecord } from './store';

/** One mode's view of a token: its alias chain (root first) and resolved value. */
export type ModeView = { name: string; label: string; active: boolean; chain: string[]; value: unknown };

/**
 * Where a token's alias chains split between modes: the token that switches
 * (`switchToken`, aliasing something different per mode) and, per mode, the
 * chain above it, root first. Everything from `switchToken` down to the
 * selected token is the same in every mode.
 */
export type ModeFork = { switchToken: string; uppers: Array<Pick<ModeView, 'name' | 'label' | 'active' | 'value'> & { chain: string[] }> };

const chainOf = (records: TokenRecord[], path: string) => {
  const byPath = new Map(records.map((record) => [record.path, record]));
  const chain: string[] = [];
  for (let record = byPath.get(path); record; record = record.aliasOf ? byPath.get(record.aliasOf) : undefined) chain.unshift(record.path);
  return { chain, value: byPath.get(path)?.resolvedValue };
};

/** `path` as every mode resolves it, the base mode first. Empty when there are no modes. */
export function getModeViews(path: string): ModeView[] {
  const data = getTokensData();
  if (!data.modes?.length) return [];
  const active = getActiveMode()?.name;
  const sets = [{ name: '', label: data.baseLabel ?? 'Default', tokens: data.tokens }, ...data.modes];
  return sets.map((set) => ({ name: set.name, label: set.label, active: (active ?? '') === set.name, ...chainOf(set.tokens, path) }));
}

/** Where `path`'s alias chains split between modes, or undefined when every mode resolves it the same way. */
export function getModeFork(path: string): ModeFork | undefined {
  const views = getModeViews(path);
  if (views.length < 2) return undefined;
  const fromToken = views.map((view) => [...view.chain].reverse());
  if (fromToken.every((chain) => chain.join() === fromToken[0].join())) return undefined;
  // Walk up from the selected token while every mode agrees; the last shared token is the one that switches.
  let shared = 0;
  while (fromToken.every((chain) => chain[shared] !== undefined && chain[shared] === fromToken[0][shared])) shared += 1;
  if (shared === 0) return undefined;
  return {
    switchToken: fromToken[0][shared - 1],
    uppers: views.map((view, index) => ({ name: view.name, label: view.label, active: view.active, value: getModeValue(view, fromToken[index].slice(shared)), chain: fromToken[index].slice(shared).reverse() })),
  };
}

/** The literal value at the root of a mode's upper chain. */
function getModeValue(view: ModeView, upperFromToken: string[]): unknown {
  const root = upperFromToken.at(-1);
  if (!root) return view.value;
  const data = getTokensData();
  const set = view.name ? data.modes?.find((mode) => mode.name === view.name)?.tokens : data.tokens;
  return set?.find((record) => record.path === root)?.resolvedValue;
}
