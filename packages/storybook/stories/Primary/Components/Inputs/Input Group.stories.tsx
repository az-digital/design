import type { Meta, StoryObj } from '@storybook/react-vite';

// Arizona Bootstrap's latest release, loaded in preview-head.html, drawing its
// search form (.az-search), the only input group designed so far, with the
// markup from its Search docs, on the Blue it's designed for. Hover and focus
// come from the pointer and keyboard.

type InputGroupArgs = {
  Placeholder: string;
};

const meta = {
  title: 'Primary/Components/Inputs/Input Group',
  args: {
    Placeholder: 'Search',
  },
  argTypes: {
    Placeholder: { control: 'text' },
  },
  render: (args) => (
    <div style={{ backgroundColor: 'var(--az-color-brand-blue)', padding: '2rem' }}>
      <form className="az-search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="visually-hidden" htmlFor="az-search-story">
          Search
        </label>
        <div className="input-group">
          <input
            id="az-search-story"
            className="form-control"
            type="search"
            placeholder={args.Placeholder}
            aria-label="Search"
          />
          <button className="btn" type="submit" aria-label="Submit search">
            <span className="az-search-icon" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  ),
} satisfies Meta<InputGroupArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Input Group docs page, not as its own page in the sidebar.
export const Default: Story = { tags: ['!dev'] };
