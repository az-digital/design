# @az-digital/tokens

Design tokens for the Arizona Digital design system. This package provides the source token definitions and generated files for using them in web projects and design tools.

## Install

The package is published to GitHub Packages. Configure npm to use that registry for the `@az-digital` scope and authenticate with a GitHub token that can read packages:

```ini
# ~/.npmrc
@az-digital:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Keep the token in an environment variable or another secure credential store; do not commit it. Then install the package in your project:

```sh
npm install @az-digital/tokens
```

## Use

Load the CSS custom properties in your application, for example from its JavaScript entry point:

```js
import '@az-digital/tokens/dist/tokens.css';
```

Then reference tokens in CSS:

```css
.example {
  color: var(--az-color-brand-blue);
}
```

For JavaScript or TypeScript, import the generated `az` object. Its values are CSS `var(...)` references, so the stylesheet must also be loaded:

```ts
import '@az-digital/tokens/dist/tokens.css';
import { az } from '@az-digital/tokens/dist/tokens.vars.js';

const brandBlue = az.color.brand.blue;
```

## Package contents

- `tokens.json` — source token definitions, also suitable for tools that consume the Tokens Studio-compatible JSON format.
- `dist/tokens.css` — CSS custom properties, such as `--az-color-brand-blue`.
- `dist/tokens.scss` — Sass variables for Sass-based projects.
- `dist/tokens.vars.js` — JavaScript `az` object whose values reference the CSS custom properties.
- `dist/tokens.vars.d.ts` — TypeScript declarations for that JavaScript module.

Import generated files using the explicit `@az-digital/tokens/dist/...` paths shown above. The package does not export a root JavaScript module.

## Versions and maintenance

Package versions are published to GitHub Packages by the repository's [Release workflow](https://github.com/az-digital/design/blob/main/.github/workflows/release.yml), from a `v<version>` Git tag. Prereleases use the npm `next` dist-tag; stable releases use `latest`. See the repository [README](../../README.md#published-storybook) for the release process and versioning details.

To update tokens, change the canonical source `tokens.json`, then regenerate the committed outputs from the repository root:

```sh
npm run build:tokens
```

Do not edit files in `dist/` directly. See the [token contribution guide](https://digital.arizona.edu/design/latest/?path=/docs/primary-foundations-tokens-contributing--docs) for the supported contribution workflow.

## Documentation

- [How to Use Design Tokens](https://digital.arizona.edu/design/latest/?path=/docs/primary-foundations-tokens-how-to-use--docs)
- [Token Naming](https://digital.arizona.edu/design/latest/?path=/docs/primary-foundations-tokens-naming--docs)
- [Token Contributing](https://digital.arizona.edu/design/latest/?path=/docs/primary-foundations-tokens-contributing--docs)
- [Repository contribution guidance](../../README.md#contributing)
