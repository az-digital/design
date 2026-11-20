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
  'padding.bottom': 'padding-bottom',
  'padding.left': 'padding-left',
  'padding.right': 'padding-right',
  // Read by gapOf: the space between items, along whichever axis they're laid out on.
  gap: 'row-gap',
  // A gradient's color is its last color stop, read by lastColor.
  'gradient.color': 'color',
  // A height that's a share of the image, read by compareShare.
  height: 'height',
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
  'margin-top': 'margin-top',
  'margin-bottom': 'margin-bottom',
  'margin.top': 'margin-top',
  'margin.bottom': 'margin-bottom',
  'min-height': 'min-height',
  width: 'width',
  opacity: 'opacity',
  // A form field's placeholder, read from its ::placeholder.
  'placeholder.color': 'color',
  // An icon's size is its drawn height, whether it's an icon font glyph or an SVG.
  size: 'height',
  scale: 'transform',
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

// A color's opacity, recorded beside it as its own row (color.opacity,
// placeholder.opacity, ring.opacity): it's checked as part of that color.
const OPACITY_OF: Record<string, string> = {
  color: 'color.opacity',
  'placeholder.color': 'placeholder.opacity',
  'ring.color': 'ring.opacity',
};
const isOpacityRow = (row: Row) => Object.values(OPACITY_OF).includes(row.property);

// Gives a computed rgb() color an alpha: rgb(33, 37, 41) at 0.75 is
// rgba(33, 37, 41, 0.75).
function withAlpha(color: string, alpha: number) {
  const channels = color.match(/rgba?\(([^)]*)\)/)?.[1].split(',').map((channel) => channel.trim());
  if (!channels || alpha >= 1) return color;
  return `rgba(${channels.slice(0, 3).join(', ')}, ${Number((alpha * (channels[3] ? Number(channels[3]) : 1)).toFixed(4))})`;
}

// The CSS a row expects: its token's variable, or the contract's own value.
function expression(row: Row) {
  const value = row.token ? `var(--${row.token.replaceAll('.', '-')})` : (row.value ?? '');
  return row.property === 'scale' ? `scale(${value})` : value;
}

// Resolves a CSS value the way the browser computes it, so values compare as
// the browser draws them (#ab0520 and rgb(171, 5, 32) are the same color). It's
// resolved inside `within`, so a value can use that element's custom properties.
function computed(cssProperty: string, value: string, within: Element = document.body, fontSize?: string) {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;border-style:solid;outline-style:solid';
  // A unitless line height computes against the drawn element's text size.
  if (fontSize) probe.style.fontSize = fontSize;
  probe.style.setProperty(cssProperty, value);
  within.append(probe);
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

// Two computed values match if they're equal, or lengths less than 0.01px apart: a
// 28px line height drawn as 18px × 1.5556 computes to 28.0008px.
function same(expected: string, drawn: string) {
  const length = /^-?[\d.]+px$/;
  return expected === drawn || (length.test(expected) && length.test(drawn) && Math.abs(parseFloat(expected) - parseFloat(drawn)) < 0.01);
}

// The space between items. On a flex or grid container, its gap along the main
// axis; on one item of a list, such as a link in a list of links, the space drawn
// between it (or the list item it's in) and the next one. Null when there's no next
// item to measure against.
function gapOf(element: HTMLElement, root: HTMLElement): string | null {
  const style = getComputedStyle(element);
  if (/flex|grid/.test(style.display)) return style.flexDirection.startsWith('column') ? style.rowGap : style.columnGap;
  let item: Element = element;
  while (!item.nextElementSibling && item !== root && item.parentElement) item = item.parentElement;
  const next = item.nextElementSibling;
  if (!next || item === root) return null;
  const drawn = item.getBoundingClientRect();
  const after = next.getBoundingClientRect();
  return `${after.top >= drawn.bottom ? after.top - drawn.bottom : after.left - drawn.right}px`;
}

// A gradient's last color stop, as drawn: linear-gradient(…, rgb(12, 35, 75)) gives
// rgb(12, 35, 75).
function lastColor(backgroundImage: string) {
  const colors = backgroundImage.match(/rgba?\([^)]*\)/g);
  return colors ? colors[colors.length - 1] : 'none';
}

