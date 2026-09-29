import tokensDocument from '../../tokens/tokens.json';
import type { TokenDisplayItem } from './TokenDisplay';

export type TokenNode = {
  $type?: string;
  $value?: unknown;
  $description?: string;
};

export type ResolvedLink = {
  path: string;
  type: string;
  value: unknown;
};

const ALIAS_PATTERN = /^\{(.+)\}$/;
const MAX_CHAIN_LENGTH = 10;

export function isAlias(value: unknown): value is string {
  return typeof value === 'string' && ALIAS_PATTERN.test(value);
}

function getNodeAtPath(path: string): TokenNode | undefined {
  const segments = path.split('.');
  let node: unknown = tokensDocument;
  for (const segment of segments) {
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

/** Resolves `path` all the way down to its final, literal (non-alias) value. */
export function resolveValue(path: string): unknown {
  const chain = resolveChain(path);
  return chain.length > 0 ? chain[chain.length - 1].value : undefined;
}

function formatTokenValue(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
    const dimension = value as { value: unknown; unit: unknown };
    return `${dimension.value}${dimension.unit}`;
  }
  return JSON.stringify(value) ?? String(value);
}

export function getTokenDisplayItems(prefix: string): TokenDisplayItem[] {
  const items: TokenDisplayItem[] = [];
  const descendantPrefix = prefix.endsWith('.') ? prefix : `${prefix}.`;

  function visit(node: unknown, path: string[]): void {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) return;
    const token = node as TokenNode;
    const tokenPath = path.join('.');

    if ('$value' in token) {
      if (tokenPath !== prefix && !tokenPath.startsWith(descendantPrefix)) return;
      const chain = resolveChain(tokenPath);
      const resolvedValue = chain.at(-1)?.value;
      const value = formatTokenValue(resolvedValue);
      items.push({
        name: path.at(-1) ?? tokenPath,
        token: tokenPath,
        type: token.$type ?? 'unknown',
        value,
        sourceValue: formatTokenValue(token.$value),
        cssVar: `--${tokenPath.replaceAll('.', '-')}`,
        hex: token.$type === 'color' && typeof resolvedValue === 'string' ? resolvedValue : undefined,
        description: token.$description,
        aliasChain: chain.map((link) => ({ token: link.path, value: formatTokenValue(link.value) })),
      });
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (!key.startsWith('$')) visit(value, [...path, key]);
    }
  }

  visit(tokensDocument.az, ['az']);
  return items.sort((a, b) => a.token.localeCompare(b.token));
}
