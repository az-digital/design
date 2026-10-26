import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing the
// headings as it ships today. The Mode control copies the Figma Headings
// collection's modes; each one is a class on the page.
const modes = {
  'sans-serif': '',
  serif: 'az-headings-serif',
  mixed: 'az-headings-mixed',
} as const;

type HeadingsArgs = { Mode: keyof typeof modes };

const meta = {
  title: 'Primary/Foundations/Typography',
  args: { Mode: 'sans-serif' },
  argTypes: {
    Mode: { control: 'inline-radio', options: Object.keys(modes) },
  },
} satisfies Meta<HeadingsArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: (args) => (
    <div className={modes[args.Mode] ?? ''} style={{ padding: '2rem' }}>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
    </div>
  ),
};
