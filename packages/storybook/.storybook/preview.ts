import type { Preview } from '@storybook/react-vite';
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon';

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
  },
};

export default preview;
