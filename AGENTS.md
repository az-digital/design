# AGENTS.md

Arizona Digital design system npm workspaces monorepo.

## Sources of truth

- Author design tokens in `packages/tokens/tokens.json`. Never edit generated files in `packages/tokens/dist/`.
- Put Storybook stories in `packages/storybook/stories/` and supporting tested logic in `packages/storybook/src/`.
- Read the nearest package `AGENTS.md` before changing tokens or stories.
- Never invent token paths or CSS custom properties. Confirm exact names in the token source before using them.

## Storybook MCP workflow

Start Storybook with:

```bash
npm run dev:storybook
```

The Storybook MCP server is then available at `http://localhost:6006/mcp`.

- Use Storybook MCP as the primary way to discover and preview stories.
- Generate an MCP preview for every changed story and use the returned URL for visual validation.
- Include returned preview URLs in the final report.
- If MCP is unavailable, report that clearly and ask before substituting browser automation.

## Validation

Run the checks relevant to the change:

```bash
npm run build:tokens
npm run lint:storybook
npm run test:storybook
npm run build:storybook
```

For token changes, run all four commands. For Storybook-only changes, run lint, test, and build.