// Reads a focus ring's outline property. A ring drawn as a box-shadow instead
// (0 0 <blur> <width> <color>, as Arizona Bootstrap draws a link's) is read from
// the shadow: its spread is the width, and it has no offset.
function ring(style: CSSStyleDeclaration, cssProperty: string) {
  if (style.outlineStyle !== 'none') return style.getPropertyValue(cssProperty);
  const shadow = style.boxShadow.match(/^(rgba?\([^)]*\)) 0px 0px \S+ (\S+)$/);
  if (cssProperty === 'outline-color') return shadow ? shadow[1] : style.getPropertyValue(cssProperty);
  if (cssProperty === 'outline-width') return shadow ? shadow[2] : '0px';
  return '0px';
}

/**
 * The rendered component a check reads:
 * - `parts`: the element for each part the check covers, by the contract's part
 *   name, with `root` for the component itself. Rows for other parts aren't checked.
 * - `focus`: the element that gets keyboard focus for the focus-visible rows, such
 *   as a card's title link. The root by default.
 * - `hover`: where hover rows are read, since hover can't be triggered from a
 *   script. Either the CSS each `<part> <property>` row's hover value is drawn
 *   from, resolved inside the root (`var(--bs-btn-hover-bg)`), or `'focus-visible'`
 *   for an implementation that draws hover and keyboard focus with one rule.
 * - `sizeAsFontSize`: parts whose `size` is their font size, such as a font icon.
 * - `control`: the form control whose checked, indeterminate and disabled states
 *   are set to check those rows, such as a checkbox's input. The focus element by
 *   default.
 * - `skip`: `<part> <property>` rows the implementation draws in a way the check
 *   can't read as one value, such as an input group's corners, which are square
 *   where its parts meet.
 */
export type ContractTarget = {
  parts: { root: HTMLElement } & Record<string, HTMLElement>;
  focus?: HTMLElement;
  hover?: Record<string, string> | 'focus-visible';
  sizeAsFontSize?: string[];
  control?: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  skip?: string[];
};

// A button's hover colors: the --bs-btn-hover-* variables its :hover rule draws.
const BUTTON_HOVER: Record<string, string> = {
  'root fill': 'var(--bs-btn-hover-bg)',
  'root border.color': 'var(--bs-btn-hover-border-color)',
  'root color': 'var(--bs-btn-hover-color)',
};

/**
 * Compares a rendered component with what its contract says, and returns a line for
 * each property that differs. Pass an element to check a one-part component such as
 * a button, or a ContractTarget for one with parts. The default rows are read at
 * rest, and the focus-visible rows with keyboard focus; a focus ring is read from the
 * element with focus. Hover rows are read as ContractTarget's `hover` says.
 */
