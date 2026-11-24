import type { DesignContractTestResult, Entry } from '@az-digital/design-contract-testing';

/** The `reporting.addReport` type for a component story's design contract tests. */
export const DESIGN_CONTRACT_REPORT_TYPE = 'az-digital/design-contracts';
/** The Storybook sidebar status store for design contract test results. */
export const DESIGN_CONTRACT_STATUS_TYPE_ID = 'az-digital/design-contracts';

export type ContractCaseSummary = {
  fixture: string;
  options: string[];
  ok: boolean;
  counts: DesignContractTestResult['counts'];
  coverage: string;
  findings: string[];
  entries?: Entry[];
};

export type LibraryContractSummary =
  | { key: string; title: string; kind: 'tested'; cases: ContractCaseSummary[] }
  | { key: string; title: string; kind: 'untested' | 'no-contract' | 'external' };

/** One component story's results, for every library it lists. */
export type ComponentContractReport = {
  component: string;
  needsAttention: boolean;
  libraries: LibraryContractSummary[];
};

export type ContractCase = {
  library: string;
  component: string;
  fixture: string;
  options: string[];
  result: DesignContractTestResult;
};

/** What a story sends to the command line: its report, as text, and every result entry. */
export type ComponentContractRun = {
  report: ComponentContractReport;
  summary: string;
  details: string;
  cases: ContractCase[];
};

export type StoryContractResult = { report: ComponentContractReport } | { error: string };
export type DesignContractStatus = {
  storyId: string;
  typeId: string;
  value: 'status-value:warning' | 'status-value:success' | 'status-value:error';
  title: string;
  description: string;
  sidebarContextMenu: false;
};

type Report = { type: string; status: string; result: unknown };
type CompletedRun = {
  componentTestStatuses: { storyId: string }[];
  reports: Record<string, Report[] | undefined>;
};

const isString = (value: unknown): value is string => typeof value === 'string';
const COUNT_STATUSES = ['passed', 'failed', 'unsupported', 'unmapped', 'blocked', 'skipped'] as const;
const ENTRY_STATUSES = ['passed', 'failed', 'unsupported', 'unmapped', 'blocked', 'skipped'] as const;
const isStringOrNull = (value: unknown): value is string | null => value === null || isString(value);

function isCounts(value: unknown): value is DesignContractTestResult['counts'] {
  if (!value || typeof value !== 'object') return false;
  const counts = value as Record<string, unknown>;
  return COUNT_STATUSES.every((status) => {
    const count = counts[status];
    return typeof count === 'number' && Number.isSafeInteger(count) && count >= 0;
  });
}

function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return ENTRY_STATUSES.includes(item.status as (typeof ENTRY_STATUSES)[number])
    && isStringOrNull(item.code) && isStringOrNull(item.name) && isString(item.contract)
    && Array.isArray(item.options) && item.options.every(isString)
    && isStringOrNull(item.part) && isStringOrNull(item.condition) && isStringOrNull(item.property)
    && ['source', 'expected', 'drawn', 'reason', 'blockedBy', 'action'].every(
      (key) => item[key] === undefined || isString(item[key]),
    )
    && isString(item.message);
}

function isCase(value: unknown): value is ContractCaseSummary {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (!isString(item.fixture) || !Array.isArray(item.options) || !item.options.every(isString)
    || typeof item.ok !== 'boolean' || !isCounts(item.counts) || !isString(item.coverage)
    || !Array.isArray(item.findings) || !item.findings.every(isString)
    || (item.entries !== undefined && (!Array.isArray(item.entries) || !item.entries.every(isEntry)))) return false;
  const { passed, failed, unsupported, unmapped, blocked } = item.counts;
  return item.ok === (passed > 0 && failed + unsupported + unmapped + blocked === 0);
}

function isLibrary(value: unknown): value is LibraryContractSummary {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  if (!isString(item.key) || !isString(item.title)) return false;
  if (item.kind === 'tested') return Array.isArray(item.cases) && item.cases.length > 0 && item.cases.every(isCase);
  return item.kind === 'untested' || item.kind === 'no-contract' || item.kind === 'external';
}

export function isComponentContractReport(value: unknown): value is ComponentContractReport {
  if (!value || typeof value !== 'object') return false;
  const report = value as Record<string, unknown>;
  return isString(report.component) && typeof report.needsAttention === 'boolean'
    && Array.isArray(report.libraries) && report.libraries.every(isLibrary);
}

/** Drift and missing tests warn; only a broken test setup fails. */
export function needsAttention(libraries: LibraryContractSummary[]) {
  return libraries.some((library) =>
    library.kind === 'untested' || library.kind === 'no-contract'
    || (library.kind === 'tested' && library.cases.some((item) => !item.ok)));
}

