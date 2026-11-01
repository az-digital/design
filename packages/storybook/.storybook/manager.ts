import { addons, experimental_getStatusStore } from 'storybook/manager-api';

// Marks each docs page tagged `new` with Storybook's own "New" badge in the
// sidebar, through the status store that change detection also uses. Unlike
// change detection, which only runs on a local dev server and compares files
// with git, the tag is part of the page, so the badge shows on the review site
// too. Tag a component's stories file (`tags: ['new']` on its meta), and remove
// the tag once it's no longer new.
const NEW_TAG = 'new';
const TYPE_ID = 'az-digital/new';

type IndexEntry = { id: string; type: 'story' | 'docs'; tags?: string[] };

addons.register('az-digital/new-badge', () => {
  const store = experimental_getStatusStore(TYPE_ID);
  fetch('./index.json')
    .then((response) => response.json() as Promise<{ entries: Record<string, IndexEntry> }>)
    .then(({ entries }) => {
      const statuses = Object.values(entries)
        .filter((entry) => entry.type === 'docs' && entry.tags?.includes(NEW_TAG))
        .map((entry) => ({
          storyId: entry.id,
          typeId: TYPE_ID,
          value: 'status-value:new' as const,
          title: 'New',
          description: 'Added to the design system recently.',
        }));
      if (!statuses.length) return;
      // The status store syncs with the dev server after the manager loads, which
      // replaces statuses set before then, so they're set again whenever they're gone.
      const apply = () => {
        if (!Object.values(store.getAll()).some((byType) => byType[TYPE_ID])) store.set(statuses);
      };
      store.onAllStatusChange(apply);
      apply();
    })
    .catch(() => {
      // Without the index there are no badges; the sidebar works as before.
    });
});
