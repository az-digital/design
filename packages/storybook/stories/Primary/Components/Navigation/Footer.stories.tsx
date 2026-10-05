import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { expect } from 'storybook/test';
// Registers <az-footer>.
import '@az-digital/components-web';
import type { Implementations } from '../../../implementations';
import { renderImplementation } from '../../../implementations';

/** A site's own logo, slotted in place of the University wordmark. Empty for the default. */
type FooterArgs = { siteLogo?: { href: string; src: string; alt: string } };

/**
 * The real site logo from president.arizona.edu, whose Quickstart 3 footer
 * this component copies — the one documented example of a site logo in the
 * footer.
 */
const PRESIDENT_LOGO = {
  href: 'https://president.arizona.edu/',
  src: 'https://president.arizona.edu/sites/default/files/UA_Office-of-the-President_WEBHEADER.png',
  alt: 'Office of the President | Home',
};

/** `<az-footer>` shown in the docs code panel when Implementation is set to Web Components. */
const asWebCode = ({ siteLogo }: FooterArgs) =>
  siteLogo
    ? `<az-footer>\n  <a slot="logo" href="${siteLogo.href}"><img src="${siteLogo.src}" alt="${siteLogo.alt}"></a>\n</az-footer>`
    : '<az-footer></az-footer>';

/** Footer only has a web component so far; html and react show the placeholder. */
const implementations: Implementations<FooterArgs> = {
  web: {
    render: ({ siteLogo }) =>
      createElement(
        'az-footer',
        null,
        siteLogo &&
          createElement(
            'a',
            { slot: 'logo', href: siteLogo.href },
            createElement('img', { src: siteLogo.src, alt: siteLogo.alt, style: { maxWidth: '100%', height: 'auto' } }),
          ),
      ),
    source: asWebCode,
  },
};

function FooterStory(args: FooterArgs, context: StoryContext) {
  return renderImplementation('Footer', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; FooterStory itself also takes a `context` param, which Meta<T> doesn't expect
function FooterArgsShape(_args: FooterArgs) {
  return null;
}

const meta = {
  title: 'Primary/Components/Navigation/Footer',
  render: FooterStory,
  parameters: {
    implementations,
    layout: 'fullscreen',
    // The footer's link lists use Nav's utility-variant tokens, on the Caliche brand color.
    tokens: ['az.component.nav.utility.', 'az.color.brand.caliche', 'az.color.brand.blue', 'az.color.brand.red'],
    // Each story's fixed University content mirrors a real Quickstart 3 footer; nothing to vary.
    controls: { disable: true },
    actions: { disable: true },
    // Every story relies on the meta-level custom `render`, so force the Code panel
    // through `docs.source.transform` — see the equivalent comment in Button.stories.tsx.
    docs: { source: { type: 'dynamic' } },
  },
} satisfies Meta<typeof FooterArgsShape>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The University footer with the University wordmark, as vendor-hosted sites
 * show it (catalog.arizona.edu). Checks that every link group is a labeled
 * navigation landmark inside the footer's shadow root.
 */
export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const footer = canvasElement.querySelector('az-footer');
    if (!footer) return; // html/react show the placeholder instead.

    await step('Footer: renders the four labeled link groups', async () => {
      const headings = [...(footer.shadowRoot?.querySelectorAll('nav h2') ?? [])].map((h) => h.textContent);
      await expect(headings).toEqual(['Information For', 'Topics', 'Resources', 'Connect']);
    });
  },
};

/** A site's own logo in place of the wordmark, as on president.arizona.edu. */
export const WithSiteLogo: Story = {
  args: { siteLogo: PRESIDENT_LOGO },
  parameters: { interactions: { disable: true } },
};
