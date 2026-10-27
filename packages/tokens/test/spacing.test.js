import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const { az } = JSON.parse(readFileSync(new URL('../tokens.json', import.meta.url), 'utf8'));
const expectedSpacing = {
  0: '0px',
  min: '1px',
  1: '4px',
  2: '8px',
  3: '16px',
  card: '20px',
  4: '24px',
  5: '48px',
  6: '64px',
  7: '80px',
  8: '96px',
  9: '112px',
  10: '128px',
  20: '256px',
  30: '384px',
};

test('spacing scale keeps its documented steps and values', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(az.spacing).map(([step, token]) => [step, token.$value])),
    expectedSpacing,
  );
});

test('every spacing step has a usage description', () => {
  for (const [step, token] of Object.entries(az.spacing)) {
    assert.ok(token.$description?.trim(), `az.spacing.${step} needs a usage description`);
  }
});
