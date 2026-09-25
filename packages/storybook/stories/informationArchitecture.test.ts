import { describe, expect, it } from 'vitest';
import { bearDown100Structure, primaryDesignSystemStructure } from './informationArchitecture';

describe('information architecture structure', () => {
  it('captures the primary design system hierarchy', () => {
    expect(primaryDesignSystemStructure).toEqual([
      {
        title: 'Primary Design System',
        children: [
          {
            title: 'Primary Design System/Foundations',
            children: [
              'Primary Design System/Foundations/Foundations overview',
              {
                title: 'Primary Design System/Foundations/Accessibility',
                children: [
                  'Primary Design System/Foundations/Accessibility/Designing',
                  'Primary Design System/Foundations/Accessibility/Writing & Text',
                ],
              },
              {
                title: 'Primary Design System/Foundations/Content Design',
                children: [
                  'Primary Design System/Foundations/Content Design/Alt text guidance',
                  'Primary Design System/Foundations/Content Design/Style guide for writing',
                ],
              },
            ],
          },
          {
            title: 'Primary Design System/Components',
            children: [
              {
                title: 'Primary Design System/Components/Buttons',
                children: [
                  'Primary Design System/Components/Buttons/Icon buttons',
                  'Primary Design System/Components/Buttons/Segmented Control',
                ],
              },
              {
                title: 'Primary Design System/Components/Containers',
                children: [
                  'Primary Design System/Components/Containers/Accordions',
                  'Primary Design System/Components/Containers/Card',
                  'Primary Design System/Components/Containers/Table',
                  'Primary Design System/Components/Containers/Tabs',
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
