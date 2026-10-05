import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Link token files at the branch this Storybook is built from: the PR's branch
// for review-site builds of a pull request, the pushed branch for other CI
// builds, and main locally (a local branch may not exist on GitHub).
const gitRef = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || "main";

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx|js|jsx|mjs))'],

  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
    // Design tab: each story shows its Figma frames (parameters.design).
    getAbsolutePath("@storybook/addon-designs"),
    {
      // Token doc blocks and the Tokens tab, driven by our Style Dictionary config.
      name: getAbsolutePath("@az-digital/storybook-addon-tokens"),
      options: {
        styleDictionary: "../../tokens/style-dictionary.config.mjs",
        repositoryUrl: `https://github.com/az-digital/design/blob/${gitRef}/`,
      },
    },
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      // Consume components-react, components-html, and components-web from source so Storybook
      // always reflects the latest components without requiring a package build.
      alias: [
        ...(Array.isArray(viteConfig.resolve?.alias) ? viteConfig.resolve.alias : []),
        { find: '@az-digital/components-react', replacement: resolve(__dirname, '../../components-react/src/index.ts') },
        { find: '@az-digital/components-html', replacement: resolve(__dirname, '../../components-html/src/index.ts') },
        { find: '@az-digital/components-web', replacement: resolve(__dirname, '../../components-web/src/index.ts') },
        // Stable path to packages/tokens, independent of story folder depth.
        { find: '@tokens', replacement: resolve(__dirname, '../../tokens') },
      ],
    },
    build: {
      ...viteConfig.build,
      assetsInlineLimit: 0,
    },
  })
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
