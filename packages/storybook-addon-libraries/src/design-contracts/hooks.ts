import type { StoryContext } from '@storybook/react-vite';
import type { LibrariesParameter } from '../types';
import { DESIGN_CONTRACT_REPORT_TYPE, type ComponentContractRun } from './report';
import type { ComponentContractTestInput } from './types';

/**
 * `parameters.designContracts`: `test: 'off'` leaves a story's checks out;
 * `variant` tests only the contract variant the story shows.
 */
export type DesignContractsParameter = { test?: 'todo' | 'off'; variant?: Record<string, string> };

export type ComponentContractTestRunner = (
  input: ComponentContractTestInput,
) => Promise<ComponentContractRun | undefined>;

function describeError(error: unknown) {
  const messages: string[] = [];
  for (let current = error; current && messages.length < 5; current = current instanceof Error ? current.cause : undefined) {
    messages.push(current instanceof Error ? current.message : String(current));
  }
  return messages.join('\n');
}

/**
 * Run contract measurements before Storybook pauses transitions, then attach
 * their report in `afterEach`, alongside other Storybook test reports.
 * Supply the repository's contract data and browser-checking engine through
 * `runComponentContractTests`; browsing Storybook never runs the checks.
 */
export function createDesignContractHooks(
  runComponentContractTests: ComponentContractTestRunner,
  reportRun: (run: ComponentContractRun, storyId: string) => Promise<void>,
) {
  type PendingResult = { run: ComponentContractRun } | { error: string; cause: unknown };
  const pending = new Map<string, PendingResult>();

  const beforeEach = async (context: StoryContext) => {
    if (import.meta.env.MODE !== 'test') return;
    const component = (context.parameters.azLibraries as LibrariesParameter | undefined)?.component;
    const parameter = context.parameters.designContracts as DesignContractsParameter | undefined;
    if (!component || parameter?.test === 'off') return;
    pending.delete(context.id);
    try {
      const run = await runComponentContractTests({
        component,
        tags: context.tags,
        container: context.canvasElement,
        library: context.globals.library,
        variant: parameter?.variant,
      });
      if (run) pending.set(context.id, { run });
    } catch (error) {
      pending.set(context.id, { error: describeError(error), cause: error });
    }
  };

  const afterEach = async (context: StoryContext) => {
    const result = pending.get(context.id);
    pending.delete(context.id);
    if (!result) return;
    if ('error' in result) {
      context.reporting.addReport({
        type: DESIGN_CONTRACT_REPORT_TYPE,
        status: 'failed',
        result: { error: result.error },
      });
      throw result.cause;
    }
    context.reporting.addReport({
      type: DESIGN_CONTRACT_REPORT_TYPE,
      status: result.run.report.needsAttention ? 'warning' : 'passed',
      result: result.run.report,
    });
    await reportRun(result.run, context.id);
  };

  return { beforeEach, afterEach };
}
