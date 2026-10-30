# Web Components

Package: `@az-digital/components-web`. Status: **preview**.

## What it is / Best for

Custom elements for the design system's components, for pages that would rather write `<az-button>` than a component's classes. Use them on any page, with or without a framework, that loads Arizona Bootstrap's CSS.

Today the elements draw Arizona Bootstrap's markup in the light DOM, so they look exactly like the Arizona Bootstrap library and need its stylesheet. They stay in preview until they're verified on a real site.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import the package once to register its elements:

```js
import '@az-digital/components-web';
```

Then use the elements in markup:

```html
<az-button color="outline-red" size="large">Apply to Arizona</az-button>
```

Attributes take the component contract's option names. The element's text is its label. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50).

## How it consumes tokens

Through Arizona Bootstrap: the elements render Arizona Bootstrap's classes (from `@az-digital/components-html`), and its stylesheet draws them. Each component's design decisions are in its contract in `packages/contracts/contracts/`. An element that renders its own styles (for example in a shadow root) should read tokens through the contract rather than copying values.

## Contribute to it

### File layout and naming

- Put each element in `src/az-<component>.ts`, exporting a `defineAz<Component>()` that registers it once, and call it from `defineAll()` in `src/index.ts`.
- Declare the element's class inside its define function, so the module imports where `HTMLElement` doesn't exist (Node, tests).
- Name elements with the `az-` prefix and attributes after the contract's variant axes and option names.
- Add a markup function to `src/markup.ts` and the component to `storybook/adapter.ts`, keyed by its contract id, so the **Code** panel shows exactly what renders.

### Storybook registration

The `azDesign.library` field in `package.json` registers this package with the Library toolbar (key `web`, status `preview`). See the [library addon's README](../storybook-addon-libraries/README.md) for the manifest and adapter contract.

### Build and lint

This package is TypeScript source with no build step; Storybook reads it directly. A release will need a build that outputs JavaScript modules and a self-registering bundle, wired into the root `build:all`.

### Platform-specific limits

Custom elements are registered in the browser and take HTML attributes, not framework props. `style` is a global HTML attribute, so an element can't use it for a variant. Boolean attributes work by presence, not by the strings `"true"` and `"false"`.

## Verification

- [ ] Review each element in Storybook with the Library toolbar set to Web Components, including its **Code** panel.
- [ ] Test the elements on a plain page with Arizona Bootstrap's CSS: registration, attribute changes after render, keyboard behavior and accessible names.
- [ ] Before moving the package from `preview` to `supported`, verify it on a real site and record what was checked.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
