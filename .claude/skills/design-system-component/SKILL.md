---
name: design-system-component
description: >-
  Use this skill whenever adding, scaffolding, or editing a design-system
  component (Button, Card, Input, Alert, etc.) in this repo, or writing/updating
  a Storybook story for one. Also use it whenever asked to follow "the
  component pattern", add an "HTML and/or React version" of something, wire
  up a Storybook implementation toggle, or add/associate design tokens with a
  component — this repo can ship a component as React, as plain HTML, or
  both, with a shared Storybook toolbar switcher and code panel across all of
  them, and every component is expected to have its own component-tier
  design tokens too. The wiring has real gotchas (see below) that are easy
  to get wrong by improvising instead of following this structure.
applyTo: "packages/components-react/**,packages/components-html/**,packages/storybook/stories/**,packages/storybook/.storybook/**,packages/tokens/tokens.json"
---

# Design-system component pattern

Components in this repo can have a React implementation
(`@az-digital/components-react`), a plain HTML/CSS implementation
(`@az-digital/components-html`), or both — whichever a component actually
needs. There's no requirement that every component exist in every package;
a component only needed in a React app doesn't need an HTML version, and one
only needed in a Drupal theme doesn't need React. A single Storybook story
still drives whichever implementations a component has from the same args,
via a shared toolbar switcher and docs code panel.

`packages/storybook/stories/button.stories.tsx` (both implementations) and
`packages/storybook/stories/implementations.tsx` (the shared machinery) are
the reference — read them alongside this skill. Everything below explains
the *why* behind their shape so you can extend the pattern to a new
component correctly.

## Why two packages, not one

- `components-html` is what a Drupal theme (or any non-React consumer) can use
  directly — it's just a function that returns an HTML string using Arizona
  Bootstrap's real CSS classes. No framework, no build step to consume.
- `components-react` is the React component for React/Next.js apps.
- When a component has both, they share the same prop shape (color, style,
  size, etc.) on purpose, so one set of Storybook args/controls can drive
  either implementation without translation.
- Neither package is Drupal-specific (no Twig/SDC). Drupal's own templates
  live in `az_quickstart`/`az_barrio` and are out of scope here — don't pull
  them into this repo.
- It's called `components-html`, not `components-web`, on purpose: "web
  components" is a real, distinct thing — the Lit-based custom elements in
  the separate `az-web-components` project (candidate for a future
  `packages/components-web`, per issue #16). Keep that name free; this
  package is plain HTML/CSS, nothing more.

## Adding a new component: file layout

For a component named `Card` that needs both implementations, you'd create:

```
packages/components-react/src/components/Card/Card.tsx   # React implementation
packages/components-react/src/components/Card/index.ts   # export * from './Card'
packages/components-html/src/Card.ts                      # renderCard(props): string
packages/storybook/stories/card.stories.tsx               # the story
packages/tokens/tokens.json                                # az.component.card.* entries — see below
```

If `Card` only needs one implementation, just skip the package it doesn't
need — the story (below) reflects that by only filling in the
`implementations` key(s) that exist. Add whichever exports you do create to
that package's barrel file (`packages/components-react/src/index.ts` and/or
`packages/components-html/src/index.ts`). The token entries aren't optional
the same way, though — every component is expected to have some, however
small (see "Component tokens" below).

### `components-react/src/components/<Name>/<Name>.tsx`

Follow `Button.tsx`'s shape: a `forwardRef` function component, a props type
whose fields double as the story's args (so avoid React-only prop types like
`ReactNode` for anything that also needs to exist in the HTML version — plain
strings/booleans/unions travel across both implementations cleanly), and
class-name construction that mirrors what the HTML version builds.

