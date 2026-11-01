import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// checkbox with the markup from its Forms docs. The controls choose its label
// and value, and disable it. Focus comes from the keyboard or pointer.

const values = ['Unchecked', 'Checked', 'Indeterminate'] as const;

type CheckboxArgs = {
  Label: string;
  Value: (typeof values)[number];
  Disabled: boolean;
};

const meta = {
  title: 'Primary/Components/Inputs/Checkbox',
  args: { Label: 'Email me about events', Value: 'Checked', Disabled: false },
  argTypes: {
    Label: { control: 'text' },
    Value: { control: 'inline-radio', options: values },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="checkbox-story"
          // Remounts when Value changes, so the box shows the chosen value.
          key={args.Value}
          defaultChecked={args.Value === 'Checked'}
          ref={(input) => {
            if (input) input.indeterminate = args.Value === 'Indeterminate';
          }}
          disabled={args.Disabled}
        />
        <label className="form-check-label" htmlFor="checkbox-story">
          {args.Label}
        </label>
      </div>
    </div>
  ),
} satisfies Meta<CheckboxArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Checkbox docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
