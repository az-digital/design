import type { Preview } from '@storybook/react-vite';
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon';
import '../../tokens/dist/tokens.css';
import azTheme from './azTheme';

const preview: Preview = {
  addons: [swatchbookAddon()],
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Tokens'],
      },
    },
    docs: {
      theme: azTheme,
    },
  },
};

export default preview;