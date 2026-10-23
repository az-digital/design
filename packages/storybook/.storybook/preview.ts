/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import '@tokens/dist/tokens.css';
// Points Arizona Bootstrap's styles (loaded in preview-head.html) at the tokens. Storybook only.
import './arizona-bootstrap-shim.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
  },
};

export default preview;
