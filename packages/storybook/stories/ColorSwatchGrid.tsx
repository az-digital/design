import { useState, type CSSProperties } from 'react';
import { hexToRgb } from './colorMath';

export type NamedColor = {
  name: string;
  token: string;
  hex: string;
  cssVar: string;
  sassVar?: string;
  cmyk?: { c: number; m: number; y: number; k: number };
  pantone?: string;
};

const CARD_STYLE: CSSProperties = {
  display: 'grid',
  gap: 14,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const LABEL_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  width: 'fit-content',
  maxWidth: '100%',
  minHeight: 30,
  boxSizing: 'border-box',
  margin: '0 0 8px',
  padding: '4px 14px',
  border: 0,
  borderRadius: 999,
  background: '#302d34',
  color: '#f8f5ff',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10,
  fontWeight: 500,
  textAlign: 'left',
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

function ArchSwatch({ cssVar, pinColor }: { cssVar: string; pinColor: string }) {
  return (
    <div
      style={{
        position: 'relative',
        height: 180,
        width: 'min(100%, 160px)',
        margin: '0 auto',
        background: cssVar,
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

function ColorSwatchCard({ token, name, hex, cssVar, cmyk, pantone, selected, onSelect }: NamedColor & { selected: boolean; onSelect: () => void }) {
  const rgb = hexToRgb(hex);
  const pinColor = ['blue', 'tinta'].includes(name.toLowerCase()) ? 'var(--az-color-brand-red)' : 'var(--az-color-brand-blue)';
  const rgbPairs: Array<[string, string]> = [['R', String(rgb.r)], ['G', String(rgb.g)], ['B', String(rgb.b)]];
  const cmykPairs: Array<[string, string]> | undefined = cmyk && [['C', String(cmyk.c)], ['M', String(cmyk.m)], ['Y', String(cmyk.y)], ['K', String(cmyk.k)]];

  return (
    <div style={CARD_STYLE}>
      <button type="button" onClick={onSelect} style={{ ...LABEL_STYLE, boxShadow: selected ? '0 0 0 3px #102d59' : 'none' }} aria-label={`Inspect ${token}`} aria-pressed={selected}>
        <span style={{ overflowWrap: 'anywhere' }}>{token}</span>
      </button>
      <p style={COLOR_NAME_STYLE}>{name}</p>
      <ArchSwatch cssVar={cssVar} pinColor={pinColor} />
      <div style={{ display: 'grid', gap: 5 }}>
        {cmykPairs ? cmykPairs.map((pair, index) => <ValuePairRow key={pair[0]} left={pair} right={rgbPairs[index]} />) : rgbPairs.map((pair) => <ValuePairRow key={pair[0]} left={pair} />)}
        <ValuePairRow left={['HEX', hex.toUpperCase()]} />
        {pantone && <ValuePairRow left={['PMS', pantone]} />}
      </div>
    </div>
  );
}

function TokenDetails({ color, onClose }: { color: NamedColor; onClose: () => void }) {
  const family = color.token.split('.').slice(0, -1).join('.');
  const sassVariable = color.sassVar ?? `$${color.token.replace(/\./g, '-')}`;
  const usageExamples = [
    ['CSS SETUP', `@import '@az-digital/tokens/dist/tokens.css';\n\n.example {\n  color: ${color.cssVar};\n}`],
    ['JAVASCRIPT SETUP', `import { az } from '@az-digital/tokens/dist/tokens.vars.js';\n\nconst value = az.${color.token.slice(3)};`],
    ['SASS SETUP', `@use '@az-digital/tokens/dist/tokens' as *;\n\n.example {\n  color: ${sassVariable};\n}`],
  ];
  const exportRows = [
    ['CSS VARIABLE', color.cssVar],
    ['SASS VARIABLE', sassVariable],
    ['GENERATED CSS', 'packages/tokens/dist/tokens.css'],
    ['GENERATED SASS', 'packages/tokens/dist/tokens.scss'],
    ['GENERATED JS', 'packages/tokens/dist/tokens.vars.js'],
    ['TYPE DECLARATIONS', 'packages/tokens/dist/tokens.vars.d.ts'],
  ];

  return (
    <>
      <button type="button" aria-label="Close token details" onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10, width: '100%', height: '100%', border: 0, background: 'rgba(28, 30, 34, 0.42)', cursor: 'default' }} />
      <aside role="dialog" aria-modal="true" aria-label={`${color.token} details`} style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 11, width: 'min(65vw, 760px)', boxSizing: 'border-box', overflowY: 'auto', padding: 28, borderLeft: '1px solid #dfe3ea', background: '#fff', boxShadow: '-12px 0 32px rgba(31, 36, 48, 0.18)', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingBottom: 14, borderBottom: '1px solid #e3e6eb' }}>
          <strong style={{ fontSize: 22, overflowWrap: 'anywhere' }}>{color.token}</strong>
          <button type="button" onClick={onClose} aria-label="Close token details" style={{ width: 28, height: 28, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ display: 'grid', gap: 22, marginTop: 20, fontSize: 13 }}>
          <div>
            <div style={{ marginBottom: 7, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>RESOLVED VALUE</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16 }}><span style={{ width: 18, height: 18, borderRadius: 3, background: color.hex }} />{color.hex.toUpperCase()}</div>
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>RELATIONSHIPS</div>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}><li>Parent group: {family}</li><li>Semantic family: {color.name}</li></ul>
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>SOURCE TOKEN</div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: '#f1f4f7' }}><code style={{ fontSize: 13, overflowWrap: 'anywhere' }}>{color.token}</code></div>
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>DERIVED IMPLEMENTATIONS</div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 12 }}>Generated from the source token above.</div>
            <div style={{ display: 'grid', gap: 8 }}>{exportRows.map(([label, value]) => <div key={label} style={{ padding: '10px 12px', borderRadius: 6, background: '#f1f4f7' }}><div style={{ marginBottom: 4, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>{label}</div><code style={{ fontSize: 13, overflowWrap: 'anywhere' }}>{value}</code></div>)}</div>
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>SOURCE FILE</div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: '#f1f4f7' }}><code style={{ fontSize: 13, overflowWrap: 'anywhere' }}>packages/tokens/tokens.json</code></div>
          </div>
          <div>
            <div style={{ marginBottom: 8, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>USAGE</div>
            <div style={{ display: 'grid', gap: 10 }}>{usageExamples.map(([label, example]) => <div key={label}><div style={{ marginBottom: 4, color: '#697786', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>{label}</div><pre style={{ margin: 0, padding: 12, overflowX: 'auto', borderRadius: 6, background: '#f1f4f7', color: '#1f2430', fontSize: 12, lineHeight: 1.5 }}><code>{example}</code></pre></div>)}</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function ColorSwatchGrid({ colors }: { colors: NamedColor[] }) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const selectedColor = colors.find((color) => color.token === selectedToken);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 24, margin: '16px 0' }}>
        {colors.map((color) => <ColorSwatchCard key={color.name} {...color} selected={selectedToken === color.token} onSelect={() => setSelectedToken(color.token)} />)}
      </div>
      {selectedColor && <TokenDetails color={selectedColor} onClose={() => setSelectedToken(null)} />}
    </div>
  );
}
