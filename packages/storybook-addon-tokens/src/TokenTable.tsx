// Default React import: this file is also bundled into the manager (the Tokens addon panel), which uses the classic JSX runtime.
import React, { type CSSProperties } from 'react';
import { Token, type TokenData } from './Token';
import { getTokenNode } from './tokenGraph';

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
 * The token `token` aliases directly. In a table with `onSelect` (the Tokens
 * panel) it's a link to that token; otherwise plain text. Tokens holding a
 * literal value alias nothing.
 */
function AliasCell({ token, onSelect }: { token: string; onSelect?: (token: string) => void }) {
  const parent = getTokenNode(token)?.parent;
  if (!parent) return <span style={{ color: '#9aa4b2', fontSize: 12 }}>—</span>;
  if (!onSelect) return <code style={{ ...CODE, color: '#56657a' }}>{parent}</code>;
  return (
    <button type="button" onClick={() => onSelect(parent)} title={`Inspect ${parent}`} style={{ border: 0, background: 'none', padding: 0, cursor: 'pointer', color: '#1d65a6', textAlign: 'left' }}>
      <code style={{ ...CODE, color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2 }}>{parent}</code>
    </button>
  );
}

/**
 * One row per token: the `Token` pill (click to inspect), its DTCG `$type`,
 * the token it aliases directly (if any), and its resolved value — so rows that
 * resolve to the same value still show *why* they do.
 * Platform outputs (CSS, Sass, JS, ...) stay in the details view, since no one
 * platform's name is the token. Pass `selectedToken`/`onSelect` to handle selection
 * yourself (e.g. to show details in a panel); otherwise each pill opens its own drawer.
 */
export function TokenTable({
  items,
  selectedToken,
  onSelect,
  groupBy,
}: {
  items: TokenData[];
  selectedToken?: string | null;
  onSelect?: (token: string) => void;
  /**
   * Split rows under labelled sub-header rows, e.g. by state (Default, Hover,
   * Focus). Returns the group label for a row; groups appear in the order their
   * first row does, so sort `items` to control it.
   */
  groupBy?: (item: TokenData) => string;
}) {
  const sections: Array<{ label?: string; items: TokenData[] }> = [];
  for (const item of items) {
    const label = groupBy?.(item);
    const section = sections.find((candidate) => candidate.label === label);
    if (section) section.items.push(item);
    else sections.push({ label, items: [item] });
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: 13, color: '#1f2430' }}>
        <thead>
          <tr>
            <th scope="col" style={HEADER_CELL}>TOKEN</th>
            <th scope="col" style={HEADER_CELL}>TYPE</th>
            <th scope="col" style={HEADER_CELL}>ALIAS OF</th>
            <th scope="col" style={HEADER_CELL}>RESOLVED VALUE</th>
          </tr>
        </thead>
        {sections.map((section) => (
        <tbody key={section.label ?? 'all'}>
          {section.label !== undefined && (
            <tr>
              <th scope="rowgroup" colSpan={4} style={{ padding: '10px 12px 4px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#1e5288', borderBottom: '1px solid #eef1f4' }}>
                {section.label} <span style={{ color: '#9aa4b2', fontWeight: 400 }}>· {section.items.length}</span>
              </th>
            </tr>
          )}
          {section.items.map((item) => (
            <tr key={item.token} style={{ background: selectedToken === item.token ? '#f1f4f7' : undefined }}>
              <td style={CELL}>
                <Token
                  data={item}
                  swatch
                  style={{ whiteSpace: 'nowrap' }}
                  {...(onSelect && { selected: selectedToken === item.token, onSelect: () => onSelect(item.token) })}
                />
              </td>
              <td style={{ ...CELL, color: '#697786', fontSize: 12, whiteSpace: 'nowrap' }}>{item.type}</td>
              <td style={CELL}><AliasCell token={item.token} onSelect={onSelect} /></td>
              <td style={CELL}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {item.hex && <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 3, background: item.hex, border: '1px solid rgba(25, 29, 35, 0.18)' }} />}
                  <code style={CODE}>{item.hex ?? item.value}</code>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        ))}
      </table>
    </div>
  );
}
