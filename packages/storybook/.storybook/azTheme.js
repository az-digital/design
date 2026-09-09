import { create } from 'storybook/theming';
import { az } from '../../tokens/tokens.json';

export default create({
  base: 'light',
  fontBase: '"Proxima Nova", sans-serif',
  fontCode: 'monospace',
  brandTitle: 'Arizona Digital Design System',
  brandUrl: 'https://www.arizona.edu/',
  brandImage: '/images/ua_blue_logo.png',
  colorPrimary: az.color.brand.red.$value,
  colorSecondary: az.color.brand.blue.$value,

  // UI
  appBg: az.color.brand.cloud.$value,
  appContentBg: az.color.brand.white.$value,
  appPreviewBg: az.color.brand.white.$value,
  appBorderColor: az.color.brand['sonoran-red'].$value,
  appBorderRadius: 4,
 
  // Text colors
  textColor: az.color.brand.tinta.$value,
  textInverseColor: az.color.brand.white.$value,
 
  // Toolbar default and active colors
  barTextColor: az.color.brand.blue.$value,
  barSelectedColor: az.color.brand.rain.$value,
  barHoverColor: az.color.brand.rain.$value,
  barBg: az.color.brand.cloud.$value,
 
  // Form colors
  inputBg: az.color.brand.white.$value,
  inputBorder: az.color.brand.blue.$value,
  inputTextColor: az.color.brand.blue.$value,
  inputBorderRadius: 8,
});
