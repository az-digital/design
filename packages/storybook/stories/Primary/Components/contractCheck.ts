import rows from '@contracts/dist/contracts.json';

// Each contract's variant defaults, such as the button's color default (red), by contract id.
const defaults = Object.fromEntries(
  Object.values(
    import.meta.glob<{ id: string; variants?: Record<string, { default?: string }> }>(
      '../../../../contracts/contracts/*.contract.json',
      { eager: true, import: 'default' },
    ),
  ).map((contract) => [
    contract.id,
    Object.entries(contract.variants ?? {}).flatMap(([axis, { default: option }]) => (option ? [[axis, option]] : [])),
  ]),
);

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

// A property drawn on several sides is checked on each of them, so uneven padding
// or one odd corner doesn't pass because the first side matches.
const SIDES: Record<string, string[]> = {
  'border.color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'border.width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  'border.radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  'padding.y': ['padding-top', 'padding-bottom'],
  'padding.x': ['padding-left', 'padding-right'],
};

/**
 * What a contract sets for one combination of variant options: the anatomy's
 * rows, each replaced by the options' rows for the same part, state and property.
 * An axis with a default that the options leave out takes its default, so a
 * button with no color option is checked as Red.
 */
export function contractRows(contract: string, options: string[]): Row[] {
  const chosen = [
    ...(defaults[contract] ?? [])
      .filter(([axis]) => !options.some((option) => option.startsWith(`${axis}.`)))
      .map(([axis, option]) => `${axis}.${option}`),
    ...options,
  ];
  const byKey = new Map<string, Row>();
  for (const variant of [null, ...chosen]) {
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

// Splits a computed list on its top-level commas, leaving the commas inside
// cubic-bezier(…) alone.
const list = (value: string) => value.split(/,(?![^(]*\))/).map((item) => item.trim());

// The cubic-bezier each easing keyword stands for, so ease-in-out and
// cubic-bezier(0.42, 0, 0.58, 1) compare as the same curve.
const EASINGS: Record<string, string> = {
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  'ease-in': 'cubic-bezier(0.42, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.58, 1)',
  'ease-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
};

/**
 * Puts a computed value in a form that compares the way it's drawn:
 * - a transition list whose entries are all the same counts as one entry, since
 *   Bootstrap transitions several properties with the same timing;
 * - an easing keyword becomes its cubic-bezier;
 * - a font stack is its first face, since the fallbacks after it are the
 *   implementation's choice.
 */
function normalize(cssProperty: string, value: string) {
  if (cssProperty === 'font-family') return list(value)[0].replace(/^["']|["']$/g, '').toLowerCase();
  if (cssProperty === 'transition-duration' || cssProperty === 'transition-timing-function') {
    const entries = list(value).map((entry) => EASINGS[entry] ?? entry);
    return entries.every((entry) => entry === entries[0]) ? entries[0] : entries.join(', ');
  }
  return value;
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

  // Compares a row with the value read for each CSS property it's drawn with.
  const compare = (row: Row, read: (cssProperty: string) => string, cssProperties = SIDES[row.property] ?? [CSS[row.property]]) => {
    for (const cssProperty of cssProperties) {
      const expected = normalize(cssProperty, computed(cssProperty, expression(row)));
      const drawn = normalize(cssProperty, computed(cssProperty, read(cssProperty)));
      if (expected !== drawn) {
        const where = [row.part, row.condition].filter(Boolean).join(' › ');
        const side = cssProperties.length > 1 ? ` (${cssProperty})` : '';
        mismatches.push(`${name} › ${where} › ${row.property}${side}: expected ${expected} (${row.token ?? row.value}), got ${drawn}`);
      }
    }
  };

  const contractRowsFor = contractRows(contract, options).filter((row) => row.kind !== 'breakpoint');
  const missing = contractRowsFor.filter((row) => !CSS[row.property]);
  for (const row of missing) mismatches.push(`${name} › ${row.part} › ${row.property}: no CSS property to check it with`);

  const atRest = getComputedStyle(element);
  for (const row of contractRowsFor.filter((r) => r.kind === 'default' && CSS[r.property])) {
    compare(row, (cssProperty) => atRest.getPropertyValue(cssProperty));
  }

  for (const row of contractRowsFor.filter((r) => r.condition === 'hover' && CSS[r.property])) {
    // One hover color covers every side, so it's read once.
    compare(row, () => atRest.getPropertyValue(hoverVariable[row.property] ?? CSS[row.property]), [CSS[row.property]]);
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
      for (const row of focusRows) compare(row, (cssProperty) => focused.getPropertyValue(cssProperty));
    }
    element.blur();
    element.style.transition = '';
  }

  return mismatches;
}
