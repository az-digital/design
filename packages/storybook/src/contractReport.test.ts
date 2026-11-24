import { describe, expect, it } from 'vitest';
import {
  DESIGN_CONTRACT_REPORT_TYPE,
  DESIGN_CONTRACT_STATUS_TYPE_ID,
  getContractAttentionCount,
  getContractStatus,
  getContractStatuses,
  groupContractCases,
  mergePublishedContractResults,
  readPublishedContractResults,
  updateContractResults,
  type ComponentContractReport,
  type ContractCaseSummary,
  type StoryContractResult,
} from '@az-digital/storybook-addon-libraries/design-contracts';

const noCounts = { passed: 0, failed: 0, unsupported: 0, unmapped: 0, blocked: 0, skipped: 0 };
const passedCounts = { ...noCounts, passed: 1 };
const failedCounts = { ...passedCounts, failed: 1 };
const report: ComponentContractReport = {
  component: 'button',
  needsAttention: true,
  libraries: [
    { key: 'html', title: 'Arizona Bootstrap', kind: 'tested', cases: [{ fixture: 'button', options: [], ok: false, counts: failedCounts, coverage: '', findings: ['drift'] }] },
    { key: 'web', title: 'Web Components', kind: 'tested', cases: [{ fixture: 'button', options: [], ok: true, counts: passedCounts, coverage: '', findings: [] }] },
  ],
};
const run = (storyId: string, reports: { type: string; status: string; result: unknown }[]) => ({
  componentTestStatuses: [{ storyId }],
  reports: { [storyId]: reports },
});

