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

### Storybook navigation

- When adding or moving a docs page, update `storySort.order` in `packages/storybook/.storybook/preview.ts` to match its intended position in the relevant overview. Unlisted pages use Storybook's default sort and may appear in an unintended position.
- Verify the rendered sidebar order in Storybook.

### MDX tables

- Do not use pipe-delimited Markdown tables in MDX documentation; Storybook renders them as plain text. Use HTML table markup instead.
- Verify MDX content in the rendered Storybook page. The MCP `docs-show` tool returns source content and does not confirm how it renders.

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

## Overview-page links

When an overview introduces or lists a topic with its own Storybook documentation page, link the topic directly using `./?path=/docs/{story-id}` with `target="_top"`. Use descriptive link text and verify destination IDs with `npx storybook tools docs list --withStoryIds`.

## Component contracts

When you add or change a component's tokens, update its contract in
`packages/contracts/contracts/` and run `npm run build:contracts` before
finishing. Follow its refusals; don't work around them.

Name tokens the way the Naming page (`Primary/Foundations/Tokens/Naming`)
says: `az.<category>.<property>.<component/context>.<variant>-<state>.<size>`,
leaving out parts that don't apply. Point a part's colors at the color token for
what it colors and where, such as `az.color.bg.button.red-hover` or
`az.color.fg.white`; those alias the brand colors. A context such as `button`
covers anything that behaves like one, so reuse it rather than adding a token
per component. Scales are numbered or named steps (`az.spacing.2`,
`az.radius.pill`), never named after their value (`az.dimension.50`). Write
what's specific to one component, such as its sizes and timings, as values in
its contract (a `$type`, `$value` and `$description`), not as
`az.component.*` tokens. Remove any `az.component.*` token the check flags as
redundant.

Contracts generate nothing for a platform: never add CSS, Sass or other platform
output to them. An implementation (such as the Storybook shim) uses token
variables for tokens and writes the component's own values as the contract says
them. Each component gets a contract check story that runs `checkContract`, and
`npm run test:storybook` must pass.

For a decision several components share (a link color, the focus ring, a
border, form-control sizing, body type), add one token named after Bootstrap 6's
name for it (`az.focus-ring.width.md` for `--focus-ring-width`), with Arizona's value,
and point every contract at it. Don't adopt Bootstrap 6's role names (`primary`,
`accent`) yet. See
[packages/contracts/README.md](./packages/contracts/README.md).
