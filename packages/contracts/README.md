# @az-digital/contracts

Component contracts for the Arizona Digital design system. A contract records one
component's anatomy, independent of any platform: the parts it's made of, and what
sets each part's design properties: a design token from `@az-digital/tokens`
(`tokens.json`), or the component's own value. Contracts are data: they generate
nothing for any platform. Each implementation writes the component's own values its
own way, and a contract check compares the implementation with its contract.

## Why contracts

Without a contract, `tokens.json` does the wiring too: a component needs its own
token for everything it uses, even a color that only points at another token
(`button.label.color` → White). Those tokens add up, and each becomes a variable
designers have to manage in Figma.

A contract does the wiring instead, and holds what's specific to the component itself.
It points each part at tokens named the way the Naming page (Foundations › Tokens ›
Naming) describes:

- **Color tokens** for what they color and where, such as `az.color.bg.button.red-hover`
  and `az.color.fg.white`, which alias the brand colors. A context such as `button`
  covers anything that behaves like one, so components share it.
- **Scales** of numbered or named steps (`az.spacing.2`, `az.radius.pill`). There are no
  tokens named after their values (`az.dimension.50`): a name that's its own value can
  never change, and it ties unrelated decisions together.
- **Shared decisions**, such as the focus ring's width (`az.focus-ring.width.md`), named
  after Bootstrap 6's name for them.
- **The component's own values**, such as its sizes and timings, written in the
  contract like a DTCG token, with a description of what each is for.

The idea comes from the design-system contracts proof of concept
([southleft/ds-contracts-poc](https://github.com/southleft/ds-contracts-poc)), whose
contracts likewise bind a component's parts to tokens.

## A contract

`contracts/<component>.contract.json`, checked against
[`contract.schema.json`](./contract.schema.json):

```json
{
  "$schema": "../contract.schema.json",
  "id": "button",
  "name": "Button",
  "description": "An action in a form, a dialog or a page…",
  "sources": ["az-digital/arizona-bootstrap#2281: 2026 brand buttons"],
  "variants": {
    "color": {
      "description": "The button's colors, each for the backgrounds named in its description.",
      "default": "red",
      "options": {
        "red": {
          "description": "Red, the primary button, on White, Cloud or Caliche.",
          "anatomy": {
            "root": {
              "tokens": { "fill": "{az.color.bg.button.red}" },
              "states": { "hover": { "fill": "{az.color.bg.button.red-hover}" } },
              "parts": { "label": { "tokens": { "color": "{az.color.fg.white}" } } }
            }
          }
        }
      }
    }
  },
  "anatomy": {
    "root": {
      "description": "The button: its shape, border and padding.",
      "tokens": {
        "padding.y": {
          "$type": "dimension",
          "$value": { "value": 9, "unit": "px" },
          "$description": "Button top and bottom padding, so the button is 46px tall."
        }
      },
      "states": {
        "focus-visible": { "ring.width": "{az.focus-ring.width.md}" }
      },
      "parts": {
        "label": { "description": "The button's text." }
      }
    }
  }
}
```

- **`id`:** the component's name. Its own tokens, if it has any, are `az.component.<id>.*`.
- **`sources`:** where the decisions come from, such as reviewed pull requests.
- **`anatomy`:** a tree of parts, starting at `root`, the component itself. Each part
  has a `description` and can have:
  - **`tokens`:** its resting look. Each design property is either a reference to a
    token in `tokens.json` (`"{az.color.brand.blue}"`), or the component's own value,
    written like a DTCG 2025.10 token: a `$type` (`dimension`, `duration`,
    `cubicBezier`, `fontFamily`, `fontWeight`, `number` or `color`), a `$value` and a
    `$description`. A `color` value is only for a color that isn't in the brand palette
    yet, and its description says so.
  - **`states`:** what changes in `hover`, `focus-visible`, `focus-within`, `active`,
    `open` or `disabled`. Only what changes.
  - **`breakpoints`:** what changes from a breakpoint's minimum viewport width up.
    Keys use the same names as the `az.breakpoint.<name>` tokens, so `breakpoints.lg`
    means `az.breakpoint.lg`; `sm` is 576px, `md` 768px, `lg` 992px, `xl` 1200px
    and `xxl` 1400px. Only what changes.
  - **`parts`:** the parts inside it.
- **`variants`** (optional): ways the component varies, such as `size` or `color`. Each
  has a `description`, its `options`, and a `default` when the anatomy alone isn't
  complete (the button's anatomy sets no colors, so its `color` default is `red`). An
  option has a `description` and an `anatomy` that holds only what it changes, in the
  same shape.

Design properties are named the way tokens are, not after any platform's properties:
`color`, `fill`, `padding.x`, `gap`, `font.size`, `font.weight`, `line-height`,
`size`, `underline.offset`.

## The check

```bash
npm run build:contracts
```

The check refuses a contract, naming the problem, when it:

- doesn't match `contract.schema.json`, for example a bare value like `"50px"`, or a
  value with no `$description`,
- references a token that isn't in `tokens.json`,
- leaves one of its component's own tokens (`az.component.<id>.*`) unused, if it
  has any, so the contract and the tokens can't drift apart,
- has a variant option that changes a part the anatomy doesn't have, or
- names a variant `default` that isn't one of its options.

It also notes component tokens that only point at another token, which the contract
can reference directly. Those can be removed from `tokens.json`.

When it passes, it writes **`dist/contracts.json`**: every design property as a row
(part, state or breakpoint, property, and the token or value). Component docs pages
read it to show an Anatomy table, and contract checks read it to compare an
implementation with its contract.

## Implementations and contract checks

A contract doesn't generate CSS, Sass or any other platform's code, so the component's
own values live in one place. An implementation uses token outputs from
`@az-digital/tokens` for tokens, and writes the component's own values as its platform
needs them: Arizona Bootstrap's `$btn-padding-y` should be `9px` because the button's
contract says `9px`. A contract's pull request gives each implementation's maintainers
update instructions: which of their variables and rules change, and to what.

A contract check keeps them in step once an implementation has been updated.
`checkContract` (`packages/storybook/stories/Primary/Components/contractCheck.ts`)
renders an implementation in a real browser and compares each property's computed
style with the contract's token or value, at rest, with keyboard focus and on hover,
and lists every property that differs. A component's check is a story with a `play`
function that renders the implementation's markup and runs it;
`npm run test:storybook` runs it in CI.

## Adding a contract

1. Write `contracts/<component>.contract.json`, pointing each part's colors at the
   color tokens they use and shared decisions at their shared token, and writing
   everything else as the component's own values.
   Name any new token as the Naming page describes.
2. Run `npm run build:contracts`, and remove any component token it flags.
3. In the pull request, write update instructions for each implementation: which
   variables and rules change, to which token or value.
4. Once an implementation has been updated, add a contract check story that renders
   it and runs `checkContract`, so it fails when the two drift apart.
5. Show the anatomy on the component's docs page:
   `<ContractAnatomy contract="<component>" />`.
