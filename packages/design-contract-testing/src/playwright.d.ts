import type { Page } from 'playwright';
import type { DesignContractTestInput, DesignContractTestResult } from './browser.js';

export { CODES, describeCoverage, formatResult } from './browser.js';
export type { DesignContractTestResult, Entry } from './browser.js';

export type DesignContractPageTestInput = Omit<DesignContractTestInput, 'target' | 'driver'> & {
  /** A selector for the component's root element. */
  root: string;
  /** A selector for each contract part within the root, `:scope` for the root itself. */
  parts: Record<string, string>;
  focus?: string;
  hover?: string;
  press?: string;
  /** How long a pointer action waits for its element to be actionable, in ms. */
  timeout?: number;
};

export function testDesignContractInPage(page: Page, input: DesignContractPageTestInput): Promise<DesignContractTestResult>;
