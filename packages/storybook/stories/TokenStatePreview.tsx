import type { CSSProperties, ReactNode } from 'react';
import { TokenTable } from '@unpunnyfuns/swatchbook-addon';

const LABEL_STYLE: CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#6b7785',
};

export type ButtonState = {
  label: string;
  /**
   * Scoped CSS rules recreating this state's look from its tokens (write
   * `&` for the per-state scope class, e.g. `& .btn { background-color:
   * ...; }`). This is a static mockup of design intent, not a live
   * `:hover`/`:focus-visible` test — real pseudo-classes can't all be
   * simultaneously true across separate side-by-side instances, so there's
   * no way to show three states at once except by recreating each look
   * directly from its resolved token value.
   */
  css?: string;
};

/**
 * Renders `children` (a real, rendered instance of the component) once per
 * entry in `states`, side by side, each recreating that state's look from
 * its own tokens — so a viewer can compare Default/Hover/Focus-visible
 * without needing to actually hover or Tab to each one. Below that, the
 * full, always-visible token table for `tokenFilter` — click a row to see
 * its alias chain and description (built into `TokenTable`, not custom
 * here).
 */
export function TokenStatePreview({
  children,
  states,
  pageBackgroundClassName,
  tokenFilter,
}: {
  children: ReactNode;
  states: ButtonState[];
  pageBackgroundClassName?: string;
  tokenFilter: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {states.map((state, index) => {
          const scopeClass = `token-state-preview-${index}`;
          return (
            <div key={state.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <span style={LABEL_STYLE}>{state.label}</span>
              {state.css && <style>{state.css.replaceAll('&', `.${scopeClass}`)}</style>}
              <div className={[scopeClass, pageBackgroundClassName].filter(Boolean).join(' ')} style={{ display: 'inline-block', padding: pageBackgroundClassName ? '1.5rem' : undefined }}>
                {children}
              </div>
            </div>
          );
        })}
      </div>
      <TokenTable filter={tokenFilter} searchable={false} caption="Tokens in use" />
    </div>
  );
}
