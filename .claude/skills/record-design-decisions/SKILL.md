---
name: record-design-decisions
description: Record a component's design decisions in a component contract in the design system, with tokens named the way the Naming page says, then update Arizona Bootstrap to match with token values and a patch to its Sass. First settle the source of truth for each decision (Arizona Bootstrap PRs, XD mockups, Figma, another Storybook, or a combination), then the contract and tokens, then the values. Use when asked to work on a Design-labeled issue in az-digital/design, record a component's decisions, or figure out where a design's values should come from.
---

# Record design decisions

Developers can't get Figma access, so the design system is how design decisions reach
every implementation. Work in this order, and don't skip ahead: values recorded before
the source and shape are settled get recorded twice.

The contract in the design system comes first; each implementation's changes follow
from it.

1. **Source of truth:** where each decision comes from
2. **Contract and tokens:** which tokens each part uses, and the component's own values
3. **Values:** what each one is set to, from its source
4. **Document it:** the component's docs page in Storybook
5. **Update Arizona Bootstrap:** token values and a patch to its Sass, so the demo
   matches the contract and Arizona Bootstrap can take the same change

A contract check holds the demo to the contract.

Before editing, read on the current branch:

- `README.md` and `AGENTS.md`
- `packages/contracts/README.md`
- The Naming page, `packages/storybook/stories/Primary/Foundations/Tokens/Naming.mdx`
  (`npx storybook tools docs show --input '{"id":"primary-foundations-tokens-naming--docs"}'`
  from `packages/storybook`). It's where token naming lives; don't restate it elsewhere.

## 1. Settle the source of truth

A design's decisions can live in several places, and different decisions in one design
can come from different places. Settle it per decision, and write it down before
recording values.

Places to look:

- **Arizona Bootstrap PRs** (`az-digital/arizona-bootstrap`): body, review comments
  and diff (`gh pr view N -R az-digital/arizona-bootstrap --json body,comments,baseRefName,state,reviewDecision`,
  `gh pr diff`). A PR that went through design or Marketing review is a design
  decision. Search both issues and PRs (`gh search issues` doesn't return PRs; use
  `gh search prs` too).
- **XD mockups**, usually linked from issues and PRs. Often the original design, and
  sometimes older than what shipped.
- **Figma**, the design system file.
- **Other Storybooks**, such as `uaz-web/az-storybook`.
- **Arizona Bootstrap's Sass**, on the branch the work is landing on (below), and its
  releases on the CDN.
- **Live sites** such as arizona.edu: references for comparison, not sources.

Find the branch the work is landing on before comparing anything. Arizona Bootstrap's
README says version 5 is developed on `main` and version 2 on `2.x` (Bootstrap 4, a
different codebase), but release branches such as `5.2.x` and `5.3.x` aren't in the
README. Look at the base branch of the component's recent and open PRs: in October
2026 the button work (#2339, #2378, #2369) targeted `5.3.x`, whose button Sass was
already ahead of `main` and `5.2.x`. Diff the component's Sass between branches
(`gh api "repos/az-digital/arizona-bootstrap/contents/<path>?ref=<branch>"`).

How to decide:

- A decision a designer or Marketing reviewed outranks one nobody reviewed. An approved
  Arizona Bootstrap PR outranks Figma; Figma outranks an unreviewed release value.
  Example: the outline White button's hover text is Gray 800, from the
  Marketing-approved #2281, not Figma's Red or Blue.
- What shipped outranks an issue's summary of it. Read the merged diff, not just a PR's
  description: #2111's description said the text backdrop applied to Monsoon Sky, but
  the merged code only applied it to Trilines.
- A newer reviewed decision outranks an older one, including approved PRs that haven't
  merged yet. List commits to the component's Sass on the landing branch
  (`gh api "repos/az-digital/arizona-bootstrap/commits?sha=<branch>&path=scss/override/_<name>.scss"`,
  and `scss/custom/`). Two values can both be right for different branches: #2281
  gave `5.2.x` 10px padding on a 22px line and #2339 gave `5.3.x` 9px on a 24px line,
  both 46px tall.
- When sources disagree and neither was reviewed, or the newest source is a mockup
  that never shipped, that's a question for the user. Ask it with the options side by
  side; don't pick silently.
- Old palette names always translate to the current palette, value included: Bloom →
  Bougainvillea, Chili → Sonoran Red, Sky → Rain, Midnight → Tinta, Oasis → Arroyo
  Blue, Cool Gray → Cloud, Warm Gray → Caliche. This is settled, not a disagreement.
- Leave out what isn't approved. Role colors (success, danger, warning, info, light,
  dark) wait for Marketing to approve status colors; a variant that isn't in the
  designs yet is recorded only with a note saying so.

