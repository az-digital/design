function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Props otherwise mirror `@az-digital/components-react`'s `Card` so the two
 * implementations can be shown side by side from the same story args, except
 * `header`/`text`/`footer`, which accept plain strings here instead of
 * `ReactNode`.
 */
export type CardLinkProps = {
  /** Link label text. */
  label: string;
  /** Link URL. Defaults to `#`. */
  href?: string;
};

export type CardProps = {
  /** Optional header, shown above everything else. */
  header?: string;
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
  text?: string;
  /** Links rendered at the end of the body, each as its own `.card-link`. */
  links?: CardLinkProps[];
  /** Optional footer, shown below everything else. */
  footer?: string;
};

/** Renders the Card as an HTML string using Arizona Bootstrap's real card markup/classes. */
export function renderCard(props: CardProps = {}): string {
  const { header, image, title, subtitle, text, links, footer } = props;

  const headerHtml = header ? `\n  <div class="card-header">${escapeHtml(header)}</div>` : '';
  const imageHtml = image ? `\n  <img src="${escapeHtml(image.src)}" class="card-img-top" alt="${escapeHtml(image.alt)}">` : '';
  const footerHtml = footer ? `\n  <div class="card-footer">${escapeHtml(footer)}</div>` : '';

  const titleHtml = title ? `\n    <h5 class="card-title">${escapeHtml(title)}</h5>` : '';
  const subtitleHtml = subtitle ? `\n    <h6 class="card-subtitle mb-2 text-body-secondary">${escapeHtml(subtitle)}</h6>` : '';
  const textHtml = text ? `\n    <p class="card-text">${escapeHtml(text)}</p>` : '';
  const linksHtml = links && links.length > 0 ? `\n    ${links.map((link) => `<a href="${escapeHtml(link.href ?? '#')}" class="card-link">${escapeHtml(link.label)}</a>`).join('\n    ')}` : '';

  const bodyHtml = `\n  <div class="card-body">${titleHtml}${subtitleHtml}${textHtml}${linksHtml}\n  </div>`;

  return `<div class="card">${headerHtml}${imageHtml}${bodyHtml}${footerHtml}\n</div>`;
}
