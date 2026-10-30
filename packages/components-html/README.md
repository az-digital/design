# Arizona Bootstrap (HTML)

Package: `@az-digital/components-html`.

## What it is / Best for

Arizona Bootstrap's markup for each component, as HTML strings. Use it when a site already loads Arizona Bootstrap's CSS and JavaScript and can insert HTML: a Drupal theme, a static site, or server-rendered pages. It's also the markup reference the other libraries are compared against.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import its render functions. For example:

```ts
import { renderButton } from '@az-digital/components-html';

const markup = renderButton({ label: 'Apply to Arizona', color: 'outline-red', size: 'large' });
// <button type="button" class="btn btn-outline-red btn-lg">Apply to Arizona</button>
```

Props use the component contract's names (`color: 'outline-red'`, `size: 'large'`). Each function returns an HTML string with every caller-supplied value escaped; insert it with your platform's normal HTML mechanism, on a page that loads Arizona Bootstrap's assets. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50) for release planning.

## How it consumes tokens

It doesn't, directly: the markup uses Arizona Bootstrap's classes, and Arizona Bootstrap's stylesheet draws them. Each component's design decisions are in its contract in `packages/contracts/contracts/`, which points at tokens; where Arizona Bootstrap's styles differ from a contract, the fix belongs in Arizona Bootstrap, not in this package.

## Contribute to it

### File layout and naming

- Put each component in `src/<Component>.ts`, exporting `render<Component>` and its props type, and export it from `src/index.ts`.
- Name props after the component's contract: its variant axes and option names, for example `color: 'white-text-red'`.
- Escape every caller-supplied value with `escapeHtml`.
- Add the component to `storybook/adapter.ts`, keyed by its contract id, with the same function as `render` and `source`, so the **Code** panel shows exactly what renders.

### Storybook registration

The `azDesign.library` field in `package.json` registers this package with the Library toolbar (key `html`). See the [library addon's README](../storybook-addon-libraries/README.md) for the manifest and adapter contract.

### Build and lint

This package is TypeScript source with no build step; Storybook reads it directly. If a future change adds generated output, provide a build script and wire it into the root `build:all`.

### Platform-specific limits

The package returns HTML rather than a framework component. Callers own insertion into the DOM and loading Arizona Bootstrap's assets, including its JavaScript for interactive components. The markup targets Arizona Bootstrap's current release: Rain is still `.btn-sky` until az-digital/arizona-bootstrap#2369 renames it.

## Verification

- [ ] Check renderer output and HTML escaping for text and attributes.
- [ ] Review each in-scope component in Storybook with the Library toolbar set to Arizona Bootstrap, including its **Code** panel.
- [ ] Verify the markup with the consuming site's Arizona Bootstrap CSS and JavaScript, including keyboard behavior for interactive patterns.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
