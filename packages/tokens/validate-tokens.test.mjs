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

  it('accepts valid typography composite tokens', () => {
    assert.doesNotThrow(() => validateTokens({
      text: {
        $type: 'typography',
        body: {
          $value: {
            fontFamily: 'Arial',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.5,
          },
        },
      },
    }));
  });

  it('rejects invalid typography composite tokens', () => {
    assert.throws(() => validateTokens({
      text: {
        $type: 'typography',
        body: { $value: { fontSize: 'large' } },
      },
    }), /text\.body: invalid \$value for type "typography"/);
  });

  it('accepts valid transition composite tokens', () => {
    assert.doesNotThrow(() => validateTokens({
      animation: {
        $type: 'transition',
        fade: {
          $value: {
            duration: '200ms',
            delay: '0ms',
            timingFunction: 'ease-in',
          },
        },
      },
    }));
  });

  it('rejects invalid transition composite tokens', () => {
    assert.throws(() => validateTokens({
      animation: {
        $type: 'transition',
        fade: {
          $value: {
            duration: 'fast',
            timingFunction: 'ease-in',
          },
        },
      },
    }), /animation\.fade: invalid \$value for type "transition"/);
  });
});
