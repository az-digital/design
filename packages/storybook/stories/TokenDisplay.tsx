import { Token, type TokenData } from './Token';
import { TokenTable } from './TokenTable';

export type TokenDisplayItem = TokenData;

/**
 * A group of tokens that has no swatch design of its own: a wrapping row of
 * `Token` pills by default, or one table row per token with `layout="table"`.
 */
export function TokenDisplay({ items, layout = 'pills' }: { items: TokenDisplayItem[]; layout?: 'pills' | 'table' }) {
  if (layout === 'table') {
    return <div style={{ margin: '16px 0' }}><TokenTable items={items} /></div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '16px 0' }}>
      {items.map((item) => <Token key={item.token} data={item} swatch />)}
    </div>
  );
}
