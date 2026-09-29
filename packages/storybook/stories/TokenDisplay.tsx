import { useState, type CSSProperties } from 'react';

export type TokenDisplayItem = {
  name: string;
  token: string;
  hex?: string;
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

function TokenInspector({ item }: { item: TokenDisplayItem }) {
  const family = item.token.split('.').slice(0, -1).join('.');
  const exports = [
    ['Source token', item.token],
    ['CSS variable', item.cssVar],
    ['Sass variable', `$${item.token.replace(/\./g, '-')}`],
    ['JSON source', 'packages/tokens/tokens.json'],
    ['Generated CSS', 'packages/tokens/dist/tokens.css'],
    ['Generated Sass', 'packages/tokens/dist/tokens.scss'],
  ];

  return (
    <aside style={{ background: '#f8f8f8', minHeight: 520, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <strong style={{ fontSize: 24, color: '#1f2430' }}>{item.token}</strong>
      </div>
      {item.hex && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}><span style={{ ...SWATCH, background: item.hex }} /><span style={{ fontSize: 12, color: '#56657a' }}>Color token</span></div>}
      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        <div><div style={{ fontSize: 11, color: '#6b7280' }}>COLOR</div><code>{item.cssVar}</code></div>
        {item.hex && <div><div style={{ fontSize: 11, color: '#6b7280' }}>RESOLVED VALUE</div><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 6 }}><span style={{ ...SWATCH, width: 22, height: 22, background: item.hex }} />{item.hex.toUpperCase()}</span></div>}
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>RELATIONSHIPS</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#374151', lineHeight: 1.8 }}>
          <li>Parent group: {family}</li>
          <li>Semantic family: {item.name}</li>
          <li>Generated output: {item.cssVar}</li>
        </ul>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>REPO EXPORTS</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {exports.map(([label, value]) => <div key={label} style={{ background: '#edf1f4', borderRadius: 8, padding: '8px 10px' }}><div style={{ fontSize: 10, color: '#697786' }}>{label}</div><code>{value}</code></div>)}
        </div>
      </div>
    </aside>
  );
}

export function TokenDisplay({ items }: { items: TokenDisplayItem[] }) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selected = items.find((item) => item.token === selectedToken);

  return (
    <div style={{ display: 'grid', gap: 18, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        {items.map((item) => (
          <button key={item.token} type="button" onClick={() => setSelectedToken(item.token)} aria-label={`Inspect ${item.token}`} style={{ ...TOKEN_PILL, boxShadow: selected?.token === item.token ? '0 0 0 3px #102d59' : 'none' }}>
            {item.hex && <span style={{ ...TOKEN_DOT, background: item.hex }} />}
            <span style={{ overflowWrap: 'anywhere' }}>{item.token}</span>
          </button>
        ))}
      </div>
      {selected && <TokenInspector item={selected} />}
    </div>
  );
}
