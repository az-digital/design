// Runs a design contract test in a Playwright page, with a real mouse and keyboard.
//
// The testing library's core runs inside the page, where computed styles are. What a page
// can't do for itself, such as hover, press and resize, it asks this adapter for
// through a binding, and the adapter does it with Playwright's own input, so :hover,
// :active and :focus-visible are the browser's, not simulated events.
import { readFileSync } from 'node:fs';

export { CODES, describeCoverage, formatResult } from './browser.js';

const source = readFileSync(new URL('./browser.js', import.meta.url), 'utf8');
const BINDING = '__azContractDriver';
const states = new WeakMap();

// The binding's handler is registered once per page; each test sets the options it uses.
async function prepare(page) {
  let state = states.get(page);
  if (!state) {
    state = { timeout: 5000, original: null };
    states.set(page, state);
    const size = async () => page.viewportSize() ?? page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
    await page.exposeFunction(BINDING, async (action, selector, argument) => {
      const locator = selector ? page.locator(selector).first() : null;
      switch (action) {
        case 'hover':
          return locator.hover({ timeout: state.timeout });
        case 'unhover':
          return page.mouse.move(-1, -1);
        case 'press':
          await locator.hover({ timeout: state.timeout });
          return page.mouse.down();
        case 'release':
          // Released away from the component, so pressing it never counts as a click.
          await page.mouse.move(-1, -1);
          return page.mouse.up();
        case 'keyboardFocus': {
          // Shift+Tab then Tab arrives on the element by keyboard, which is what
          // makes :focus-visible match.
          await locator.focus({ timeout: state.timeout });
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          if (!(await locator.evaluate((element) => element.getRootNode().activeElement === element))) {
            throw new Error('Tab navigation did not arrive on the element');
          }
          return;
        }
        case 'viewport': {
          state.original ??= await size();
          return page.setViewportSize({ width: argument, height: state.original.height });
        }
        case 'restoreViewport':
          if (state.original) await page.setViewportSize(state.original);
          state.original = null;
          return;
        default:
          throw new Error(`Unknown driver action ${action}`);
      }
    });
  }
  const loaded = await page.evaluate(() => Boolean(window.__azDesignContractTester));
  if (!loaded) {
    // Script content runs as a module so the core is injected as it is. A page whose
    // Content-Security-Policy forbids inline scripts needs `bypassCSP` in its context.
    await page.addScriptTag({ type: 'module', content: `${source}\nwindow.__azDesignContractTester = { testDesignContract };` });
    await page.waitForFunction(() => Boolean(window.__azDesignContractTester));
  }
  return state;
}

/**
 * Tests the component at `root` in a Playwright page against its design contract.
 *
 * @param {import('playwright').Page} page
 * @param {object} input
 * @param {string} input.root A selector for the component's root element.
 * @param {Record<string, string>} input.parts A selector for each contract part
 *   within the root, `:scope` for the root itself (a button's label is the button).
 *   A part with no selector, or whose selector finds nothing, is unmapped.
 * @param {string} [input.focus] Selector, within the root, of the element that takes keyboard focus.
 * @param {string} [input.hover] Selector, within the root, of the element to point at.
 * @param {string} [input.press] Selector, within the root, of the element to press.
 * @param {number} [input.timeout] How long a pointer action waits for the element to be actionable.
 * Everything else is what `testDesignContract` takes in `browser.js`.
 */
export async function testDesignContractInPage(page, input) {
  const state = await prepare(page);
  state.timeout = input.timeout ?? 5000;
  const { root, parts, focus, hover, press } = input;
  const rest = Object.fromEntries(Object.entries(input).filter(([key]) => !['root', 'parts', 'focus', 'hover', 'press', 'timeout'].includes(key)));
  const rootElement = page.locator(root).first();
  if (!(await rootElement.count())) throw new Error(`No element matches the root selector ${root}`);
  return rootElement.evaluate(
    async (rootElement, { parts, focus, hover, press, rest, binding }) => {
      const within = (selector) => (selector === ':scope' ? rootElement : rootElement.querySelector(selector));
      const found = Object.fromEntries(
        Object.entries({ root: ':scope', ...parts })
          .map(([part, selector]) => [part, within(selector)])
          .filter(([, element]) => element),
      );

      // Elements can't cross to the adapter, so a pointer action names its element
      // with a temporary attribute.
      const act = async (action, element, argument) => {
        let selector = null;
        if (element) {
          element.setAttribute('data-az-contract-target', '');
          selector = '[data-az-contract-target]';
        }
        try {
          await window[binding](action, selector, argument);
        } finally {
          element?.removeAttribute('data-az-contract-target');
        }
      };
      const driver = {
        hover: (element) => act('hover', element),
        unhover: () => act('unhover'),
        press: (element) => act('press', element),
        release: () => act('release'),
        keyboardFocus: (element) => act('keyboardFocus', element),
        setViewport: (width) => act('viewport', null, width),
        restoreViewport: () => act('restoreViewport'),
      };
      const target = { parts: found };
      for (const [name, selector] of Object.entries({ focus, hover, press })) {
        if (!selector) continue;
        const element = within(selector);
        if (!element) throw new Error(`No element matches the ${name} selector ${selector} within the root`);
        target[name] = element;
      }
      return window.__azDesignContractTester.testDesignContract({ ...rest, target, driver });
    },
    { parts, focus, hover, press, rest, binding: BINDING },
  );
}
