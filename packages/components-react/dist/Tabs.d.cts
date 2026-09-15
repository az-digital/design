import * as react from 'react';
import { ReactNode } from 'react';

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

export { type TabItemProps, Tabs, type TabsProps };
