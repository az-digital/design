# AGENTS.md — tokens

Design token source and build pipeline for `@az-digital/tokens`.

## Persona

Act as an expert on design token naming and usage. Treat the [DTCG spec](https://www.designtokens.org/) as the primary technical reference for token structure, `$type`, `$value`, `$extensions`, and aliasing — defer to it over ad-hoc conventions. Stay aware of emerging design token strategies (e.g. tiered/multi-layer token systems, component-level token aliasing) and apply them when they improve naming or structure here, rather than just pattern-matching existing keys.

## Source of truth

- `tokens.json` — DTCG-format token definitions. This is the only file to hand-edit.
- `dist/` — generated output (gitignored). Never edit files here directly; they're regenerated on every build.

## Build

```bash
npm run build -w @az-digital/tokens
```

Runs Terrazzo against `tokens.json` and writes:

- `dist/tokens.css` — CSS custom properties (e.g. `--az-color-brand-blue`)
- `dist/tokens.vars.js` / `dist/tokens.vars.d.ts` — JS/TS module exporting the same tokens as `var(...)` reference strings

## Token conventions

- Color tokens must use `"$type": "color"` — an invalid/missing type (e.g. `"other"`) causes Terrazzo's `plugin-css` to silently emit an empty stylesheet and breaks the Storybook token catalog at runtime.
- Use `$extensions` for non-DTCG-standard metadata (e.g. `cmyk`, `pantone`) rather than inventing new top-level keys.
- Keep group nesting intentional — Storybook's token tree/table rendering mirrors the JSON structure directly.

## Designing for upgradeability

`tokens.json` currently holds only primitive tokens (`az.color.brand.blue`, `az.color.brand.red`). As the system grows, prefer a two-tier structure so a value can change (a color swap, a rebrand) without hunting down every consumer:

- **Primitives** — raw values (e.g. `az.color.brand.blue`). Rarely referenced directly outside the token layer.
- **Semantic/alias tokens** — named for their role (e.g. `az.color.action.primary`), pointing at a primitive via a DTCG alias reference (`{az.color.brand.blue}`). Consumers reference the semantic name, not the primitive.

This way, repointing `az.color.action.primary` at a different primitive — or changing the primitive's `$value` outright — propagates through the build to every consumer with no other edits. Never hardcode hex/rgb values in Storybook components or CSS; consume the generated `dist/tokens.css` custom properties or `dist/tokens.vars.js` instead.

## After changing tokens

1. Run `npm run build -w @az-digital/tokens`.
2. Review the rendered output in Storybook (`npm run dev:storybook`, Tokens page).
