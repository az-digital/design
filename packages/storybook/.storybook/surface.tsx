import { createElement, useEffect } from 'react';
import type { Decorator } from '@storybook/react-vite';

/**
 * PROOF OF CONCEPT (surface modes). Applies the Surface toolbar's value with
 * `data-az-surface`, the attribute a site would use (see
 * packages/tokens/scripts/build-modes.mjs).
 *
 * In a story's own view it goes on <html>, so the whole canvas becomes that
 * surface. On a docs page it wraps each story in a framed surface instead,
 * so the docs page itself stays readable. Arizona Bootstrap's own color mode
 * (`data-bs-theme`) is set to match for markup that relies on it.
 */
export const withSurface: Decorator = (Story, context) => {
  const surface = (context.globals.surface as string) ?? 'light';
  const inStory = context.viewMode === 'story';
  const bsTheme = surface === 'dark' ? 'dark' : surface === 'auto' ? undefined : 'light';

  useEffect(() => {
    if (!inStory) return;
    const root = document.documentElement;
    root.setAttribute('data-az-surface', surface);
    if (bsTheme) root.setAttribute('data-bs-theme', bsTheme);
    else root.removeAttribute('data-bs-theme');
    return () => {
      root.removeAttribute('data-az-surface');
      root.removeAttribute('data-bs-theme');
    };
  }, [inStory, surface, bsTheme]);

  if (inStory || surface === 'light') return createElement(Story);

  return createElement(
    'div',
    { className: 'az-surface-frame', 'data-az-surface': surface, 'data-bs-theme': bsTheme, style: { padding: '1.5rem', borderRadius: 4 } },
    createElement(Story),
  );
};
