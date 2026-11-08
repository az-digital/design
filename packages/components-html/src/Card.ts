import { escapeHtml } from './escapeHtml';

export type CardProps = {
  title: string;
  /** Rich-text HTML for the body slot. The caller must sanitize it. */
  body: string;
  header?: string;
  footer?: string;
};

export function renderCard({ title, body, header = '', footer = '' }: CardProps): string {
  return `<div class="card bg-cloud border-0">
  ${header ? `<div class="card-header">${escapeHtml(header)}</div>` : ''}
  <div class="card-body text-tinta">
    <h3 class="card-title h5 fw-bold mb-2 text-azurite">${escapeHtml(title)}</h3>${body}
  </div>
  ${footer ? `<div class="card-footer">${escapeHtml(footer)}</div>` : ''}
</div>`;
}
