# Writing stories and docs pages in this package

## Dev server

`npm run dev` (or `dev:storybook` from the repo root) watches story, token,
and component source files automatically via Vite — editing a `.stories.tsx`,
`.mdx`, `tokens.json`, or a component source file never needs a restart, the
browser picks it up live. A `.storybook/main.ts` or `.storybook/preview.ts`
change (e.g. registering a new addon) is different: those are read once at
boot, so the dev server needs an actual kill-and-restart for that specific
kind of change to take effect. Don't restart reflexively for ordinary story
edits — only for config-file changes like this.

## Page structure

- One combined Docs page per component, not a nested "Guidelines" page.
  Attach the MDX doc to the component's own title with `<Meta of={ButtonStories} />`
  (import `* as ButtonStories from './button.stories'`) — not `<Meta title="Components/Button/Guidelines" />`.
  `of={}` makes the MDX page replace the autodocs entry for that exact title,
  so it appears as the top-level "Docs" entry alongside the component's
  stories in the sidebar, not as a separate child page.
- A full, general component token table lives on that same main Docs page
  (e.g. `<TokenTable filter="az.component.button.**" />`) — the one broad
  reference for the whole component. Don't split it out to a sub-page by
  default.
- A per-story state comparison (Default/Hover/Focus-visible, etc.) does not
  live on the main Docs page — it lives on that story's own individual page,
  via `TokenStatePreview` (see "Comparing interaction states" below). The
  Docs page only gets the one general, full token table plus a `<Source
  of={...}/>` code-only block for any story whose approved frame needs a
  non-default detail (e.g. a non-white background) called out — not a
  second live `<Canvas>` (see the Canvas limitation further down) and not a
  repeat of the state comparison.
- Reserve a nested sub-page (`Components/Button/Something`, mirroring
  `Tokens/Contributing`) for content that's genuinely separate — a
  contribution workflow, tooling instructions — not for splitting the main
  component reference apart by default. If unsure whether something belongs
  on the main page or a sub-page, default to the main page.
- The sidebar's component folder links to its Docs page via
  `.storybook/manager.tsx`'s `sidebar.renderLabel` (checks
  `item.children.includes(`${item.id}--docs`)`); this is already wired up
  project-wide, not something to configure per component.

## Stories

- Fixed reference stories (mirroring one approved Figma frame) disable
  Controls (`parameters.controls.disable: true`). If Controls stay on,
  editing args can turn "Outline" into a solid blue button while the sidebar
  still says "Outline" — Storybook has no way to update a story's name as its
  args change. Keep exactly one story (commonly `Default`, or whatever the
  approved combination is called) as the interactive playground with
  Controls enabled; every other named story is a fixed snapshot.
- Disable Actions/Interactions tabs on a story that doesn't use them
  (`parameters.actions.disable` / `parameters.interactions.disable`) rather
  than leaving empty panel tabs. Remove the `disable` once a story actually
  adds an `action()` argType or a `play` function.
- Only add a story for a prop combination with an approved Figma frame (or
  equivalent design sign-off) to mirror. A component can fully support
  `outline`/`blue`/`disabled` etc. with zero example stories for them —
  describe them in prose on the Docs page and point at the props table,
  rather than inventing a story for an unreviewed combination.

## Comparing interaction states

To show what a component looks like in more than one state (Default, Hover,
Focus-visible, ...), render it once per state side by side via
`TokenStatePreview` (`stories/TokenStatePreview.tsx`) rather than one live
instance that changes as a viewer actually hovers/tabs to it. Two reasons:

- Real `:hover` and `:focus-visible` can't all be true at once across
  separate side-by-side instances — there's no way to make one instance
  "stay hovered" while showing another as focused, since both depend on
  actual pointer position / input history, not a settable flag. Showing all
  states at once necessarily means recreating each look from its resolved
  token value (via a small scoped `<style>` block), not a live pseudo-class
  test — this documents design intent, same as a "Tokens by state" table
  does, not live CSS behavior (see "Design tokens vs. CSS vs. Figma" below).
- It sidesteps needing a hand-built, per-state token list at all. Pass
  `TokenStatePreview` one `tokenFilter` and it renders the full,
  always-visible `TokenTable` for that filter below the state row —
  `TokenTable` already expands a row in place on click to show its
  description and alias chain (built into `@unpunnyfuns/swatchbook-addon`,
  confirmed by reading its own type definitions) — don't hand-roll an alias
  chain renderer or a hover/focus-driven token list again; both were tried
  here first and replaced by this.

A real, functional interaction check (does focus actually land, does an
`onClick` fire) still belongs in a `play` function — that's a different
question (does it work) from what `TokenStatePreview` answers (what does
each state look like).

## `play` functions / Interactions panel

- Destructure `canvas` directly from the play function args and use
  `canvas.getByRole(...)` etc. Don't wrap it in `within(canvas)` — `canvas`
  already has the query methods, and `within()` on it is invalid.
