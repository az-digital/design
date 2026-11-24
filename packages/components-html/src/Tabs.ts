import { escapeHtml } from './escapeHtml';

/** One tab in the row. The current tab is the one whose panel is showing. */
export type Tab = {
  label: string;
  /** The tab whose panel is showing. One tab in a row is current. */
  current?: boolean;
  /** A tab that can't be chosen. It stays in the row so a screen reader reaches it. */
  disabled?: boolean;
  /** Where the tab's panel is, for a tab that navigates. Defaults to `#`. */
  href?: string;
};

export type TabsProps = {
  tabs: Tab[];
  /** Names the row for a screen reader, since a tab list has no visible label. */
  label?: string;
  /** The label typeface, for every tab in the row. Defaults to serif. */
  typeface?: 'serif' | 'sans-serif';
};

// Arizona Bootstrap's classes for one tab's link, e.g. `nav-link active`.
function tabClasses({ current, disabled }: Tab) {
  return ['nav-link', current && 'active', disabled && 'disabled'].filter(Boolean).join(' ');
}

/**
 * One tab. Only the current tab is reachable with Tab; the arrow keys move
 * between the others, which is the roving tabindex a tab list uses.
 */
function renderTab(tab: Tab) {
  const attributes = [
    `class="${tabClasses(tab)}"`,
    `href="${escapeHtml(tab.href ?? '#')}"`,
    'role="tab"',
    `aria-selected="${tab.current ? 'true' : 'false'}"`,
    tab.disabled && 'aria-disabled="true"',
    !tab.current && 'tabindex="-1"',
  ].filter(Boolean);
  return `  <li class="nav-item" role="presentation">
    <a ${attributes.join(' ')}>${escapeHtml(tab.label)}</a>
  </li>`;
}

/** The alternate tab style as Arizona Bootstrap markup (`tabs.contract.json`). */
export function renderTabs({ tabs, label = 'Sections', typeface = 'serif' }: TabsProps) {
  const requested = tabs.findIndex((tab) => tab.current && !tab.disabled);
  const current = requested >= 0 ? requested : tabs.findIndex((tab) => !tab.disabled);
  // No class for the default serif, so markup for every caller that doesn't
  // pass typeface is unchanged.
  const classes = ['nav', 'nav-underline', typeface === 'sans-serif' && 'nav-underline--typeface-sans-serif'].filter(Boolean).join(' ');
  return `<ul class="${classes}" role="tablist" aria-label="${escapeHtml(label)}">
${tabs.map((tab, index) => renderTab({ ...tab, current: index === current })).join('\n')}
</ul>`;
}
