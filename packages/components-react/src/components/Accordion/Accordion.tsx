'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Accordion as RBAccordion, Overlay, Tooltip } from 'react-bootstrap';
import type { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext';

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

const COPY_FEEDBACK_MS = 3000;
/**
 * Bootstrap's default collapse transition duration. The vanilla
 * implementation waits for the real `shown.bs.collapse`/`hidden.bs.collapse`
 * events before scrolling; `react-bootstrap` doesn't emit those, so this
 * approximates the same wait with a fixed delay instead.
 */
const COLLAPSE_TRANSITION_MS = 350;

function headingId(baseId: string, index: number) {
  return `${baseId}-heading-${index}`;
}

/**
 * "Copy link" control for one item, shown inside its body when `anchors` is
 * enabled. Copies a deep link to the item's heading and shows a "Copied!"
 * tooltip for `COPY_FEEDBACK_MS` — combines what the vanilla implementation
 * splits across a manually-timed native Bootstrap tooltip and a separate
 * icon-glyph swap into one piece of state driving both.
 */
function CopyLinkControl({ headingId: targetHeadingId }: { headingId: string }) {
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (!navigator.clipboard) {
      return;
    }

    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${targetHeadingId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
      })
      // A denied clipboard permission (or any other write failure) has no useful
      // recovery here beyond not showing "Copied!" — silently no-op rather than
      // leaving an unhandled rejection, unlike the vanilla accordion-anchors.js
      // this ports, which doesn't catch this either.
      .catch(() => {});
  };

  return (
    <div className="pt-2">
      <a ref={anchorRef} className="az-accordion-anchor icon-link" href={`#${targetHeadingId}`} onClick={handleClick}>
        <span className="material-symbols-rounded" aria-hidden="true">
          {copied ? 'check' : 'link'}
        </span>
        <span>Copy link</span>
      </a>
      <Overlay target={anchorRef.current} show={copied} placement="top">
        {(overlayProps) => <Tooltip {...overlayProps}>Copied!</Tooltip>}
      </Overlay>
    </div>
  );
}

/**
 * Arizona Digital accordion. Wraps `react-bootstrap`'s `Accordion` — this
 * component has real interactive behavior (collapse/expand, focus, ARIA
 * wiring), so it wraps the library rather than being hand-rolled; see
 * `.claude/skills/design-system-component/SKILL.md`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const { id = 'accordion', items, flush = false, alwaysOpen = false, anchors = false, className } = props;

  const [activeKey, setActiveKey] = useState<AccordionEventKey>(() => {
    const openKeys = items.map((item, index) => (item.defaultOpen ? String(index) : null)).filter((key): key is string => key !== null);
    return alwaysOpen ? openKeys : openKeys[0];
  });

  const openFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const index = items.findIndex((_item, itemIndex) => headingId(id, itemIndex) === hash);
    if (index === -1) {
      return;
    }

    const key = String(index);
    setActiveKey((current) => {
      if (!alwaysOpen) {
        return key;
      }
      const currentKeys = Array.isArray(current) ? current : [];
      return currentKeys.includes(key) ? currentKeys : [...currentKeys, key];
    });

    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, COLLAPSE_TRANSITION_MS);
  }, [id, items, alwaysOpen]);

  useEffect(() => {
    if (!anchors) {
      return undefined;
    }

    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run for a real hash navigation, not every render
  }, [anchors]);

  return (
    <RBAccordion ref={ref} id={id} flush={flush} alwaysOpen={alwaysOpen} activeKey={activeKey} onSelect={setActiveKey} className={className}>
      {items.map((item, index) => (
        <RBAccordion.Item eventKey={String(index)} key={index}>
          <RBAccordion.Header id={headingId(id, index)}>{item.title}</RBAccordion.Header>
          <RBAccordion.Body>
            {item.content}
            {anchors && <CopyLinkControl headingId={headingId(id, index)} />}
          </RBAccordion.Body>
        </RBAccordion.Item>
      ))}
    </RBAccordion>
  );
});
