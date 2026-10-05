import { LitElement, css, html, nothing, svg, unsafeCSS } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { az } from '../generated/tokens';
import { define } from '../define';
import type { FooterLink, FooterMenu } from './footer-links';
import { connect, informationFor, landAcknowledgment, resources, topics, utilityLinks } from './footer-links';
import { socialIcons } from './icons';
import { uaWordmark } from './ua-wordmark';

const t = (value: string) => unsafeCSS(value);
const utility = az.component.nav.utility;

/**
 * University of Arizona footer as a custom element: `<az-footer>`.
 *
 * The layout and content follow the footer on Arizona Quickstart 3 sites (for
 * example president.arizona.edu): site logo and University utility links,
 * then Information For, Topics, Resources, and Connect, the land
 * acknowledgment, and the copyright. The links are fixed University content
 * (see `footer-links.ts`). It replaces the `<az-footer>` built from
 * az-marketing/slate-template, which vendor sites such as catalog.arizona.edu
 * load from cdn.digital.arizona.edu/lib/temp-web-components/.
 *
 * Shows the University wordmark by default. A site can show its own logo
 * instead by slotting in a link:
 *
 * ```html
 * <az-footer>
 *   <a slot="logo" href="/"><img src="/logo.png" alt="Office of the President | Home"></a>
 * </az-footer>
 * ```
 *
 * Analytics: Google Tag Manager's click triggers can't see inside a shadow
 * root, so each link click pushes a `shadow_event_click` entry to
 * `window.dataLayer`, in the same shape as the Slate template's footer, so
 * existing GTM triggers keep working.
 *
 * Token gaps, hardcoded from Arizona Quickstart 3 until tokens exist:
 * - Link color `#49595e`, the same gap as Nav's utility variant.
 * - Text color, heading type, small text size, and the divider.
 * - Layout: the 576/768px breakpoints and container widths follow Arizona
 *   Bootstrap 5, as in `az-arizona-header`.
 * - Logo size: 226px wide, as the Slate footer shows the wordmark today.
 *
 * @slot logo - A link wrapping the site's own logo. Defaults to the University wordmark.
 * @csspart footer - The `<footer>` element.
 */
export class AzFooter extends LitElement {
  static override styles = css`
    :host {
      display: block;
      --_link: #49595e;
      --_text: #000;
      --_focus-ring: ${t(az.color.brand.red)};
    }

    :host([hidden]) {
      display: none;
    }

    footer {
      background-color: ${t(az.color.brand.caliche)};
      color: var(--_text);
      padding-block: 48px;
      font-size: 16px;
      line-height: 1.5;
    }

    .container {
      box-sizing: border-box;
      width: 100%;
      margin-inline: auto;
      padding-inline: 12px;
    }

    a {
      color: ${t(az.color.brand.red)};
      text-decoration: underline;
    }

    a:focus-visible {
      outline: 0;
      border-radius: 2px;
      box-shadow: 0 0 0 2px var(--_focus-ring);
    }

    hr {
      margin: 16px 0;
      color: inherit;
      border: 0;
      border-top: 1px solid currentColor;
      opacity: 0.25;
    }

    /* Logo and utility links. */
    /* Bootstrap's 12-column grid with 24px gutters, so columns line up with Quickstart's. */
    .top,
    .columns {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 0 24px;
    }

    .top > *,
    .columns > * {
      grid-column: span 12;
    }

    .top {
      justify-items: center;
    }

    .logo {
      display: block;
      margin-bottom: 40px;
    }

    /* A slotted logo is the site's own markup, so the site sizes its image. */
    ::slotted(a) {
      display: block;
    }

    .ua-wordmark {
      display: block;
      width: 226px;
      max-width: 100%;
      height: auto;
    }

    /* Navy lettering on a light background makes the reversed wordmark the full-color logo. */
    .ua-wordmark .lettering {
      fill: ${t(az.color.brand.blue)};
    }

    .ua-wordmark .substrate {
      fill: ${t(az.color.brand.white)};
    }

    /* Link lists, styled as Nav's utility variant (az.component.nav.utility.*). */
    ul {
      list-style: none;
      margin: ${t(utility.margin.top)} 0 ${t(utility.margin.bottom)};
      padding: 0;
    }

    .menu a {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      font-weight: ${t(utility.label.font.weight)};
      color: var(--_link);
      text-decoration: none;
      border-bottom: 2px solid transparent;
    }

    .menu a:hover,
    .menu a:focus {
      border-bottom-color: var(--_link);
    }

    .utility {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .utility li {
      padding: 0 ${t(utility.item.padding.x)};
    }

    /* Flex keeps each item's bottom margin inside its list, as in Quickstart. */
    .columns ul {
      display: flex;
      flex-direction: column;
      line-height: 1.375;
    }

    .columns li {
      display: flex;
      margin-bottom: 4px;
    }

    h2 {
      margin: 16.672px 0 10.672px;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.2;
      text-transform: uppercase;
    }

    .icon {
      width: 1em;
      height: 1em;
      flex: none;
      fill: currentColor;
    }

    /* Land acknowledgment and copyright. */
    .bottom {
      text-align: center;
    }

    .bottom p {
      margin: 0 0 16px;
    }

    .acknowledgment {
      font-style: italic;
      font-weight: 300;
    }

    .small {
      font-size: 14px;
    }

    .bottom .security {
      margin-bottom: 4px;
    }

    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }

      .top {
        justify-items: stretch;
        align-items: start;
      }

      .top > .logo {
        grid-column: span 5;
        margin-bottom: 30px;
      }

      .top > nav {
        grid-column: span 7;
      }

      .utility {
        justify-content: flex-end;
      }

      .columns > * {
        grid-column: span 6;
      }
    }

    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }

      .top > .logo {
        grid-column: span 4;
      }

      .top > nav {
        grid-column: span 8;
      }

      .columns > :nth-child(1) {
        grid-column: span 3;
      }

      .columns > :nth-child(2) {
        grid-column: span 5;
      }

      .columns > :nth-child(3),
      .columns > :nth-child(4) {
        grid-column: span 2;
      }

      .columns li {
        margin-bottom: 8px;
      }

      h2 {
        margin-top: 16px;
      }

      .topics ul {
        display: block;
        column-count: 2;
      }
    }

    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }

    @media (min-width: 1200px) {
      .container {
        max-width: 1140px;
      }
    }

    @media (min-width: 1400px) {
      .container {
        max-width: 1320px;
      }
    }
  `;

