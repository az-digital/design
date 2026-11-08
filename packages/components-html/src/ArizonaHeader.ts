export type ArizonaHeaderProps = {
  variant?: 'blue' | 'red';
  headerButtons?: boolean;
};

const headerButton = (icon: string, label: string) => `<button type="button" class="btn btn-arizona-header">
          <span aria-hidden="true" class="icon material-symbols-rounded">${icon}</span>
          <span class="icon-text">${label}</span>
        </button>`;

export function renderArizonaHeader({ variant = 'blue', headerButtons = false }: ArizonaHeaderProps = {}): string {
  const colorClass = variant === 'red' ? 'bg-red' : 'bg-blue';
  return `<div class="arizona-header ${colorClass}">
  <div class="container">
    <div class="row">
      <a class="arizona-logo col-auto" href="https://www.arizona.edu" title="The University of Arizona homepage">
        <img class="arizona-line-logo" alt="The University of Arizona Wordmark Line Logo White" src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg">
      </a>${
        headerButtons
          ? `
      <div class="d-flex col-auto px-0">
        ${headerButton('search', 'Search')}
        ${headerButton('menu', 'Menu')}
      </div>`
          : ''
      }
    </div>
  </div>
</div>`;
}
