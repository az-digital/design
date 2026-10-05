---
name: design-system-component
description: >-
  Use this skill whenever adding, scaffolding, or editing a design-system
  component (Button, Card, Input, Alert, etc.) in this repo, or writing/updating
  a Storybook story for one. Also use it whenever asked to follow "the
  component pattern", add an "HTML and/or React version" of something, wire
  up a Storybook implementation toggle, or add/associate design tokens with a
  component — this repo can ship a component as React, as plain HTML, as a
  web component (custom element), or any combination, with a shared
  Storybook toolbar switcher and code panel across all of them, and every
  component is expected to have its own component-tier design tokens too. The wiring has real gotchas (see below) that are easy
  to get wrong by improvising instead of following this structure.
applyTo: "packages/components-react/**,packages/components-html/**,packages/components-web/**,packages/storybook/stories/**,packages/storybook/.storybook/**,packages/tokens/tokens.json"
---

# Design-system component pattern

Components in this repo can have a React implementation
(`@az-digital/components-react`), a plain HTML/CSS implementation
(`@az-digital/components-html`), a web component implementation
(`@az-digital/components-web`), or any combination — whichever a component
actually needs. There's no requirement that every component exist in every
package; a component only needed in a React app doesn't need an HTML
version, and one only needed in a Drupal theme doesn't need React. A single Storybook story
still drives whichever implementations a component has from the same args,
via a shared toolbar switcher and docs code panel.

`packages/storybook/stories/Primary/Components/Buttons/Button.stories.tsx` (all three implementations) and
`packages/storybook/stories/implementations.tsx` (the shared machinery) are
the reference — read them alongside this skill. Everything below explains
the *why* behind their shape so you can extend the pattern to a new
component correctly.

## Why three packages, not one

- `components-html` is what a Drupal theme (or any non-React consumer) can use
  directly — it's just a function that returns an HTML string using Arizona
  Bootstrap's real CSS classes. No framework, no build step to consume.
- `components-react` is the React component for React/Next.js apps.
- `components-web` is Lit-based custom elements (`<az-button>`) for places
  the other two can't reach well: platforms where you can only add a script
  tag, apps in other frameworks, embedded widgets, pages whose CSS would
  clash with Arizona Bootstrap. It's an equal implementation, not an add-on.
  Unlike the other two, it's **standalone**: it doesn't use Arizona
  Bootstrap's CSS at all, and its styles come only from design tokens.
- When a component has more than one, they share the same prop shape
  (color, style, size, etc.) on purpose, so one set of Storybook
  args/controls can drive every implementation without translation. Web
  components deviate only where a platform rule forces it (see
  `components-web` below).
- Neither package is Drupal-specific (no Twig/SDC). Drupal's own templates
  live in `az_quickstart`/`az_barrio` and are out of scope here — don't pull
  them into this repo.
- `components-html` is plain HTML/CSS, nothing more. "Web components" is a
  distinct thing, the custom elements in `components-web`, which replaces
  the separate `az-web-components` repos (issue #16; plan in
  `packages/components-web/PLAN.md`).

## Adding a new component: file layout

For a component named `Card` that needs all three implementations, you'd create:

```
packages/components-react/src/components/Card/Card.tsx   # React implementation
packages/components-react/src/components/Card/index.ts   # export * from './Card'
packages/components-html/src/Card.ts                      # renderCard(props): string
packages/components-web/src/card/az-card.ts               # <az-card> custom element
packages/storybook/stories/Primary/Components/Containers/Card.stories.tsx  # the story (in main's IA folder; replaces Card.mdx's placeholder with the Docs page)
packages/tokens/tokens.json                                # az.component.card.* entries — see below
```

If `Card` doesn't need every implementation, just skip the packages it
doesn't need — the story (below) reflects that by only filling in the
`implementations` key(s) that exist. Add whichever exports you do create to
that package's barrel file (`packages/components-react/src/index.ts`,
`packages/components-html/src/index.ts`, `packages/components-web/src/index.ts`). The token entries aren't optional
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

