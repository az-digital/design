import type { Meta, StoryObj } from '@storybook/react-vite';
import { Frame, checkLinkCard, widePhoto } from './cards';

// A Link Card with a photo above the title, which zooms in on hover. The controls
// are the card's content; hover it, or press Tab, for its hover colors and zoom.

type ImageCardArgs = { Title: string; Text: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Image Card',
  tags: ['!dev'],
  args: {
    Title: 'Undergraduate Degrees',
    Text: 'Our undergraduate programs give you the freedom to follow your interests.',
  },
  argTypes: {
    Title: { control: 'text' },
    Text: { control: 'text' },
  },
  render: (args) => (
    <Frame>
      <div className="card bg-cloud hover overflow-hidden">
        <div className="overflow-hidden">
          <img className="card-img-top img-fluid hover-img-zoom-in" src={widePhoto} alt="" />
        </div>
        <div className="card-body">
          <h3 className="card-title h5 fw-bold mb-2">
            <a href="#image-card" className="stretched-link text-reset text-decoration-none">{args.Title}</a>
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
