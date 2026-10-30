import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// The plain card: a title and rich text in its .card-body, which is its slot, and
// an optional header and footer. It isn't a link. The controls are the card's
// props: Body is the slot's HTML after the title, such as paragraphs or a list.
// Leave the header or footer empty for none.

const escape = (text: string) => text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

type CardArgs = { Title: string; Body: string; Header: string; Footer: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Card',
  tags: ['!dev'],
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
    Header: { control: 'text', description: 'A label above the content. Leave it empty for none.' },
    Footer: { control: 'text', description: 'A note below the content. Leave it empty for none.' },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        {args.Header && <div className="card-header">{args.Header}</div>}
        {/* The slot: the title, then the control's HTML, as an editor's rich text would be. */}
        <div
          className="card-body"
          dangerouslySetInnerHTML={{ __html: `<h3 class="card-title h5 fw-bold mb-2">${escape(args.Title)}</h3>${args.Body}` }}
        />
        {args.Footer && <div className="card-footer">{args.Footer}</div>}
      </div>
    </Frame>
  ),
} satisfies Meta<CardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
