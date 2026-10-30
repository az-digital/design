import { buttonClasses, type ButtonColor, type ButtonSize } from '@az-digital/components-html';

/**
 * Registers `<az-button color="outline-red" size="large">Apply</az-button>`, once.
 *
 * The element draws Arizona Bootstrap's button in the light DOM, so it takes
 * its styles from the page's Arizona Bootstrap stylesheet. Its `color` and
 * `size` attributes take the button contract's option names; with none, it's
 * a default-size red button. The element's text is the label.
 *
 * The class is declared here rather than at the top level so the module can
 * be imported where `HTMLElement` doesn't exist, such as Node.
 */
export function defineAzButton() {
  if (customElements.get('az-button')) return;

  class AzButton extends HTMLElement {
    static observedAttributes = ['color', 'size'];

    #button: HTMLButtonElement | undefined;

    connectedCallback() {
      if (!this.#button) {
        this.#button = document.createElement('button');
        this.#button.type = 'button';
        this.#button.append(...this.childNodes);
        this.append(this.#button);
      }
      this.#update();
    }

    attributeChangedCallback() {
      this.#update();
    }

    #update() {
      if (!this.#button) return;
      this.#button.className = buttonClasses({
        color: (this.getAttribute('color') ?? undefined) as ButtonColor | undefined,
        size: (this.getAttribute('size') ?? undefined) as ButtonSize | undefined,
      });
    }
  }

  customElements.define('az-button', AzButton);
}
