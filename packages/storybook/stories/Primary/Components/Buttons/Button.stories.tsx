import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// The controls copy the Figma Buttons component's properties: Color, Size, Style
// and Label. Hover and focus come from the pointer and keyboard.

// Each Figma color, the background it's for, and the class for each style.
const colors = {
  Red: { surface: 'white', Solid: 'btn-red', Outline: 'btn-outline-red' },
  Rain: { surface: 'blue', Solid: 'btn-rain', Outline: 'btn-outline-rain' },
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
    const className = [
      'btn',
      color[args.Style] ?? color.Solid,
      sizes[args.Size] ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      // bg-<surface> lets surface-specific rules match, such as outline White's
      // Blue hover text on Arroyo Blue; the inline fill draws the surface itself.
      <div
        className={`bg-${color.surface}`}
        style={{ backgroundColor: `var(--az-color-brand-${color.surface})`, padding: '2rem' }}
      >
        <a className={className} href="#">
          {args.Label}
        </a>
      </div>
    );
  },
} satisfies Meta<ButtonArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Button docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };

// Every option in button.contract.json, with the class that draws it and the
// background it's for.
const contractColors = {
  red: { className: 'btn-red', surface: 'white' },
  'outline-red': { className: 'btn-outline-red', surface: 'white' },
  blue: { className: 'btn-blue', surface: 'white' },
  'outline-blue': { className: 'btn-outline-blue', surface: 'white' },
  rain: { className: 'btn-rain', surface: 'blue' },
  'outline-rain': { className: 'btn-outline-rain', surface: 'blue' },
  'white-text-red': { className: 'btn-white-text-red', surface: 'red' },
  'white-text-blue': { className: 'btn-white-text-blue', surface: 'arroyo-blue' },
  'outline-white-text-red': { className: 'btn-outline-white', surface: 'red' },
  'outline-white-text-blue': { className: 'btn-outline-white', surface: 'arroyo-blue' },
};
const contractSizes = { default: '', small: 'btn-sm', large: 'btn-lg' };

/**
 * The contract check: every size and color, each compared with what
 * button.contract.json says it should be. Runs as a test (npm run test:storybook),
 * not in the sidebar.
 */
export const MatchesContract: Story = {
  tags: ['!dev', '!autodocs'],
  render: () => (
    <div>
      {Object.entries(contractColors).map(([color, { className, surface }]) => (
        <div
          key={color}
          className={`bg-${surface}`}
          style={{ backgroundColor: `var(--az-color-brand-${surface})`, padding: '1rem', display: 'flex', gap: '1rem' }}
        >
          {Object.entries(contractSizes).map(([size, sizeClass]) => (
            <a
              key={size}
              className={['btn', className, sizeClass].filter(Boolean).join(' ')}
              href="#"
              data-color={color}
              data-size={size}
            >
              Label
            </a>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = [...canvasElement.querySelectorAll<HTMLElement>('.btn')];
    await expect(buttons).toHaveLength(Object.keys(contractColors).length * Object.keys(contractSizes).length);
    const mismatches = buttons.flatMap((button) => {
      const { color, size } = button.dataset;
      const options = [`color.${color}`, ...(size === 'default' ? [] : [`size.${size}`])];
      return checkContract(button, 'button', options);
    });
    await expect(mismatches).toEqual([]);
  },
};
