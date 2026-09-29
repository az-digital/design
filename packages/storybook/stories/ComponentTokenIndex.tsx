import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import tokensDocument from '../../tokens/tokens.json';
import { getTokenDisplayItems } from './resolveToken';
import { getTokenNode } from './tokenGraph';
import type { TokenData } from './Token';
import { TokenTable } from './TokenTable';

type TokenGroup = Record<string, unknown>;

type ComponentGroup = { key: string; label: string; items: TokenData[] };

type GroupMode = 'style' | 'state';

type ComponentEntry = {
  name: string;
  prefix: string;
  items: TokenData[];
  /** Shared + one group per variant. */
  groups: ComponentGroup[];
  variants: string[];
  /** Which style group ("Shared", "Solid", ...) a token belongs to. */
  groupOf: (item: TokenData) => string;
};

/**
 * Interaction states, in display order. A token's state is the first of these
 * that appears as a segment of its path after the component name
 * (`solid.hover.container.color` → Hover); anything else is the resting
 * (Default) look. Matches the `<variant>.<state>.<part>` structure in
 * packages/tokens/AGENTS.md.
 */
const STATES = ['hover', 'focus', 'focus-visible', 'active', 'disabled'];
const STATE_ORDER = ['default', ...STATES];

export function tokenState(token: string, prefix: string): string {
  return token.slice(prefix.length).split('.').find((segment) => STATES.includes(segment)) ?? 'default';
}

const isGroup = (value: unknown): value is TokenGroup => typeof value === 'object' && value !== null && !Array.isArray(value) && !('$value' in value);
const childGroupKeys = (group: TokenGroup) => Object.keys(group).filter((key) => !key.startsWith('$') && isGroup(group[key]));
const title = (key: string) => key.replace(/(^|-)(\w)/g, (_match, sep: string, letter: string) => `${sep ? ' ' : ''}${letter.toUpperCase()}`);

/**
 * A component's top-level group is a *variant* (e.g. `solid`, `outline`, `size`)
 * when it overrides parts the component root already defines — `solid.label`
 * overrides the root `label`, `size.sm.padding` the root `padding`. That's the
 * structure packages/tokens/AGENTS.md requires (shared structure at the root,
 * one group per variant holding only what it changes), so no extra metadata is
 * needed. Everything else is shared structure.
 */
function isVariantGroup(root: TokenGroup, key: string): boolean {
  const rootParts = new Set(childGroupKeys(root).filter((part) => part !== key));
  const group = root[key];
  if (!isGroup(group)) return false;
  const children = childGroupKeys(group);
  if (children.some((child) => rootParts.has(child))) return true;
  return children.some((child) => {
    const grandchild = group[child];
    return isGroup(grandchild) && childGroupKeys(grandchild).some((part) => rootParts.has(part));
  });
}

function buildComponentEntries(): ComponentEntry[] {
  const components = (tokensDocument.az as Record<string, unknown>).component;
  if (!isGroup(components)) return [];

  return childGroupKeys(components)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const root = components[name] as TokenGroup;
      const prefix = `az.component.${name}.`;
      const items = getTokenDisplayItems(prefix);
      const topLevelKey = (item: TokenData) => item.token.slice(prefix.length).split('.')[0];
      // Styles (solid, outline, ...) first, in tokens.json order; the size axis last.
      const variants = childGroupKeys(root).filter((key) => isVariantGroup(root, key)).sort((a, b) => Number(a === 'size') - Number(b === 'size'));
      const shared = items.filter((item) => !variants.includes(topLevelKey(item)));

      const groups: ComponentGroup[] = [
        ...(shared.length ? [{ key: 'shared', label: 'Shared', items: shared }] : []),
        ...variants.map((variant) => ({
          key: variant,
          label: title(variant),
          items: items.filter((item) => topLevelKey(item) === variant),
        })),
      ];
      const groupOf = (item: TokenData) => (variants.includes(topLevelKey(item)) ? title(topLevelKey(item)) : 'Shared');
      return { name, prefix, items, groups, variants, groupOf };
    });
}

