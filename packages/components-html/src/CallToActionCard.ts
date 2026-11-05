import { escapeHtml } from './escapeHtml';

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
