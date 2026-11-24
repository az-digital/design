import { chromium } from 'playwright';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { testDesignContractInPage, formatResult } from '../src/playwright.js';

const tokens = {
  '--az-demo-fill': '#ab0520',
  '--az-demo-fill-hover': '#8b0015',
  '--az-demo-fill-active': '#001c48',
  '--az-demo-ring': '#378dbd',
  '--az-demo-pad-wide': '24px',
  '--az-demo-pad-narrow': '8px',
  '--az-breakpoint-md': '768px',
};

const row = (part, kind, condition, property, token, value) => ({ contract: 'demo', variant: null, part, kind, condition, property, token, value });
const data = {
  rows: [
    row('root', 'default', null, 'fill', 'az.demo.fill'),
    row('root', 'default', null, 'padding.x', 'az.demo.pad-narrow'),
    row('root', 'state', 'hover', 'fill', 'az.demo.fill-hover'),
    row('root', 'state', 'active', 'fill', 'az.demo.fill-active'),
    row('root', 'state', 'focus-visible', 'ring.color', 'az.demo.ring'),
    row('root', 'breakpoint', 'md', 'padding.x', 'az.demo.pad-wide'),
  ],
};

// A component drawn the way the contract says, which each test then breaks one rule of.
const page_ = (css = '') => `
  <style>
    a.demo { display: inline-block; padding: 4px 8px; background: #ab0520; color: #fff; outline: none; }
    @media (min-width: 768px) { a.demo { padding-left: 24px; padding-right: 24px; } }
    a.demo:hover { background: #8b0015; }
    a.demo:active { background: #001c48; }
    a.demo:focus-visible { outline: 3px solid #378dbd; }
    ${css}
  </style>
  <a class="demo" href="#">Go</a>`;

let browser;
let page;
beforeAll(async () => {
  browser = await chromium.launch();
});
afterAll(() => browser.close());
beforeEach(async () => {
  page?.close();
  page = await browser.newPage({ viewport: { width: 1024, height: 700 } });
});

const check = (overrides = {}) =>
  testDesignContractInPage(page, { root: 'a.demo', parts: {}, data, contract: 'demo', tokens, ...overrides });
const withContent = async (css, overrides) => {
  await page.setContent(page_(css));
  return check(overrides);
};
const byStatus = (result, status) => result.entries.filter((entry) => entry.status === status);

