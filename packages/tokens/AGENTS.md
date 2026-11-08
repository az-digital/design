# Naming design tokens

Read the Naming page before adding or renaming a design token:
`Primary/Foundations/Tokens/Naming` in Storybook
(`packages/storybook/stories/Primary/Foundations/Tokens/Naming.mdx`). It is
the source for how a name is built: `az.[category].[property].[component or
context].[variant]-[state].[size]`. This file adds what to check when you
change `tokens.json`, and the mistakes this repo has already made.

## What the file holds

- **Brand palette (`az.color.brand.*`).** Arizona's named colors, as raw
  values: `$value` is always a literal hex, never an alias. Names describe the
  color itself (`red`, `sonoran-red`, `arroyo-blue`). Gray steps are
  `az.color.brand.gray.100` to `.900`.
- **Color by use (`az.color.bg.*`, `az.color.fg.*`).** Named for where the
  color is used, with the state joined by a
  hyphen: `az.color.bg.button.red`, `az.color.bg.button.red-hover`. The
  value can alias the brand palette or be a documented literal when needed.
  The component or context part (`button`) also covers anything that behaves like
  one, so a new component reuses it instead of getting its own.
- **Scales and shared decisions.** `az.spacing.*`, `az.radius.*`,
  `az.border.width.*`, `az.font-size.*`, `az.font-weight.*`, `az.breakpoint.*`,
  `az.focus-ring.width.*`, `az.opacity.*`. A decision many components share
  takes Bootstrap 6's name with Arizona's value and a size step.
- **Everything specific to one component** (its sizes, timings, a one-off
  length) is a value in that component's contract
  (`packages/contracts/contracts/`), with a description, not a design token.
  Promote it to a design token once a second component shares it.

There is no semantic or component layer (`az.color.semantic.*`,
`az.component.*`) and no value-named primitive layer (`az.dimension.16`).
Earlier branches had them; they were dropped in favor of the Naming page's
structure. Don't reintroduce them. Add a layer only when a real distinction
needs one.

## Rules that still apply

- **Say what it's for.** Use a component or context and, where needed, a
  variant name: `az.color.bg.button.red-hover` names the red button's hover
  fill, whose value happens to be Sonoran Red.
- **No role names yet.** Red and Blue are both primary colors, and which role
  each plays isn't decided. Don't name a design token `primary`, `secondary`,
  `accent` or `destructive`, and don't invent a role from one line of
  guidance prose when no second variant exists.
- **Don't repeat a word.** `az.spacing.100`, not `az.spacing.spacing-100`.
- **A state joins the part before it with a hyphen, and the resting value has
  none.** `red` and `red-hover`, not `red.hover`: `red` couldn't also be the
  start of a group.
- **Lowercase, kebab-case words or numbers.** A part that is only a number
  needs brackets in JavaScript (`az.spacing[100]`) and quotes when it starts
  with a zero (`az.spacing["025"]`); CSS and Sass names are unaffected.
- **A name with a dot in one of its own parts is ambiguous with an alias
  path.** Write 9.6 as `9-6`, not `9.6`.
- **Don't add a layer for its own sake.** An extra tier that is a same-name,
  one-to-one alias of the one below it makes no distinction and adds a step
  to every alias chain.

## Palette names

The palette's current names replaced older ones. Older Arizona Bootstrap
releases and Figma frames may use old names, so translate rather than adding
the old name: Midnight → Tinta, Oasis → Arroyo Blue, Sky → Rain,
Chili → Sonoran Red, Bloom → Bougainvillea, Leaf → Saguaro, River → Shade,
Mesa → Brick, Cool Gray → Cloud, Warm Gray → Caliche (AZ Blue, AZ Red and
Azurite are unchanged). Check the target Bootstrap release's classes rather
than assuming a legacy alias is necessary.

## Where values come from

Don't guess a value. Follow the component contribution guide: agree on the
source for each design decision, and ask maintainers if sources conflict.
Record the decision and source in the issue and component contract rather than
putting pull request numbers in the token's `$description`.

## Mistakes already made here

- **Using camelCase in a token name** (`button.color.redHover`): use the
  Naming page's lowercase parts and hyphenated states.
- **Speculating a role taxonomy** (`destructive`/`primary`) from adjacent
  prose, with no second variant to back it. It asserts a distinction the
  component hasn't earned.
- **A role level named `default`** beside a state that also means "default"
  (`action.default.default`). With one role, the level shouldn't exist.
- **A bare primitive color layer under brand** (`az.color.red`, with
  `brand.red = {az.color.red}`), justified by a color scale that didn't exist.
- **Bare numbers where a value belongs in a scale.** Fixed by using the
  shared scales above, not by adding a value-named primitive for each number.
- **Bundling DOM focus and keyboard focus into one "focus" state.** Plain
  focus looks like hover; only focus-visible adds the ring. They are
  different states with different tokens.
- **Choosing a value without resolving conflicting sources.** Record which
  source governs the decision before adding it.

## Before adding a design token

1. Does one already exist for this use and state? Reuse it instead of adding
   another alias of the same color.
2. Is it shared by more than one component? If not, it is a value in that
   component's contract.
3. Does the name describe a use, not an appearance, and follow the Naming
   page's order and hyphenated state?
4. Does `$description` say what it's for, not just restate its value?
5. Did you run `npm run build:tokens` and commit the regenerated `dist/`
   files, and `npm run build:contracts` if a contract refers to it?
