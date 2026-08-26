import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { az } from '../../tokens/tokens.json';

// tokens.vars.js only exports var(--...) references, which resolve against
// tokens.css — loaded in preview.ts, not here in the manager UI. Read the
// hex straight from the token source instead of hardcoding a duplicate.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Arizona Digital Design Tokens',
    brandUrl: 'https://www.arizona.edu/',
    brandTarget: '_blank',
    brandImage: 'https://www.arizona.edu/sites/default/files/UA_horiz_rgb_webheader.png',
    colorPrimary: az.color.brand.red.$value,
    colorSecondary: az.color.brand.blue.$value,
  }),
});
