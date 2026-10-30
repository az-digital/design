import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const componentPackages = ['components-html', 'components-react-bootstrap', 'components-web'];
const requiredSections = [
  '## What it is / Best for',
  '## Install / use',
  '## How it consumes design tokens',
  '## Contribute to it',
  '## Verification',
];

describe('component package documentation', () => {
  it.each(componentPackages)('%s uses the standard README sections', (packageName) => {
    const readme = readFileSync(resolve(repositoryRoot, 'packages', packageName, 'README.md'), 'utf8');

    for (const section of requiredSections) {
      expect(readme).toContain(section);
    }
  });

  it('builds the Components Overview from the registered libraries', () => {
    const overview = readFileSync(
      resolve(repositoryRoot, 'packages/storybook/stories/Primary/Components/Overview.mdx'),
      'utf8',
    );

    expect(overview).toContain('<LibraryPicker />');
    expect(overview).toContain('<LibraryReadme />');
    expect(overview).toContain('<LibraryComponents />');
  });
});
