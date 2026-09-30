import { getTokenDisplayItems, type TokenData } from './resolveToken';
import { useTokensData } from './store';
import { Token } from './Token';
import { TokenTable } from './TokenTable';

/**
 * A group of tokens that has no swatch design of its own: a wrapping row of
 * `Token` pills by default, or one table row per token with `layout="table"`.
 * Pass `prefix` (e.g. `az.color.semantic.`) to list every token under it, or
 * `items` for a list you've built yourself.
 */
export function TokenDisplay({ prefix, items, layout = 'pills' }: { prefix?: string; items?: TokenData[]; layout?: 'pills' | 'table' }) {
  useTokensData();
  const shown = items ?? (prefix !== undefined ? getTokenDisplayItems(prefix) : []);

  if (layout === 'table') {
    return <div style={{ margin: '16px 0' }}><TokenTable items={shown} /></div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '16px 0' }}>
      {shown.map((item) => <Token key={item.token} data={item} swatch />)}
    </div>
  );
}
