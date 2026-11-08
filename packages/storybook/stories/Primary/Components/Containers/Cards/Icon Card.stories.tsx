import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { IconCardProps } from '@az-digital/components-html';
import { Frame, checkCard } from './cards';

// A Link Card with an icon above the title. The icon is a Material Symbols glyph
// in its outline style, at a light weight, to match arizona.edu. The controls are
// the card's props; hover it, or press Tab, for its hover colors.

const icons = ['person_raised_hand', 'school', 'location_on', 'calendar_month', 'volunteer_activism'];

type IconCardArgs = { Icon: string; Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Icon Card',
  tags: ['!dev', 'lib:html'],
  ...componentStories('icon-card', {
    props: (args: IconCardArgs): IconCardProps => ({
      icon: args.Icon,
      title: args.Title,
      text: args.Text,
      link: args.Link,
    }),
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
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
} satisfies Meta<IconCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Icon Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkCard('icon-card') };
