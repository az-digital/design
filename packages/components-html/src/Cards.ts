import { escapeHtml } from './escapeHtml';

// The card contracts' markup (`packages/contracts/contracts/*card.contract.json`) in
// Arizona Bootstrap v5.3.0, which follows its Cards docs. Every card is a Cloud box;
// a card that goes to one page is a link card, with the title link covering the card.

export type CardProps = {
  /** The card's slot: rich text, as HTML. It is not escaped. Empty for an empty card. */
  slot?: string;
};

/**
 * The plain card: a Cloud box with a slot, `.card-body`, for rich text. It isn't a link.
 * Arizona Bootstrap sets a Cloud card's title and text colors only with `.hover`, so
 * `.text-tinta` sets the slot's text color here.
 */
export function renderCard({ slot = '' }: CardProps = {}): string {
  return `<div class="card bg-cloud border-0">
  <div class="card-body text-tinta">${slot}</div>
</div>`;
}

export type LinkCardProps = {
  title: string;
  text: string;
  /** The page the card goes to. */
  link: string;
};

/** A title and text that go to one page. */
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

export type IconCardProps = LinkCardProps & {
  /** A Material Symbols icon name. It is decorative. */
  icon: string;
};

/** A Link Card with an icon above the title. */
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

export type ImageCardProps = LinkCardProps & {
  /** The photo's URL, cropped to 5:3. */
  image: string;
  /** The photo's alt text. Empty when the title and text say what it shows. */
  imageDescription?: string;
};

/** A Link Card with a photo above the title, which zooms in on hover. */
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
  /** The photo's URL, cropped to a square. */
  image: string;
  /** The photo's alt text. Empty, so screen readers skip it: the title says where the card goes. */
  imageDescription?: string;
  /** One to three words for where the card goes. */
  title: string;
  /** The page the card goes to. */
  link: string;
};

/** A square photo with only a title on it. */
export function renderTitleOnImageCard({ image, imageDescription = '', title, link }: TitleOnImageCardProps): string {
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

export type QuickLinksCardProps = {
  title: string;
  text: string;
  /** Three to five links, each a label and the page it goes to. */
  links: QuickLink[];
};

/** A title, text and a list of links. The card isn't a link itself. */
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

export type CallToActionCardProps = {
  title: string;
  text: string;
  /** The action, in a word or two. It is the button's text. */
  button: string;
  /** The page where people take the action. */
  buttonLink: string;
};

/** A title, text and one button. The whole card is clickable. */
export function renderCallToActionCard({ title, text, button, buttonLink }: CallToActionCardProps): string {
  return `<div class="card bg-cloud border-0">
  <div class="card-body">
    <h3 class="card-title h5 fw-bold mb-2 text-azurite">${escapeHtml(title)}</h3>
    <p class="card-text text-tinta">${escapeHtml(text)}</p>
    <a href="${escapeHtml(buttonLink)}" class="btn btn-red stretched-link mt-3">${escapeHtml(button)}</a>
  </div>
</div>`;
}
