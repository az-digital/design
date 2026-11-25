import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const tokensDirectory = fileURLToPath(new URL('../../tokens/', import.meta.url));
const read = (path: string) => readFileSync(`${tokensDirectory}${path}`, 'utf8');

describe('background pattern tokens', () => {
  it('keeps the design decisions aliased to their base values and sources', () => {
    const { az } = JSON.parse(read('tokens.json'));
    const decisions = [
      [az.size.pattern['monsoon-rain-tile'], az.size.base['pattern-tile'], '{size.base.pattern-tile}', '300px', '#2111'],
      [az.size.pattern['monsoon-rain-band-min'], az.size.base['pattern-band-min'], '{size.base.pattern-band-min}', '75px', '#2308'],
      [az.size.pattern['monsoon-rain-band-max'], az.size.base['pattern-band-max'], '{size.base.pattern-band-max}', '200px', '#2308'],
      [az.proportion.pattern['monsoon-rain-band'], az.proportion.base['pattern-band'], '{proportion.base.pattern-band}', 0.2, '#2308'],
      [az.opacity['pattern-monsoon-rain'], az.opacity.base.pattern, '{opacity.base.pattern}', 0.4, '#2111'],
      [az.opacity['pattern-text-backdrop'], az.opacity.base['text-backdrop'], '{opacity.base.text-backdrop}', 0.7, '#2111'],
    ];

    for (const [decision, base, reference, value, source] of decisions) {
      expect(decision.$value).toBe(reference);
      expect(base.$value).toBe(value);
      expect(decision.$description).toContain(source);
    }
  });

  it('preserves aliases in generated CSS and publishes the original SVG', () => {
    const css = read('dist/tokens.css');
    expect(css).toContain('--az-size-pattern-monsoon-rain-tile: var(--az-size-base-pattern-tile)');
    expect(css).toContain('--az-proportion-pattern-monsoon-rain-band: var(--az-proportion-base-pattern-band)');
    expect(css).toContain('--az-opacity-pattern-text-backdrop: var(--az-opacity-base-text-backdrop)');

    const manifest = JSON.parse(read('package.json'));
    expect(manifest.files).toContain('assets');
    expect(manifest.exports['./assets/*']).toBe('./assets/*');
    expect(read('assets/patterns/monsoon-sky.svg')).toContain('viewBox="0 0 300 300"');
  });
});
