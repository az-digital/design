import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
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
