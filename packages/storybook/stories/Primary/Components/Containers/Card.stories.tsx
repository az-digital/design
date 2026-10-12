import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Card } from '@az-digital/components-react';
import { renderCard } from '@az-digital/components-html';
import type { CardProps } from '@az-digital/components-html';
import type { Implementations } from '../../../implementations';
import { renderImplementation } from '../../../implementations';
import personRaisedHandIcon from './assets/person-raised-hand.svg';
import campusEveningPanorama from './assets/campus-evening-panorama.png';

/**
 * Figma designs for the Design tab (@storybook/addon-designs). Links go to the
 * card components on the Cards page of the AZ Digital UX Design System file,
 * not to copies placed elsewhere.
 */
const FIGMA_FILE = 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System';
const figmaNode = (nodeId: string, name: string) => ({ type: 'figma' as const, name, url: `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}` });
const CARD_DESIGNS = {
  nonMedia: figmaNode('2678:515', 'Non-Media Card - 3X'),
  icon: figmaNode('2670:261', 'Icon Card - 4X'),
  media: figmaNode('2687:349', 'Media Card - 3X, Show Link=No'),
  mediaWithLinks: figmaNode('2700:759', 'Media Card - 3X, Show Link=Yes'),
};

/**
 * Renders a fixed reference story at its Figma frame's width. Card width comes
 * from the grid column it sits in (3 or 4 across a 1296px container), not from
 * the card itself, so it isn't a card token.
 */
const atWidth = (width: number) => (Story: () => ReturnType<typeof createElement>) => <div style={{ maxWidth: width }}><Story /></div>;

// Not `Parameters<typeof renderCard>[0]` (the pattern other stories use) — renderCard's
// default parameter value (`= {}`) makes that resolve to `CardProps | undefined`, which
// Storybook's own story-args types reject outright.
type CardArgs = CardProps;

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: CardArgs) => {
  const props: string[] = [];

  if (args?.header) props.push(`header="${args.header}"`);
  if (args?.image) props.push(`image={{ src: "${args.image.src}", alt: "${args.image.alt}" }}`);
  if (args?.icon) props.push(`icon={{ src: "${args.icon.src}", alt: "${args.icon.alt}" }}`);
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
  title: 'Primary/Components/Containers/Card',
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
    tokens: 'az.component.card.',
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

/** Mirrors the Figma Non-Media Card (3 across): title and text on the Cloud surface. */
export const NonMediaCard: Story = {
  args: {
    title: 'Academic calendar',
    text: 'View the first and last day of classes, holidays, finals schedules, commencement ceremonies, and more.',
  },
  decorators: [atWidth(416)],
  parameters: { design: CARD_DESIGNS.nonMedia, controls: { disable: true } },
};

/** Mirrors the Figma Icon Card (4 across): an icon above the title, and the icon style's title color. */
export const IconCard: Story = {
  args: {
    icon: { src: personRaisedHandIcon, alt: '' },
    title: 'Admissions',
    text: 'Become a Wildcat and embrace “Bear Down!” Explore information on applying, transferring, Arizona Online, and more.',
  },
  decorators: [atWidth(306)],
  parameters: { design: CARD_DESIGNS.icon, controls: { disable: true } },
};

/** Mirrors the Figma Media Card (3 across, Show Link=No): an image cap above the body. */
export const MediaCard: Story = {
  args: {
    image: { src: campusEveningPanorama, alt: 'The University of Arizona campus at dusk' },
    title: 'Main campus',
    text: 'Our beautiful Tucson home base with hundreds of degree choices.',
  },
  decorators: [atWidth(416)],
  parameters: { design: CARD_DESIGNS.media, controls: { disable: true } },
};

/** Mirrors the Figma Media Card (3 across, Show Link=Yes): links stacked at the end of the body. */
export const MediaCardWithLinks: Story = {
  args: {
    image: { src: campusEveningPanorama, alt: 'The University of Arizona campus at dusk' },
    title: 'Main campus',
    text: 'Our beautiful Tucson home base with hundreds of degree choices.',
    links: [
      { label: 'Explore majors' },
      { label: 'Visit campus' },
    ],
  },
  decorators: [atWidth(416)],
  parameters: { design: CARD_DESIGNS.mediaWithLinks, controls: { disable: true } },
};
