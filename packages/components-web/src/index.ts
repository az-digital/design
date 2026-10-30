import { defineAzButton } from './az-button';

export { defineAzButton } from './az-button';
export { renderAzButton } from './markup';
export type { ButtonColor, ButtonProps, ButtonSize } from './types';

/** Registers every element in this package. Importing the package calls it in a browser. */
export function defineAll() {
  defineAzButton();
}

if (typeof customElements !== 'undefined') defineAll();
