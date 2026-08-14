import type { Meta, StoryObj } from '@storybook/html-vite';
import tokensDocument from '../../tokens/tokens.json';

type TokenNode = {
  $type?: string;
  $value?: unknown;
  path?: string[];
  key?: string;
  original?: {
    $value?: unknown;
  };
};

type FlatToken = {
  path: string[]; 
  pathDot: string;
  name: string;
  type: string;
  value: unknown;
  aliasOf?: string;
};

type TokensShape = {
  [key: string]: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTokenNode(value: unknown): value is TokenNode {
  return isObject(value) && '$value' in value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toHexFromSrgb(components: unknown): string | undefined {
  if (!Array.isArray(components) || components.length < 3) {
    return undefined;
  }
  const rgb = components.slice(0, 3).map((n) => {
    if (typeof n !== 'number' || Number.isNaN(n)) {
      return undefined;
    }
    const clamped = Math.max(0, Math.min(1, n));
    const v = Math.round(clamped * 255);
    return v.toString(16).padStart(2, '0');
  });
  if (rgb.some((n) => typeof n !== 'string')) {
    return undefined;
  }
  return `#${rgb.join('')}`;
}

function inferType(token: TokenNode, path: string[]): string {
  if (typeof token.$type === 'string') {
    return token.$type;
  }

  if (isObject(token.$value) && typeof token.$value.colorSpace === 'string') {
    return 'color';
  }

  const lowerPath = path.join('.').toLowerCase();
  if (lowerPath.includes('color')) {
    return 'color';
  }
  if (lowerPath.includes('shadow')) {
    return 'shadow';
  }
  if (lowerPath.includes('radius')) {
    return 'borderRadius';
  }
  if (lowerPath.includes('font')) {
    return 'fontFamily';
  }
  if (lowerPath.includes('size') || lowerPath.includes('spacing')) {
    return 'dimension';
  }

  return 'unknown';
}

function flattenTokens(node: unknown, currentPath: string[] = []): FlatToken[] {
  if (!isObject(node)) {
    return [];
  }

  if (isTokenNode(node)) {
    const path = Array.isArray(node.path) && node.path.length > 0 ? node.path : currentPath;
    const rawAlias = node.original?.$value;
    const aliasOf =
      typeof rawAlias === 'string' && rawAlias.startsWith('{') && rawAlias.endsWith('}')
        ? rawAlias.slice(1, -1)
        : undefined;

    return [
      {
        path,
        pathDot: path.join('.'),
        name: path[path.length - 1] ?? 'token',
        type: inferType(node, path),
        value: node.$value,
        aliasOf,
      },
    ];
  }

  return Object.entries(node)
    .filter(([key]) => !key.startsWith('$'))
    .flatMap(([key, value]) => flattenTokens(value, [...currentPath, key]));
}

const allTokens = flattenTokens(tokensDocument as TokensShape)
  .sort((a, b) => a.pathDot.localeCompare(b.pathDot));

const meta: Meta = {
  title: 'Tokens',
  tags: ['!autodocs'],
  parameters: {
    docs: {
      disable: true,
    },
  },
};

export default meta;
type Story = StoryObj;

function colorDetails(token: FlatToken): {
  hex: string;
  colorSpace?: string;
  components?: string;
} {
  if (typeof token.value === 'string') {
    return { hex: token.value };
  }

  if (isObject(token.value)) {
    const hex =
      typeof token.value.hex === 'string'
        ? token.value.hex
        : token.value.colorSpace === 'srgb'
          ? toHexFromSrgb(token.value.components)
          : undefined;
    const colorSpace = typeof token.value.colorSpace === 'string' ? token.value.colorSpace : undefined;
    const components = Array.isArray(token.value.components)
      ? token.value.components.map((v) => String(v)).join(', ')
      : undefined;

    return {
      hex: hex ?? '#cccccc',
      colorSpace,
      components,
    };
  }

  return { hex: '#cccccc' };
}

function rgbFromHex(hex: string): string | undefined {
  const normalized = hex.trim();
  const match = /^#?([a-fA-F0-9]{6})$/.exec(normalized);
  if (!match) {
    return undefined;
  }
  const raw = match[1];
  const r = Number.parseInt(raw.slice(0, 2), 16);
  const g = Number.parseInt(raw.slice(2, 4), 16);
  const b = Number.parseInt(raw.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function formatValueList(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(', ');
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

function renderTokenLabel(token: FlatToken): string {
  const label = token.pathDot;

  return `
    <div style="display:flex;align-items:center;flex-wrap:wrap;margin:0;">
      <span style="color:#1a2333;font:400 28px/1.1 'Georgia', 'Times New Roman', serif;letter-spacing:-0.04em;line-height:1;">${escapeHtml(label)}</span>
    </div>
  `;
}

function colorSwatchCard(token: FlatToken): string {
  const details = colorDetails(token);
  const valueObj = isObject(token.value) ? token.value : undefined;
  const rgb =
    formatValueList(valueObj?.rgb) ??
    (valueObj?.colorSpace === 'srgb' ? formatValueList(valueObj?.components?.slice?.(0, 3)) : undefined) ??
    rgbFromHex(details.hex) ??
    'n/a';
  const cmyk = formatValueList(valueObj?.cmyk);
  const pantone =
    (typeof valueObj?.pantone === 'string' && valueObj.pantone) ||
    (typeof valueObj?.Pantone === 'string' && valueObj.Pantone) ||
    undefined;
  const aliasBadge = token.aliasOf
    ? '<span style="position:absolute;top:16px;right:16px;width:20px;height:20px;border-radius:4px;background:#000;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.18);padding:2px;box-sizing:border-box;margin:0;"></span>'
    : '<span style="position:absolute;top:16px;right:16px;width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid #000;box-shadow:0 0 0 1px rgba(0,0,0,0.12);padding:2px;box-sizing:border-box;margin:0;"></span>';

  const valueRows: Array<[string, string]> = [
    ['HEX', details.hex.toUpperCase()],
    ['RGB', rgb],
  ];
  if (cmyk) {
    valueRows.push(['CMYK', cmyk]);
  }
  if (pantone) {
    valueRows.push(['PANTONE', pantone]);
  }

  const valueBlock = valueRows
    .map(
      ([label, value]) => `
        <div style="display:grid;grid-template-columns:74px minmax(0,1fr);gap:8px;align-items:start;">
          <dt style="margin:0;color:#5d6b7d;font:700 10px/1.4 'Helvetica Neue', Helvetica, Arial, sans-serif;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(label)}</dt>
          <dd style="margin:0;color:#1d2d3d;font:600 15px/1.45 'Helvetica Neue', Helvetica, Arial, sans-serif;word-break:break-word;">${escapeHtml(value)}</dd>
        </div>
      `,
    )
    .join('');

  return `
    <article style="display:grid;gap:14px;background:#fff;border:1px solid #d7dce3;border-radius:12px;padding:12px;position:relative;">
      ${aliasBadge}
      <div style="height:170px;border:1px solid #e4e7ec;border-radius:8px;background:${escapeHtml(details.hex)};"></div>
      <div style="display:grid;gap:10px;">
        ${renderTokenLabel(token)}
        <dl style="margin:0;border:1px solid #d9dde5;border-radius:10px;padding:10px 12px;display:grid;gap:6px;background:transparent;">
          ${valueBlock}
        </dl>
      </div>
    </article>
  `;
}

function groupColorTokens(tokens: FlatToken[]): Array<{ key: string; label: string; tokens: FlatToken[] }> {
  const groups = new Map<string, { key: string; label: string; tokens: FlatToken[] }>();

  for (const token of tokens) {
    const parentPath = token.path.length > 1 ? token.path.slice(0, -1) : [];
    const groupKey = parentPath.length > 0 ? parentPath.join('.') : 'color';
    const groupLabel = parentPath.length > 0 ? parentPath[parentPath.length - 1] : 'Color';

    if (!groups.has(groupKey)) {
      groups.set(groupKey, { key: groupKey, label: groupLabel, tokens: [] });
    }

    groups.get(groupKey)?.tokens.push(token);
  }

  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function renderReferenceLegend(): string {
  return `
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;min-height:32px;border:2px dashed #58aaf1;border-radius:12px;padding:6px 12px;background:rgba(88,170,241,0.04);margin:0;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid #000;"></span>
        <span style="font:400 15px/1.1 'Georgia', 'Times New Roman', serif;color:#1a2333;letter-spacing:-0.02em;">base</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:12px;height:12px;border-radius:4px;background:#000;border:2px solid #fff;"></span>
        <span style="font:400 15px/1.1 'Georgia', 'Times New Roman', serif;color:#1a2333;letter-spacing:-0.02em;">reference</span>
      </div>
    </div>
  `;
}

export const Color: Story = {
  render: () => {
    const colorTokens = allTokens
      .filter((token) => token.type === 'color')
      .sort((a, b) => a.pathDot.localeCompare(b.pathDot));
    const groupedTokens = groupColorTokens(colorTokens);
    const sections = groupedTokens
      .map(({ key, label, tokens }) => {
        const cards = tokens.map((token) => colorSwatchCard(token)).join('');
        const heading = key === 'color' ? '' : `<h2 style="margin:0;color:#1f2937;font:700 18px/1.2 'Helvetica Neue', Helvetica, Arial, sans-serif;">${escapeHtml(label)}</h2>`;

        return `
          <section style="display:grid;gap:12px;">
            ${heading}
            <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));align-items:start;">${cards}</div>
          </section>
        `;
      })
      .join('');

    return `
      <main style="font-family:'proxima-nova', 'Helvetica Neue', Helvetica, Arial, sans-serif;padding:28px;max-width:1100px;margin:0 auto;color:#111;background:#f5f7fb;">
        ${renderReferenceLegend()}
        <section style="display:grid;gap:18px;">${sections}</section>
      </main>
    `;
  },
};

export const SourceFile: Story = {
  name: 'Downloads',
  render: () => {
    const githubUrl = 'https://github.com/az-digital/design/blob/main/packages/tokens/tokens.json';
    const rawUrl = 'https://raw.githubusercontent.com/az-digital/design/main/packages/tokens/tokens.json';
    const tokenCount = allTokens.length;
    const colorCount = allTokens.filter((token) => token.type === 'color').length;

    return `
      <main style="font-family:Georgia, 'Times New Roman', Times, serif;padding:28px;max-width:980px;margin:0 auto;color:#111;background:#f5f7fb;">
        <header style="margin-bottom:14px;">
          <h1 style="margin:0;font:700 44px/1.08 Georgia, 'Times New Roman', Times, serif;color:#1a2235;">Token File</h1>
        </header>
        <p style="margin:0 0 18px;color:#3e4a61;font:500 16px/1.55 Georgia, 'Times New Roman', Times, serif;">
          Main source-of-truth file for this token set. Treat this like a product artifact: view it, download it, and integrate from a stable URL.
        </p>

        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:0 0 18px;">
          <div style="background:#fff;border:1px solid #d7dce3;border-radius:10px;padding:12px;">
            <p style="margin:0;color:#667085;font:600 12px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">TOKENS</p>
            <p style="margin:8px 0 0;color:#1f2f4a;font:700 28px/1 Georgia, 'Times New Roman', Times, serif;">${tokenCount}</p>
          </div>
          <div style="background:#fff;border:1px solid #d7dce3;border-radius:10px;padding:12px;">
            <p style="margin:0;color:#667085;font:600 12px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">COLORS</p>
            <p style="margin:8px 0 0;color:#1f2f4a;font:700 28px/1 Georgia, 'Times New Roman', Times, serif;">${colorCount}</p>
          </div>
          <div style="background:#fff;border:1px solid #d7dce3;border-radius:10px;padding:12px;">
            <p style="margin:0;color:#667085;font:600 12px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">FORMAT</p>
            <p style="margin:8px 0 0;color:#1f2f4a;font:700 22px/1 Georgia, 'Times New Roman', Times, serif;">JSON</p>
          </div>
        </section>

        <section style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
          <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#1f56b1;color:#fff;text-decoration:none;border-radius:8px;padding:10px 14px;font:600 13px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">View on GitHub</a>
          <a href="${rawUrl}" download="tokens.json" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#0e7490;color:#fff;text-decoration:none;border-radius:8px;padding:10px 14px;font:600 13px/1.2 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Download raw JSON</a>
        </section>

        <section style="background:#fff;border:1px solid #d7dce3;border-radius:10px;padding:12px;display:grid;gap:8px;">
          <h2 style="margin:0;color:#1f2f4a;font:700 24px/1.15 Georgia, 'Times New Roman', Times, serif;">Integration</h2>
          <p style="margin:0;color:#45556f;font:500 13px/1.45 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Raw URL</p>
          <p style="margin:0;color:#1f56b1;font:600 13px/1.45 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;word-break:break-all;">${rawUrl}</p>
          <p style="margin:8px 0 0;color:#45556f;font:500 13px/1.45 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">GitHub path</p>
          <p style="margin:0;color:#45556f;font:600 13px/1.45 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">packages/tokens/tokens.json</p>
        </section>
      </main>
    `;
  },
};

export const __namedExportsOrder = ['SourceFile', 'Color'];