**Hand-roll simple presentational components (like `Button`), but wrap
`react-bootstrap` for anything with real interactive behavior** — Modal,
Dropdown, Accordion, Offcanvas, Tooltip/Popover, Nav/Tabs, and similar.
`react-bootstrap` is already a dependency of this package. It's the right
default here, not just "a" option: it's actively maintained (chosen over
`reactstrap`, which hasn't had a commit in ~2 years), doesn't ship its own
CSS (it expects you to bring Bootstrap's, which we already load from the
Arizona Bootstrap CDN), and builds class names the same way our hand-rolled
components do — literal `` `${prefix}-${variant}` `` string concatenation.
That last point means Arizona Bootstrap's custom variants (`red`, `blue`,
`sky`, etc., not just Bootstrap's stock `primary`/`secondary`/...) work
through its `variant` prop with no type augmentation, because its variant
types end in `| (string & {})` — a real string escape hatch, not just a
fixed enum. Verified directly: `<Accordion>` from `react-bootstrap` renders
correctly against our CSS and its collapse/expand, focus ring, and ARIA
attributes all work out of the box.

The reasoning for hand-rolling vs. wrapping is about where the risk is:
a presentational component like `Button` is just markup and class names —
easy to get right by hand, and there's little upside to a dependency for it.
Something like a Modal involves focus-trapping, portals, escape-key
handling, and correct ARIA — easy to get subtly wrong, expensive to test
properly, and `react-bootstrap` has already done that work against the same
Bootstrap 5 markup Arizona Bootstrap extends. When wrapping one, keep the
same discipline as the hand-rolled components: your wrapper's prop names
should still match `components-html`'s prop shape where an HTML equivalent
exists, so one story can still drive both from the same args.

### `components-html/src/<Name>.ts`

Export a `render<Name>(props): string` function. Build the class list the
same way the React version does, and escape any interpolated text content
(see `escapeHtml` in `Button.ts`) since this is a real HTML string, not JSX.
Keep the prop type name and shape identical to the React version's props
(minus anything React-only, like `children` vs. a plain `text` string) —
that's what lets one story drive both.

### `storybook/stories/<name>.stories.tsx`

This is the part with a real gotcha, so follow the Button story's structure
closely rather than reinventing it. `packages/storybook/stories/implementations.tsx`
holds the shared machinery — import from it rather than re-deriving this per
story:

1. **Build an `Implementations<Args>` map with only the keys you actually
   have**, each an `{ render, source }` pair:

   ```tsx
   import type { Implementations } from './implementations';
   import { renderImplementation } from './implementations';

   const implementations: Implementations<CardArgs> = {
     html: {
       render: (args) => <div dangerouslySetInnerHTML={{ __html: renderCard(args) }} />,
       source: (args) => renderCard(args),
     },
     // react: omitted — Card doesn't have one (yet)
   };
   ```

2. **Use `renderImplementation` as your story's `render` function** — don't
   hand-roll the branching:

   ```tsx
   function CardStory(args: CardArgs, context: StoryContext) {
     return renderImplementation('Card', implementations, args, context);
   }
   ```

   This has to happen inside `render(args, context)` itself, not in a
   `decorators` array — that's the gotcha. Storybook's built-in docs
   source-capture calls `context.originalStoryFn(context.args, context)`
   directly, bypassing any custom decorator. If the implementation swap only
   lives in a decorator, the canvas toggles fine but the docs "Code" panel
   silently keeps showing stale source after switching — it looks like it
   works until someone actually opens the code panel. `renderImplementation`
   already does the right thing here; you just need to call it from `render`,
   not from a decorator.

3. **Pass the same map as `parameters.implementations`.** `.storybook/preview.ts`
   already has the toolbar switcher, `docs.source.transform`, and
   `docs.codePanel: true` wired up generically against this parameter — you
   don't need to touch `preview.ts` for a new component:

   ```tsx
   const meta = {
     title: 'Components/Card',
     render: CardStory,
     parameters: { implementations },
     // ...
   } satisfies Meta<typeof CardArgsShape>;
   ```

