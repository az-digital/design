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

When you add or fill in a docs page, link it from every overview above it, so it can be found without the sidebar:

- **Its group's overview:** the `Docs.mdx` in its folder, such as `Primary/Components/Buttons`. If the group has none, add one the way Buttons and Containers do, listing every page in the group.
- **Its section's overview,** such as `Primary/Components/Overview`, which lists the groups.
- **The Primary overview** (`Primary/Overview`), which lists each group and its pages.

## Component docs pages

Lay out a component's docs page the way the Button page is (`Primary/Components/Buttons/Button.mdx` and `Button.stories.tsx`):

1. A one-sentence description, then `<Canvas of={…Stories.Default} sourceState="none" />` and `<Controls />` for a story that renders the implementation's markup as its latest release ships it. Tag the story `'!dev'` so it shows on the docs page, not as its own sidebar entry. Its controls follow the Figma component's properties where there is one.
2. A short note on where that release differs from the page, if it does. Check computed styles in the browser rather than guessing.
3. The design decisions, by topic (colors, size, keyboard focus, motion), with design token pills.
4. `<ContractAnatomy contract="…" />`, and one per variant option the contract has.

Load anything the markup needs, such as an icon font, in `.storybook/preview-head.html`. Don't restyle it there or in the story.

## Component contracts

When you add or change a component's design decisions, update its contract in
`packages/contracts/contracts/` and run `npm run build:contracts` before
finishing. Follow its refusals; don't work around them.

- **Token names:** read the Naming page before adding or renaming a token:
  `Primary/Foundations/Tokens/Naming` in Storybook
  (`packages/storybook/stories/Primary/Foundations/Tokens/Naming.mdx`).
- **What a contract holds, and how implementations use it:** see
  [packages/contracts/README.md](./packages/contracts/README.md).
- **No platform output:** contracts generate nothing for a platform, so never add
  CSS, Sass or other platform output to them.
- **Implementations:** don't patch an implementation's styles in Storybook. Write
  its update instructions in the pull request description instead. Once an
  implementation has been updated, add a contract check story that runs
  `checkContract`; `npm run test:storybook` must pass.
