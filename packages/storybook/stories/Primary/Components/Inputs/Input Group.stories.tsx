import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// input group with the markup from its Input group docs. The controls choose
// what's attached to the field, and its size. Focus comes from the keyboard or
// pointer.

const sizes = { Default: '', Small: 'input-group-sm', Large: 'input-group-lg' } as const;

type InputGroupArgs = {
  Size: keyof typeof sizes;
  'Add-on': string;
  Placeholder: string;
  Button: string;
};

const meta = {
  title: 'Primary/Components/Inputs/Input Group',
  // New to the design system: marked New in the sidebar (.storybook/manager.ts).
  tags: ['new'],
  args: {
    Size: 'Default',
    'Add-on': '@',
    Placeholder: 'Username',
    Button: 'Button',
  },
  argTypes: {
    Size: { control: 'inline-radio', options: Object.keys(sizes) },
    'Add-on': { control: 'text', description: 'Text before the field. Clear it for no add-on.' },
    Placeholder: { control: 'text' },
    Button: { control: 'text', description: 'The attached button’s label. Clear it for no button.' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem' }}>
      <div className={['input-group', sizes[args.Size] ?? ''].filter(Boolean).join(' ')}>
        {args['Add-on'] && (
          <span className="input-group-text" id="input-group-story-addon">
            {args['Add-on']}
          </span>
        )}
        <input
          type="text"
          className="form-control"
          placeholder={args.Placeholder}
          aria-label={args.Placeholder || 'Input group example'}
          aria-describedby={args['Add-on'] ? 'input-group-story-addon' : undefined}
        />
        {args.Button && (
          <button className="btn btn-outline-blue" type="button">
            {args.Button}
          </button>
        )}
      </div>
    </div>
  ),
  // The contract check, at the default size. Where the field, add-on and button
  // meet, their corners are square, so corners aren't checked part by part. At the
  // small and large sizes, the release's button keeps the default size's padding
  // (see the pull request's update instructions), so only the default is checked.
  play: async ({ canvasElement, args }) => {
    if (args.Size !== 'Default') return;
    const field = canvasElement.querySelector<HTMLInputElement>('.form-control')!;
    const part = (selector: string) => canvasElement.querySelector<HTMLElement>(selector) ?? undefined;
    const parts = { root: field.parentElement!, field, addon: part('.input-group-text'), button: part('.input-group .btn') };
    const skip = ['field border.radius', 'addon border.radius', 'button border.radius'];
    await expect(checkContract({ parts: parts as typeof parts & { root: HTMLElement }, focus: field, control: field, skip }, 'input-group')).toEqual([]);
  },
} satisfies Meta<InputGroupArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Input Group docs page, not as its own page in the sidebar. Its
// play function is the input group's contract check.
export const Default: Story = { tags: ['!dev'] };
