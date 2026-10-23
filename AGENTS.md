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

## Component contracts

When you add or change a component's tokens, update its contract in
`packages/contracts/contracts/` and run `npm run build:contracts` before
finishing. Follow its refusals; don't work around them. A contract does the
wiring that aliases used to do in `tokens.json`. Point a part's colors straight
at the token they use, usually a brand color. Write what's specific to the
component, such as its sizes and timings, as values in the contract (a `$type`,
`$value` and `$description`), not as tokens: no component tokens, and no
primitive named after its value (`az.dimension.50`). Don't add a semantic token
just so one component has a name to point at; semantic tokens are for decisions
that are really shared or that a theme changes. Remove any component token the
check flags as redundant.

For a decision several components share (a link color, the focus ring, a
border, form-control sizing, body type), add one token named after Bootstrap 6's
name for it (`az.focus-ring.width.md` for `--focus-ring-width`), with Arizona's value,
and point every contract at it. Don't adopt Bootstrap 6's role names (`primary`,
`accent`) yet. See
[packages/contracts/README.md](./packages/contracts/README.md).
