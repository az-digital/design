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
};

/** Renders the Accordion as an HTML string using Arizona Bootstrap's real accordion markup/classes. */
export function renderAccordion(props: AccordionProps): string {
  const { id = 'accordion', items, flush = false, alwaysOpen = false } = props;

  const classes = ['accordion', flush && 'accordion-flush'].filter(Boolean).join(' ');

  const itemsHtml = items
    .map((item, index) => {
      const headingId = `${id}-heading-${index}`;
      const collapseId = `${id}-collapse-${index}`;
      const isOpen = Boolean(item.defaultOpen);
      const buttonClasses = ['accordion-button', !isOpen && 'collapsed'].filter(Boolean).join(' ');
      const collapseClasses = ['accordion-collapse', 'collapse', isOpen && 'show'].filter(Boolean).join(' ');
      const parentAttribute = alwaysOpen ? '' : ` data-bs-parent="#${id}"`;

      return `<div class="accordion-item">
      <h2 class="accordion-header" id="${headingId}">
        <button class="${buttonClasses}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isOpen}" aria-controls="${collapseId}">
          ${escapeHtml(item.title)}
        </button>
      </h2>
      <div id="${collapseId}" class="${collapseClasses}" aria-labelledby="${headingId}"${parentAttribute}>
        <div class="accordion-body">${escapeHtml(item.content)}</div>
      </div>
    </div>`;
    })
    .join('\n    ');

  return `<div class="${classes}" id="${id}">
    ${itemsHtml}
  </div>`;
}
