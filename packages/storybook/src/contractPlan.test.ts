import { describe, expect, it } from 'vitest';
import type { ComponentAdapter, Library } from '@az-digital/storybook-addon-libraries';
import { planComponentTests, variantCases } from '@az-digital/storybook-addon-libraries/design-contracts';

const adapter: ComponentAdapter = {
  render: () => '',
  source: () => '',
  designContractTest: {
    fixtures: [{ name: 'default', props: () => ({}) }],
    target: () => { throw new Error('Not rendered in this test'); },
  },
};

const library = (components: Record<string, ComponentAdapter>, key = 'example'): Library => ({
  key,
  title: 'Example',
  status: 'preview',
  codeLanguage: 'html',
  packageName: 'example',
  stylesheets: [],
  adapter: { components },
});

describe('planning a component story\'s design contract tests', () => {
  const contracts = { button: { variants: {} }, card: { variants: {} } };
  const kinds = (plan: ReturnType<typeof planComponentTests>) => plan.map((entry) => [entry.library.key, entry.kind]);

  it('plans the libraries that have the component, and reports ones without tests or contracts', () => {
    const libraries = [
      library({ button: adapter, card: { render: () => '', source: () => '' }, extra: adapter }, 'html'),
      library({ card: adapter }, 'web'),
    ];
    expect(kinds(planComponentTests(libraries, contracts, 'button'))).toEqual([['html', 'test']]);
    expect(kinds(planComponentTests(libraries, contracts, 'card'))).toEqual([['html', 'untested'], ['web', 'test']]);
    expect(kinds(planComponentTests(libraries, contracts, 'extra'))).toEqual([['html', 'no-contract']]);
  });

  it('limits the libraries to the story\'s lib tags', () => {
    const libraries = [library({ card: adapter }, 'html'), library({ card: adapter }, 'web')];
    expect(kinds(planComponentTests(libraries, contracts, 'card', ['web']))).toEqual([['web', 'test']]);
  });

  it('does not claim to test a separate Storybook', () => {
    const external = { ...library({}), ref: 'https://example.com', adapter: undefined };
    expect(kinds(planComponentTests([external], contracts, 'button'))).toEqual([['example', 'external']]);
  });

  it('rejects an empty library inventory instead of reporting success', () => {
    expect(() => planComponentTests([], {}, 'button')).toThrow('No component libraries');
  });
});

describe('variant combinations', () => {
  it('checks omitted defaults and every explicit combination of axes', () => {
    expect(variantCases({ color: ['red', 'blue'], size: ['small'] })).toEqual([
      {}, { size: 'small' },
      { color: 'red' }, { color: 'red', size: 'small' },
      { color: 'blue' }, { color: 'blue', size: 'small' },
    ]);
    expect(variantCases({})).toEqual([{}]);
  });
});
