# AGENTS.md

Arizona Digital design token and Storybook monorepo — npm workspaces.

## Project overview

- `@az-digital/tokens` — design token source (DTCG format) and Terrazzo build pipeline
- `@az-digital/storybook` — Storybook environment for reviewing and documenting tokens, private

`packages/components-web` exists as a placeholder workspace for future web components; it has no package.json yet.

## Architecture: tokens are the foundation

Tokens are the root of this design system — everything else is built on top of them:

- **Primitive tokens** (`packages/tokens/tokens.json`) are the raw values: brand colors, etc.
- **Components** (future `packages/components-web`) should consume tokens rather than hardcoding values — a component's colors, spacing, and typography should reference token output (`dist/tokens.css` custom properties or `dist/tokens.vars.js`), not literals.
- **Component-level tokens** (e.g. `--button-bg` aliased to a primitive brand color) may emerge as `components-web` grows. When they do, they still belong in the token layer conceptually — a component-specific token is still a token, just scoped to one component instead of the whole system. Prefer aliasing primitives over inventing new raw values at the component level.

When `components-web` gains real content, revisit this section and add a `packages/components-web/AGENTS.md` documenting its own conventions.

## Token flow

1. **Source:** `packages/tokens/tokens.json` (DTCG format) is the only file hand-edited.
2. **Build:** `npm run build:tokens` runs Terrazzo, writing gitignored output to `packages/tokens/dist/`: `tokens.css` (CSS custom properties) and `tokens.vars.js`/`.d.ts` (the same tokens as `var(...)` reference strings).
3. **Consumption in Storybook:** `packages/storybook/stories/tokens.mdx` imports both the source (`tokens.json`, for the tree/table/color views) and the built `dist/` output (`tokens.css` and `tokens.vars.js`, both compiled and as raw text via `?raw` for the download links) to render the Tokens docs page.
4. **Downstream:** the Tokens page's download links and the Design Tools/Contributing pages are how designers get `tokens.json`/`tokens.css`/`tokens.vars.js` into Figma (manual import or Tokens Studio sync) — see `packages/storybook/AGENTS.md` for the doc-page breakdown.

## Setup

```bash
npm install
```

Requires Node 24+ (see `.nvmrc`). All dependencies are hoisted to the root `node_modules/`.

## Build and test commands

Run from the repo root:

```bash
npm run build:tokens      # build token output via Terrazzo
npm run build:storybook   # build Storybook static output
npm run lint:storybook    # lint the storybook workspace
npm run test:storybook    # run storybook workspace tests
npm run build:all         # build:tokens + build:storybook
```

Run `npm run build:all` after any token, story, or MDX change. Fix all failures before finishing.

## Dev environment

Start Storybook:

```bash
npm run dev:storybook
```

Check for an already-running Storybook terminal before starting a new one. Default port is 6006 (falls back to the next open port if occupied).

## Package-specific guidance

Each package has its own `AGENTS.md` with detailed conventions:

- `packages/tokens/AGENTS.md` — token source and build conventions
- `packages/storybook/AGENTS.md` — Storybook/MDX conventions and known pipeline quirks

## Best practices reference

`.github/skills/storybook-mdx/SKILL.md` documents recurring Storybook/MDX pipeline gotchas discovered in this repo — consult it before debugging rendering issues that look like markdown/MDX parsing problems.
