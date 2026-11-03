import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/react-vite';

// Link token files at the branch this Storybook is built from: the PR's branch
// for review-site builds of a pull request, the pushed branch for other CI
// builds, and main locally (a local branch may not exist on GitHub).
const gitRef = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || "main";

const config: StorybookConfig = {
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx|js|jsx|mjs))'],

  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
    {
      // Token doc blocks and the Tokens tab, driven by our Style Dictionary config.
      name: getAbsolutePath("@az-digital/storybook-addon-tokens"),
      options: {
        styleDictionary: "../../tokens/style-dictionary.config.mjs",
        repositoryUrl: `https://github.com/az-digital/design/blob/${gitRef}/`,
      },
    },
    getAbsolutePath("@storybook/addon-vitest")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        // stable path to packages/tokens, independent of story folder depth
        '@tokens': fileURLToPath(new URL('../../tokens', import.meta.url)),
        // stable path to packages/contracts, for docs pages that read a component's contract
        '@contracts': fileURLToPath(new URL('../../contracts', import.meta.url)),
      },
    },
    build: {
      ...viteConfig.build,
      assetsInlineLimit: 0,
    },
    // Arizona Bootstrap compiled from its Sass source (arizona-bootstrap.scss).
    css: {
      ...viteConfig.css,
      preprocessorOptions: {
        scss: {
          // Resolve Arizona Bootstrap's bare `bootstrap/scss/...` imports.
          loadPaths: [fileURLToPath(new URL('../../../node_modules', import.meta.url))],
          // Arizona Bootstrap's own deprecation warnings, such as @import.
          // Its background images (url("img/...")) stay unresolved: the
          // package ships them only beside its released CSS, not its Sass.
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  })
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
