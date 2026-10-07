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
        order: [
          'Primary',
          [
            'Overview',
            'Brand',
            ['Overview', 'Color', '*'],
            'Foundations',
            [
              'Overview',
              'Layout',
              ['Overview', 'Grids and Spacing', 'Breakpoints', '*'],
              'Typography',
              ['*'],
              'Accessibility',
              ['*'],
              'Content Design',
              ['*'],
              'Interaction',
              ['*'],
              'Usability',
              ['*'],
              '*',
            ],
            'Components',
            ['Overview', '*'],
            'Tokens',
            ['Overview', 'Using in Figma', 'Using in Code', 'Contributing', '*'],
            '*',
          ],
          'Bear Down 100',
        ],
      },
    },
  },
};

export default preview;