describe('a component that matches its contract', () => {
  it('passes every state and breakpoint, reading each from the browser', async () => {
    const result = await withContent();
    expect(formatResult(result)).toEqual([]);
    expect(result.ok).toBe(true);
    // 2 resting (fill; padding.x only in the breakpoint pass), hover, active, ring, 2 breakpoint reads each side.
    const conditions = byStatus(result, 'passed').map((entry) => `${entry.condition} ${entry.property}`);
    expect(conditions).toEqual(expect.arrayContaining(['hover fill', 'active fill', 'focus-visible ring.color', 'md padding.x']));
  });

  it('puts the page back as it found it', async () => {
    await withContent();
    expect(page.viewportSize()).toEqual({ width: 1024, height: 700 });
    expect(await page.locator('[data-az-contract-scope], [data-az-contract-target]').count()).toBe(0);
    expect(await page.locator('a.demo').getAttribute('style')).toBeNull();
  });

  it('moves the pointer off a component touching the top-left corner', async () => {
    await page.setContent(`<!doctype html>
      <style>
        body { margin: 0 }
        button.demo { padding: 4px 8px; background: #ab0520; outline: none }
        @media (min-width: 768px) { button.demo { padding-left: 24px; padding-right: 24px } }
        button.demo:hover { background: #8b0015 }
        button.demo:active { background: #001c48 }
        button.demo:focus-visible { outline: 3px solid #378dbd }
      </style><button class="demo">Go</button>`);
    await page.locator('button.demo').hover();
    const result = await check({ root: 'button.demo' });
    expect(formatResult(result)).toEqual([]);
    expect(await page.locator('button.demo').evaluate((element) => element.matches(':hover'))).toBe(false);
  });

  it('finishes in-flight transitions before measuring without changing their declared timing', async () => {
    await page.setContent(`<!doctype html>
      <style>
        button { background: #ab0520; transition: background-color 60s }
        button.changed { background: #001c48 }
      </style><button>Go</button>`);
    await page.locator('button').evaluate((element) => {
      getComputedStyle(element).getPropertyValue('background-color');
      element.classList.add('changed');
      getComputedStyle(element).getPropertyValue('background-color');
    });
    expect(await page.locator('button').evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
    const transitioning = { rows: [
      row('root', 'default', null, 'fill', null, '#001c48'),
      row('root', 'default', null, 'transition.duration', null, '60s'),
    ] };
    const result = await check({ root: 'button', data: transitioning });
    expect(formatResult(result)).toEqual([]);
    expect(byStatus(result, 'passed')).toMatchObject([{ property: 'fill' }, { property: 'transition.duration' }]);
  });
});

describe('failures', () => {
  it('reports a hover value that is wrong with a code, expected and drawn value, and an action', async () => {
    const result = await withContent('a.demo:hover:not(:active) { background: #000000; }');
    const [failure] = byStatus(result, 'failed');
    expect(byStatus(result, 'failed')).toHaveLength(1);
    expect(failure).toMatchObject({ code: 'AZC001', condition: 'hover', property: 'fill', expected: 'rgb(139, 0, 21)', drawn: 'rgb(0, 0, 0)' });
    expect(failure.action).toContain('@az-digital/contracts/contracts/demo.contract.json');
    expect(result.ok).toBe(false);
  });

  it('reads the real pressed state', async () => {
    const result = await withContent('a.demo:active { background: #ffffff; }');
    expect(byStatus(result, 'failed').map((entry) => entry.condition)).toEqual(['active']);
  });

  it('reads the focus ring on keyboard focus, not on pointer focus', async () => {
    const result = await withContent('a.demo:focus-visible { outline-color: #ff0000; }');
    expect(byStatus(result, 'failed').map((entry) => [entry.condition, entry.property])).toEqual([['focus-visible', 'ring.color']]);
  });

  it('uses keyboard input even when script focus already matches :focus-visible', async () => {
    await page.setContent(page_());
    await page.locator('a.demo').focus();
    await page.evaluate(() => {
      window.tabKeys = 0;
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') window.tabKeys += 1;
      });
    });
    const result = await check();
    expect(result.ok).toBe(true);
    expect(await page.evaluate(() => window.tabKeys)).toBeGreaterThanOrEqual(2);
  });

  it('reaches and checks keyboard focus inside a shadow root', async () => {
    await page.setContent('<x-demo></x-demo>');
    await page.evaluate(() => {
      const shadow = document.querySelector('x-demo').attachShadow({ mode: 'open' });
      shadow.innerHTML = '<style>button { background: #ab0520 } button:focus-visible { outline: 3px solid #378dbd }</style><button>Go</button>';
    });
    const focused = { rows: data.rows.filter((entry) => entry.condition === null && entry.property === 'fill' || entry.condition === 'focus-visible') };
    const result = await check({ root: 'x-demo button', data: focused });
    expect(formatResult(result)).toEqual([]);
    expect(byStatus(result, 'passed')).toMatchObject([
      { property: 'fill' },
      { condition: 'focus-visible', property: 'ring.color' },
    ]);
  });

  it('reads a value a breakpoint changes at that breakpoint, and the one it replaces just below it', async () => {
    const result = await withContent('@media (min-width: 768px) { a.demo { padding-left: 30px; } }');
    const failed = byStatus(result, 'failed');
    expect(failed).toHaveLength(1);
    expect(failed[0]).toMatchObject({ condition: 'md', property: 'padding.x', expected: '24px' });
    // The resting padding is read at 767px, and passes.
    expect(byStatus(result, 'passed').some((entry) => entry.property === 'padding.x')).toBe(true);
  });

  it('fails a value set one pixel too late', async () => {
    const result = await withContent('@media (min-width: 769px) { a.demo { padding-left: 8px; padding-right: 8px; } } @media (min-width: 768px) { a.demo { padding: 4px 8px; } }');
    expect(byStatus(result, 'failed').some((entry) => entry.condition === 'md')).toBe(true);
  });

  it('resolves expected values from the supplied tokens, not the page’s own custom properties', async () => {
    const result = await withContent(':root { --az-demo-fill: #00ff00; }');
    expect(result.ok).toBe(true);
  });

  it('reports a token the token output lacks, rather than comparing against nothing', async () => {
    const without = Object.fromEntries(Object.entries(tokens).filter(([name]) => name !== '--az-demo-ring'));
    const result = await withContent(':root { --az-demo-ring: #378dbd; }', { tokens: without });
    expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC008', property: 'ring.color' }]);
  });

  it('reads tokens.css text with the browser’s CSS parser', async () => {
    const css = `/* --az-demo-fill: #00ff00; */ :root { ${Object.entries(tokens).map(([name, value]) => `${name}: ${value};`).join(' ')} --az-demo-unused: url("data:,a;b"); }`;
    const result = await withContent(':root { --az-demo-fill: #00ff00; }', { tokens: css });
    expect(result.ok).toBe(true);
  });

  it('parses hostile tokens.css text quickly', async () => {
    const hostile = ['/*' + 'a/*'.repeat(100_000), '--'.repeat(100_000), '---:' + ' '.repeat(100_000)];
    const start = performance.now();
    for (const css of hostile) await withContent('', { tokens: css });
    expect(performance.now() - start).toBeLessThan(10_000);
  });

  it('does not resolve a supplied token alias from the page', async () => {
    const result = await withContent(':root { --page-ring: #378dbd; }', { tokens: { ...tokens, '--az-demo-ring': 'var(--page-ring)' } });
    expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC008', property: 'ring.color' }]);
  });

  it('rejects unknown and repeated variant options instead of falling back to the base', async () => {
    const variants = { ...data, variants: { demo: { color: ['red', 'blue'] } } };
    const unknown = await withContent('', { data: variants, options: ['color.typo'] });
    const repeated = await check({ data: variants, options: ['color.red', 'color.blue'] });
    for (const result of [unknown, repeated]) {
      expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC008' }]);
      expect(result.ok).toBe(false);
    }
  });

  it('reports a missing breakpoint token, even if the page defines it', async () => {
    const without = Object.fromEntries(Object.entries(tokens).filter(([name]) => name !== '--az-breakpoint-md'));
    const result = await withContent(':root { --az-breakpoint-md: 768px; }', { tokens: without });
    expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC008', condition: 'md' }]);
    expect(byStatus(result, 'blocked').some((entry) => entry.condition === 'md')).toBe(true);
    expect(page.viewportSize()).toEqual({ width: 1024, height: 700 });
  });

  it('compares dimension heights as CSS lengths, not percentages of the image', async () => {
    const heights = { rows: [{ ...row('root', 'default', null, 'height', null, '50px'), type: 'dimension' }] };
    const good = await withContent('a.demo { height: 50px; }', { data: heights });
    expect(good.ok).toBe(true);
    const bad = await withContent('a.demo { height: 25px; }', { data: heights });
    expect(byStatus(bad, 'failed')).toMatchObject([{ code: 'AZC001', expected: '50px', drawn: '25px' }]);
  });

  it('reports incomplete aspect ratios and zero-size shapes instead of passing them', async () => {
    const width = { ...row('root', 'default', null, 'aspect-ratio.width', null, '5'), type: 'number' };
    const height = { ...row('root', 'default', null, 'aspect-ratio.height', null, '3'), type: 'number' };
    const incomplete = await withContent('', { data: { rows: [width] } });
    expect(byStatus(incomplete, 'failed')).toMatchObject([{ code: 'AZC008', property: 'aspect-ratio.width' }]);
    const orphan = await check({ data: { rows: [height] } });
    expect(byStatus(orphan, 'failed')).toMatchObject([{ code: 'AZC008', property: 'aspect-ratio.height' }]);
    const empty = await withContent('a.demo { width: 0; height: 0; padding: 0; }', { data: { rows: [width, height] } });
    expect(byStatus(empty, 'failed')).toMatchObject([{ code: 'AZC002', property: 'aspect-ratio' }]);
    expect(byStatus(empty, 'skipped')).toMatchObject([{ property: 'aspect-ratio.height' }]);
  });
});

