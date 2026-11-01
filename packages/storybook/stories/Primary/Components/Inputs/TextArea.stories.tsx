import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// text area with the markup from its Forms docs. The controls choose its size,
// label, placeholder and rows, and disable it. Focus comes from the keyboard or
// pointer.

const sizes = { Default: '', Small: 'form-control-sm', Large: 'form-control-lg' } as const;

type TextAreaArgs = {
  Size: keyof typeof sizes;
  Label: string;
  Placeholder: string;
  Rows: number;
  Disabled: boolean;
};

// The contract options for each size. A large field's text grows with the screen
// width up to 1200px, so it isn't checked at the large size.
const sizeOptions = (size: string) => ({ Small: ['size.small'], Large: ['size.large'] })[size] ?? [];

const meta = {
  title: 'Primary/Components/Inputs/TextArea',
  // New to the design system: marked New in the sidebar (.storybook/manager.ts).
  tags: ['new'],
  args: { Size: 'Default', Label: 'Message', Placeholder: 'What would you like to ask?', Rows: 3, Disabled: false },
  argTypes: {
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    Label: { control: 'text' },
    Placeholder: { control: 'text' },
    Rows: { control: { type: 'number', min: 1, max: 12 } },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <label htmlFor="textarea-story" className="form-label">
        {args.Label}
      </label>
      <textarea
        id="textarea-story"
        className={['form-control', sizes[args.Size] ?? ''].filter(Boolean).join(' ')}
        placeholder={args.Placeholder}
        rows={args.Rows}
        disabled={args.Disabled}
      />
    </div>
  ),
  // The contract check, for whichever size the controls choose.
  play: async ({ canvasElement, args }) => {
    const field = canvasElement.querySelector<HTMLTextAreaElement>('textarea.form-control')!;
    const options = sizeOptions(args.Size);
    const skip = options.includes('size.large') ? ['root font.size'] : [];
    await expect(checkContract({ parts: { root: field }, focus: field, control: field, skip }, 'textarea', options)).toEqual([]);
  },
} satisfies Meta<TextAreaArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the TextArea docs page, not as its own page in the sidebar. Its play
// function is the TextArea's contract check.
export const Default: Story = { tags: ['!dev'] };
