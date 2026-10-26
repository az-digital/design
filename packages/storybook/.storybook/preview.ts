/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import '@tokens/dist/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Typography', 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
  },
};

export default preview;
