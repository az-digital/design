export type JsonObject = Record<string, unknown>;

export type TokenRecord = {
  name: string;
  path: string;
  value: unknown;
  type?: string;
  description?: string;
  extensions?: JsonObject;
  aliasOf?: string;
  category: string;
};

export type TokenCategory = {
  name: string;
  tokens: TokenRecord[];
};

const ORDERED_CATEGORIES = [
  'color',
  'typography',
  'shadow',
  'radius',
  'gradient',
  'form',
  'focus',
];

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function tokenValue(node: JsonObject): unknown {
  if ('$value' in node) {
    return node.$value;
  }
  if ('value' in node) {
    return node.value;
  }
  return undefined;
}

function tokenType(node: JsonObject): string | undefined {
  if (typeof node.$type === 'string') {
    return node.$type;
  }
  if (typeof node.type === 'string') {
    return node.type;
  }
  return undefined;
}

function isTokenLeaf(node: JsonObject): boolean {
  return '$value' in node || 'value' in node;
}

function aliasFromValue(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  const isAlias = trimmed.startsWith('{') && trimmed.endsWith('}');
  return isAlias ? trimmed.slice(1, -1) : undefined;
}

function categoryFor(pathSegments: string[], type?: string): string {
  const segmentMatch = pathSegments.find((segment) => ORDERED_CATEGORIES.includes(segment));
  if (segmentMatch) {
    return segmentMatch;
  }

  if (type === 'color') {
    return 'color';
  }
  if (type === 'typography') {
    return 'typography';
  }
  if (type === 'shadow') {
    return 'shadow';
  }
  if (type === 'borderRadius') {
    return 'radius';
  }
  if (type === 'gradient') {
    return 'gradient';
  }

  return pathSegments[0] ?? 'uncategorized';
}

function groupForPath(pathSegments: string[]): string {
  if (pathSegments.length <= 1) {
    return pathSegments[0] ?? 'uncategorized';
  }

  return pathSegments.slice(0, -1).join('.');
}

function flattenTokens(node: JsonObject, path: string[] = []): TokenRecord[] {
  if (isTokenLeaf(node)) {
    const value = tokenValue(node);
    const type = tokenType(node);
    const joinedPath = path.join('.');
    return [
      {
        name: path[path.length - 1] ?? joinedPath,
        path: joinedPath,
        value,
        type,
        description: typeof node.$description === 'string' ? node.$description : undefined,
        extensions: isObject(node.$extensions) ? node.$extensions : undefined,
        aliasOf: aliasFromValue(value),
        category: categoryFor(path, type),
      },
    ];
  }

  const tokens: TokenRecord[] = [];
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) {
      continue;
    }
    if (!isObject(value)) {
      continue;
    }
    tokens.push(...flattenTokens(value, [...path, key]));
  }

  return tokens;
}

export function buildTokenCatalog(tokenDocument: JsonObject): TokenCategory[] {
  const allTokens = flattenTokens(tokenDocument).sort((a, b) => a.path.localeCompare(b.path));
  const byGroup = new Map<string, TokenRecord[]>();

  for (const token of allTokens) {
    const groupName = groupForPath(token.path.split('.'));
    const existing = byGroup.get(groupName) ?? [];
    existing.push(token);
    byGroup.set(groupName, existing);
  }

  const groupNames = [...byGroup.keys()].sort((a, b) => {
    const aRoot = a.split('.')[0] ?? a;
    const bRoot = b.split('.')[0] ?? b;
    const aIndex = ORDERED_CATEGORIES.indexOf(aRoot);
    const bIndex = ORDERED_CATEGORIES.indexOf(bRoot);
    const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
    const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
    if (normalizedA !== normalizedB) {
      return normalizedA - normalizedB;
    }
    return a.localeCompare(b);
  });

  return groupNames.map((name) => ({
    name,
    tokens: (byGroup.get(name) ?? []).sort((a, b) => a.path.localeCompare(b.path)),
  }));
}