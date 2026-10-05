/**
 * Registers a custom element unless that tag is already defined, so a page
 * that loads the components twice (say, the CDN bundle and an npm import)
 * doesn't throw.
 */
export function define(tag: string, element: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, element);
  }
}
