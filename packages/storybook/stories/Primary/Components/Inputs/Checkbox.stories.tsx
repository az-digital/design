import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

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
  // New to the design system: marked New in the sidebar (.storybook/manager.ts).
  tags: ['new'],
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
          // Remounts when Value changes, so the box shows the chosen value. The
          // ref sets indeterminate once per mount, so a click that clears it
          // stays cleared when another control changes.
          key={args.Value}
          defaultChecked={args.Value === 'Checked'}
          ref={(input) => {
            if (input && !input.dataset.valueSet) {
              input.indeterminate = args.Value === 'Indeterminate';
              input.dataset.valueSet = 'true';
            }
          }}
          disabled={args.Disabled}
        />
        <label className="form-check-label" htmlFor="checkbox-story">
          {args.Label}
        </label>
      </div>
    </div>
  ),
  // The contract check. It reads the checkbox at rest, then checked, focused and
  // disabled, whatever the controls show.
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('.form-check-input')!;
    const parts = { root: input.closest<HTMLElement>('.form-check')!, input, label: input.parentElement!.querySelector<HTMLElement>('.form-check-label')! };
    await expect(checkContract({ parts, focus: input, control: input }, 'checkbox')).toEqual([]);
  },
} satisfies Meta<CheckboxArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Checkbox docs page, not as its own page in the sidebar. Its play
// function is the Checkbox's contract check.
export const Default: Story = { tags: ['!dev'] };
