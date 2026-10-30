// Manager entry (loaded by Storybook from this package's `./manager` export):
// the Library toolbar menu.
// Default React import: Storybook bundles manager entries with the classic JSX runtime.
import React from 'react';
import { addons, types, useGlobals, useGlobalTypes, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import { Badge, Select } from 'storybook/internal/components';
import { ComponentIcon } from '@storybook/icons';
import { ADDON_ID, GLOBAL, TAG_PREFIX, TOOL_ID } from './constants';
import type { LibrarySummary } from './types';

/**
 * Storybook's own toolbar menus (`globalTypes[…].toolbar`) offer every item
 * on every story. This one is the same `Select`, but it knows each story's
 * `lib:*` tags, so it says which libraries the current component doesn't have,
 * and it labels preview libraries. (`Select` can't disable a single option, and
 * an option with custom content loses its description and badge, so the
 * unavailable ones are described rather than greyed out.)
 */
function LibraryTool() {
  const api = useStorybookApi();
  const { storyId, refId } = useStorybookState();
  const [globals, updateGlobals, storyGlobals] = useGlobals();
  const libraries = ((useGlobalTypes()[GLOBAL] as { libraries?: LibrarySummary[] } | undefined)?.libraries ?? []);

  const entry = storyId ? api.getData(storyId, refId) : undefined;
  const tagged = (entry?.tags ?? []).filter((tag) => tag.startsWith(TAG_PREFIX)).map((tag) => tag.slice(TAG_PREFIX.length));
  const has = (key: string) => tagged.length === 0 || tagged.includes(key);

  if (libraries.length === 0) return null;

  const options = libraries.map((library) => {
    const available = has(library.key);
    const notes = [library.status === 'preview' && 'Preview: not yet verified on its platform', !available && 'Not available for this component'].filter(Boolean);
    return {
      title: library.title,
      value: library.key,
      description: notes.join('. ') || undefined,
      aside: library.status === 'preview' ? <Badge status="warning">Preview</Badge> : undefined,
    };
  });

  return (
    <Select
      ariaLabel="Component library"
      tooltip="Component library"
      icon={<ComponentIcon />}
      defaultOptions={[globals[GLOBAL]]}
      options={options}
      disabled={GLOBAL in storyGlobals}
      onSelect={(selected) => updateGlobals({ [GLOBAL]: selected })}
    >
      Library
    </Select>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Component library',
    match: ({ viewMode, tabId }) => !tabId && (viewMode === 'story' || viewMode === 'docs'),
    render: () => <LibraryTool />,
  });
});
