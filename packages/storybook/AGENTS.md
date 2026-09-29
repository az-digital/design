# AGENTS.md — storybook

Storybook environment for `@az-digital/tokens` review and documentation.

## Dev environment

```bash
npm run dev -w @az-digital/storybook
```

Check for an already-running instance before starting a new one. Default port 6006 (falls back to the next open port if occupied).

## Build and test commands

```bash
npm run lint -w @az-digital/storybook
npm run test -w @az-digital/storybook
npm run build -w @az-digital/storybook
```

Prefer keeping `npm run dev -w @az-digital/storybook` running and reviewing story/MDX changes live in the browser. Only run `build` if the dev server output looks wrong in a way that doesn't make sense (build-only failures, e.g. MDX compiling in dev but not in the static build). Run `lint` and `test` when you've changed `src/` code (e.g. `tokenCatalog.ts`).

## Doc pages

- `stories/tokens.mdx` — token diagnostics, downloads, tree, colors, full token table (title: `Tokens`)
- `stories/design-tools.mdx` — importing tokens into Figma Variables without repo access (title: `Tokens/Design Tools`)
- `stories/contributing.mdx` — full Tokens Studio → GitHub sync contribution workflow (title: `Tokens/Contributing`)

Using `/` in a page's `<Meta title="...">` nests it under the parent in the sidebar (e.g. `Tokens/Design Tools` nests under `Tokens`).

## Design workflow

Doc pages (layout, color/typography sections, tables) should be designed in Figma first, then translated into Storybook stories/MDX — Figma is the source of truth for how a page *looks*, Storybook is the implementation. This is separate from token *values*, which always come from `packages/tokens/tokens.json`/`dist/`, never from Figma. When a page's Figma design and its live Storybook implementation drift, treat Figma as the reference to reconcile against.

## MCP tool policy

Three MCP servers cover different jobs here — don't reach for the wrong one:

- **Figma MCP** — for the design half of the workflow above: reading an existing Figma design/frame, or creating/updating one to match a Storybook doc page (or vice versa).
- **Storybook MCP** (`@storybook/addon-mcp`, available at `http://localhost:6006/mcp` while `npm run dev -w @az-digital/storybook` is running) — the default way to preview/validate a story or doc page renders correctly. Prefer it over manually opening a browser tab.
- **Chrome DevTools MCP** — for anything Storybook MCP can't surface: console errors, network requests, accessibility audits, or inspecting compiled/minified bundle output (e.g. confirming whether MDX compiled to a real `<table>` vs. a plain paragraph, as with the markdown-table quirk below).

## Known MDX/Storybook pipeline quirks

- **Requires Node 24+** and the `@storybook/react-vite` framework — `@unpunnyfuns/swatchbook-addon`'s doc blocks are React components and won't run under `html-vite`.
- **`@storybook/addon-docs` must be registered as an addon** in `.storybook/main.ts` (not just installed as a dependency), or `.mdx` files fail to compile under react-vite/rolldown with "JSX syntax is disabled".
- **No GitHub-Flavored-Markdown table support.** This MDX pipeline has no `remark-gfm` plugin, so `| pipe | table |` syntax compiles to a plain paragraph with literal pipe characters instead of an actual table. Use a raw HTML `<table>`/`<tbody>`/`<tr>`/`<td>` block instead.
- **Internal cross-page links must use `./?path=/docs/<story-id>--docs`, not bare `?path=...`.** The manager UI renders MDX docs inside `<iframe id="storybook-preview-iframe">` pointing at `iframe.html`. A bare `href="?path=..."` (even with `target="_top"`) resolves relative to `iframe.html` itself, producing a broken URL. The `./` prefix forces resolution against the site root, working correctly both locally and under a deployed subpath.
- **swatchbook-addon's `tokens` config path is relative to the package root** (the directory containing `.storybook/`, not `.storybook/` itself) — e.g. from `packages/storybook`, the tokens path is `'../tokens/tokens.json'`.
- Color tokens with an invalid `$type` (see `packages/tokens/AGENTS.md`) surface here as `TypeError: Cannot convert undefined or null to object` from swatchbook-core — check the token source first if you hit this.
