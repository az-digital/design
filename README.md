# Arizona Digital Design System

A design token and Storybook workspace for the Arizona Digital design system. This repo contains the source token definitions, generated token output, and a Storybook environment for reviewing and validating visual tokens.

## Repository Structure

This is an npm workspaces monorepo with four packages:

```text
├── packages/
│   ├── tokens/                 # @az-digital/tokens — design token source and build output
│   │   ├── tokens.json         #   source DTCG token definitions
│   │   ├── style-dictionary.config.mjs
│   │   ├── dist/               #   generated output (committed, built by Style Dictionary)
│   │   │   ├── tokens.css      #     CSS custom properties (--az-color-brand-*, etc.)
│   │   │   ├── tokens.scss     #     Sass variables
│   │   │   ├── tokens.vars.js  #     JS module of var(--…) references
│   │   │   └── tokens.vars.d.ts #    types for tokens.vars.js
│   │   └── package.json
│   ├── contracts/              # @az-digital/contracts — component contracts and their check
│   │   ├── contract.schema.json #  what a contract may say
│   │   ├── contracts/          #   one <component>.contract.json per component
│   │   ├── scripts/build.mjs   #   the check, which also writes dist/contracts.json for docs and contracts.css/.scss
│   │   └── README.md
│   ├── storybook-addon-tokens/  # @az-digital/storybook-addon-tokens — token doc blocks and Tokens tab
│   │   ├── src/                #   addon source (preset, Tokens tab, doc blocks)
│   │   └── README.md
│   └── storybook/             # @az-digital/storybook — private Storybook preview
│       ├── src/               #   token catalog logic and tests
│       ├── stories/           #   Storybook stories
│       ├── .storybook/       #   Storybook config
│       └── package.json
├── package.json               # workspace root
├── README.md                  # this file
└── .gitignore
```

| Package | Path | Purpose |
|---------|------|---------|
| `@az-digital/tokens` | `packages/tokens/` | Source token definitions and Style Dictionary build pipeline |
| `@az-digital/contracts` | `packages/contracts/` | Component contracts: each component's parts, and the token or value that sets each part's design properties ([README](packages/contracts/README.md)) |
| `@az-digital/storybook-addon-tokens` | `packages/storybook-addon-tokens/` | Storybook addon: token doc blocks and the Tokens tab, driven by the Style Dictionary config ([README](packages/storybook-addon-tokens/README.md)) |
| `@az-digital/storybook` | `packages/storybook/` | Storybook UI for token review and documentation |

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

```bash
# from the repo root
npm install

# start Storybook
npm run dev:storybook
```

Storybook will be available at http://localhost:6006.

## Available Scripts

All scripts can be run from the repo root:

| Command | Description |
|---------|-------------|
| `npm run dev:storybook` | Start the Storybook development server |
| `npm run build:storybook` | Build Storybook for production output |
| `npm run build:tokens` | Build token output using Style Dictionary |
| `npm run build:contracts` | Check the component contracts against the tokens, and write their docs data and CSS and Sass variables |
| `npm run test:storybook` | Run the Storybook package tests |
| `npm run lint:storybook` | Run ESLint for the Storybook package |
| `npm run build:all` | Build token output, check the contracts, and build Storybook |

## Token Workflow

1. Update token values in `packages/tokens/tokens.json`.
2. Run the token build script:

```bash
npm run build:tokens
```

3. If a component's tokens changed, update its contract in `packages/contracts/contracts/` and check it:

```bash
npm run build:contracts
```

4. Review the generated token catalog in Storybook.

### `dist/` Output

`npm run build:tokens` runs Style Dictionary (`packages/tokens/style-dictionary.config.mjs`) against `tokens.json` and writes generated output to `packages/tokens/dist/`. The output is committed, so rebuild and commit it with every token change:

- `tokens.css` — CSS custom properties (e.g. `--az-color-brand-blue: #0c234b;`) for stylesheets.
- `tokens.scss` — Sass variables (e.g. `$az-color-brand-blue: #0c234b;`) for Sass-based builds.
- `tokens.vars.js` / `tokens.vars.d.ts` — a JS/TS module exporting the same tokens as `var(...)` reference strings (e.g. `az.color.brand.blue` → `"var(--az-color-brand-blue)"`), so code can reference the generated CSS variable names instead of reconstructing them.

In `tokens.css` and `tokens.scss`, a token that aliases another is written as a reference to it (`outputReferences`), not a copied value: a token whose `$value` is `{color.brand.red}` comes out as `var(--az-color-brand-red)` (or `$az-color-brand-red`). The alias chain from `tokens.json` survives into the output, and overriding one variable updates everything built on it.

