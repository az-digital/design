import { describe, expect, it } from 'vitest';
import { bearDown100Structure, primaryDesignSystemStructure } from './informationArchitecture';

describe('information architecture structure', () => {
  it('captures the primary design system hierarchy', () => {
    expect(primaryDesignSystemStructure).toEqual([
      {
        title: 'Primary',
        children: [
          {
            title: 'Primary/Foundations',
            children: [
              'Primary/Foundations/Foundations overview',
              {
                title: 'Primary/Foundations/Accessibility',
                children: [
                  'Primary/Foundations/Accessibility/Designing',
                  'Primary/Foundations/Accessibility/Writing & Text',
                ],
              },
              {
                title: 'Primary/Foundations/Content Design',
                children: [
                  'Primary/Foundations/Content Design/Alt text guidance',
                  'Primary/Foundations/Content Design/Style guide for writing',
                ],
              },
            ],
          },
          {
            title: 'Primary/Components',
            children: [
              {
                title: 'Primary/Components/Buttons',
                children: [
                  'Primary/Components/Buttons/Icon buttons',
                  'Primary/Components/Buttons/Segmented Control',
                ],
              },
              {
                title: 'Primary/Components/Containers',
                children: [
                  'Primary/Components/Containers/Accordions',
                  'Primary/Components/Containers/Card',
                  'Primary/Components/Containers/Table',
                  'Primary/Components/Containers/Tabs',
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it('includes the Bear Down 100 lifecycle and toolkit guidance', () => {
    expect(bearDown100Structure).toEqual([
      {
        title: 'Bear Down 100',
        children: [
          'Bear Down 100/Overview',
          'Bear Down 100/Timeline and lifecycle',
          'Bear Down 100/Toolkits and campaigns',
        ],
      },
    ]);
  });
});
