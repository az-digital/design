import tokensDocument from '../../tokens/tokens.json';

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
