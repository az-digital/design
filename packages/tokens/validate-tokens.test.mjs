import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateTokens } from './validate-tokens.mjs';

describe('validateTokens', () => {
  it('accepts valid DTCG color tokens and aliases', () => {
    assert.doesNotThrow(() => validateTokens({
      color: {
        $type: 'color',
        red: { $value: '#AB0520' },
        alias: { $value: '{color.red}' },
      },
    }));
  });

  it('rejects invalid values with their token paths', () => {
    assert.throws(() => validateTokens({
      spacing: {
        $type: 'dimension',
        invalid: { $value: 'large' },
      },
    }), /spacing\.invalid: invalid \$value for type "dimension"/);
  });

  it('rejects tokens without an inherited or local type', () => {
    assert.throws(() => validateTokens({ token: { $value: 'value' } }), /token: missing \$type/);
  });
});
