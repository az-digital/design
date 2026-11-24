import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { ButtonColor, ButtonProps, ButtonSize } from '@az-digital/components-html';

// The button in whichever component library the toolbar selects, drawn with
// Arizona Bootstrap v5.3.0, compiled from its Sass with the patches in the
// repo's patches/ folder (see .storybook/arizona-bootstrap.scss). The controls
// copy the Figma Buttons component's
// properties: Color, Size, Style and Label. Hover and focus come from the
// pointer and keyboard.
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

// Shown on the Button docs page and in the sidebar. Its design contract tests
// cover every combination of the contract's variants.
export const Default: Story = {};

// One story per contract variant the controls can show, so its drawer has the
// contract for that variant with the selected library's results. The
// contract's Blue buttons aren't in the Figma component's colors.
const variantStory = (args: Partial<ButtonArgs>): Story => {
  const { Color, Size, Style } = { ...meta.args, ...args };
  const size = sizes[Size];
  return {
    args,
    parameters: {
      designContracts: {
        variant: { color: colors[Color][Style], ...(size ? { size } : {}) },
      },
    },
  };
};

export const Red = variantStory({});
export const OutlineRed = variantStory({ Style: 'Outline' });
export const Rain = variantStory({ Color: 'Rain' });
export const OutlineRain = variantStory({ Color: 'Rain', Style: 'Outline' });
// Storybook reads a story's name statically, so set it here, not in variantStory.
export const WhiteRedText: Story = { ...variantStory({ Color: 'White on Red' }), name: 'White, Red text' };
export const WhiteBlueText: Story = { ...variantStory({ Color: 'White on Arroyo Blue' }), name: 'White, Blue text' };
export const OutlineWhite = variantStory({ Color: 'White on Red', Style: 'Outline' });
export const Small = variantStory({ Size: 'Small' });
export const Large = variantStory({ Size: 'Large' });
