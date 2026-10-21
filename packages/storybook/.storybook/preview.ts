/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import '@tokens/dist/tokens.css';
// Each component's own values, generated from its contract.
import '@contracts/dist/contracts.css';
// Points Arizona Bootstrap's styles (loaded in preview-head.html) at the tokens. Storybook only.
import './arizona-bootstrap-shim.css';

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
  },
};

export default preview;