4. **Type `meta` against an args-only phantom component, not against your
   render function.** `Meta<T>` expects `T` to be a single-arg `(props) =>
   ReactNode` component, but your `render` function takes `(args, context)`.
   Passing `typeof YourRenderFn` directly to `Meta<T>` produces a confusing
   type error. Instead:

   ```tsx
   // eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic
   function CardArgsShape(_args: CardArgs) {
     return null;
   }
   ```

   The `eslint-disable` is needed because this repo's eslint config doesn't
   set `argsIgnorePattern`, so an underscore-prefixed unused param still
   trips `no-unused-vars` — this is intentional dead code that only exists
   for its type, so silence it rather than working around it.

### Condensed template (both implementations)

```tsx
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Card } from '@az-digital/components-react';
import { renderCard } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

type CardArgs = Parameters<typeof renderCard>[0];

const asReactCode = (args: CardArgs) => {
  /* build a minimal JSX string from non-default args, see button.stories.tsx */
  return `<Card />`;
};

const implementations: Implementations<CardArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderCard(args) }} />,
    source: (args) => renderCard(args),
  },
  react: {
    render: (args) => createElement(Card, { /* map args -> props */ }),
    source: asReactCode,
  },
};

function CardStory(args: CardArgs, context: StoryContext) {
  return renderImplementation('Card', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic
function CardArgsShape(_args: CardArgs) {
  return null;
}

const meta = {
  title: 'Components/Card',
  render: CardStory,
  args: { /* defaults */ },
  parameters: { implementations },
} satisfies Meta<typeof CardArgsShape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

For an HTML-only component, the whole diff from the above is just the
`implementations` object — drop the `react` key (and the now-unused React
imports/`asReactCode`) and everything else stays the same:

```tsx
const implementations: Implementations<CardArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderCard(args) }} />,
    source: (args) => renderCard(args),
  },
};
```

## Partial implementation coverage

The toolbar's Implementation switcher always offers every known kind (`HTML`,
`React`, ...) — Storybook's toolbar items are defined once, globally, in
`preview.ts`, and can't shrink per-story. So a component that only has an
HTML implementation still shows a "React" option in the switcher; selecting
it calls `renderImplementation`, finds no `react` key in that story's
`implementations` map, and renders `ImplementationPlaceholder` instead — a
small "doesn't have a react implementation yet" box with a link to open an
issue. The docs code panel does the equivalent for the code snippet
(`// Not implemented for "react" yet.`). This is deliberate: hiding the
missing option entirely would hide the gap; showing it as a placeholder
turns it into a visible invitation to contribute one.

You don't need to do anything extra to get this — it falls out of just
omitting the key you don't have. Only reach for a full `{ html, react }` map
when the component genuinely needs both.

### When only one *variant* is missing an implementation

Sometimes the component as a whole has both implementations, but one
specific prop value doesn't — e.g. Button's `Success` story: `success` is
Bootstrap's stock semantic color, not an Arizona brand color, so it exists
in `components-html` but not (yet) in `components-react`. That story needs
a *different* `implementations` map than the rest of the component's
stories, not just an omitted key on the shared one.

**Don't do this** — it looks right but silently doesn't work:

```tsx
export const Success: Story = {
  args: { color: 'success' },
  parameters: { implementations: successOnlyImplementations }, // BROKEN
};
```

Storybook deep-merges `parameters` objects across preview/meta/story levels.
Since `meta.parameters.implementations` already has both `html` and `react`
keys, a story setting `parameters: { implementations: successOnlyImplementations }`
(which only has `html`) gets merged *into* that map rather than replacing
it — the `react` key survives the "override" untouched. Verified directly:
this looked correct in the canvas and code panel until actually testing the
React toggle, which kept rendering instead of showing the placeholder.

**Use a distinct parameter name that only ever exists at the story level**,
so there's nothing for Storybook to merge it with — `implementationsOverride`,
already wired up in both `button.stories.tsx`'s `render` function and
`.storybook/preview.ts`'s `docs.source.transform`:

```tsx
const successOnlyImplementations: Implementations<ButtonArgs> = {
  html: implementations.html, // reuse the same html entry, just omit react
};

export const Success: Story = {
  args: { color: 'success' },
  parameters: { implementationsOverride: successOnlyImplementations },
};
```

