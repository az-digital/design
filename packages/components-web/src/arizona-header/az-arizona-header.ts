import { LitElement, css, html, unsafeCSS } from 'lit';
import { az } from '../generated/tokens';
import { define } from '../define';

export type ArizonaHeaderVariant = 'blue' | 'red';

const t = (value: string) => unsafeCSS(value);
const header = az.component.arizonaHeader;

/**
 * University of Arizona wordmark header as a custom element:
 * `<az-arizona-header>`. Same props as `@az-digital/components-html`'s
 * `renderArizonaHeader` and `@az-digital/components-react`'s `ArizonaHeader`;
 * the host's own `id` stands in for their `id` prop. The logo link is fixed UA
 * brand content, not configurable, as in the other implementations.
 *
 * Token gaps, all hardcoded here until tokens exist:
 * - Background color: there's no `az.component.arizona-header` color token, so
 *   this reads the brand colors directly.
 * - Layout: there are no breakpoint or container tokens, so the container
 *   widths and the 576px `sm` breakpoint follow Arizona Bootstrap 5.2.0.
 *
 * `fixed-on-mobile` fixes the header to the top of the viewport below `sm`.
 * The page has to leave room for it (Arizona Bootstrap does this with
 * `body:has(.az-fixed-header-on-mobile)`, which can't see into a shadow root).
 */
export class AzArizonaHeader extends LitElement {
  static override properties = {
    variant: { reflect: true },
    fixedOnMobile: { type: Boolean, reflect: true, attribute: 'fixed-on-mobile' },
  };

  declare variant: ArizonaHeaderVariant;
  declare fixedOnMobile: boolean;

  constructor() {
    super();
    this.variant = 'blue';
    this.fixedOnMobile = false;
  }

  static override styles = css`
    :host {
      display: block;
      background-color: ${t(az.color.brand.blue)};
    }

    :host([variant='red']) {
      background-color: ${t(az.color.brand.red)};
    }

    :host([hidden]) {
      display: none;
    }

    .container {
      box-sizing: border-box;
      width: 100%;
      margin-inline: auto;
      padding-inline: 12px;
      display: flex;
      align-items: center;
      min-height: ${t(header.height)};
    }

    a {
      display: flex;
      align-items: center;
      min-height: ${t(header.height)};
      margin-right: auto;
    }

    a:focus-visible {
      outline: 2px solid ${t(az.color.brand.white)};
      outline-offset: 2px;
    }

    img {
      display: block;
      width: 100%;
      max-width: ${t(header.logo.width)};
      height: ${t(header.logo.height)};
      margin-left: ${t(header.logo.marginLeft)};
    }

    @media (max-width: 575.98px) {
      :host {
        height: ${t(header.height)};
      }

      :host([fixed-on-mobile]) {
        position: fixed;
        inset: 0 0 auto;
        z-index: 100;
      }
    }

    @media (min-width: 576px) {
      .container { max-width: 540px; }
      img {
        max-width: ${t(header.logo.sm.width)};
        height: ${t(header.logo.sm.height)};
      }
    }

    @media (min-width: 768px) {
      .container { max-width: 720px; }
    }

    @media (min-width: 992px) {
      .container { max-width: 960px; }
    }

    @media (min-width: 1200px) {
      .container { max-width: 1140px; }
    }

    @media (min-width: 1400px) {
      .container { max-width: 1320px; }
    }
  `;

  override render() {
    return html`<div class="container">
      <a href="https://www.arizona.edu" title="The University of Arizona homepage">
        <img
          alt="The University of Arizona Wordmark Line Logo White"
          src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg"
          fetchpriority="high"
        />
      </a>
    </div>`;
  }
}

define('az-arizona-header', AzArizonaHeader);

declare global {
  interface HTMLElementTagNameMap {
    'az-arizona-header': AzArizonaHeader;
  }
}
