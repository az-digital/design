export type ButtonStyle = 'solid' | 'outline' | 'link';
/** `success` is Bootstrap's stock semantic color, not an Arizona brand color — HTML-only for now, no React implementation. */
export type ButtonColor = 'red' | 'success' | 'rain';
export type ButtonSize = 'sm' | 'lg';
export type ButtonHtmlTag = 'button' | 'a';

/**
 * Plain HTML/CSS reference implementation of the Arizona Digital Button.
 * Props otherwise mirror `@az-digital/components-react`'s `Button` so the two
 * implementations can be shown side by side from the same story args, except
 * where noted (see `ButtonColor`).
 */
export type ButtonProps = {
  htmlTag?: ButtonHtmlTag;
  href?: string;
  style?: ButtonStyle;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  active?: boolean;
  text?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders the Button as an HTML string using Arizona Bootstrap-style button classes. */
export function renderButton(props: ButtonProps = {}): string {
  const { htmlTag = 'a', href = '#', style = 'solid', color = 'red', size, disabled = false, active = false, text = 'Learn More' } = props;

  const classes = [
    'btn',
    style === 'link' ? 'btn-link' : style === 'outline' ? `btn-outline-${color}` : `btn-${color}`,
    size && `btn-${size}`,
    disabled && htmlTag === 'a' && 'disabled',
    active && 'active',
  ]
    .filter(Boolean)
    .join(' ');

  const label = escapeHtml(text);

  if (htmlTag === 'button') {
    return `<button type="button" class="${classes}"${disabled ? ' disabled' : ''}>${label}</button>`;
  }

  return `<a href="${escapeHtml(href)}" role="button" class="${classes}"${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}>${label}</a>`;
}
