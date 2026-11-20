import { create, themes } from 'storybook/theming';
import { az } from '../../tokens/dist/tokens.vars.js';

export const colorSchemeQuery = '(prefers-color-scheme: dark)';

export function getAzTheme() {
  const base = globalThis.matchMedia?.(colorSchemeQuery).matches ? 'dark' : 'light';
  return create({
    ...themes[base],
    fontBase: az.fontFamily.sansSerif,
    fontCode: az.fontFamily.monospace,
    brandTitle: 'Arizona Digital Design System',
    brandUrl: 'https://www.arizona.edu/',
    brandImage: base === 'dark'
      ? 'https://digital.arizona.edu/arizona-bootstrap/v5/docs/5.3/assets/brand/arizona-bootstrap-logo-webheader-white.svg'
      : 'https://www.arizona.edu/sites/default/files/UA_horiz_rgb_webheader.png',
  });
}
