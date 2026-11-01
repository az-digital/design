import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// select with the markup from its Forms docs. The controls choose its size and
// label, and disable it. Focus comes from the keyboard or pointer.

const sizes = { Default: '', Small: 'form-select-sm', Large: 'form-select-lg' } as const;

type SelectArgs = {
  Size: keyof typeof sizes;
  Label: string;
  Disabled: boolean;
};

const meta = {
  title: 'Primary/Components/Inputs/Select',
  args: { Size: 'Default', Label: 'College', Disabled: false },
  argTypes: {
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    Label: { control: 'text' },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <label htmlFor="select-story" className="form-label">
        {args.Label}
      </label>
      <select
        id="select-story"
        className={['form-select', sizes[args.Size] ?? ''].filter(Boolean).join(' ')}
        disabled={args.Disabled}
        defaultValue=""
      >
        <option value="" disabled>
          Choose a college
        </option>
        <option>College of Engineering</option>
        <option>College of Fine Arts</option>
        <option>College of Science</option>
      </select>
    </div>
  ),
} satisfies Meta<SelectArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Select docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
