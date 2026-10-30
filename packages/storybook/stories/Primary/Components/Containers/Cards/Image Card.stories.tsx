import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkLinkCard, widePhoto } from './cards';

// A Link Card with a photo above the title, which zooms in on hover. The controls
// are the card's props; hover it, or press Tab, for its hover colors and zoom.

type ImageCardArgs = { Image: string; 'Image description': string; Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Image Card',
  tags: ['!dev'],
  args: {
    Image: '',
    'Image description': '',
    Title: 'Undergraduate Degrees',
    Text: 'Our undergraduate programs give you the freedom to follow your interests.',
    Link: '#image-card',
  },
  argTypes: {
    Image: { control: 'text', description: "The photo's URL, cropped to 5:3. Leave it empty here for a placeholder.", type: { name: 'string', required: true } },
    'Image description': {
      control: 'text',
      description: "The photo's alt text. Leave it empty when the title and text say what the photo shows, so screen readers skip it.",
    },
    Title: { control: 'text', description: "The page's name, or what people will do there. It's the link's text.", type: { name: 'string', required: true } },
    Text: { control: 'text', description: "A sentence on what's on the page.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud hover overflow-hidden">
        <div className="overflow-hidden">
          <img className="card-img-top img-fluid hover-img-zoom-in" src={args.Image || widePhoto} alt={args['Image description']} />
        </div>
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">
            <a href={args.Link} className="stretched-link text-reset text-decoration-none">{args.Title}</a>
          </h3>
          <p className="card-text">{args.Text}</p>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<ImageCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Image Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkLinkCard('image-card') };
