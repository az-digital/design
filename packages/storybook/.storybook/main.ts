import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx|js|jsx|mjs))'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
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
