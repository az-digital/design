import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const { az } = JSON.parse(readFileSync(new URL('../tokens.json', import.meta.url), 'utf8'));

test('every spacing step has a description', () => {
  for (const [step, token] of Object.entries(az.spacing)) {
    assert.ok(token.$description?.trim(), `az.spacing.${step} needs a description`);
  }
});
