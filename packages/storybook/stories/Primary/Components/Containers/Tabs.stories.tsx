import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { TabsProps } from '@az-digital/components-html';

// The tabs in whichever component library the toolbar selects, drawn with
// Arizona Bootstrap v5.3.0, compiled from its Sass with the patches in the
// repo's patches/ folder (see .storybook/arizona-bootstrap.scss). The controls
// copy the Figma Tabs component's properties: the labels, which tab is current,
// and whether the last one is disabled. Hover and keyboard focus come from the
// pointer and keyboard.

type TabsArgs = {
  Labels: string;
  Current: number;
  'Last tab disabled': boolean;
};

// The labels, as typed in the control: one per line, blank lines dropped.
const labelsOf = (args: TabsArgs) =>
  (args.Labels ?? '')
    .split('\n')
    .map((label) => label.trim())
    .filter(Boolean);

const meta = {
  title: 'Primary/Components/Containers/Tabs',
  tags: ['lib:html'],
  ...componentStories('tabs', {
    props: (args: TabsArgs): TabsProps => {
      const labels = labelsOf(args);
      const last = labels.length - 1;
      return {
        tabs: labels.map((label, index) => ({
          label,
          current: index === (args.Current ?? 1) - 1,
          disabled: args['Last tab disabled'] && index === last,
        })),
      };
    },
  }),
  args: {
    Labels: 'Active\nLink\nLink\nLink\nDisabled Link',
    Current: 1,
    'Last tab disabled': true,
  },
  argTypes: {
    Labels: { control: 'text', description: 'One label per line.' },
    Current: { control: { type: 'number', min: 1 }, description: 'Which tab is the current one, counting from 1.' },
    'Last tab disabled': { control: 'boolean' },
  },
} satisfies Meta<TabsArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Tabs docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