### `components-web/src/<name>/az-<name>.ts`

Follow `az-button.ts`'s shape:

- **Lit, without decorators.** Declare properties in `static properties`
  and the fields with `declare`, and set defaults in the constructor. The
  same source then compiles identically under Storybook's Vite, the package
  build, and plain `tsc`, with no decorator or class-field settings to keep
  in sync.
- **Register with `define('az-card', AzCard)`** (`src/define.ts`), not
  `customElements.define` directly: it skips a tag that's already defined,
  so a page loading the CDN bundle and an npm import doesn't throw. Add the
  tag to `HTMLElementTagNameMap` too.
- **Styles come only from tokens.** Import `az` from `src/generated/tokens.ts`
  and interpolate with `unsafeCSS`, e.g. `padding: ${t(az.component.card.cap.padding.x)}`.
  Each entry is a `var()` chain that follows the token's aliases down to its
  resolved value, so the component renders on a page with no Arizona CSS,
  and a page can still override any layer. Never write a literal value; if a
  value has no token, hardcode it with a comment naming the gap and record
  it in `packages/components-web/PLAN.md` (Arizona Header's background and
  container widths are the current examples). Don't use Arizona Bootstrap's
  CSS or class names.
- **Variants are reflected attributes** (`reflect: true`), styled with
  `:host([variant='outline'][color='red']) .control`. Only style values that
  have tokens; accept other values without styling them, the same way
  html/react generate `btn-${color}` whether or not its CSS exists.
- **Accessibility across the shadow boundary:** render a native `<button>`
  / `<a>` inside the shadow root, set `delegatesFocus: true` in
  `shadowRootOptions`, and never point ARIA references across roots.
- **Expose a `part`** on the main inner element (`part="control"`) so
  consumers, and Storybook's state previews, can style it.
- **Same props as html/react, except where the platform forces a change.**
  A custom element can't reuse a global HTML attribute, so Button's `style`
  is `variant`. Document every difference in the class's doc comment.
- Add the component to `src/index.ts`, to the `lib.entry` map in
  `vite.config.ts`, to `exports` in `package.json`, and an example of it to
  the standalone demo page, `index.html`.

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
     title: 'Primary/Components/Containers/Card',
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

5. **For a web component, import the package for its side effect and render
   the tag with `createElement`.** `import '@az-digital/components-web';`
   registers the elements. React 19 sets custom element properties
   directly, so pass props as an object; map any prop whose name differs
   (`variant: args.style`):

   ```tsx
   web: {
     render: (args) => createElement('az-card', { title: args.title }),
     source: (args) => `<az-card title="${args.title}"></az-card>`,
   },
   ```

   Two things don't reach into a shadow root, so stories need adjusting:

   - **`play` functions:** role queries don't search shadow roots. Find the
     host element instead (`canvasElement.querySelector('az-button')`):
     `host.focus()` delegates to the inner control, and the host then
     reports focus. See `getButton` in `Button.stories.tsx`.
   - **`TokenStatePreview` state CSS:** `& .btn` can't style inside the
     shadow root. Also target the exposed part:
     `& .btn, & az-button::part(control) { ... }`.

   `withBackgroundClassSource`-style helpers that wrap the Code-panel source
   should write `className` only for `react`; html and web both use `class`.

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
  /* build a minimal JSX string from non-default args, see Button.stories.tsx */
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
  title: 'Primary/Components/Containers/Card',
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

The toolbar's Implementation switcher always offers every known kind
(Arizona Bootstrap, React Bootstrap, Web Components) — its items come from
`IMPLEMENTATIONS` in `implementations.tsx`, read once, globally, by
`preview.ts`, and can't shrink per-story. The Components Overview page's
library picker reads the same list. To add a new kind, add it to
`ImplementationKey` and `IMPLEMENTATIONS`; nothing else needs editing. So a component that only has an
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
already wired up in both `Button.stories.tsx`'s `render` function and
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
`Button.stories.tsx` for the pattern. `htmlSource` can usually just call your
`render<Name>(args)` function directly, since that already returns the exact
markup being shown.

