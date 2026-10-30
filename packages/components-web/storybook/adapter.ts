// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what it renders.
import type { ButtonProps } from '@az-digital/components-html';
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { defineAzButton } from '../src/az-button';
import { renderAzButton } from '../src/markup';

export default {
  components: {
    button: {
      render: (props: ButtonProps) => {
        defineAzButton();
        return renderAzButton(props);
      },
      source: (props: ButtonProps) => renderAzButton(props),
    },
  },
} satisfies LibraryAdapter;
