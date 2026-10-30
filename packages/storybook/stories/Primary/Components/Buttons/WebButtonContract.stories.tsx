import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { defineAzButton, renderAzButton, type ButtonColor, type ButtonSize } from '@az-digital/components-web';
import { checkContract } from '../contractCheck';

// Checks the Web Components library's <az-button> against the button contract,
// in every color at every size. It's a test, so it stays out of the sidebar
// and the docs.

const colors: ButtonColor[] = [
  'red',
  'outline-red',
  'blue',
  'outline-blue',
  'rain',
  'outline-rain',
  'white-text-red',
  'white-text-blue',
  'outline-white',
];
const sizes: (ButtonSize | undefined)[] = [undefined, 'small', 'large'];

const markup = colors
  .flatMap((color) => sizes.map((size) => renderAzButton({ label: 'Label', color, size })))
  .join(' ');

// Where <az-button> keeps its hover colors (src/az-button.styles.ts).
const hover = { fill: '--hover-fill', 'border.color': '--hover-fill', color: '--hover-label' };

const meta = {
  title: 'Primary/Components/Buttons/Web Components contract check',
  tags: ['!dev', '!autodocs'],
  render: () => {
    defineAzButton();
    return <div dangerouslySetInnerHTML={{ __html: markup }} />;
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AzButton: Story = {
  play: async ({ canvasElement }) => {
    const mismatches = [...canvasElement.querySelectorAll('az-button')].flatMap((element) => {
      const button = element.shadowRoot?.querySelector('button');
      if (!button) return [`${element.outerHTML}: no button in its shadow root`];
      const options = ['color', 'size'].flatMap((axis) =>
        element.hasAttribute(axis) ? [`${axis}.${element.getAttribute(axis)}`] : [],
      );
      return checkContract(button, 'button', options, { hover });
    });
    await expect(mismatches).toEqual([]);
  },
};