## Styling

Component CSS comes from Arizona Bootstrap's real, versioned CDN build,
loaded once for all stories via `packages/storybook/.storybook/preview-head.html`:

```html
<link rel="stylesheet" href="https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.2.0/css/arizona-bootstrap.css" />
```

Don't write local CSS stubs for a new component — use the real Bootstrap
classes (`.btn-red`, `.card`, etc.) so what you see in Storybook matches
production. This applies to html and react only: web components carry their
own token-based styles and never use Arizona Bootstrap (see
`components-web` above). If you need to bump the pinned version, do it deliberately (not
to `main`, which is a moving target) and check the class names you depend on
still exist at the new version.

## Component tokens

Every component needs its own entries in `packages/tokens/tokens.json`,
under `az.component.<name>.*` — one per real, distinct visual decision the
component makes: not just color, but the structural properties too
(padding, font size/weight, border width/radius, disabled opacity, size
variant overrides, ...).

**Read `packages/tokens/AGENTS.md` before adding or renaming one.** It's the
source of truth for the layers (brand → semantic → component for color;
`az.dimension.*`, `az.font-weight.*`, `az.opacity.*` primitives for
everything else), what each layer's names may describe, which layer a token
may alias, and the `<variant>.<state>.<part>` structure. In short:

- **Every component token is an alias, never a literal**, color or number.
  Colors alias a semantic token when one exists for that role
  (`{az.color.semantic.action.default}`), otherwise a brand color. Numbers
  alias their primitive (`{az.component.button.padding.x}` →
  `{az.dimension.30}`). If the primitive doesn't exist yet, add it to its
  tier; don't put the number on the component token.
- **Shared structure at the component root, one group per demonstrated
  style** holding only what that style changes (`solid.*`, `outline.*`),
  grouped by state, named by the part they color.
- **Values come from Figma first**, Arizona Bootstrap's compiled CSS only
  where Figma has no design for it. Don't estimate, and don't borrow a value
  from another component.

