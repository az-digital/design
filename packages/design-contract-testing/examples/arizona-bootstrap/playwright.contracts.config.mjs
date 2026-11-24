import { defineConfig, devices } from '@playwright/test';

// Separate from Arizona Bootstrap's before/after visual-regression configuration.
export default defineConfig({
  testDir: '.',
  testMatch: '**/design-contract.spec.mjs',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], bypassCSP: true },
});
