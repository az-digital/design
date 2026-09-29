import { useCallback, useEffect, useState, type CSSProperties } from 'react';

export type TokenDisplayItem = {
  name: string;
  token: string;
  hex?: string;
  /** Resolved (alias-followed) value, for non-color tokens that have no `hex`. */
  value?: string;
  cssVar: string;
};

const SWATCH: CSSProperties = { width: 16, height: 16, borderRadius: 4, border: '1px solid rgba(25, 29, 35, 0.18)', display: 'inline-block', flexShrink: 0 };

const TOKEN_PILL: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
  minHeight: 52,
  maxWidth: '100%',
  padding: '8px 18px 8px 10px',
  border: 0,
  borderRadius: 999,
  background: '#302d34',
  color: '#f8f5ff',
  cursor: 'pointer',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 18,
  textAlign: 'left',
};

const TOKEN_DOT: CSSProperties = {
  width: 32,
  height: 32,
  flex: '0 0 auto',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.35)',
};

const LABEL: CSSProperties = { marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' };
const FIELD: CSSProperties = { padding: '10px 12px', borderRadius: 6, background: '#f1f4f7' };
const CODE: CSSProperties = { fontSize: 13, overflowWrap: 'anywhere' };

/** Same side-drawer treatment as ColorSwatchGrid's token details, so every token catalog inspects the same way. */
function TokenInspector({ item, onClose }: { item: TokenDisplayItem; onClose: () => void }) {
  const family = item.token.split('.').slice(0, -1).join('.');
  const exportRows = [
    ['CSS VARIABLE', `var(${item.cssVar})`],
    ['SASS VARIABLE', `$${item.token.replace(/\./g, '-')}`],
    ['GENERATED CSS', 'packages/tokens/dist/tokens.css'],
    ['GENERATED SASS', 'packages/tokens/dist/tokens.scss'],
    ['GENERATED JS', 'packages/tokens/dist/tokens.vars.js'],
    ['TYPE DECLARATIONS', 'packages/tokens/dist/tokens.vars.d.ts'],
  ];

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
      <aside role="dialog" aria-modal="true" aria-label={`${item.token} details`} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 11, width: 'min(65vw, 760px)', boxSizing: 'border-box', overflowY: 'auto', padding: 28, borderLeft: '1px solid #dfe3ea', background: '#fff', boxShadow: '-12px 0 32px rgba(31, 36, 48, 0.18)', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingBottom: 14, borderBottom: '1px solid #e3e6eb' }}>
          <strong style={{ fontSize: 22, overflowWrap: 'anywhere' }}>{item.token}</strong>
          <button type="button" onClick={onClose} aria-label="Close token details" style={{ width: 28, height: 28, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ display: 'grid', gap: 22, marginTop: 20, fontSize: 13 }}>
          {(item.hex || item.value) && (
            <div>
              <div style={LABEL}>RESOLVED VALUE</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16 }}>{item.hex && <span style={{ ...SWATCH, width: 18, height: 18, background: item.hex }} />}{item.hex ? item.hex.toUpperCase() : item.value}</div>
            </div>
          )}
          <div>
            <div style={LABEL}>RELATIONSHIPS</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}><li>Parent group: {family}</li><li>Semantic family: {item.name}</li></ul>
          </div>
          <div>
            <div style={LABEL}>SOURCE TOKEN</div>
            <div style={FIELD}><code style={CODE}>{item.token}</code></div>
          </div>
          <div>
            <div style={LABEL}>DERIVED IMPLEMENTATIONS</div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 12 }}>Generated from the source token above.</div>
            <div style={{ display: 'grid', gap: 8 }}>{exportRows.map(([label, value]) => <div key={label} style={FIELD}><div style={{ ...LABEL, marginBottom: 4, letterSpacing: '0.06em' }}>{label}</div><code style={CODE}>{value}</code></div>)}</div>
          </div>
          <div>
            <div style={LABEL}>SOURCE FILE</div>
            <div style={FIELD}><code style={CODE}>packages/tokens/tokens.json</code></div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function TokenDisplay({ items }: { items: TokenDisplayItem[] }) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selected = items.find((item) => item.token === selectedToken);
  const close = useCallback(() => setSelectedToken(null), []);

  return (
    <div style={{ display: 'grid', gap: 18, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {items.map((item) => (
          <button key={item.token} type="button" aria-pressed={selected?.token === item.token} onClick={() => setSelectedToken(item.token)} aria-label={`Inspect ${item.token}`} style={{ ...TOKEN_PILL, boxShadow: selected?.token === item.token ? '0 0 0 3px #102d59' : 'none' }}>
            {item.hex && <span style={{ ...TOKEN_DOT, background: item.hex }} />}
            <span style={{ overflowWrap: 'anywhere' }}>{item.token}</span>
          </button>
        ))}
      </div>
      {selected && <TokenInspector item={selected} onClose={close} />}
    </div>
  );
}
