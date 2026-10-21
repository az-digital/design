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
its naming rules apply everywhere, except its rule that every number aliases a
primitive: sizes are literal values (step 2).

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
- What shipped outranks an issue's summary of it. Read the merged diff and the
  release branches, not just a PR's description: #2111's description said the text
  backdrop applied to Monsoon Sky, but the merged code only applied it to Trilines.
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
  (`az.component.<name>.*`). Colors outside the brand palette, such as a 50% gray
  for rules, go in `az.color.neutral.*`. A component's contract (below) sits on top:
  it says which token sets each of the component's parts.
- **An alias records a relationship, not a number.** Alias a token only when the two
  are the same decision: a focused state aliases its resting state, a component's
  text uses `az.typography.*`. Wiring a part to a color isn't a token at all: the
  contract does the wiring, so no component token only points at another token.
- **Primitives are named roles, never values.** Keep a primitive only when its name
  is a role whose value could change everywhere at once: brand and neutral colors,
  `az.font-family.sans` / `serif` (each a full font stack). A name that is its own
  value (`dimension.16`, `duration.150`, `font-weight.400`, `easing.ease-in-out`)
  can never change without becoming wrong, so it's not a primitive.
- **Values are literal.** Write a size, ratio, percentage, weight, duration or easing
  directly in the token that uses it (`"$value": {"value": 34, "unit": "px"}`,
  `"$value": 600`), not as an alias to a primitive named after its value. Don't add
  `az.dimension.<value>`, `az.ratio.*`, `az.percentage.*`, `az.font-weight.*`,
  `az.duration.*` or `az.easing.*` tokens, and don't build a spacing scale: approved
  designs aren't on one, so a scale either changes approved values or turns into a
  list of every value. A primitive named after its value can never change without its
  name becoming wrong, and one used by unrelated things (padding and a font size both
  at 16px) must never change at once. When several tokens genuinely share one size
  decision, give it a named semantic token
  (`az.dimension.semantic.page.scroll-offset`) and alias that. The same goes for
  motion: if design sets one transition for every hover, that's a named semantic
  token, not `duration.150`.
- **Page-wide values are semantic, not a component's.** A value every component
  shares, or one another component changes, belongs to the page: for example
  `az.dimension.semantic.page.scroll-offset` (where linked sections stop), which a
  fixed header raises. Don't give each component its own copy, and don't invent a
  "page" component.
- **Surfaces:** colors come from the surface a design sits on. `surface.<name>` is
  the fill (`surface.brand` is Blue and themeable; `surface.default` is White).
  `on-<surface>.*` holds what sits on it (`default`, `link`, `border`, `placeholder`,
  `accent`, `focus-ring`, `logo`, `pattern`, ...). Add a semantic token only for a
  decision that's really shared, or that a theme changes (`surface.brand` and
  `on-brand.*`), never just to give one component a name to point at: its contract
  points the part straight at the brand color instead. Text
  colors are on-colors too: there are no `text.*` or `text-emphasis.*` groups, since
  a text color means nothing without the surface it sits on.
- **Bootstrap's names, only where the meaning matches.** `link`, `link-hover`,
  `border`, `focus-ring` and `placeholder` are Bootstrap's words. Don't borrow one
  that means something else: Bootstrap's "emphasis" means more contrast, and its
  "secondary" means muted gray. The status roles (`success`, `info`, `warning`,
  `danger`, with `-text-emphasis`, `-bg-subtle`, `-border-subtle`) fit status
  colors when those are approved.
