/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import '../../tokens/dist/tokens.css';
import azTheme from './azTheme';
import '@tokens/dist/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', '*'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
    docs: {
      theme: azTheme,
    },
  },
};

export default preview;
