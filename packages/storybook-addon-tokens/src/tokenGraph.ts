import { getNodeAtPath, isAlias } from './resolveToken';
import { getTokensData, getTokensVersion } from './store';

/**
 * The token tree read as a graph: every token is a node, every `{alias}` in a
 * `$value` is an edge to the token it references. Each token references at
 * most one other (its `parent`), but any number can reference it (its
 * `children`), so walking up is always a single chain and walking down fans out.
 */
export type TokenNode = {
  token: string;
  /** The token this one's `$value` aliases, if any. */
  parent?: string;
  /** Tokens whose `$value` aliases this one, sorted by path. */
  children: string[];
};

let cache: { version: number; nodes: Map<string, TokenNode> } | undefined;

function getNodes(): Map<string, TokenNode> {
  if (cache?.version === getTokensVersion()) return cache.nodes;
  const nodes = new Map<string, TokenNode>();
  const visit = (node: unknown, path: string[]) => {
    if (typeof node !== 'object' || node === null || Array.isArray(node)) return;
    const record = node as Record<string, unknown>;
    if ('$value' in record) {
      const token = path.join('.');
      const value = record.$value;
      nodes.set(token, { token, children: [], parent: isAlias(value) ? value.slice(1, -1) : undefined });
      return;
    }
    for (const [key, value] of Object.entries(record)) {
      if (!key.startsWith('$')) visit(value, [...path, key]);
    }
  };
  visit(getTokensData().tokens, []);
  for (const node of nodes.values()) {
    if (node.parent) nodes.get(node.parent)?.children.push(node.token);
  }
  for (const node of nodes.values()) node.children.sort((a, b) => a.localeCompare(b));
  cache = { version: getTokensVersion(), nodes };
  return nodes;
}

export function getTokenNode(token: string): TokenNode | undefined {
  return getNodes().get(token);
}

/** The chain of tokens `token` aliases, root (a literal value) first, excluding `token` itself. */
export function getAncestors(token: string): string[] {
  const chain: string[] = [];
  let current = getNodes().get(token)?.parent;
  while (current && !chain.includes(current) && getNodeAtPath(current)) {
    chain.unshift(current);
    current = getNodes().get(current)?.parent;
  }
  return chain;
}

export { getTokenData } from './resolveToken';
