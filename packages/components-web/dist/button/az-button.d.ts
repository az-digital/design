import { LitElement } from 'lit';
export type ButtonVariant = 'solid' | 'outline' | 'link';
export type ButtonColor = 'red' | 'rain';
export type ButtonSize = 'sm' | 'lg';
/**
 * Arizona Digital button as a custom element: `<az-button>`.
 *
 * Mirrors `@az-digital/components-html`'s `renderButton` and
 * `@az-digital/components-react`'s `Button`, except where the web platform
 * forces a difference:
 *
 * - `variant` replaces `style`: `style` is a global HTML attribute (inline
 *   CSS), so a custom element can't use it for anything else.
 * - `href` replaces `htmlTag` + `href`: with `href` it renders an `<a>`,
 *   without one a `<button>`.
 *
 * Styles come only from design tokens (see `src/generated/tokens.ts`), so it
 * renders without Arizona Bootstrap. Only `red` has color tokens today; other
 * `color` values are accepted and reflected but have no color styling yet,
 * the same way html/react generate `btn-${color}` whether or not its CSS
 * exists. `active` likewise has no tokens yet and doesn't change the look.
 *
 * @slot - The button's label.
 * @csspart control - The inner `<button>` or `<a>`.
 */
export declare class AzButton extends LitElement {
    static shadowRootOptions: {
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static properties: {
        variant: {
            reflect: boolean;
        };
        color: {
            reflect: boolean;
        };
        size: {
            reflect: boolean;
        };
        href: {};
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        active: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    variant: ButtonVariant;
    color: ButtonColor;
    size: ButtonSize | undefined;
    href: string | undefined;
    disabled: boolean;
    active: boolean;
    constructor();
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'az-button': AzButton;
    }
}