If you add this pattern to a new component's stories, wire the same
`implementationsOverride` check into that component's `render` function
(`context.parameters.implementationsOverride ?? implementations`) — the
`preview.ts` side is already generic and needs no changes.

### `asReactCode`-style source functions

`source` functions (like `asReactCode` in the Button story) should only emit
props that differ from their defaults, so the snippet stays readable — see
`button.stories.tsx` for the pattern. `htmlSource` can usually just call your
`render<Name>(args)` function directly, since that already returns the exact
markup being shown.

## Styling

Component CSS comes from Arizona Bootstrap's real, versioned CDN build,
loaded once for all stories via `packages/storybook/.storybook/preview-head.html`:

```html
<link rel="stylesheet" href="https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.1.2/css/arizona-bootstrap.css" />
```

Don't write local CSS stubs for a new component — use the real Bootstrap
classes (`.btn-red`, `.card`, etc.) so what you see in Storybook matches
production. If you need to bump the pinned version, do it deliberately (not
to `main`, which is a moving target) and check the class names you depend on
still exist at the new version.

## Component tokens

Every component needs its own entries in `packages/tokens/tokens.json`,
under `az.component.<name>.*` — one per real, distinct visual decision the
component makes: not just color, but the structural properties too
(padding, font size/weight, border width/radius, disabled opacity, size
variant overrides, ...). `Button`'s are the reference — 15 tokens covering
its full CSS custom property surface, sourced directly from Arizona
Bootstrap's actual compiled `.btn`/`.btn-sm`/`.btn-lg` rules (verified via
the CDN CSS, not guessed):

```json
"component": {
  "button": {
    "color": {
      "red": { "$type": "color", "$value": "{az.color.brand.red}" },
      "blue": { "$type": "color", "$value": "{az.color.brand.blue}" }
    },
    "padding": {
      "x": { "$type": "dimension", "$value": { "value": 1.25, "unit": "rem" } },
      "y": { "$type": "dimension", "$value": { "value": 0.5, "unit": "rem" } }
    },
    "font": {
      "size": { "$type": "dimension", "$value": { "value": 1, "unit": "rem" } },
      "weight": { "$type": "fontWeight", "$value": 500 }
    },
    "border": {
      "width": { "$type": "dimension", "$value": { "value": 2, "unit": "px" } },
      "radius": { "$type": "dimension", "$value": { "value": 3, "unit": "rem" } }
    },
    "disabled": { "opacity": { "$type": "number", "$value": 0.65 } },
    "size": {
      "sm": { "padding": { "x": "...", "y": "..." }, "font": { "size": "..." } },
      "lg": { "padding": { "x": "...", "y": "..." }, "font": { "size": "..." } }
    }
  }
}
```

**Why this tier exists, and why it's not optional:** without it, a
component's styling reaches straight down to raw brand/base primitives (or,
for anything that isn't a color, to nothing at all — just a hard-coded value
buried in Bootstrap's CSS) with no named, inspectable indirection point
specific to that component. With component tokens, a component's actual
design decisions are explicit and repointable later without touching the
component itself.

**Colors alias to existing base/brand tokens — don't invent new hex values.**
`$value` for a color token should be a DTCG alias (`{az.color.brand.red}`),
pointing at a base/brand token that already exists. There's no semantic tier
yet, so component color tokens alias straight to base/brand tokens for now;
when a semantic tier is added later, they get repointed to alias through it
instead, without changing their own names. If a color variant's primitive
doesn't exist yet (Arizona Bootstrap's CSS supports more button colors than
`tokens.json` has base tokens for — `sky`, `white`, `redbar`, ...), that's
real work: add the base token for real, or leave that variant out, rather
than inventing a plausible-looking hex value to alias to.

