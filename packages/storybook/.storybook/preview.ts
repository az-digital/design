import type { Preview } from '@storybook/react-vite';
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon';
import '../../tokens/dist/tokens.css';

const preview: Preview = {
  addons: [swatchbookAddon()],
  initialGlobals: {
    implementation: 'html',
  },
  globalTypes: {
    implementation: {
      description: 'Component implementation',
      toolbar: {
        title: 'Implementation',
        icon: 'component',
        items: [
          { value: 'html', title: 'HTML' },
          { value: 'react', title: 'React' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Tokens', 'Components'],
      },
    },
    docs: {
      codePanel: true,
      source: {
        // Swap the docs "Show code" panel to match the toolbar's Implementation
        // switcher. Stories provide `parameters.htmlSource` / `reactSource`
        // functions so the panel stays in sync with live control changes.
        transform: (code: string, storyContext: { globals: Record<string, unknown>; args: Record<string, unknown>; parameters: Record<string, unknown> }) => {
          const htmlSource = storyContext.parameters.htmlSource as ((args: Record<string, unknown>) => string) | undefined;
          const reactSource = storyContext.parameters.reactSource as ((args: Record<string, unknown>) => string) | undefined;

          if (storyContext.globals.implementation === 'react' && reactSource) {
            return reactSource(storyContext.args);
          }

          return htmlSource?.(storyContext.args) ?? code;
        },
      },
    },
  },
};

export default preview;