describe('design contract results', () => {
  it('maps each story result to its own warning, success or error status', () => {
    const warning: StoryContractResult = { report };
    const success: StoryContractResult = {
      report: {
        ...report,
        needsAttention: false,
        libraries: report.libraries.map((library) => ({
          ...library,
          ...(library.kind === 'tested' ? { cases: library.cases.map((item) => ({ ...item, ok: true, counts: passedCounts, findings: [] })) } : {}),
        })),
      },
    };
    const error: StoryContractResult = { error: 'Could not render the fixture.' };
    expect(getContractStatus('button--default', warning, 'html')).toMatchObject({
      storyId: 'button--default',
      typeId: DESIGN_CONTRACT_STATUS_TYPE_ID,
      value: 'status-value:warning',
    });
    expect(getContractStatus('button--default', warning, 'web')?.value).toBe('status-value:success');
    expect(getContractStatus('button--default', warning, 'missing')).toBeUndefined();
    expect(getContractStatus('button--default', success, 'html')?.value).toBe('status-value:success');
    expect(getContractStatus('button--default', error, 'html')).toMatchObject({
      value: 'status-value:error',
      description: 'Could not render the fixture.',
    });
  });

  it('keeps the latest report for each story a run tested, and other stories\' earlier results', () => {
    const earlier = { other: { report } };
    const next = updateContractResults(earlier, run('button', [{ type: DESIGN_CONTRACT_REPORT_TYPE, status: 'warning', result: report }]));
    expect(next).toEqual({ other: { report }, button: { report } });
    expect(updateContractResults(next, run('button', []))).toEqual({ other: { report } });
  });

  it('loads published results by story and rejects invalid or inconsistent reports', () => {
    const published = { version: 1, stories: { 'button--default': report } };
    expect(readPublishedContractResults(published)).toEqual({ 'button--default': { report } });
    for (const invalid of [
      null,
      { ...published, version: 2 },
      { version: 1, stories: {} },
      { version: 1, stories: [] },
      { version: 1, stories: { '': report } },
      { version: 1, stories: { button: { ...report, needsAttention: false } } },
      { version: 1, stories: { button: { ...report, libraries: null } } },
    ]) {
      expect(() => readPublishedContractResults(invalid)).toThrow();
    }
  });

  it('does not replace a completed live run with a delayed published result', () => {
    const published = { button: { report }, card: { report } };
    const live = updateContractResults({}, run('button', [{
      type: DESIGN_CONTRACT_REPORT_TYPE,
      status: 'failed',
      result: { error: 'Could not render.' },
    }]));
    expect(mergePublishedContractResults(published, live, new Set(['button']))).toEqual({
      button: { error: 'Could not render.' },
      card: { report },
    });
    const cleared = updateContractResults(live, run('button', []));
    expect(mergePublishedContractResults(published, cleared, new Set(['button']))).toEqual({ card: { report } });
  });

  it('updates statuses for every tested story when the selected library changes', () => {
    const results: Record<string, StoryContractResult> = {
      button: { report },
      card: { report: { component: 'card', needsAttention: true, libraries: [
        { key: 'html', title: 'Arizona Bootstrap', kind: 'untested' },
      ] } },
    };
    expect(getContractStatuses(results, 'html').map(({ storyId, value }) => [storyId, value])).toEqual([
      ['button', 'status-value:warning'],
      ['card', 'status-value:warning'],
    ]);
    expect(getContractStatuses(results, 'web').map(({ storyId, value }) => [storyId, value])).toEqual([
      ['button', 'status-value:success'],
    ]);
  });

  it('groups cases by failed, conforming and incomplete checks', () => {
    const makeCase = (fixture: string, ok: boolean, counts: ContractCaseSummary['counts']): ContractCaseSummary => ({
      fixture, options: [], ok, counts, coverage: '', findings: [],
    });
    const groups = groupContractCases([
      makeCase('pass-with-skip', true, { ...passedCounts, skipped: 1 }),
      makeCase('drift', false, failedCounts),
      makeCase('unsupported', false, { ...passedCounts, unsupported: 1 }),
      makeCase('unmapped', false, { ...passedCounts, unmapped: 1 }),
      makeCase('mixed', false, { ...failedCounts, blocked: 1 }),
      makeCase('skipped-only', false, { ...noCounts, skipped: 1 }),
    ]);
    expect(groups.findings.map(({ fixture }) => fixture)).toEqual(['drift', 'mixed']);
    expect(groups.conforming.map(({ fixture }) => fixture)).toEqual(['pass-with-skip']);
    expect(groups.incomplete.map(({ fixture }) => fixture)).toEqual(['unsupported', 'unmapped', 'mixed', 'skipped-only']);
  });

  it('counts attention cases for the selected library', () => {
    expect(getContractAttentionCount({ report }, 'html')).toBe(1);
    expect(getContractAttentionCount({ report }, 'web')).toBe(0);
    expect(getContractAttentionCount({ report }, 'missing')).toBe(0);
    expect(getContractAttentionCount({ report }, undefined)).toBe(0);
    expect(getContractAttentionCount({ error: 'Could not render.' }, 'html')).toBe(0);
    expect(getContractAttentionCount({
      report: { component: 'header', needsAttention: true, libraries: [
        { key: 'html', title: 'Arizona Bootstrap', kind: 'untested' },
        { key: 'web', title: 'External Storybook', kind: 'external' },
      ] },
    }, 'html')).toBe(1);
    expect(getContractAttentionCount({
      report: { component: 'button', needsAttention: false, libraries: [
        { key: 'html', title: 'Arizona Bootstrap', kind: 'tested', cases: [
          { fixture: 'button', options: [], ok: true, counts: passedCounts, coverage: '', findings: [] },
          { fixture: 'button', options: ['color.red'], ok: true, counts: passedCounts, coverage: '', findings: [] },
        ] },
      ] },
    }, 'html')).toBe(0);
  });

  it('shows a broken test setup, and rejects malformed or falsely passing reports', () => {
    const failed = run('button', [{ type: DESIGN_CONTRACT_REPORT_TYPE, status: 'failed', result: { error: 'No button rendered.' } }]);
    expect(updateContractResults({}, failed)).toEqual({ button: { error: 'No button rendered.' } });
    for (const [status, result] of [['passed', report], ['warning', { ...report, libraries: null }]] as const) {
      expect(updateContractResults({}, run('button', [{ type: DESIGN_CONTRACT_REPORT_TYPE, status, result }])).button)
        .toEqual({ error: 'The design contract tests produced an invalid report.' });
    }
  });

  it('rejects invalid counts and counts inconsistent with a case status', () => {
    for (const counts of [{ ...failedCounts, passed: -1 }, { ...failedCounts, failed: 0 }]) {
      const invalid = {
        ...report,
        libraries: [{ key: 'html', title: 'Arizona Bootstrap', kind: 'tested', cases: [
          { fixture: 'button', options: [], ok: false, counts, coverage: '', findings: [] },
        ] }],
      };
      expect(updateContractResults({}, run('button', [{ type: DESIGN_CONTRACT_REPORT_TYPE, status: 'warning', result: invalid }])).button)
        .toEqual({ error: 'The design contract tests produced an invalid report.' });
    }
  });
});
