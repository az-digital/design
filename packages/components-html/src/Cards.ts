import { escapeHtml } from './escapeHtml';

export type CardProps = { title: string; body: string; header?: string; footer?: string };

export function renderCard({ title, body, header = '', footer = '' }: CardProps): string {
  return `<div class="card bg-cloud border-0">
  ${header ? `<div class="card-header">${escapeHtml(header)}</div>` : ''}
  <div class="card-body text-tinta">
    <h3 class="card-title h5 fw-bold mb-2 text-azurite">${escapeHtml(title)}</h3>${body}
  </div>
  ${footer ? `<div class="card-footer">${escapeHtml(footer)}</div>` : ''}
</div>`;
}

export type LinkCardProps = { title: string; text: string; link: string };

export function renderLinkCard({ title, text, link }: LinkCardProps): string {
  return `<div class="card bg-cloud hover">
  <div class="card-body">
    <h3 class="card-title h5 fw-bold mb-2">
      <a href="${escapeHtml(link)}" class="stretched-link text-reset text-decoration-none">${escapeHtml(title)}</a>
    </h3>
    <p class="card-text">${escapeHtml(text)}</p>
  </div>
</div>`;
}

export type IconCardProps = LinkCardProps & { icon: string };

export function renderIconCard({ icon, title, text, link }: IconCardProps): string {
  return `<div class="card bg-cloud hover">
  <div class="card-body">
    <span class="card-icon material-symbols-rounded fw-light" style="font-variation-settings: 'FILL' 0" aria-hidden="true">${escapeHtml(icon)}</span>
    <h3 class="card-title h5 fw-bold mb-2">
      <a href="${escapeHtml(link)}" class="stretched-link text-reset text-decoration-none">${escapeHtml(title)}</a>
    </h3>
    <p class="card-text">${escapeHtml(text)}</p>
  </div>
</div>`;
}

export type ImageCardProps = LinkCardProps & { image: string; imageDescription?: string };

export function renderImageCard({ image, imageDescription = '', title, text, link }: ImageCardProps): string {
  return `<div class="card bg-cloud hover overflow-hidden">
  <div class="overflow-hidden">
    <img class="card-img-top img-fluid hover-img-zoom-in" src="${escapeHtml(image)}" alt="${escapeHtml(imageDescription)}">
  </div>
  <div class="card-body">
    <h3 class="card-title h5 fw-bold mb-2">
      <a href="${escapeHtml(link)}" class="stretched-link text-reset text-decoration-none">${escapeHtml(title)}</a>
    </h3>
    <p class="card-text">${escapeHtml(text)}</p>
  </div>
</div>`;
}

export type TitleOnImageCardProps = {
  image: string;
  imageDescription?: string;
  title: string;
  link: string;
};

export function renderTitleOnImageCard({
  image,
  imageDescription = '',
  title,
  link,
}: TitleOnImageCardProps): string {
  return `<div class="card border-0 hover overflow-hidden">
  <div class="ratio ratio-1x1 overflow-hidden">
    <img class="card-img-top object-fit-cover hover-img-zoom-in" src="${escapeHtml(image)}" alt="${escapeHtml(imageDescription)}">
    <div class="card-img-overlay p-0 d-flex flex-column">
      <h3 class="card-title text-bg-gradient-blue fw-bold h-50 mt-auto mb-0 p-4 d-flex align-items-end h5 hover-text-underline">
        <a href="${escapeHtml(link)}" class="stretched-link text-reset text-decoration-none">${escapeHtml(title)}</a>
      </h3>
    </div>
  </div>
</div>`;
}

export type QuickLink = { label: string; link: string };
export type QuickLinksCardProps = { title: string; text: string; links: QuickLink[] };

export function renderQuickLinksCard({ title, text, links }: QuickLinksCardProps): string {
  const items = links
    .map(({ label, link }) => `      <li>\n        <a href="${escapeHtml(link)}" class="card-link text-azurite fw-semibold tk-proxima-nova-condensed">${escapeHtml(label)}</a>\n      </li>`)
    .join('\n');
  return `<div class="card bg-cloud border-0">
  <div class="card-body">
    <h3 class="card-title h5 fw-bold mb-2 text-azurite">${escapeHtml(title)}</h3>
    <p class="card-text text-tinta">${escapeHtml(text)}</p>
    <ul class="list-unstyled mb-0">
${items}
    </ul>
  </div>
</div>`;
}

export type CallToActionCardProps = { title: string; text: string; button: string; buttonLink: string };

export function renderCallToActionCard({ title, text, button, buttonLink }: CallToActionCardProps): string {
  return `<div class="card bg-cloud border-0">
  <div class="card-body">
    <h3 class="card-title h5 fw-bold mb-2 text-azurite">${escapeHtml(title)}</h3>
    <p class="card-text text-tinta">${escapeHtml(text)}</p>
    <a href="${escapeHtml(buttonLink)}" class="btn btn-red stretched-link mt-3">${escapeHtml(button)}</a>
  </div>
</div>`;
}
