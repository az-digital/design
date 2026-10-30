import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { ButtonColor, ButtonProps, ButtonSize } from '@az-digital/components-html';

// The button in whichever component library the toolbar selects, drawn with
// Arizona Bootstrap's latest release. The controls copy the Figma Buttons
// component's properties: Color, Size, Style and Label. Hover and focus come
// from the pointer and keyboard.

// Each Figma color, the background it's for, and the contract color for each style.
const colors: Record<string, { surface: string; Solid: ButtonColor; Outline: ButtonColor }> = {
  Red: { surface: 'white', Solid: 'red', Outline: 'outline-red' },
  Rain: { surface: 'blue', Solid: 'rain', Outline: 'outline-rain' },
  'White on Red': { surface: 'red', Solid: 'white-text-red', Outline: 'outline-white' },
  'White on Arroyo Blue': { surface: 'arroyo-blue', Solid: 'white-text-blue', Outline: 'outline-white' },
};

// Figma has Default and Large; Small is the contract's third size.
const sizes: Record<string, ButtonSize | undefined> = { Default: undefined, Small: 'small', Large: 'large' };

type ButtonArgs = {
  Color: keyof typeof colors;
  Size: keyof typeof sizes;
  Style: 'Solid' | 'Outline';
  Label: string;
};

// A cleared control ("Choose option…") leaves its arg undefined; fall back to the defaults.
const color = (args: ButtonArgs) => colors[args.Color] ?? colors.Red;

const meta = {
  title: 'Primary/Components/Buttons/Button',
  tags: ['lib:html', 'lib:web'],
  ...componentStories('button', {
    props: (args: ButtonArgs): ButtonProps => ({
      label: args.Label,
      color: color(args)[args.Style] ?? color(args).Solid,
      size: sizes[args.Size],
    }),
  }),
  decorators: [
    (Story, { args }) => (
      <div style={{ backgroundColor: `var(--az-color-brand-${color(args).surface})`, padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    Color: 'Red',
    Size: 'Default',
    Style: 'Solid',
    Label: 'Label',
  },
  argTypes: {
    Color: { control: 'select', options: Object.keys(colors) },
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    Style: { control: 'inline-radio', options: ['Solid', 'Outline'] },
    Label: { control: 'text' },
  },
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Button docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
