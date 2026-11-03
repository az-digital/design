// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what each render function returns.
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import {
  renderAccordion,
  renderArizonaHeader,
  renderButton,
  renderCallToActionCard,
  renderCard,
  renderIconCard,
  renderImageCard,
  renderLinkCard,
  renderNav,
  renderQuickLinksCard,
  renderTabs,
  renderTitleOnImageCard,
} from '../src';
import type {
  AccordionProps,
  ArizonaHeaderProps,
  ButtonProps,
  CallToActionCardProps,
  CardProps,
  IconCardProps,
  ImageCardProps,
  LinkCardProps,
  NavProps,
  QuickLinksCardProps,
  TabsProps,
  TitleOnImageCardProps,
} from '../src';

export default {
  components: {
    accordion: {
      render: (props: AccordionProps) => renderAccordion(props),
      source: (props: AccordionProps) => renderAccordion(props),
    },
    'brand-header': {
      render: (props: ArizonaHeaderProps) => renderArizonaHeader(props),
      source: (props: ArizonaHeaderProps) => renderArizonaHeader(props),
    },
    button: {
      render: (props: ButtonProps) => renderButton(props),
      source: (props: ButtonProps) => renderButton(props),
    },
    card: {
      render: (props: CardProps) => renderCard(props),
      source: (props: CardProps) => renderCard(props),
    },
    'call-to-action-card': {
      render: (props: CallToActionCardProps) => renderCallToActionCard(props),
      source: (props: CallToActionCardProps) => renderCallToActionCard(props),
    },
    'icon-card': {
      render: (props: IconCardProps) => renderIconCard(props),
      source: (props: IconCardProps) => renderIconCard(props),
    },
    'image-card': {
      render: (props: ImageCardProps) => renderImageCard(props),
      source: (props: ImageCardProps) => renderImageCard(props),
    },
    'link-card': {
      render: (props: LinkCardProps) => renderLinkCard(props),
      source: (props: LinkCardProps) => renderLinkCard(props),
    },
    nav: {
      render: (props: NavProps) => renderNav(props),
      source: (props: NavProps) => renderNav(props),
    },
    'quick-links-card': {
      render: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
      source: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
    },
    tabs: {
      render: (props: TabsProps) => renderTabs(props),
      source: (props: TabsProps) => renderTabs(props),
    },
    'title-on-image-card': {
      render: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
      source: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
    },
  },
} satisfies LibraryAdapter;
