import { escapeHtml } from './escapeHtml';

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
