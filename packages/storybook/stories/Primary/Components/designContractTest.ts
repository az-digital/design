import contractRows from '@contracts/dist/contracts.json';
import manifest from '@contracts/dist/manifest.json';
import tokens from '@tokens/dist/tokens.css?raw';
import {
  testDesignContract as compare,
  describeCoverage,
  formatResult,
  type DesignContractTestInput,
  type DesignContractTestResult,
  type ContractRow,
  type Driver,
  type Target,
} from '@az-digital/design-contract-testing';

// Storybook's design contract test: the reusable testing library
// with this repo's contract data and tokens, and Vitest's real browser input for
// the states a script can't set (hover, pressed, viewport width).

const defaults = Object.fromEntries(
  Object.entries(manifest.contracts).map(([id, contract]) => [
    id,
    Object.fromEntries(Object.entries(contract.variantDefaults).filter((entry): entry is [string, string] => typeof entry[1] === 'string')),
  ]),
);
const variants = Object.fromEntries(
  Object.entries(manifest.contracts).map(([id, contract]) => [id, contract.variants]),
);

// Vitest's browser mode drives the pointer with the browser's own input, so :hover
// and :active are real. Storybook's UI has no such driver.
export async function createDriver(component?: Element): Promise<Driver | undefined> {
  if (import.meta.env.MODE !== 'test') return undefined;
  const { page, userEvent } = await import('vitest/browser');
  const original = { width: window.innerWidth, height: window.innerHeight };
  return {
    hover: (element) => userEvent.hover(element),
    unhover: () => userEvent.pointer({ coords: { x: -1, y: -1 } }),
    press: (element) => userEvent.pointer({ target: element, keys: '[MouseLeft>]' }),
    // Released away from the component, so pressing it never counts as a click.
    release: async () => {
      await userEvent.pointer({ coords: { x: -1, y: -1 } });
      await userEvent.pointer({ keys: '[/MouseLeft]' });
    },
    keyboardFocus: async (element) => {
      if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
        throw new Error('The focus target cannot receive keyboard focus');
      }
      let outer = component ?? element;
      for (let root = outer.getRootNode(); root instanceof ShadowRoot; root = outer.getRootNode()) outer = root.host;
      if (!outer.isConnected) throw new Error('The component is not connected to the document');
      const start = document.createElement('span');
      start.tabIndex = 0;
      start.style.cssText = 'position:fixed;left:-10000px;top:0;width:1px;height:1px';
      outer.before(start);
      try {
        start.focus();
        if (document.activeElement !== start) throw new Error('The keyboard starting point could not be focused');
        const visited = new Set<Element>();
        for (let step = 0; step < 100; step += 1) {
          await userEvent.tab();
          let active = document.activeElement;
          while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
          if (active === element) return;
          if (!active || visited.has(active)) break;
          visited.add(active);
        }
        throw new Error('Tab navigation did not reach the focus target');
      } finally {
        start.remove();
      }
    },
    setViewport: (width) => page.viewport(width, original.height),
    restoreViewport: () => page.viewport(original.width, original.height),
  };
}

export { describeCoverage, formatResult };

type Options = Partial<Pick<DesignContractTestInput, 'optionalParts' | 'skip' | 'implementation'>>;

/**
 * Compares a rendered component with its contract, and returns the result: every
 * row passed, failed, unsupported, unmapped, blocked or skipped.
 */
export async function testDesignContract(
  target: Target,
  contract: string,
  variantOptions: string[] = [],
  options: Options = {},
): Promise<DesignContractTestResult> {
  return compare({
    data: { rows: contractRows as ContractRow[], defaults, variants },
    contract,
    options: variantOptions,
    target,
    driver: await createDriver(target.parts.root),
    tokens,
    contractFile: `packages/contracts/contracts/${contract}.contract.json`,
    ...options,
    implementation: options.implementation,
  });
}
