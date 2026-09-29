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
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (viteConfig) => ({
    ...viteConfig,
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
