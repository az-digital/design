import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { ImageCardProps } from '@az-digital/components-html';
import { Frame, checkCard, widePhoto } from './cards';

// A Link Card with a photo above the title, which zooms in on hover. The controls
// are the card's props; hover it, or press Tab, for its hover colors and zoom.

type ImageCardArgs = { Image: string; 'Image description': string; Title: string; Text: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Image Card',
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
      type: { name: 'string', required: false },
    },
    Title: { control: 'text', description: "The page's name, or what people will do there. It's the link's text.", type: { name: 'string', required: true } },
    Text: { control: 'text', description: "A sentence on what's on the page.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
  tags: ['!dev', 'lib:html'],
  ...componentStories('image-card', { props: (args: ImageCardArgs): ImageCardProps => ({ image: args.Image || widePhoto, imageDescription: args['Image description'], title: args.Title, text: args.Text, link: args.Link }) }),
  decorators: [(Story) => <Frame><Story /></Frame>],
} satisfies Meta<ImageCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Image Card docs page. Its play function is the card's contract check.
export const Default: Story = { play: checkCard('image-card') };
