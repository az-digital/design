import React, { useState } from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { ResizeHandle, TokenDetailsContent, useResizableWidth } from '../stories/Token';
import { getTokenData } from '../stories/tokenGraph';
import { TokenTable } from '../stories/TokenTable';
import { getTokenDisplayItems } from '../stories/resolveToken';

const ADDON_ID = 'az-digital/tokens';
const PANEL_ID = `${ADDON_ID}/panel`;

/**
 * `parameters.tokens` — which tokens.json groups a story uses, by dot-path
 * prefix (a trailing `*`/`**` is ignored, so `az.component.button.**` works
 * too). The Tokens tab is opt-in: it only appears on stories that set this,
 * on the story file's meta (covering every story in it) or on a single story.
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

  const prefixes = parameter && !isDisabled(parameter) ? [parameter as string | string[]].flat() : [];
  const items = prefixes.flatMap((prefix) => getTokenDisplayItems(prefix.replace(/\*+$/, '')));
  const selected = items.find((item) => item.token === selectedToken) ?? (selectedToken ? getTokenData(selectedToken) : undefined);

  if (items.length === 0) {
    return (
      <p style={{ margin: 0, padding: 16, color: '#697786', fontSize: 13 }}>
        No tokens in <code>tokens.json</code> match <code>{prefixes.join(', ')}</code>.
      </p>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? `minmax(0, 1fr) ${width}px` : '1fr', minHeight: '100%', background: '#fff', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ padding: '8px 4px', overflow: 'auto' }}>
        <TokenTable
          items={items}
          selectedToken={selectedToken}
          onSelect={(token) => setSelectedToken((current) => (current === token ? null : token))}
        />
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

export function registerTokensPanel() {
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
}
