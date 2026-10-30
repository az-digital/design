import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// A title, text and a list of links. The card isn't a link itself. The controls
// are the card's props: Links is a list of links, each a label and the page it
// goes to.

type QuickLink = { label: string; link: string };

type QuickLinksCardArgs = { Title: string; Text: string; Links: QuickLink[] };

const meta = {
  title: 'Primary/Components/Containers/Cards/Quick Links Card',
  tags: ['!dev'],
  args: {
    Title: 'Academic Resources',
    Text: 'Find the support and guidance you need to succeed in the classroom.',
    Links: [
      { label: 'Contact Your Advisor', link: '#advising' },
      { label: 'Course Catalog & Degree Programs', link: '#catalog' },
      { label: 'Registrar & Transcripts', link: '#registrar' },
    ],
  },
  argTypes: {
    Title: { control: 'text', description: 'What the links have in common.', type: { name: 'string', required: true } },
    Text: { control: 'text', description: 'A sentence on what the links are for.', type: { name: 'string', required: true } },
    Links: {
      control: 'object',
      description: 'Three to five links, each a label (where it goes, not "Click here") and the page it goes to.',
      type: { name: 'array', value: { name: 'object', value: { label: { name: 'string' }, link: { name: 'string' } } }, required: true },
    },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">{args.Title}</h3>
          <p className="card-text">{args.Text}</p>
          <ul className="list-unstyled">
            {(args.Links ?? []).map(({ label, link }) => (
              <li key={`${label} ${link}`}>
                <a href={link} className="card-link">{label}</a>
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