- **Names:** say what a token is for, never what it looks like. No color names in
  paths. Red is primary color 1 and Blue is primary color 2; never call Blue
  "secondary". Name the part a color colors (`container.color`, `link.color`). States
  nest as `hover.*`, `open.*`, `focus.*`, `focus-visible.*`. Breakpoints nest as
  `sm.*` (576px), `md.*` (768px), `lg.*` (992px): screen widths, not sizes, so the
  Tokens page index labels them "From 768px". A size an author picks is spelled out
  (`size.medium`, `size.small`), so it can't be read as a breakpoint. A variant group
  holds only what it changes. A theme decision (such as the header's color) is a
  repointed semantic token, not a variant.
- **One group per named thing, when more are coming.** When a component will have
  several of something (background patterns), give each its own group
  (`background-pattern.monsoon.*`) holding its image, layout and sizes, with shared
  things such as colors at the root. Name the group after the thing, without color
  names, even when the thing's own name has one (`monsoon` for Monsoon Rain).
- **Tokenize decisions, not drawing details.** Give a value a token when it's a
  design decision someone could change (for a theme, surface, size or breakpoint) or
  one shared with something else: colors, type, padding, gaps, size variants. Leave
  the internals of how a part is drawn (the length of the lines in an icon, how
  round their ends are) in the implementation's CSS or SVG. An alignment that went
  through design review (an underline offset, an icon nudged into line with text) is
  a decision. If the design renders a decision the issue doesn't list, give it a
  token too, and say so in the PR.
- **Only what the DTCG spec defines.** Use its types (`color`, `dimension`,
  `fontFamily`, `fontWeight`, `duration`, `cubicBezier`, `number`, and its composite
  types). Don't add a custom `$type`, or data the spec doesn't mention. Values DTCG
  can't express are plain `number`s that implementations give a unit: a percentage
  is `20` for 20% (`calc(var(--token) * 1%)`), and a multiple of the text size is
  `1.042` (`calc(var(--token) * 1em)`). Say so in the description.
- **Opacity isn't a token.** Designers don't want opacity tuned, so a fade that's
  part of an artwork (a pattern at 40%) is built into the asset.
- **Keep it recreatable in Figma.** Designers rebuild these designs in Figma, so
  prefer shapes Figma can hold: colors and px dimensions become variables; a
  percentage can't, so record its min and max in px too; an image can't, so it's an
  asset (below) that imports as a vector, with its fill bound to the color variable.

### Assets

Artwork the design system owns (background patterns, not the university wordmark,
which lives on the university's CDN) goes in `packages/tokens/assets/<kind>/`,
published with the tokens package.

- **Single-color art is a mask:** black shapes (the default fill, no `<style>` or
  per-path classes), with any opacity built in. An on-color token paints it, so one
  file works on every surface and the color changes without a new file.
- **Assets aren't tokens.** The DTCG format (2025.10) has no type for files, so
  there's no asset token, and no custom `$type` or `$extensions` workaround: use only
  what the spec defines. Implementations point at the file directly, and the
  pattern's tokens size and color it. Say which file a group uses in its
  descriptions and on its docs page.
- Palette renames apply to asset names too (Monsoon Sky → Monsoon Rain).

### Contracts

When the branch has `packages/contracts` (see its README), every component with
tokens gets a contract, `packages/contracts/contracts/<name>.contract.json`: its
anatomy, independent of any platform.

- **Only token references.** Each part maps design properties, named the way tokens
  are (`color`, `fill`, `padding.x`, `font.size`, `underline.offset`), to tokens. No
  values, and no platform's property names (no `padding-inline`).
- **Parts, states, breakpoints.** `anatomy.root` is the component; `parts` nest inside
  it. `states` (`hover`, `focus-visible`, `active`, `open`, `disabled`) and
  `breakpoints` (`sm`…`xxl`) hold only what changes.
- **The contract does the wiring.** It points each part's colors straight at the
  token they use, usually a brand color; semantic tokens only where the decision is
  shared or themeable. Component tokens hold what's specific to the component, such
  as sizes and weights.
- **`npm run build:contracts` must pass.** It refuses a contract that doesn't match the
  schema, references a missing token, or leaves one of the component's tokens unused.
  Remove any component token it notes as only pointing at another token.

## 3. Record the values (`packages/tokens/tokens.json`)

- Take each value from the source settled in step 1. Sizes are literals in the token
  that uses them (see step 2); don't add value-named primitives.
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
  `<TokenTable items={getTokenDisplayItems('az.component.<name>.')} />`. With a
  contract, add an Anatomy section, `<ContractAnatomy contract="<name>" />`, before
  the token table.
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
| `.breadcrumb a` `color` | `var(--az-color-brand-azurite)` | The contract points the link at the brand color |
| `.breadcrumb-item-home::before` background SVG | `mask` of the same SVG, `background-color: var(--az-color-brand-azurite)` | The SVG has Azurite built in |

- Cover every token: the Sass variable when there is one, the CSS variable it
  compiles to, or the selector and property when the value is hard-coded.
- Note where Arizona Bootstrap's value changes (a palette rename, a new token),
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
- Every tokenized value is a `var(--az-…)`. Leave drawing details that aren't tokens
  to Arizona Bootstrap's own CSS. Each other exception gets a comment saying why (an
  asset, a missing token tier).
- When Arizona Bootstrap bakes a color into an SVG data URI, use that SVG as a `mask`
  and paint it with `background-color: var(<token>)`.
- For transitions, set only `transition-duration` and `transition-timing-function`, so
  reduced motion still turns them off.
- Keep a technique a PR chose for a reason (e.g. az-digital/arizona-bootstrap#2346
  made every breadcrumb underline the same bottom border so they line up). Don't swap
  in another technique just to use a token more literally.

### Verify

- `npm run build:tokens`, `npm run build:contracts` (when the branch has contracts)
  and `npm run lint:storybook` pass.
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
