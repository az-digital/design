// Default React import: this file is also bundled into the manager (the Tokens addon panel), which uses the classic JSX runtime.
import React, { useEffect, useState, type CSSProperties } from 'react';

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
  padding: '4px 14px',
  border: 0,
  borderRadius: 999,
  background: '#302d34',
  color: '#f8f5ff',
  cursor: 'pointer',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10,
  fontWeight: 500,
  textAlign: 'left',
};

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

/** A token's resolved value, relationships, and generated outputs. Shared by the drawer and the Tokens addon panel. */
export function TokenDetailsContent({ data }: { data: TokenData }) {
  const family = data.token.split('.').slice(0, -1).join('.');
  const name = data.name ?? data.token.split('.').at(-1);
  const resolved = data.hex?.toUpperCase() ?? data.value;
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
        <div style={SECTION_LABEL}>RELATIONSHIPS</div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}><li>Parent group: {family}</li><li>Semantic family: {name}</li></ul>
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

/** `TokenDetailsContent` in a right-hand drawer over the page, closed by the backdrop, the × button, or Escape. */
export function TokenDetails({ data, onClose }: { data: TokenData; onClose: () => void }) {
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
      <aside role="dialog" aria-modal="true" aria-label={`${data.token} details`} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 11, width: 'min(65vw, 760px)', boxSizing: 'border-box', overflowY: 'auto', padding: 28, borderLeft: '1px solid #dfe3ea', background: '#fff', boxShadow: '-12px 0 32px rgba(31, 36, 48, 0.18)', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingBottom: 14, marginBottom: 20, borderBottom: '1px solid #e3e6eb' }}>
          <strong style={{ fontSize: 22, overflowWrap: 'anywhere' }}>{data.token}</strong>
          <button type="button" onClick={onClose} aria-label="Close token details" style={{ width: 28, height: 28, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
        </div>
        <TokenDetailsContent data={data} />
      </aside>
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

  return (
    <>
      <button type="button" onClick={onSelect ?? (() => setOpen(true))} aria-label={`Inspect ${data.token}`} aria-pressed={isSelected} style={{ ...PILL_STYLE, boxShadow: isSelected ? '0 0 0 3px #102d59' : 'none', ...style }}>
        {swatch && data.hex && <span aria-hidden="true" style={{ ...DOT_STYLE, background: data.hex }} />}
        <span style={{ overflowWrap: 'anywhere' }}>{data.token}</span>
      </button>
      {!onSelect && open && <TokenDetails data={data} onClose={() => setOpen(false)} />}
    </>
  );
}
