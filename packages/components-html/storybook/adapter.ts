// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what renderButton returns.
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { renderButton, type ButtonProps } from '../src';

export default {
  components: {
    button: {
      render: (props: ButtonProps) => renderButton(props),
      source: (props: ButtonProps) => renderButton(props),
    },
  },
} satisfies LibraryAdapter;
