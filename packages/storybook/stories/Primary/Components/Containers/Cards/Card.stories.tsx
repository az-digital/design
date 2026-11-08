import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { CardProps } from '@az-digital/components-html';
import { Frame, checkCard } from './cards';

// The plain card: a Cloud box whose .card-body is its slot, for rich text. It isn't
// a link. The Default story has one line of text in the slot; Office Hours fills it
// with a title and a list. Arizona Bootstrap gives a Cloud card its title and text
// colors only with .hover, so .text-azurite and .text-tinta set them here.

type CardArgs = { Title: string; Body: string; Header: string; Footer: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Card',
  tags: ['!dev', 'lib:html', 'lib:react'],
  ...componentStories('card', {
    props: (args: CardArgs): CardProps => ({
      title: args.Title,
      body: args.Body,
      header: args.Header,
      footer: args.Footer,
    }),
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
  args: {
    Title: 'Office Hours',
    Body: '<p>Drop in, or book a time with an advisor.</p><ul><li>Monday to Thursday, 8 a.m. to 5 p.m.</li><li>Friday, 8 a.m. to noon</li></ul>',
    Header: '',
    Footer: '',
  },
  argTypes: {
    Title: { control: 'text', description: "The card's heading.", type: { name: 'string', required: true } },
    Body: {
      control: 'text',
      description: "The card's slot: rich text after the title, such as paragraphs, a list or a small table. Written as HTML here.",
      type: { name: 'string', required: true },
    },
    Header: { control: 'text', description: 'A label above the content. Leave it empty for none.', type: { name: 'string', required: false } },
    Footer: { control: 'text', description: 'A note below the content. Leave it empty for none.', type: { name: 'string', required: false } },
  },
} satisfies Meta<CardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Card docs page, not as its own page in the sidebar. Its play function
// is the card's contract check.
export const Default: Story = { tags: ['!dev'], args: { Body: '<p>Some basic text in the card.</p>' }, play: checkCard('card') };

// A title and rich text in the slot: a paragraph and a list. It has its own page in the
// sidebar and isn't on the docs page.
export const OfficeHours: Story = {
  args: {
    Body: '<p>Drop in, or book a time with an advisor.</p><ul><li>Monday to Thursday, 8 a.m. to 5 p.m.</li><li>Friday, 8 a.m. to noon</li></ul>',
  },
  play: checkCard('card'),
};
