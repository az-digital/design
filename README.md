# Arizona Digital Design System

A design token and Storybook workspace for the Arizona Digital design system. This repo contains the source token definitions, generated token output, and a Storybook environment for reviewing and validating visual tokens.

## Repository Structure

This is an npm workspaces monorepo with three packages:

```text
├── packages/
│   ├── tokens/                 # @az-digital/tokens — design token source and build output
│   │   ├── tokens.json         #   source DTCG token definitions
│   │   ├── style-dictionary.config.mjs
│   │   ├── dist/               #   generated output (gitignored, built by Style Dictionary)
│   │   │   ├── tokens.css      #     CSS custom properties (--az-color-brand-*, etc.)
│   │   │   └── tokens.scss     #     Sass variables (aliases kept as references)
│   │   └── package.json
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

`npm run build:tokens` runs Style Dictionary against `tokens.json` and writes generated, gitignored output to `packages/tokens/dist/`:

- `tokens.css` — CSS custom properties (e.g. `--az-color-brand-blue`) for consumption in stylesheets.
- `tokens.scss` — Sass variables with literal values (e.g. `$az-color-brand-blue: #0c234b;`) for Sass-based builds.

Never edit files in `dist/` directly — they're regenerated on every token build.

## Storybook Notes

The Storybook package renders the design token catalog, groups nested token values, and provides a review surface for design decisions and naming conventions.

It also includes small validation tests covering token grouping and metadata parsing so token structure changes are caught early.

The token UI (token tables, the token details drawer with its alias tree, the component token index, and the Tokens tab) comes from `@az-digital/storybook-addon-tokens`. The brand color swatches on the Tokens page (`packages/storybook/stories/ColorSwatchGrid.tsx`) are this site's own, and embed the addon's token pill. It reads `packages/tokens/style-dictionary.config.mjs`, so the details for each token show exactly what each output file derives from it. See its [README](packages/storybook-addon-tokens/README.md).

### Storybook MCP for AI Agents

Storybook includes `@storybook/addon-mcp`, which exposes a local Model Context Protocol server while the Storybook dev server is running. See [AGENTS.md](./AGENTS.md) for how coding agents should use it.

## Related Standards

This project follows the broader design token ecosystem and aligns with the [Design Tokens Technical Reports](https://www.designtokens.org/technical-reports/), including the specification work that informs structured token definitions and interoperability.

## How It Works

- Tokens are authored in a structured JSON format and stored in `packages/tokens/tokens.json`.
- The token package builds output through Style Dictionary.
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
