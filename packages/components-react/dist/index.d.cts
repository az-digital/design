import * as react from 'react';
import { ReactNode } from 'react';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderAccordion` so
 * the HTML and React implementations render equivalent markup from the same
 * args, except `content`, which accepts a `ReactNode` here instead of a
 * plain string.
 */
type AccordionItemProps = {
    /** Item heading text. */
    title: string;
    /** Item body content. */
    content: ReactNode;
    /** Whether this item is expanded on initial render. Defaults to `false`. */
    defaultOpen?: boolean;
};
type AccordionProps = {
    /** Base `id` for the accordion container. Defaults to `accordion`. */
    id?: string;
    items: AccordionItemProps[];
    /** Removes borders/rounded corners to render edge-to-edge with its parent container. */
    flush?: boolean;
    /**
     * When `true`, allows multiple items to stay open at once.
     * When `false` (default), opening an item collapses any other open sibling.
     */
    alwaysOpen?: boolean;
    /**
     * Adds a "Copy link" control to each item that copies a deep link to the
     * clipboard, and opens+scrolls to whichever item matches the page's URL
     * hash on load and on hash change. Mirrors Arizona Bootstrap's own Anchored
     * accordion (`accordion-anchors.js`), reimplemented here in React rather
     * than reused: that script is wired directly against Bootstrap's own
     * Collapse/Tooltip instances and `*.bs.*` events, which `react-bootstrap`
     * doesn't emit. Works best paired with `alwaysOpen`, same caveat as the
     * HTML implementation — see `accordion.mdx`.
     */
    anchors?: boolean;
    className?: string;
};
/**
 * Arizona Digital accordion. Wraps `react-bootstrap`'s `Accordion` — this
 * component has real interactive behavior (collapse/expand, focus, ARIA
 * wiring), so it wraps the library rather than being hand-rolled; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
declare const Accordion: react.ForwardRefExoticComponent<AccordionProps & react.RefAttributes<HTMLDivElement>>;

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

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderTabs` so the
 * HTML and React implementations render equivalent markup from the same
 * args, except `content`, which accepts a `ReactNode` here instead of a
 * plain string.
 */
type TabItemProps = {
    /** Tab label text. */
    title: string;
    /** Tab panel body content. */
    content: ReactNode;
    /** Disables this tab. Defaults to `false`. */
    disabled?: boolean;
};
type TabsProps = {
    /** Base `id` for the tablist. Defaults to `tabs`. */
    id?: string;
    items: TabItemProps[];
    /**
     * Which item is active on initial render, by index. Defaults to the first
     * non-disabled item.
     */
    defaultActiveIndex?: number;
    /** Nav style. Defaults to `tabs`. */
    variant?: 'tabs' | 'pills' | 'underline';
    /**
     * Lays the tablist out as a vertical column beside its tab-content, with
     * `aria-orientation="vertical"` on the tablist. Matches Arizona Bootstrap's
     * own vertical-tabs example — genuinely upstream Bootstrap behavior, not
     * Arizona-specific (unlike "Vertical Pills" in the same docs page, which is
     * a different, static/non-interactive nav pattern this component doesn't
     * cover — see tabs.mdx).
     */
    vertical?: boolean;
    /** Proportionately fills the available width across tab items (`.nav-fill`). */
    fill?: boolean;
    /** Makes every tab item the same width, filling the available width (`.nav-justified`). */
    justify?: boolean;
    className?: string;
};
/**
 * Arizona Digital tabs. Wraps `react-bootstrap`'s `Nav`/`Tab` — this component
 * has real interactive behavior (tab-panel switching, focus, ARIA wiring), so
 * it wraps the library rather than being hand-rolled; see
 * `.claude/skills/design-system-component/SKILL.md`.
 *
 * Built on the lower-level `Nav`/`Tab.Container`/`Tab.Content`/`Tab.Pane`
 * pieces rather than the higher-level `Tabs`/`Tab` shorthand — that shorthand
 * always wraps each tab in `<li role="presentation">` internally (not
 * configurable via props), and Arizona Bootstrap has a custom override rule,
 * `.nav.nav-pills.flex-column > li` (in `scss/override/_nav.scss`), scoped to
 * a *different* component's markup (`Nav`'s "Vertical Pills" nested-menu
 * variant, which really does use `<li>`). That selector doesn't know the
 * difference — it matched `Tabs`'s `<li>` wrappers too whenever `variant`
 * was `pills` and `vertical` was set, adding borders and negative margins
 * that were never meant for a tabbed interface. Verified directly: switching
 * to `Nav.Link` with no `Nav.Item`/`<li>` wrapper (matching Arizona
 * Bootstrap's own real vertical-tabs markup, which uses bare `<button>`s in a
 * `<div>`, not `<ul>`/`<li>`) removed the extra styling entirely.
 *
 * Not a `forwardRef` component like `Button`/`Accordion` — no ref-forwarding
 * target of its own to forward a ref on to, now that this doesn't render
 * `react-bootstrap`'s `Tabs` directly.
 */
declare function Tabs(props: TabsProps): react.JSX.Element;

export { Accordion, type AccordionItemProps, type AccordionProps, Button, type ButtonColor, type ButtonHtmlTag, type ButtonProps, type ButtonSize, type ButtonStyle, Nav, type NavItemProps, type NavProps, type TabItemProps, Tabs, type TabsProps };
