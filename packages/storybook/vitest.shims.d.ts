/// <reference types="@vitest/browser-playwright" />

declare module 'vitest/browser' {
  export { page, userEvent } from '@vitest/browser-playwright/context';
  export const commands: {
    reportDesignContractTests: (run: import('@az-digital/storybook-addon-libraries/design-contracts').ComponentContractRun, storyId: string) => Promise<void>;
  };
}
