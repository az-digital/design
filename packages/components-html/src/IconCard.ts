import { escapeHtml } from './escapeHtml';
import type { LinkCardProps } from './LinkCard';

export type IconCardProps = LinkCardProps & { icon: string };

export function renderIconCard({ icon, title, text, link }: IconCardProps): string {
  return `<div class="card bg-cloud hover">
  <div class="card-body">
    <span class="card-icon material-symbols-rounded fw-light text-nowrap" style="font-variation-settings: 'FILL' 0" aria-hidden="true">${escapeHtml(icon)}</span>
    <h3 class="card-title h5 fw-bold mb-2">
      <a href="${escapeHtml(link)}" class="stretched-link text-reset text-decoration-none">${escapeHtml(title)}</a>
    </h3>
    <p class="card-text">${escapeHtml(text)}</p>
  </div>
</div>`;
}
