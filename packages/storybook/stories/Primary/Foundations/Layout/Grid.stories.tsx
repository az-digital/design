import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Token, getTokenData, getTokenDisplayItems, resolveValue, type TokenData } from '@az-digital/storybook-addon-tokens';

/**
 * A real container with one column per grid column, so it responds to the
 * viewport (use Storybook's viewport switcher). The labels read the tokens and
 * name the max width the container is at.
 */

const px = (value: unknown) => Number.parseFloat(String(value));

/** A token the diagram needs; fails loudly if it's renamed or removed. */
function token(path: string): TokenData {
  const data = getTokenData(path);
  if (!data) throw new Error(`Missing token ${path}`);
  return data;
}

const LABEL_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
};

function GridDiagram() {
  const widths = getTokenDisplayItems('az.container.max-width.', { order: 'source' });
  const columns = Number(resolveValue('az.grid.columns'));
  const gutter = px(resolveValue('az.grid.gutter'));
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [maxWidth, setMaxWidth] = useState('');

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const updateMeasurements = () => {
      setWidth(Math.round(element.getBoundingClientRect().width));
      setMaxWidth(getComputedStyle(element).maxWidth);
    };
    const observer = new ResizeObserver(updateMeasurements);
    observer.observe(element);
    window.addEventListener('resize', updateMeasurements);
    updateMeasurements();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateMeasurements);
    };
  }, []);

  const current = widths.find((item) => px(item.value) === px(maxWidth));

  return (
    <div style={{ display: 'grid', gap: 16, fontSize: 14 }}>
      <p style={{ margin: 0, maxWidth: '60ch' }}>
        This story shows the grid with Storybook&apos;s built-in tools. Use the viewport switcher in the toolbar to see the
        container&apos;s max width change at each breakpoint, the measure and outline tools to inspect the columns and
        gutters, and the Tokens tab below to look up the tokens it uses.
      </p>
      <div ref={container} className="container" style={{ outline: '2px solid var(--az-color-brand-blue)' }}>
        <div className="row">
          {Array.from({ length: columns }, (_, index) => (
            <div key={index} className="col">
              <div style={{ height: 120, background: 'var(--az-color-brand-rain)', opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </div>

      <div style={LABEL_STYLE}>
        Container max width{' '}
        {current ? <><Token data={current} /> {width}px</> : <>none: below <code>sm</code> the container is fluid ({width}px here)</>}
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
  title: 'Primary/Foundations/Layout/Grid',
  parameters: {
    tokens: ['az.grid.', 'az.container.', 'az.spacing.300'],
    docs: { canvas: { sourceState: 'none' } },
    // The story has no args, actions or play function; only the Tokens tab applies.
    controls: { disable: true },
    actions: { disable: true },
    interactions: { disable: true },
  },
  render: () => <GridDiagram />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GridAndContainer: Story = {};
