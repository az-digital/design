/// <reference types="vite/client" />

import type { Preview } from '@storybook/react-vite';
import type { ImplementationKey, Implementations } from '../stories/implementations';
import { IMPLEMENTATIONS, sourceForImplementation } from '../stories/implementations';
import '@tokens/dist/tokens.css';
// Storybook-only: points Arizona Bootstrap's button variables at our tokens (see the file).
import './arizona-bootstrap-shim.css';

const preview: Preview = {
  initialGlobals: {
    implementation: 'html',
  },
  globalTypes: {
    implementation: {
      description: 'Component implementation',
      toolbar: {
        title: 'Implementation',
        icon: 'component',
        items: IMPLEMENTATIONS.map(({ key, title }) => ({ value: key, title })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Primary', ['Overview', 'Brand', ['Overview', '*'], 'Foundations', ['Overview', '*'], 'Components', ['Overview', '*'], '*'], 'Bear Down 100'],
      },
    },
    docs: {
      codePanel: true,
      source: {
        // Swap the docs "Show code" panel to match the toolbar's Implementation
        // switcher. Stories provide a `parameters.implementations` map (see
        // ../stories/implementations.tsx) so the panel stays in sync with live
        // control changes, and falls back gracefully when a story doesn't
        // have the currently-selected implementation at all.
        //
        // Read `implementationsOverride` first, not `implementations` itself,
        // for a single story that needs a *different* set than its meta's
        // default (e.g. a variant with no React implementation while the
        // component otherwise has one) — Storybook deep-merges `parameters`
        // objects, so a story setting `parameters: { implementations: X }`
        // gets X merged *into* the meta-level map instead of replacing it,
        // silently keeping keys X was trying to omit. A distinct parameter
        // name that only ever exists at the story level sidesteps that merge
        // entirely. Verified directly: without this, a story meant to be
        // HTML-only kept falling back to the meta's React implementation.
        transform: (code: string, storyContext: { globals: Record<string, unknown>; args: Record<string, unknown>; parameters: Record<string, unknown> }) => {
          const implementations = (storyContext.parameters.implementationsOverride ?? storyContext.parameters.implementations) as Implementations<Record<string, unknown>> | undefined;
          const key = storyContext.globals.implementation as ImplementationKey;

          if (!implementations) {
            return code;
          }

          return sourceForImplementation(implementations, key, storyContext.args) ?? `// Not implemented for "${key}" yet.`;
        },
      },
    },
  },
};

export default preview;
