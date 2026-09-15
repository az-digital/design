import * as react from 'react';
import { ReactNode } from 'react';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderCard` so the
 * two implementations can be shown side by side from the same story args,
 * except `header`/`text`/`footer`, which accept a `ReactNode` here instead
 * of a plain string.
 */
type CardLinkProps = {
    /** Link label text. */
    label: string;
    /** Link URL. Defaults to `#`. */
    href?: string;
};
type CardProps = {
    /** Optional header, shown above everything else. */
    header?: ReactNode;
    /** Optional image cap (`.card-img-top`), shown below the header (if any) and above the body. */
    image?: {
        src: string;
        alt: string;
    };
    /** Card title, rendered as an `<h5 class="card-title">`. */
    title?: string;
    /** Card subtitle, rendered as an `<h6 class="card-subtitle">` directly beneath the title. */
    subtitle?: string;
    /** Body text. */
    text?: ReactNode;
    /** Links rendered at the end of the body, each as its own `.card-link`. */
    links?: CardLinkProps[];
    /** Optional footer, shown below everything else. */
    footer?: ReactNode;
    className?: string;
};
/**
 * Arizona Digital card. Purely presentational — Bootstrap's card has no
 * JavaScript behavior of its own (unlike Accordion/Tabs), so this is
 * hand-rolled rather than wrapping `react-bootstrap`; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
declare const Card: react.ForwardRefExoticComponent<CardProps & react.RefAttributes<HTMLDivElement>>;

export { Card, type CardLinkProps, type CardProps };
