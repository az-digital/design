import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx|js|jsx|mjs))'],
  staticDirs: ['../../../public'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
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
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    build: {
      ...viteConfig.build,
      assetsInlineLimit: 0,
    },
  }),
};

export default config;
