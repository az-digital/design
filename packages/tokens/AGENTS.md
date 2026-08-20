# AGENTS.md - tokens

Design token source and Style Dictionary build for `@az-digital/tokens`.

## Token rules

- Treat `tokens.json` as the source of truth. Do not hand-edit `dist/` output.
- Follow the existing Design Tokens Community Group structure using `$value`, `$type`, `$description`, and `$extensions` where appropriate.
- Reference another token with its exact path in braces, for example `{color.az.blue}`.
- Search the complete token document before adding a token so existing semantics are reused instead of duplicated.
- Preserve stable, descriptive paths; a rename is a breaking change for downstream consumers.

## Validation

After a token change, run from the repository root:

```bash
npm run build:tokens
npm run test:storybook
npm run build:storybook
```

With Storybook running, use its MCP server to preview every affected token story and report the returned URLs.
