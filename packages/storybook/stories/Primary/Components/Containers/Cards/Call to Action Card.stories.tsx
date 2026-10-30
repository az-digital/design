import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// A title, text and one button. The card isn't a link itself. The controls are
// the card's props.

type CallToActionCardArgs = { Title: string; Text: string; Button: string; 'Button link': string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Call to Action Card',
  tags: ['!dev'],
  // Required props first, so the controls table reads as the card's prop list.
  parameters: { controls: { sort: 'requiredFirst' } },
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
          <h3 className="card-title h5 fw-bold mb-2">{args.Title}</h3>
          <p className="card-text">{args.Text}</p>
          <a href={args['Button link']} className="btn btn-red">{args.Button}</a>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<CallToActionCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Call to Action Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
