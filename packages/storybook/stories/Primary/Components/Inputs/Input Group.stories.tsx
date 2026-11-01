import type { Meta, StoryObj } from '@storybook/react-vite';

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
} satisfies Meta<InputGroupArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Input Group docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
