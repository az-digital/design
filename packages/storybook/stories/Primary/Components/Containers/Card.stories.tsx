import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { CardProps } from '@az-digital/components-html';

const meta = {
  title: 'Primary/Components/Containers/Card',
  tags: ['lib:html', 'lib:react'],
  ...componentStories('card', { props: (args: CardProps): CardProps => args }),
  argTypes: {
    links: { control: 'object' },
  },
  args: {
    title: 'Card title',
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
} satisfies Meta<CardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mirrors Arizona Bootstrap's own "Body" example — the plain `.card-body` building block. */
export const Default: Story = {};

/** Title, subtitle, text, and links together, matching the docs' "Titles, text, and links" example. */
export const TitlesTextAndLinks: Story = {
  args: {
    title: 'Card title',
    subtitle: 'Card subtitle',
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    links: [
      { label: 'Card link' },
      { label: 'Another link' },
    ],
  },
};

/** `.card-img-top`, matching the docs' "Images" example. */
export const ImageCap: Story = {
  args: {
    image: { src: 'https://placehold.co/600x180', alt: '' },
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
};

/** Header and footer, matching the docs' "Header and footer" example. */
export const HeaderAndFooter: Story = {
  args: {
    header: 'Featured',
    title: 'Special title treatment',
    text: 'With supporting text below as a natural lead-in to additional content.',
    footer: '2 days ago',
  },
};
