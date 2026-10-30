import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { checkContract } from '../../contractCheck';

// What the card stories share. Every card is drawn with Arizona Bootstrap's
// 5.3.x branch, compiled from its Sass with the patches in the repo's patches/
// folder (see .storybook/arizona-bootstrap.scss). The card styles are
// az-digital/arizona-bootstrap#2365's, merged into 5.3.x, and the markup follows
// its docs.

// A 5:3 placeholder photo, the Image Card's shape. Arizona Bootstrap draws the
// photo at its own shape, so the site's photo sets it.
export const widePhoto = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="#868e96"/><circle cx="430" cy="110" r="50" fill="#adb5bd"/><path d="M0 360 L190 190 L330 280 L440 215 L600 325 L600 360 Z" fill="#6c757d"/></svg>')}`;

// A square placeholder photo, for the Title on Image Card.
export const squarePhoto = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#868e96"/><circle cx="430" cy="170" r="70" fill="#adb5bd"/><path d="M0 600 L190 320 L330 470 L440 360 L600 540 L600 600 Z" fill="#6c757d"/></svg>')}`;

// One card, at the Figma Card component's width: 416px, three across the 1296px
// container. A card has no width of its own; in a site, the grid column sets it.
export function Frame({ children }: { children: ReactNode }) {
  return <div style={{ width: '416px', maxWidth: '100%', padding: '2rem 0' }}>{children}</div>;
}

// A contract check for a card whose title link covers it: compares the card with
// its contract, at rest and with keyboard focus on the title link.
export const checkLinkCard =
  (contract: string) =>
  async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('.card')!;
    const part = (selector: string) => root.querySelector<HTMLElement>(selector) ?? undefined;
    const parts = Object.fromEntries(
      Object.entries({
        root,
        image: part('.card-img-top'),
        body: part('.card-body'),
        icon: part('.card-icon'),
        title: part('.card-title'),
        text: part('.card-text'),
      }).filter(([, element]) => element),
    ) as { root: HTMLElement } & Record<string, HTMLElement>;
    // Wait for the icon font, so the icon is drawn at its size.
    await document.fonts.ready;
    // Arizona Bootstrap draws hover and keyboard focus with one rule,
    // .card.bg-cloud.hover:is(:hover, :focus-visible, :has(:focus-visible)), so
    // hover is read with keyboard focus on the title link.
    const target = { parts, focus: part('.stretched-link'), hover: 'focus-visible' as const };
    await expect(checkContract(target, contract)).toEqual([]);
  };
