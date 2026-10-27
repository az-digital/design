import type { Meta, StoryObj } from '@storybook/react-vite';

const examples = [
  { breakpoint: 'Below sm', viewport: 375, maxWidth: null },
  { breakpoint: 'sm', viewport: 576, maxWidth: 540 },
  { breakpoint: 'md', viewport: 768, maxWidth: 720 },
  { breakpoint: 'lg', viewport: 992, maxWidth: 960 },
  { breakpoint: 'xl', viewport: 1200, maxWidth: 1140 },
  { breakpoint: 'xxl', viewport: 1400, maxWidth: 1320 },
];

function GridExamples() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {examples.map(({ breakpoint, viewport, maxWidth }) => {
        const containerWidth = Math.min(viewport, maxWidth ?? viewport);
        const columnWidth = (containerWidth - 24 - 11 * 24) / 12;

        return (
          <figure key={breakpoint} style={{ margin: 0, border: '1px solid #ced4da', padding: 12 }}>
            <figcaption style={{ display: 'grid', gap: 4, marginBottom: 8 }}>
              <strong>{breakpoint}</strong>
              <span>{viewport}px viewport · {maxWidth === null ? 'full-width container' : `${maxWidth}px max width`}</span>
            </figcaption>
            <svg
              role="img"
              aria-label={`12-column grid at ${breakpoint}, with 24px gutters and 12px container padding`}
              viewBox={`0 0 ${viewport} 48`}
              preserveAspectRatio="none"
              style={{ display: 'block', width: '100%', height: 48, background: 'var(--az-color-brand-caliche)' }}
            >
              <rect width={containerWidth} height="48" fill="var(--az-color-brand-white)" stroke="var(--az-color-brand-gray-500)" />
              {Array.from({ length: 12 }, (_, index) => (
                <rect
                  key={index}
                  x={12 + index * (columnWidth + 24)}
                  y="8"
                  width={columnWidth}
                  height="32"
                  fill="var(--az-color-brand-rain)"
                />
              ))}
            </svg>
          </figure>
        );
      })}
    </div>
  );
}

const meta = {
  title: 'Primary/Foundations/Layout/Grids and Spacing',
  parameters: {
    tokens: ['az.grid.', 'az.container.', 'az.spacing.4'],
  },
  render: () => <GridExamples />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AtEachBreakpoint: Story = {};
