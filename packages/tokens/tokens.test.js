import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const tokens = JSON.parse(await readFile(new URL('./tokens.json', import.meta.url), 'utf8'));
const expectedBreakpoints = new Map([
  ['sm', '576px'],
  ['md', '768px'],
  ['lg', '992px'],
  ['xl', '1200px'],
  ['xxl', '1400px'],
]);

test('breakpoint tokens match implementation widths and cite their source', () => {
  const breakpoints = tokens.az.breakpoint;

  assert.deepEqual(Object.keys(breakpoints), [...expectedBreakpoints.keys()]);
  assert.equal(Object.hasOwn(breakpoints, 'xs'), false);

  for (const [name, value] of expectedBreakpoints) {
    assert.equal(breakpoints[name].$type, 'dimension');
    assert.equal(breakpoints[name].$value, value);
    assert.match(breakpoints[name].$description, /Arizona Bootstrap 5\.2\.2/);
  }
});
