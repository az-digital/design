import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// A title, text and a list of links. The card isn't a link itself. The controls
// are the card's content: Links is a list of link labels.

type QuickLinksCardArgs = { Title: string; Text: string; Links: string[] };

const meta = {
  title: 'Primary/Components/Containers/Cards/Quick Links Card',
  tags: ['!dev'],
  args: {
    Title: 'Academic Resources',
    Text: 'Find the support and guidance you need to succeed in the classroom.',
    Links: ['Contact Your Advisor', 'Course Catalog & Degree Programs', 'Registrar & Transcripts'],
  },
  argTypes: {
    Title: { control: 'text' },
    Text: { control: 'text' },
    Links: { control: 'object' },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">{args.Title}</h3>
          <p className="card-text">{args.Text}</p>
          <ul className="list-unstyled">
            {(args.Links ?? []).map((label) => (
              <li key={label}>
                <a href="#quick-links-card" className="card-link">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<QuickLinksCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Quick Links Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
