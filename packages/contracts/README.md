# @az-digital/contracts

Component contracts for the Arizona Digital design system. A contract records one
component's anatomy, independent of any platform: the parts it's made of, and which
design token sets each part's design properties.

A contract holds only token references. The values live in `@az-digital/tokens`
(`tokens.json`), which builds as it always has.

## Why contracts

Without a contract, a component needs its own token for everything it uses, even a
color that only repeats a semantic one (`breadcrumb.link.color` →
`on-default.link-quiet`). Those tokens add up, and each becomes a variable designers
have to manage in Figma. A contract can point a part straight at the semantic token,
so component tokens (`az.component.<component>.*`) only hold what's specific to the
component, such as its sizes and weights.

The idea comes from the design-system contracts proof of concept
([southleft/ds-contracts-poc](https://github.com/southleft/ds-contracts-poc)), whose
contracts likewise bind a component's parts to tokens.

## A contract

`contracts/<component>.contract.json`, checked against
[`contract.schema.json`](./contract.schema.json):

```json
{
  "$schema": "../contract.schema.json",
  "id": "breadcrumb",
  "name": "Breadcrumb",
  "description": "A row of links from the home page to the current page…",
  "sources": ["az-digital/arizona-bootstrap#2346: weight, size and the hover underline"],
  "anatomy": {
    "root": {
      "description": "The breadcrumb itself.",
      "tokens": {
        "fill": "{az.color.semantic.surface.default}",
        "padding.x": "{az.component.breadcrumb.padding.x}"
      },
      "breakpoints": {
        "lg": { "margin-bottom": "{az.component.breadcrumb.lg.margin-bottom}" }
      },
      "parts": {
        "link": {
          "description": "A linked item's text.",
          "tokens": { "color": "{az.color.semantic.on-default.link-quiet}" },
          "states": {
            "hover": { "underline.width": "{az.component.breadcrumb.hover.underline.width}" }
          }
        }
      }
    }
  }
}
```

- **`id`:** the component's name. Its own tokens are `az.component.<id>.*`.
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
- leaves one of its component's own tokens unused, so the contract and the tokens
  can't drift apart.

It also notes component tokens that only repeat a semantic color the contract
references directly. Those can be removed from `tokens.json`.

When it passes, it writes `dist/contracts.json`: every design property as a row (part,
state or breakpoint, property, token). Component docs pages read it to show an
Anatomy table.

## Adding a contract

1. Record the component's decisions in `tokens.json`: semantic colors on the
   surface it sits on, and its own tokens for what's specific to it.
2. Write `contracts/<component>.contract.json`, pointing each part's colors at the
   semantic tokens and its other properties at the component's tokens.
3. Run `npm run build:contracts`, and remove any component token it flags.
4. Show the anatomy on the component's docs page:
   `<ContractAnatomy contract="<component>" />`.
