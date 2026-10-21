import { Token, getTokenData } from '@az-digital/storybook-addon-tokens';
import rows from '@contracts/dist/contracts.json';

type Row = { contract: string; part: string; kind: 'default' | 'state' | 'breakpoint'; condition: string | null; property: string; token: string };

const BREAKPOINTS: Record<string, number> = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };
const title = (text: string) => text.replace(/(^|[-.])(\w)/g, (_m, sep: string, letter: string) => `${sep ? ' ' : ''}${letter.toUpperCase()}`);
const when = (row: Row) => (row.kind === 'breakpoint' ? `From ${BREAKPOINTS[row.condition ?? ''] ?? row.condition}px` : row.kind === 'state' ? title(row.condition ?? '') : 'Default');

const CELL = { padding: '6px 12px', borderBottom: '1px solid #eef1f4', textAlign: 'left' as const, verticalAlign: 'top' as const, fontSize: 13 };

/**
 * A component's anatomy, from its contract (packages/contracts): each part's
 * design properties and the token that sets each one.
 */
export function ContractAnatomy({ contract }: { contract: string }) {
  const items = (rows as Row[]).filter((row) => row.contract === contract);
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Part', 'When', 'Property', 'Token'].map((heading) => (
            <th key={heading} style={{ ...CELL, fontSize: 12, color: '#56657a' }}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((row, index) => {
          const data = getTokenData(row.token);
          const firstOfPart = index === 0 || items[index - 1].part !== row.part;
          return (
            <tr key={`${row.part}-${row.condition}-${row.property}`}>
              <td style={{ ...CELL, fontWeight: 700 }}>{firstOfPart ? title(row.part) : ''}</td>
              <td style={CELL}>{when(row)}</td>
              <td style={CELL}>
                <code>{row.property}</code>
              </td>
              <td style={CELL}>{data ? <Token data={data} /> : <code>{row.token}</code>}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
