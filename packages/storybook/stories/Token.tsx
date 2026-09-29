// Default React import: this file is also bundled into the manager (the Tokens addon panel), which uses the classic JSX runtime.
import React, { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { getAncestors, getTokenData, getTokenNode } from './tokenGraph';

/** One design token, as the `Token` pill and its details drawer render it. */
export type TokenData = {
  /** Dot-path in tokens.json, e.g. `az.color.brand.red`. */
  token: string;
  /** Human-readable name, e.g. `Red`. Defaults to the last path segment. */
  name?: string;
  /** Resolved (alias-followed) hex, for color tokens. */
  hex?: string;
  /** Resolved (alias-followed) value, for non-color tokens. */
  value?: string;
  /** DTCG `$type` from tokens.json, e.g. `color`, `dimension`, `number`. */
  type?: string;
  /** Generated CSS custom property reference, e.g. `var(--az-color-brand-red)`. */
  cssVar: string;
  sassVar?: string;
  sourceFileUrl?: string;
  cssFileUrl?: string;
  scssFileUrl?: string;
  jsFileUrl?: string;
  dtsFileUrl?: string;
};

const PILL_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  width: 'fit-content',
  maxWidth: '100%',
  minHeight: 30,
  boxSizing: 'border-box',
  padding: '4px 10px 4px 14px',
  border: 0,
  borderRadius: 999,
  cursor: 'pointer',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10,
  fontWeight: 500,
  textAlign: 'left',
};

/**
 * Interaction states for the pill. Inline styles can't express :hover or
 * :focus-visible, so these live in one small stylesheet, injected once into
 * whichever document renders a pill (the preview iframe or the manager, for
 * the Tokens addon panel).
 */
const PILL_CSS = `
.az-token-pill { background: #302d34; color: #f8f5ff; transition: background-color 120ms ease; }
.az-token-pill:hover { background: #4a4552; }
.az-token-pill:focus-visible { outline: 2px solid #1e5288; outline-offset: 2px; }
.az-token-pill[aria-pressed='true'] { background: #1e5288; color: #fff; }
.az-token-pill[aria-pressed='true']:hover { background: #245f9c; }
.az-token-pill__chevron { opacity: 0.55; transition: opacity 120ms ease, transform 120ms ease; }
.az-token-pill:hover .az-token-pill__chevron,
.az-token-pill:focus-visible .az-token-pill__chevron,
.az-token-pill[aria-pressed='true'] .az-token-pill__chevron { opacity: 1; transform: translateX(2px); }
`;

function ensurePillStyles() {
  if (typeof document === 'undefined' || document.getElementById('az-token-pill-styles')) return;
  const element = document.createElement('style');
  element.id = 'az-token-pill-styles';
  element.textContent = PILL_CSS;
  document.head.appendChild(element);
}

const DOT_STYLE: CSSProperties = {
  width: 12,
  height: 12,
  flex: '0 0 auto',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.35)',
};

