# Arizona Bootstrap (HTML)

Package: `@az-digital/components-html`.

## What it is / Best for

Arizona Bootstrap's markup for each component, as HTML strings. Use it when a site already loads Arizona Bootstrap's CSS and JavaScript and can insert HTML: a Drupal theme, a static site, or server-rendered pages. It's also the markup reference the other libraries are compared against.

## Install / use

### Quick start

Load Arizona Bootstrap's CSS and JavaScript from its CDN. There's nothing to install or build.

1. Start from a page with the HTML5 doctype and the responsive viewport `<meta>` tag. Arizona Bootstrap is mobile first, and its styles are incomplete without either.
2. Put the stylesheet `<link>` in the `<head>`, and the JavaScript bundle `<script>` just before `</body>`:

   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <title>Arizona Bootstrap page</title>
       <link href="https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.2.2/css/arizona-bootstrap.min.css" rel="stylesheet" integrity="sha384-wI4ZFF+Q17zFOfJSPmczqtkEMnRkxoFPPtk3Kg4c37lozE3jYmmJ/N+EipHy1p6n" crossorigin="anonymous">
     </head>
     <body>
       <button type="button" class="btn btn-red">Apply to Arizona</button>

       <script src="https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.2.2/js/arizona-bootstrap.bundle.min.js" integrity="sha384-of2ioyNUQuqjMaNcSfjyJE7aEaNPzjs5SOHSUxMJ9JXI8KThHJvXmZm2r6LBFbdi" crossorigin="anonymous"></script>
     </body>
   </html>
   ```

3. Copy each component's markup from its page here: choose **Arizona Bootstrap** in the **Library** menu, then open **Show code** on the docs page or the **Code** panel on a story. Set the story's controls first, and the code follows them.

### CDN links

These pin Arizona Bootstrap 5.2.2, its current release:

**CSS:**

```text
https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.2.2/css/arizona-bootstrap.min.css
```

**JavaScript:**

```text
https://cdn.digital.arizona.edu/lib/arizona-bootstrap/5.2.2/js/arizona-bootstrap.bundle.min.js
```

The JavaScript bundle includes Popper. Buttons and cards only need the CSS. Interactive components need the JavaScript too: accordions, collapse, dropdowns, modals, the navbar, offcanvas, tabs, toasts, tooltips and popovers.

Arizona Bootstrap's [getting started guide](https://digital.arizona.edu/arizona-bootstrap/v5/docs/5.2/getting-started/introduction/) covers its other builds, installing its source with a package manager, and using it as a JavaScript module.

### Render markup in JavaScript

To generate the same markup in code, import this package's render functions. It isn't published to a registry yet ([issue #50](https://github.com/az-digital/design/issues/50) plans releases), so use it from a checkout of this repository after running `npm install` at its root:

```ts
import { renderButton } from '@az-digital/components-html';

const markup = renderButton({ label: 'Apply to Arizona', color: 'outline-red', size: 'large' });
// <button type="button" class="btn btn-outline-red btn-lg">Apply to Arizona</button>
```

Props use the component contract's names (`color: 'outline-red'`, `size: 'large'`). Each function returns an HTML string with every caller-supplied value escaped. Insert it with your platform's usual HTML mechanism, on a page that loads Arizona Bootstrap's CSS and JavaScript.

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
