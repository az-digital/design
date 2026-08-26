import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      // Consume components-react and components-web from source so Storybook
      // always reflects the latest components without requiring a package build.
      alias: [
        ...(Array.isArray(viteConfig.resolve?.alias) ? viteConfig.resolve.alias : []),
        { find: '@az-digital/components-react', replacement: resolve(__dirname, '../../components-react/src/index.ts') },
        { find: '@az-digital/components-web', replacement: resolve(__dirname, '../../components-web/src/index.ts') },
      ],
    },
    build: {
      ...viteConfig.build,
      assetsInlineLimit: 0,
    },
  }),
};

export default config;
