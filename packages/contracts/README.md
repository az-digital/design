# @az-digital/contracts

Component contracts for the Arizona Digital design system. A contract records one
component's anatomy, independent of any platform: the parts it's made of, and which
design token sets each part's design properties.

A contract holds only token references. The values live in `@az-digital/tokens`
(`tokens.json`), which builds as it always has.

## Why contracts

Without a contract, `tokens.json` does the wiring too: a component needs its own
token for everything it uses, even a color that only points at another token
(`brand-header.logo.color` → White), and colors pick up semantic tokens whose only job
is to give one component a name to point at. Those tokens add up, and each becomes a
variable designers have to manage in Figma.

A contract does the wiring instead. It points each part straight at the token it uses,
so `tokens.json` holds values, and components don't need tokens of their own:

- **Brand colors**, for colors.
- **Primitives** named after their values, for sizes and timings: `az.dimension.50`,
  `az.duration.150`, `az.easing.ease-in-out`. A primitive's name is its value, so it
  never changes; to change a component, point its contract at a different primitive.
- **Shared and semantic tokens** only for decisions that are really shared or that a
  theme changes, such as the focus ring's width (`az.focus-ring.width`).

The idea comes from the design-system contracts proof of concept
([southleft/ds-contracts-poc](https://github.com/southleft/ds-contracts-poc)), whose
contracts likewise bind a component's parts to tokens.

## A contract

`contracts/<component>.contract.json`, checked against
[`contract.schema.json`](./contract.schema.json):

```json
{
  "$schema": "../contract.schema.json",
  "id": "brand-header",
  "name": "Arizona Header",
  "description": "The university's header bar…",
  "sources": ["az-digital/arizona-bootstrap#2299: the blue header is the default"],
  "anatomy": {
    "root": {
      "description": "The header bar.",
      "tokens": {
        "fill": "{az.color.brand.blue}",
        "height": "{az.dimension.50}"
      },
      "parts": {
        "logo": {
          "description": "The wordmark, which links to the home page.",
          "tokens": {
            "color": "{az.color.brand.white}",
            "width": "{az.dimension.211}"
          },
          "breakpoints": {
            "sm": { "width": "{az.dimension.266-41}" }
          },
          "states": {
            "focus-visible": { "ring.color": "{az.color.brand.white}" }
          }
        }
      }
    }
  }
}
```

- **`id`:** the component's name. Its own tokens, if it has any, are `az.component.<id>.*`.
- **`sources`:** where the decisions come from, such as reviewed pull requests.
- **`anatomy`:** a tree of parts, starting at `root`, the component itself. Each part
  has a `description` and can have:
  - **`tokens`:** its resting look. Each design property maps to a token reference.
  - **`states`:** what changes in `hover`, `focus-visible`, `active`, `open` or
    `disabled`. Only what changes.
  - **`breakpoints`:** what changes from `sm` (576px), `md` (768px), `lg` (992px),
    `xl` (1200px) or `xxl` (1400px) up. Only what changes.
  - **`parts`:** the parts inside it.

Design properties are named the way tokens are, not after any platform's properties:
`color`, `fill`, `padding.x`, `gap`, `font.size`, `font.weight`, `line-height`,
`size`, `underline.offset`.

## The check

```bash
npm run build:contracts
```

The check refuses a contract, naming the problem, when it:

- doesn't match `contract.schema.json`, for example a value that isn't a token
  reference,
- references a token that isn't in `tokens.json`, or
- leaves one of its component's own tokens (`az.component.<id>.*`) unused, if it
  has any, so the contract and the tokens can't drift apart.

It also notes component tokens that only point at another token, which the contract
can reference directly. Those can be removed from `tokens.json`.

When it passes, it writes `dist/contracts.json`: every design property as a row (part,
state or breakpoint, property, token). Component docs pages read it to show an
Anatomy table.

## Adding a contract

1. Add any primitive the component needs that `tokens.json` doesn't have yet, named
   after its value (`az.dimension.24`). Add a semantic token only for a decision that's
   really shared or that a theme changes.
2. Write `contracts/<component>.contract.json`, pointing each part's colors at the
   colors they use (usually brand colors), its sizes and timings at primitives, and
   shared decisions at their shared token.
3. Run `npm run build:contracts`, and remove any component token it flags.
4. Show the anatomy on the component's docs page:
   `<ContractAnatomy contract="<component>" />`.
