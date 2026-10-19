---
name: record-design-decisions
description: Capture a design's decisions as design tokens. First settle the source of truth for each decision (Arizona Bootstrap PRs, XD mockups, Figma, another Storybook, or a combination), then the token shape, then record the values. Use when asked to work on a Design-labeled issue in az-digital/design, add tokens for a component or foundation that doesn't have them yet, or figure out where a design's values should come from.
---

# Record design decisions as tokens

Developers can't get Figma access, so tokens are how design decisions reach every
implementation. Work in this order, and don't skip ahead: values recorded before the
source and shape are settled get recorded twice.

1. **Source of truth:** where each decision comes from
2. **Token shape:** what the tokens are called and how they alias each other
3. **Values:** what each token is set to, from its source
4. **Hand it off and check it:** a docs page, wiring instructions for Arizona
   Bootstrap, and the shim that proves them

Before editing, read `README.md`, `AGENTS.md`, and `packages/tokens/AGENTS.md` and
`packages/storybook/AGENTS.md` if they exist on the current branch. If they don't,
read `packages/tokens/AGENTS.md` from the newest open token PR's branch (`gh pr list`);
its naming rules apply everywhere.

## 1. Settle the source of truth

A design's decisions can live in several places, and different decisions in one design
can come from different places. Settle it per decision, and write it down before
recording values.

Places to look:

- **Arizona Bootstrap PRs** (`az-digital/arizona-bootstrap`): body, review comments
  and diff (`gh pr view N -R az-digital/arizona-bootstrap --json body,comments`,
  `gh pr diff`). A PR that went through design review is a design decision.
- **XD mockups**, usually linked from issues and PRs. Often the original design, and
  sometimes older than what shipped.
- **Figma**, the design system file.
- **Other Storybooks**, such as `uaz-web/az-storybook`.
- **Arizona Bootstrap releases**: the Sass and the compiled CSS on the CDN. What
  actually ships, including Bootstrap defaults it doesn't override.
- **Live sites** such as arizona.edu: references for comparison, not sources.

How to decide:

- A decision a designer reviewed or approved outranks one nobody reviewed. A
  design-reviewed Arizona Bootstrap PR outranks Figma; Figma outranks an unreviewed
  release value.
- A newer reviewed decision outranks an older one. Look for PRs the issue doesn't cite:
  list commits to the component's Sass on `main` and the next release branch
  (`gh api "repos/az-digital/arizona-bootstrap/commits?sha=main&path=scss/custom/_<name>.scss"`,
  and `scss/override/`). Later PRs often change or explain a value.
- When sources disagree and neither was reviewed, or the newest source is a mockup
  that never shipped, that's a question for the user. Ask it with the options side by
  side; don't pick silently.
- Old palette names always translate to the current palette, value included: Bloom →
  Bougainvillea, Chili → Sonoran Red, Sky → Rain, Midnight → Tinta, Oasis → Arroyo
  Blue, Cool Gray → Cloud, Warm Gray → Caliche. This is settled, not a disagreement.

Write the result down where reviewers will see it: the issue's "Where values come
from" section, or the PR description. If the issue doesn't list a source yet, draft
that section as a local file for the user to review before posting.

## 2. Decide the token shape

Settle names and structure before values. For a new kind of structure (a new surface,
a new primitive tier, a new semantic group), describe the shape to the user before
building it.

- **Check what exists first.** Reuse an existing semantic token or primitive when one
  means the same thing. Look at sibling components for the pattern to follow.
- **Layers:** brand → semantic (`az.color.semantic.*`) → component
  (`az.component.<name>.*`). Numbers alias primitives: `az.dimension.<value>` (px;
  decimals use a hyphen, e.g. `19-2`), `az.font-weight.<value>`, `az.duration.*`,
  `az.easing.*`.
- **Surfaces:** colors come from the surface a design sits on. `surface.<name>` is
  the fill (`surface.brand` is Blue and themeable; `surface.default` is White).
  `on-<surface>.*` holds what sits on it (`default`, `link`, `border`, `placeholder`,
  `accent`, `focus-ring`, `logo`, ...). Component colors alias those, through a
  surface-named group when a component can sit on more than one surface
  (`input-group.on-brand.*`). Add an on-color only when something needs it.
- **Names:** say what a token is for, never what it looks like. No color names in
  paths. Red is primary color 1 and Blue is primary color 2; never call Blue
  "secondary". Name the part a color colors (`container.color`, `link.color`). States
  nest as `hover.*`, `focus.*`, `focus-visible.*`; breakpoints as `sm.*`, `lg.*`; a
  variant group holds only what it changes. A theme decision (such as the header's
  color) is a repointed semantic token, not a variant.
- **Cover what renders.** If the design renders a value the issue doesn't list, give
  it a token too, and say so in the PR.

## 3. Record the values (`packages/tokens/tokens.json`)

- Take each value from the source settled in step 1. Add a missing primitive rather
  than writing a literal.
- A value that comes from font metrics rather than CSS (e.g. how far an underline sits
  below the baseline) is still a decision if a source measured it and design approved
  it: record it, and say where it can't be applied directly.
- **Descriptions:** plain language about what the token is for. Never mention
  Bootstrap or Arizona Bootstrap in `tokens.json` or docs pages; sources go in commit
  messages and PR descriptions.
