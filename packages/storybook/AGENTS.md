# Writing stories and docs pages in this package

## Purpose: this is a brand documentation site

This Storybook documents the *real, approved* design system — it is not a
sandbox for constructing every prop combination a component happens to be
capable of rendering. Keep that distinction in front of every decision here:

- Only document a combination that mirrors an approved Figma frame (or
  equivalent design sign-off). Don't build generic pickers/playgrounds that
  let a viewer freely combine props into something nobody actually approved
  — see "Only add a story for a prop combination with an approved Figma
  frame" under Stories. Background-paired colors stay out of the untethered
  Color control for the same reason: picking one there produces a combination
  nothing approved.
- Never invent a prop value, CSS class, or a mapping between them to make a
  component *look* supported when it isn't. A real incident from this
  project: `color: 'rain'` was briefly implemented by silently mapping it to
  the legacy `.btn-sky` class so it would render styled — this made the
  component lie about what it actually does; a consumer using the real
  component outside Storybook would never get that hidden mapping. Generate
  classes naively from the real prop value (`btn-${color}`) even when the
  CSS for it doesn't exist yet.
- If something genuinely isn't implemented yet (no CSS, no token), document
  that plainly — a "not yet implemented" doc comment, or a placeholder in the
  story — rather than papering over the gap so it looks finished.
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
  component's stories, with its Docs page last. Buttons has no landing
  page or other patterns, so Button is that whole entry,
  `Primary/Components/Buttons` (`Buttons/Button.mdx` and
  `Buttons/Button.stories.tsx`): its Docs page, then its stories. A component's
  docs page follows the layout in the root `AGENTS.md` ("Component docs
  pages").
- One combined Docs page per component, not a nested "Guidelines" page.
  Attach the MDX doc to the component's own title with `<Meta of={ButtonStories} />`
  (import `* as ButtonStories from './Button.stories'`) — not `<Meta title="Primary/Components/Buttons/Guidelines" />`.
  `of={}` makes the MDX page replace the autodocs entry for that exact title,
  so it appears as the top-level "Docs" entry alongside the component's
  stories in the sidebar, not as a separate child page.
- A component's design decisions live in its contract
  (`packages/contracts/contracts/`) and show on its Docs page through
  `<ContractAnatomy contract="…" />`; shared decisions show as design token
  pills (`<Token data={getTokenData('az.color.bg.button.red')} />`). Don't
  list a design token the contract doesn't use, and don't split the reference
  out to a sub-page by default.
- Show a code-only `<Source of={...}/>` block for a story whose approved frame
  needs a non-default detail (such as a non-white background) called out, not
  a second live `<Canvas>` (see the Canvas limitation further down).
- Reserve a nested sub-page (`Primary/Components/Buttons/Something`, mirroring
  `Primary/Foundations/Tokens/Contributing`) for content that's genuinely separate — a
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
- A component that more than one library implements spreads
  `componentStories('<contract id>', { props })` into its meta and lists its
  libraries as tags (`tags: ['lib:html', 'lib:react']`). The toolbar's Library
  menu then picks which library every story renders with, and the Code panel
  and docs **Show code** follow it. Don't branch on the library inside a
  story, and don't write a per-story `render` or `docs.source.transform` for
  it. Each library's adapter (its `./storybook` export) says how the component
  draws and what code a site would write; see
  `packages/storybook-addon-libraries/README.md`. Pass other parameters (such
  as a Figma design link) through `componentStories`' `parameters` option,
  because spreading meta-level `parameters` after it would replace its own and
  hide the Code panel.
- A story that doesn't use a library component (plain markup) sets
  `parameters.docs.source.code` so its Code panel shows a clean snippet
  instead of the story's `render` function body.

## Comparing interaction states

Hover and keyboard focus come from the pointer and keyboard on the live
component. Real `:hover` and `:focus-visible` can't all be true at once across
separate side-by-side instances, so a page that needs to show several states
at once describes each state in its prose or contract, with the design token
or value that sets it, and doesn't recreate the look with a scoped `<style>`
block. A real, functional interaction check (does focus land, does an
`onClick` fire) belongs in a `play` function.

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
  assert plain focus reachability only, and check what focus-visible looks
  like in a real browser with a real <kbd>Tab</kbd> press.

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
3. Which token corresponds to which state, per the design spec? Answer this
   from the Figma spec plus `tokens.json`, with no reference to the shipped
   CSS. This is what a component's "Tokens by state" section is for — it
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

A story with a Figma frame links it so a reviewer can compare. Where `@storybook/addon-designs` is
registered, set `parameters.design` to show the frames in the **Design** tab. Link to the variants in
the master **Buttons** component set (node `2017:6282`, under "Master
Components - DO NOT EDIT" in the AZ Digital UX Design System file), not to
copies placed on design pages, which get moved or deleted. Give each story one
design per state it previews (Default, Hover, Focus), named after the state. Viewers need to be logged in to Figma
to see the embed.

## Arizona Bootstrap in stories

Stories render Arizona Bootstrap compiled from its own Sass source
(`.storybook/arizona-bootstrap.scss`), installed from GitHub at a release's
tag. Where it doesn't match a contract yet, the fix is a patch to its Sass in
`patches/`, which its maintainers can apply as a pull request; see "Patching
Arizona Bootstrap" in the root `README.md`. Don't restyle a component with CSS
rules or overridden values in Storybook.

## Token references

All token UI comes from `@az-digital/storybook-addon-tokens`
(`packages/storybook-addon-tokens`, see its README). Import doc blocks from the
package, never from `./stories`:

```mdx
import { Token, TokenDisplay, getTokenData } from '@az-digital/storybook-addon-tokens';

<Token data={getTokenData('az.color.bg.button.red')} />
<TokenDisplay prefix="az.color.bg.button." layout="table" />
```

- Use the package's `Token` pill (and its details drawer) for any single token
  reference; don't build another pill or drawer.
- Token rows show the token path, `$type`, "Alias of", and the resolved value.
  Platform names (CSS variables, Sass variables, ...) belong in the details
  view's Outputs, which come from the Style Dictionary config, not in a row.
- The **Tokens** tab is opt-in, like Controls: it appears only on stories that
  set `parameters.tokens`, usually once on the story file's meta:

  ```ts
  parameters: { tokens: ['az.color.bg.button.', 'az.focus-ring.'] } // prefix string, string[], or { disable: true }
  ```

- Values in stories come from the package's `resolveValue(path)`, which
  reads the same data as the doc blocks.
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
`<Source of={ButtonStories.SolidRedOnCloud} />` (from
`@storybook/addon-docs/blocks`) works without hitting the limitation above —
it reads through the same `docs.source.transform` as the main Canvas's own
"Show code" toggle, but doesn't mount a second live canvas at all, so it
isn't subject to the same-canvas-reuse bug. Use it for exactly this: a
second story's code example on a page that only has room for one live
`<Canvas>`.
