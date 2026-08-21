import type { CSSProperties } from 'react';
import { hexToRgb } from './colorMath';

export type NamedColor = {
  name: string;
  hex: string;
  cssVar: string;
  cmyk?: { c: number; m: number; y: number; k: number };
  pantone?: string;
};

const CARD_STYLE: CSSProperties = {
  display: 'grid',
  gap: 14,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const LABEL_STYLE: CSSProperties = {
  margin: '0 0 20px',
  textAlign: 'center',
  color: 'var(--az-color-brand-blue)',
  fontWeight: 700,
  fontSize: 15,
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

function ArchSwatch({ cssVar, pinColor }: { cssVar: string; pinColor: string }) {
  return (
    <div
      style={{
        position: 'relative',
        height: 180,
        background: cssVar,
        borderRadius: '999px 999px 0 0',
        border: '1px solid #d7dce3',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -20,
          left: '50%',
          width: 4,
          height: 100,
          background: pinColor,
          transform: 'translateX(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: pinColor,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}

function ValuePairRow({
  left,
  right,
}: {
  left: [string, string];
  right?: [string, string];
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: right ? '28px 1fr 28px 1fr' : '28px 1fr',
        gap: 6,
        alignItems: 'baseline',
      }}
    >
      <span style={KEY_STYLE}>{left[0]}:</span>
      <span style={VALUE_STYLE}>{left[1]}</span>
      {right && (
        <>
          <span style={KEY_STYLE}>{right[0]}:</span>
          <span style={VALUE_STYLE}>{right[1]}</span>
        </>
      )}
    </div>
  );
}

function ColorSwatchCard({ name, hex, cssVar, cmyk, pantone }: NamedColor) {
  const rgb = hexToRgb(hex);
  const pinColor = ['blue', 'tinta'].includes(name.toLowerCase())
    ? 'var(--az-color-brand-red)'
    : 'var(--az-color-brand-blue)';
  const rgbPairs: Array<[string, string]> = [
    ['R', String(rgb.r)],
    ['G', String(rgb.g)],
    ['B', String(rgb.b)],
  ];
  const cmykPairs: Array<[string, string]> | undefined = cmyk && [
    ['C', String(cmyk.c)],
    ['M', String(cmyk.m)],
    ['Y', String(cmyk.y)],
    ['K', String(cmyk.k)],
  ];

  return (
    <div style={CARD_STYLE}>
      <p style={LABEL_STYLE}>{name}</p>
      <ArchSwatch cssVar={cssVar} pinColor={pinColor} />
      <div style={{ display: 'grid', gap: 5 }}>
        {cmykPairs
          ? cmykPairs.map((pair, index) => (
              <ValuePairRow key={pair[0]} left={pair} right={rgbPairs[index]} />
            ))
          : rgbPairs.map((pair) => <ValuePairRow key={pair[0]} left={pair} />)}
        <ValuePairRow left={['HEX', hex.toUpperCase()]} />
        {pantone && <ValuePairRow left={['PMS', pantone]} />}
      </div>
    </div>
  );
}

export function ColorSwatchGrid({ colors }: { colors: NamedColor[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 24,
        margin: '16px 0',
      }}
    >
      {colors.map((color) => (
        <ColorSwatchCard
          key={color.name}
          name={color.name}
          hex={color.hex}
          cssVar={color.cssVar}
          cmyk={color.cmyk}
          pantone={color.pantone}
        />
      ))}
    </div>
  );
}
