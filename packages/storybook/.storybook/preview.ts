/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import azTheme from './azTheme';
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
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Layout', ['Overview', 'Breakpoints', 'Grid', 'Spacing'], 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
    docs: {
      theme: azTheme,
    },
  },
};

export default preview;
