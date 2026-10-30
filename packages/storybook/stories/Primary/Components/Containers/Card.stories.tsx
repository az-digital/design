import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { checkContract } from '../contractCheck';

// Arizona Bootstrap's 5.3.x branch, compiled from its Sass with the patches in
// the repo's patches/ folder (see .storybook/arizona-bootstrap.scss). The card
// styles are az-digital/arizona-bootstrap#2365's, merged into 5.3.x.
//
// These stories are contract checks: each renders a clickable card with the
// markup in #2365's docs, and its play function compares it with the card and
// clickable card contracts.

// A 5:3 placeholder photo, the image and text card's shape. Arizona Bootstrap
// draws the photo at its own shape, so the site's photo sets it.
const photo = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="#868e96"/><circle cx="430" cy="110" r="50" fill="#adb5bd"/><path d="M0 360 L190 190 L330 280 L440 215 L600 325 L600 360 Z" fill="#6c757d"/></svg>')}`;

type CardArgs = { kind: 'text' | 'icon' | 'image' };

const meta = {
  title: 'Primary/Components/Containers/Card',
  tags: ['!dev'],
  render: ({ kind }) => (
    <div style={{ width: '18rem', padding: '2rem' }}>
      <div className={['card', 'bg-cloud', 'hover', kind === 'image' && 'overflow-hidden'].filter(Boolean).join(' ')}>
        {kind === 'image' && (
          <div className="overflow-hidden">
            <img className="card-img-top img-fluid hover-img-zoom-in" src={photo} alt="" />
          </div>
        )}
        <div className="card-body">
          {kind === 'icon' && (
            <span
              className="card-icon material-symbols-rounded fw-light"
              style={{ fontVariationSettings: "'FILL' 0" }}
              aria-hidden="true"
            >
              person_raised_hand
            </span>
          )}
          <h3 className="card-title h5 fw-bold mb-2">
            <a href="#card" className="stretched-link text-reset text-decoration-none">
              Future Students
            </a>
          </h3>
          <p className="card-text">Close-to-home flexibility with locations across the state of Arizona.</p>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
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
    await expect([...checkContract(target, 'card'), ...checkContract(target, 'clickable-card')]).toEqual([]);
  },
} satisfies Meta<CardArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextOnly: Story = { args: { kind: 'text' } };

export const Icon: Story = { args: { kind: 'icon' } };

export const ImageAndText: Story = { args: { kind: 'image' } };
