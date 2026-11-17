import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { LinkCardProps } from '@az-digital/components-html';
import { Frame, checkCard } from './cards';

// A title and text that go to one page: the title link covers the whole card, and
// .bg-cloud with .hover gives it the hover colors. The controls are the card's
// props; hover it, or press Tab, for its hover colors.

type LinkCardArgs = { Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Link Card',
  tags: ['!dev', 'lib:html', 'lib:react'],
  ...componentStories('link-card', {
    props: (args: LinkCardArgs): LinkCardProps => ({ title: args.Title, text: args.Text, link: args.Link }),
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
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
} satisfies Meta<LinkCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Link Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkCard('link-card') };
