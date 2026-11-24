import type { ContractRow } from '@az-digital/design-contract-testing';
import type { DesignContractFixture } from '../types';
import { planComponentTests, variantCases } from './plan';
import {
  needsAttention,
  type ComponentContractRun,
  type ContractCase,
  type LibraryContractSummary,
} from './report';
import type {
  ComponentContractTestInput,
  DesignContractData,
  DesignContractEngine,
} from './types';

const NOT_TESTED: Record<Exclude<LibraryContractSummary['kind'], 'tested'>, string> = {
  untested: 'untested (no design contract test configured on its adapter)',
  'no-contract': 'untested (no design contract)',
  external: 'renders in its own Storybook; not tested here',
};

const label = (options: string[]) => options.join(', ') || 'defaults';

function describe(component: string, summaries: LibraryContractSummary[], engine: DesignContractEngine, verbose: boolean) {
  const lines = [`\n${component}:`];
  for (const library of summaries) {
    if (library.kind !== 'tested') {
      lines.push(`  ${library.title}: ${NOT_TESTED[library.kind]}`);
      continue;
    }
    const conforming = library.cases.filter((item) => item.ok).length;
    lines.push(`  ${library.title}: ${library.cases.length} cases, ${conforming} conform, ${library.cases.length - conforming} need attention`);
    const findings = library.cases.flatMap((item) => item.findings.map((line) => `    ${item.fixture} (${label(item.options)}): ${line}`));
    const limit = verbose ? findings.length : 6;
    lines.push(...findings.slice(0, limit));
    if (findings.length > limit) lines.push(`    ${findings.length - limit} more finding lines; see the component's docs page or run npm run test:design-contracts -- --verbose.`);
  }
  return lines.join('\n');
}

function validateFixture(component: string, fixture: DesignContractFixture<unknown>, rows: ContractRow[]) {
  if (!fixture.name.trim()) throw new Error(`${component}: each fixture needs a name.`);
  const componentRows = rows.filter((row) => row.contract === component);
  const parts = new Set(componentRows.map((row) => row.part));
  for (const part of fixture.optionalParts ?? []) {
    if (!parts.has(part)) throw new Error(`${component} / ${fixture.name}: unknown optional part "${part}".`);
  }
  for (const rule of fixture.skip ?? []) {
    if (!rule.reason.trim()) throw new Error(`${component} / ${fixture.name}: each skip needs a reason.`);
    if (!componentRows.some((row) =>
      (!rule.part || rule.part === row.part)
      && (!rule.condition || rule.condition === row.condition)
      && (!rule.property || rule.property === row.property))) {
      throw new Error(`${component} / ${fixture.name}: skip does not match a contract row.`);
    }
  }
}

async function waitForStylesheets(links: HTMLLinkElement[]) {
  await Promise.all(links.map((link) => {
    if (link.sheet) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        clearTimeout(timeout);
        link.removeEventListener('load', onLoad);
        link.removeEventListener('error', onError);
        if (error) reject(error);
        else resolve();
      };
      const onLoad = () => finish();
      const onError = () => finish(new Error(`Could not load library stylesheet ${link.href}.`));
      const timeout = setTimeout(() => finish(new Error(`Timed out loading library stylesheet ${link.href}.`)), 10000);
      link.addEventListener('load', onLoad);
      link.addEventListener('error', onError);
    });
  }));
}

/**
 * Create the runner that associates an implementation's adapter fixtures with
 * contract data and a browser-checking engine supplied by the Storybook project.
 */
export function createDesignContractTestRunner(data: DesignContractData, engine: DesignContractEngine) {
  return async function runComponentContractTests({
    component,
    tags,
    container,
    library: selected,
  }: ComponentContractTestInput): Promise<ComponentContractRun | undefined> {
    const [{ libraries, taggedLibraries }, { renderComponent }, { loadLibraryStylesheets }] = await Promise.all([
      import('../registry'),
      import('../componentStories'),
      import('../preview'),
    ]);
    const plan = planComponentTests(libraries, data.contracts, component, taggedLibraries(tags));
    if (!plan.length) return undefined;
    const summaries: LibraryContractSummary[] = [];
    const cases: ContractCase[] = [];
    try {
      await document.fonts.ready;
      for (const item of plan) {
        const { library } = item;
        if (item.kind !== 'test') {
          summaries.push({ key: library.key, title: library.title, kind: item.kind });
          continue;
        }
        const { adapter, contract } = item;
        const config = adapter.designContractTest;
        if (!config?.fixtures?.length) throw new Error(`${library.key} / ${component}: no contract fixtures configured.`);
        await waitForStylesheets(loadLibraryStylesheets(library.key));
        const names = new Set<string>();
        const tested: Extract<LibraryContractSummary, { kind: 'tested' }> = { key: library.key, title: library.title, kind: 'tested', cases: [] };
        for (const fixture of config.fixtures) {
          validateFixture(component, fixture, data.rows);
          if (names.has(fixture.name)) throw new Error(`${library.key} / ${component}: duplicate fixture "${fixture.name}".`);
          names.add(fixture.name);
          for (const variants of variantCases(contract.variants)) {
            const options = Object.entries(variants).map(([axis, option]) => `${axis}.${option}`);
            const frame = document.createElement('div');
            container.append(frame);
            let cleanup: (() => void) | undefined;
            try {
              await config.prepare?.(frame);
              cleanup = renderComponent(adapter, fixture.props(variants), frame);
              await Promise.all([...frame.querySelectorAll('img')].map((image) => image.decode()));
              const target = await config.target(frame);
              const result = await engine.compare(target, component, options, {
                optionalParts: fixture.optionalParts,
                skip: fixture.skip,
                implementation: { name: library.title, ...config.implementation },
              });
              const dataErrors = result.entries.filter((entry) => entry.code === 'AZC008');
              if (dataErrors.length) throw new Error(engine.formatResult({ ...result, entries: dataErrors }).join('\n'));
              tested.cases.push({
                fixture: fixture.name,
                options,
                ok: result.ok,
                counts: result.counts,
                coverage: engine.describeCoverage(result),
                findings: result.ok ? [] : engine.formatResult(result),
              });
              cases.push({ library: library.key, component, fixture: fixture.name, options, result });
            } catch (error) {
              throw new Error(`Could not test ${library.title} / ${component} / ${fixture.name} (${label(options)}).`, { cause: error });
            } finally {
              try {
                cleanup?.();
              } finally {
                frame.remove();
              }
            }
          }
        }
        summaries.push(tested);
      }
    } finally {
      await waitForStylesheets(loadLibraryStylesheets(selected));
    }
    return {
      report: { component, needsAttention: needsAttention(summaries), libraries: summaries },
      summary: describe(component, summaries, engine, false),
      details: describe(component, summaries, engine, true),
      cases,
    };
  };
}
