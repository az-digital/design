# Arizona Bootstrap (HTML)

Package: `@az-digital/components-html`.

## What it is / Best for

A framework-agnostic HTML reference implementation that renders Arizona Bootstrap-compatible markup. Use it when a site can consume HTML and already uses Arizona Bootstrap styles and behavior; it is also the markup reference for other implementations.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import its public exports. For example:

```ts
import { renderButton } from '@az-digital/components-html';

const markup = renderButton({ text: 'Apply to Arizona', href: '/apply' });
```

The renderer returns an HTML string. Render it through the framework's normal safe HTML mechanism, and include the Arizona Bootstrap assets required by the markup. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50) for release planning.

## How it consumes tokens

Component-specific values belong in `az.component.<name>.*` tokens in `packages/tokens/tokens.json`. HTML renderers emit the classes that consume Arizona Bootstrap styles; token-backed styles should use the generated token CSS rather than copying token values into renderer code.

## Contribute to it

### File layout and naming

- Put each renderer in `src/<Component>.ts` and export its public functions and types from `src/index.ts`.
- Name exports `render<Component>` and keep the HTML prop shape aligned with the shared story args wherever the platform supports it.
- Keep generated Storybook code examples consistent with the actual rendered HTML.

### Build and lint

This package's current source entry is `src/index.ts` and it has no generated build step. Run `npm run lint -w @az-digital/components-html` when the package is present. If a future change adds generated output, provide a build script and wire it into the root `build:all`.

### Platform-specific limits

The package returns HTML rather than a framework component. Callers own insertion into the DOM and loading the required Arizona Bootstrap assets. HTML-only values or behaviors must be identified in the README and reflected in stories; do not assume another implementation accepts them.

## Verification

- [ ] Run the package lint script.
- [ ] Check renderer output and HTML escaping for text and attributes.
- [ ] Review each in-scope component in Storybook with its **Code** panel.
- [ ] Verify markup with the consuming site's Arizona Bootstrap CSS and JavaScript, including keyboard behavior for interactive patterns.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
