import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// text input with the markup from its Forms docs. The controls choose its size,
// label, placeholder and help text, and disable it. Focus comes from the
// keyboard or pointer.

const sizes = { Default: '', Small: 'form-control-sm', Large: 'form-control-lg' } as const;

type TextInputArgs = {
  Size: keyof typeof sizes;
  Label: string;
  Placeholder: string;
  'Help text': string;
  Disabled: boolean;
};

// The contract options for each size. A large field's text grows with the screen
// width up to 1200px, so it isn't checked at the large size.
const sizeOptions = (size: string) => ({ Small: ['size.small'], Large: ['size.large'] })[size] ?? [];

const meta = {
  title: 'Primary/Components/Inputs/Text Input',
  args: { Size: 'Default', Label: 'Email address', Placeholder: 'name@example.com', 'Help text': 'We’ll never share your email.', Disabled: false },
  argTypes: {
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    Label: { control: 'text' },
    Placeholder: { control: 'text' },
    'Help text': { control: 'text', description: 'Clear it for no help text.' },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <label htmlFor="text-input-story" className="form-label">
        {args.Label}
      </label>
      <input
        type="email"
        id="text-input-story"
        className={['form-control', sizes[args.Size] ?? ''].filter(Boolean).join(' ')}
        placeholder={args.Placeholder}
        disabled={args.Disabled}
        aria-describedby={args['Help text'] ? 'text-input-story-help' : undefined}
      />
      {args['Help text'] && (
        <div id="text-input-story-help" className="form-text">
          {args['Help text']}
        </div>
      )}
    </div>
  ),
  // The contract check, for whichever size the controls choose.
  play: async ({ canvasElement, args }) => {
    const field = canvasElement.querySelector<HTMLInputElement>('.form-control')!;
    const part = (selector: string) => canvasElement.querySelector<HTMLElement>(selector) ?? undefined;
    const parts = { root: field.parentElement!, field, label: part('.form-label'), help: part('.form-text') };
    const options = sizeOptions(args.Size);
    const skip = options.includes('size.large') ? ['field font.size'] : [];
    await expect(checkContract({ parts: parts as typeof parts & { root: HTMLElement }, focus: field, control: field, skip }, 'text-input', options)).toEqual([]);
  },
} satisfies Meta<TextInputArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Text Input docs page, not as its own page in the sidebar. Its play
// function is the Text Input's contract check.
export const Default: Story = { tags: ['!dev'] };
