import type { Preview } from '@storybook/react-vite';
import '../../tokens/dist/tokens.css';

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
