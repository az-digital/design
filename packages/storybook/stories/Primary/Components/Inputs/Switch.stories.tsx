import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// switch with the markup from its Forms docs. The controls choose its label and
// whether it's on, and disable it. Focus comes from the keyboard or pointer.

type SwitchArgs = {
  Label: string;
  On: boolean;
  Disabled: boolean;
};

const meta = {
  title: 'Primary/Components/Inputs/Switch',
  args: { Label: 'Show captions', On: true, Disabled: false },
  argTypes: {
    Label: { control: 'text' },
    On: { control: 'boolean' },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="switch-story"
          // Remounts when On changes, so the switch shows the chosen value.
          key={String(args.On)}
          defaultChecked={args.On}
          disabled={args.Disabled}
        />
        <label className="form-check-label" htmlFor="switch-story">
          {args.Label}
        </label>
      </div>
    </div>
  ),
} satisfies Meta<SwitchArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Switch docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