`tokens.json` is written the way Tokens Studio reads it, since it's also Tokens Studio's sync file. The top-level `az` is its token set, so references leave it out (`{color.brand.red}`); the Style Dictionary config adds it back before resolving them, so every token keeps its `az.` name in the build, the contracts and Storybook. Sizes are strings (`"8px"`) and font families are one comma-separated string: Tokens Studio doesn't read DTCG 2025.10's `{ "value": 8, "unit": "px" }` objects or font lists yet.

Never edit files in `dist/` directly — they're regenerated on every token build.

The published `@az-digital/tokens` package includes the source `tokens.json` alongside `dist/`, for tools that consume DTCG tokens directly (Figma / Tokens Studio, or another team's own Style Dictionary build): `@az-digital/tokens/tokens.json`. Generated files are imported by path, e.g. `@az-digital/tokens/dist/tokens.css`.

## Component Contracts

A component's contract (`packages/contracts/contracts/<component>.contract.json`) records its anatomy, independent of any platform: the parts it's made of, and what sets each part's design properties at rest, in its states (hover, focus-visible…) and from its breakpoints: a token from `tokens.json`, or the component's own value.

The contract does the wiring that aliases used to do in `tokens.json`: it points each part straight at the token it uses, usually a brand color. So `tokens.json` holds values, not wiring. A component doesn't need its own token for a color, and a color doesn't need a semantic token just so one component has a name to point at. What's specific to a component, such as its sizes and timings, is a value in its contract, written like a DTCG token with a description of what it's for, so components don't have tokens of their own and there are no primitives named after their values. The check generates a CSS and a Sass variable for each one, named after where it sits (`--az-component-brand-header-logo-sm-width`), in `@az-digital/contracts/dist/contracts.css` and `contracts.scss`. Shared decisions, such as the focus ring's width (`az.focus-ring.width`), get one token every component points at, named the way implementations already name the same decision. There are no other semantic tokens yet; add one only for a decision that's really shared or that a theme changes, never just to give one component a name to point at. That keeps the token set, and the variables designers work with, small: brand colors and shared decisions.

`npm run build:contracts` refuses a contract, naming the problem, when it doesn't match `contract.schema.json`, references a token that doesn't exist, leaves one of its component's own tokens (`az.component.<component>.*`) unused, or would generate a variable another value or token already uses. It also flags component tokens that only point at another token, so they can be removed. Component docs pages show the contract as an Anatomy table. See the [contracts README](packages/contracts/README.md).

## Storybook Notes

The Storybook package renders the design token catalog, groups nested token values, and provides a review surface for design decisions and naming conventions.

It also includes small validation tests covering token grouping and metadata parsing so token structure changes are caught early.

The token UI (token tables, the token details drawer with its alias tree, the component token index, and the Tokens tab) comes from `@az-digital/storybook-addon-tokens`. The brand color swatches on the Tokens page (`packages/storybook/stories/Primary/Foundations/Tokens/ColorSwatchGrid.tsx`) are this site's own, and embed the addon's token pill. It reads `packages/tokens/style-dictionary.config.mjs`, so the details for each token show exactly what each output file derives from it. See its [README](packages/storybook-addon-tokens/README.md).

### Storybook MCP for AI Agents

Storybook includes `@storybook/addon-mcp`, which exposes a local Model Context Protocol server while the Storybook dev server is running. See [AGENTS.md](./AGENTS.md) for how coding agents should use it.

## Related Standards

This project follows the broader design token ecosystem and aligns with the [Design Tokens Technical Reports](https://www.designtokens.org/technical-reports/), including the specification work that informs structured token definitions and interoperability.

## How It Works

- Tokens are authored in a structured JSON format and stored in `packages/tokens/tokens.json`.
- The token package builds output through Style Dictionary.
- Component contracts say which token or value sets each part of a component, and a check keeps them in step with the tokens.
- Storybook reads the token source and renders grouped token cards for review.
- The package test suite verifies that nested token paths are flattened and grouped correctly.

## Contributing

When updating tokens or Storybook behavior:

1. Keep the token structure intentional and consistent.
2. Use Storybook to review the rendered output.
3. Run the relevant tests before shipping changes.

This repo is intended to support both token authoring and visual review in one place, with Storybook acting as the primary design review surface.

## Token Collaboration Docs

Use the Storybook token pages to find assets, import tokens, or contribute changes:

- Tokens > Downloads
- Tokens > How to Use
- Tokens > Contributing
