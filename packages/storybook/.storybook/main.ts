import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import twig from 'vite-plugin-twig-drupal';

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
    // Theme toolbar (PROOF OF CONCEPT surface modes): sets data-az-surface, see preview.ts.
    getAbsolutePath("@storybook/addon-themes"),
    {
      // Token doc blocks and the Tokens tab, driven by our Style Dictionary config.
      name: getAbsolutePath("@az-digital/storybook-addon-tokens"),
      options: {
        styleDictionary: "../../tokens/style-dictionary.config.mjs",
        repositoryUrl: `https://github.com/az-digital/design/blob/${gitRef}/`,
        // PROOF OF CONCEPT (surface modes): dark values (placeholders), selected by the Theme toolbar.
        modes: {
          dark: { label: 'Dark', source: ['tokens.dark.json'], globals: { theme: 'Dark' } },
        },
      },
    },
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [
      ...(viteConfig.plugins ?? []),
      // Arizona Quickstart components are Drupal single directory components:
      // importing a .twig file gives a function that renders it to HTML, with
      // Drupal's Twig extensions (create_attribute, ...). `az_quickstart` is the
      // profile's SDC namespace, so `az_quickstart:button` includes resolve.
      twig({
        namespaces: {
          az_quickstart: resolve(__dirname, '../../components-quickstart/components'),
        },
      }),
    ],
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
