import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Arizona Digital Design Tokens',
    brandUrl: 'https://www.arizona.edu/',
    brandTarget: '_blank',
    brandImage: 'https://www.arizona.edu/sites/default/files/UA_horiz_rgb_webheader.png',
    colorPrimary: '#ab0520',
    colorSecondary: '#0c234b',
  }),
});