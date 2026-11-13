import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectTokens, getAliasPath } from './collect.js';

describe('getAliasPath', () => {
  it('uses Style Dictionary parsed reference paths for whole-value aliases', () => {
    assert.equal(
      getAliasPath('{az.color.semantic.text}', [{ ref: ['az', 'color', 'semantic', 'text'] }]),
      'az.color.semantic.text',
    );
  });

  it('does not treat references inside composite values as aliases', () => {
    assert.equal(
      getAliasPath('1px solid {az.color.brand.red}', [{ ref: ['az', 'color', 'brand', 'red'] }]),
      undefined,
    );
  });

  it('does not infer aliases when multiple references are found', () => {
    assert.equal(
      getAliasPath('{az.color.brand.red} {az.color.brand.blue}', [
        { ref: ['az', 'color', 'brand', 'red'] },
        { ref: ['az', 'color', 'brand', 'blue'] },
      ]),
      undefined,
    );
  });

  it('collects actual source provenance and output references for aliases', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'design-token-collect-'));
    try {
      await writeFile(join(directory, 'tokens.json'), JSON.stringify({
        az: {
          color: {
            brand: {
              $type: 'color',
              red: { $value: '#AB0520' },
            },
            semantic: {
              $type: 'color',
              danger: { $value: '{az.color.brand.red}' },
            },
          },
        },
      }));
      await writeFile(join(directory, 'config.mjs'), `export default {
        source: ['./tokens.json'],
        platforms: {
          css: {
            transformGroup: 'css',
            buildPath: 'dist/',
            files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
          },
        },
      };`);

      const { data } = await collectTokens(join(directory, 'config.mjs'), { repositoryUrl: 'https://example.test/repo/blob/main/' });
      const alias = data.tokens.find((token) => token.path === 'az.color.semantic.danger');
      assert.equal(alias.aliasOf, 'az.color.brand.red');
      assert.deepEqual(alias.source, {
        path: 'tokens.json',
        url: 'https://example.test/repo/blob/main/tokens.json',
      });
      assert.equal(data.artifacts[0].tokens['az.color.semantic.danger'].value, 'var(--az-color-brand-red)');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
