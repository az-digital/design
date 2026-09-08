---
name: design-token-migration
description: "Use when creating or updating a design-token migration guide, migration CSV, or token JSON source from a legacy CSS/custom-property set."
---

# Design Token Migration

## Source of truth

- The hand-edited source is `packages/tokens/tokens.arizona-bootstrap-5-1.json`.
- The migration CSV is generated from that JSON with `npm run generate:arizona-bootstrap-csv -w @az-digital/tokens`.
- The Storybook migration page reads the generated CSV. It must not parse CSS or invent rows at render time.
- Keep the upstream compiled CSS at `packages/tokens/arizona-bootstrap-5-1.css` as provenance/reference only.

## Extraction rules

- Extract custom properties from the compiled upstream CSS, not Sass variables, source maps, or inferred token paths.
- Preserve each CSS custom-property name exactly, including both `--bs-*` and `--az-*` properties.
- Preserve `$value` exactly as compiled: literals stay literals and `var(...)` references stay `var(...)` references.
- Do not translate CSS values into DTCG aliases.
- Use `$type: string` for CSS declarations whose exact CSS representation must be preserved.
- Store provenance in `$extensions.cssVariable` and `$extensions.source`.

## Mapping rules

- A current-token mapping is valid only when it is explicitly verified against the current `packages/tokens/tokens.json` catalog.
- Never map semantic or composite legacy properties to foundational tokens merely because their values match.
- Foundational RGB properties may map to the corresponding foundational color token when explicitly verified.
- Leave the current-token field empty when no real target exists.
- Never use nonexistent paths such as `az.color.brand.red.500` when the current catalog only contains `az.color.brand.red`.

## Story requirements

- The migration story uses exactly three columns: `Arizona Bootstrap 5.1`, `Current Design Token`, and `Value`.
- The story displays all CSV rows and does not recompute mappings.
- Use a raw HTML table because this repository does not enable GFM Markdown tables.
- Keep the Value column verbatim, including `var(...)` references.
- Use compact visual token chips only for verified current color tokens; do not embed the full `ColorSwatch` presenter in every table row.

## Validation

1. Run `npm run generate:arizona-bootstrap-csv -w @az-digital/tokens` after editing the JSON source.
2. Run `npm run build:storybook`.
3. Verify the migration story is present in `http://localhost:6006/index.json`.
4. Use Storybook MCP `preview-stories` for the migration story.
5. Visually inspect the live Storybook page; a generated preview URL alone is not visual verification.
