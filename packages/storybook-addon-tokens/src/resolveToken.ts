import { getTokensData, getTokensVersion, type TokenArtifact } from './store';

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

export type TokenNode = {
  $type?: string;
  $value?: unknown;
  $description?: string;
  $extensions?: Record<string, unknown>;
};

export type ResolvedLink = { path: string; type: string; value: unknown };

const ALIAS_PATTERN = /^\{(.+)\}$/;
const MAX_CHAIN_LENGTH = 10;

export function isAlias(value: unknown): value is string {
  return typeof value === 'string' && ALIAS_PATTERN.test(value);
}

export function getNodeAtPath(path: string): TokenNode | undefined {
  let node: unknown = getTokensData().tokens;
  for (const segment of path.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[segment];
  }
  return node as TokenNode | undefined;
}

/** Follows `$value: "{other.path}"` alias references to their final, literal value. */
export function resolveChain(path: string): ResolvedLink[] {
  const chain: ResolvedLink[] = [];
  let currentPath = path;
  for (let i = 0; i < MAX_CHAIN_LENGTH; i++) {
    const node = getNodeAtPath(currentPath);
    if (!node || node.$value === undefined) break;
    chain.push({ path: currentPath, type: node.$type ?? 'unknown', value: node.$value });
    const aliasMatch = typeof node.$value === 'string' ? node.$value.match(ALIAS_PATTERN) : null;
    if (!aliasMatch) break;
    currentPath = aliasMatch[1];
  }
  return chain;
}

/** Resolves `path` all the way down to its final, literal (non-alias) value, as the source file writes it. */
export function resolveValue(path: string): unknown {
  const chain = resolveChain(path);
  return chain.length > 0 ? chain[chain.length - 1].value : undefined;
}

/** A value for display, printed as the source file writes it (DTCG dimensions as `20px`). */
export function formatTokenValue(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
    return `${(value as { value: unknown }).value}${(value as { unit: unknown }).unit}`;
  }
  return typeof value === 'string' ? value : JSON.stringify(value) ?? String(value);
}

let cache: { version: number; items: TokenData[]; sourceOrder: TokenData[] } | undefined;

type Order = 'path' | 'source';

/** Every token in the tree, sorted by path, or with `order: 'source'` in the order the source file lists them. */
export function getAllTokenItems({ order = 'path' }: { order?: Order } = {}): TokenData[] {
  if (cache?.version === getTokensVersion()) return order === 'source' ? cache.sourceOrder : cache.items;
  const items: TokenData[] = [];
  const visit = (node: unknown, path: string[]) => {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) return;
    const token = node as TokenNode;
    if ('$value' in token) {
      const tokenPath = path.join('.');
      const resolvedValue = resolveValue(tokenPath);
      items.push({
        token: tokenPath,
        name: path.at(-1) ?? tokenPath,
        type: token.$type,
        hex: token.$type === 'color' && typeof resolvedValue === 'string' ? resolvedValue : undefined,
        value: formatTokenValue(resolvedValue),
        description: token.$description,
        extensions: token.$extensions,
      });
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (!key.startsWith('$')) visit(value, [...path, key]);
    }
  };
  visit(getTokensData().tokens, []);
  const sourceOrder = [...items];
  items.sort((a, b) => a.token.localeCompare(b.token));
  cache = { version: getTokensVersion(), items, sourceOrder };
  return order === 'source' ? sourceOrder : items;
}

/**
 * Every token under `prefix` (a dot-path; a trailing `.`, `*`, or `**` is
 * ignored), sorted by path, or with `order: 'source'` in the source file's order.
 */
export function getTokenDisplayItems(prefix: string, { order = 'path' }: { order?: Order } = {}): TokenData[] {
  const base = prefix.replace(/[.*]+$/, '');
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
