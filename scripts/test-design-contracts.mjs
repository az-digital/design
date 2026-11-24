import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPublishedContractResults } from '../packages/storybook-addon-libraries/src/design-contracts/report.ts';

const args = process.argv.slice(2);
const reportPrefix = '--storybook-report=';
const reportOptions = args.filter((arg) => arg.startsWith(reportPrefix));
const unknown = args.filter((arg) => arg !== '--verbose' && arg !== '--json' && !arg.startsWith(reportPrefix));
if (unknown.length || reportOptions.length > 1 || reportOptions.some((arg) => arg === reportPrefix)) {
  if (unknown.length) console.error(`Unknown option: ${unknown.join(', ')}.`);
  console.error('Use --verbose, --json or --storybook-report=<file>; provide the report file only once.');
  process.exitCode = 2;
} else {
  const storybook = fileURLToPath(new URL('../packages/storybook/', import.meta.url));
  const vitest = fileURLToPath(new URL('../node_modules/vitest/vitest.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [vitest, 'run', '--project', 'storybook'], {
    cwd: storybook,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, AZ_DESIGN_CONTRACT_TESTS: 'all' },
  });
  const output = result.stdout ?? '';
  if (result.stderr) process.stderr.write(result.stderr);
  const blocks = /\nAZ_CONTRACT_REPORT_BEGIN\n([\s\S]*?)\nAZ_CONTRACT_REPORT_END\n/g;
  const rest = output.replace(blocks, '');
  if (result.error) {
    process.stdout.write(rest);
    console.error(result.error);
    process.exitCode = 2;
  } else if (result.signal) {
    process.stdout.write(rest);
    console.error(`Design contract tests were interrupted by ${result.signal}.`);
    process.exitCode = 2;
  } else if (result.status !== 0) {
    process.stdout.write(rest);
    process.exitCode = result.status ?? 2;
  } else {
    try {
      // One block per component story that has design contract tests.
      const runs = [...output.matchAll(blocks)].map(([, json]) => JSON.parse(json));
      const valid = (run) => run && typeof run.storyId === 'string' && run.storyId.trim()
        && typeof run.summary === 'string' && typeof run.details === 'string'
        && run.report && typeof run.report.component === 'string' && typeof run.report.needsAttention === 'boolean'
        && Array.isArray(run.report.libraries) && Array.isArray(run.cases);
      if (!runs.every(valid)) throw new Error('A component story produced an invalid design contract report.');
      const cases = runs.flatMap((run) => run.cases);
      if (!cases.length) throw new Error('No component story ran a design contract test.');
      if (reportOptions.length) {
        const stories = Object.fromEntries(runs.map((run) => [run.storyId, run.report]));
        if (Object.keys(stories).length !== runs.length) throw new Error('A component story reported more than once.');
        const published = { version: 1, stories };
        readPublishedContractResults(published);
        writeFileSync(reportOptions[0].slice(reportPrefix.length), `${JSON.stringify(published)}\n`);
      }
      const heading = '\nDesign contract drift and missing coverage are reported without blocking CI.';
      const report = {
        summary: [heading, ...runs.map((run) => run.summary)].join('\n'),
        details: [heading, ...runs.map((run) => run.details)].join('\n'),
        needsAttention: runs.some((run) => run.report.needsAttention),
        inventory: runs.flatMap((run) => run.report.libraries
          .filter((library) => library.kind !== 'tested')
          .map((library) => ({ kind: library.kind, library: library.key, component: run.report.component }))),
        cases,
      };
      if (args.includes('--json')) {
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      } else {
        process.stdout.write(`${rest}${args.includes('--verbose') ? report.details : report.summary}\n`);
      }
    } catch (error) {
      process.stdout.write(rest);
      console.error(`Could not produce the design contract reports: ${error.message}`);
      process.exitCode = 2;
    }
  }
}
