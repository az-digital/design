// The design contract testing library's browser core. It compares a rendered component's
// computed styles with what its contract says, and reports every row as passed,
// failed, unsupported, unmapped, blocked or skipped: nothing is dropped, so a
// test that couldn't look at something can't pass by saying nothing.
//
// This file has no imports and touches the DOM only when a test runs, so a test
// runner can inject it into a page as it is (see playwright.js) and Storybook can
// import it. It needs no Storybook, Vite or Bootstrap: the contract rows, the
// token CSS and the way pointer states are driven all come from the caller.

/** Every code a finding can have. Codes are stable: tools and docs refer to them. */
export const CODES = {
  'value-mismatch': 'AZC001',
  'shape-mismatch': 'AZC002',
  'unsupported-property': 'AZC003',
  'unsupported-state': 'AZC004',
  'no-driver': 'AZC005',
  'unmapped-part': 'AZC006',
  'state-unreachable': 'AZC007',
  'missing-data': 'AZC008',
};

// The CSS property each contract property is drawn with. Label properties are read
// from the element itself, since its text is the label.
const CSS = {
  fill: 'background-color',
  'border.color': 'border-top-color',
  'border.width': 'border-top-width',
  'border.radius': 'border-top-left-radius',
  'padding.y': 'padding-top',
  'padding.x': 'padding-left',
  'padding.bottom': 'padding-bottom',
  width: 'width',
  height: 'height',
  'min-width': 'min-width',
  'min-height': 'min-height',
  // Read by gapOf: the space between items, along whichever axis they're laid out on.
  gap: 'row-gap',
  // A gradient's color is its last color stop, read by lastColor.
  'gradient.color': 'color',
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
  'margin-left': 'margin-left',
  'margin-right': 'margin-right',
  // An icon's size is its drawn height, whether it's an icon font glyph or an SVG.
  size: 'height',
  scale: 'transform',
};

// A property drawn on several sides is checked on each of them, so uneven padding
// or one odd corner doesn't pass because the first side matches.
const SIDES = {
  'border.color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
  'border.width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
  'border.radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  'padding.y': ['padding-top', 'padding-bottom'],
  'padding.x': ['padding-left', 'padding-right'],
};

// The states a test can put a component in.
const STATES = ['hover', 'focus-visible', 'active'];

const FAILING = ['failed', 'unsupported', 'unmapped', 'blocked'];

/**
 * What a contract sets for one combination of variant options: the anatomy's
 * rows, each replaced by the options' rows for the same part, state and property.
 * An axis with a default that the options leave out takes its default, so a
 * button with no color option is checked as Red.
 */
export function contractRows({ rows, defaults = {} }, contract, options = []) {
  const chosen = [
    ...Object.entries(defaults[contract] ?? {})
      .filter(([axis]) => !options.some((option) => option.startsWith(`${axis}.`)))
      .map(([axis, option]) => `${axis}.${option}`),
    ...options,
  ];
  const byKey = new Map();
  for (const variant of [null, ...chosen]) {
    for (const row of rows) {
      if (row.contract === contract && row.variant === variant) {
        byKey.set([row.part, row.kind, row.condition, row.property].join(' '), row);
      }
    }
  }
  return [...byKey.values()];
}

function stripCssComments(css) {
  const chunks = [];
  let cursor = 0;
  while (true) {
    const start = css.indexOf('/*', cursor);
    if (start === -1) break;
    const end = css.indexOf('*/', start + 2);
    if (end === -1) break;
    chunks.push(css.slice(cursor, start));
    cursor = end + 2;
  }
  chunks.push(css.slice(cursor));
  return chunks.join('');
}

/** The custom properties in a token stylesheet (`@az-digital/tokens/dist/tokens.css`), by name. */
export function parseTokenCss(css) {
  const properties = {};
  for (const [, name, value] of stripCssComments(css).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    properties[name] = value.trim();
  }
  return properties;
}

const tokenVariable = (token) => `--${token.replaceAll('.', '-')}`;

// The CSS a row expects: its token's variable, or the contract's own value.
function expression(row) {
  const value = row.token ? `var(${tokenVariable(row.token)})` : (row.value ?? '');
  return row.property === 'scale' ? `scale(${value})` : value;
}

