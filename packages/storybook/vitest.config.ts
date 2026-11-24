import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import type { ComponentContractRun } from '@az-digital/storybook-addon-libraries/design-contracts';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [{
      extends: true,
      test: {
        environment: 'node',
        include: ['**/*.test.ts']
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(import.meta.dirname, '.storybook'),
      })],
      test: {
        name: 'storybook',
        testTimeout: 180000,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          commands: {
            // Each component story's design contract results; scripts/test-design-contracts.mjs collects them.
            reportDesignContractTests: (_context, run: ComponentContractRun, storyId: string) => {
              if (process.env.AZ_DESIGN_CONTRACT_TESTS === 'all') {
                process.stdout.write(`\nAZ_CONTRACT_REPORT_BEGIN\n${JSON.stringify({ ...run, storyId })}\nAZ_CONTRACT_REPORT_END\n`);
              } else {
                process.stdout.write(`${run.summary}\n`);
              }
            },
          },
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});