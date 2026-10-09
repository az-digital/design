# Web Components

Package: `@az-digital/components-web`.

## What it is / Best for

Lit-based custom elements for using Arizona Digital components without a React dependency or Arizona Bootstrap runtime. Use them in sites and applications that consume browser-native custom elements, including otherwise framework-agnostic pages.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import the element's registration module. For example:

```js
import '@az-digital/components-web/az-button';
```

Then use the corresponding custom element in markup:

```html
<az-button href="/apply" variant="solid" color="red">Apply to Arizona</az-button>
```

The package also builds a self-registering CDN bundle. Use a published package or CDN URL only after the release process is documented; see [issue #50](https://github.com/az-digital/design/issues/50).

## How it consumes tokens

The package builds token references into its distributed styles, including resolved fallback values for pages that do not load `tokens.css`. Keep the generated output in sync with source tokens; author component-specific values as `az.component.<name>.*` in `packages/tokens/tokens.json`, not as duplicated constants.

## Contribute to it

### File layout and naming

- Put each element in `src/<component>/az-<component>.ts` and its styles alongside it; export registrations through `src/index.ts`.
- Name custom elements with the `az-` prefix and hyphenated element names, for example `<az-button>`.
- Keep element property/attribute behavior documented. For `az-button`, use `variant` rather than `style` (an HTML global attribute), supply its label in the default slot, and use `href` to select a link instead of a button. Boolean HTML attributes such as `disabled` are represented by presence or absence, not the strings `"true"` and `"false"`.
- Add stories that show custom-element markup in the **Code** panel.

### Build and lint

Run `npm run build -w @az-digital/components-web` and `npm run typecheck -w @az-digital/components-web`. This build includes generated token styles and outputs per-element modules plus the CDN bundle. Wire the build into the root `build:all` command when the package is integrated; add a lint script if the package introduces lintable source.

### Platform-specific limits

Custom elements are registered in the browser and expose HTML attributes/properties, not React props. The custom-element API can differ from another implementation when HTML reserves a name or requires different semantics; for example, `az-button` uses `variant` instead of `style`, a text slot instead of a `text` attribute, and `href` to choose its rendered element. Document those differences and valid values. Pages that do not load the token package rely on the generated styles bundled with the element.

## Verification

- [ ] Run the package build and typecheck.
- [ ] Test the elements in a plain page without Arizona Bootstrap CSS.
- [ ] Verify registration, supported attributes, boolean behavior, accessibility, and responsive rendering in a browser.
- [ ] Check that the package and CDN outputs both include current token-derived styles.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
