import { escapeHtml } from './escapeHtml';

export type QuickLink = { label: string; link: string };
export type QuickLinksCardProps = { title: string; text: string; links: QuickLink[] };

export function renderQuickLinksCard({ title, text, links }: QuickLinksCardProps): string {
  const items = (links ?? [])
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