`Button`'s tokens are the reference. An excerpt, with `$description`s left
out (every real token has one, saying what it's for):

```json
"button": {
  "padding": {
    "x": { "$type": "dimension", "$value": "{az.dimension.30}" }
  },
  "label": {
    "font": {
      "size": { "$type": "dimension", "$value": "{az.dimension.18}" },
      "weight": { "$type": "number", "$value": "{az.font-weight.700}" }
    }
  },
  "solid": {
    "container": { "color": { "$type": "color", "$value": "{az.color.semantic.action.default}" } },
    "label": { "color": { "$type": "color", "$value": "{az.color.brand.white}" } },
    "hover": {
      "container": { "color": { "$type": "color", "$value": "{az.color.semantic.action.hover}" } }
    }
  },
  "focus-visible": {
    "ring": { "$type": "color", "$value": "{az.color.semantic.action.focus-ring}" }
  }
}
```

and the primitives they alias:

```json
"dimension": { "30": { "$type": "dimension", "$value": { "value": 30, "unit": "px" } } },
"font-weight": { "700": { "$type": "number", "$value": 700 } }
```

**Why this tier exists, and why it's not optional:** without it, a
component's styling reaches straight down to brand colors or primitives
(or, for anything without a token, to a hard-coded value buried in
Bootstrap's CSS) with no named, inspectable indirection point specific to
that component. With component tokens, a component's actual design
decisions are explicit and repointable later without touching the
component itself.

**Style Dictionary pitfalls** (the build is `style-dictionary.config.mjs`,
`transformGroup: 'css'`; each verified directly):

- **Write dimensions as DTCG objects, `{ "value": 30, "unit": "px" }`.** A
  bare number is the trap: `"$value": 16` compiles to `16rem`, not `16px`,
  with no warning. (A string like `"1.25rem"` compiles as written, but use
  the object form to match the rest of the file.)
- **Never put alias-shaped text in a `$description`.** Style Dictionary
  tries to resolve `{az.dimension.9.6}` in prose as a reference, and the
  build fails with a reference error.
- **A broken alias fails the build** ("Some token references (1) could not
  be found", exit code 1), so a clean build means every alias resolves. It
  doesn't mean an alias points at the *right* token; check the values.

**After editing `tokens.json`, rebuild and check the generated output**, not
just that the build exits 0:

```bash
npm run build -w @az-digital/tokens   # regenerates dist/: tokens.css, tokens.scss, tokens.vars.js, tokens.vars.d.ts
npm run build:tokens -w @az-digital/components-web   # regenerates components-web/src/generated/tokens.ts
```

Both outputs are committed. Web components read tokens from
`src/generated/tokens.ts`, not from the tokens package's `dist/`, so a token
change doesn't reach them until the second command runs.

**Expose them in Storybook** with `@az-digital/storybook-addon-tokens`
(see `packages/storybook-addon-tokens/README.md`). No separate "Tokens" story:

- Declare the component's tokens once on its story file's meta, so each story
  gets the **Tokens** tab (opt-in, like Controls):

  ```tsx
  const meta = {
    parameters: { tokens: 'az.component.card.' },
  } satisfies Meta;
  ```

- Show the component's tokens on its Docs page:

  ```mdx
  import { ComponentTokenIndex } from '@az-digital/storybook-addon-tokens';

  <ComponentTokenIndex component="card" />
  ```

Nothing else is needed for them to appear in the Tokens page's Component
tokens index (`packages/storybook/stories/Primary/Foundations/Tokens/Docs.mdx`):
it's built from `tokens.json`, and groups the component's tokens by reading
their paths.

## Consuming source live (no build step needed in Storybook)

`packages/storybook/.storybook/main.ts` aliases
`@az-digital/components-react`, `@az-digital/components-html`, and
`@az-digital/components-web` straight to their `src/index.ts` via a Vite
`resolve.alias`. This means Storybook always
reflects your latest source while developing — you don't need to run a build
for Storybook itself to pick up changes. You only need `main.ts` changes if
you're adding an entirely new *package* (not a new component inside an
existing one).

## Before you're done

```bash
npm run build -w @az-digital/tokens             # only if you touched tokens.json — regenerates dist/tokens.css etc.
npm run build -w @az-digital/components-react   # regenerates dist/*.d.ts — needed for `tsc` even though Storybook uses live source via the alias
npm run build -w @az-digital/components-web     # regenerates its token file and dist/ (npm modules + CDN bundle)
npm run lint:storybook                           # CI gate
npm run test:storybook                           # CI gate
```

There's no standalone `tsc --noEmit` CI gate yet, but run it anyway
(`npx tsc --noEmit -p packages/storybook/tsconfig.json`, and
`npm run typecheck -w @az-digital/components-web` for web components)
before calling something done — type errors here are easy to introduce via the `Meta<T>`
trick above and won't be caught by lint or the (currently empty) test suite.

Then verify visually: start Storybook (`npm run dev:storybook` or the
`storybook` launch config), open the new story, and check both the canvas
and the docs "Code" panel while toggling the Implementation switcher through
every option — including ones the component doesn't implement, to confirm
the placeholder shows up instead of an error. For a web component, also
open `npm run dev -w @az-digital/components-web`'s standalone page
(`packages/components-web/index.html`, which loads no Arizona CSS) and
confirm it renders correctly there. Per the gotcha above, a broken
sync between canvas and code panel is easy to miss just by looking at the
canvas. If you added tokens, a clean `npm run build -w @az-digital/tokens` means
every alias resolves (a broken one fails the build), but a resolvable alias
can still point at the wrong token: open the component's Docs page and the
story's **Tokens** tab, and click through the token pills to check each
resolved value.
