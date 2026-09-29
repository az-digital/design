import * as react from 'react';
import { ReactNode } from 'react';

type ButtonStyle = 'solid' | 'outline' | 'link';
type ButtonColor = 'red' | 'rain';
type ButtonSize = 'sm' | 'lg';
type ButtonHtmlTag = 'button' | 'a';
/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderButton` so
 * the HTML and React implementations render equivalent markup from the same
 * args, except `color`: components-html additionally supports `success`
 * (Bootstrap's stock semantic color, not an Arizona brand color) — no React
 * implementation yet.
 */
type ButtonProps = {
    /** HTML element to render. Defaults to `a`. */
    htmlTag?: ButtonHtmlTag;
    /** URL for `a` elements. Defaults to `#`. */
    href?: string;
    /** Button style variant. Defaults to `solid`. */
    style?: ButtonStyle;
    /** Button color. Defaults to `red`. */
    color?: ButtonColor;
    /** Button size modifier. */
    size?: ButtonSize;
    /** Disabled state. For `a` tags this adds the `disabled` class and ARIA attributes instead of the native attribute. */
    disabled?: boolean;
    /** Pre-toggle the button to active state. */
    active?: boolean;
    children?: ReactNode;
    className?: string;
};
/** Arizona Digital button. Renders a `<button>` or `<a>` depending on `htmlTag`. */
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLAnchorElement | HTMLButtonElement>>;

export { Button, type ButtonColor, type ButtonHtmlTag, type ButtonProps, type ButtonSize, type ButtonStyle };
