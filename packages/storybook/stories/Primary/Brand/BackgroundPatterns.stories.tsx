import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

const surfaces = ['white', 'blue', 'red', 'rain', 'cloud'] as const;
type Surface = (typeof surfaces)[number];
type PatternArgs = { Surface: Surface };

const meta = {
  title: 'Primary/Brand/Background patterns',
  args: { Surface: 'white' },
  argTypes: {
    Surface: { control: 'select', options: surfaces },
  },
  render: ({ Surface }: PatternArgs) => (
    <div>
      {(['start', 'end'] as const).map((placement) =>
        (['desktop', 'phone'] as const).map((width) => (
          <div key={`${placement}-${width}`} style={{ marginBottom: '1.5rem' }}>
            <h3>{placement === 'start' ? 'Start' : 'End'} edge, {width}</h3>
            <div style={{ maxWidth: width === 'phone' ? '375px' : '100%' }}>
              <section
                className={`background-wrapper bg-monsoon-rain-${placement} text-bg-${Surface || 'white'}`}
                data-placement={placement}
                data-width={width}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-12 text-center">
                      <h4>Background wrapper example</h4>
                      <p>Patterned sections should keep their text readable and maintain sufficient color contrast.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )),
      )}
    </div>
  ),
} satisfies Meta<PatternArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Examples: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const sections = canvasElement.querySelectorAll<HTMLElement>('section[data-placement]');
    await expect(sections).toHaveLength(4);
    for (const section of sections) {
      const band = getComputedStyle(section, '::before');
      const expectedWidth = Math.min(200, Math.max(75, section.getBoundingClientRect().width * 0.2));
      await expect(Number.parseFloat(band.width)).toBeCloseTo(expectedWidth, 0);
      await expect(band.opacity).toBe('0.4');
      await expect(band.backgroundSize).toBe('300px auto');
      await expect(band.backgroundRepeat).toBe('repeat-y');
      await expect(band.backgroundImage).toContain('monsoon-rain.svg');
      await expect(section.dataset.placement === 'start' ? band.left : band.right).toBe('0px');
      const image = band.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
      await expect(image).toBeTruthy();
      const response = await fetch(image!);
      await expect(response.ok).toBe(true);
      await expect(response.headers.get('content-type')).toContain('image/svg+xml');
    }
  },
};
