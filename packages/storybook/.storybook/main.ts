import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx|mjs)'],
  addons: [],
  framework: {
    name: '@storybook/html-vite',
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
