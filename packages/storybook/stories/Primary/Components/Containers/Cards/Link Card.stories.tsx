import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkLinkCard } from './cards';

// A title and text that go to one page: the title link covers the whole card, and
// .bg-cloud with .hover gives it the hover colors. The controls are the card's
// props; hover it, or press Tab, for its hover colors.

type LinkCardArgs = { Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Link Card',
  tags: ['!dev'],
  args: {
    Title: 'Distance Locations',
    Text: 'Close-to-home flexibility with locations across the state of Arizona.',
    Link: '#link-card',
  },
  argTypes: {
    Title: { control: 'text', description: "The page's name, or what people will do there. It's the link's text.", type: { name: 'string', required: true } },
    Text: { control: 'text', description: "A sentence on what's on the page.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud hover">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">
            <a href={args.Link} className="stretched-link text-reset text-decoration-none">{args.Title}</a>
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
