import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkLinkCard } from './cards';

// A Link Card with an icon above the title. The icon is a Material Symbols glyph
// in its outline style, at a light weight, to match arizona.edu. The controls are
// the card's props; hover it, or press Tab, for its hover colors.

const icons = ['person_raised_hand', 'school', 'location_on', 'calendar_month', 'volunteer_activism'];

type IconCardArgs = { Icon: string; Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Icon Card',
  tags: ['!dev'],
  args: {
    Icon: 'person_raised_hand',
    Title: 'Future Students',
    Text: 'Become a Wildcat and embrace “Bear Down!” Explore information on applying, transferring, Arizona Online, and more.',
    Link: '#icon-card',
  },
  argTypes: {
    Icon: { control: 'select', options: icons, description: "A Material Symbols icon for what the page is about. It's decorative: screen readers skip it.", type: { name: 'string', required: true } },
    Title: { control: 'text', description: "The page's name, or what people will do there. It's the link's text.", type: { name: 'string', required: true } },
    Text: { control: 'text', description: "A sentence on what's on the page.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud hover">
        <div className="card-body">
          <span className="card-icon material-symbols-rounded fw-light" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">
            {args.Icon}
          </span>
          <h3 className="card-title h5 fw-bold mb-2">
            <a href={args.Link} className="stretched-link text-reset text-decoration-none">{args.Title}</a>
          </h3>
          <p className="card-text">{args.Text}</p>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<IconCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Icon Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkLinkCard('icon-card') };