const SECTION_LABEL: CSSProperties = { marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' };
const FIELD: CSSProperties = { padding: '10px 12px', borderRadius: 6, background: '#f1f4f7' };
const CODE: CSSProperties = { fontSize: 13, overflowWrap: 'anywhere' };
const LINK: CSSProperties = { color: '#1d65a6' };

function FieldValue({ value, href }: { value: string; href?: string }) {
  const code = <code style={CODE}>{value}</code>;
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" style={LINK}>{code}</a> : code;
}

/** How many siblings/children a tree level shows before collapsing the rest behind "Show N more". */
const TREE_LEVEL_LIMIT = 6;
const TREE_ROW_HEIGHT = 36;
const TREE_LINE = '1px solid #b8c1cc';

type TreeRow = { token: string; guides: Array<'pipe' | 'blank'>; branch?: 'tee' | 'elbow' } | { more: number; key: string; guides: Array<'pipe' | 'blank'>; onExpand: () => void };

/** One 20px column of tree connector: a vertical guide line, a branch into this row, or nothing. */
function TreeGuide({ kind }: { kind: 'pipe' | 'blank' | 'tee' | 'elbow' }) {
  return (
    <span aria-hidden="true" style={{ position: 'relative', width: 20, flex: '0 0 20px', alignSelf: 'stretch' }}>
      {kind !== 'blank' && <span style={{ position: 'absolute', left: 9, top: 0, height: kind === 'elbow' ? '50%' : '100%', borderLeft: TREE_LINE }} />}
      {(kind === 'tee' || kind === 'elbow') && <span style={{ position: 'absolute', left: 9, top: '50%', width: 11, borderTop: TREE_LINE }} />}
    </span>
  );
}

/**
 * The token's place in the alias graph, drawn as a vertical tree: the chain of
 * tokens its value comes from (root = the literal value), the other tokens
 * that share its direct parent, and the tokens that alias it in turn. Clicking
 * a node calls `onNavigate` with that token.
 */
function TokenAliasTree({ token, onNavigate }: { token: string; onNavigate: (token: string) => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const ancestors = getAncestors(token);
  const parent = ancestors.at(-1);
  const siblings = parent ? getTokenNode(parent)?.children ?? [token] : [token];
  const children = getTokenNode(token)?.children ?? [];

  const limited = (key: string, list: string[]) => {
    if (expanded[key] || list.length <= TREE_LEVEL_LIMIT) return { shown: list, hidden: 0 };
    // Always keep the selected token visible, even past the limit.
    const shown = list.slice(0, TREE_LEVEL_LIMIT);
    if (list.includes(token) && !shown.includes(token)) shown[shown.length - 1] = token;
    return { shown, hidden: list.length - shown.length };
  };

  const rows: TreeRow[] = [];
  // Single chain down from the root to the direct parent.
  ancestors.forEach((ancestor, depth) => {
    rows.push({ token: ancestor, guides: Array(Math.max(depth - 1, 0)).fill('blank'), branch: depth > 0 ? 'elbow' : undefined });
  });
  // The parent's children (the selected token and its siblings), with the selected token's own children nested under it.
  const siblingDepth = ancestors.length;
  const siblingGuides: Array<'pipe' | 'blank'> = Array(Math.max(siblingDepth - 1, 0)).fill('blank');
  const { shown: shownSiblings, hidden: hiddenSiblings } = limited('siblings', siblings);
  shownSiblings.forEach((sibling, index) => {
    const isLast = index === shownSiblings.length - 1 && hiddenSiblings === 0;
    rows.push({ token: sibling, guides: siblingGuides, branch: siblingDepth > 0 ? (isLast ? 'elbow' : 'tee') : undefined });
    if (sibling !== token) return;
    const childGuides: Array<'pipe' | 'blank'> = siblingDepth > 0 ? [...siblingGuides, isLast ? 'blank' : 'pipe'] : [];
    const { shown: shownChildren, hidden: hiddenChildren } = limited('children', children);
    shownChildren.forEach((child, childIndex) => {
      rows.push({ token: child, guides: childGuides, branch: childIndex === shownChildren.length - 1 && hiddenChildren === 0 ? 'elbow' : 'tee' });
    });
    if (hiddenChildren > 0) rows.push({ more: hiddenChildren, key: 'children', guides: [...childGuides], onExpand: () => setExpanded((current) => ({ ...current, children: true })) });
  });
  if (hiddenSiblings > 0) rows.push({ more: hiddenSiblings, key: 'siblings', guides: siblingGuides, onExpand: () => setExpanded((current) => ({ ...current, siblings: true })) });

  const rootValue = getTokenData(ancestors[0] ?? token);

  return (
    <div role="tree" aria-label={`Alias tree for ${token}`} style={{ overflowX: 'auto' }}>
      {rows.map((row) => {
        if ('more' in row) {
          return (
            <div key={`more-${row.key}`} style={{ display: 'flex', height: TREE_ROW_HEIGHT }}>
              {row.guides.map((guide, index) => <TreeGuide key={index} kind={guide} />)}
              <TreeGuide kind="elbow" />
              <button type="button" onClick={row.onExpand} style={{ alignSelf: 'center', border: 0, background: 'none', padding: '0 4px', color: '#1d65a6', cursor: 'pointer', fontSize: 12 }}>
                Show {row.more} more
              </button>
            </div>
          );
        }
        const data = getTokenData(row.token);
        if (!data) return null;
        const isRoot = row.token === (ancestors[0] ?? token) && row.branch === undefined;
        return (
          <div key={row.token} role="treeitem" aria-selected={row.token === token} style={{ display: 'flex', alignItems: 'center', height: TREE_ROW_HEIGHT }}>
            {row.guides.map((guide, index) => <TreeGuide key={index} kind={guide} />)}
            {row.branch && <TreeGuide kind={row.branch} />}
            <Token data={data} swatch selected={row.token === token} onSelect={() => onNavigate(row.token)} style={{ whiteSpace: 'nowrap', flexShrink: 0 }} />
            {isRoot && rootValue && <code style={{ marginLeft: 10, fontSize: 12, color: '#56657a', whiteSpace: 'nowrap' }}>{rootValue.hex ?? rootValue.value}</code>}
            {row.token === token && <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, color: '#1e5288', whiteSpace: 'nowrap' }}>← this token</span>}
          </div>
        );
      })}
    </div>
  );
}

