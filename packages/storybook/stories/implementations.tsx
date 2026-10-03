import type { ReactElement } from 'react';
import type { StoryContext } from '@storybook/react-vite';

/**
 * Kinds of implementation a component might have. Add to this list (and to
 * the `implementation` toolbar item in `.storybook/preview.ts`) as new
 * implementation kinds come online — e.g. `web` for actual Web Components.
 */
export type ImplementationKey = 'html' | 'react';

export type ImplementationEntry<Args> = {
  render: (args: Args) => ReactElement;
  /** Source shown in the docs "Code" panel for this implementation. */
  source: (args: Args) => string;
};

/**
 * Not every component needs one of every implementation kind — a component
 * only needed in Drupal doesn't need a React version, and vice versa. Omit
 * whichever keys don't apply; the toolbar switcher still offers every kind
 * (Storybook's toolbar can't shrink per-story), but selecting one this
 * component doesn't have shows a placeholder instead of breaking.
 */
export type Implementations<Args> = Partial<Record<ImplementationKey, ImplementationEntry<Args>>>;

const CONTRIBUTE_URL = 'https://github.com/az-digital/design/issues/new';

export function ImplementationPlaceholder({ componentName, implementation }: { componentName: string; implementation: ImplementationKey }) {
  return (
    <div style={{ padding: '1rem', border: '1px dashed #999', borderRadius: '0.5rem', color: '#555', maxWidth: '32rem' }}>
      <p style={{ margin: '0 0 0.5rem' }}>
        <strong>{componentName}</strong> doesn&rsquo;t have a {implementation} implementation yet.
      </p>
      <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer">
        Open an issue to contribute one →
      </a>
    </div>
  );
}

/**
 * Shared `render` body for an implementation-toggled story. Branching here
 * (rather than in a decorator) is required, not just convenient: Storybook's
 * docs source-capture calls `context.originalStoryFn(context.args, context)`
 * directly, bypassing decorators, so a decorator-only swap leaves the docs
 * "Code" panel showing stale source after the toolbar switch even though the
 * canvas updates fine.
 */
export function renderImplementation<Args>(componentName: string, implementations: Implementations<Args>, args: Args, context: StoryContext): ReactElement {
  const key = context.globals.implementation as ImplementationKey;
  const entry = implementations[key];

  if (!entry) {
    return <ImplementationPlaceholder componentName={componentName} implementation={key} />;
  }

  return entry.render(args);
}

/** For `.storybook/preview.ts`'s `docs.source.transform` — reads whichever implementation is current. */
export function sourceForImplementation<Args>(implementations: Implementations<Args>, key: ImplementationKey, args: Args): string | undefined {
  return implementations[key]?.source(args);
}