- Every interaction needs an assertion of its observable outcome. An action
  with nothing checked afterward verifies nothing.
- Label steps with `step('plain-English description', async () => {...})`.
  Without it, the Interactions panel shows raw generated call text like
  `userEvent.hover(within(<div#storybook-root>).getByRole("button"))`, which
  isn't legible to someone who didn't write it.
- `userEvent.hover()` (or any JS-dispatched pointer/mouse event) does not
  trigger real `:hover` CSS pseudo-class matching in a browser. Browsers
  track hover state from actual pointer position, not from which events were
  dispatched — confirmed directly: `element.matches(':hover')` stays `false`
  after dispatching a full `pointerover`/`mouseover`/`pointermove`/`mousemove`
  sequence via JS. Don't assert hover-driven visual state from a play
  function. `.focus()` doesn't have this limitation for plain focus — real
  logical focus (`expect(el).toHaveFocus()`) is reliable from a play
  function.
- `.focus()` is *not* reliable for `:focus-visible` specifically, unlike
  plain focus above. Whether a scripted `.focus()` call matches
  `:focus-visible` depends on the browser's own heuristic about the last
  input modality it saw — confirmed directly: the identical `.focus()` call
  matched `:focus-visible` on a freshly loaded page but did not once a real
  mouse click had happened first in that same browser context. A real
  keyboard `Tab` press (real hardware/automation input, not a dispatched
  `KeyboardEvent`) is the only reliable way to reproduce `:focus-visible`.
  Don't write a play function that asserts `:focus-visible`-gated styling —
  assert plain focus reachability only (see `SolidRedOnWhite`'s play
  function in `button.stories.tsx`), and use `TokenStatePreview` (below) if
  you need to actually show what focus-visible looks like.

## Design tokens vs. CSS vs. Figma

These are three separate questions. Keep them separate:

1. What does `tokens.json` define? Read `packages/tokens/tokens.json` (or the
   generated `TokenTable`/`ColorPalette` blocks), not component CSS.
2. What does the shipped CSS currently do? If this needs answering, verify
   empirically in a real browser (genuine click/hover/Tab-key input,
   `getComputedStyle`, `.matches(':hover')`), not by reading a
   compiled/vendored stylesheet. A vendored CSS file (e.g. the bundled
   Arizona Bootstrap stylesheet) can define the same selector block more
   than once with different values; only the last one in the cascade wins,
   and a simple grep can surface the wrong one first.
3. Which token corresponds to which state, per the design spec? Answer this
   from the Figma spec plus `tokens.json`, with no reference to the shipped
   CSS. This is what a component's "Tokens by state" section is for — it
   documents intent, not implementation status. Don't add commentary about
   whether the real CSS matches; that's question 2, and it belongs in a
   different place if it belongs anywhere.

A CSS custom property is not a design token. `var(--bs-btn-hover-bg)` and
`az.color.brand.chili` are different kinds of thing — one is a CSS authoring
mechanism, the other is a named design decision in `tokens.json`. Whether a
stylesheet's compiled output references (or doesn't reference) a `--az-*`
custom property says nothing about whether a design token was used to define
it, especially for a third-party/vendored stylesheet built by a separate
pipeline. Don't grep compiled CSS for `var(--az-` and report the result as a
finding about design tokens.

## Token chips

For a compact, single-token reference (path, type badge, color swatch,
value — no search box or heading):

```mdx
<TokenTable filter="az.color.brand.chili" searchable={false} caption="" />
```

An exact (non-wildcard) `filter` path narrows the table to that one row;
`searchable={false}` and `caption=""` remove the search box and header text.
`<ColorPalette filter="..." />` renders a larger card and is the wrong
component for this — use `TokenTable` with an exact filter instead.

Don't wrap non-`<Story>` content in `<Canvas>`. In this Storybook version
(10.6.0), `<Canvas>` silently falls back to rendering the docs page's primary
story when given children that aren't a recognized `<Story>` block, so
`<Canvas><TokenTable .../></Canvas>` renders the button, not the token table,
with no error. Render `<TokenTable>` (or any other plain component) as
direct JSX, without a `<Canvas>` wrapper.

A second `<Canvas><Story of={X}/></Canvas>` on an attached MDX docs page does
not work correctly in this Storybook version: it always re-renders the first
story's canvas regardless of what `X` is, whether passed as an object
reference or a plain `id` string (confirmed after a full cache clear and
restart). If more than one live story-backed example is needed on one docs
page, render non-story content as plain JSX instead, or keep only one live
`<Canvas>` per page.

To show a second story's *code* (not a live render) on the docs page,
`<Source of={ButtonStories.SolidRedOnCoolGray} />` (from
`@storybook/addon-docs/blocks`) works without hitting the limitation above —
it reads through the same `docs.source.transform` as the main Canvas's own
"Show code" toggle, but doesn't mount a second live canvas at all, so it
isn't subject to the same-canvas-reuse bug. Use it for exactly this: a
second story's code example on a page that only has room for one live
`<Canvas>`.
