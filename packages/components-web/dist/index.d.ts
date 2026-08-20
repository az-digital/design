import { CSSResult, LitElement } from "lit";
import { TemplateResult } from "lit-html";
declare const AzButton_base: any;
/**
 * A button.
 *
 * @slot - This element has a slot for content.
 */
export class AzButton extends AzButton_base {
    static get properties(): any;
    theme: string;
    outline: boolean;
    size: string;
    block: boolean;
    redbar: boolean;
    active: boolean;
    link: string;
    target: string;
    toggle: string;
    event: string;
    elmid: string;
    value: string;
    static get styles(): CSSResult[];
    constructor();
    attributeChangedCallback(name: any, oldVal: any, newVal: any): void;
    changeAttributes(): void;
    get themeClass(): "outline-blue" | "outline-success" | "outline-danger" | "outline-warning" | "outline-info" | "outline-light" | "outline-dark" | "outline-red" | "blue" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "white" | "red";
    _handleClick(e: any): void;
    render(): TemplateResult<1>;
    firstUpdated(): void;
    /**
     * @protected
     */
    get focusElement(): any;
}
export class AzSelectMenu extends LitElement {
    static properties: {
        baseurl: {
            type: StringConstructor;
            reflect: boolean;
        };
        menuId: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    baseurl: string;
    menuId: string;
    static styles: CSSResult;
    render(): TemplateResult<1>;
}
/**
 * TODO: Create a class for your element that extends the LitElement
 * base class.
 */
export class AzHeader extends LitElement {
    static styles: CSSResult;
    render(): TemplateResult<1>;
}
export class AzFooter extends LitElement {
    static styles: CSSResult;
    render(): TemplateResult<1>;
}
