// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what each render function returns.
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { renderAccordion, renderArizonaHeader, renderButton, renderCard, renderNav, renderTabs } from '../src';
import type { AccordionProps, ArizonaHeaderProps, ButtonProps, CardProps, NavProps, TabsProps } from '../src';

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
    nav: {
      render: (props: NavProps) => renderNav(props),
      source: (props: NavProps) => renderNav(props),
    },
    tabs: {
      render: (props: TabsProps) => renderTabs(props),
      source: (props: TabsProps) => renderTabs(props),
    },
  },
} satisfies LibraryAdapter;