// Splits a computed list on its top-level commas, leaving the commas inside
// cubic-bezier(…) alone.
const list = (value) => value.split(/,(?![^(]*\))/).map((item) => item.trim());

// The cubic-bezier each easing keyword stands for, so ease-in-out and
// cubic-bezier(0.42, 0, 0.58, 1) compare as the same curve.
const EASINGS = {
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
function normalize(cssProperty, value) {
  if (cssProperty === 'font-family') return list(value)[0].replace(/^["']|["']$/g, '').toLowerCase();
  if (cssProperty === 'transition-duration' || cssProperty === 'transition-timing-function') {
    const entries = list(value).map((entry) => EASINGS[entry] ?? entry);
    return entries.every((entry) => entry === entries[0]) ? entries[0] : entries.join(', ');
  }
  return value;
}

// Two computed values match if they're equal, or lengths less than 0.01px apart: a
// 28px line height drawn as 18px × 1.5556 computes to 28.0008px.
function same(expected, drawn) {
  const length = /^-?[\d.]+px$/;
  return expected === drawn || (length.test(expected) && length.test(drawn) && Math.abs(parseFloat(expected) - parseFloat(drawn)) < 0.01);
}

// The space between items. On a flex or grid container, its gap along the main
// axis; on one item of a list, such as a link in a list of links, the space drawn
// between it (or the list item it's in) and the next one. Null when there's no next
// item to measure against.
function gapOf(element, root) {
  const style = getComputedStyle(element);
  if (/flex|grid/.test(style.display)) {
    // A container holding one item, such as a button with only a label, has nothing to space.
    const items = [...element.childNodes].filter((node) => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
    if (items.length < 2) return null;
    return style.flexDirection.startsWith('column') ? style.rowGap : style.columnGap;
  }
  let item = element;
  while (!item.nextElementSibling && item !== root && item.parentElement) item = item.parentElement;
  const next = item.nextElementSibling;
  if (!next || item === root) return null;
  const drawn = item.getBoundingClientRect();
  const after = next.getBoundingClientRect();
  return `${after.top >= drawn.bottom ? after.top - drawn.bottom : after.left - drawn.right}px`;
}

// A gradient's last color stop, as drawn: linear-gradient(…, rgb(12, 35, 75)) gives
// rgb(12, 35, 75).
function lastColor(backgroundImage) {
  const colors = backgroundImage.match(/rgba?\([^)]*\)/g);
  return colors ? colors[colors.length - 1] : 'none';
}

// Reads a focus ring's outline property. A ring drawn as a box-shadow instead
// (0 0 <blur> <width> <color>, as Arizona Bootstrap draws a link's) is read from
// the shadow: its spread is the width, and it has no offset.
function ring(style, cssProperty) {
  if (style.outlineStyle !== 'none') return style.getPropertyValue(cssProperty);
  const shadow = style.boxShadow.match(/^(rgba?\([^)]*\)) 0px 0px \S+ (\S+)$/);
  if (cssProperty === 'outline-color') return shadow ? shadow[1] : style.getPropertyValue(cssProperty);
  if (cssProperty === 'outline-width') return shadow ? shadow[2] : '0px';
  return '0px';
}

// Waits for the browser to apply a state change before styles are read.
const settle = () =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, 100);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        clearTimeout(timer);
        resolve();
      }),
    );
  });

const firstLine = (error) => (error instanceof Error ? error.message : String(error)).split('\n')[0];

/**
 * Compares a rendered component with its contract.
 *
 * @param {object} input
 * @param {{ rows: object[], defaults?: Record<string, Record<string, string>>, variants?: Record<string, Record<string, string[]>> }} input.data
 *   The contract rows (`@az-digital/contracts/dist/contracts.json`) and each
 *   contract's variant defaults (`dist/manifest.json`).
 * @param {string} input.contract The contract's id, such as `button`.
 * @param {string[]} [input.options] The variant options the component is rendered
 *   with, such as `['color.red', 'size.small']`.
 * @param {object} input.target The rendered component: `parts` (the element for
 *   each contract part, `root` for the component itself, the same element for parts
 *   that share one), and optionally `focus` (the element that takes keyboard
 *   focus), `hover` (the element to point at) and `press` (the element to press).
 *   These default to the root.
 * @param {object} [input.driver] Puts the component in pointer and viewport states
 *   with a real browser: `hover`, `unhover`, `press`, `release`, `setViewport`,
 *   `restoreViewport` and `keyboardFocus` (all optional; what's missing is
 *   reported as unsupported).
 * @param {string | Record<string, string>} [input.tokens] The token outputs the
 *   contract's tokens resolve against: `tokens.css` text or its custom properties.
 *   Without it, they resolve against the page's own, so the page must load them.
 *   With it, the implementation's own custom properties never decide what's expected.
 * @param {string[]} [input.optionalParts] Parts the implementation may leave out,
 *   which are skipped when unmapped instead of reported.
 * @param {{ part?: string, condition?: string, property?: string, reason: string }[]} [input.skip]
 *   Rows deliberately not checked yet, each with the reason.
 * @param {{ name?: string, file?: string }} [input.implementation] Named in each
 *   finding's action.
 * @param {string} [input.contractFile] Named in each finding's action.
 */
