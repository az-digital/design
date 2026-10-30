import { buttonStyles } from './az-button.styles';

/**
 * Registers `<az-button color="outline-red" size="large">Apply</az-button>`, once.
 *
 * The element draws a `<button>` in its shadow root with its own styles, from
 * the button contract, so it doesn't need Arizona Bootstrap. Its `color` and
 * `size` attributes take the contract's option names; with none, it's a
 * default-size red button. The element's content is the label.
 *
 * The class is declared here rather than at the top level so the module can
 * be imported where `HTMLElement` doesn't exist, such as Node.
 */
export function defineAzButton() {
  if (customElements.get('az-button')) return;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(buttonStyles);

  class AzButton extends HTMLElement {
    constructor() {
      super();
      // Focusing the element focuses its button.
      const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
      root.adoptedStyleSheets = [sheet];
      const button = document.createElement('button');
      button.type = 'button';
      button.append(document.createElement('slot'));
      root.append(button);
    }
  }

  customElements.define('az-button', AzButton);
}
