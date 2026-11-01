import type { CSSProperties } from 'react';
import { getTokenDisplayItems, Token } from '@az-digital/storybook-addon-tokens';

/**
 * One row per `az.breakpoint.*` token: its pill, its width, and the page's own
 * examples of devices at that width, keyed by breakpoint name.
 */

const CELL_STYLE: CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  verticalAlign: 'middle',
};

export function BreakpointTable({ examples }: { examples: Record<string, string> }) {
  const items = getTokenDisplayItems('az.breakpoint.', { order: 'source' });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', margin: '16px 0', minWidth: '100%' }}>
        <thead>
          <tr>
            <th style={CELL_STYLE}>Token</th>
            <th style={CELL_STYLE}>Minimum width</th>
            <th style={CELL_STYLE}>Device examples</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.token}>
              <td style={CELL_STYLE}><Token data={item} /></td>
              <td style={CELL_STYLE}>{item.value}</td>
              <td style={CELL_STYLE}>{examples[item.name ?? ''] ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
