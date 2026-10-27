import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing the
// button as it ships today. The controls copy the Figma Buttons component's
// properties: Color, Size, Style and Label. Hover and focus come from the
// pointer and keyboard.

// Each Figma color, the background it's for, and the class for each style.
// Rain is still .btn-sky until az-digital/arizona-bootstrap#2369 renames it.
const colors = {
  Red: { surface: 'white', Solid: 'btn-red', Outline: 'btn-outline-red' },
  Rain: { surface: 'blue', Solid: 'btn-sky', Outline: 'btn-outline-sky' },
  'White on Red': { surface: 'red', Solid: 'btn-white-text-red', Outline: 'btn-outline-white' },
  'White on Arroyo Blue': {
    surface: 'arroyo-blue',
    Solid: 'btn-white-text-blue',
    Outline: 'btn-outline-white',
  },
} as const;

// Figma has Default and Large; Small is the contract's third size.
const sizes = { Default: '', Small: 'btn-sm', Large: 'btn-lg' } as const;

type ButtonArgs = {
  Color: keyof typeof colors;
  Size: keyof typeof sizes;
  Style: 'Solid' | 'Outline';
  Label: string;
};

const meta = {
  title: 'Primary/Components/Buttons/Button',
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
  render: (args) => {
    // A cleared control ("Choose option…") leaves its arg undefined; fall back to the defaults.
    const color = colors[args.Color] ?? colors.Red;
    const className = ['btn', color[args.Style] ?? color.Solid, sizes[args.Size] ?? ''].filter(Boolean).join(' ');
    return (
      <div style={{ backgroundColor: `var(--az-color-brand-${color.surface})`, padding: '2rem' }}>
        <button type="button" className={className}>
          {args.Label}
        </button>
      </div>
    );
  },
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Button docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
