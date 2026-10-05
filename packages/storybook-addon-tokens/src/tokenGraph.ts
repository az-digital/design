import { getAllTokenItems, getTokenRecord } from './resolveToken';
import { getActiveTokens, getTokensVersion } from './store';

/**
 * The tokens read as a graph: every token is a node, and every alias Style
 * Dictionary found is an edge to the token it references. Each token
 * references at most one other (its `parent`), but any number can reference it
 * (its `children`), so walking up is always a single chain and walking down
 * fans out.
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
  const records = getActiveTokens();
  const nodes = new Map<string, TokenNode>(records.map((record) => [record.path, { token: record.path, parent: record.aliasOf, children: [] }]));
  // In path order, so each token's children come out sorted.
  for (const { token } of getAllTokenItems()) {
    const parent = nodes.get(token)?.parent;
    if (parent) nodes.get(parent)?.children.push(token);
  }
  cache = { version: getTokensVersion(), nodes };
  return nodes;
}

export function getTokenNode(token: string): TokenNode | undefined {
  return getNodes().get(token);
}

/** The chain of tokens `token` aliases, root (a literal value) first, excluding `token` itself. */
export function getAncestors(token: string): string[] {
  const chain: string[] = [];
  for (let parent = getTokenRecord(token)?.aliasOf; parent; parent = getTokenRecord(parent)?.aliasOf) chain.unshift(parent);
  return chain;
}

export { getTokenData } from './resolveToken';
