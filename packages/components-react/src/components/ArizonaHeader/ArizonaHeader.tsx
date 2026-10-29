import { forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

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
  className?: string;
};

/**
 * Arizona Digital University of Arizona header. Purely presentational — no
 * real interactive behavior, so this is hand-rolled rather than wrapping
 * `react-bootstrap`; see `.claude/skills/design-system-component/SKILL.md`.
 * The logo link (href, title, alt, image src) is fixed UA brand content, not
 * configurable — every real, documented example uses the exact same ones.
 */
export const ArizonaHeader = forwardRef<HTMLDivElement, ArizonaHeaderProps>(function ArizonaHeader(props, ref) {
  const { variant = 'blue', fixedOnMobile = false, id = 'header_arizona', className } = props;

  return (
    <div ref={ref} className={classNames('arizona-header', fixedOnMobile && 'az-fixed-header-on-mobile', variant === 'red' ? 'bg-red' : 'bg-blue', className)} id={id}>
      <div className="container">
        <div className="row">
          <a className="arizona-logo col-auto" href="https://www.arizona.edu" title="The University of Arizona homepage">
            <img
              className="arizona-line-logo"
              alt="The University of Arizona Wordmark Line Logo White"
              src="https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg"
              fetchPriority="high"
            />
          </a>
        </div>
      </div>
    </div>
  );
});
