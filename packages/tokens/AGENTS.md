# Naming design tokens

Tokens are layered: each layer aliases the one directly below it, and gets
more specific to a purpose as you go up. This repo currently has four —
primitive, brand, semantic, component — but the number isn't the rule. Add a
layer when a real distinction needs one; don't add one for its own sake, and
don't collapse two that are actually doing different jobs. What matters:

- A token names what it's *for*, not what it *looks like* — except at the
  lowest layer, whose only job is cataloging raw values.
- A token aliases the layer directly below it. Skipping a layer (e.g. a
  component token pointing straight at a primitive) loses the layer that
  explains *why* — this is a mistake this repo has actually made; see below.

## 1. Primitive (`az.color.<name>`)

Raw values, no meaning attached. Lives directly under `az.color` — no
`primitive` segment in the path. Every other tier explicitly names itself
(`brand`, `semantic`, `component`), which is what makes a bare `az.color.red`
unambiguous as the raw one without needing its own label; tagging this tier
too wouldn't distinguish it from anything; it'd just repeat what "not named
anything else" already says. Names describe the color itself — `red`,
`chili`, `bloom`, `arroyo-blue`. `$value` is a literal (`#ab0520`), never an
alias.

## 2. Brand (`az.color.brand.*`)

Arizona's specific named palette. Same names as primitive, because today
brand is a 1:1 alias onto primitive — `brand.red = {az.color.red}`. If a
color ever needs a scale (e.g. `red.500`, `.700`, ...), brand still picks one
named point from it; the tier boundary is what makes that possible later
without disturbing anything downstream.

`$value` is always an alias onto primitive here, never a literal.

## 3. Semantic (`az.color.semantic.*`)

Purpose-based aliases onto brand. `$value` is always an alias
(`{az.color.brand.red}`), never a literal.

Names describe role and state, never appearance:

- `az.color.semantic.action.default`
- `az.color.semantic.action.hover`
- `az.color.semantic.action.focus-ring`

Structure as `<domain>.<state>`, no `<role>` level — don't invent a role you
can't back with a real, demonstrated example. Button only has one shown
variant today (no story or token for a second color exists), so introducing
a role segment at all would mean exactly one role ever existing under it,
which produces its own bug: naming that one role `default` collides with
`default` already meaning "resting state" one level down
(`action.default.default` — nonsensical to read, and wrong for the same
reason `destructive`/`primary` was wrong; see the mistake log). Add the role
level back — with real role names — the day a second variant actually
exists to justify it.

A color name anywhere in a semantic token's own path is wrong, full stop —
`az.color.semantic.action.red-hover` and `az.color.semantic.action.chili` are
both wrong for the same reason `redHover` was wrong below: the name encodes
what the color looks like instead of what it's for.

## 4. Component (`az.component.<name>.*`)

Component-specific tokens. Every one aliases a primitive — never a literal
directly, color or number. This applies just as much to structural tokens as
to color: `az.component.button.padding.x` aliases `{az.dimension.20}`, not a
bare `20`. Number primitives live in their own type-grouped tiers —
`az.dimension.*` for px-like sizes, `az.font-weight.*`, `az.opacity.*` — kept
separate because a font-weight and a spacing value being both "numbers"
doesn't make them the same kind of thing.

Aliases semantic (not brand or primitive directly) whenever a semantic
concept exists for that value's role — today that's only true for color.
There's no dimension-semantic tier yet because nothing has needed one: every
button size today has exactly one meaning for its padding/font-size, so
component aliasing primitive directly is correct, not a shortcut. Add a
semantic dimension tier (e.g. a shared spacing scale reused with different
meaning across components) the day a real distinction needs one — see the
intro.

Names describe the component's own concern, and don't invent a variant
that isn't actually demonstrated:

- `az.component.button.color` (not `.color.red`, and not split into
  `destructive`/`primary` roles — there's only one shown Button color today;
  see the mistake log below for why a role split was tried and reverted)
- `az.component.button.hover.color`, `az.component.button.focus.color` —
  grouped by state (`hover`, `focus`), not folded into the `color` key as
  suffixed siblings (`color.hover`, `color-hover`, ...). `focus.color`
  aliases `{az.component.button.hover.color}` directly — a component token
  aliasing another component token, not semantic — because plain focus
  (any means) is deliberately identical to hover; see the mistake log.
  `az.component.button.focus-visible.ring` lives in its own group, separate
  from `focus`, because the ring is the one property exclusive to
  focus-*visible* (keyboard) focus — it still aliases semantic like any
  other color token.