**Everything else — hard-code to the real, current production value.**
Unlike colors, there's no base/semantic tier at all yet for spacing,
typography, or other structural properties, so blocking on one would mean
never adding these tokens. Pull the literal value from Arizona Bootstrap's
actual compiled CSS (`curl` the CDN URL from the Styling section above and
grep the component's base rule and its variants) — don't estimate or reuse
a value from a different component. When a base/semantic tier for these
exists later, repoint the alias the same way colors will be.

**Dimension tokens need the DTCG object format, not a plain string — this
isn't a style preference, the plain string silently produces broken CSS.**
`{ "$type": "dimension", "$value": "1.25rem" }` passes `terrazzo.config.ts`'s
lint (`core/valid-dimension` is `'warn'`, and even at `'error'` its
`legacyFormat` option doesn't actually work for dimensions in the installed
`@terrazzo/parser` version), but `@terrazzo/plugin-css`'s dimension
serializer requires the `{ value, unit }` object shape to render anything —
give it a plain string and every consumer of that token silently gets
`undefinedundefined` instead of a real value. Verified directly: switching
11 dimension tokens from strings to objects was the difference between
`--az-component-button-padding-x: undefinedundefined` and the correct
`1.25rem`. Colors don't have this problem — legacy hex strings compile
correctly — so this is dimension-specific, not a general "avoid legacy
format" rule.

**After editing `tokens.json`, always check the compiled CSS, not just that
the build exits 0** — a lint warning doesn't mean the output is correct
(see above), and `npm run build -w @az-digital/tokens`'s exit code doesn't
either, since `core/valid-dimension` is a warning, not an error:

```bash
npm run build -w @az-digital/tokens   # regenerates dist/tokens.css, dist/tokens.vars.js, and Storybook's .swatchbook/tokens.d.ts
```

**Expose them with a filtered `Tokens` story**, using swatchbook's
`TokenTable` (already a Storybook addon here — no new dependency):

```tsx
import { TokenTable } from '@unpunnyfuns/swatchbook-addon';

export const Tokens: Story = {
  render: () => <TokenTable filter="az.component.card.**" />,
};
```

You don't need to do anything else for these to show up in the global token
catalog (`packages/storybook/stories/tokens.mdx`) — its unfiltered
`<TokenTable />` and `<TokenNavigator />` already include every token. If you
want them called out there as their own group too (the way "Component
tokens" already is for Button), add a filtered section following that same
pattern.

## Consuming source live (no build step needed in Storybook)

`packages/storybook/.storybook/main.ts` aliases
`@az-digital/components-react` and `@az-digital/components-html` straight to
their `src/index.ts` via a Vite `resolve.alias`. This means Storybook always
reflects your latest source while developing — you don't need to run a build
for Storybook itself to pick up changes. You only need `main.ts` changes if
you're adding an entirely new *package* (not a new component inside an
existing one).

## Before you're done

```bash
npm run build -w @az-digital/tokens             # only if you touched tokens.json — regenerates dist/tokens.css etc.
npm run build -w @az-digital/components-react   # regenerates dist/*.d.ts — needed for `tsc` even though Storybook uses live source via the alias
npm run lint:storybook                           # CI gate
npm run test:storybook                           # CI gate
```

There's no standalone `tsc --noEmit` CI gate yet, but run it anyway
(`npx tsc --noEmit -p packages/storybook/tsconfig.json`) before calling
something done — type errors here are easy to introduce via the `Meta<T>`
trick above and won't be caught by lint or the (currently empty) test suite.

Then verify visually: start Storybook (`npm run dev:storybook` or the
`storybook` launch config), open the new story, and check both the canvas
and the docs "Code" panel while toggling the Implementation switcher through
every option — including ones the component doesn't implement, to confirm
the placeholder shows up instead of an error. Per the gotcha above, a broken
sync between canvas and code panel is easy to miss just by looking at the
canvas. If you added tokens, `npm run build -w @az-digital/tokens` will
already fail loudly (`Could not resolve alias ...`) on a broken alias
reference — verified directly — so a clean build there means the alias
chain is sound. Still open the `Tokens` story once to confirm the actual
swatch/value looks right, since a *resolvable* alias can still point at the
wrong token.
