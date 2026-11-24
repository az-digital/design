import contractRows from '@contracts/dist/contracts.json';
import manifest from '@contracts/dist/manifest.json';
import type { ContractRow } from '@az-digital/design-contract-testing';
import {
  createDesignContractHooks,
  createDesignContractTestRunner,
} from '@az-digital/storybook-addon-libraries/design-contracts';
import type { StoryContext } from '@storybook/react-vite';
import {
  testDesignContract,
  describeCoverage,
  formatResult,
} from '../stories/Primary/Components/designContractTest';

const runComponentContractTests = createDesignContractTestRunner(
  {
    contracts: manifest.contracts,
    rows: contractRows as ContractRow[],
  },
  {
    compare: testDesignContract,
    describeCoverage,
    formatResult,
  },
);

const designContractHooks = createDesignContractHooks(
  runComponentContractTests,
  async (run, storyId) => {
    const { commands } = await import('vitest/browser');
    await commands.reportDesignContractTests(run, storyId);
  },
);

export async function runDesignContractAfterEach(context: StoryContext) {
  await designContractHooks.afterEach(context);
}

export async function runDesignContractBeforeEach(context: StoryContext) {
  await designContractHooks.beforeEach(context);
}
