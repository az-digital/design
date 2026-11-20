import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// radios with the markup from its Forms docs. The controls choose the labels,
// and disable them. Focus comes from the keyboard or pointer.

type RadioArgs = {
  'First label': string;
  'Second label': string;
  Disabled: boolean;
};

const meta = {
  title: 'Primary/Components/Inputs/Radio',
  args: { 'First label': 'In person', 'Second label': 'Online', Disabled: false },
  argTypes: {
    'First label': { control: 'text' },
    'Second label': { control: 'text' },
    Disabled: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem', maxWidth: '32rem' }}>
      <fieldset>
        <legend className="form-label">How will you attend?</legend>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="radio-story" id="radio-story-1" defaultChecked disabled={args.Disabled} />
          <label className="form-check-label" htmlFor="radio-story-1">
            {args['First label']}
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="radio-story" id="radio-story-2" disabled={args.Disabled} />
          <label className="form-check-label" htmlFor="radio-story-2">
            {args['Second label']}
          </label>
        </div>
      </fieldset>
    </div>
  ),
  // The contract check. It reads the radio at rest, then checked, focused and
  // disabled, whatever the controls show.
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector<HTMLInputElement>('.form-check-input')!;
    const parts = { root: input.closest<HTMLElement>('.form-check')!, input, label: input.parentElement!.querySelector<HTMLElement>('.form-check-label')! };
    await expect(checkContract({ parts, focus: input, control: input }, 'radio')).toEqual([]);
  },
} satisfies Meta<RadioArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Radio docs page, not as its own page in the sidebar. Its play
// function is the Radio's contract check.
export const Default: Story = { tags: ['!dev'] };
