export type ArizonaHeaderProps = {
  /** Background color. `red` is deprecated in favor of `blue`. Defaults to `blue`. */
  variant?: 'blue' | 'red';
  /**
   * Fixes the header to the top of the viewport on mobile (`.az-fixed-header-on-mobile`).
   * Only turn this on if the header also has off-canvas content (search/menu) added below
   * it — without that, this just hard-caps the header's height on mobile for no benefit.
   * The off-canvas "Extending the header" pattern itself isn't covered by this component yet
   * — see arizona-header.mdx.
   */
  fixedOnMobile?: boolean;
  /** Base `id` for the header element. Defaults to `header_arizona`. */
  id?: string;
};

/**
 * Renders the University of Arizona wordmark header as an HTML string using
 * Arizona Bootstrap's real markup/classes. The logo link (href, title, alt,
 * image src) is fixed UA brand content, not configurable — every real,
 * documented example uses the exact same ones.
 */
export function renderArizonaHeader(props: ArizonaHeaderProps = {}): string {
  const { variant = 'blue', fixedOnMobile = false, id = 'header_arizona' } = props;
  const classes = ['arizona-header', fixedOnMobile && 'az-fixed-header-on-mobile', variant === 'red' ? 'bg-red' : 'bg-blue'].filter(Boolean).join(' ');

  return `<div class="${classes}" id="${id}">
  <div class="container">
    <div class="row">
      <a class="arizona-logo col-auto" href="https://www.arizona.edu" title="The University of Arizona homepage">
        <img class="arizona-line-logo" alt="The University of Arizona Wordmark Line Logo White" src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg" fetchpriority="high">
      </a>
    </div>
  </div>
</div>`;
}
