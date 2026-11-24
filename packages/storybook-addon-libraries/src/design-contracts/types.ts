import type {
  ContractRow,
  DesignContractTestResult,
  Target,
} from '@az-digital/design-contract-testing';
import type { DesignContractFixture, Library } from '../types';

export type ComponentContract = { variants: Record<string, string[]> };

export type DesignContractData = {
  contracts: Record<string, ComponentContract>;
  rows: ContractRow[];
};

export type DesignContractTestOptions = Pick<DesignContractFixture<unknown>, 'optionalParts' | 'skip'> & {
  implementation?: { name?: string; file?: string };
};

export type DesignContractComparator = (
  target: Target,
  component: string,
  options: string[],
  testOptions: DesignContractTestOptions,
) => Promise<DesignContractTestResult>;

export type DesignContractEngine = {
  compare: DesignContractComparator;
  describeCoverage: (result: DesignContractTestResult) => string;
  formatResult: (result: DesignContractTestResult) => string[];
};

export type ComponentContractTestInput = {
  component: string;
  tags: readonly string[];
  container: HTMLElement;
  library: unknown;
};

export type PlannedLibraryTest =
  | {
      kind: 'test';
      library: Library;
      adapter: NonNullable<Library['adapter']>['components'][string];
      contract: ComponentContract;
    }
  | { kind: 'untested' | 'no-contract' | 'external'; library: Library };
