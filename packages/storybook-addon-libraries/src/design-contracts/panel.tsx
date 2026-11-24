import React, { useEffect, useSyncExternalStore } from 'react';
import {
  addons,
  experimental_getStatusStore,
  types,
  useGlobals,
  useStorybookApi,
  useStorybookState,
} from 'storybook/manager-api';
import { Badge, Button, EmptyTabContent, Select, TabsView } from 'storybook/internal/components';
import { useTheme } from 'storybook/theming';
import { BeakerIcon } from '@storybook/icons';
import type { TestRunResult } from '@storybook/addon-vitest/constants';
import type { Entry } from '@az-digital/design-contract-testing';
import { GLOBAL } from '../constants';
import {
  DESIGN_CONTRACT_STATUS_TYPE_ID,
  getContractAttentionCount,
  getContractIssueEntries,
  getContractStatuses,
  groupContractCases,
  mergePublishedContractResults,
  readPublishedContractResults,
  updateContractResults,
  type ContractCaseSummary,
  type LibraryContractSummary,
  type StoryContractResult,
} from './report';

const ADDON_ID = 'az-digital/design-contracts';
const PANEL_ID = `${ADDON_ID}/panel`;
// The Vitest addon's constants entry is Node-only; keep its browser channel name type-checked.
const TEST_CHANNEL: typeof import('@storybook/addon-vitest/constants').STORYBOOK_ADDON_TEST_CHANNEL = 'storybook/test/channel';
const statuses = experimental_getStatusStore(DESIGN_CONTRACT_STATUS_TYPE_ID);
type PublishedState =
  | { kind: 'local' | 'loading' | 'ready' | 'missing' }
  | { kind: 'error'; message: string };
type ResultsState = { results: Record<string, StoryContractResult>; published: PublishedState };
let resultsState: ResultsState = {
  results: {},
  published: { kind: globalThis.CONFIG_TYPE === 'PRODUCTION' ? 'loading' : 'local' },
};
let statusStoryIds = new Set<string>();
const completedStoryIds = new Set<string>();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => resultsState;

function setResultsState(next: ResultsState) {
  resultsState = next;
  for (const listener of listeners) listener();
}

function recordRun(run: TestRunResult) {
  for (const { storyId } of run.componentTestStatuses) completedStoryIds.add(storyId);
  setResultsState({ ...resultsState, results: updateContractResults(resultsState.results, run) });
}

