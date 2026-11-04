import { escapeHtml } from './escapeHtml';
import type { LinkCardProps } from './LinkCard';

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
