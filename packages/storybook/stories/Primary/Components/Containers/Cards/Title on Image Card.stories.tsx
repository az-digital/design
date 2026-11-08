import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { TitleOnImageCardProps } from '@az-digital/components-html';
import { Frame, checkCard, squarePhoto } from './cards';

// A square photo with only a title on it, with the markup in Arizona Bootstrap's
// "Title on Image" docs. The controls are the card's props; hover it, or press
// Tab, for the zoom and the underline.

type TitleOnImageCardArgs = { Image: string; 'Image description': string; Title: string; Link: string };

const meta = {
  title: 'Primary/Components/Containers/Cards/Title on Image Card',
  tags: ['!dev', 'lib:html'],
  ...componentStories('title-on-image-card', {
    props: (args: TitleOnImageCardArgs): TitleOnImageCardProps => ({
      image: args.Image || squarePhoto,
      imageDescription: args['Image description'],
      title: args.Title,
      link: args.Link,
    }),
  }),
  decorators: [(Story) => <Frame><Story /></Frame>],
  args: { Image: '', 'Image description': '', Title: 'Undergraduate', Link: '#title-on-image-card' },
  argTypes: {
    Image: { control: 'text', description: "The photo's URL. It's cropped to a square. Leave it empty here for a placeholder.", type: { name: 'string', required: true } },
    'Image description': {
      control: 'text',
      description: "The photo's alt text. Leave it empty, so screen readers skip it: the title says where the card goes.",
      type: { name: 'string', required: false },
    },
    Title: { control: 'text', description: "One to three words for where the card goes. It's the link's text.", type: { name: 'string', required: true } },
    Link: { control: 'text', description: 'The page the card goes to.', type: { name: 'string', required: true } },
  },
} satisfies Meta<TitleOnImageCardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

// Shown on the Title on Image Card docs page. Its play function is the card's
// contract check.
export const Default: Story = { play: checkCard('title-on-image-card') };
