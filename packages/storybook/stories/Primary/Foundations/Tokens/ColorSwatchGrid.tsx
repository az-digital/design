import type { CSSProperties } from 'react';
import { Token, getTokenDisplayItems, useTokensData, type TokenData } from '@az-digital/storybook-addon-tokens';
import { hexToRgb } from './colorMath';

/**
 * Arizona's brand swatch cards: the arch, the pin, and the color's values.
 * This is the site's own presentation, so it lives here rather than in
 * @az-digital/storybook-addon-tokens; each card embeds the addon's `Token`
 * pill, which opens that token's details.
 */

type Cmyk = { c: number; m: number; y: number; k: number };
type Color = TokenData & { hex: string };

const CARD_STYLE: CSSProperties = {
  display: 'grid',
  gap: 14,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const COLOR_NAME_STYLE: CSSProperties = {
  margin: '0 0 20px',
  color: 'var(--az-color-brand-blue)',
  fontWeight: 700,
  fontSize: 15,
  textAlign: 'center',
};

const KEY_STYLE: CSSProperties = {
  color: 'var(--az-color-brand-blue)',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.02em',
};

const VALUE_STYLE: CSSProperties = {
  color: '#3d4f66',
  fontWeight: 500,
  fontSize: 11,
};

/** `arroyo-blue` → `Arroyo Blue`. */
const displayName = (key: string) => key.replace(/(^|[-_])(\w)/g, (_match, sep: string, letter: string) => `${sep ? ' ' : ''}${letter.toUpperCase()}`);

function ArchSwatch({ color, pinColor }: { color: string; pinColor: string }) {
  return (
    <div
      style={{
        position: 'relative',
        height: 180,
        width: 'min(100%, 160px)',
        margin: '0 auto',
        background: color,
        borderRadius: '999px 999px 0 0',
        border: '1px solid #d7dce3',
      }}
    >
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

function ColorSwatchCard({ color }: { color: Color }) {
  const name = displayName(color.name ?? color.token);
  const rgb = hexToRgb(color.hex);
  const cmyk = color.extensions?.cmyk as Cmyk | undefined;
  const pantone = color.extensions?.pantone as string | undefined;
  // Arizona's convention: a red pin on the darkest blues, a blue pin on everything else.
  const pinColor = ['blue', 'tinta'].includes((color.name ?? '').toLowerCase()) ? 'var(--az-color-brand-red)' : 'var(--az-color-brand-blue)';
  const rgbPairs: Array<[string, string]> = [['R', String(rgb.r)], ['G', String(rgb.g)], ['B', String(rgb.b)]];
  const cmykPairs: Array<[string, string]> | undefined = cmyk && [['C', String(cmyk.c)], ['M', String(cmyk.m)], ['Y', String(cmyk.y)], ['K', String(cmyk.k)]];

  return (
    <div style={CARD_STYLE}>
      <Token data={color} style={{ margin: '0 0 8px' }} />
      <p style={COLOR_NAME_STYLE}>{name}</p>
      <ArchSwatch color={color.hex} pinColor={pinColor} />
      <div style={{ display: 'grid', gap: 5 }}>
        {cmykPairs ? cmykPairs.map((pair, index) => <ValuePairRow key={pair[0]} left={pair} right={rgbPairs[index]} />) : rgbPairs.map((pair) => <ValuePairRow key={pair[0]} left={pair} />)}
        {/* Printed exactly as tokens.json writes it. */}
        <ValuePairRow left={['HEX', color.hex]} />
        {pantone && <ValuePairRow left={['PMS', pantone]} />}
      </div>
    </div>
  );
}

/**
 * Swatch cards for every color token under `prefix` (e.g. `az.color.brand.`),
 * each painted with the token's resolved value. CMYK and Pantone come from the
 * token's `$extensions.cmyk` / `$extensions.pantone` when present.
 */
export function ColorSwatchGrid({ prefix }: { prefix: string }) {
  useTokensData();
  // In the order tokens.json lists them: a brand palette's order is deliberate.
  const colors = getTokenDisplayItems(prefix, { order: 'source' }).filter((item): item is Color => item.hex !== undefined);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 24, margin: '16px 0' }}>
      {colors.map((color) => <ColorSwatchCard key={color.token} color={color} />)}
    </div>
  );
}
