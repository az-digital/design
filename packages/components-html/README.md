# Arizona Bootstrap (HTML)

## What it is / Best for

Arizona Bootstrap's CSS and JavaScript, with the markup for each component shown here. Use it for any site that writes its own HTML: a Drupal theme, a static site, or server-rendered pages. Its markup is also the reference the other libraries are compared against.

This Storybook demonstrates the markup with the `@az-digital/components-html` workspace package. That package isn't released: sites load Arizona Bootstrap and copy the markup from here.

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

## How it consumes tokens

It doesn't, directly: the markup uses Arizona Bootstrap's classes, and Arizona Bootstrap's stylesheet draws them. Each component's design decisions are in its contract in `packages/contracts/contracts/`, which points at tokens; where Arizona Bootstrap's styles differ from a contract, the fix belongs in Arizona Bootstrap, not in this package.

## Contribute to it

This package only feeds Storybook: each component's render function draws it on the canvas and supplies the markup in the **Code** panel. It's private and is never released, so nothing outside this repository imports it.

### File layout and naming

- Put each component in `src/<Component>.ts`, exporting `render<Component>` and its props type, and export it from `src/index.ts`.
- Name props after the component's contract: its variant axes and option names, for example `color: 'white-text-red'`.
- Escape every caller-supplied value with `escapeHtml`.
- Add the component to `storybook/adapter.ts`, keyed by its contract id, with the same function as `render` and `source`, so the **Code** panel shows exactly what renders.

### Storybook registration

The `azDesign.library` field in `package.json` registers this package with the Library toolbar (key `html`). See the [library addon's README](../storybook-addon-libraries/README.md) for the manifest and adapter contract.

### Build and lint

This package is TypeScript source with no build step; Storybook reads it directly.

### Platform-specific limits

The markup is plain HTML, so a site owns loading Arizona Bootstrap's CSS and JavaScript, including the JavaScript for interactive components. The markup targets Arizona Bootstrap's current release: Rain is still `.btn-sky` until az-digital/arizona-bootstrap#2369 renames it.

## Verification

- [ ] Check renderer output and HTML escaping for text and attributes.
- [ ] Review each in-scope component in Storybook with the Library toolbar set to Arizona Bootstrap, including its **Code** panel.
- [ ] Verify the copied markup on a page that loads Arizona Bootstrap's CSS and JavaScript, including keyboard behavior for interactive patterns.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
