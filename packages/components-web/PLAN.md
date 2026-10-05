# Plan: `@az-digital/components-web`

Spike for [az-digital/design#16](https://github.com/az-digital/design/issues/16):
bring Arizona's web components into this monorepo as a third implementation
of the design system's components, next to `components-html` and
`components-react`.

Arizona supports a wide range of software products. Some of them can't use
React or Arizona Bootstrap markup: vendor platforms, CMS and LMS themes, apps
in other frameworks, embedded widgets. Web components are the best delivery
there, so this package is an equal implementation, not an add-on.

## Where this branch starts

Local branch `components-web`, based on `claude/pr46-sync-token-addon`
(PR 51). That branch already contains:

- PR 47: Style Dictionary token build and `@az-digital/storybook-addon-tokens`.
- PR 40: `components-html`, `components-react`, Button component tokens, the
  Storybook **Implementation** toolbar.
- PR 46: Accordion, Tabs, Nav, Card, Arizona Header.

When those merge to `main`, rebase this branch onto `main`.

## Requirements

1. **Standalone.** No Arizona Bootstrap CSS at runtime. Each component's
   styles come from `@az-digital/tokens` and are compiled into the component.
   A page that loads nothing else still renders the component correctly.
2. **Tokens stay overridable.** Every token is read as a `var()` chain that
   follows the token's own aliases, ending in the resolved value, for example
   `var(--az-component-button-solid-container-color, var(--az-color-semantic-action-default, var(--az-color-brand-red, #ab0520)))`.
   Pages that load `tokens.css`, or that override any one layer, get their
   values. Pages that load nothing get the design system's values.
3. **Same API as the other implementations**, except where a web platform
   rule forces a difference (documented per component).
4. **Same Figma source and the same tokens** as html and react. No new
   tokens, no invented variants. Gaps are documented, not papered over (see
   `packages/storybook/AGENTS.md`).
5. **Accessible across the shadow boundary:** `delegatesFocus`, native
   `<button>`/`<a>` inside the shadow root, no ARIA references across roots.
6. **Two ways to load it:** a versioned CDN script tag with no build step,
   and npm with per-component imports.

## Package layout

```
packages/components-web/
  package.json            @az-digital/components-web, depends on lit
  tsconfig.json
  vite.config.ts          library mode: one file per component + index + CDN bundle
  scripts/
    build-tokens.mjs      Style Dictionary → src/generated/tokens.ts (var() chains)
  src/
    generated/tokens.ts   committed, like packages/tokens/dist
    index.ts              registers every element
    button/az-button.ts
    arizona-header/az-arizona-header.ts
```

- **Lit 3** without decorators (`static properties`), so the source compiles
  the same under Storybook's Vite, the package build, and plain `tsc`.
- Tag names use the `az-` prefix: `az-button`, `az-arizona-header`.
- Each component module defines its element only if it isn't already defined,
  so loading two copies (CDN + npm) doesn't throw.

## Component API decisions

### `az-button`

| Shared prop | Web attribute | Why |
|---|---|---|
| `style` | `variant` | `style` is a global HTML attribute (inline CSS); a custom element can't reuse it. |
| `color` | `color` | Same. Only `red` has tokens today; other values are accepted and reflected but unstyled, matching how html/react generate `btn-${color}` naively. |
| `size` | `size` | Same (`sm`, `lg`). |
| `htmlTag` + `href` | `href` | Renders `<a>` when `href` is set, `<button>` otherwise. One attribute instead of two, the usual pattern for web components. Storybook maps `htmlTag: 'a'` to `href="#"` for parity. |
| `disabled` | `disabled` | Same. On links: `aria-disabled="true"`, `tabindex="-1"`, no `href`. |
| `active` | `active` | Same. |
| children | default slot | Label text. |

Shadow part: `control` (the inner `<button>`/`<a>`), for `::part()` styling.

Form participation (submit/reset via `ElementInternals`) is out of scope
until a Figma frame or a product needs a form button.

### `az-arizona-header`

Same props as html/react: `variant` (`blue` | `red`), `fixed-on-mobile`.
`id` stays the host's own `id`. Uses the `az.component.arizona-header.*`
tokens.

**Token gap:** there's no token for the header's background color, so the
component reads the brand colors (`az.color.brand.blue`/`red`) directly.
Proposed follow-up: `az.component.arizona-header.container.color`, aliasing a
semantic token, decided with design.

## Storybook

- Add `web` to `ImplementationKey` (`stories/implementations.tsx`) and to the
  toolbar in `.storybook/preview.ts`, titled **Web Components**.
- Vite alias `@az-digital/components-web` → `packages/components-web/src/index.ts`,
  like the other two packages.
- Button and Arizona Header stories get a `web` entry: `render` creates the
  element, `source` prints the tag.
- The Button state previews (`TokenStatePreview`) style `.btn`, which can't
  reach inside a shadow root. The state CSS also targets `az-button::part(control)`.
- Play functions query by role, which doesn't search shadow roots. They find
  `az-button` hosts first; `host.focus()` delegates to the inner control and
  the host reports focus.
- Stories that bypass the component (`ContextButton`, background-paired
  colors with no tokens) have no web entry and show the existing placeholder.

## Build and release (not on this local branch yet)

- `vite build` → `dist/az-button.js`, `dist/az-arizona-header.js`,
  `dist/index.js`, `dist/az-components.min.js` (self-registering CDN bundle),
  plus `.d.ts` files.
- Custom Elements Manifest (`@custom-elements-manifest/analyzer`) for editor
  autocomplete and Storybook docs.
- Changesets, npm trusted publishing, CDN workflow with GitHub OIDC
  (`cdn.digital.arizona.edu/lib/components-web/vX.Y.Z/`).
- Deprecate `test-az-web-component` / `az-web-component` on npm, archive
  `az-digital/az-web-components` and `uaz-web/az-web-components`.

## History import (before opening a PR)

Bring `uaz-web/az-web-components` history into this package with
`git filter-repo --to-subdirectory-filter packages/components-web` and
`git merge --allow-unrelated-histories`, then delete the imported files this
rebuild replaces. Not done on this local branch, to keep the experiment's
history readable.

## Findings from the first pass

Verified in Storybook (each Implementation) and on the standalone demo page
(`npm run dev -w @az-digital/components-web`, no Arizona CSS loaded):

- **Button:** padding, size, colors, border, radius and focus ring match the
  Arizona Bootstrap version in every token-backed story (solid/outline, default
  and Large, white and Cloud). Play functions pass against `<az-button>`.
- **Arizona Header:** pixel-identical to Arizona Bootstrap at 1024px and 375px.
- **Standalone:** renders correctly with no `tokens.css`. Overriding a semantic
  token (`--az-color-semantic-action-default`) on a parent element carries
  through to the component.
- **Bundle:** `az-components.min.js` (CDN, Lit included) is 35 kB, 9.8 kB gzip.
  The npm build shares one chunk holding the generated token tree (10 kB),
  which every component imports whole. Worth splitting per component later.

### Gaps to take to design

- **Button label font.** Arizona Bootstrap gives buttons `proxima-nova-condensed`
  at a 22px line height. There's no font-family token and Figma's variables
  for the Button don't specify one, so `az-button` inherits the page font,
  which makes its label wider. Needs a typography token.
- **Button `active`.** No tokens, so it doesn't change the look (html/react get
  Arizona Bootstrap's untokenized `.active` colors).
- **Links with `role="button"`.** Kept for parity with html/react (the Bootstrap
  pattern), but a link that navigates is announced as a button. Decide once for
  all three implementations.
- **Arizona Header background and layout.** No color, breakpoint, or container
  tokens; hardcoded from brand colors and Arizona Bootstrap 5.2.0.
- **Fixed header on mobile.** The page has to leave room for it; Arizona
  Bootstrap's `body:has(...)` rule can't see into a shadow root.

## Steps

- [x] Plan file
- [x] Package scaffold (package.json, tsconfig, Vite library config)
- [x] Token script: Style Dictionary → `var()` chains with resolved fallbacks
- [x] `az-button`
- [x] `az-arizona-header`
- [x] Storybook: `web` implementation, alias, Button + Arizona Header stories
- [x] Verify: package build, typecheck, lint, Storybook stories in the browser
      (each implementation, with and without `tokens.css`)
- [x] Standalone demo page (`index.html`, `npm run dev`)
- [ ] Unit tests (Vitest browser mode) and axe checks
- [ ] Custom Elements Manifest
- [ ] Next components: Card, Nav (presentational), then Accordion, Tabs (behavior)
- [ ] History import, Changesets, CI, CDN (later, before a PR)