/** A token's resolved value, alias tree, and generated outputs. Shared by the drawer and the Tokens addon panel. */
export function TokenDetailsContent({ data, onNavigate }: { data: TokenData; onNavigate: (token: string) => void }) {
  // Printed exactly as tokens.json writes it: never re-cased or reformatted.
  const resolved = data.hex ?? data.value;
  const exportRows = [
    { label: 'CSS VARIABLE', value: data.cssVar },
    { label: 'SASS VARIABLE', value: data.sassVar ?? `$${data.token.replace(/\./g, '-')}` },
    { label: 'GENERATED CSS', value: 'packages/tokens/dist/tokens.css', href: data.cssFileUrl },
    { label: 'GENERATED SASS', value: 'packages/tokens/dist/tokens.scss', href: data.scssFileUrl },
    { label: 'GENERATED JS', value: 'packages/tokens/dist/tokens.vars.js', href: data.jsFileUrl },
    { label: 'TYPE DECLARATIONS', value: 'packages/tokens/dist/tokens.vars.d.ts', href: data.dtsFileUrl },
  ];

  return (
    <div style={{ display: 'grid', gap: 22, fontSize: 13 }}>
      {resolved && (
        <div>
          <div style={{ ...SECTION_LABEL, marginBottom: 7 }}>RESOLVED VALUE</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
            {data.hex && <span style={{ width: 18, height: 18, borderRadius: 3, background: data.hex, border: '1px solid rgba(25, 29, 35, 0.18)' }} />}
            {resolved}
          </div>
        </div>
      )}
      <div>
        <div style={SECTION_LABEL}>ALIAS TREE</div>
        <div style={{ marginBottom: 10, color: '#697786', fontSize: 12 }}>
          Where this token&rsquo;s value comes from, and what else uses it. Changing a token changes everything below it.
        </div>
        <TokenAliasTree key={data.token} token={data.token} onNavigate={onNavigate} />
      </div>
      <div>
        <div style={SECTION_LABEL}>SOURCE TOKEN</div>
        <div style={FIELD}><code style={CODE}>{data.token}</code></div>
      </div>
      <div>
        <div style={SECTION_LABEL}>DERIVED IMPLEMENTATIONS</div>
        <div style={{ marginBottom: 8, color: '#697786', fontSize: 12 }}>Generated from the source token above.</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {exportRows.map(({ label, value, href }) => (
            <div key={label} style={FIELD}>
              <div style={{ ...SECTION_LABEL, marginBottom: 4, letterSpacing: '0.06em' }}>{label}</div>
              <FieldValue value={value} href={href} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={SECTION_LABEL}>SOURCE FILE</div>
        <div style={FIELD}><FieldValue value="packages/tokens/tokens.json" href={data.sourceFileUrl} /></div>
      </div>
    </div>
  );
}

/**
 * Width for a right-anchored, user-resizable column (the token drawer, the
 * Tokens panel's details column), remembered per `storageKey` in this
 * browser. Storybook has no built-in resizable drawer/splitter for docs
 * content — only its own addon panel resizes — so this is ours.
 */
export function useResizableWidth(storageKey: string, initial: number, min: number, max: () => number) {
  const [width, setWidth] = useState(() => {
    try {
      const saved = Number(window.localStorage.getItem(storageKey));
      if (saved) return saved;
    } catch {
      // Storage can be unavailable (private windows, blocked site data); fall back to the default.
    }
    return initial;
  });
  const clamp = (value: number) => Math.round(Math.min(Math.max(value, min), Math.max(min, max())));
  const update = (value: number) => {
    const next = clamp(value);
    setWidth(next);
    try {
      window.localStorage.setItem(storageKey, String(next));
    } catch {
      // Not remembering the width is fine.
    }
  };
  return { width: clamp(width), setWidth: update };
}

/**
 * A draggable (and arrow-key adjustable) vertical handle on the left edge of
 * a right-anchored column: dragging left widens it.
 */
export function ResizeHandle({ width, onResize, label }: { width: number; onResize: (width: number) => void; label: string }) {
  const start = useRef<{ x: number; width: number } | null>(null);
  const [active, setActive] = useState(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, width };
    setActive(true);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (start.current) onResize(start.current.width + (start.current.x - event.clientX));
  };
  const onPointerUp = () => {
    start.current = null;
    setActive(false);
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 64 : 16;
    if (event.key === 'ArrowLeft') onResize(width + step);
    else if (event.key === 'ArrowRight') onResize(width - step);
    else return;
    event.preventDefault();
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={width}
      tabIndex={0}
      title="Drag to resize"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ position: 'absolute', top: 0, bottom: 0, left: -4, width: 8, cursor: 'col-resize', zIndex: 1, touchAction: 'none', outlineOffset: -2 }}
    >
      <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 3, width: 2, background: active ? '#1e5288' : 'transparent', transition: 'background-color 120ms ease' }} />
    </div>
  );
}

