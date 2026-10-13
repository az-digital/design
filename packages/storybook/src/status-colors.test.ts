import { describe, expect, it } from 'vitest';
import tokens from '../../tokens/tokens.json';

const hues = {
  success: 'green',
  info: 'blue',
  warning: 'amber',
  danger: 'red',
};
const { status, semantic } = tokens.az.color;

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe('status color tokens', () => {
  it('defines documented 100, 500, and 900 steps for each hue', () => {
    for (const color of Object.values(status)) {
      expect(Object.keys(color)).toEqual(['100', '500', '900']);
      for (const token of Object.values(color)) {
        expect(token.$description).toBeTruthy();
      }
    }
  });

  it('aliases each semantic status to its intended palette steps', () => {
    for (const [role, hue] of Object.entries(hues)) {
      expect(semantic.role[role].$value).toBe(`{az.color.status.${hue}.500}`);
      expect(semantic.text[role].$value).toBe(`{az.color.semantic.role.${role}}`);
      expect(semantic['text-emphasis'][role].$value).toBe(`{az.color.status.${hue}.900}`);
      expect(semantic['bg-subtle'][role].$value).toBe(`{az.color.status.${hue}.100}`);
      expect(semantic['border-subtle'][role].$value).toBe(`{az.color.status.${hue}.500}`);
    }
  });

  it('keeps warning and danger distinct and meets the documented contrast pairings', () => {
    expect(status.amber['500'].$value).not.toBe(status.red['500'].$value);

    for (const hue of Object.values(hues)) {
      const light = status[hue]['100'].$value;
      const mid = status[hue]['500'].$value;
      const dark = status[hue]['900'].$value;
      expect(contrastRatio(mid, '#FFFFFF')).toBeGreaterThanOrEqual(5);
      expect(contrastRatio('#FFFFFF', mid)).toBeGreaterThanOrEqual(5);
      expect(contrastRatio(dark, light)).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(mid, light)).toBeGreaterThanOrEqual(4.5);
    }
  });
});
