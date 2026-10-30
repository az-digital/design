# Web Components

Package: `@az-digital/components-web`. Status: **preview**.

## What it is / Best for

Custom elements for the design system's components, such as `<az-button>`. Each element draws itself in its shadow root with its own styles, from the component's contract, so it works on any page, with or without a framework, and doesn't need Arizona Bootstrap. Use them where a page can't take on Arizona Bootstrap, or where writing `<az-button>` is simpler than writing a component's markup.

They stay in preview until they're verified on a real site.

## Install / use

The package isn't released yet ([issue #50](https://github.com/az-digital/design/issues/50) plans releases).

1. Load the design tokens' CSS variables (`@az-digital/tokens`' `dist/tokens.css`) and Proxima Nova on the page. The elements take their colors and focus ring width from the tokens, so without `tokens.css` they're drawn without them.
2. Import the package once to register its elements:

   ```js
   import '@az-digital/components-web';
   ```

3. Use the elements in markup:

   ```html
   <az-button color="outline-red" size="large">Apply to Arizona</az-button>
   ```

Attributes take the component contract's option names. The element's content is its label. Copy an element's markup from its page here: choose **Web Components** in the **Library** menu, then open **Show code** or the **Code** panel.

## How it consumes tokens

Each element's styles follow its contract in `packages/contracts/contracts/`. Where the contract points at a token, the styles use that token's CSS variable from `@az-digital/tokens` (imported through `dist/tokens.vars.js`, so a misspelled token is a type error). Where the contract sets the component's own value, such as the button's 9px padding, the styles write that value. A contract check story compares each element with its contract, so the two can't drift apart.

## Contribute to it

### File layout and naming

- Put each element in `src/az-<component>.ts`, exporting a `defineAz<Component>()` that registers it once, and call it from `defineAll()` in `src/index.ts`.
- Put its shadow styles in `src/az-<component>.styles.ts`, following its contract: tokens from `tokens.vars.js`, the contract's own values as written.
- Declare the element's class inside its define function, so the module imports where `HTMLElement` doesn't exist (Node, tests).
- Name elements with the `az-` prefix and attributes after the contract's variant axes and option names. Put shared prop types in `src/types.ts`.
- Add a markup function to `src/markup.ts` and the component to `storybook/adapter.ts`, keyed by its contract id, so the **Code** panel shows exactly what renders.
- Add a contract check story that renders the element in every variant and runs `checkContract` on the element inside its shadow root (see `WebButtonContract.stories.tsx`). Pass `checkContract` the custom properties that hold the element's hover colors, since a script can't hover it.

### Storybook registration

The `azDesign.library` field in `package.json` registers this package with the Library toolbar (key `web`, status `preview`). See the [library addon's README](../storybook-addon-libraries/README.md) for the manifest and adapter contract.

### Build and lint

This package is TypeScript source with no build step; Storybook reads it directly. A release will need a build that outputs JavaScript modules and a self-registering bundle, wired into the root `build:all`.

### Platform-specific limits

- Custom elements are registered in the browser and take HTML attributes, not framework props. `style` is a global HTML attribute, so an element can't use it for a variant. Boolean attributes work by presence, not by the strings `"true"` and `"false"`.
- The page's CSS doesn't reach inside an element's shadow root, so a site can't restyle the element with its own rules.
- `<az-button>` is always `type="button"`. It doesn't submit forms.

## Verification

- [ ] Review each element in Storybook with the Library toolbar set to Web Components, including its **Code** panel.
- [ ] Its contract check story passes in `npm run test:storybook`.
- [ ] Test the elements on a plain page with only `tokens.css` and Proxima Nova: registration, attribute changes after render, keyboard behavior and accessible names.
- [ ] Before moving the package from `preview` to `supported`, verify it on a real site and record what was checked.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
