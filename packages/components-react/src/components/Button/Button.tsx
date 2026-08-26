import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/classNames';

export type ButtonStyle = 'solid' | 'outline' | 'link';
export type ButtonColor = 'red' | 'blue';
export type ButtonSize = 'sm' | 'lg';
export type ButtonHtmlTag = 'button' | 'a';

/**
 * Props mirror `@az-digital/components-html`'s `renderButton` 1:1 so the HTML
 * and React implementations render equivalent markup from the same args.
 */
export type ButtonProps = {
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
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(props, ref) {
  const { htmlTag = 'a', href = '#', style = 'solid', color = 'red', size, disabled = false, active = false, className, children } = props;

  const classes = classNames(
    'btn',
    style === 'link' ? 'btn-link' : style === 'outline' ? `btn-outline-${color}` : `btn-${color}`,
    size && `btn-${size}`,
    disabled && htmlTag === 'a' && 'disabled',
    active && 'active',
    className,
  );

  if (htmlTag === 'button') {
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} type="button" className={classes} disabled={disabled}>
        {children}
      </button>
    );
  }

  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      role="button"
      className={classes}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
    </a>
  );
});
