---
name: storybook-mdx
description: 'Recurring Storybook + MDX pipeline gotchas discovered in this repo. Use when debugging broken rendering, broken internal links, or unexpected build errors in packages/storybook — especially anything that looks like a markdown/MDX parsing problem, a swatchbook-addon error, or a navigation link that lands on the wrong page.'
---

# Storybook MDX — Repository Pipeline Notes

> For repo and package-level workflow instructions, read `AGENTS.md` at the repo root and `packages/storybook/AGENTS.md`. This SKILL.md is the canonical source for known pipeline quirks and how to work around them.

## Environment requirements

- Node 24+ (`.nvmrc`), Storybook 10.1+, `@storybook/react-vite` framework.
- `@unpunnyfuns/swatchbook-addon`'s doc blocks are React components — they will not run under `html-vite`.
- `@storybook/addon-docs` must be listed in the `addons` array in `.storybook/main.ts`, not just installed as a dependency. Without it, `.mdx` files fail to compile under react-vite/rolldown with a "JSX syntax is disabled" parse error.

## Markdown tables are not supported

This MDX pipeline has no `remark-gfm` plugin. A standard markdown table:

```md
| Field | Value |
| --- | --- |
| Name | Example |
```

compiles to a single `<p>` containing the literal pipe characters — not a `<table>`. Confirmed by inspecting the compiled bundle (`(0,c.jsxs)(t.p, {children:['| Field | Value | ...']})`).

**Fix:** use a raw HTML table instead — MDX renders standard HTML tags as JSX directly:

```mdx
<table>
  <tbody>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Name</td><td><code>Example</code></td></tr>
  </tbody>
</table>
```

## Internal cross-page links need `./` prefix

The Storybook manager UI (top window) embeds the docs renderer in `<iframe id="storybook-preview-iframe">` pointing at `iframe.html?id=...&viewMode=docs`. A link like:

```mdx
<a href="?path=/docs/tokens--docs" target="_top">Tokens</a>
```

resolves the relative `?path=...` against the **enclosing iframe document** (`iframe.html`) before `target="_top"` takes effect, producing a broken URL such as `http://host/iframe.html?path=...`.

**Fix:** prefix with `./` so resolution uses the base document's directory instead:

```mdx
<a href="./?path=/docs/tokens--docs" target="_top">Tokens</a>
```

This resolves correctly both in local dev (`http://localhost:6006/?path=...`) and under a deployed subpath (e.g. `https://host/design/pr-8/?path=...`).

Verified empirically with Playwright by creating test anchors, inspecting `.href` resolution, and clicking through to confirm the resulting top-level page.

## Token source errors that surface here

- Color tokens must use `"$type": "color"`. An invalid/missing `$type` causes Terrazzo's `plugin-css` to silently emit an empty stylesheet, which then causes swatchbook-core to throw `TypeError: Cannot convert undefined or null to object` when Storybook tries to render the token catalog. If you see that error, check `packages/tokens/tokens.json` first, not the Storybook code.

## Path resolution

`swatchbook-addon`'s `tokens` config path in `.storybook/main.ts` resolves relative to the package root (the directory containing `.storybook/`), not the `.storybook/` directory itself — e.g. from `packages/storybook`, the correct path is `'../tokens/tokens.json'`.
