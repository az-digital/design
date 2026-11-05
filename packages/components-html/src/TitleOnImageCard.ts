import { escapeHtml } from './escapeHtml';

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
