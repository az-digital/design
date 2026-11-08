import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { CallToActionCardProps } from '@az-digital/components-html';
import { Frame, checkCard } from './cards';

// A title, text and one button. The whole card is clickable: .stretched-link on
// the button makes its link cover the card. The controls are the card's props.
// Arizona Bootstrap gives a Cloud card its title and text colors only with .hover,
// so .text-azurite and .text-tinta set them here, and .mt-3 puts the button 32px
// below the text.

type CallToActionCardArgs = { Title: string; Text: string; Button: string; 'Button link': string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Call to Action Card',
  tags: ['!dev', 'lib:html'],
  ...componentStories('call-to-action-card', {
    props: (args: CallToActionCardArgs): CallToActionCardProps => ({
      title: args.Title,
      text: args.Text,
      button: args.Button,
      buttonLink: args['Button link'],
    }),
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
  args: {
    Title: 'Bear Down Rundown',
    Text: 'Your weekly update for all main campus undergraduates during the academic year.',
    Button: 'Subscribe',
    'Button link': '#call-to-action-card',
  },
  argTypes: {
    Title: { control: 'text', description: "What's on offer.", type: { name: 'string', required: true } },
    Text: { control: 'text', description: 'A sentence on why to take the action.', type: { name: 'string', required: true } },
    Button: { control: 'text', description: 'The action, in a word or two, such as "Subscribe". It\'s the button\'s text.', type: { name: 'string', required: true } },
    'Button link': { control: 'text', description: 'The page where people take the action.', type: { name: 'string', required: true } },
  },
} satisfies Meta<CallToActionCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Call to Action Card docs page. Its play function is the card's
// contract check.
export const Default: Story = { play: checkCard('call-to-action-card') };
