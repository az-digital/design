import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { CardProps } from '@az-digital/components-html';
import { Frame, checkCard } from './cards';

// The plain card: a Cloud box whose .card-body is its slot, for rich text. It isn't
// a link. The Default story has one line of text in the slot; Office Hours fills it
// with a title and a list. Arizona Bootstrap gives a Cloud card its title and text
// colors only with .hover, so .text-azurite and .text-tinta set them here.

type CardArgs = { Slot: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Card',
  // The slot's HTML is each story's content, not a control. Both stories are fixed
  // examples with nothing to change and no actions, so those tabs are off.
  args: { Slot: '' },
  tags: ['lib:html'],
  ...componentStories('card', {
    props: (args: CardArgs): CardProps => ({ slot: args.Slot }),
    parameters: {
      controls: { disable: true },
      actions: { disable: true },
      // The design tokens the card's contract points at.
      tokens: ['az.color.bg.card.cloud', 'az.color.brand.azurite', 'az.color.brand.tinta', 'az.font-weight.bold', 'az.font-weight.normal', 'az.radius.4', 'az.spacing.100', 'az.spacing.150', 'az.spacing.200', 'az.spacing.300'],
    },
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
} satisfies Meta<CardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Card docs page, not as its own page in the sidebar. Its play function
// is the card's contract check.
export const Default: Story = { tags: ['!dev'], args: { Slot: '<p>Some basic text in the card.</p>' }, play: checkCard('card') };

// A title and rich text in the slot: a paragraph and a list. It has its own page in the
// sidebar and isn't on the docs page.
export const OfficeHours: Story = {
  args: {
    Slot: '<h3 class="card-title h5 fw-bold mb-2 text-azurite">Office Hours</h3><p>Drop in, or book a time with an advisor.</p><ul><li>Monday to Thursday, 8 a.m. to 5 p.m.</li><li>Friday, 8 a.m. to noon</li></ul>',
  },
  play: checkCard('card'),
};
