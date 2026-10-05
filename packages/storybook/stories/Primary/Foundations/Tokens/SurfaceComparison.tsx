import { createElement } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@az-digital/components-react';
import { renderButton } from '@az-digital/components-html';
// Registers <az-button>.
import '@az-digital/components-web';
import renderQuickstartButton from '@az-digital/components-quickstart/components/button/button.twig';

/**
 * PROOF OF CONCEPT (surface modes). The same two Buttons in every library, on
 * a light and a dark surface side by side. Every implementation reads the same
 * tokens, so all of them switch together when the surface changes.
 */
const LIBRARIES: { name: string; render: (style: 'solid' | 'outline') => ReactNode }[] = [
  { name: 'Arizona Bootstrap', render: (style) => <span dangerouslySetInnerHTML={{ __html: renderButton({ style, text: 'Apply to Arizona' }) }} /> },
  { name: 'React Bootstrap', render: (style) => createElement(Button, { style }, 'Apply to Arizona') },
  { name: 'Web Components', render: (style) => createElement('az-button', { variant: style, href: '#' }, 'Apply to Arizona') },
  { name: 'Arizona Quickstart', render: (style) => <span dangerouslySetInnerHTML={{ __html: renderQuickstartButton({ style, text: 'Apply to Arizona' }) }} /> },
];

const LABEL = { fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const, margin: '0 0 0.75rem' };

function Surface({ surface }: { surface: 'light' | 'dark' }) {
  return (
    <div
      className="az-surface-frame"
      data-az-surface={surface}
      data-bs-theme={surface}
      style={{ flex: '1 1 20rem', padding: '1.5rem', borderRadius: 8, border: '1px solid rgba(127, 127, 127, 0.3)' }}
    >
      <p style={LABEL}>{surface === 'light' ? 'Light surface' : 'Dark surface (placeholder values)'}</p>
      {LIBRARIES.map(({ name, render }) => (
        <div key={name} style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: 14, margin: '0 0 0.5rem' }}>{name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {render('solid')}
            {render('outline')}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SurfaceComparison() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1.5rem 0' }}>
      <Surface surface="light" />
      <Surface surface="dark" />
    </div>
  );
}
