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

export default {
  components: {
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
    'quick-links-card': {
      render: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
      source: (props: QuickLinksCardProps) => renderQuickLinksCard(props),
    },
    'title-on-image-card': {
      render: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
      source: (props: TitleOnImageCardProps) => renderTitleOnImageCard(props),
    },
  },
} satisfies LibraryAdapter;
