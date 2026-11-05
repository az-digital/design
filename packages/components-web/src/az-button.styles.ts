import { az } from '@az-digital/tokens/dist/tokens.vars.js';
import { unsafeCSS } from 'lit';
import type { ButtonColor } from './types';

// `<az-button>`'s shadow styles, from the button contract
// (`packages/contracts/contracts/button.contract.json`). Its design tokens come from
// @az-digital/tokens' CSS variables, so the page has to load tokens.css; its own
// values are written here.

const bg = az.color.bg.button;
const fg = az.color.fg;
const brand = az.color.brand;

// One contract color: its fill, border and label at rest, the fill (and border)
// and label on hover and with keyboard focus, the same while pressed, and its
// focus ring.
type Colors = {
  fill: string;
  border: string;
  label: string;
  hover: string;
  hoverLabel: string;
  active: string;
  activeLabel: string;
  ring: string;
};

const colors: Record<ButtonColor, Colors> = {
  red: { fill: bg.red, border: bg.red, label: fg.white, hover: bg.redHover, hoverLabel: fg.white, active: bg.redActive, activeLabel: fg.white, ring: brand.bougainvillea },
  'outline-red': { fill: 'transparent', border: fg.red, label: fg.red, hover: bg.redHover, hoverLabel: fg.white, active: bg.redActive, activeLabel: fg.white, ring: brand.bougainvillea },
  blue: { fill: bg.blue, border: bg.blue, label: fg.white, hover: bg.blueHover, hoverLabel: fg.white, active: bg.blueActive, activeLabel: fg.white, ring: brand.blue },
  'outline-blue': { fill: 'transparent', border: fg.blue, label: fg.blue, hover: bg.blueHover, hoverLabel: fg.white, active: bg.blueActive, activeLabel: fg.white, ring: brand.blue },
  rain: { fill: bg.rain, border: bg.rain, label: fg.blue, hover: bg.rainHover, hoverLabel: fg.tinta, active: bg.rainActive, activeLabel: fg.tinta, ring: brand.rain },
  'outline-rain': { fill: 'transparent', border: bg.rain, label: fg.rain, hover: bg.rainHover, hoverLabel: fg.tinta, active: bg.rainActive, activeLabel: fg.tinta, ring: brand.white },
  'white-text-red': { fill: bg.white, border: bg.white, label: fg.red, hover: bg.whiteHover, hoverLabel: fg.red, active: bg.whiteActive, activeLabel: fg.red, ring: brand.white },
  'white-text-blue': { fill: bg.white, border: bg.white, label: fg.blue, hover: bg.whiteHover, hoverLabel: fg.blue, active: bg.whiteActive, activeLabel: fg.blue, ring: brand.white },
  'outline-white': { fill: 'transparent', border: fg.white, label: fg.white, hover: bg.whiteHover, hoverLabel: brand.gray['800'], active: bg.whiteActive, activeLabel: brand.gray['800'], ring: brand.white },
};

// A color's custom properties, which the button's rules draw. The contract
// check reads the hover ones, since a script can't hover the button.
const declarations = (color: Colors) => `
    --fill: ${color.fill};
    --border: ${color.border};
    --label: ${color.label};
    --hover-fill: ${color.hover};
    --hover-label: ${color.hoverLabel};
    --active-fill: ${color.active};
    --active-label: ${color.activeLabel};
    --ring: ${color.ring};`;

// Built as a string from design token variables and the colors above, which
// Lit's `css` tag can't interpolate; nothing in it comes from a caller.
export const buttonStyles = unsafeCSS(`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none;
  }

  button {${declarations(colors.red)}
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0;
    padding: 9px 28px;
    border: 2px solid var(--border);
    border-radius: 256px;
    background-color: var(--fill);
    color: var(--label);
    font-family: proxima-nova-condensed, "Proxima Nova Condensed", proxima-nova, calibri, sans-serif;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0.14px;
    text-align: center;
    cursor: pointer;
    transition-property: color, background-color, border-color;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  }

  button:hover,
  button:focus-visible {
    background-color: var(--hover-fill);
    border-color: var(--hover-fill);
    color: var(--hover-label);
  }

  button:focus-visible {
    outline: ${az.focusRing.width.md} solid var(--ring);
    outline-offset: 2px;
  }

  button:active {
    background-color: var(--active-fill);
    border-color: var(--active-fill);
    color: var(--active-label);
  }

  :host([size="small"]) button {
    padding: 3px 11px;
    font-size: 16px;
    line-height: 19px;
  }

  :host([size="large"]) button {
    padding: 12px 34px;
    font-size: 22px;
    line-height: 27px;
    letter-spacing: 0.18px;
  }
${Object.entries(colors)
  .map(([name, color]) => `\n  :host([color="${name}"]) button {${declarations(color)}\n  }\n`)
  .join('')}
  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
`);
