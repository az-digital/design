import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkCard } from './cards';

// A title, text and one button. The card isn't a link itself. The controls are
// the card's props. Arizona Bootstrap gives a Cloud card its title and text
// colors only with .hover, so .text-azurite and .text-tinta set them here, and .mt-3
// puts the button 32px below the text.

type CallToActionCardArgs = { Title: string; Text: string; Button: string; 'Button link': string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Call to Action Card',
  tags: ['!dev'],
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
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2 text-azurite">{args.Title}</h3>
          <p className="card-text text-tinta">{args.Text}</p>
          <a href={args['Button link']} className="btn btn-red mt-3">{args.Button}</a>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<CallToActionCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Call to Action Card docs page. Its play function is the card's
// contract check.
export const Default: Story = { play: checkCard('call-to-action-card') };
