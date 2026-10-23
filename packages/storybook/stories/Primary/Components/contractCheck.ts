import rows from '@contracts/dist/contracts.json';

// One design property from dist/contracts.json: a token, or the component's own value.
type Row = {
  contract: string;
  variant: string | null;
  part: string;
  kind: 'default' | 'state' | 'breakpoint';
  condition: string | null;
  property: string;
  token: string | null;
  value?: string;
};

// The CSS property each contract property is drawn with. Label properties are read
// from the element itself, since its text is the label.
const CSS: Record<string, string> = {
  fill: 'background-color',
  'border.color': 'border-top-color',
  'border.width': 'border-top-width',
  'border.radius': 'border-top-left-radius',
  'padding.y': 'padding-top',
  'padding.x': 'padding-left',
  gap: 'column-gap',
  'transition.duration': 'transition-duration',
  'transition.easing': 'transition-timing-function',
  color: 'color',
  'font.family': 'font-family',
  'font.size': 'font-size',
  'font.weight': 'font-weight',
  'letter-spacing': 'letter-spacing',
  'line-height': 'line-height',
  'ring.color': 'outline-color',
  'ring.width': 'outline-width',
  'ring.offset': 'outline-offset',
};

/**
 * What a contract sets for one combination of variant options: the anatomy's
 * rows, each replaced by the options' rows for the same part, state and property.
 */
export function contractRows(contract: string, options: string[]): Row[] {
  const byKey = new Map<string, Row>();
  for (const variant of [null, ...options]) {
    for (const row of rows as Row[]) {
      if (row.contract === contract && row.variant === variant) {
        byKey.set([row.part, row.kind, row.condition, row.property].join(' '), row);
      }
    }
  }
  return [...byKey.values()];
}

// The CSS a row expects: its token's variable, or the contract's own value.
const expression = (row: Row) => (row.token ? `var(--${row.token.replaceAll('.', '-')})` : (row.value ?? ''));

// Resolves a CSS value the way the browser computes it, so values compare as
// the browser draws them (#ab0520 and rgb(171, 5, 32) are the same color).
function computed(cssProperty: string, value: string) {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;border-style:solid;outline-style:solid';
  probe.style.setProperty(cssProperty, value);
  document.body.append(probe);
  const result = getComputedStyle(probe).getPropertyValue(cssProperty);
  probe.remove();
  return result;
}

/**
 * Compares a rendered element with what its contract says, and returns a line for
 * each property that differs. The default and focus-visible rows are read from the
 * element at rest and with keyboard focus. Hover can't be triggered from a script,
 * so hover rows are read from the hover colors the stylesheet gives the element
 * (--bs-btn-hover-*), which its :hover rule draws.
 */
export function checkContract(element: HTMLElement, contract: string, options: string[]): string[] {
  const mismatches: string[] = [];
  const name = [contract, ...options].join(' › ');
  const hoverVariable: Record<string, string> = {
    fill: '--bs-btn-hover-bg',
    'border.color': '--bs-btn-hover-border-color',
    color: '--bs-btn-hover-color',
  };

  const compare = (row: Row, actual: string) => {
    const cssProperty = CSS[row.property];
    const expected = computed(cssProperty, expression(row));
    const drawn = computed(cssProperty, actual);
    if (expected !== drawn) {
      const where = [row.part, row.condition].filter(Boolean).join(' › ');
      mismatches.push(`${name} › ${where} › ${row.property}: expected ${expected} (${row.token ?? row.value}), got ${drawn}`);
    }
  };

  const contractRowsFor = contractRows(contract, options).filter((row) => row.kind !== 'breakpoint');
  const missing = contractRowsFor.filter((row) => !CSS[row.property]);
  for (const row of missing) mismatches.push(`${name} › ${row.part} › ${row.property}: no CSS property to check it with`);

  const atRest = getComputedStyle(element);
  for (const row of contractRowsFor.filter((r) => r.kind === 'default' && CSS[r.property])) {
    compare(row, atRest.getPropertyValue(CSS[row.property]));
  }

  for (const row of contractRowsFor.filter((r) => r.condition === 'hover' && CSS[r.property])) {
    compare(row, atRest.getPropertyValue(hoverVariable[row.property] ?? CSS[row.property]));
  }

  const focusRows = contractRowsFor.filter((r) => r.condition === 'focus-visible' && CSS[r.property]);
  if (focusRows.length) {
    // Without the transition, the focus colors apply at once.
    element.style.transition = 'none';
    element.focus();
    if (!element.matches(':focus-visible')) {
      mismatches.push(`${name}: couldn't give it keyboard focus to check its focus-visible rows`);
    } else {
      const focused = getComputedStyle(element);
      for (const row of focusRows) compare(row, focused.getPropertyValue(CSS[row.property]));
    }
    element.blur();
    element.style.transition = '';
  }

  return mismatches;
}
