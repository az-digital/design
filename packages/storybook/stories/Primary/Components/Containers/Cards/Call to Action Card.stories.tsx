import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// A title, text and one button. The card isn't a link itself. The controls are
// the card's content.

type CallToActionCardArgs = { Title: string; Text: string; Button: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Call to Action Card',
  tags: ['!dev'],
  args: {
    Title: 'Bear Down Rundown',
    Text: 'Your weekly update for all main campus undergraduates during the academic year.',
    Button: 'Subscribe',
  },
  argTypes: {
    Title: { control: 'text' },
    Text: { control: 'text' },
    Button: { control: 'text' },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">{args.Title}</h3>
          <p className="card-text">{args.Text}</p>
          <a href="#call-to-action-card" className="btn btn-red">{args.Button}</a>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<CallToActionCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Call to Action Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
