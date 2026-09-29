function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Props otherwise mirror `@az-digital/components-react`'s `Accordion` so the
 * two implementations can be shown side by side from the same story args.
 */
export type AccordionItemProps = {
  /** Item heading text. */
  title: string;
  /** Item body text. */
  content: string;
  /** Whether this item is expanded on initial render. Defaults to `false`. */
  defaultOpen?: boolean;
};

export type AccordionProps = {
  /** Base `id` for the accordion container and its generated item ids. Defaults to `accordion`. */
  id?: string;
  items: AccordionItemProps[];
  /** Removes borders/rounded corners to render edge-to-edge with its parent container. */
  flush?: boolean;
  /**
   * When `true`, omits `data-bs-parent` so multiple items can stay open at once.
   * When `false` (default), opening an item collapses any other open sibling.
   */
  alwaysOpen?: boolean;
  /**
   * Adds a "Copy link" control to each item that copies a deep link to the
   * clipboard, and opens+scrolls to whichever item matches the page's URL
   * hash on load and on hash change. This is Arizona Bootstrap's real
   * `.az-accordion-anchor` markup — the behavior comes from
   * `accordion-anchors.js` (part of `arizona-bootstrap`'s JS bundle), not
   * from this package. The "Copied!" tooltip additionally depends on
   * Bootstrap's Tooltip plugin being initialized on the page — see
   * `accordion.mdx`. Works best paired with `alwaysOpen`: with
   * `data-bs-parent` grouping, opening a linked item also collapses its
   * sibling, which can read as a stutter on a fresh page load.
   */
  anchors?: boolean;
};

/** Renders the Accordion as an HTML string using Arizona Bootstrap's real accordion markup/classes. */
export function renderAccordion(props: AccordionProps): string {
  const { id = 'accordion', items, flush = false, alwaysOpen = false, anchors = false } = props;

  const classes = ['accordion', flush && 'accordion-flush'].filter(Boolean).join(' ');

  const itemsHtml = items
    .map((item, index) => {
      const headingId = `${id}-heading-${index}`;
      const collapseId = `${id}-collapse-${index}`;
      const isOpen = Boolean(item.defaultOpen);
      const buttonClasses = ['accordion-button', !isOpen && 'collapsed'].filter(Boolean).join(' ');
      const collapseClasses = ['accordion-collapse', 'collapse', isOpen && 'show'].filter(Boolean).join(' ');
      const parentAttribute = alwaysOpen ? '' : ` data-bs-parent="#${id}"`;

      const anchorHtml = anchors
        ? `
        <div class="pt-2">
          <a class="az-accordion-anchor icon-link" href="#${headingId}" data-bs-toggle="tooltip" data-bs-title="Copied!" data-bs-trigger="click">
            <span class="material-symbols-rounded" aria-hidden="true">link</span>
            <span>Copy link</span>
          </a>
        </div>`
        : '';

      return `<div class="accordion-item">
      <h2 class="accordion-header" id="${headingId}">
        <button class="${buttonClasses}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isOpen}" aria-controls="${collapseId}">
          ${escapeHtml(item.title)}
        </button>
      </h2>
      <div id="${collapseId}" class="${collapseClasses}" aria-labelledby="${headingId}"${parentAttribute}>
        <div class="accordion-body">${escapeHtml(item.content)}${anchorHtml}</div>
      </div>
    </div>`;
    })
    .join('\n    ');

  return `<div class="${classes}" id="${id}">
    ${itemsHtml}
  </div>`;
}
