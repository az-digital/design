import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkLinkCard } from './cards';

// A title and text that go to one page: the title link covers the whole card, and
// .bg-cloud with .hover gives it the hover colors. The controls are the card's
// content; hover it, or press Tab, for its hover colors.

type LinkCardArgs = { Title: string; Text: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Link Card',
  tags: ['!dev'],
  args: {
    Title: 'Distance Locations',
    Text: 'Close-to-home flexibility with locations across the state of Arizona.',
  },
  argTypes: {
    Title: { control: 'text' },
    Text: { control: 'text' },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud hover">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">
            <a href="#link-card" className="stretched-link text-reset text-decoration-none">{args.Title}</a>
          </h3>
          <p className="card-text">{args.Text}</p>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<LinkCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Link Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkLinkCard('link-card') };
