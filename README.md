# Arizona Digital Design System

A design token and Storybook workspace for the Arizona Digital design system. This repo contains the source token definitions, generated token output, and a Storybook environment for reviewing and validating visual tokens.

## Repository Structure

This is an npm workspaces monorepo with two packages:

```text
├── packages/
│   ├── tokens/                 # @az-digital/tokens — design token source and build output
│   │   ├── tokens.json         #   source DTCG token definitions
│   │   ├── terrazzo.config.ts
│   │   ├── dist/               #   generated output (gitignored, built by Terrazzo)
│   │   │   ├── tokens.css      #     CSS custom properties (--az-color-brand-*, etc.)
│   │   │   ├── tokens.vars.js  #     JS module exporting var(...) references matching tokens.css
│   │   │   └── tokens.vars.d.ts
│   │   └── package.json
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
| `@az-digital/tokens` | `packages/tokens/` | Source token definitions and Terrazzo build pipeline |
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
| `npm run build:tokens` | Build token output using Terrazzo |
| `npm run test:storybook` | Run the Storybook package tests |
| `npm run lint:storybook` | Run ESLint for the Storybook package |
| `npm run build:all` | Build token output and Storybook assets |

## Token Workflow

1. Update token values in `packages/tokens/tokens.json`.
2. Run the token build script:

```bash
npm run build:tokens
```

3. Review the generated token catalog in Storybook.

### `dist/` Output

`npm run build:tokens` runs Terrazzo against `tokens.json` and writes generated, gitignored output to `packages/tokens/dist/`:

- `tokens.css` — CSS custom properties (e.g. `--az-color-brand-blue`) for consumption in stylesheets.
- `tokens.vars.js` / `tokens.vars.d.ts` — a JS/TS module exporting the same tokens as `var(...)` reference strings (e.g. `az.color.brand.blue` → `"var(--az-color-brand-blue)"`), so code can reference the actual generated CSS variable names instead of hand-reconstructing them.

Never edit files in `dist/` directly — they're regenerated on every token build.

## Storybook Notes

The Storybook package renders the design token catalog, groups nested token values, and provides a review surface for design decisions and naming conventions.

It also includes small validation tests covering token grouping and metadata parsing so token structure changes are caught early.

The Tokens docs page also includes a custom `ColorSwatchGrid` component (`packages/storybook/stories/ColorSwatchGrid.tsx`) that renders colors as swatches with their name, HEX, RGB, CMYK, and Pantone (PMS) values, using the real generated CSS custom properties from `dist/tokens.css` for each swatch's color.

### Storybook MCP for AI Agents

Storybook includes `@storybook/addon-mcp`, which exposes a local Model Context Protocol server while the Storybook dev server is running. See [AGENTS.md](./AGENTS.md) for how coding agents should use it.

## Related Standards

This project follows the broader design token ecosystem and aligns with the [Design Tokens Technical Reports](https://www.designtokens.org/technical-reports/), including the specification work that informs structured token definitions and interoperability.

## How It Works

- Tokens are authored in a structured JSON format and stored in `packages/tokens/tokens.json`.
- The token package builds output through Terrazzo.
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
- Tokens > Design Tools
- Tokens > Contributing
