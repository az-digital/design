import { LitElement } from 'lit';
export type ArizonaHeaderVariant = 'blue' | 'red';
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
export declare class AzArizonaHeader extends LitElement {
    static properties: {
        variant: {
            reflect: boolean;
        };
        fixedOnMobile: {
            type: BooleanConstructor;
            reflect: boolean;
            attribute: string;
        };
    };
    variant: ArizonaHeaderVariant;
    fixedOnMobile: boolean;
    constructor();
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'az-arizona-header': AzArizonaHeader;
    }
}
