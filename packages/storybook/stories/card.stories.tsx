import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Card } from '@az-digital/components-react';
import { renderCard } from '@az-digital/components-html';
import type { CardProps } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

// Not `Parameters<typeof renderCard>[0]` (the pattern other stories use) — renderCard's
// default parameter value (`= {}`) makes that resolve to `CardProps | undefined`, which
// Storybook's own story-args types reject outright.
type CardArgs = CardProps;

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: CardArgs) => {
  const props: string[] = [];

  if (args?.header) props.push(`header="${args.header}"`);
  if (args?.image) props.push(`image={{ src: "${args.image.src}", alt: "${args.image.alt}" }}`);
  if (args?.title) props.push(`title="${args.title}"`);
  if (args?.subtitle) props.push(`subtitle="${args.subtitle}"`);
  if (args?.text) props.push(`text="${args.text}"`);
  if (args?.links) props.push(`links={${JSON.stringify(args.links)}}`);
  if (args?.footer) props.push(`footer="${args.footer}"`);

  const propsString = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';

  return `<Card${propsString} />`;
};

const implementations: Implementations<CardArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderCard(args) }} />,
    source: (args) => renderCard(args),
  },
  react: {
    render: (args) => createElement(Card, args),
    source: asReactCode,
  },
};

function CardStory(args: CardArgs, context: StoryContext) {
  return renderImplementation('Card', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; CardStory itself also takes a `context` param, which Meta<T> doesn't expect
function CardArgsShape(_args: CardArgs) {
  return null;
}

const meta = {
  title: 'Components/Card',
  // Set only so react-docgen can attach Card's prop table to this story file's
  // documentation — see the equivalent comment in button.stories.tsx for why this
  // must stay a bare reference to the imported `Card`.
  component: Card,
  render: CardStory,
  argTypes: {
    links: { control: 'object' },
  },
  args: {
    title: 'Card title',
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
  },
  parameters: {
    implementations,
    // Every story here relies on the meta-level custom `render`, so Storybook's
    // default ('auto') Code-panel behavior would fall back to static story source
    // instead of running `docs.source.transform` — see the equivalent comment in
    // button.stories.tsx. 'dynamic' forces the Code panel through the transform.
    docs: { source: { type: 'dynamic' } },
  },
} satisfies Omit<Meta<typeof CardArgsShape>, 'component'> & { component?: typeof Card };

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