export function readPublishedContractResults(value: unknown): Record<string, StoryContractResult> {
  if (!value || typeof value !== 'object') {
    throw new Error('The published design contract results are invalid.');
  }
  const { version, stories } = value as Record<string, unknown>;
  if (version !== 1 || !stories || typeof stories !== 'object' || Array.isArray(stories)) {
    throw new Error('The published design contract results have an unsupported format.');
  }
  const entries = Object.entries(stories);
  if (!entries.length) throw new Error('The published design contract results contain no stories.');
  return Object.fromEntries(entries.map(([storyId, report]) => {
    if (!storyId.trim() || !isComponentContractReport(report) || report.needsAttention !== needsAttention(report.libraries)) {
      throw new Error(`The published design contract results for "${storyId}" are invalid.`);
    }
    return [storyId, { report }];
  }));
}

/** A completed live run takes precedence over a delayed published report. */
export function mergePublishedContractResults(
  published: Record<string, StoryContractResult>,
  live: Record<string, StoryContractResult>,
  completedStoryIds: ReadonlySet<string>,
) {
  return {
    ...Object.fromEntries(Object.entries(published).filter(([storyId]) => !completedStoryIds.has(storyId))),
    ...live,
  };
}

export function getContractAttentionCount(
  result: StoryContractResult | undefined,
  selectedLibrary: string | undefined,
) {
  if (!result || 'error' in result || !selectedLibrary) return 0;
  const library = result.report.libraries.find((item) => item.key === selectedLibrary);
  if (!library || library.kind === 'external') return 0;
  if (library.kind !== 'tested') return 1;
  return library.cases.filter(({ ok }) => !ok).length;
}

export function groupContractCases(cases: readonly ContractCaseSummary[]) {
  return {
    findings: cases.filter(({ counts }) => counts.failed > 0),
    conforming: cases.filter(({ ok }) => ok),
    incomplete: cases.filter(({ counts }) =>
      counts.unsupported + counts.unmapped + counts.blocked > 0
      || (counts.passed === 0 && counts.failed === 0)),
  };
}

export function getContractStatus(
  storyId: string,
  result: StoryContractResult,
  selectedLibrary: string,
): DesignContractStatus | undefined {
  if ('error' in result) {
    return {
      storyId,
      typeId: DESIGN_CONTRACT_STATUS_TYPE_ID,
      value: 'status-value:error',
      title: 'Design contract tests',
      description: result.error,
      sidebarContextMenu: false,
    };
  }
  const library = result.report.libraries.find((item) => item.key === selectedLibrary);
  if (!library || library.kind === 'external') return undefined;
  const attention = library.kind === 'tested'
    ? library.cases.some((item) => !item.ok)
    : true;
  return {
    storyId,
    typeId: DESIGN_CONTRACT_STATUS_TYPE_ID,
    value: attention ? 'status-value:warning' : 'status-value:success',
    title: 'Design contract tests',
    description: attention
      ? `${library.title}: design contract drift or missing coverage needs attention.`
      : `${library.title}: configured design contract tests conform.`,
    sidebarContextMenu: false,
  };
}

export function getContractStatuses(results: Record<string, StoryContractResult>, selectedLibrary: string) {
  return Object.entries(results).flatMap(([storyId, result]) => {
    const status = getContractStatus(storyId, result, selectedLibrary);
    return status ? [status] : [];
  });
}

function readReport({ status, result }: Report): StoryContractResult {
  if (status === 'failed' && result && typeof result === 'object' && isString((result as { error?: unknown }).error)) {
    return { error: (result as { error: string }).error };
  }
  if (isComponentContractReport(result) && status === (result.needsAttention ? 'warning' : 'passed')) {
    return { report: result };
  }
  return { error: 'The design contract tests produced an invalid report.' };
}

/**
 * Merge a completed Vitest run into the latest results. A story the run tested
 * without a design contract report no longer has results; stories it didn't
 * run keep theirs.
 */
export function updateContractResults(previous: Record<string, StoryContractResult>, run: CompletedRun) {
  const next = { ...previous };
  for (const { storyId } of run.componentTestStatuses) {
    const found = (run.reports[storyId] ?? []).filter(({ type }) => type === DESIGN_CONTRACT_REPORT_TYPE);
    if (!found.length) delete next[storyId];
    else if (found.length > 1) next[storyId] = { error: 'The design contract tests reported more than once.' };
    else next[storyId] = readReport(found[0]);
  }
  return next;
}
