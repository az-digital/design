import type { CSSProperties } from 'react';
import { getTokenDisplayItems, Token } from '@az-digital/storybook-addon-tokens';

const TABLE_STYLE: CSSProperties = {
  borderCollapse: 'collapse',
  margin: '16px 0',
  minWidth: '100%',
};

const CELL_STYLE: CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  verticalAlign: 'middle',
};

const BAR_STYLE: CSSProperties = {
  backgroundColor: 'currentColor',
  display: 'block',
  height: 12,
};

export function SpacingScale() {
  const items = getTokenDisplayItems('az.spacing.', { order: 'source' });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={TABLE_STYLE}>
        <thead>
          <tr>
            <th style={CELL_STYLE}>Token</th>
            <th style={CELL_STYLE}>Scale</th>
            <th style={CELL_STYLE}>Value</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const width = Number.parseFloat(item.value ?? '');
            return (
              <tr key={item.token}>
                <td style={CELL_STYLE}><Token data={item} /></td>
                <td style={CELL_STYLE}><span aria-hidden="true" style={{ ...BAR_STYLE, width: Number.isFinite(width) ? width : 0 }} /></td>
                <td style={CELL_STYLE}>{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
