/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import tokensDocument from '@tokens/tokens.json';
import '@tokens/dist/tokens.css';

/** One viewport per breakpoint, at its minimum width, read from the az.breakpoint tokens. Storybook's own device sizes are left out. */
const breakpointViewports = Object.fromEntries(
  Object.entries(tokensDocument.az.breakpoint).map(([name, token]) => [
    `az-${name}`,
    { name: `${name} (${token.$value})`, styles: { width: token.$value, height: '900px' }, type: 'desktop' as const },
  ]),
);

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    viewport: {
      options: breakpointViewports,
    },
    // The Actions and Interactions panels are opt-in, so stories don't show
    // empty panels. A story that logs actions or has a play function turns its
    // panel back on with `actions: { disable: false }` or
    // `interactions: { disable: false }`.
    actions: { disable: true },
    interactions: { disable: true },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Interaction', ['Inputs', 'Selections', 'States'], 'Layout', ['Overview', 'Breakpoints', 'Grids and Spacing'], 'Typography', 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
  },
};

export default preview;
