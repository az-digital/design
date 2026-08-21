import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx|js|jsx|mjs))'],
  addons: [
    '@storybook/addon-docs',
    {
      name: '@unpunnyfuns/swatchbook-addon',
      options: {
        config: {
          // no resolver/themes yet: single tokens.json, one synthetic theme
          tokens: ['../tokens/tokens.json'],
          cssVarPrefix: '',
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: false,
  },
};

export default config;
