/** vite-plugin-twig-drupal: a .twig import is a function that renders the template to HTML. */
declare module '*.twig' {
  const render: (variables?: Record<string, unknown>) => string;
  export default render;
}

/** The plugin ships without types; only the options .storybook/main.ts uses. */
declare module 'vite-plugin-twig-drupal' {
  import type { Plugin } from 'vite';
  export default function twig(options?: { namespaces?: Record<string, string> }): Plugin;
}
