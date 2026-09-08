import { create } from 'storybook/theming';

export default create({
  base: 'light',
  fontBase: '"Proxima Nova", sans-serif',
  fontCode: 'monospace',
  brandTitle: 'Arizona Digital Design System',
  brandUrl: 'https://github.com/az-digital/design',
  brandImage: '/images/ua_blue_logo.png',
  colorPrimary: '#AB0520',
  colorSecondary: '#0C234B',

  // UI
  appBg: '#E5EFF7',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#850000',
  appBorderRadius: 4,
 
  // Text colors
  textColor: '#03132E',
  textInverseColor: '#FFFFFF',
 
  // Toolbar default and active colors
  barTextColor: '#0C234B',
  barSelectedColor: '#81CEEB',
  barHoverColor: '#81CEEB',
  barBg: '#E5EFF7',
 
  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#0C234B',
  inputTextColor: '#0C234B',
  inputBorderRadius: 8,
});
