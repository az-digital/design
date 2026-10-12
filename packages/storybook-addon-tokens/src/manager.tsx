// Manager entry (added by the preset): registers the Tokens tab in Storybook's addon panel.
// Default React import: Storybook bundles manager entries with the classic JSX runtime.
import React, { useEffect, useState } from 'react';
import { addons, types, useChannel, useParameter } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { ADDON_ID, DATA_EVENT, PANEL_ID, REQUEST_EVENT } from './constants';
import { getTokenDisplayItems } from './resolveToken';
import { setTokensData, useTokensData, type TokensData } from './store';
import { ResizeHandle, TokenDetailsContent, useResizableWidth } from './Token';
import { TokenTable } from './TokenTable';

/**
 * `parameters.tokens` — which token groups a story uses, by dot-path prefix
 * (a trailing `*`/`**` is ignored, so `az.component.button.**` works too).
 * The Tokens tab is opt-in: it only appears on stories that set this, on the
 * story file's meta (covering every story in it) or on a single story.
 * `{ disable: true }` hides it again for one story, the same way Controls and
 * Actions are hidden. (Not `false`: Storybook's `getCurrentParameter` returns
 * `value || undefined`, so a falsy parameter never reaches the panel.)
 */
export type TokensParameter = string | string[] | { disable: true };

const isDisabled = (parameter: unknown) => typeof parameter === 'object' && parameter !== null && !Array.isArray(parameter) && (parameter as { disable?: boolean }).disable === true;

function TokensPanelContent() {
  const parameter = useParameter<TokensParameter | undefined>('tokens', undefined);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const { width, setWidth } = useResizableWidth('az-token-panel-details-width', 340, 240, () => window.innerWidth - 320);
  const data = useTokensData();

  // The token data lives in the preview; ask for it, and take every update it sends.
  const emit = useChannel({ [DATA_EVENT]: (next: TokensData) => setTokensData(next) });
  useEffect(() => {
    emit(REQUEST_EVENT);
  }, [emit]);

  const prefixes = parameter && !isDisabled(parameter) ? [parameter as string | string[]].flat() : [];
  const items = prefixes.flatMap((prefix) => getTokenDisplayItems(prefix));
  const selected = items.find((item) => item.token === selectedToken);

  useEffect(() => {
    if (selectedToken && !items.some((item) => item.token === selectedToken)) setSelectedToken(null);
  }, [items, selectedToken]);

  if (data.tokens.length === 0) {
    return <p style={{ margin: 0, padding: 16, color: '#697786', fontSize: 13 }}>Loading tokens…</p>;
  }
  if (items.length === 0) {
    return (
      <p style={{ margin: 0, padding: 16, color: '#697786', fontSize: 13 }}>
        No tokens match <code>{prefixes.join(', ')}</code>.
      </p>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? `minmax(0, 1fr) ${width}px` : '1fr', minHeight: '100%', background: '#fff', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ padding: '8px 4px', overflow: 'auto' }}>
        <TokenTable items={items} selectedToken={selectedToken} onSelect={(token) => setSelectedToken((current) => (current === token ? null : token))} />
      </div>
      {selected && (
        <div style={{ position: 'relative', minHeight: 0, display: 'flex' }}>
          <ResizeHandle width={width} onResize={setWidth} label="Resize token details" />
          <aside aria-label={`${selected.token} details`} style={{ flex: 1, minWidth: 0, padding: 16, borderLeft: '1px solid #e3e6eb', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingBottom: 12, marginBottom: 16, borderBottom: '1px solid #e3e6eb' }}>
              <strong style={{ fontSize: 16, overflowWrap: 'anywhere' }}>{selected.token}</strong>
              <button type="button" onClick={() => setSelectedToken(null)} aria-label="Close token details" style={{ width: 24, height: 24, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
            </div>
            <TokenDetailsContent data={selected} onNavigate={setSelectedToken} />
          </aside>
        </div>
      )}
    </div>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Tokens',
    // Opt-in: only stories that declare `parameters.tokens` get the tab.
    disabled: (parameters) => {
      const tokens = (parameters as { tokens?: unknown } | undefined)?.tokens;
      return !tokens || isDisabled(tokens);
    },
    render: ({ active }) => (
      <AddonPanel active={Boolean(active)}>
        <TokensPanelContent />
      </AddonPanel>
    ),
  });
});
