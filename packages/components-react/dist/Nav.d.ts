import * as react from 'react';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderNav` so the
 * two implementations can be shown side by side from the same story args.
 */
type NavItemProps = {
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
type NavProps = {
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
/**
 * Arizona Digital nav. Purely presentational — no real interactive behavior
 * (unlike Accordion/Tabs), so this is hand-rolled rather than wrapping
 * `react-bootstrap`'s own `Nav`; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
declare const Nav: react.ForwardRefExoticComponent<NavProps & react.RefAttributes<HTMLUListElement>>;

export { Nav, type NavItemProps, type NavProps };
