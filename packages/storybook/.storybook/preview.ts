import type { Preview } from '@storybook/react-vite';
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon';
import type { ImplementationKey, Implementations } from '../stories/implementations';
import { sourceForImplementation } from '../stories/implementations';
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
        // switcher. Stories provide a `parameters.implementations` map (see
        // ../stories/implementations.tsx) so the panel stays in sync with live
        // control changes, and falls back gracefully when a story doesn't
        // have the currently-selected implementation at all.
        transform: (code: string, storyContext: { globals: Record<string, unknown>; args: Record<string, unknown>; parameters: Record<string, unknown> }) => {
          const implementations = storyContext.parameters.implementations as Implementations<Record<string, unknown>> | undefined;
          const key = storyContext.globals.implementation as ImplementationKey;

          if (!implementations) {
            return code;
          }

          return sourceForImplementation(implementations, key, storyContext.args) ?? `// Not implemented for "${key}" yet.`;
        },
      },
    },
  },
};

export default preview;
