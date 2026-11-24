import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { loadContracts } from '../src/node.js';

let fixture;
afterEach(() => {
  if (fixture) rmSync(fixture, { recursive: true, force: true });
});

it('loads the installed data and rejects a different token source', () => {
  fixture = mkdtempSync(join(tmpdir(), 'az-design-contract-testing-'));
  const contracts = join(fixture, 'node_modules/@az-digital/contracts');
  const tokens = join(fixture, 'node_modules/@az-digital/tokens');
  mkdirSync(join(contracts, 'dist'), { recursive: true });
  mkdirSync(join(tokens, 'dist'), { recursive: true });
  const tokenSource = '{"az":{}}';
  writeFileSync(join(contracts, 'package.json'), JSON.stringify({ name: '@az-digital/contracts', version: '1.0.0' }));
  writeFileSync(join(tokens, 'package.json'), JSON.stringify({ name: '@az-digital/tokens', version: '1.0.0' }));
  writeFileSync(join(tokens, 'tokens.json'), tokenSource);
  writeFileSync(join(tokens, 'dist/tokens.css'), ':root { --az-demo-fill: red; }');
  writeFileSync(join(contracts, 'dist/contracts.json'), '[]');
  writeFileSync(join(contracts, 'dist/manifest.json'), JSON.stringify({
    tokensHash: createHash('sha256').update(tokenSource).digest('hex'),
    contracts: { demo: { variantDefaults: { color: 'red' }, variants: { color: ['red'] } } },
  }));

  expect(loadContracts({ from: fixture })).toMatchObject({
    data: { rows: [], defaults: { demo: { color: 'red' } }, variants: { demo: { color: ['red'] } } },
    tokens: ':root { --az-demo-fill: red; }',
    versions: { contracts: '1.0.0', tokens: '1.0.0' },
  });
  writeFileSync(join(tokens, 'tokens.json'), '{"changed":true}');
  expect(() => loadContracts({ from: fixture })).toThrow(/isn't the release.*Pin the two/);
});
