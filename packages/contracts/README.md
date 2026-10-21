# @az-digital/contracts

Component contracts for the Arizona Digital design system. A contract records one
component's anatomy, independent of any platform: the parts it's made of, and what
sets each part's design properties: a design token from `@az-digital/tokens`
(`tokens.json`), or the component's own value. The check generates a CSS and a Sass
variable for each of a component's own values.

## Why contracts

Without a contract, `tokens.json` does the wiring too: a component needs its own
token for everything it uses, even a color that only points at another token
(`brand-header.logo.color` → White), and colors pick up semantic tokens whose only job
is to give one component a name to point at. Those tokens add up, and each becomes a
variable designers have to manage in Figma.

A contract does the wiring instead, and holds what's specific to the component itself,
so `tokens.json` stays small and components don't need tokens of their own:

- **Brand colors**, which contracts point at for colors.
- **Shared and semantic tokens** only for decisions that are really shared or that a
  theme changes, such as the focus ring's width (`az.focus-ring.width`).
- **The component's own values**, such as its sizes and timings, written in the
  contract like a DTCG token, with a description of what each is for. There are no
  primitives named after their values (`az.dimension.50`): a name that's its own value
  can never change, and it ties unrelated decisions together.

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
        "height": {
          "$type": "dimension",
          "$value": { "value": 50, "unit": "px" },
          "$description": "Header height."
        }
      },
      "parts": {
        "logo": {
          "description": "The wordmark, which links to the home page.",
          "tokens": {
            "color": "{az.color.brand.white}",
            "width": {
              "$type": "dimension",
              "$value": { "value": 211, "unit": "px" },
              "$description": "Wordmark width below 576px."
            }
          },
          "breakpoints": {
            "sm": {
              "width": {
                "$type": "dimension",
                "$value": { "value": 266.41, "unit": "px" },
                "$description": "Wordmark width from 576px up."
              }
            }
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
  - **`tokens`:** its resting look. Each design property is either a reference to a
    token in `tokens.json` (`"{az.color.brand.blue}"`), or the component's own value,
    written like a DTCG 2025.10 token: a `$type` (`dimension`, `duration`,
    `cubicBezier`, `fontWeight` or `number`), a `$value` and a `$description`.
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

- doesn't match `contract.schema.json`, for example a bare value like `"50px"`, or a
  value with no `$description`,
- references a token that isn't in `tokens.json`,
- leaves one of its component's own tokens (`az.component.<id>.*`) unused, if it
  has any, so the contract and the tokens can't drift apart, or
- would generate a variable name that another value or a token already uses.

It also notes component tokens that only point at another token, which the contract
can reference directly. Those can be removed from `tokens.json`.

When it passes, it writes:

- **`dist/contracts.json`:** every design property as a row (part, state or
  breakpoint, property, and the token or value). Component docs pages read it to show
  an Anatomy table.
- **`dist/contracts.css` and `dist/contracts.scss`:** a variable for each of a
  component's own values, named after where it sits: `brand-header` › `logo` › `sm` ›
  `width` is `--az-brand-header-logo-sm-width` (`$az-brand-header-logo-sm-width`).
  Colors and shared decisions aren't repeated here; use their token's variable.

## Adding a contract

1. Write `contracts/<component>.contract.json`, pointing each part's colors at the
   colors they use (usually brand colors) and shared decisions at their shared token,
   and writing everything else as the component's own values. Add a token to
   `tokens.json` only for a decision that's really shared or that a theme changes.
2. Run `npm run build:contracts`, and remove any component token it flags.
3. Load `@az-digital/contracts/dist/contracts.css` (or `contracts.scss`) in the
   implementation, and use the generated variables.
4. Show the anatomy on the component's docs page:
   `<ContractAnatomy contract="<component>" />`.