describe('what a test could not look at is never a pass', () => {
  it('reports an unmapped part once and blocks its rows', async () => {
    const wide = { rows: [...data.rows, row('label', 'default', null, 'color', null, '#ffffff')].map((r) => ({ ...r, type: undefined })) };
    wide.rows[wide.rows.length - 1].type = 'color';
    const result = await withContent('', { data: wide, parts: { label: '.missing' } });
    expect(byStatus(result, 'unmapped')).toMatchObject([{ code: 'AZC006', part: 'label' }]);
    expect(byStatus(result, 'blocked')).toMatchObject([{ part: 'label', property: 'color', blockedBy: 'AZC006' }]);
    expect(result.ok).toBe(false);
  });

  it('skips an optional part that the implementation leaves out', async () => {
    const wide = { rows: [...data.rows, row('label', 'default', null, 'color', null, '#ffffff')] };
    const result = await withContent('', { data: wide, parts: { label: '.missing' }, optionalParts: ['label'] });
    expect(byStatus(result, 'skipped')).toHaveLength(1);
    expect(result.ok).toBe(true);
  });

  it('reports an unreachable state once and blocks its rows', async () => {
    const result = await withContent('a.demo { pointer-events: none; }', { timeout: 300 });
    expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC007', condition: 'hover' }, { code: 'AZC007', condition: 'active' }]);
    expect(byStatus(result, 'blocked').map((entry) => entry.condition)).toEqual(['hover', 'active']);
  });

  it('reports a property the testing library cannot read as unsupported, unless it is skipped with a reason', async () => {
    const odd = { rows: [...data.rows, row('root', 'default', null, 'shadow.blur', null, '4px')] };
    const result = await withContent('', { data: odd });
    expect(byStatus(result, 'unsupported')).toMatchObject([{ code: 'AZC003', property: 'shadow.blur' }]);
    const skipped = await check({ data: odd, skip: [{ property: 'shadow.blur', reason: 'not drawn yet' }] });
    expect(skipped.ok).toBe(true);
    expect(byStatus(skipped, 'skipped')[0].reason).toBe('not drawn yet');
  });

  it('is not ok when nothing was checked', async () => {
    const result = await withContent('', { data: { rows: [] } });
    expect(result.ok).toBe(false);
    expect(byStatus(result, 'failed')).toMatchObject([{ code: 'AZC008' }]);
  });

  it('rejects an explicit interaction selector that finds no element', async () => {
    await page.setContent(page_());
    await expect(check({ focus: '.missing' })).rejects.toThrow('No element matches the focus selector');
  });

  it('restores the viewport even when reading a breakpoint unexpectedly throws', async () => {
    await page.setContent(page_());
    await check();
    const outcome = await page.evaluate(async () => {
      let restored = false;
      const broken = { contract: 'demo', variant: null, part: 'root', kind: 'breakpoint', condition: 'md', property: 'width', token: null };
      Object.defineProperty(broken, 'value', { get() { throw new Error('broken row'); } });
      try {
        await window.__azDesignContractTester.testDesignContract({
          data: { rows: [broken] },
          contract: 'demo',
          target: { parts: { root: document.querySelector('a.demo') } },
          tokens: { '--az-breakpoint-md': '768px' },
          driver: { setViewport: async () => {}, restoreViewport: async () => { restored = true; } },
        });
      } catch (error) {
        return { restored, message: error.message, scopes: document.querySelectorAll('[data-az-contract-scope]').length };
      }
      return { restored, message: null };
    });
    expect(outcome).toEqual({ restored: true, message: 'broken row', scopes: 0 });
  });

  it('records an intentional state skip even without a browser driver', async () => {
    await page.setContent(page_());
    await check();
    const result = await page.evaluate(async () => window.__azDesignContractTester.testDesignContract({
      data: { rows: [
        { contract: 'demo', variant: null, part: 'root', kind: 'default', condition: null, property: 'fill', token: null, value: '#ab0520' },
        { contract: 'demo', variant: null, part: 'root', kind: 'state', condition: 'hover', property: 'fill', token: null, value: '#8b0015' },
      ] },
      contract: 'demo',
      target: { parts: { root: document.querySelector('a.demo') } },
      skip: [{ condition: 'hover', reason: 'not supported by this implementation' }],
    }));
    expect(result.ok).toBe(true);
    expect(byStatus(result, 'skipped')).toMatchObject([{ condition: 'hover', reason: 'not supported by this implementation' }]);
  });

  it('reports missing state cleanup capabilities without entering those states', async () => {
    await page.setContent(page_());
    await check();
    const { result, calls } = await page.evaluate(async () => {
      const calls = [];
      const result = await window.__azDesignContractTester.testDesignContract({
        data: { rows: [
          { contract: 'demo', variant: null, part: 'root', kind: 'state', condition: 'hover', property: 'fill', token: null, value: '#8b0015' },
          { contract: 'demo', variant: null, part: 'root', kind: 'state', condition: 'active', property: 'fill', token: null, value: '#001c48' },
        ] },
        contract: 'demo',
        target: { parts: { root: document.querySelector('a.demo') } },
        driver: {
          hover: async () => { calls.push('hover'); },
          press: async () => { calls.push('press'); },
        },
      });
      return { result, calls };
    });
    expect(byStatus(result, 'unsupported')).toMatchObject([
      { code: 'AZC005', condition: 'hover', action: expect.stringContaining('`unhover`') },
      { code: 'AZC005', condition: 'active', action: expect.stringContaining('`release`') },
    ]);
    expect(calls).toEqual([]);
    expect(result.ok).toBe(false);
  });

  it('reports an error leaving a state rather than hiding it', async () => {
    await page.setContent(page_());
    await check();
    const result = await page.evaluate(async () => {
      let calls = 0;
      return window.__azDesignContractTester.testDesignContract({
        data: { rows: [{ contract: 'demo', variant: null, part: 'root', kind: 'state', condition: 'hover', property: 'fill', token: null, value: '#8b0015' }] },
        contract: 'demo',
        target: { parts: { root: document.querySelector('a.demo') } },
        driver: {
          hover: async () => {},
          unhover: async () => { if (++calls > 1) throw new Error('pointer reset failed'); },
        },
      });
    });
    expect(byStatus(result, 'failed')).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'AZC007', message: expect.stringContaining("couldn't restore the state: pointer reset failed") }),
    ]));
  });
});
