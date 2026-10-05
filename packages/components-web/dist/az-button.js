import { n as az, t as define } from "./define-Dls5JJHC.js";
import { LitElement, css, html, nothing, unsafeCSS } from "lit";
//#region src/button/az-button.ts
var t = (value) => unsafeCSS(value);
var button = az.component.button;
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
var AzButton = class extends LitElement {
	static {
		this.shadowRootOptions = {
			...LitElement.shadowRootOptions,
			delegatesFocus: true
		};
	}
	static {
		this.properties = {
			variant: { reflect: true },
			color: { reflect: true },
			size: { reflect: true },
			href: {},
			disabled: {
				type: Boolean,
				reflect: true
			},
			active: {
				type: Boolean,
				reflect: true
			}
		};
	}
	constructor() {
		super();
		this.variant = "solid";
		this.color = "red";
		this.disabled = false;
		this.active = false;
	}
	static {
		this.styles = css`
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    :host([hidden]) {
      display: none;
    }

    .control {
      --_padding-x: ${t(button.padding.x)};
      --_padding-y: ${t(button.padding.y)};
      --_font-size: ${t(button.label.font.size)};
      --_radius: ${t(button.border.radius)};

      box-sizing: border-box;
      display: inline-block;
      margin: 0;
      padding: var(--_padding-y) var(--_padding-x);
      font: inherit;
      font-size: var(--_font-size);
      font-weight: ${t(button.label.font.weight)};
      line-height: 1.5;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      white-space: normal;
      cursor: pointer;
      user-select: none;
      color: var(--_label, inherit);
      background-color: var(--_container, transparent);
      border: ${t(button.border.width)} solid var(--_border, transparent);
      border-radius: var(--_radius);
      transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out;
      /* Figma trims the label to its cap height; see the Storybook Arizona Bootstrap shim. */
      text-box: trim-both cap alphabetic;
    }

    :host([size='lg']) .control {
      --_padding-x: ${t(button.size.lg.padding.x)};
      --_padding-y: ${t(button.size.lg.padding.y)};
      --_font-size: ${t(button.size.lg.label.font.size)};
      --_radius: ${t(button.size.lg.border.radius)};
    }

    :host([size='sm']) .control {
      --_padding-x: ${t(button.size.sm.padding.x)};
      --_padding-y: ${t(button.size.sm.padding.y)};
      --_font-size: ${t(button.size.sm.label.font.size)};
    }

    /* Solid red (az.component.button.solid.*): a solid button's border is its fill. */
    :host([variant='solid'][color='red']) .control {
      --_label: ${t(button.solid.label.color)};
      --_container: ${t(button.solid.container.color)};
      --_border: ${t(button.solid.container.color)};
    }

    :host([variant='solid'][color='red']) .control:hover {
      --_container: ${t(button.solid.hover.container.color)};
      --_border: ${t(button.solid.hover.container.color)};
    }

    /* A focused solid button keeps its resting fill; focus-visible adds the ring. */
    :host([variant='solid'][color='red']) .control:focus-visible {
      --_container: ${t(button.solid.focus.container.color)};
      --_border: ${t(button.solid.focus.container.color)};
    }

    /* Outline red (az.component.button.outline.*). */
    :host([variant='outline'][color='red']) .control {
      --_label: ${t(button.outline.label.color)};
      --_border: ${t(button.outline.border.color)};
    }

    :host([variant='outline'][color='red']) .control:hover {
      --_label: ${t(button.outline.hover.label.color)};
      --_container: ${t(button.outline.hover.container.color)};
      --_border: ${t(button.outline.hover.border.color)};
    }

    :host([variant='outline'][color='red']) .control:focus-visible {
      --_label: ${t(button.outline.focus.label.color)};
      --_container: ${t(button.outline.focus.container.color)};
      --_border: ${t(button.outline.focus.border.color)};
    }

    .control:focus-visible {
      outline: 2px solid ${t(button.focusVisible.ring)};
      outline-offset: 2px;
    }

    :host([disabled]) .control {
      opacity: ${t(button.disabled.opacity)};
      pointer-events: none;
    }
  `;
	}
	render() {
		if (this.href !== void 0) return html`<a
        part="control"
        class="control"
        role="button"
        href=${this.disabled ? nothing : this.href}
        aria-disabled=${this.disabled ? "true" : nothing}
        tabindex=${this.disabled ? "-1" : nothing}
        ><slot></slot
      ></a>`;
		return html`<button part="control" class="control" type="button" ?disabled=${this.disabled}><slot></slot></button>`;
	}
};
define("az-button", AzButton);
//#endregion
export { AzButton };
