import type { Preview } from '@storybook/react-vite';
import swatchbookAddon from '@unpunnyfuns/swatchbook-addon';
import '../../tokens/dist/tokens.css';

const preview: Preview = {
  addons: [swatchbookAddon()],
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