export async function testDesignContract(input) {
  const { data, contract, options = [], target, driver, tokens, optionalParts = [], skip = [], implementation = {} } = input;
  const contractFile = input.contractFile ?? `@az-digital/contracts/contracts/${contract}.contract.json`;
  const { parts } = target;
  const focus = target.focus ?? parts.root;
  const hover = target.hover ?? parts.root;
  const press = target.press ?? parts.root;
  const name = [contract, ...options].join(' › ');
  const entries = [];

  const fixIn = `the implementation${implementation.name ? ` (${implementation.name})` : ''}${implementation.file ? `: ${implementation.file}` : ''}`;
  const label = (entry) => [entry.part, entry.condition, entry.property].filter(Boolean).join(' › ');
  const add = (status, code, entry, message, action) => {
    entries.push({ status, code: code ? CODES[code] : null, name: code, contract, options, ...entry, message: `${name} › ${message}`, action });
  };

  const axes = new Set();
  for (const option of options) {
    const [axis, value, ...extra] = option.split('.');
    const valid = data.variants?.[contract]
      ? data.variants[contract][axis]?.includes(value)
      : data.rows.some((row) => row.contract === contract && row.variant === option);
    if (!axis || !value || extra.length || !valid || axes.has(axis)) {
      add('failed', 'missing-data', { part: null, condition: null, property: null },
        `invalid or repeated variant option ${option}`,
        `Choose one defined option per axis for ${contract} in ${contractFile}.`);
    }
    axes.add(axis);
  }
  if (entries.length) return finish();

  const selected = contractRows(data, contract, options);
  if (!selected.length) {
    add(
      'failed',
      'missing-data',
      { part: null, condition: null, property: null },
      'no rows for this contract and these options',
      `Check the contract id and options. Contracts in this data: ${[...new Set(data.rows.map((row) => row.contract))].join(', ')}.`,
    );
    return finish();
  }

  // An isolated document prevents the page's custom properties and stylesheet
  // rules from changing the expected values supplied by the test.
  const frame = document.createElement('iframe');
  frame.setAttribute('data-az-contract-scope', '');
  frame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;pointer-events:none';
  document.body.append(frame);
  const document_ = frame.contentDocument;
  const scope = document_.createElement('div');
  document_.body.append(scope);
  let properties = typeof tokens === 'string' ? parseTokenCss(tokens) : tokens;
  if (!properties) {
    const style = getComputedStyle(document.body);
    properties = Object.fromEntries([...style].filter((name) => name.startsWith('--')).map((name) => [name, style.getPropertyValue(name)]));
  }
  for (const [property, value] of Object.entries(properties)) scope.style.setProperty(property, value);

  // Resolves a CSS value the way the browser computes it, so values compare as
  // the browser draws them (#ab0520 and rgb(171, 5, 32) are the same color).
  const computed = (cssProperty, value, within = scope) => {
    const probe = document_.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;border-style:solid;outline-style:solid';
    probe.style.setProperty(cssProperty, value);
    within.append(probe);
    const result = document_.defaultView.getComputedStyle(probe).getPropertyValue(cssProperty);
    probe.remove();
    return result;
  };
  const hasToken = (token) => document_.defaultView.getComputedStyle(scope).getPropertyValue(tokenVariable(token)).trim() !== '';

  const settleStyles = async () => {
    await settle();
    const transitions = parts.root.getAnimations({ subtree: true })
      .filter((animation) => 'transitionProperty' in animation && animation.playState !== 'finished');
    for (const animation of transitions) animation.finish();
    if (transitions.length) await settle();
  };

  const skipRule = (row) =>
    skip.find((rule) => (!rule.part || rule.part === row.part) && (!rule.condition || rule.condition === row.condition) && (!rule.property || rule.property === row.property));
  const base = (row) => ({ part: row.part, condition: row.condition, property: row.property, source: row.token ?? row.value });
  const skipRow = (row, reason) => add('skipped', null, { ...base(row), reason }, `${label(row)}: skipped: ${reason}`);

  // Compares a row with the value read for each CSS property it's drawn with.
  const compare = (row, read, cssProperties = SIDES[row.property] ?? [CSS[row.property]]) => {
    if (row.token && !hasToken(row.token)) {
      add('failed', 'missing-data', base(row), `${label(row)}: ${row.token} isn't in the token output (${tokenVariable(row.token)})`, `Use token output from the same release as the contracts: ${tokenVariable(row.token)} is missing from tokens.css.`);
      return;
    }
    let ok = true;
    for (const cssProperty of cssProperties) {
      const source = row.token
        ? document_.defaultView.getComputedStyle(scope).getPropertyValue(tokenVariable(row.token)).trim()
        : row.value;
      const resolved = row.property === 'scale' ? `scale(${source})` : source;
      if (!resolved || !document_.defaultView.CSS.supports(cssProperty, resolved)) {
        add('failed', 'missing-data', base(row), `${label(row)}: ${row.token ?? row.value} isn't a valid ${cssProperty} value`, `Check ${contractFile} and the matching token output.`);
        return;
      }
      const expected = normalize(cssProperty, computed(cssProperty, expression(row), scope));
      const drawn = normalize(cssProperty, computed(cssProperty, read(cssProperty)));
      if (same(expected, drawn)) continue;
      ok = false;
      const side = cssProperties.length > 1 ? ` (${cssProperty})` : '';
      add(
        'failed',
        'value-mismatch',
        { ...base(row), expected, drawn },
        `${label(row)}${side}: expected ${expected} (${row.token ?? row.value}), got ${drawn}`,
        `In ${fixIn}, make ${row.part}'s ${cssProperty}${row.condition ? ` ${row.condition}` : ''} ${expected}. If the design decision changed instead, update ${contractFile} (or its token) in the design-system source and rebuild the matching packages.`,
      );
    }
    if (ok) add('passed', null, base(row), `${label(row)}: ${row.token ?? row.value}`);
  };

  // A shape is checked as the ratio of the part's drawn width to its height.
  const compareShape = (row, element) => {
    const height = selected.find((r) => r.part === row.part && r.condition === row.condition && r.property === 'aspect-ratio.height');
    const expected = Number(row.value) / Number(height?.value);
    const { width, height: drawnHeight } = element.getBoundingClientRect();
    if (!height || !Number.isFinite(expected) || expected <= 0) {
      add('failed', 'missing-data', base(row), `${label(row)}: the aspect ratio is incomplete or invalid`, `Provide positive width and height in ${contractFile}.`);
    } else if (drawnHeight <= 0 || Math.abs(width / drawnHeight - expected) > 0.01) {
      const drawn = `${Math.round(width)}×${Math.round(drawnHeight)}`;
      add('failed', 'shape-mismatch', { ...base(row), property: 'aspect-ratio', expected: `${row.value}:${height?.value}`, drawn }, `${row.part} › aspect-ratio: expected ${row.value}:${height?.value}, got ${drawn}`, `In ${fixIn}, draw ${row.part} at ${row.value}:${height?.value}. If the design decision changed instead, change ${contractFile}.`);
    } else {
      add('passed', null, { ...base(row), property: 'aspect-ratio' }, `${row.part} › aspect-ratio: ${row.value}:${height?.value}`);
    }
  };

  // A height given as a share of the image (or of the component, if it has none),
  // such as a title gradient over the bottom half of a photo.
  const compareShare = (row, element) => {
    const whole = (parts.image ?? parts.root).getBoundingClientRect().height;
    const share = (element.getBoundingClientRect().height / whole) * 100;
    if (!Number.isFinite(share) || !Number.isFinite(Number(row.value)) || Math.abs(share - Number(row.value)) > 0.5) {
      add('failed', 'shape-mismatch', { ...base(row), expected: `${row.value}%`, drawn: `${share.toFixed(1)}%` }, `${label(row)}: expected ${row.value}% of the image, got ${share.toFixed(1)}%`, `In ${fixIn}, make ${row.part}'s height ${row.value}% of the image. If the design decision changed instead, change ${contractFile}.`);
    } else {
      add('passed', null, base(row), `${label(row)}: ${row.value}% of the image`);
    }
  };

  // Reads one row at the component's current state. A focus ring is drawn on the
  // element with focus.
  const evaluate = (row) => {
    const rule = skipRule(row);
    if (rule) return skipRow(row, rule.reason);
    if (row.property === 'aspect-ratio.height') {
      if (selected.some((other) => other.part === row.part && other.condition === row.condition && other.property === 'aspect-ratio.width')) {
        return skipRow(row, 'checked together with aspect-ratio.width');
      }
      return add('failed', 'missing-data', base(row), `${label(row)}: the aspect ratio has no width`, `Provide both dimensions in ${contractFile}.`);
    }
    const isShape = row.property === 'aspect-ratio.width';
    if (!isShape && !CSS[row.property]) {
      return add('unsupported', 'unsupported-property', base(row), `${label(row)}: no CSS property to test it with`, `Record it with \`skip: [{ part: '${row.part}', property: '${row.property}', reason }]\` until @az-digital/design-contract-testing supports it, or contribute support to the testing library.`);
    }
    const element = parts[row.part];
    const isRing = row.property.startsWith('ring.');
    if (isRing && row.condition === 'focus-visible' && !element.contains(focus)) {
      return skipRow(row, 'the focus ring is drawn on an element outside this part');
    }
    // A margin is the space between a part and the one beside it, so it's checked
    // only where there is one: a last paragraph's bottom margin is 0.
    if ((row.property === 'margin-bottom' && !element.nextElementSibling) || (row.property === 'margin-top' && !element.previousElementSibling)) {
      return skipRow(row, 'no neighboring part to measure against');
    }
    if (isShape) return compareShape(row, element);
    if (row.property === 'height' && row.type === 'number') return compareShare(row, element);
    if (row.property === 'gradient.color') return compare(row, () => lastColor(getComputedStyle(element).backgroundImage), ['color']);
    if (row.property === 'gap') {
      const space = gapOf(element, parts.root);
      if (space === null) return skipRow(row, 'no next item to measure against');
      return compare(row, () => space, ['row-gap']);
    }
    if (isRing) {
      const style = getComputedStyle(row.condition === 'focus-visible' ? focus : element);
      return compare(row, (cssProperty) => ring(style, cssProperty));
    }
    return compare(row, (cssProperty) => getComputedStyle(element).getPropertyValue(cssProperty));
  };

  const block = (rows, cause, why) => {
    for (const row of rows) {
      const rule = skipRule(row);
      if (rule) skipRow(row, rule.reason);
      else add('blocked', null, { ...base(row), blockedBy: CODES[cause] }, `${label(row)}: blocked: ${why}`, `Fix ${CODES[cause]} first.`);
    }
  };
  const unsupported = (rows, needs, why) => {
    const capabilities = needs.map((name) => `\`${name}\``).join(' and ');
    for (const row of rows) {
      const rule = skipRule(row);
      if (rule) skipRow(row, rule.reason);
      else add('unsupported', 'no-driver', base(row), `${label(row)}: can't be tested: ${why}`, `Run the test with a driver that implements ${capabilities} (the Playwright adapter does), or record it with \`skip\` and a reason.`);
    }
  };
  const unreachable = (rows, condition, problem) => {
    add('failed', 'state-unreachable', { part: null, condition, property: null }, `${condition}: couldn't put the component in this state: ${problem}`, `Make the state reachable: the element must be visible, unobscured and enabled (${fixIn}). The ${rows.length} ${condition} row${rows.length === 1 ? '' : 's'} can't be read until it is.`);
    block(rows, 'state-unreachable', `the ${condition} state couldn't be reached`);
  };

  // Puts the component in a state, reads the rows, and puts it back. A state that
  // can't be reached fails once, and its rows are blocked rather than failed.
  const inState = async (condition, rows, { needs, why, enter, reached, leave }) => {
    if (!rows.length) return;
    const missing = needs.filter((capability) => !driver?.[capability]);
    if (missing.length) return unsupported(rows, missing, why);
    const active = rows.filter((row) => {
      const rule = skipRule(row);
      if (!rule) return true;
      skipRow(row, rule.reason);
      return false;
    });
    if (!active.length) return;
    try {
      let problem = null;
      try {
        await enter();
        await settleStyles();
        if (!reached()) problem = `it never matched :${condition}`;
      } catch (error) {
        problem = firstLine(error);
      }
      if (problem) unreachable(active, condition, problem);
      else for (const row of active) evaluate(row);
    } finally {
      try {
        await leave();
      } catch (error) {
        add('failed', 'state-unreachable', { part: null, condition, property: null },
          `${condition}: couldn't restore the state: ${firstLine(error)}`,
          `Ensure the driver can leave the ${condition} state before checking the next one.`);
      }
    }
  };

  // A part the contract has and the test doesn't map is reported, not skipped
  // over, unless the implementation may leave it out.
  const unmapped = new Set();
  for (const part of new Set(selected.map((row) => row.part))) {
    if (parts[part]) continue;
    unmapped.add(part);
    const partRows = selected.filter((row) => row.part === part);
    if (optionalParts.includes(part)) {
      for (const row of partRows) skipRow(row, 'optional, and not in this implementation');
    } else {
      add('unmapped', 'unmapped-part', { part, condition: null, property: null }, `${part}: no element is mapped to this part`, `Map the part to an element (\`parts: { ${part}: element }\`), list it in \`optionalParts\` if the implementation may leave it out, or remove it from ${contractFile}. Its ${partRows.length} row${partRows.length === 1 ? '' : 's'} can't be read until it is.`);
      block(partRows, 'unmapped-part', `${part} isn't mapped`);
    }
  }
  const mapped = selected.filter((row) => !unmapped.has(row.part));

  const breakpointNames = [...new Set(mapped.filter((row) => row.kind === 'breakpoint').map((row) => row.condition))];
  const widths = {};
  const invalidBreakpoints = breakpointNames.filter((breakpoint) => {
    const token = `az.breakpoint.${breakpoint}`;
    const value = document_.defaultView.getComputedStyle(scope).getPropertyValue(tokenVariable(token)).trim();
    const width = parseFloat(computed('width', value));
    if (!hasToken(token) || !document_.defaultView.CSS.supports('width', value) || !Number.isFinite(width) || width < 1) {
      add('failed', 'missing-data', { part: null, condition: breakpoint, property: null },
        `${breakpoint}: breakpoint token ${token} is missing or invalid`,
        `Provide a positive breakpoint width in token output from the same release as ${contractFile}.`);
      return true;
    }
    widths[breakpoint] = Math.ceil(width);
    return false;
  });
  // Properties a breakpoint changes are read in the breakpoint pass: their resting
  // value is the one below the narrowest breakpoint that changes them, not the
  // viewport the page happens to have.
  const key = (row) => `${row.part} ${row.property}`;
  const byBreakpoint = new Set(mapped.filter((row) => row.kind === 'breakpoint').map(key));
  const resting = mapped.filter((row) => row.kind === 'default' && !byBreakpoint.has(key(row)));

  let viewportChanged = false;
  try {
    await driver?.unhover?.();
    await settleStyles();

    for (const row of resting) evaluate(row);

    // Keyboard focus goes first, before pointer use changes the input modality.
    await inState('focus-visible', mapped.filter((row) => row.condition === 'focus-visible'), {
      needs: ['keyboardFocus'],
      why: 'keyboard focus needs real keyboard input: pass a driver (the Playwright adapter or Vitest browser mode)',
      enter: () => driver.keyboardFocus(focus),
      reached: () => focus.matches(':focus-visible'),
      leave: async () => focus.blur(),
    });

    await inState('hover', mapped.filter((row) => row.condition === 'hover'), {
      needs: ['hover', 'unhover'],
      why: 'hover needs a real pointer: pass a driver (the Playwright adapter or Vitest browser mode)',
      enter: () => driver.hover(hover),
      reached: () => hover.matches(':hover'),
      leave: () => driver.unhover(),
    });

    await inState('active', mapped.filter((row) => row.condition === 'active'), {
      needs: ['press', 'release'],
      why: 'the pressed state needs a real pointer button: pass a driver (the Playwright adapter or Vitest browser mode)',
      enter: () => driver.press(press),
      reached: () => press.matches(':active'),
      leave: () => driver.release(),
    });

    for (const row of mapped.filter((r) => r.kind === 'state' && !STATES.includes(r.condition))) {
      if (skipRule(row)) skipRow(row, skipRule(row).reason);
      else add('unsupported', 'unsupported-state', base(row), `${label(row)}: the ${row.condition} state can't be tested`, `The testing library can put a component in ${STATES.join(', ')}. Record this row with \`skip\` and a reason, or contribute support for ${row.condition} to @az-digital/design-contract-testing.`);
    }

    // Each breakpoint's rows are read at its width, and what they replace is read
    // one pixel below it.
    if (breakpointNames.length) {
      const rows = mapped.filter((row) => row.kind === 'breakpoint' || (row.kind === 'default' && byBreakpoint.has(key(row))));
      const rowsAt = (breakpoint) => rows.filter((row) => row.kind === 'breakpoint' && row.condition === breakpoint);
      if (invalidBreakpoints.length) {
        block(rows, 'missing-data', 'one or more breakpoint widths are missing or invalid');
      } else if (!driver?.setViewport || !driver?.restoreViewport) {
        unsupported(rows, ['setViewport', 'restoreViewport'], "breakpoints need a driver that can resize and restore the viewport");
      } else {
        const ordered = [...breakpointNames].sort((a, b) => widths[a] - widths[b]);
        const readAt = async (width, toRead) => {
          try {
            viewportChanged = true;
            await driver.setViewport(width);
            await settleStyles();
          } catch (error) {
            add('failed', 'state-unreachable', { part: null, condition: `${width}px`, property: null }, `${width}px wide: couldn't resize the viewport: ${firstLine(error)}`, 'Run the test with a driver whose `setViewport` can resize the page.');
            return block(toRead, 'state-unreachable', `the viewport couldn't be set to ${width}px`);
          }
          for (const row of toRead) evaluate(row);
        };
        for (const [index, breakpoint] of ordered.entries()) {
          await readAt(widths[breakpoint], rowsAt(breakpoint));
          // Below the breakpoint, each property has the value the next narrower
          // breakpoint that sets it gives it, or its resting value.
          const below = rowsAt(breakpoint).map(
            (row) => ordered.slice(0, index).reverse().flatMap((other) => rowsAt(other).filter((r) => key(r) === key(row)))[0] ?? rows.find((r) => r.kind === 'default' && key(r) === key(row)),
          );
          await readAt(widths[breakpoint] - 1, below.filter(Boolean));
        }
      }
    }
  } finally {
    try {
      if (viewportChanged) await driver.restoreViewport();
    } catch (error) {
      add('failed', 'state-unreachable', { part: null, condition: null, property: null },
        `couldn't restore the viewport: ${firstLine(error)}`,
        'Ensure the driver restores the viewport after the breakpoint tests.');
    } finally {
      frame.remove();
    }
  }

  return finish();

  function finish() {
    const counts = { passed: 0, failed: 0, unsupported: 0, unmapped: 0, blocked: 0, skipped: 0 };
    for (const entry of entries) counts[entry.status] += 1;
    return {
      contract,
      options,
      name,
      implementation,
      entries,
      counts,
      // Only a test that looked at something, and found everything it looked at right, is ok.
      ok: FAILING.every((status) => counts[status] === 0) && counts.passed > 0,
    };
  }
}

/** One finding per failing, unsupported, unmapped or blocked row, each followed by its action. */
export function formatResult(result) {
  return result.entries
    .filter((entry) => FAILING.includes(entry.status))
    .map((entry) => `${entry.code ?? entry.status.toUpperCase()} ${entry.status}: ${entry.message}${entry.action ? `\n    → ${entry.action}` : ''}`);
}

/** What a test covered, in one line. */
export function describeCoverage(result) {
  const { counts } = result;
  return `${result.name}: ${counts.passed} passed, ${counts.failed} failed, ${counts.unsupported} unsupported, ${counts.unmapped} unmapped, ${counts.blocked} blocked, ${counts.skipped} skipped`;
}
