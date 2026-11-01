import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// text area with the markup from its Forms docs. The controls choose its size,
// label and rows, and disable it. Focus comes from the keyboard or pointer.

const sizes = { Default: '', Small: 'form-control-sm', Large: 'form-control-lg' } as const;

type TextAreaArgs = {
  Size: keyof typeof sizes;
  Label: string;
  Rows: number;
  Disabled: boolean;
};

const meta = {
  title: 'Primary/Components/Inputs/TextArea',
  args: { Size: 'Default', Label: 'Message', Rows: 3, Disabled: false },
  argTypes: {
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    Label: { control: 'text' },
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
        rows={args.Rows}
        disabled={args.Disabled}
      />
    </div>
  ),
} satisfies Meta<TextAreaArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the TextArea docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
