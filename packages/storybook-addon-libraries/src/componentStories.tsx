import React, { useLayoutEffect, useRef } from 'react';
import { GLOBAL, PARAMETER } from './constants';
import { getLibrary, taggedLibraries } from './registry';
import type { LibrariesParameter } from './types';

const placeholderStyle = { padding: '1rem', border: '1px dashed #999', borderRadius: '0.5rem', color: '#555', maxWidth: '32rem', background: '#fff' };

export function LibraryPlaceholder({ children }: { children: React.ReactNode }) {
  return <div style={placeholderStyle}>{children}</div>;
}

type LibraryCanvasProps = {
  /** The component's id in each library's adapter, e.g. `button`. */
  component: string;
  /** The component's shared props. */
  props: unknown;
  /** The selected library's key. */
  library: unknown;
  /** The story's tags; `lib:*` tags limit which libraries it has. */
  tags?: readonly string[];
};

/** Draws `component` with the selected library's adapter, or says why it can't. */
export function LibraryCanvas({ component, props, library: key, tags }: LibraryCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const library = getLibrary(key);
  const tagged = taggedLibraries(tags);
  const adapter = library?.adapter?.components[component];
  const drawable = library && adapter && (!tagged || tagged.includes(library.key));

  useLayoutEffect(() => {
    const element = container.current;
    if (!element || !adapter) return undefined;
    element.replaceChildren();
    const output = adapter.render(props, element);
    if (typeof output === 'string') element.innerHTML = output;
    else if (output instanceof Node) element.append(output);
    return () => {
      if (typeof output === 'function') output();
      element.replaceChildren();
    };
  }, [adapter, props]);

  if (!library) {
    return <LibraryPlaceholder>No component library is registered as “{String(key)}”.</LibraryPlaceholder>;
  }
  if (library.ref) {
    return (
      <LibraryPlaceholder>
        {library.title} renders in its own Storybook: <a href={library.ref} target="_blank" rel="noreferrer">open it</a>.
      </LibraryPlaceholder>
    );
  }
  if (!drawable) {
    return (
      <LibraryPlaceholder>
        <strong>{library.title}</strong> doesn’t have this component yet.{' '}
        <a href="https://github.com/az-digital/design/issues/new" target="_blank" rel="noreferrer">
          Open an issue to contribute it
        </a>
        .
      </LibraryPlaceholder>
    );
  }
  return <div ref={container} data-az-library={library.key} />;
}

/**
 * The library-aware part of a component's story meta: a `render` that draws
 * the component with whichever library the toolbar selects, and the
 * parameters the Code panel uses to show that library's source. Spread it
 * into the meta object, and list the libraries the component has as tags:
 *
 * ```ts
 * const meta = {
 *   title: 'Primary/Components/Buttons/Button',
 *   tags: ['lib:html', 'lib:web'],
 *   ...componentStories('button', { props: (args) => ({ label: args.Label }) }),
 * } satisfies Meta<ButtonArgs>;
 * ```
 *
 * The meta stays an object literal so Storybook's indexer can read its
 * `title` and `tags`. Pass any other parameters (say a Figma design link)
 * through `parameters` here — the helper merges them with its own, including
 * nested `docs` — because spreading meta-level `parameters` after the helper
 * would replace them and hide the Code panel.
 */
export function componentStories<Args, Props>(
  component: string,
  { props, parameters = {} }: { props: (args: Args) => Props; parameters?: Record<string, unknown> },
) {
  const parameter: LibrariesParameter<Args, Props> = { component, props };
  const { docs, ...rest } = parameters as { docs?: Record<string, unknown> };
  return {
    render: (args: Args, context: { globals: Record<string, unknown>; tags: string[] }) => (
      <LibraryCanvas component={component} props={props(args)} library={context.globals[GLOBAL]} tags={context.tags} />
    ),
    parameters: {
      ...rest,
      [PARAMETER]: parameter,
      docs: { codePanel: true, ...docs },
    },
  };
}
