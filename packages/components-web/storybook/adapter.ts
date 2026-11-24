// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. The markup it shows is exactly what it renders.
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { AzButton, defineAzButton } from '../src/az-button';
import { renderAzButton } from '../src/markup';
import type { ButtonProps } from '../src/types';

export default {
  components: {
    button: {
      render: (props: ButtonProps) => {
        defineAzButton();
        return renderAzButton(props);
      },
      source: (props: ButtonProps) => renderAzButton(props),
      designContractTest: {
        fixtures: [{ name: 'button', props: (variants) => ({ label: 'Label', ...variants }) }],
        target: async (container) => {
          const element = container.querySelector('az-button');
          if (!(element instanceof AzButton)) throw new Error('The Web Components fixture did not render an az-button.');
          await element.updateComplete;
          const button = element.shadowRoot?.querySelector('button');
          if (!button) throw new Error('The az-button fixture has no button in its shadow root.');
          return { parts: { root: button, label: button }, hover: element, press: element };
        },
        implementation: { name: '<az-button>', file: 'packages/components-web/src/az-button.styles.ts' },
      },
    },
  },
} satisfies LibraryAdapter;