Write the result down where reviewers will see it: a decisions table in the PR
description (decision, what's recorded, why), or the issue's "Where values come from"
section. If the issue doesn't list a source yet, draft that section as a local file for
the user to review before posting.

## 2. Write the contract and its tokens

### Contracts

Each component gets a contract, `packages/contracts/contracts/<name>.contract.json`
(see `packages/contracts/README.md`): its anatomy, independent of any platform.

- **Parts, states, breakpoints.** `anatomy.root` is the component; `parts` nest inside
  it. `states` (`hover`, `focus-visible`, `active`, `open`, `disabled`, the schema's
  list) and `breakpoints` (`sm`…`xxl`) hold only what changes.
- **Properties** are named the way tokens are (`color`, `fill`, `padding.x`,
  `font.size`, `ring.color`), not after a platform (no `padding-inline`).
- **Each property points at a token or holds the component's own value.** Colors and
  shared decisions point at tokens. What's specific to the component, such as its
  sizes and timings, is a value written like a DTCG token: a `$type`, a `$value` and a
  `$description` of what it's for.
- **Variants** (`size`, `color`) hold only what each option changes, with a `default`
  when the anatomy alone isn't complete (the button's color default is `red`). Name
  options after what they are, and merge options that end up identical (the button
  has one `outline-white` for Red and Arroyo Blue backgrounds, like Arizona
  Bootstrap's one `.btn-outline-white`). An option's description can name its Arizona
  Bootstrap classes; leave out class names that are only proposed.
- **No platform output.** A contract generates nothing for CSS, Sass or any other
  platform: `npm run build:contracts` writes only `dist/contracts.json`, for docs
  tables and contract checks. Each implementation writes the component's own values
  its own way.
- **`npm run build:contracts` must pass**, and CI fails if the committed
  `packages/contracts/dist` is out of date. It refuses a contract that doesn't match
  the schema or references a missing token.

### Tokens

- **Name them the way the Naming page says.** Don't restate its rules here or in other
  docs; point to it.
- **Check what exists first.** Reuse a token that means the same thing; look at sibling
  components for the pattern.
- **One component's own values stay in its contract**, not as `az.component.*` tokens.
  Never name a token after its value (`az.dimension.50`).
- **Red is primary color 1 and Blue is primary color 2;** never call Blue "secondary".
- **Tokenize decisions, not drawing details.** Leave how a part is drawn (the length of
  an icon's lines) in the implementation. A design-reviewed alignment is a decision.
- **Only what the DTCG spec defines.** Use its types; no custom `$type` or `$extensions`
  workarounds. `tokens.json` is written the way Tokens Studio reads it (see the
  README's `dist/` section): references without the `az` set, sizes as strings.
- **Keep it recreatable in Figma.** Colors and px sizes become variables; an image is
  an asset (below).

### Assets

Artwork the design system owns (background patterns, not the university wordmark)
goes in `packages/tokens/assets/<kind>/`, published with the tokens package.

- **Single-color art is a mask:** black shapes with any opacity built in. A color token
  paints it, so one file works on every surface.
- **Assets aren't tokens.** DTCG has no type for files, so there's no asset token and
  no workaround. Implementations point at the file directly. Palette renames apply to
  asset names too (Monsoon Sky → Monsoon Rain).

## 3. Record the values

- Take each value from the source settled in step 1.
- A value from font metrics rather than CSS (how far an underline sits below the
  baseline) is still a decision if a source measured it and design approved it.
- **Descriptions** say what a value is for, in plain language. Never mention Bootstrap
  or Arizona Bootstrap in `tokens.json` or docs pages; sources go in contract
  `sources`, commit messages and PR descriptions.
- Run `npm run build:tokens` and `npm run build:contracts`, and commit the regenerated
  `dist/` files.

## 4. Document it in Storybook

### Docs page

- Docs pages live in `packages/storybook/stories/Primary/`. Fill in the placeholder
  page if there is one.
- Short sections in plain language. Put variant comparisons in an HTML table (MDX
  doesn't render pipe tables): for the button, one row per color with background,
  fill, text, hover fill, hover text and focus ring. Then
  `<ContractAnatomy contract="<name>" />` for the anatomy and
  `<ContractAnatomy contract="<name>" variant="<axis>.<option>" />` for each option.
- Never name Bootstrap in docs copy. Describe the change instead ("the old palette's
  colors").
- Link a new page from the overviews that list its siblings (Primary overview, the
  group's page), and add it to `storySort.order` in `.storybook/preview.ts` if its
  position matters. Check the rendered sidebar.

### A live example of the implementation

The demo components are drawn by Arizona Bootstrap compiled from its Sass source with
the design system's values (step 5), so the example shows what the contract asks for:

- `.storybook/arizona-bootstrap.scss` imports `tokens.scss`, sets Arizona Bootstrap's
  variables from tokens, then imports Arizona Bootstrap from `node_modules`.
  `.storybook/preview-head.html` loads Proxima Nova.
- Arizona Bootstrap is a devDependency installed from GitHub by tag
  (`github:az-digital/arizona-bootstrap#v5.2.2`). It has no npm release, and
  release branches such as `5.3.x` have no tag or CDN build. When the work lands on
  a release branch, patch the tagged version to match it.
- One story (`<Name>.stories.tsx`) with controls copied from the Figma component's
  properties (the button's: Color, Size, Style, Label). Leave out what's a state
  (hover and focus come from the pointer and keyboard) or out of scope. Use the
  classes the release has (`.btn-sky` until it's renamed). Fall back to the default
  when a control is cleared.
- Tag it `['!dev']` and show it on the docs page with
  `<Canvas of={…} sourceState="none" />` and `<Controls of={…} />`, attached with
  `<Meta of={…} />`.
- Don't restyle the demo with CSS rules written after Arizona Bootstrap. Change it
  the way step 5 says, so the same change can go to Arizona Bootstrap.

## 5. Update Arizona Bootstrap

With the contract settled, change Arizona Bootstrap to match it in two ways (see
"Patching Arizona Bootstrap" in the README):

- **A value with its own Sass variable** is set in `.storybook/arizona-bootstrap.scss`
  from a token (`$bloom: $az-color-fg-bougainvillea;`), before Arizona Bootstrap is
  imported.
- **A value with no variable of its own**, such as a color passed straight into a
  mixin, is changed in Arizona Bootstrap's source. Edit the file under
  `node_modules/arizona-bootstrap/scss/`, then run `npx patch-package arizona-bootstrap`
  from the repo root. That rewrites `patches/arizona-bootstrap+<version>.patch`, which
  the root `postinstall` reapplies on every `npm install`. Write it the way Arizona
  Bootstrap would: its own variables (`$gray-200`, not `$az-color-brand-gray-200`) and
  its code style. Restart Storybook to see it.

Commit the patch with the contract change it supports. Then, in the PR description,
against the branch the work is landing on (step 1):

- First, list the Arizona Bootstrap PRs that already cover part of it (merged, or
  approved and open), and what each covers. Don't patch what they cover.
- Then list the variables set from tokens, and link the patch. Its maintainers can
  apply it to their repo with `git apply -p3 arizona-bootstrap+<version>.patch`.
- Note what Arizona Bootstrap doesn't do at all yet (the button's 4px icon gap), and
  open questions that aren't the contract's (an unapproved variant).
- Don't open or draft Arizona Bootstrap issues.

When Arizona Bootstrap releases a version with the change, bump the tag, and delete
from the patch what the release now includes. `npm install` fails if the patch no
longer applies: redo what still matters on the new version and regenerate it.

## A contract check

`checkContract` (`packages/storybook/stories/Primary/Components/contractCheck.ts`)
renders an implementation in Chromium and compares each property with the contract:

- At rest and with keyboard focus; hover through the hover colors the stylesheet hands
  to `:hover`.
- Every side of padding, borders and corner radii.
- Values compared as drawn: a repeated transition counts once, easing keywords as their
  cubic-bezier, a font stack by its first face.
- An option you leave out takes the contract's default.

Run it while you work to list what still differs, and fix each with a token value or
the patch (step 5). Once the demo matches, add a story tagged `['!dev', '!autodocs']`
that renders every size and color and runs it in a `play` function;
`npm run test:storybook` runs it in CI. Don't add one that fails.

## Verify

- `npm run build:tokens`, `npm run build:contracts`, `npm run lint:storybook` and
  `npm run test:storybook` pass.
- Storybook runs with `npm run dev:storybook` on port 6006; never another port. Reuse it
  if it's running, and restart it after changing `main.ts`, `preview-head.html` or the patch.
- Open the docs page (`/iframe.html?id=<id>--docs&viewMode=docs`) and check what
  renders: `docs show` returns the source, not the rendered page.
- `await document.fonts.ready` before measuring type, and wait out transitions before
  reading colors.

## Branch, commit, PR

- Never create git worktrees. Branch in the main checkout: `issue/<number>-<slug>`,
  from `main`. Don't stack a component's PR on another component's PR; if it needs
  shared tooling from one, bring that in without the other component.
- Keep work local until the user asks to push. Don't keep offering to push.
- The commit message names the issue and the source of each value.
- The PR description has the decisions table, the contract, the tokens, the Arizona
  Bootstrap upgrade instructions, the Storybook changes and a test plan. Push before
  editing it, so it describes what's on the branch.
- `gh pr edit` and `gh issue edit` can fail on this repo; use
  `gh api -X PATCH repos/az-digital/design/{pulls|issues}/N -F body=@file`.
- Show diffs as files (`git diff > file`, then send the file), not pasted into chat.

### Review comments

- Read review threads, PR comments and review summaries. Copilot puts some findings
  only in its summary ("previously missed issue"), with no thread.
- Draft replies as a file and show the user before posting. Fix what's real; say why
  when something isn't changing.

## Talking to the user

Report what you recorded and verified in plain language. Raise a question only when it
needs a person's decision: which source wins when they disagree, a new kind of
structure, or a value no source sets. Settled things (palette renames, a reviewed
source outranking an unreviewed one) aren't questions.
