import { forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderNav` so the
 * two implementations can be shown side by side from the same story args.
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
  className?: string;
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

function NavItems({ items, navClasses }: { items: NavItemProps[]; navClasses: string }) {
  return (
    <>
      {items.map((item, index) => (
        <li className="nav-item" key={index}>
          <a
            className={classNames('nav-link', item.active && 'active', item.disabled && 'disabled')}
            href={item.disabled ? undefined : (item.href ?? '#')}
            aria-current={item.active ? 'page' : undefined}
            aria-disabled={item.disabled ? 'true' : undefined}
          >
            {item.label}
          </a>
          {item.items && item.items.length > 0 && (
            <ul className={navClasses}>
              <NavItems items={item.items} navClasses={navClasses} />
            </ul>
          )}
        </li>
      ))}
    </>
  );
}

/**
 * Arizona Digital nav. Purely presentational — no real interactive behavior
 * (unlike Accordion/Tabs), so this is hand-rolled rather than wrapping
 * `react-bootstrap`'s own `Nav`; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
export const Nav = forwardRef<HTMLUListElement, NavProps>(function Nav(props, ref) {
  const { items, variant, vertical = false, fill = false, justify = false, className } = props;
  const navClasses = classNames('nav', variantClass(variant), vertical && 'flex-column', fill && 'nav-fill', justify && 'nav-justified');

  return (
    <ul ref={ref} className={classNames(navClasses, className)}>
      <NavItems items={items} navClasses={navClasses} />
    </ul>
  );
});