export function checkContract(target: HTMLElement | ContractTarget, contract: string, options: string[] = []): string[] {
  const { parts, focus = parts.root, hover = BUTTON_HOVER, sizeAsFontSize = [], control, skip = [] } = target instanceof HTMLElement ? { parts: { root: target } } : target;
  const mismatches: string[] = [];
  const name = [contract, ...options].join(' › ');

  // Compares a row with the value read for each CSS property it's drawn with.
  const compare = (row: Row, read: (cssProperty: string) => string, cssProperties?: string[]) => {
    const element = parts[row.part];
    const fontSize = element ? getComputedStyle(element).fontSize : undefined;
    const opacity = contractRowsFor.find((r) => r.part === row.part && r.condition === row.condition && r.property === OPACITY_OF[row.property]);
    const properties = cssProperties ?? (row.property === 'size'
      ? sizeAsFontSize.includes(row.part) ? ['font-size'] : ['width', 'height']
      : SIDES[row.property] ?? [CSS[row.property]]);
    for (const cssProperty of properties) {
      let expected = normalize(cssProperty, computed(cssProperty, expression(row), document.body, fontSize));
      if (opacity) expected = withAlpha(expected, Number(computed('opacity', expression(opacity))));
      const drawn = normalize(cssProperty, computed(cssProperty, read(cssProperty), document.body, fontSize));
      // A fully round corner (az.radius.pill) is any radius of at least half the
      // part's shorter side, such as a radio's 50% or a switch's 36px.
      if (row.token === 'az.radius.pill' && element) {
        const { width, height } = element.getBoundingClientRect();
        if (drawn.endsWith('%') ? parseFloat(drawn) >= 50 : parseFloat(drawn) >= Math.min(width, height) / 2) continue;
      }
      if (!same(expected, drawn)) {
        const where = [row.part, row.condition].filter(Boolean).join(' › ');
        const side = properties.length > 1 ? ` (${cssProperty})` : '';
        mismatches.push(`${name} › ${where} › ${row.property}${side}: expected ${expected} (${row.token ?? row.value}), got ${drawn}`);
      }
    }
  };

  // A shape is checked as the ratio of the part's drawn width to its height.
  const compareShape = (row: Row, element: HTMLElement) => {
    const height = contractRowsFor.find((r) => r.part === row.part && r.condition === row.condition && r.property === 'aspect-ratio.height');
    const expected = Number(row.value) / Number(height?.value);
    const { width, height: drawnHeight } = element.getBoundingClientRect();
    if (Math.abs(width / drawnHeight - expected) > 0.01) {
      mismatches.push(`${name} › ${row.part} › aspect-ratio: expected ${row.value}:${height?.value}, got ${Math.round(width)}×${Math.round(drawnHeight)}`);
    }
  };

  // A height given as a share of the image (or of the component, if it has none),
  // such as a title gradient over the bottom half of a photo.
  const compareShare = (row: Row, element: HTMLElement) => {
    const whole = (parts.image ?? parts.root).getBoundingClientRect().height;
    const share = (element.getBoundingClientRect().height / whole) * 100;
    if (Math.abs(share - Number(row.value)) > 0.5) {
      mismatches.push(`${name} › ${row.part} › height: expected ${row.value}% of the image, got ${share.toFixed(1)}%`);
    }
  };

  // Active (pressed) rows aren't checked: a script can't press an element.
  const contractRowsFor = contractRows(contract, options).filter(
    (row) => row.kind !== 'breakpoint' && parts[row.part] && row.condition !== 'active' && !skip.includes(`${row.part} ${row.property}`),
  );
  const isShape = (row: Row) => row.property.startsWith('aspect-ratio.');
  for (const row of contractRowsFor.filter((r) => !CSS[r.property] && !isShape(r) && !isOpacityRow(r))) {
    mismatches.push(`${name} › ${row.part} › ${row.property}: no CSS property to check it with`);
  }
  const checkable = (row: Row) => CSS[row.property] && !isOpacityRow(row) && (row.condition !== 'focus-visible' || !row.property.startsWith('ring.') || parts[row.part].contains(focus));

  // Sets a form control's state without its transitions, so its colors change at
  // once instead of fading in while they're read.
  const everything = [parts.root, ...parts.root.querySelectorAll<HTMLElement>('*')];
  const setState = (input: HTMLInputElement, state: Partial<Pick<HTMLInputElement, 'checked' | 'indeterminate' | 'disabled'>>) => {
    for (const element of everything) element.style.transition = 'none';
    Object.assign(input, state);
    for (const element of everything) void getComputedStyle(element).color;
    for (const element of everything) element.style.transition = '';
  };

  // A form control is checked from its resting state, unchecked and enabled, as its
  // contract's anatomy describes it, whatever the story shows. It's put back at the end.
  const input = (control ?? null) as HTMLInputElement | null;
  const shown = input && { checked: input.checked, indeterminate: input.indeterminate, disabled: input.disabled };
  const resting = { checked: false, indeterminate: false, disabled: false };
  if (input) setState(input, resting);

  for (const row of contractRowsFor.filter((r) => r.kind === 'default')) {
    const element = parts[row.part];
    // A margin is the space between a part and the one beside it, so it's checked
    // only where there is one: a last paragraph's bottom margin is 0.
    if (row.property === 'margin-bottom' && !element.nextElementSibling) continue;
    if (row.property === 'margin-top' && !element.previousElementSibling) continue;
    if (row.property === 'aspect-ratio.width') compareShape(row, element);
    else if (row.property === 'height' && !row.value?.endsWith('px')) compareShare(row, element);
    else if (row.property.startsWith('placeholder.')) {
      if (CSS[row.property]) compare(row, (cssProperty) => getComputedStyle(element, '::placeholder').getPropertyValue(cssProperty));
    }
    else if (row.property === 'gradient.color') compare(row, () => lastColor(getComputedStyle(element).backgroundImage), ['color']);
    else if (row.property === 'gap') {
      const space = gapOf(element, parts.root);
      if (space !== null) compare(row, () => space, ['row-gap']);
    } else if (CSS[row.property]) compare(row, (cssProperty) => getComputedStyle(element).getPropertyValue(cssProperty));
  }

  if (hover !== 'focus-visible') {
    for (const row of contractRowsFor.filter((r) => r.condition === 'hover' && CSS[r.property])) {
      // One hover color covers every side, so it's read once.
      const drawnFrom = hover[`${row.part} ${row.property}`];
      const read = (cssProperty: string) => (drawnFrom ? computed(cssProperty, drawnFrom, parts.root) : getComputedStyle(parts[row.part]).getPropertyValue(cssProperty));
      compare(row, read, [CSS[row.property]]);
    }
  }

  const focusRows = contractRowsFor.filter(
    (r) => (r.condition === 'focus-visible' || (r.condition === 'hover' && hover === 'focus-visible')) && checkable(r),
  );
  if (focusRows.length) {
    // Without transitions, the focus colors apply at once.
    const faded = [parts.root, ...parts.root.querySelectorAll<HTMLElement>('*')];
    for (const element of faded) element.style.transition = 'none';
    focus.focus();
    if (!focus.matches(':focus-visible')) {
      mismatches.push(`${name}: couldn't give it keyboard focus to check its focus-visible rows`);
    } else {
      for (const row of focusRows) {
        // A focus ring is drawn on the element with focus.
        const isRing = row.property.startsWith('ring.');
        const style = getComputedStyle(isRing ? focus : parts[row.part]);
        compare(row, (cssProperty) => (isRing ? ring(style, cssProperty) : style.getPropertyValue(cssProperty)));
      }
    }
    focus.blur();
    for (const element of faded) element.style.transition = '';
  }

  // Checked, indeterminate and disabled rows are read with the control set to that
  // state, then back at rest.
  const STATES: Record<string, Partial<HTMLInputElement>> = {
    checked: { checked: true },
    indeterminate: { indeterminate: true },
    disabled: { disabled: true },
  };
  const stateControl = (control ?? focus) as HTMLInputElement;
  for (const [state, set] of Object.entries(STATES)) {
    const stateRows = contractRowsFor.filter((r) => r.condition === state && CSS[r.property] && !isOpacityRow(r));
    if (!stateRows.length) continue;
    setState(stateControl, { ...resting, ...set });
    for (const row of stateRows) {
      const style = getComputedStyle(parts[row.part]);
      compare(row, (cssProperty) => style.getPropertyValue(cssProperty));
    }
    setState(stateControl, resting);
  }

  if (input && shown) setState(input, shown);
  return mismatches;
}
