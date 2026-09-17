function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Props otherwise mirror `@az-digital/components-react`'s `Nav` so the two
 * implementations can be shown side by side from the same story args.
 */
export type NavItemProps = {
  /** Link label text. */
  label: string;
  /** Link URL. Ignored (no `href` rendered) when `disabled` is set. Defaults to `#`. */
  href?: string;
  /** Marks this item as the current page/selection. */
  active?: boolean;
  /** Disables this item. Defaults to `false`. */
  disabled?: boolean;
  /**
   * Nested sub-items, rendered as a nested `<ul>` one level deeper — only
   * meaningful with `variant="pills"` and `vertical`, matching Arizona
   * Bootstrap's "Vertical Pills" example (its one real, demonstrated use).
   */
  items?: NavItemProps[];
};

export type NavProps = {
  items: NavItemProps[];
  /** Nav style. Omit for the bare, unstyled base nav. */
  variant?: 'tabs' | 'pills' | 'underline' | 'utility';
  /** Stacks items in a column instead of a row (`.flex-column`). Required for nested `items` ("Vertical Pills"). */
  vertical?: boolean;
  /** Proportionately fills the available width across items (`.nav-fill`). */
  fill?: boolean;
  /** Makes every item the same width (`.nav-justified`). */
  justify?: boolean;
};

function variantClass(variant: NavProps['variant']): string | false {
  switch (variant) {
    case 'tabs':
      return 'nav-tabs';
    case 'pills':
      return 'nav-pills';
    case 'underline':
      return 'nav-underline';
    case 'utility':
      return 'nav-utility';
    default:
      return false;
  }
}

function renderItem(item: NavItemProps, navClasses: string): string {
  const linkClasses = ['nav-link', item.active && 'active', item.disabled && 'disabled'].filter(Boolean).join(' ');
  const hrefAttribute = item.disabled ? '' : ` href="${item.href ?? '#'}"`;
  const stateAttribute = item.active ? ' aria-current="page"' : item.disabled ? ' aria-disabled="true"' : '';
  const nestedHtml =
    item.items && item.items.length > 0
      ? `
      <ul class="${navClasses}">
        ${renderItems(item.items, navClasses)}
      </ul>`
      : '';

  return `<li class="nav-item">
      <a class="${linkClasses}"${hrefAttribute}${stateAttribute}>${escapeHtml(item.label)}</a>${nestedHtml}
    </li>`;
}

function renderItems(items: NavItemProps[], navClasses: string): string {
  return items.map((item) => renderItem(item, navClasses)).join('\n    ');
}

/**
 * Renders the Nav as an HTML string using Arizona Bootstrap's real nav-link
 * markup/classes. Purely presentational — no real interactive behavior, so
 * (unlike Accordion/Tabs) this is hand-rolled rather than wrapping
 * `react-bootstrap`; see `.claude/skills/design-system-component/SKILL.md`.
 */
export function renderNav(props: NavProps): string {
  const { items, variant, vertical = false, fill = false, justify = false } = props;
  const navClasses = ['nav', variantClass(variant), vertical && 'flex-column', fill && 'nav-fill', justify && 'nav-justified'].filter(Boolean).join(' ');

  return `<ul class="${navClasses}">
    ${renderItems(items, navClasses)}
  </ul>`;
}
