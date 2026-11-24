import type { DesignContractTest, DesignContractFixture, DesignContractTarget } from '@az-digital/storybook-addon-libraries';
import type { ButtonProps } from '../src';

export const buttonTest: DesignContractTest<ButtonProps> = {
  fixtures: [{ name: 'button', props: (variants) => ({ label: 'Label', ...variants }) }],
  target: (container) => {
    const button = container.querySelector('button');
    if (!button) throw new Error('The HTML button fixture did not render a button.');
    return { parts: { root: button, label: button } };
  },
  implementation: { name: 'Arizona Bootstrap in Storybook', file: 'patches/ or packages/components-html/src/Button.ts' },
};

/** Cards have a containing grid column and share Arizona Bootstrap's part classes. */
export function cardTest<Props>(
  fixtures: [DesignContractFixture<Props>, ...DesignContractFixture<Props>[]],
): DesignContractTest<Props> {
  return {
    fixtures,
    prepare: (container) => {
      Object.assign(container.style, { width: '416px', maxWidth: '100%', padding: '2rem 0' });
    },
    target: (container) => {
      const root = container.querySelector('.card');
      if (!root) throw new Error('The HTML card fixture did not render a card.');
      const parts: DesignContractTarget['parts'] = { root };
      for (const [name, selector] of Object.entries({
        image: '.card-img-top',
        body: '.card-body',
        icon: '.card-icon',
        title: '.card-title',
        text: '.card-text, .card-body > .card-title + *',
        action: '.card-body > .btn',
        link: '.card-body li a, .card-body ul a',
        'header-footer': '.card-header, .card-footer',
      })) {
        const element = root.querySelector(selector);
        if (element) parts[name] = element;
      }
      return { parts, focus: root.querySelector('.stretched-link') ?? root };
    },
    implementation: { name: 'Arizona Bootstrap in Storybook', file: 'patches/ or packages/components-html/src' },
  };
}

export const photo = (width: number, height: number) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#868e96"/></svg>`)}`;
