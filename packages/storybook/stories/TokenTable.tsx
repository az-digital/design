// Default React import: this file is also bundled into the manager (the Tokens addon panel), which uses the classic JSX runtime.
import React, { type CSSProperties } from 'react';
import { Token, type TokenData } from './Token';

const HEADER_CELL: CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #dfe3ea',
  color: '#697786',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const CELL: CSSProperties = {
  padding: '6px 12px',
  borderBottom: '1px solid #eef1f4',
  verticalAlign: 'middle',
};

const CODE: CSSProperties = { fontSize: 12, color: '#1f2430', whiteSpace: 'nowrap' };

/**
 * One row per token: the `Token` pill (click to inspect), its resolved value, and
 * its generated CSS variable. Pass `selectedToken`/`onSelect` to handle selection
 * yourself (e.g. to show details in a panel); otherwise each pill opens its own drawer.
 */
export function TokenTable({
  items,
  selectedToken,
  onSelect,
}: {
  items: TokenData[];
  selectedToken?: string | null;
  onSelect?: (token: string) => void;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 13, color: '#1f2430' }}>
        <thead>
          <tr>
            <th scope="col" style={HEADER_CELL}>TOKEN</th>
            <th scope="col" style={HEADER_CELL}>VALUE</th>
            <th scope="col" style={HEADER_CELL}>CSS VARIABLE</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.token} style={{ background: selectedToken === item.token ? '#f1f4f7' : undefined }}>
              <td style={CELL}>
                <Token
                  data={item}
                  swatch
                  style={{ whiteSpace: 'nowrap' }}
                  {...(onSelect && { selected: selectedToken === item.token, onSelect: () => onSelect(item.token) })}
                />
              </td>
              <td style={CELL}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {item.hex && <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 3, background: item.hex, border: '1px solid rgba(25, 29, 35, 0.18)' }} />}
                  <code style={CODE}>{item.hex?.toUpperCase() ?? item.value}</code>
                </span>
              </td>
              <td style={CELL}><code style={CODE}>{item.cssVar}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
