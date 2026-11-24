import type { ReactNode } from 'react';

// What the card stories share. Every card is drawn with Arizona Bootstrap
// v5.3.0, compiled from its Sass with the patches in the repo's patches/ folder
// (see .storybook/arizona-bootstrap.scss). The card styles are
// az-digital/arizona-bootstrap#2365's, released in v5.3.0, and the markup follows
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
