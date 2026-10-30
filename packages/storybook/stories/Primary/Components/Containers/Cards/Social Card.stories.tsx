import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame } from './cards';

// A title, text and a row of social media links, each an Arizona icon that names
// its site for screen readers. The card isn't a link itself. The controls are the
// card's content: Sites is the list of sites to link to.

const sites = {
  LinkedIn: 'az-icon-linkedin-circle',
  Instagram: 'az-icon-instagram-circle',
  Facebook: 'az-icon-facebook-circle',
  YouTube: 'az-icon-youtube-circle',
  X: 'az-icon-x-twitter-circle',
} as const;

type SocialCardArgs = { Title: string; Text: string; Sites: (keyof typeof sites)[] };

const meta = {
  title: 'Primary/Components/Containers/Cards/Social Card',
  tags: ['!dev'],
  args: {
    Title: 'Follow Along',
    Text: 'Follow the university’s social media channels to stay up to date on events, campus highlights, and everything happening across Arizona.',
    Sites: ['LinkedIn', 'Instagram', 'Facebook', 'YouTube'],
  },
  argTypes: {
    Title: { control: 'text' },
    Text: { control: 'text' },
    Sites: { control: 'check', options: Object.keys(sites) },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud border-0">
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">{args.Title}</h3>
          <p className="card-text">{args.Text}</p>
          <ul className="list-inline">
            {(args.Sites ?? []).map((site) => (
              <li key={site} className="list-inline-item">
                <a href="#social-card" aria-label={site}>
                  <i className={sites[site]} aria-hidden="true"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<SocialCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Social Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
