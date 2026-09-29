import { Token, type TokenData } from './Token';

export type TokenDisplayItem = TokenData;

/** A wrapping row of `Token` pills, for token groups that have no swatch design of their own. */
export function TokenDisplay({ items }: { items: TokenDisplayItem[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '16px 0' }}>
      {items.map((item) => <Token key={item.token} data={item} swatch />)}
    </div>
  );
}
