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
- Fetch the `Primary/Foundations/Tokens/Contributing` and `Primary/Foundations/Tokens/How to Use` docs pages
  instead of inferring conventions from code.
- Preview any story you add or change before finishing the task.

## Naming design tokens

Before adding or renaming a token in `packages/tokens/tokens.json`, read
[packages/tokens/AGENTS.md](./packages/tokens/AGENTS.md) — token layers,
what each layer's names are allowed to describe, and which layer a token is
allowed to alias.

## Writing stories and docs pages

Before writing or restructuring a `.stories.tsx` or `.mdx` file in
`packages/storybook`, read [packages/storybook/AGENTS.md](./packages/storybook/AGENTS.md)
for page structure conventions, `play` function pitfalls, and how to keep
"what tokens.json defines," "what the shipped CSS does," and "which token
maps to which Figma state" as separate questions.

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
