import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { renderButton } from '../../components-html/src/Button';
import { ArizonaHeader, Button } from '../../components-react-bootstrap/src';
import adapter from '../../components-react-bootstrap/storybook/adapter';

describe('React Button', () => {
  it.each([
    ['red', 'solid', 'btn-red'],
    ['red', 'outline', 'btn-outline-red'],
    ['blue', 'solid', 'btn-blue'],
    ['blue', 'outline', 'btn-outline-blue'],
    ['rain', 'solid', 'btn-rain'],
    ['rain', 'outline', 'btn-outline-rain'],
    ['white-text-red', 'solid', 'btn-white-text-red'],
    ['white-text-blue', 'solid', 'btn-white-text-blue'],
    ['white', 'outline', 'btn-outline-white'],
  ] as const)('renders %s %s with %s', (color, style, expected) => {
    const markup = renderToStaticMarkup(createElement(Button, { htmlTag: 'button', color, style, size: 'lg' }, 'Apply'));
    expect(markup).toContain(`class="btn ${expected} btn-lg"`);
    expect(markup).toContain('type="button"');
  });

  it('keeps the existing anchor default and disabled behavior', () => {
    const markup = renderToStaticMarkup(createElement(Button, { href: '/apply', disabled: true }, 'Apply'));
    expect(markup).toContain('href="/apply"');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('tabindex="-1"');
  });

  it('generates React usage for shared story controls and safely quotes the label', () => {
    const source = adapter.components.button.source({
      label: 'Apply <now> "today"',
      color: 'outline-rain',
      size: 'small',
    });
    expect(source).toBe('<Button htmlTag="button" color="rain" style="outline" size="sm">{"Apply <now> \\"today\\""}</Button>');
  });
});

describe('HTML Button', () => {
  it.each([
    ['rain', 'btn-rain'],
    ['outline-rain', 'btn-outline-rain'],
  ] as const)('renders %s with %s', (color, expected) => {
    expect(renderButton({ label: 'Apply', color })).toBe(`<button type="button" class="btn ${expected}">Apply</button>`);
  });
});

describe('React Arizona Header', () => {
  it('renders the official wordmark and optional header controls', () => {
    const markup = renderToStaticMarkup(createElement(ArizonaHeader, { variant: 'red', headerButtons: true }));
    expect(markup).toContain('arizona-header bg-red');
    expect(markup).toContain('https://cdn.digital.arizona.edu/logos/v1.0.0/ua_wordmark_line_logo_white_rgb.min.svg');
    expect(markup).toContain('>Search</span>');
    expect(markup).toContain('>Menu</span>');
  });

  it('generates React usage from the header controls', () => {
    expect(adapter.components['brand-header'].source({ variant: 'red', headerButtons: true }))
      .toBe('<ArizonaHeader variant="red" headerButtons />');
  });
});
