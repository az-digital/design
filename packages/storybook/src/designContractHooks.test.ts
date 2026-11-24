import type { StoryContext } from '@storybook/react-vite';
import { describe, expect, it, vi } from 'vitest';
import {
  createDesignContractHooks,
  type ComponentContractRun,
} from '@az-digital/storybook-addon-libraries/design-contracts';

const run: ComponentContractRun = {
  report: { component: 'button', needsAttention: false, libraries: [] },
  summary: 'button: conforming',
  details: 'button: conforming',
  cases: [],
};

function context(addReport: (report: unknown) => void): StoryContext {
  return {
    id: 'button--default',
    parameters: { azLibraries: { component: 'button' } },
    globals: { library: 'html' },
    tags: ['lib:html'],
    canvasElement: {},
    reporting: { addReport },
  } as unknown as StoryContext;
}

describe('design contract lifecycle hooks', () => {
  it('runs measurements beforeEach and attaches the report afterEach', async () => {
    const calls: string[] = [];
    const addReport = vi.fn(() => {
      calls.push('attach');
    });
    const runTests = vi.fn(async () => {
      calls.push('measure');
      return run;
    });
    const reportRun = vi.fn(async () => {
      calls.push('report');
    });
    const hooks = createDesignContractHooks(runTests, reportRun);
    const story = context(addReport);

    await hooks.beforeEach(story);
    expect(calls).toEqual(['measure']);

    await hooks.afterEach(story);
    expect(calls).toEqual(['measure', 'attach', 'report']);
    expect(addReport).toHaveBeenCalledWith(expect.objectContaining({
      status: 'passed',
      result: run.report,
    }));
    expect(reportRun).toHaveBeenCalledWith(run, 'button--default');
  });

  it('passes a story\'s variant to the runner', async () => {
    const runTests = vi.fn(async () => run);
    const hooks = createDesignContractHooks(runTests, vi.fn(async () => {}));
    const story = context(vi.fn());
    story.parameters.designContracts = { variant: { color: 'outline-white' } };
    await hooks.beforeEach(story);
    expect(runTests).toHaveBeenCalledWith(expect.objectContaining({ variant: { color: 'outline-white' } }));
  });
});