/** Text a search matches against: the token path, its type, what it aliases, and its resolved value. */
const searchText = (item: TokenData) => [item.token, item.type, getTokenNode(item.token)?.parent, item.hex, item.value].filter(Boolean).join(' ').toLowerCase();

/** Docs ids that exist in this Storybook, so a component only links to a docs page it actually has. */
function useDocsIds(): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    let cancelled = false;
    fetch('./index.json')
      .then((response) => (response.ok ? response.json() : { entries: {} }))
      .then((index: { entries?: Record<string, unknown> }) => {
        if (!cancelled) setIds(new Set(Object.keys(index.entries ?? {})));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return ids;
}

const CHIP: CSSProperties = {
  border: '1px solid #c9d1da',
  borderRadius: 999,
  padding: '3px 10px',
  background: '#fff',
  color: '#374151',
  cursor: 'pointer',
  fontSize: 12,
};
const CHIP_ACTIVE: CSSProperties = { ...CHIP, borderColor: '#1e5288', background: '#1e5288', color: '#fff' };
const META: CSSProperties = { color: '#697786', fontSize: 12 };

/** Stable sort by state order, so a table grouped by state lists Default, Hover, Focus, ... */
const byState = (prefix: string) => (a: TokenData, b: TokenData) => STATE_ORDER.indexOf(tokenState(a.token, prefix)) - STATE_ORDER.indexOf(tokenState(b.token, prefix));

/** One component's tokens, sectioned by style (each split by state) or by state (each split by style). */
function ComponentTokenGroups({ entry, mode }: { entry: ComponentEntry; mode: GroupMode }) {
  const stateLabel = (item: TokenData) => title(tokenState(item.token, entry.prefix));
  const sections =
    mode === 'style'
      ? entry.groups.map((group) => ({ key: group.key, label: group.label, items: [...group.items].sort(byState(entry.prefix)), groupBy: stateLabel }))
      : STATE_ORDER.map((state) => ({
          key: state,
          label: title(state),
          items: entry.items.filter((item) => tokenState(item.token, entry.prefix) === state),
          groupBy: entry.groupOf,
        }))
          .filter((section) => section.items.length > 0)
          .map((section) => {
            const order = entry.groups.map((group) => group.label);
            return { ...section, items: [...section.items].sort((a, b) => order.indexOf(entry.groupOf(a)) - order.indexOf(entry.groupOf(b))) };
          });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {sections.map((section) => (
        <section key={section.key} aria-label={`${title(entry.name)} ${section.label} tokens`}>
          <h4 style={{ margin: '8px 0 4px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#56657a' }}>
            {section.label} <span style={{ ...META, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· {section.items.length}</span>
          </h4>
          <TokenTable items={section.items} groupBy={section.groupBy} />
        </section>
      ))}
    </div>
  );
}

function GroupModeToggle({ mode, onChange }: { mode: GroupMode; onChange: (mode: GroupMode) => void }) {
  return (
    <div role="group" aria-label="Group tokens by" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={META}>Group by</span>
      {(['style', 'state'] as const).map((option) => (
        <button key={option} type="button" aria-pressed={mode === option} onClick={() => onChange(option)} style={mode === option ? CHIP_ACTIVE : CHIP}>
          {option === 'style' ? 'Style' : 'State'}
        </button>
      ))}
    </div>
  );
}

/**
 * The Tokens page's component section: one collapsed row per component (built
 * from tokens.json, so it never needs hand-maintaining), expanding into that
 * component's tokens grouped into Shared and one table per variant. Searching
 * (token path, type, alias, or value) or filtering by type switches to the
 * matching rows across every component.
 */
export function ComponentTokenIndex({ component }: { component?: string } = {}) {
  const allEntries = useMemo(buildComponentEntries, []);
  const [mode, setMode] = useState<GroupMode>('style');
  const entries = component ? allEntries.filter((entry) => entry.name === component) : allEntries;
  const docsIds = useDocsIds();
  const [query, setQuery] = useState('');
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const allTypes = useMemo(() => [...new Set(entries.flatMap((entry) => entry.items.map((item) => item.type ?? 'unknown')))].sort(), [entries]);
  const normalizedQuery = query.trim().toLowerCase();
  const filtering = normalizedQuery !== '' || types.size > 0;
  const matches = (item: TokenData) => (types.size === 0 || types.has(item.type ?? 'unknown')) && (normalizedQuery === '' || searchText(item).includes(normalizedQuery));

  const toggle = <T,>(set: Set<T>, value: T) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  // On a single component's docs page: no index or search, just its grouped tokens.
  if (component) {
    const entry = entries[0];
    if (!entry) return <p style={META}>No <code>az.component.{component}.*</code> tokens in tokens.json.</p>;
    return (
      <div style={{ display: 'grid', gap: 8, margin: '16px 0', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#1f2430' }}>
        <GroupModeToggle mode={mode} onChange={setMode} />
        <ComponentTokenGroups entry={entry} mode={mode} />
      </div>
    );
  }

  const results = filtering ? entries.map((entry) => ({ entry, items: entry.items.filter(matches) })).filter(({ items }) => items.length > 0) : [];
  const resultCount = results.reduce((total, { items }) => total + items.length, 0);

  return (
    <div style={{ display: 'grid', gap: 12, margin: '16px 0', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", color: '#1f2430' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <label style={{ flex: '1 1 260px' }}>
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>Search component tokens</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search component tokens — name, type, alias, or value"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', border: '1px solid #bac7d5', borderRadius: 6, font: 'inherit', fontSize: 14 }}
          />
        </label>
        <GroupModeToggle mode={mode} onChange={setMode} />
        <div role="group" aria-label="Filter by type" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {allTypes.map((type) => (
            <button key={type} type="button" aria-pressed={types.has(type)} onClick={() => setTypes((current) => toggle(current, type))} style={types.has(type) ? CHIP_ACTIVE : CHIP}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {filtering ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <div role="status" style={META}>
            {resultCount === 0 ? 'No component tokens match.' : `${resultCount} matching token${resultCount === 1 ? '' : 's'} in ${results.length} component${results.length === 1 ? '' : 's'}`}
          </div>
          {results.map(({ entry, items }) => (
            <section key={entry.name} aria-label={`${title(entry.name)} matches`}>
              <h4 style={{ margin: '0 0 6px', fontSize: 15 }}>{title(entry.name)}</h4>
              <TokenTable items={[...items].sort(byState(entry.prefix))} groupBy={mode === 'style' ? entry.groupOf : (item) => title(tokenState(item.token, entry.prefix))} />
            </section>
          ))}
        </div>
      ) : (
        <div style={{ border: '1px solid #dfe3ea', borderRadius: 8, overflow: 'hidden' }}>
          {entries.map((entry, index) => {
            const isOpen = expanded.has(entry.name);
            const docsId = `components-${entry.name}--docs`;
            const sizeGroup = (tokensDocument.az as Record<string, Record<string, TokenGroup>>).component[entry.name].size;
            const sizes = isGroup(sizeGroup) ? childGroupKeys(sizeGroup) : [];
            const styles = entry.variants.filter((variant) => variant !== 'size');
            return (
              <div key={entry.name} style={{ borderTop: index > 0 ? '1px solid #dfe3ea' : undefined }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '10px 14px', background: isOpen ? '#f7f9fb' : '#fff' }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded((current) => toggle(current, entry.name))}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: 0, background: 'none', padding: 0, cursor: 'pointer', font: 'inherit', fontSize: 15, fontWeight: 700, color: '#1f2430' }}
                  >
                    <span aria-hidden="true" style={{ display: 'inline-block', width: 12, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 120ms ease' }}>▸</span>
                    {title(entry.name)}
                  </button>
                  <span style={META}>
                    {entry.items.length} tokens
                    {styles.length > 0 && <> · styles: {styles.join(', ')}</>}
                    {sizes.length > 0 && <> · sizes: {sizes.join(', ')}</>}
                  </span>
                  {docsIds.has(docsId) && (
                    <a href={`./?path=/docs/${docsId}`} target="_top" style={{ marginLeft: 'auto', fontSize: 13, color: '#1d65a6' }}>
                      {title(entry.name)} docs →
                    </a>
                  )}
                </div>
                {isOpen && (
                  <div style={{ padding: '4px 14px 16px' }}>
                    <ComponentTokenGroups entry={entry} mode={mode} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
