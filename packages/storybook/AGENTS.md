# Writing stories and docs pages in this package

## Purpose: this is a brand documentation site

This Storybook documents the *real, approved* design system — it is not a
sandbox for constructing every prop combination a component happens to be
capable of rendering. Keep that distinction in front of every decision here:

- Only document a combination that mirrors an approved Figma frame (or
  equivalent design sign-off). Don't build generic pickers/playgrounds that
  let a viewer freely combine props into something nobody actually approved
  — see "Only add a story for a prop combination with an approved Figma
  frame" under Stories.
- Never invent a prop value, CSS class, or a mapping between them to make a
  component *look* supported when it isn't. A real incident from this
  project: `color: 'rain'` was briefly implemented by silently mapping it to
  the legacy `.btn-sky` class so it would render styled — this made the
  component lie about what it actually does; a consumer using the real
  component outside Storybook would never get that hidden mapping. Generate
  classes naively from the real prop value (`btn-${color}`) even when the
  CSS for it doesn't exist yet.
- If something genuinely isn't implemented yet (no CSS, no token), document
  that plainly — a "not yet implemented" doc comment, an explicit
  placeholder in the story — rather than papering over the gap so it looks
  finished.
- If there's no design token for a color (or other value), don't mention it
  in the docs prose at all. Documenting something with no token behind it
  misrepresents the design system's actual state.

## Dev server

`npm run dev` (or `dev:storybook` from the repo root) watches story, token,
and component source files automatically via Vite — editing a `.stories.tsx`,
`.mdx`, `tokens.json`, or a component source file never needs a restart, the
browser picks it up live. A `.storybook/main.ts` or `.storybook/preview.ts`
change (e.g. registering a new addon) is different: those are read once at
boot, so the dev server needs an actual kill-and-restart for that specific
kind of change to take effect. Don't restart reflexively for ordinary story
edits — only for config-file changes like this.

## Accessibility (`@storybook/addon-a11y`)

Installed and registered in `.storybook/main.ts`, pinned to the same
`^10.6.0` as the rest of the Storybook packages (it's an official
Storybook-maintained addon, built on axe-core — not a third-party
alternative). Adds an "Accessibility" tab per story with automated
axe-core checks (violations/passes/inconclusive). No `preview.ts` wiring is
required beyond registering it in `main.ts`; that's the whole setup.

Registering a new addon is a `main.ts` change, so it needs the dev-server
restart described above, not just a file save.

