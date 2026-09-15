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

export { Accordion, type AccordionItemProps, type AccordionProps, Button, type ButtonColor, type ButtonHtmlTag, type ButtonProps, type ButtonSize, type ButtonStyle };
