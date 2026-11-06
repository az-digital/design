import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { ArizonaHeaderProps } from '@az-digital/components-html';

// The header in whichever library the toolbar selects, drawn with Arizona
// Bootstrap's current release. The controls choose the header's color and
// whether it has header buttons. Focus comes from the keyboard.

// Each displayed color's contract variant. Red is the original header, being retired.
const colors: Record<string, NonNullable<ArizonaHeaderProps['variant']>> = { Blue: 'blue', Red: 'red' };

type ArizonaHeaderArgs = {
  Color: keyof typeof colors;
  'Header buttons': boolean;
};

const meta = {
  title: 'Primary/Components/Navigation/Arizona Header',
  tags: ['!dev', 'lib:html'],
  ...componentStories('brand-header', {
    props: (args: ArizonaHeaderArgs): ArizonaHeaderProps => ({
      variant: colors[args.Color] ?? colors.Blue,
      headerButtons: args['Header buttons'],
    }),
  }),
  args: {
    Color: 'Blue',
    'Header buttons': true,
  },
  argTypes: {
    Color: { control: 'inline-radio', options: Object.keys(colors) },
    'Header buttons': { control: 'boolean' },
  },
} satisfies Meta<ArizonaHeaderArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Arizona Header docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
