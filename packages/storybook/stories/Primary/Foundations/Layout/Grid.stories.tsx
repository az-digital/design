import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Token, getTokenData, getTokenDisplayItems, resolveValue, type TokenData } from '@az-digital/storybook-addon-tokens';

/**
 * The container at one breakpoint's max width, with the grid's columns and
 * gutters drawn inside it. Every number comes from the tokens.
 */

const px = (value: unknown) => Number.parseFloat(String(value));

/** A token the diagram needs; fails loudly if it's renamed or removed. */
function token(path: string): TokenData {
  const data = getTokenData(path);
  if (!data) throw new Error(`Missing token ${path}`);
  return data;
}

const BUTTON_STYLE: CSSProperties = {
  padding: '4px 12px',
  border: '1px solid var(--az-color-brand-blue)',
  borderRadius: 4,
  font: 'inherit',
  cursor: 'pointer',
};

const LABEL_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
};

function GridDiagram() {
  const widths = getTokenDisplayItems('az.container.max-width.', { order: 'source' });
  const [selected, setSelected] = useState(widths[widths.length - 1].token);
  const width = px(resolveValue(selected));
  const columns = Number(resolveValue('az.grid.columns'));
  const gutter = px(resolveValue('az.grid.gutter'));
  const columnWidth = width / columns;
  const height = 120;

  return (
    <div style={{ display: 'grid', gap: 16, fontSize: 14 }}>
      <div role="group" aria-label="Breakpoint" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {widths.map((item) => {
          const isSelected = item.token === selected;
          return (
            <button
              key={item.token}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(item.token)}
              style={{
                ...BUTTON_STYLE,
                background: isSelected ? 'var(--az-color-brand-blue)' : 'var(--az-color-brand-white)',
                color: isSelected ? 'var(--az-color-brand-white)' : 'var(--az-color-brand-blue)',
              }}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`A ${width}px container with ${columns} columns and ${gutter}px gutters`}
        style={{ width: `min(100%, ${width}px)`, height: 'auto', display: 'block' }}
      >
        <rect width={width} height={height} fill="var(--az-color-brand-gray-100)" stroke="var(--az-color-brand-blue)" strokeWidth={2} />
        {Array.from({ length: columns }, (_, index) => (
          <rect
            key={index}
            x={index * columnWidth + gutter / 2}
            y={0}
            width={columnWidth - gutter}
            height={height}
            fill="var(--az-color-brand-rain)"
            opacity={0.6}
          />
        ))}
      </svg>

      <div style={LABEL_STYLE}>
        Container max width <Token data={token(selected)} /> {width}px
      </div>
      <div style={LABEL_STYLE}>
        Columns <Token data={token('az.grid.columns')} /> {columns}
      </div>
      <div style={LABEL_STYLE}>
        Gutter <Token data={token('az.grid.gutter')} /> {gutter}px, with half a gutter ({gutter / 2}px) at each edge of the container
      </div>
    </div>
  );
}

const meta = {
  title: 'Primary/Foundations/Layout/Grids and Spacing',
  parameters: {
    tokens: ['az.grid.', 'az.container.', 'az.spacing.4'],
    docs: { canvas: { sourceState: 'none' } },
  },
  render: () => <GridDiagram />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GridAndContainer: Story = {};
