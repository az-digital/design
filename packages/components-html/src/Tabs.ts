function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Props otherwise mirror `@az-digital/components-react`'s `Tabs` so the two
 * implementations can be shown side by side from the same story args.
 */
export type TabItemProps = {
  /** Tab label text. */
  title: string;
  /** Tab panel body text. */
  content: string;
  /** Disables this tab. Defaults to `false`. */
  disabled?: boolean;
};

export type TabsProps = {
  /** Base `id` for the tablist and its generated tab/panel ids. Defaults to `tabs`. */
  id?: string;
  items: TabItemProps[];
  /**
   * Which item is active on initial render, by index. Defaults to the first
   * non-disabled item.
   */
  defaultActiveIndex?: number;
  /** Nav style. Defaults to `tabs`. */
  variant?: 'tabs' | 'pills' | 'underline';
  /**
   * Lays the tablist out as a vertical column beside its tab-content, with
   * `aria-orientation="vertical"` on the tablist. Matches Arizona Bootstrap's
   * own vertical-tabs example — genuinely upstream Bootstrap behavior, not
   * Arizona-specific (unlike "Vertical Pills" in the same docs page, which is
   * a different, static/non-interactive nav pattern this component doesn't
   * cover — see tabs.mdx).
   */
  vertical?: boolean;
  /** Proportionately fills the available width across tab items (`.nav-fill`). */
  fill?: boolean;
  /** Makes every tab item the same width, filling the available width (`.nav-justified`). */
  justify?: boolean;
};

function resolveActiveIndex(items: TabItemProps[], defaultActiveIndex?: number): number {
  if (defaultActiveIndex !== undefined) {
    return defaultActiveIndex;
  }
  const firstEnabled = items.findIndex((item) => !item.disabled);
  return firstEnabled === -1 ? 0 : firstEnabled;
}

/** Renders the Tabs as an HTML string using Arizona Bootstrap's real nav/tab-content markup/classes. */
export function renderTabs(props: TabsProps): string {
  const { id = 'tabs', items, variant = 'tabs', vertical = false, fill = false, justify = false } = props;
  const activeIndex = resolveActiveIndex(items, props.defaultActiveIndex);

  // The real docs use data-bs-toggle="pill" for the Pills variant and "tab" for
  // everything else — Bootstrap's Tab plugin treats both identically, but this
  // matches the real markup rather than a functionally-equivalent shortcut.
  const toggleValue = variant === 'pills' ? 'pill' : 'tab';

  const navClasses = [
    'nav',
    'mb-3',
    variant === 'tabs' ? 'nav-tabs' : variant === 'pills' ? 'nav-pills' : 'nav-underline',
    vertical && 'flex-column',
    vertical && 'me-3',
    fill && 'nav-fill',
    justify && 'nav-justified',
  ]
    .filter(Boolean)
    .join(' ');

  const navHtml = items
    .map((item, index) => {
      const isActive = index === activeIndex;
      const tabId = `${id}-tab-${index}`;
      const paneId = `${id}-pane-${index}`;
      const classes = ['nav-link', isActive && 'active'].filter(Boolean).join(' ');

      return `<button class="${classes}" id="${tabId}" data-bs-toggle="${toggleValue}" data-bs-target="#${paneId}" type="button" role="tab" aria-controls="${paneId}" aria-selected="${isActive}"${item.disabled ? ' disabled' : ''}>${escapeHtml(item.title)}</button>`;
    })
    .join('\n    ');

  const panesHtml = items
    .map((item, index) => {
      const isActive = index === activeIndex;
      const tabId = `${id}-tab-${index}`;
      const paneId = `${id}-pane-${index}`;
      const classes = ['tab-pane', 'fade', isActive && 'show', isActive && 'active'].filter(Boolean).join(' ');

      return `<div class="${classes}" id="${paneId}" role="tabpanel" aria-labelledby="${tabId}" tabindex="0">${escapeHtml(item.content)}</div>`;
    })
    .join('\n    ');

  const tablistHtml = `<div class="${navClasses}" id="${id}" role="tablist"${vertical ? ' aria-orientation="vertical"' : ''}>
    ${navHtml}
  </div>`;
  const contentHtml = `<div class="tab-content" id="${id}-content">
    ${panesHtml}
  </div>`;

  return vertical
    ? `<div class="d-flex align-items-start">
  ${tablistHtml}
  ${contentHtml}
</div>`
    : `<div>
  ${tablistHtml}
  ${contentHtml}
</div>`;
}
