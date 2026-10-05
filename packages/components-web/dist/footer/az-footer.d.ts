import { LitElement } from 'lit';
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
export declare class AzFooter extends LitElement {
    static styles: import("lit").CSSResult;
    constructor();
    /** Same shape as the Slate template's `eventDataLayerPush`, so existing GTM triggers keep working. */
    private pushClickToDataLayer;
    private link;
    private icon;
    private menu;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'az-footer': AzFooter;
    }
}
