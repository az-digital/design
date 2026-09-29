import * as react from 'react';

type ArizonaHeaderProps = {
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
declare const ArizonaHeader: react.ForwardRefExoticComponent<ArizonaHeaderProps & react.RefAttributes<HTMLDivElement>>;

export { ArizonaHeader, type ArizonaHeaderProps };
