// Doc blocks for MDX pages: a library picker that shares the toolbar's
// global, and blocks that show the selected library's components and README.
// Adapted from the Components Overview in az-digital/design#57.
import React, { useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { DocsContext, Markdown } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { GLOBAL } from './constants';
import { defaultLibrary, getLibrary, libraries, taggedLibraries } from './registry';

type Globals = Record<string, unknown>;

/**
 * The selected library on a docs page. Docs pages have no `useGlobals`, so
 * this starts from the channel's latest globals event and follows updates.
 */
function useSelectedLibrary(): [string | undefined, (key: string) => void] {
  const { channel } = useContext(DocsContext);
  const latest = (channel.last?.(GLOBALS_UPDATED) ?? channel.last?.(SET_GLOBALS))?.[0] as { globals?: Globals } | undefined;
  const [selected, setSelected] = useState((latest?.globals?.[GLOBAL] as string | undefined) ?? defaultLibrary);

  useEffect(() => {
    const onGlobals = ({ globals }: { globals: Globals }) => {
      if (globals[GLOBAL]) setSelected(globals[GLOBAL] as string);
    };
    channel.on(GLOBALS_UPDATED, onGlobals);
    return () => channel.off(GLOBALS_UPDATED, onGlobals);
  }, [channel]);

  const select = (key: string) => {
    setSelected(key);
    channel.emit(UPDATE_GLOBALS, { globals: { [GLOBAL]: key } });
  };
  return [selected, select];
}

/** Until when the picker takes focus back after a re-render; see `LibraryPicker`. */
let refocusPickerUntil = 0;

/**
 * Segmented control for choosing a component library, built on native radio
 * buttons. It sets the same global as the Library toolbar, so choosing here
 * switches the toolbar and every component story too, and the other way round.
 */
export function LibraryPicker() {
  const [selected, select] = useSelectedLibrary();
  const fieldset = useRef<HTMLFieldSetElement>(null);

  // Changing the global re-renders the whole docs page, which drops keyboard
  // focus. Put it back on the selected radio, so arrow keys keep working.
  useEffect(() => {
    if (Date.now() > refocusPickerUntil) return;
    fieldset.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
  }, [selected]);

  return (
    <fieldset ref={fieldset} className="az-library-picker" style={{ border: 0, padding: 0, margin: '1.5rem 0' }}>
      <legend style={{ fontSize: 14, fontWeight: 700, marginBottom: '0.5rem', padding: 0 }}>Component library</legend>
      {/* The radios are visually hidden inside their labels, so show keyboard focus on the label. */}
      <style>{`.az-library-picker label:has(input:focus-visible) { outline: 2px solid #1e5288; outline-offset: -4px; }`}</style>
      <div style={{ display: 'inline-flex', flexWrap: 'wrap', border: '1px solid #c9d1d9', borderRadius: 8, overflow: 'hidden' }}>
        {libraries.map(({ key, title, status }, index) => {
          const checked = selected === key;
          return (
            <label
              key={key}
              style={{
                position: 'relative',
                padding: '0.5rem 1rem',
                fontSize: 14,
                fontWeight: checked ? 700 : 400,
                cursor: 'pointer',
                color: checked ? '#fff' : 'inherit',
                background: checked ? '#0c234b' : 'transparent',
                borderLeft: index > 0 ? '1px solid #c9d1d9' : undefined,
              }}
            >
              <input
                type="radio"
                name="component-library"
                value={key}
                checked={checked}
                onChange={(event) => {
                  const hadFocus = event.currentTarget.ownerDocument.activeElement === event.currentTarget;
                  refocusPickerUntil = hadFocus ? Date.now() + 1000 : 0;
                  select(key);
                }}
                style={{ position: 'absolute', opacity: 0, inset: 0, margin: 0, cursor: 'pointer' }}
              />
              {title}
              {status === 'preview' ? ' (preview)' : ''}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Renders its children only while `value` is the selected library. */
export function ForLibrary({ value, children }: { value: string; children: ReactNode }) {
  const [selected] = useSelectedLibrary();
  return selected === value ? <>{children}</> : null;
}

type IndexEntry = { id: string; type: 'story' | 'docs'; title: string; tags?: string[] };

/** Each component in the story index with its `lib:*` tags: its title, docs page id and libraries. */
function useComponents() {
  const [components, setComponents] = useState<{ title: string; docsId: string; libraries: string[] }[]>();
  useEffect(() => {
    let cancelled = false;
    fetch('./index.json')
      .then((response) => response.json())
      .then(({ entries }: { entries: Record<string, IndexEntry> }) => {
        const byTitle = new Map<string, { title: string; docsId: string; libraries: string[] }>();
        for (const entry of Object.values(entries)) {
          const tagged = taggedLibraries(entry.tags);
          if (!tagged || byTitle.has(entry.title)) continue;
          byTitle.set(entry.title, { title: entry.title, docsId: `${entry.id.split('--')[0]}--docs`, libraries: tagged });
        }
        if (!cancelled) setComponents([...byTitle.values()].sort((a, b) => a.title.localeCompare(b.title)));
      })
      .catch(() => !cancelled && setComponents([]));
    return () => {
      cancelled = true;
    };
  }, []);
  return components;
}

const componentName = (title: string) => title.split('/').at(-1);

/**
 * The selected library's components, linked to their docs pages with that
 * library selected. Built from the story index's `lib:*` tags, so nothing is
 * listed by hand.
 */
export function LibraryComponents() {
  const [selected] = useSelectedLibrary();
  const components = useComponents();
  const library = getLibrary(selected);
  if (!library || !components) return null;
  const own = components.filter((component) => component.libraries.includes(library.key));
  if (own.length === 0) return <p>{library.title} doesn’t have any components yet.</p>;
  return (
    <ul>
      {own.map(({ title, docsId }) => (
        <li key={title}>
          <a href={`./?path=/docs/${docsId}&globals=${GLOBAL}:${library.key}`} target="_top">
            {componentName(title)}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Every component with `lib:*` tags against every registered library. */
export function ComponentCoverage() {
  const components = useComponents();
  if (!components) return null;
  return (
    <table>
      <thead>
        <tr>
          <th>Component</th>
          {libraries.map((library) => (
            <th key={library.key}>{library.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {components.map(({ title, docsId, libraries: own }) => (
          <tr key={title}>
            <td>
              <a href={`./?path=/docs/${docsId}`} target="_top">
                {componentName(title)}
              </a>
            </td>
            {libraries.map((library) => (
              <td key={library.key}>{own.includes(library.key) ? 'Yes' : '—'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * The selected library's README (from its manifest's `readme`), without its
 * top heading. `hide` drops sections by their `## ` heading, for pages that
 * show only what readers of that page need.
 */
export function LibraryReadme({ hide = [] }: { hide?: string[] }) {
  const [selected] = useSelectedLibrary();
  const readme = getLibrary(selected)?.readme;
  if (!readme) return null;
  const sections = readme.replace(/^# .*\n+/, '').split(/^(?=## )/m);
  const shown = sections.filter((section) => !hide.some((heading) => section.startsWith(`## ${heading}\n`)));
  return <Markdown>{shown.join('')}</Markdown>;
}