  constructor() {
    super();
    this.addEventListener('click', this.pushClickToDataLayer);
  }

  /** Same shape as the Slate template's `eventDataLayerPush`, so existing GTM triggers keep working. */
  private pushClickToDataLayer = (event: MouseEvent) => {
    const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
    if (!link) return;

    const menu = link.closest('nav')?.querySelector('h2')?.textContent ?? '';
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: `shadow_event_${event.type}`,
      shadow_event: {
        elementInnerHTML: link.textContent || '',
        elementInnerText: link.innerText || '',
        title: 'shadow-dom-link',
        element: link,
        elementClasses: link.className || '',
        elementId: link.id || '',
        elementLocation: 'az-footer',
        elementTarget: link.target || '',
        elementUrl: link.href || '',
        originalEvent: event,
        parent: menu,
        inShadowDom: true,
      },
    });
  };

  private link({ label, href, icon }: FooterLink) {
    return html`<li><a href=${href}>${icon ? this.icon(icon) : nothing}${label}</a></li>`;
  }

  private icon(name: keyof typeof socialIcons) {
    // Glyphs are in font units with y pointing up; flip them into SVG's y-down space.
    return html`<svg class="icon" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">${svg`<path transform="translate(0 960) scale(1 -1)" d=${socialIcons[name]}></path>`}</svg>`;
  }

  private menu({ heading, links }: FooterMenu, className = '') {
    const id = `az-footer-${heading.toLowerCase().replace(/\W+/g, '-')}`;
    return html`<nav class="menu ${className}" aria-labelledby=${id}>
      <h2 id=${id}>${heading}</h2>
      <ul>
        ${links.map((link) => this.link(link))}
      </ul>
    </nav>`;
  }

  override render() {
    return html`<footer part="footer" role="contentinfo">
      <div class="container">
        <div class="top">
          <div class="logo">
            <slot name="logo">
              <a href="https://www.arizona.edu" aria-label="The University of Arizona homepage">${unsafeSVG(uaWordmark)}</a>
            </slot>
          </div>
          <nav class="menu" aria-label="University">
            <ul class="utility">
              ${utilityLinks.map((link) => this.link(link))}
            </ul>
          </nav>
        </div>
        <hr />
        <div class="columns">
          ${this.menu(informationFor)} ${this.menu(topics, 'topics')} ${this.menu(resources)} ${this.menu(connect)}
        </div>
        <div class="bottom">
          <hr />
          <p class="acknowledgment">
            We respectfully acknowledge <a href=${landAcknowledgment.href}>${landAcknowledgment.linkText}</a>. Today, Arizona is home
            to 22 federally recognized tribes, with Tucson being home to the O’odham and the Yaqui. The university strives to build
            sustainable relationships with sovereign Native Nations and Indigenous communities through education offerings,
            partnerships, and community service.
          </p>
          <hr />
          <p class="small security"><a href="https://www.arizona.edu/information-security-privacy">University Information Security and Privacy</a></p>
          <p class="small">
            © ${new Date().getFullYear()} The Arizona Board of Regents on behalf of
            <a href="https://www.arizona.edu">The University of Arizona</a>.
          </p>
        </div>
      </div>
    </footer>`;
  }
}

define('az-footer', AzFooter);

declare global {
  interface HTMLElementTagNameMap {
    'az-footer': AzFooter;
  }
}
