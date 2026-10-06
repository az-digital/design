# Agent Instructions

Read [README.md](./README.md) first — it's the canonical source for setup,
workspace structure, the token workflow, and contributing guidelines.
Everything there applies whether you're a person or an agent. This file only
covers what's specific to working as an agent.

## Use the Storybook MCP server

Before changing tokens or stories, start Storybook and query it via MCP
instead of guessing token names or story conventions:

```bash
npm run dev:storybook
```

This exposes a Model Context Protocol server at `http://localhost:6006/mcp`.
Connect to it (project name `az-digital-storybook`) and use it to:

- Look up existing token names, groups, and generated CSS variable names
  before referencing or adding one.
- Fetch the `Primary/Tokens/Contributing` and `Primary/Tokens/Using in Figma` docs pages
  instead of inferring conventions from code.
- Preview any story you add or change before finishing the task.

When referring to one specific token in design guidance, use a clickable `Token` pill. Use code spans for path patterns, file paths, and literal code examples; prefer semantic tokens except when explaining the palette or component-specific tokens. See `Primary/Tokens/Contributing` for the full convention.

## Storybook agent CLI

The same skills and tools are also available from the command line, which
works without an MCP connection:

```bash
npx storybook skills --all
```

`npx storybook skills <id>` prints one skill (`stories`, `write-story`,
`setup`). `npx storybook tools --help` lists the tools that mirror the MCP
server. `docs list`, `docs show`, and `stories find-by-component` run
without a dev server; `stories preview` needs `npm run dev:storybook`
running. Run these from `packages/storybook` (or pass `--cwd
packages/storybook`).
