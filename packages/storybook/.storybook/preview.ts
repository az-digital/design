/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import tokensDocument from '@tokens/tokens.json';
import '@tokens/dist/tokens.css';
// Arizona Bootstrap compiled from its Sass source, with the patches in patches/.
import './arizona-bootstrap.scss';

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
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', 'Terminology', '*', 'Layout', ['Overview', 'Breakpoints', 'Grid', 'Spacing'], 'Tokens', ['How to Use', 'Naming', 'Contributing'], 'Usability'], 'Components', ['Overview', 'Buttons', 'Containers', ['Accordions', 'Cards', ['Card', 'Link Card', 'Icon Card', 'Image Card', 'Title on Image Card', 'Quick Links Card', 'Call to Action Card'], '*'], '*'], '*'], 'Bear Down 100'],
      },
    },
  },
};

export default preview;
