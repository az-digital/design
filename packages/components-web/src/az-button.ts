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

    #observer = new MutationObserver(() => this.#sync());

    connectedCallback() {
      this.#sync();
      this.#observer.observe(this, { childList: true });
      this.#update();
    }

    disconnectedCallback() {
      this.#observer.disconnect();
    }

    attributeChangedCallback() {
      this.#update();
    }

    // Keeps the button as the element's only child and the caller's children
    // inside it, following ordinary content updates: children added later move
    // into the button, and when a content change (say `textContent = '…'`)
    // removes the button, a fresh one takes the new content.
    #sync() {
      if (!this.#button || this.#button.parentNode !== this) {
        this.#button = document.createElement('button');
        this.#button.type = 'button';
        this.prepend(this.#button);
        this.#update();
      }
      for (const node of [...this.childNodes]) {
        if (node !== this.#button) this.#button.append(node);
      }
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
