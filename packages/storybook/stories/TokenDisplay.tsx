import { useState, type CSSProperties } from 'react';

export type TokenDisplayItem = {
  name: string;
  token: string;
  type: string;
  value: string;
  sourceValue: string;
  hex?: string;
  cssVar: string;
  description?: string;
  aliasChain: Array<{ token: string; value: string }>;
};

const TOKEN_ROW: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 16,
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #dfe3ea',
  borderRadius: 8,
  background: '#fff',
  color: '#1f2430',
  cursor: 'pointer',
  textAlign: 'left',
};

const SWATCH: CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 4,
  border: '1px solid rgba(25, 29, 35, 0.18)',
  display: 'inline-block',
  flexShrink: 0,
};

const SEARCH: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: '1px solid #bac7d5',
  borderRadius: 6,
  font: 'inherit',
};

function TokenInspector({ item }: { item: TokenDisplayItem }) {
  const exports = [
    ['Source token', item.token],
    ['CSS variable', item.cssVar],
    ['Sass variable', `$${item.cssVar.slice(2)}`],
    ['JSON source', 'packages/tokens/tokens.json'],
    ['Generated CSS', 'packages/tokens/dist/tokens.css'],
    ['Generated Sass', 'packages/tokens/dist/tokens.scss'],
  ];

  return (
    <aside style={{ background: '#f8f8f8', padding: 16, border: '1px solid #dfe3ea', borderRadius: 8 }}>
      <strong style={{ display: 'block', marginBottom: 12, fontSize: 18, color: '#1f2430', overflowWrap: 'anywhere' }}>{item.token}</strong>
      <div style={{ display: 'grid', gap: 10, color: '#374151' }}>
        <div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>RESOLVED VALUE</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            {item.hex && <span style={{ ...SWATCH, background: item.hex }} />}
            <code>{item.value}</code>
          </span>
        </div>
        <div><div style={{ fontSize: 11, color: '#6b7280' }}>TYPE</div><code>{item.type}</code></div>
        <div><div style={{ fontSize: 11, color: '#6b7280' }}>SOURCE VALUE</div><code>{item.sourceValue}</code></div>
        {item.description && <div><div style={{ fontSize: 11, color: '#6b7280' }}>DESCRIPTION</div>{item.description}</div>}
        <div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>ALIAS CHAIN</div>
          <ol style={{ margin: '4px 0 0', paddingLeft: 20 }}>
            {item.aliasChain.map((link) => <li key={link.token}><code>{link.token}</code>: <code>{link.value}</code></li>)}
          </ol>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {exports.map(([label, value]) => <div key={label}><span style={{ fontSize: 11, color: '#6b7280' }}>{label}: </span><code>{value}</code></div>)}
        </div>
      </div>
    </aside>
  );
}

export function TokenDisplay({ items, searchLabel = 'Search tokens' }: { items: TokenDisplayItem[]; searchLabel?: string }) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    `${item.token} ${item.name} ${item.type} ${item.value}`.toLowerCase().includes(normalizedQuery),
  );
  const selected = filteredItems.find((item) => item.token === selectedToken);

  return (
    <div style={{ display: 'grid', gap: 12, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <label>
        <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
          {searchLabel}
        </span>
        <input type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder={searchLabel} style={SEARCH} />
      </label>
      <div style={{ display: 'grid', gap: 8 }}>
        {filteredItems.map((item) => (
          <button
            key={item.token}
            type="button"
            onClick={() => setSelectedToken((current) => current === item.token ? null : item.token)}
            aria-expanded={selectedToken === item.token}
            style={{
              ...TOKEN_ROW,
              boxShadow: selectedToken === item.token ? '0 0 0 2px #102d59' : 'none',
            }}
          >
            <span style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 10 }}>
              {item.hex && <span aria-hidden="true" style={{ ...SWATCH, background: item.hex }} />}
              <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <code style={{ display: 'block' }}>{item.token}</code>
                <span style={{ color: '#697786', fontSize: 12 }}>{item.type}</span>
              </span>
            </span>
            <code style={{ overflowWrap: 'anywhere', textAlign: 'right' }}>{item.value}</code>
          </button>
        ))}
        {filteredItems.length === 0 && <p role="status">No tokens match “{query}”.</p>}
      </div>
      {selected && <TokenInspector item={selected} />}
    </div>
  );
}
