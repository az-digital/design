import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { test } from '@playwright/test';
import { loadContracts } from '@az-digital/design-contract-testing/node';
import { testDesignContractInPage, describeCoverage, formatResult } from '@az-digital/design-contract-testing/playwright';

if (!process.env.AZ_BOOTSTRAP_CHECKOUT) throw new Error('Set AZ_BOOTSTRAP_CHECKOUT to an Arizona Bootstrap checkout.');
const checkout = resolve(process.env.AZ_BOOTSTRAP_CHECKOUT);
const metadata = JSON.parse(readFileSync(join(checkout, 'package.json'), 'utf8'));
const docsVersion = metadata.config?.version_short;
if (!docsVersion) throw new Error('Arizona Bootstrap package.json must specify config.version_short');
const buttonDocs = readFileSync(join(checkout, `site/content/docs/${docsVersion}/components/buttons.md`), 'utf8');
const css = join(checkout, 'dist/css/arizona-bootstrap.css');
const { data, tokens, versions } = loadContracts({ from: process.cwd() });

const colors = ['red', 'outline-red', 'blue', 'outline-blue', 'rain', 'outline-rain', 'white-text-red', 'white-text-blue', 'outline-white'];
const sizes = [
  { name: 'default', cssClass: null, option: null },
  { name: 'small', cssClass: 'btn-sm', option: 'size.small' },
  { name: 'large', cssClass: 'btn-lg', option: 'size.large' },
];

for (const color of colors) {
  for (const size of sizes) {
    test(`button ${color}, ${size.name}`, async ({ page }, testInfo) => {
      // Take a real button from this checkout's documentation, then apply the
      // documented size class; do not use Storybook's markup or Bootstrap copy.
      const markup = await page.evaluate(({ buttonDocs, color, sizeClass }) => {
        const doc = new DOMParser().parseFromString(buttonDocs, 'text/html');
        const button = [...doc.querySelectorAll('button')].find((element) =>
          element.classList.contains('btn') && element.classList.contains(`btn-${color}`) &&
          !element.disabled && !element.classList.contains('btn-arrow') &&
          !element.hasAttribute('data-bs-toggle') && !element.querySelector('*'),
        );
        if (!button) throw new Error(`No documented button for ${color}`);
        button.classList.remove('btn-sm', 'btn-lg');
        if (sizeClass) button.classList.add(sizeClass);
        button.setAttribute('data-contract-pilot', '');
        return button.outerHTML;
      }, { buttonDocs, color, sizeClass: size.cssClass });
      await page.setContent(`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>${markup}</body></html>`);
      await page.addStyleTag({ path: css });

      const result = await testDesignContractInPage(page, {
        data,
        tokens,
        contract: 'button',
        options: [`color.${color}`, ...(size.option ? [size.option] : [])],
        root: '[data-contract-pilot]',
        parts: { label: ':scope' },
        implementation: { name: `Arizona Bootstrap ${color}, ${size.name}`, file: 'scss/custom/_buttons.scss and the checked-out button documentation' },
      });
      await testInfo.attach('contract-result.json', {
        body: JSON.stringify({ versions, ...result }, null, 2),
        contentType: 'application/json',
      });
      const details = [describeCoverage(result), ...formatResult(result)].join('\n');
      console.log(`${result.ok ? 'conforms' : 'drift or incomplete coverage'}: ${details}`);
      if (result.entries.some((entry) => entry.code === 'AZC008')) {
        throw new Error(`Invalid contract or token data:\n${details}`);
      }
    });
  }
}
