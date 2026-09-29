import React, { useState } from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';
import { TokenDetailsContent } from '../stories/Token';
import { TokenTable } from '../stories/TokenTable';
import { getTokenDisplayItems } from '../stories/resolveToken';

const ADDON_ID = 'az-digital/tokens';
const PANEL_ID = `${ADDON_ID}/panel`;

/**
 * `parameters.tokens` — which tokens.json groups a story uses, by dot-path
 * prefix (a trailing `*`/`**` is ignored, so `az.component.button.**` works
 * too). Set it on a story file's meta to cover every story in it, or on a
 * single story to override; `false` hides the list for that story.
 */
export type TokensParameter = string | string[] | false;

function TokensPanelContent() {
  const parameter = useParameter<TokensParameter>('tokens', false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const prefixes = parameter === false ? [] : [parameter].flat();
  const items = prefixes.flatMap((prefix) => getTokenDisplayItems(prefix.replace(/\*+$/, '')));
  const selected = items.find((item) => item.token === selectedToken);

  if (items.length === 0) {
    return (
      <p style={{ margin: 0, padding: 16, color: '#697786', fontSize: 13 }}>
        {prefixes.length === 0
          ? <>This story doesn't declare any tokens. Add <code>parameters.tokens</code> (e.g. <code>'az.component.button.'</code>) to its meta or story.</>
          : <>No tokens in <code>tokens.json</code> match <code>{prefixes.join(', ')}</code>.</>}
      </p>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? 'minmax(0, 1fr) minmax(240px, 340px)' : '1fr', minHeight: '100%', background: '#fff', color: '#1f2430', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <div style={{ padding: '8px 4px', overflow: 'auto' }}>
        <TokenTable
          items={items}
          selectedToken={selectedToken}
          onSelect={(token) => setSelectedToken((current) => (current === token ? null : token))}
        />
      </div>
      {selected && (
        <aside aria-label={`${selected.token} details`} style={{ padding: 16, borderLeft: '1px solid #e3e6eb', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingBottom: 12, marginBottom: 16, borderBottom: '1px solid #e3e6eb' }}>
            <strong style={{ fontSize: 16, overflowWrap: 'anywhere' }}>{selected.token}</strong>
            <button type="button" onClick={() => setSelectedToken(null)} aria-label="Close token details" style={{ width: 24, height: 24, border: '1px solid #d0d5dd', borderRadius: 5, background: '#fff', color: '#374151', cursor: 'pointer' }}>×</button>
          </div>
          <TokenDetailsContent data={selected} />
        </aside>
      )}
    </div>
  );
}

export function registerTokensPanel() {
  addons.register(ADDON_ID, () => {
    addons.add(PANEL_ID, {
      type: types.PANEL,
      title: 'Tokens',
      render: ({ active }) => (
        <AddonPanel active={Boolean(active)}>
          <TokensPanelContent />
        </AddonPanel>
      ),
    });
  });
}