/** `TokenDetailsContent` in a right-hand drawer over the page, closed by the backdrop, the × button, or Escape. */
export function TokenDetails({ data, onClose }: { data: TokenData; onClose: () => void }) {
  const [shown, setShown] = useState(data);
  const { width, setWidth } = useResizableWidth('az-token-drawer-width', Math.min(window.innerWidth * 0.65, 760), 320, () => window.innerWidth - 48);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <button type="button" aria-label="Close token details" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10, width: '100%', height: '100%', border: 0, background: 'rgba(28, 30, 34, 0.42)', cursor: 'default' }} />
      <aside role="dialog" aria-modal="true" aria-label={`${shown.token} details`} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 11, width, boxSizing: 'border-box', overflowY: 'auto', padding: 28, borderLeft: '1px solid #dfe3ea', background: '#fff', boxShadow: '-12px 0 32px rgba(31, 36, 48, 0.18)', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingBottom: 14, marginBottom: 20, borderBottom: '1px solid #e3e6eb' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            {shown.token !== data.token && (
              <button type="button" onClick={() => setShown(data)} style={{ justifySelf: 'start', border: 0, background: 'none', padding: 0, color: '#1d65a6', cursor: 'pointer', fontSize: 12 }}>
                ← Back to {data.token}
              </button>
            )}
            <strong style={{ fontSize: 22, overflowWrap: 'anywhere' }}>{shown.token}</strong>
          </div>
          <button type="button" onClick={onClose} aria-label="Close token details" style={{ width: 28, height: 28, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
        </div>
        <TokenDetailsContent data={shown} onNavigate={(token) => setShown(getTokenData(token) ?? shown)} />
      </aside>
      <div style={{ position: 'fixed', top: 0, bottom: 0, right: width, zIndex: 12 }}>
        <ResizeHandle width={width} onResize={setWidth} label="Resize token details" />
      </div>
    </>
  );
}

/**
 * A clickable token pill. By default it opens `TokenDetails` in a side drawer;
 * pass `onSelect` (and `selected`) to handle selection yourself instead, e.g. to
 * show details in a panel. `swatch` adds a small color dot for color tokens
 * shown without a larger swatch next to them.
 */
export function Token({
  data,
  swatch = false,
  style,
  selected,
  onSelect,
}: {
  data: TokenData;
  swatch?: boolean;
  style?: CSSProperties;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isSelected = selected ?? open;
  ensurePillStyles();

  return (
    <>
      <button type="button" className="az-token-pill" onClick={onSelect ?? (() => setOpen(true))} aria-label={`Inspect ${data.token}`} aria-pressed={isSelected} title={`Inspect ${data.token}`} style={{ ...PILL_STYLE, ...style }}>
        {swatch && data.hex && <span aria-hidden="true" style={{ ...DOT_STYLE, background: data.hex }} />}
        <span style={{ overflowWrap: 'anywhere' }}>{data.token}</span>
        <span aria-hidden="true" className="az-token-pill__chevron" style={{ flex: '0 0 auto', marginLeft: 4, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>›</span>
      </button>
      {!onSelect && open && <TokenDetails data={data} onClose={() => setOpen(false)} />}
    </>
  );
}
