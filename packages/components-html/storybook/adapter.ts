// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what each render function returns.
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import {
  renderArizonaHeader,
  renderButton,
  renderCallToActionCard,
  renderCard,
  renderIconCard,
  renderImageCard,
  renderLinkCard,
  renderQuickLinksCard,
  renderTitleOnImageCard,
  type ArizonaHeaderProps,
  type ButtonProps,
  type CallToActionCardProps,
  type CardProps,
  type IconCardProps,
  type ImageCardProps,
  type LinkCardProps,
  type QuickLinksCardProps,
  type TitleOnImageCardProps,
} from '../src';
import { buttonTest, cardTest, photo } from './designContractTests';

const link = { title: 'Future Students', text: 'Learn more about the university.', link: '#details' };

export default {
  components: {
    'brand-header': {
      render: (props: ArizonaHeaderProps) => renderArizonaHeader(props),
      source: (props: ArizonaHeaderProps) => renderArizonaHeader(props),
    },
    button: {
      render: (props: ButtonProps) => renderButton(props),
      source: (props: ButtonProps) => renderButton(props),
      designContractTest: buttonTest,
    },
    card: {
      render: (props: CardProps) => renderCard(props),
      source: (props: CardProps) => renderCard(props),
      designContractTest: cardTest<CardProps>([
        { name: 'without header or footer', props: () => ({ title: 'Office Hours', body: '<p>Visit us.</p><p>Learn more.</p>' }), optionalParts: ['header-footer'] },
        { name: 'with header and footer', props: () => ({ title: 'Office Hours', body: '<p>Visit us.</p><p>Learn more.</p>', header: 'Hours', footer: 'Contact us' }) },
      ]),
    },
    'call-to-action-card': {
      render: (props: CallToActionCardProps) => renderCallToActionCard(props),
      source: (props: CallToActionCardProps) => renderCallToActionCard(props),
      designContractTest: cardTest<CallToActionCardProps>([
        { name: 'card', props: () => ({ title: 'Updates', text: 'Find out more.', button: 'Subscribe', buttonLink: '#subscribe' }) },
      ]),
    },
    'icon-card': {
      render: (props: IconCardProps) => renderIconCard(props),
      source: (props: IconCardProps) => renderIconCard(props),
      designContractTest: cardTest<IconCardProps>([
        { name: 'card', props: () => ({ ...link, icon: 'person_raised_hand' }) },
      ]),
    },
    'image-card': {
      render: (props: ImageCardProps) => renderImageCard(props),
      source: (props: ImageCardProps) => renderImageCard(props),
      designContractTest: cardTest<ImageCardProps>([
        { name: 'card', props: () => ({ ...link, image: photo(600, 360) }) },
      ]),
    },
    'link-card': {
      render: (props: LinkCardProps) => renderLinkCard(props),
      source: (props: LinkCardProps) => renderLinkCard(props),
      designContractTest: cardTest<LinkCardProps>([
        { name: 'card', props: () => link },
      ]),
    },
    'quick-links-card': {
      render: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
      source: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
      designContractTest: cardTest<QuickLinksCardProps>([
        { name: 'card', props: () => ({ title: 'Academic Resources', text: 'Find support.', links: [
          { label: 'Advisor', link: '#advisor' },
          { label: 'Courses', link: '#courses' },
          { label: 'Registrar', link: '#registrar' },
        ] }) },
      ]),
    },
    'title-on-image-card': {
      render: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
      source: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
      designContractTest: cardTest<TitleOnImageCardProps>([
        { name: 'card', props: () => ({ title: link.title, link: link.link, image: photo(600, 600) }) },
      ]),
    },
  },
} satisfies LibraryAdapter;
