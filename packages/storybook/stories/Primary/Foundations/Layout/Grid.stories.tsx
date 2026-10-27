import type { Meta, StoryObj } from '@storybook/react-vite';

const examples = [
  { breakpoint: 'Below sm', viewportRange: '<576px', maxWidth: null },
  { breakpoint: 'sm', viewportRange: '576–767px', maxWidth: 540 },
  { breakpoint: 'md', viewportRange: '768–991px', maxWidth: 720 },
  { breakpoint: 'lg', viewportRange: '992–1199px', maxWidth: 960 },
  { breakpoint: 'xl', viewportRange: '1200–1399px', maxWidth: 1140 },
  { breakpoint: 'xxl', viewportRange: '≥1400px', maxWidth: 1320 },
];

const maxContainerWidth = 1320;

function ContainerWidthComparison() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', color: '#252a30', fontSize: 14 }}>
        <caption style={{ captionSide: 'bottom', paddingTop: 8, textAlign: 'left', color: '#616e7c' }}>
          Bar lengths are proportional to 1320px; below sm, the container remains fluid.
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ padding: '8px 12px', borderBottom: '1px solid #ced4da', textAlign: 'left' }}>Breakpoint</th>
            <th scope="col" style={{ padding: '8px 12px', borderBottom: '1px solid #ced4da', textAlign: 'left' }}>Viewport range</th>
            <th scope="col" style={{ padding: '8px 12px', borderBottom: '1px solid #ced4da', textAlign: 'left' }}>Container max width</th>
            <th scope="col" style={{ width: '35%', padding: '8px 12px', borderBottom: '1px solid #ced4da', textAlign: 'left' }}>Relative width</th>
          </tr>
        </thead>
        <tbody>
          {examples.map(({ breakpoint, viewportRange, maxWidth }) => (
            <tr key={breakpoint}>
              <th scope="row" style={{ padding: '8px 12px', borderBottom: '1px solid #e8ebef', textAlign: 'left' }}>{breakpoint}</th>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #e8ebef', whiteSpace: 'nowrap' }}>{viewportRange}</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #e8ebef', whiteSpace: 'nowrap' }}>
                {maxWidth === null ? 'Full width' : `${maxWidth}px`}
              </td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #e8ebef' }}>
                {maxWidth === null ? (
                  <span style={{ color: '#616e7c' }}>Fluid</span>
                ) : (
                  <div aria-hidden="true" style={{ height: 16, background: 'var(--az-color-brand-caliche)' }}>
                    <div style={{ width: `${(maxWidth / maxContainerWidth) * 100}%`, height: '100%', background: 'var(--az-color-brand-rain)' }} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: 'Primary/Foundations/Layout/Grids and Spacing',
  parameters: {
    tokens: ['az.grid.', 'az.container.', 'az.spacing.4'],
  },
  render: () => <ContainerWidthComparison />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContainerWidths: Story = {};