- **Format:** write the file back with `json.dumps(data, indent=2)` (ASCII escapes, no
  trailing newline), so the diff shows only your additions.
- Run `npm run build:tokens` and commit the regenerated `dist/`.

## 4. Hand it off and check it

### Docs page

- Docs pages live in `packages/storybook/stories/Primary/`. Fill in the existing
  placeholder page if there is one, rather than adding a second.
- Structure like the Arizona Header, Input Group and Breadcrumbs pages: short sections
  in plain language (where colors come from, shape and spacing, parts and states),
  with `<Token data={getTokenData('…')} />` pills for key semantic colors and
  `<TokenTable items={getTokenDisplayItems('az.component.<name>.')} />`.
- The Tokens page's component index links a component to the docs page whose title
  matches its token name (or its plural). If they differ, tag the page:
  `<Meta title="…" tags={['tokens:<name>']} />`.
- If you add a primitive tier, give it a table on the Tokens page
  (`stories/Primary/Foundations/Tokens/Docs.mdx`) so every token stays listed.
- Don't add component stories unless the issue asks for them.

### Wiring instructions for Arizona Bootstrap

The goal is for Arizona Bootstrap to read the tokens instead of setting its own
values. Give its developers wiring instructions they can follow without reading the
token tree: a table per component that maps each place Arizona Bootstrap sets a value
to the generated variable that replaces it.

| Arizona Bootstrap | Replace with | Notes |
|---|---|---|
| `$breadcrumb-padding-x` / `--bs-breadcrumb-padding-x` | `var(--az-component-breadcrumb-padding-x)` | |
| `.breadcrumb a` `color` | `var(--az-component-breadcrumb-link-color)` | |
| `.breadcrumb-item-home::before` background SVG | `mask` of the same SVG, `background-color: var(--az-component-breadcrumb-home-icon-color)` | The SVG has Azurite built in |

- Cover every token: the Sass variable when there is one, the CSS variable it
  compiles to, or the selector and property when the value is hard-coded.
- Note where Arizona Bootstrap's value changes (a palette rename, a new primitive),
  and where a token can't be applied directly and why.
- Put the instructions in the PR description, since docs pages don't name Bootstrap.

### Check the wiring with the shim

`packages/storybook/.storybook/arizona-bootstrap-shim.css` (Storybook only; the one
place in the repo Arizona Bootstrap is named) applies the wiring instructions on top
of Arizona Bootstrap's own CSS, so its markup renders the tokens. It's the proof that
the instructions work: build it from the table, and keep the two in step. Other
implementations may follow the same pattern.

For the shim:

- Add a commented section per component, with `:root .<class>` selectors so they win
  regardless of stylesheet order.
- Prefer re-pointing the component's own CSS variables (`--bs-breadcrumb-padding-x:
  var(--az-component-breadcrumb-padding-x)`) over overriding properties.
- Every value is a `var(--az-…)`. Each exception gets a comment saying why (an asset,
  a missing token tier).
- When Arizona Bootstrap bakes a color into an SVG data URI, use that SVG as a `mask`
  and paint it with `background-color: var(<token>)`.
- For transitions, set only `transition-duration` and `transition-timing-function`, so
  reduced motion still turns them off.
- Keep a technique a PR chose for a reason (e.g. az-digital/arizona-bootstrap#2346
  made every breadcrumb underline the same bottom border so they line up). Don't swap
  in another technique just to use a token more literally.

### Verify

- `npm run build:tokens` and `npm run lint:storybook` pass.
- Storybook runs with `npm run dev:storybook` on port 6006; never another port. If
  it's already running, reuse it.
- Open the docs page (`/iframe.html?id=<id>--docs&viewMode=docs`); check the headings
  and the token table's row count.
- Insert the implementation's example markup into the page and compare computed
  styles with each token. Change a semantic token with
  `document.documentElement.style.setProperty` and confirm the component follows.
  Hover and screenshot interactive states.
- `await document.fonts.ready` before measuring anything that depends on type, and
  wait out transitions before reading colors.

## Branch, commit, PR

- Never create git worktrees. Branch in the main checkout: `issue/<number>-<slug>`,
  from the previous token PR's head when the work builds on it (stacked PRs),
  otherwise from `main`.
- Keep work local until the user asks to push or open a PR. Don't keep offering to
  push.
- The commit message names the issue and the source of each value.
- A stacked PR targets the previous PR's branch; say so at the top of its description,
  and that the closing keyword won't fire until it reaches `main`. Describe the source
  of truth, the token shape, the Arizona Bootstrap wiring instructions, the Storybook
  changes, notes for reviewers, and a test plan.
- `gh pr edit` and `gh issue edit` can fail on this repo; use
  `gh api -X PATCH repos/az-digital/design/{pulls|issues}/N -F body=@file`.
- Show diffs as files (`git diff > file`, then send the file), not pasted into chat.
- Don't open or draft Arizona Bootstrap issues; work around its bugs in the shim.

## Talking to the user

Report what you recorded and verified in plain language. Raise a question only when it
needs a person's decision: which source wins when they disagree, a new kind of token
structure, or a value no source sets. Settled things (palette renames, a reviewed
source outranking an unreviewed one) aren't questions.
