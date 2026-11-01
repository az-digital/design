import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// input group with the markup from its Input group docs. The controls choose
// what's attached to the field. Focus comes from the keyboard or pointer.

type InputGroupArgs = {
  'Add-on': string;
  Placeholder: string;
  Button: string;
};

const meta = {
  title: 'Primary/Components/Inputs/Input Group',
  args: {
    'Add-on': '@',
    Placeholder: 'Username',
    Button: 'Button',
  },
  argTypes: {
    'Add-on': { control: 'text', description: 'Text before the field. Clear it for no add-on.' },
    Placeholder: { control: 'text' },
    Button: { control: 'text', description: 'The attached button’s label. Clear it for no button.' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-white)', padding: '2rem' }}>
      <div className="input-group">
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

// Shown on the Input Group docs page, not as their own pages in the sidebar.
export const Default: Story = { tags: ['!dev'] };

// The search form in a site's navigation (.az-search), with the markup from
// Arizona Bootstrap's Search docs, on the Blue it's designed for.
export const Search: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ backgroundColor: 'var(--az-color-brand-blue)', padding: '2rem' }}>
      <form className="az-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="visually-hidden" htmlFor="az-search-story">
          Search
        </label>
        <div className="input-group">
          <input id="az-search-story" className="form-control" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn" type="submit" aria-label="Submit search">
            <span className="az-search-icon" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  ),
};
