import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, squarePhoto } from './cards';

// A square photo with only a title on it, with the markup in Arizona Bootstrap's
// "Title on Image" docs. The controls are the card's props; hover it, or press
// Tab, for the zoom and the underline.

type TitleOnImageCardArgs = { Image: string; 'Image description': string; Title: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Title on Image Card',
  tags: ['!dev'],
  // Required props first, so the controls table reads as the card's prop list.
  parameters: { controls: { sort: 'requiredFirst' } },
  args: { Image: '', 'Image description': '', Title: 'Undergraduate', Link: '#title-on-image-card' },
  argTypes: {
    Image: { control: 'text', description: "The photo's URL. It's cropped to a square. Leave it empty here for a placeholder.", type: { name: 'string', required: true } },
    'Image description': {
      control: 'text',
      description: "The photo's alt text. Leave it empty, so screen readers skip it: the title says where the card goes.",
    },
    Title: { control: 'text', description: "One to three words for where the card goes. It's the link's text.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
  render: (args) => (
    <Frame>
      <div className="card border-0 hover overflow-hidden">
        <div className="ratio ratio-1x1 overflow-hidden">
          <img className="card-img-top object-fit-cover hover-img-zoom-in" src={args.Image || squarePhoto} alt={args['Image description']} />
          <div className="card-img-overlay p-0 d-flex flex-column">
            <h3 className="card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline">
              <a href={args.Link} className="stretched-link text-reset text-decoration-none">{args.Title}</a>
            </h3>
          </div>
        </div>
      </div>
    </Frame>
  ),
} satisfies Meta<TitleOnImageCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Title on Image Card docs page, not as its own page in the sidebar.
export const Default: Story = {};
