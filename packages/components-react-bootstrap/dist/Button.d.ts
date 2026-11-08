import * as react from 'react';
import { ReactNode } from 'react';

type ButtonStyle = 'solid' | 'outline' | 'link';
type ButtonColor = 'red' | 'blue' | 'rain' | 'white' | 'white-text-red' | 'white-text-blue';
type ButtonSize = 'sm' | 'lg';
type ButtonHtmlTag = 'button' | 'a';
/**
 * The Storybook adapter translates the shared contract color and size into
 * this component's separate style, color, and size props.
 */
type ButtonProps = {
    /** HTML element to render. Defaults to `a`. */
    htmlTag?: ButtonHtmlTag;
    /** URL for `a` elements. Defaults to `#`. */
    href?: string;
    /** Button style variant. Defaults to `solid`. */
    style?: ButtonStyle;
    /** Button color. Defaults to `red`. Rain uses Arizona Bootstrap's `sky` class. */
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
