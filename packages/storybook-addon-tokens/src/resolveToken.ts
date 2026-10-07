import { getTokensData, getTokensVersion, type TokenArtifact, type TokenRecord } from './store';

/** One design token, as the `Token` pill, tables, and details drawer render it. */
export type TokenData = {
  /** Dot-path in the token tree, e.g. `az.color.brand.red`. */
  token: string;
  /** Human-readable name. Defaults to the last path segment. */
  name?: string;
  /** DTCG `$type`, e.g. `color`, `dimension`, `number`. */
  type?: string;
  /** Resolved (alias-followed) value of a color token, exactly as the source file writes it. */
  hex?: string;
  /** Resolved (alias-followed) value of any token, exactly as the source file writes it. */
  value?: string;
  description?: string;
  /** The token's `$extensions`, e.g. CMYK or Pantone values for a brand color. */
  extensions?: Record<string, unknown>;
};

export type ResolvedLink = { path: string; type: string; value: unknown };

type Order = 'path' | 'source';

let cache: { version: number; byPath: Map<string, TokenRecord>; items: TokenData[]; sourceOrder: TokenData[] } | undefined;

function getIndex() {
  if (cache?.version === getTokensVersion()) return cache;
  const records = getTokensData().tokens;
  const sourceOrder = records.map(
    (record): TokenData => ({
      token: record.path,
      name: record.path.split('.').at(-1) ?? record.path,
      type: record.type,
      hex: record.type === 'color' && typeof record.resolvedValue === 'string' ? record.resolvedValue : undefined,
      value: formatTokenValue(record.resolvedValue),
      description: record.description,
      extensions: record.extensions,
    }),
  );
  const items = [...sourceOrder].sort((a, b) => a.token.localeCompare(b.token));
  cache = { version: getTokensVersion(), byPath: new Map(records.map((record) => [record.path, record])), items, sourceOrder };
  return cache;
}

/** One token as Style Dictionary read it, by path. */
export function getTokenRecord(path: string): TokenRecord | undefined {
  return getIndex().byPath.get(path);
}

/**
 * `path`, then each token it aliases in turn, down to the one with a literal
 * value. Style Dictionary has already rejected broken and circular references.
 */
export function resolveChain(path: string): ResolvedLink[] {
  const chain: ResolvedLink[] = [];
  for (let record = getTokenRecord(path); record; record = record.aliasOf ? getTokenRecord(record.aliasOf) : undefined) {
    chain.push({ path: record.path, type: record.type ?? 'unknown', value: record.value });
  }
  return chain;
}

/** The value Style Dictionary resolves `path` to, as the source file writes it. */
export function resolveValue(path: string): unknown {
  return getTokenRecord(path)?.resolvedValue;
}

/** A value for display, printed as the source file writes it (DTCG dimensions as `20px`). */
export function formatTokenValue(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
    return `${(value as { value: unknown }).value}${(value as { unit: unknown }).unit}`;
  }
  return typeof value === 'string' ? value : JSON.stringify(value) ?? String(value);
}

/** Every token, sorted by path, or with `order: 'source'` in the order the source file lists them. */
export function getAllTokenItems({ order = 'path' }: { order?: Order } = {}): TokenData[] {
  const { items, sourceOrder } = getIndex();
  return order === 'source' ? sourceOrder : items;
}

/**
 * `prefix` without its trailing `.` / `*` characters (`az.component.button.**`
 * → `az.component.button`). A loop rather than `replace(/[.*]+$/, '')`: that
 * regex backtracks quadratically on a long run of `.`/`*` that isn't at the
 * end, and prefixes come from whoever calls the package.
 */
function trimTrailingWildcards(prefix: string): string {
  let end = prefix.length;
  while (end > 0 && (prefix[end - 1] === '.' || prefix[end - 1] === '*')) end -= 1;
  return prefix.slice(0, end);
}

/**
 * Every token under `prefix` (a dot-path; a trailing `.`, `*`, or `**` is
 * ignored), sorted by path, or with `order: 'source'` in the source file's order.
 */
export function getTokenDisplayItems(prefix: string, { order = 'path' }: { order?: Order } = {}): TokenData[] {
  const base = trimTrailingWildcards(prefix);
  return getAllTokenItems({ order }).filter((item) => item.token === base || item.token.startsWith(`${base}.`));
}

/** `TokenData` for one token path. */
export function getTokenData(token: string): TokenData | undefined {
  return getAllTokenItems().find((item) => item.token === token);
}

/** Each output file's reference to (and derived value for) `token`, in Style Dictionary config order. */
export function getTokenArtifacts(token: string): Array<Omit<TokenArtifact, 'tokens'> & { reference: string; value?: string }> {
  return getTokensData().artifacts.flatMap(({ tokens, ...artifact }) => (tokens[token] ? [{ ...artifact, ...tokens[token] }] : []));
}
