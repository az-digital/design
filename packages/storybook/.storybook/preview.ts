/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import '@tokens/dist/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    // The Actions and Interactions panels are opt-in, so stories don't show
    // empty panels. A story that logs actions or has a play function turns its
    // panel back on with `actions: { disable: false }` or
    // `interactions: { disable: false }`.
    actions: { disable: true },
    interactions: { disable: true },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Typography', 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
  },
};

export default preview;