- `az.component.button.padding.x`, `.label.font.size`, `.border.radius` —
  still alias a primitive each (`az.dimension.20`, etc.); they just don't
  need a semantic tier in between yet. `.label.font.size` lives under
  `label` (with `label.color`) because both describe the button's
  displayed text — grouped by what part of the component they belong to,
  not by CSS property category; see the mistake log.

If the component's own prop API uses different vocabulary than its tokens
(e.g. a `color` prop that takes literal `'red' | 'blue'`), that's fine — the
prop is a presentational choice for the person using the component, the token
is a design decision about what that choice means. They don't have to match.

## Naming mistakes made and corrected in this repo (concrete examples)

- `az.component.button.color.redHover` — wrong on two counts: `redHover` is
  camelCase (multi-word token segments are kebab-case — enforced by
  `core/consistent-naming` in `terrazzo.config.ts`, currently a warning, but
  treat it as a hard rule), and it names the component's color variant
  (`red`) instead of a role.
- `az.component.button.color.destructive` aliasing `{az.color.brand.red}`
  directly — kebab-case naming was right, but this skipped the semantic
  tier. Fixed by pointing it at a semantic alias instead.
- `destructive`/`primary` as a role split — invented from a single
  Usage-guidance line ("Red signals a destructive action") with no actual
  second variant to back it up: only one Button color is demonstrated by any
  story or token today. Speculating a multi-role taxonomy from adjacent prose
  is exactly the kind of naming this doc warns against — it asserts a
  distinction ("this is for dangerous actions specifically") the component
  hasn't earned yet.
- `az.color.semantic.action.default.default` — first attempt at collapsing
  the above to one role, naming that role `default`. Still wrong: with only
  one role, the role level shouldn't exist at all — naming it `default`
  collided with `default` already meaning "resting state" underneath it.
  Dropped the role level entirely (`az.color.semantic.action.default` /
  `.hover` / `.focus-ring`, `az.component.button.color`); add a role level
  back — with real names — when a second variant exists.
- `az.color.brand.red` holding a literal value (`#ab0520`) directly — missed
  that brand itself needs a primitive tier underneath it. Fixed by moving the
  literal down to `az.color.red` and making brand alias it.
- `az.color.primitive.red` — first attempt at the fix above, adding an
  explicit `primitive` segment. Unnecessary: nothing else lives bare under
  `az.color`, so `az.color.red` was already unambiguous. Flattened to drop
  the redundant segment.
- `az.component.button.padding.x` holding `20` as a literal — only color got
  primitive backing at first; dimension/font-weight/opacity tokens were left
  as bare numbers. Fixed by adding `az.dimension.*`, `az.font-weight.*`, and
  `az.opacity.*` primitive tiers and aliasing every component number token to
  one of them, same as color.
- `az.component.button.focus.color` and `.focus.ring` grouped under one
  `focus` key, applied together as a single bundled "Focus" state — this
  conflated two genuinely different things. Plain DOM focus (any means,
  including a non-visible mouse focus) looks identical to hover: no separate
  value, just the same background. Only focus-*visible* (keyboard) focus adds
  the ring on top. Fixed by keeping `focus.color` (aliasing
  `{az.component.button.hover.color}` explicitly, not deleting it — the token
  still documents that focus was deliberately set equal to hover, it isn't
  just an accidental duplicate) and moving `ring` out to its own
  `focus-visible.ring`, so only the one property exclusive to the
  keyboard-visible case lives under that name.
- `az.component.button.font.size`/`.weight` and
  `az.component.button.label.color` as two separate top-level groups —
  `font` and `label` are both properties of the same thing, the button's
  displayed text, so splitting them by "what kind of CSS property is this"
  (typography vs. color) instead of "what part of the component is this"
  scattered one concept across unrelated keys. Fixed by nesting `font` under
  `label` (`az.component.button.label.font.size`/`.weight`,
  `az.component.button.label.color`), and applying the same nesting to the
  `sm`/`lg` size-variant overrides
  (`az.component.button.size.sm.label.font.size`, not
  `size.sm.font.size`) so the two structures stay consistent with each
  other. Group by what part of the component a token describes, not by CSS
  property category.

## Before adding a new token

1. Does a semantic token already exist for this role + state? Reuse it
   instead of adding another alias to the same brand color.
2. Am I aliasing the tier directly below this one? Component → semantic →
   brand → primitive. Never skip a tier.
3. Does the name describe purpose/role/state? A literal color or appearance
   word anywhere outside primitive/brand is wrong.
4. Multi-word path segments are kebab-case.
5. Does `$description` say what the token is *for*, not just restate its
   value?
