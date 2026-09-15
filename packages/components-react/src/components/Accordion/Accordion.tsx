import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Accordion as RBAccordion } from 'react-bootstrap';

/**
 * Props otherwise mirror `@az-digital/components-html`'s `renderAccordion` so
 * the HTML and React implementations render equivalent markup from the same
 * args, except `content`, which accepts a `ReactNode` here instead of a
 * plain string.
 */
export type AccordionItemProps = {
  /** Item heading text. */
  title: string;
  /** Item body content. */
  content: ReactNode;
  /** Whether this item is expanded on initial render. Defaults to `false`. */
  defaultOpen?: boolean;
};

export type AccordionProps = {
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
  className?: string;
};

/**
 * Arizona Digital accordion. Wraps `react-bootstrap`'s `Accordion` — this
 * component has real interactive behavior (collapse/expand, focus, ARIA
 * wiring), so it wraps the library rather than being hand-rolled; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const { id = 'accordion', items, flush = false, alwaysOpen = false, className } = props;

  const openKeys = items.map((item, index) => (item.defaultOpen ? String(index) : null)).filter((key): key is string => key !== null);

  return (
    <RBAccordion ref={ref} id={id} flush={flush} alwaysOpen={alwaysOpen} defaultActiveKey={alwaysOpen ? openKeys : openKeys[0]} className={className}>
      {items.map((item, index) => (
        <RBAccordion.Item eventKey={String(index)} key={index}>
          <RBAccordion.Header>{item.title}</RBAccordion.Header>
          <RBAccordion.Body>{item.content}</RBAccordion.Body>
        </RBAccordion.Item>
      ))}
    </RBAccordion>
  );
});