In an automated/sandboxed browser context (not a real user's browser), both
this panel and the per-story "Code" panel (see below) can hang indefinitely
on their loading state ("Preparing accessibility scan", or stale/raw
content) for reasons specific to that environment — confirmed directly:
a real browser showed correct results (21 passes, 0 violations) for the
exact same story at the exact same time an automated session was still
stuck loading. Don't conclude something is broken from an automated
session alone; verify in an actual browser, or ask the user to.

## Page structure

- Component pages live in the site's information architecture, under
  `stories/Primary/Components/<Group>/`. When that folder already has a
  placeholder page for the component (e.g. `Containers/Card.mdx`), the
  component's Docs page replaces it: keep the placeholder's title as the
  stories' `title`. A group's own landing page (`<Group>/Docs.mdx`, titled
  `Primary/Components/<Group>`) is not a component placeholder: leave it,
  and give the component its own title inside the group. Don't nest other
  pages under a component's own title: Storybook lists them in among the
  component's stories, with its Docs page last. Button, for example, is
  `Primary/Components/Buttons/Button` (`Buttons/Button.mdx` and
  `Buttons/Button.stories.tsx`), under the Buttons landing page. Shared story
  helpers (`implementations.tsx`) stay at the root of `stories/`.
- One combined Docs page per component, not a nested "Guidelines" page.
  Attach the MDX doc to the component's own title with `<Meta of={ButtonStories} />`
  (import `* as ButtonStories from './Button.stories'`) — not `<Meta title="Primary/Components/Buttons/Guidelines" />`.
  `of={}` makes the MDX page replace the autodocs entry for that exact title,
  so it appears as the top-level "Docs" entry alongside the component's
  stories in the sidebar, not as a separate child page.
- The component's anatomy lives on that same Docs page, read from its
  contract (`packages/contracts`): `<ContractAnatomy contract="button" />`,
  plus one per variant option (`variant="size.small"`). Don't split it out to
  a sub-page by default. Beyond the anatomy, the Docs page gets a `<Source
  of={...}/>` code-only block for any story whose approved frame needs a
  non-default detail (e.g. a non-white background) called out, not a second
  live `<Canvas>` (see the Canvas limitation further down).
- Reserve a nested sub-page (`Primary/Components/Buttons/Something`, mirroring
  `Primary/Tokens/Contributing`) for content that's genuinely separate — a
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
- Every story needs a `parameters.implementations` (or, if the meta already
  sets one, `parameters.implementationsOverride`) entry, or its own
  individual-story "Code" panel tab falls back to dumping the raw literal
  story source (the actual `render: () => ...` function body) instead of a clean, copyable snippet — confirmed directly: a
  story rendering plain markup with no `implementations` set showed the raw
  source verbatim. Use `parameters.implementationsOverride`, not
  `parameters.implementations`, on any story under a meta that already sets
  `parameters.implementations` — Storybook deep-merges `parameters`, so
  setting `implementations` again at the story level merges into the meta's
  map instead of replacing it (see the comment on `docs.source.transform` in
  `preview.ts`). A story with no shared meta-level `implementations` to
  collide with (i.e. it doesn't use `renderImplementation`/args at all) can
  use plain `parameters.implementations`.

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
  assert plain focus reachability only. A contract check (`checkContract`)
  presses a real Tab key, so it can compare focus-visible styling.

## Design tokens vs. CSS vs. Figma

These are three separate questions. Keep them separate:

1. What does `tokens.json` define? Read `packages/tokens/tokens.json` (or the
   generated `TokenDisplay`/`ColorPalette` blocks), not component CSS.
2. What does the shipped CSS currently do? If this needs answering, verify
   empirically in a real browser (genuine click/hover/Tab-key input,
   `getComputedStyle`, `.matches(':hover')`), not by reading a
   compiled/vendored stylesheet. A vendored CSS file (e.g. the bundled
   Arizona Bootstrap stylesheet) can define the same selector block more
   than once with different values; only the last one in the cascade wins,
   and a simple grep can surface the wrong one first.
3. Which token or value each part takes in each state, per the design spec?
   Answer this from the Figma spec and the component's contract
   (`packages/contracts`), with no reference to the shipped CSS. This is what
   a component's Anatomy section is for — it
   documents intent, not implementation status. Don't add commentary about
   whether the real CSS matches; that's question 2, and it belongs in a
   different place if it belongs anywhere.

A CSS custom property is not a design token. `var(--bs-btn-hover-bg)` and
`az.color.brand.sonoran-red` are different kinds of thing — one is a CSS authoring
mechanism, the other is a named design decision in `tokens.json`. Whether a
stylesheet's compiled output references (or doesn't reference) a `--az-*`
custom property says nothing about whether a design token was used to define
it, especially for a third-party/vendored stylesheet built by a separate
pipeline. Don't grep compiled CSS for `var(--az-` and report the result as a
finding about design tokens.

## Figma designs

Every story sets `parameters.design` so the **Design** tab
(`@storybook/addon-designs`) shows its Figma frames. Link to the variants in
the master **Buttons** component set (node `2017:6282`, under "Master
Components - DO NOT EDIT" in the AZ Digital UX Design System file), not to
copies placed on design pages, which get moved or deleted. Give each story one
design per state it previews (Default, Hover, Focus), named after the state. Viewers need to be logged in to Figma
to see the embed.

## Arizona Bootstrap

Stories render Arizona Bootstrap's latest release from the CDN, as it ships.
There's no shim: where the release and a contract differ, the contract's pull
request gives update instructions, and once an implementation is updated, a
contract check story (`checkContract`) keeps the two in step.

## Token references

All token UI comes from `@az-digital/storybook-addon-tokens`
(`packages/storybook-addon-tokens`, see its README). Import doc blocks from the
package, never from `./stories`:

```mdx
import { ColorSwatchGrid, TokenDisplay } from '@az-digital/storybook-addon-tokens';

<TokenDisplay prefix="az.color.bg." layout="table" />
```

- Use the package's `Token` pill (and its details drawer) for any single token
  reference; don't build another pill or drawer.
- Token rows show the token path, `$type`, "Alias of", and the resolved value.
  Platform names (CSS variables, Sass variables, ...) belong in the details
  view's Outputs, which come from the Style Dictionary config, not in a row.
- The **Tokens** tab is opt-in, like Controls: it appears only on stories that
  set `parameters.tokens`, usually once on the story file's meta:

  ```ts
  parameters: { tokens: ['az.color.bg.button.', 'az.color.fg.'] } // prefix string, string[], or { disable: true }
  ```

- Values in stories come from the package's
  `resolveValue(path)`, which reads the same data as the doc blocks.
- The addon reloads when `tokens.json` or the Style Dictionary config changes.
  Changes to the addon's own `manager.tsx` (or the `Token` / `TokenTable` files
  it imports) still need a Storybook restart, and files the manager imports
  need a default `React` import for its classic JSX runtime.

Don't wrap non-`<Story>` content in `<Canvas>`. In this Storybook version
(10.6.0), `<Canvas>` silently falls back to rendering the docs page's primary
story when given children that aren't a recognized `<Story>` block. Render
`TokenDisplay` (or any other plain component) as direct JSX, without a
`<Canvas>` wrapper.

A second `<Canvas><Story of={X}/></Canvas>` on an attached MDX docs page does
not work correctly in this Storybook version: it always re-renders the first
story's canvas regardless of what `X` is, whether passed as an object
reference or a plain `id` string (confirmed after a full cache clear and
restart). If more than one live story-backed example is needed on one docs
page, render non-story content as plain JSX instead, or keep only one live
`<Canvas>` per page.

To show a second story's *code* (not a live render) on the docs page,
`<Source of={TabsStories.Justified} />` (from
`@storybook/addon-docs/blocks`) works without hitting the limitation above —
it reads through the same `docs.source.transform` as the main Canvas's own
"Show code" toggle, but doesn't mount a second live canvas at all, so it
isn't subject to the same-canvas-reuse bug. Use it for exactly this: a
second story's code example on a page that only has room for one live
`<Canvas>`.
