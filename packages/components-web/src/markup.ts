import { escapeHtml, type ButtonProps } from '@az-digital/components-html';

/** The `<az-button>` markup for the button's shared props. */
export function renderAzButton({ label, color, size }: ButtonProps) {
  const attributes = [color && ` color="${escapeHtml(color)}"`, size && ` size="${escapeHtml(size)}"`].filter(Boolean).join('');
  return `<az-button${attributes}>${escapeHtml(label)}</az-button>`;
}
