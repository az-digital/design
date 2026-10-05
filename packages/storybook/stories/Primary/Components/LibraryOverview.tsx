import { useContext, useEffect, useRef, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import type { ImplementationKey } from '../../implementations';
import { IMPLEMENTATIONS } from '../../implementations';

const GLOBAL = 'implementation';
const DEFAULT: ImplementationKey = 'html';

/**
 * The Implementation toolbar's current value, read and written from a docs
 * page. The Components Overview page puts a picker next to its explanation of
 * each library; it sets the same global as the toolbar, so choosing a library
 * here also switches the toolbar and every component story, and the other way
 * round.
 *
 * Docs pages have no public hook for globals (`useGlobals` only works inside a
 * story), so this reads the starting value from the docs context's story store
 * and then follows the channel's GLOBALS_UPDATED events. The store isn't part
 * of the context's public type, hence the cast; if it's ever missing, the page
 * starts from the default and still follows later changes.
 *
 * One value is shared by the picker and every `ForImplementation` block on the
 * page, so they always agree.
 */
let selected: ImplementationKey | undefined;
/**
 * Until when the picker should take focus back after a re-render; set when it
 * had focus as its value changed. See `ImplementationPicker`.
 */
let refocusPickerUntil = 0;
const subscribers = new Set<() => void>();

function setSelected(key: ImplementationKey) {
  selected = key;
  subscribers.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

function useImplementation(): [ImplementationKey, (key: ImplementationKey) => void] {
  const context = useContext(DocsContext);

  // Re-read on every fresh page mount (no subscribers yet): the library may
  // have changed on another page while this one wasn't listening.
  if (subscribers.size === 0) {
    const store = (context as unknown as { store?: { userGlobals?: { globals?: Record<string, unknown> } } }).store;
    selected = (store?.userGlobals?.globals?.[GLOBAL] as ImplementationKey | undefined) ?? DEFAULT;
  }

  useEffect(() => {
    const onGlobalsUpdated = ({ globals }: { globals: Record<string, unknown> }) => {
      if (globals[GLOBAL] && globals[GLOBAL] !== selected) setSelected(globals[GLOBAL] as ImplementationKey);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  const current = useSyncExternalStore(subscribe, () => selected ?? DEFAULT);

  const select = (key: ImplementationKey) => {
    setSelected(key);
    context.channel.emit(UPDATE_GLOBALS, { globals: { [GLOBAL]: key } });
  };

  return [current, select];
}

/** Segmented control for choosing a component library, built on native radio buttons. */
export function ImplementationPicker() {
  const [current, select] = useImplementation();
  const fieldset = useRef<HTMLFieldSetElement>(null);

  // Changing the global makes Storybook re-render the whole docs page shortly
  // after the picker itself has updated, which drops keyboard focus. Put focus
  // back on the newly selected radio after either render, so arrow keys keep
  // moving through the options.
  useEffect(() => {
    if (Date.now() > refocusPickerUntil) return;
    fieldset.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
  }, [current]);

  return (
    <fieldset ref={fieldset} className="az-library-picker" style={{ border: 0, padding: 0, margin: '1.5rem 0' }}>
      <legend style={{ fontSize: 14, fontWeight: 700, marginBottom: '0.5rem', padding: 0 }}>Component library</legend>
      {/* The radios are visually hidden inside their labels, so show keyboard focus on the label. */}
      <style>{`.az-library-picker label:has(input:focus-visible) { outline: 2px solid #1e5288; outline-offset: -4px; }`}</style>
      <div style={{ display: 'inline-flex', flexWrap: 'wrap', border: '1px solid #c9d1d9', borderRadius: 8, overflow: 'hidden' }}>
        {IMPLEMENTATIONS.map(({ key, title }, index) => {
          const checked = current === key;
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
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Renders its children only while `value` is the selected library. */
export function ForImplementation({ value, children }: { value: ImplementationKey; children: ReactNode }) {
  const [current] = useImplementation();
  return current === value ? <>{children}</> : null;
}