async function loadPublishedResults() {
  try {
    const response = await fetch(new URL('design-contract-results.json', document.baseURI), { cache: 'no-store' });
    if (response.status === 404) {
      setResultsState({ ...resultsState, published: { kind: 'missing' } });
      return;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
    const published = readPublishedContractResults(await response.json());
    setResultsState({
      results: mergePublishedContractResults(published, resultsState.results, completedStoryIds),
      published: { kind: 'ready' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Could not load published design contract results:', error);
    setResultsState({ ...resultsState, published: { kind: 'error', message } });
  }
}

const NOT_TESTED: Record<Exclude<LibraryContractSummary['kind'], 'tested'>, string> = {
  untested: 'Not tested: this implementation has no design contract test configured.',
  'no-contract': 'Not tested: this component has no design contract.',
  external: 'Not tested here: this implementation renders in its own Storybook.',
};
const CASE_LABEL = (fixture: string, options: string[]) => `${fixture} (${options.join(', ') || 'defaults'})`;
const PANEL = { height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' } as const;
const MESSAGE = { padding: 16, overflowY: 'auto' } as const;
const PRE = { margin: '6px 0', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 } as const;

export function DesignContractStatusSync({
  selectedLibrary,
}: {
  selectedLibrary?: string;
}) {
  const { results: allResults } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  useEffect(() => {
    const next = selectedLibrary ? getContractStatuses(allResults, selectedLibrary) : [];
    const nextIds = new Set(next.map((status) => status.storyId));
    const removed = [...statusStoryIds].filter((storyId) => !nextIds.has(storyId));
    if (removed.length) statuses.unset(removed);
    if (next.length) statuses.set(next);
    statusStoryIds = nextIds;
  }, [allResults, selectedLibrary]);
  return null;
}

function DesignContractPanelTitle() {
  const api = useStorybookApi();
  const { storyId = '' } = useStorybookState();
  const [globals] = useGlobals();
  const selectedLibrary = globals[GLOBAL] as string | undefined;
  const { results } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const result = results[storyId];
  const count = getContractAttentionCount(result, selectedLibrary);
  const selected = api.getSelectedPanel() === PANEL_ID;
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span>Design contracts</span>
      {count > 0 && <Badge compact status={selected ? 'active' : 'neutral'}>{count}</Badge>}
    </span>
  );
}

function DesignContractDocsTool() {
  const api = useStorybookApi();
  const { storyId = '', refId } = useStorybookState();
  const [globals] = useGlobals();
  const selectedLibrary = globals[GLOBAL] as string | undefined;
  const { results } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const entries = api.getIndex()?.entries;
  const docs = entries?.[storyId];
  if (refId || !entries || docs?.type !== 'docs') return null;
  const stories = Object.keys(results).flatMap((id) => {
    const story = entries[id];
    return story?.type === 'story' && docs.storiesImports.includes(story.importPath)
      ? [{ id, name: story.name, attention: getContractAttentionCount(results[id], selectedLibrary) }]
      : [];
  });
  if (!stories.length) return null;
  const open = (id: string) => {
    api.setSelectedPanel(PANEL_ID);
    api.togglePanel(true);
    api.selectStory(id);
  };
  if (stories.length === 1) {
    const { id, attention } = stories[0];
    return (
      <Button
        variant="ghost"
        size="small"
        ariaLabel={attention ? `View design contract results: ${attention} need attention` : 'View design contract results'}
        onClick={() => open(id)}
      >
        <BeakerIcon /> Design contracts {attention > 0 && <Badge compact>{attention}</Badge>}
      </Button>
    );
  }
  return (
    <Select
      ariaLabel="Design contract results"
      tooltip="View design contract results"
      icon={<BeakerIcon />}
      options={stories.map(({ id, name, attention }) => ({
        title: name,
        value: id,
        aside: attention > 0 ? <Badge compact>{attention}</Badge> : undefined,
      }))}
      onSelect={(id) => { if (typeof id === 'string') open(id); }}
    >
      Design contracts
    </Select>
  );
}

function CaseList({ cases, empty }: { cases: ContractCaseSummary[]; empty: string }) {
  const theme = useTheme();
  if (!cases.length) return <EmptyTabContent title={empty} />;
  const findings = cases.flatMap((item) => (item.entries ?? []).map((entry, index) => ({ item, entry, index })));
  const legacy = cases.filter((item) => item.entries === undefined && item.findings.length > 0);
  const coverage = cases.filter((item) => (item.entries?.length ?? 0) === 0 && item.findings.length === 0);
  const cellStyle = {
    borderBottom: `1px solid ${theme.appBorderColor}`,
    padding: '8px 10px',
    textAlign: 'left' as const,
    verticalAlign: 'top' as const,
    overflowWrap: 'anywhere' as const,
  };
  return (
    <div style={{ overflow: 'auto', height: '100%', padding: '0 12px 12px' }}>
      {findings.length > 0 && (
        <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 680, width: '100%' }}>
          <thead>
            <tr>
              {['Variant', 'State', 'Property', 'Expected', 'Actual'].map((heading) => (
                <th key={heading} scope="col" style={{ ...cellStyle, position: 'sticky', top: 0, background: theme.background.app }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {findings.map(({ item, entry, index }) => (
              <tr key={`${CASE_LABEL(item.fixture, item.options)}:${entry.message}:${index}`}>
                <td style={cellStyle}>
                  <strong>{CASE_LABEL(item.fixture, item.options)}</strong>
                </td>
                <td style={cellStyle}>{entry.condition ?? 'default'}</td>
                <td style={cellStyle}>{[entry.part, entry.property].filter(Boolean).join(' · ') || entry.name || '—'}</td>
                <td style={cellStyle}>{entry.expected ?? entry.source ?? '—'}</td>
                <td style={cellStyle}>
                  <div>{entry.drawn ?? '—'}</div>
                  <details>
                    <summary style={{ cursor: 'pointer', marginTop: 6 }}>Details and suggested fix</summary>
                    <p>{entry.message}</p>
                    {entry.action && <p><strong>Suggested fix:</strong> {entry.action}</p>}
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {coverage.length > 0 && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {coverage.map((item) => (
            <li key={CASE_LABEL(item.fixture, item.options)} style={{ borderBottom: `1px solid ${theme.appBorderColor}`, padding: 12 }}>
              <strong>{CASE_LABEL(item.fixture, item.options)}</strong>
              <p>{item.coverage}</p>
            </li>
          ))}
        </ul>
      )}
      {legacy.map((item) => (
        <details key={CASE_LABEL(item.fixture, item.options)} style={{ borderBottom: `1px solid ${theme.appBorderColor}` }}>
          <summary style={{ cursor: 'pointer', padding: 12 }}><strong>{CASE_LABEL(item.fixture, item.options)}</strong></summary>
          <pre style={{ ...PRE, padding: '0 12px 12px' }}>{item.findings.join('\n')}</pre>
        </details>
      ))}
    </div>
  );
}

// The Tokens addon optionally registers its pill renderer here. Keeping this
// lookup structural avoids making that addon a required dependency.
declare global {
  interface Window {
    __AZ_DIGITAL_DESIGN_TOKEN_REFERENCE__?: React.ComponentType<{ token: string }>;
  }
}

const RESULTS: Record<Entry['status'], { label: string; status: 'positive' | 'negative' | 'warning' | 'neutral' }> = {
  passed: { label: 'Passed', status: 'positive' },
  failed: { label: 'Failed', status: 'negative' },
  unsupported: { label: 'Not checked', status: 'warning' },
  unmapped: { label: 'Not checked', status: 'warning' },
  blocked: { label: 'Blocked', status: 'warning' },
  skipped: { label: 'Skipped', status: 'neutral' },
};

/** The contract rows for a story's one variant, each with its result; issues are annotated. */
function VariantResults({
  library,
  variant,
  onOpenContract,
}: {
  library: Extract<LibraryContractSummary, { kind: 'tested' }>;
  variant: string[];
  onOpenContract?: () => void;
}) {
  const theme = useTheme();
  const TokenReference = window.__AZ_DIGITAL_DESIGN_TOKEN_REFERENCE__;
  const cellStyle = {
    borderBottom: `1px solid ${theme.appBorderColor}`,
    padding: '8px 10px',
    textAlign: 'left' as const,
    verticalAlign: 'top' as const,
    overflowWrap: 'anywhere' as const,
  };
  return (
    <div style={{ flex: '1 1 0', minHeight: 0, overflow: 'auto', padding: '0 12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 4px 8px' }}>
        <span>The contract for <strong>{variant.join(', ') || 'defaults'}</strong>, with {library.title}'s results.</span>
        {onOpenContract && <Button variant="ghost" size="small" onClick={onOpenContract}>Open the full contract</Button>}
      </div>
      {library.cases.map((item) => {
        const issues = getContractIssueEntries(item).length;
        return (
          <section key={item.fixture} aria-label={library.cases.length > 1 ? item.fixture : undefined} style={{ marginBottom: 16 }}>
            {library.cases.length > 1 && <h3 style={{ fontSize: 13, margin: '8px 4px' }}>{item.fixture}</h3>}
            <p style={{ margin: '0 4px 8px' }}>
              {issues ? <Badge compact status="warning">{issues} need attention</Badge> : <Badge compact status="positive">Conforms</Badge>}{' '}
              {item.coverage}
            </p>
            {item.entries ? (
              <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 680, width: '100%' }}>
                <thead>
                  <tr>
                    {['Part', 'When', 'Property', 'Value', 'Result', 'Actual'].map((heading) => (
                      <th key={heading} scope="col" style={{ ...cellStyle, position: 'sticky', top: 0, background: theme.background.app }}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.entries.map((entry, index) => {
                    const result = RESULTS[entry.status];
                    const issue = entry.status !== 'passed' && entry.status !== 'skipped';
                    const background = entry.status === 'failed' ? theme.background.negative : issue ? theme.background.warning : undefined;
                    const newPart = index === 0 || item.entries?.[index - 1].part !== entry.part;
                    return (
                      <React.Fragment key={`${entry.part}:${entry.condition}:${entry.property}:${index}`}>
                        <tr style={{ background }}>
                          <th scope="row" style={cellStyle}>{newPart ? entry.part ?? entry.name ?? '—' : ''}</th>
                          <td style={cellStyle}>{entry.condition ?? 'default'}</td>
                          <td style={cellStyle}><code>{entry.property ?? '—'}</code></td>
                          <td style={cellStyle}>
                            {entry.source && TokenReference ? (
                              <TokenReference token={entry.source} />
                            ) : (
                              entry.source && <code>{entry.source}</code>
                            )}
                            {entry.expected && entry.expected !== entry.source && <div>{entry.expected}</div>}
                            {!entry.source && !entry.expected && '—'}
                          </td>
                          <td style={cellStyle}><Badge compact status={result.status}>{result.label}</Badge></td>
                          <td style={cellStyle}>{entry.drawn ?? '—'}</td>
                        </tr>
                        {issue && (
                          <tr style={{ background }}>
                            <td colSpan={6} style={{ ...cellStyle, paddingTop: 0 }}>
                              <div>{entry.message}</div>
                              {entry.action && <div style={{ marginTop: 4 }}><strong>Suggested fix:</strong> {entry.action}</div>}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <pre style={{ ...PRE, padding: '0 4px' }}>{item.findings.join('\n')}</pre>
            )}
          </section>
        );
      })}
    </div>
  );
}

function LibraryResults({ library }: { library: Extract<LibraryContractSummary, { kind: 'tested' }> }) {
  const theme = useTheme();
  const groups = groupContractCases(library.cases);
  const initialTab = groups.findings.length ? 'findings' : groups.incomplete.length ? 'incomplete' : 'conforming';
  const tab = (id: string, title: string, cases: ContractCaseSummary[], empty: string) => ({
    id,
    title: <span>{title} <Badge compact>{cases.length}</Badge></span>,
    children: <CaseList cases={cases} empty={empty} />,
  });
  return (
    <div style={{ flex: '1 1 0', minHeight: 0 }}>
      <TabsView
        key={initialTab}
        defaultSelected={initialTab}
        backgroundColor={theme.background.app}
        panelProps={{ hasScrollbar: true }}
        tabs={[
          tab('findings', 'Findings', groups.findings, 'No cases with failed checks.'),
          tab('conforming', 'Conforming', groups.conforming, 'No conforming cases.'),
          tab('incomplete', 'Incomplete', groups.incomplete, 'No incomplete cases.'),
        ]}
      />
    </div>
  );
}

function DesignContractPanel() {
  const api = useStorybookApi();
  const { storyId = '' } = useStorybookState();
  const [globals] = useGlobals();
  const selectedLibrary = globals[GLOBAL] as string | undefined;
  const { results, published } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const result = results[storyId];
  if (!storyId) return <div style={MESSAGE}><p>Select a component story to see its design contract results.</p></div>;
  if (!result) {
    if (published.kind === 'loading') return <div style={MESSAGE}><p aria-live="polite">Loading published design contract results...</p></div>;
    if (published.kind === 'error') {
      return <div style={MESSAGE}><p role="alert">Could not load published design contract results.</p><pre style={PRE}>{published.message}</pre></div>;
    }
    const message = published.kind === 'local'
      ? 'No design contract results for this story. Run component tests from Storybook\'s testing widget.'
      : published.kind === 'missing'
        ? 'No design contract results were published with this Storybook.'
        : 'No design contract results were published for this story.';
    return <div style={MESSAGE}><p>{message}</p></div>;
  }
  if ('error' in result) {
    return (
      <div style={MESSAGE}>
        <p role="alert">The design contract tests could not run.</p>
        <pre style={PRE}>{result.error}</pre>
      </div>
    );
  }
  const library = result.report.libraries.find((item) => item.key === selectedLibrary);
  if (!selectedLibrary) return <div style={MESSAGE}><p>Select a component library to see its design contract results.</p></div>;
  if (!library) return <div style={MESSAGE}><p>No design contract results for the selected library in this component story.</p></div>;
  const publishedLabel = published.kind === 'ready' && !completedStoryIds.has(storyId)
    ? <small>Published test results</small>
    : null;
  if (library.kind !== 'tested') {
    return <div style={MESSAGE}>{publishedLabel}<p aria-live="polite">{NOT_TESTED[library.kind]}</p></div>;
  }
  if (result.report.variant) {
    const entries = api.getIndex()?.entries;
    const title = entries?.[storyId]?.title;
    const docs = entries && Object.values(entries).find((entry) => entry.type === 'docs' && entry.title === title);
    return (
      <>
        {publishedLabel && <div style={{ padding: '12px 16px 0' }}>{publishedLabel}</div>}
        <VariantResults
          library={library}
          variant={result.report.variant}
          onOpenContract={docs ? () => api.selectStory(docs.id) : undefined}
        />
      </>
    );
  }
  return (
    <>
      {publishedLabel && <div style={{ padding: '12px 16px 0' }}>{publishedLabel}</div>}
      <LibraryResults key={`${storyId}:${selectedLibrary}`} library={library} />
    </>
  );
}

addons.register(ADDON_ID, (api) => {
  api.on(TEST_CHANNEL, (event: { type: string; payload?: TestRunResult }) => {
    if (event.type === 'test-run-completed' && event.payload) recordRun(event.payload);
  });
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: DesignContractPanelTitle,
    render: ({ active = true }) => active ? (
      <div role="region" aria-label="Design contract results" style={PANEL}>
        <DesignContractPanel />
      </div>
    ) : null,
  });
  addons.add(`${ADDON_ID}/docs-tool`, {
    type: types.TOOL,
    title: 'Design contract results',
    match: ({ viewMode }) => viewMode === 'docs',
    render: () => <DesignContractDocsTool />,
  });
  if (resultsState.published.kind === 'loading') void loadPublishedResults();
});
