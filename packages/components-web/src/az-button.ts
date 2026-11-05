import { html, LitElement } from 'lit';
import { buttonStyles } from './az-button.styles';
import type { ButtonColor, ButtonSize } from './types';

/**
 * `<az-button color="outline-red" size="large">Apply</az-button>`.
 *
 * The element draws a `<button>` in its shadow root with its own styles, from
 * the button contract, so it doesn't need Arizona Bootstrap. Its `color` and
 * `size` attributes (and properties) take the contract's option names; with
 * none, it's a default-size red button. The element's content is the label.
 */
export class AzButton extends LitElement {
  static styles = buttonStyles;

  // Focusing the element focuses its button.
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  // Reflected, so setting a property sets the attribute the styles select on.
  static properties = {
    color: { reflect: true },
    size: { reflect: true },
  };

  declare color?: ButtonColor;
  declare size?: ButtonSize;

  render() {
    return html`<button type="button"><slot></slot></button>`;
  }
}

/** Registers `<az-button>`, once. */
export function defineAzButton() {
  if (!customElements.get('az-button')) customElements.define('az-button', AzButton);
}
