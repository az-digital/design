import { describe, expect, it } from 'vitest';
import { buildTokenCatalog } from './tokenCatalog';

describe('buildTokenCatalog', () => {
  it('flattens nested tokens and keeps stable ordering', () => {
    const input = {
      color: {
        brand: {
          primary: {
            $value: '#123456',
            $type: 'color',
          },
        },
      },
      radius: {
        sm: {
          value: '4px',
          type: 'borderRadius',
        },
      },
    };

    const result = buildTokenCatalog(input);
    expect(result.map((group) => group.name)).toEqual(['color.brand', 'radius']);
    expect(result[0].tokens[0].path).toBe('color.brand.primary');
    expect(result[1].tokens[0].path).toBe('radius.sm');
  });

  it('captures DTCG metadata and alias references', () => {
    const input = {
      color: {
        action: {
          base: {
            $value: '#0C234B',
            $type: 'color',
            $description: 'Primary action color.',
            $extensions: {
              source: 'figma',
            },
          },
          hover: {
            $value: '{color.action.base}',
            $type: 'color',
          },
        },
      },
    };

    const result = buildTokenCatalog(input);
    const tokens = result[0].tokens;
    expect(tokens[0].description).toBe('Primary action color.');
    expect(tokens[0].extensions).toEqual({ source: 'figma' });
    expect(tokens[1].aliasOf).toBe('color.action.base');
  });

  it('groups nested color tokens under their parent family', () => {
    const input = {
      color: {
        az: {
          blue: { $value: '#0C234B', $type: 'color' },
          red: { $value: '#AB0520', $type: 'color' },
        },
        white: { $value: '#FFFFFF', $type: 'color' },
      },
    };

    const result = buildTokenCatalog(input);
    expect(result.map((group) => group.name)).toEqual(['color', 'color.az']);
    expect(result[0].tokens.map((token) => token.path)).toEqual(['color.white']);
    expect(result[1].tokens.map((token) => token.path)).toEqual(['color.az.blue', 'color.az.red']);
  });
});
