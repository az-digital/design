import type { CSSProperties } from 'react';
import { hexToRgb, isDark } from './colorMath';
import { getTokenDisplayItems, type TokenData } from './resolveToken';
import { useTokensData } from './store';
import { Token } from './Token';

type Cmyk = { c: number; m: number; y: number; k: number };

const INK = '#0c234b';
const CARD_STYLE: CSSProperties = { display: 'grid', gap: 14, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };
const COLOR_NAME_STYLE: CSSProperties = { margin: '0 0 20px', color: INK, fontWeight: 700, fontSize: 15, textAlign: 'center' };
const KEY_STYLE: CSSProperties = { color: INK, fontWeight: 700, fontSize: 11, letterSpacing: '0.02em' };
const VALUE_STYLE: CSSProperties = { color: '#3d4f66', fontWeight: 500, fontSize: 11 };

/** `arroyo-blue` → `Arroyo Blue`. */
const displayName = (key: string) => key.replace(/(^|[-_])(\w)/g, (_match, sep: string, letter: string) => `${sep ? ' ' : ''}${letter.toUpperCase()}`);

function ArchSwatch({ color }: { color: string }) {
  // A pin that stays visible on the swatch: light on dark colors, dark on light ones.
  const pinColor = isDark(color) ? '#f4f6f8' : INK;
  return (
    <div style={{ position: 'relative', height: 180, width: 'min(100%, 160px)', margin: '0 auto', background: color, borderRadius: '999px 999px 0 0', border: '1px solid #d7dce3' }}>
      <div style={{ position: 'absolute', top: -20, left: '50%', width: 4, height: 100, background: pinColor, transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: 80, left: '50%', width: 12, height: 12, borderRadius: '50%', background: pinColor, transform: 'translate(-50%, -50%)' }} />
    </div>
  );
}

function ValuePairRow({ left, right }: { left: [string, string]; right?: [string, string] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: right ? '28px 1fr 28px 1fr' : '28px 1fr', gap: 6, alignItems: 'baseline' }}>
      <span style={KEY_STYLE}>{left[0]}:</span>
      <span style={VALUE_STYLE}>{left[1]}</span>
      {right && <><span style={KEY_STYLE}>{right[0]}:</span><span style={VALUE_STYLE}>{right[1]}</span></>}
    </div>
  );
}

function ColorSwatchCard({ color }: { color: TokenData & { hex: string } }) {
  const rgb = hexToRgb(color.hex);
  const cmyk = color.extensions?.cmyk as Cmyk | undefined;
  const pantone = color.extensions?.pantone as string | undefined;
  const rgbPairs: Array<[string, string]> = [['R', String(rgb.r)], ['G', String(rgb.g)], ['B', String(rgb.b)]];
  const cmykPairs: Array<[string, string]> | undefined = cmyk && [['C', String(cmyk.c)], ['M', String(cmyk.m)], ['Y', String(cmyk.y)], ['K', String(cmyk.k)]];

  return (
    <div style={CARD_STYLE}>
      <Token data={color} style={{ margin: '0 0 8px' }} />
      <p style={COLOR_NAME_STYLE}>{displayName(color.name ?? color.token)}</p>
      <ArchSwatch color={color.hex} />
      <div style={{ display: 'grid', gap: 5 }}>
        {cmykPairs ? cmykPairs.map((pair, index) => <ValuePairRow key={pair[0]} left={pair} right={rgbPairs[index]} />) : rgbPairs.map((pair) => <ValuePairRow key={pair[0]} left={pair} />)}
        <ValuePairRow left={['HEX', color.hex]} />
        {pantone && <ValuePairRow left={['PMS', pantone]} />}
      </div>
    </div>
  );
}

/**
 * Swatch cards for every color token under `prefix` (e.g. `az.color.brand.`),
 * painted with each token's resolved value. CMYK and Pantone come from the
 * token's `$extensions.cmyk` / `$extensions.pantone` when present.
 */
export function ColorSwatchGrid({ prefix }: { prefix: string }) {
  useTokensData();
  const colors = getTokenDisplayItems(prefix).filter((item): item is TokenData & { hex: string } => item.hex !== undefined);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 24, margin: '16px 0' }}>
      {colors.map((color) => <ColorSwatchCard key={color.token} color={color} />)}
    </div>
  );
}
