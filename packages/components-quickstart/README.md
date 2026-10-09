# Arizona Quickstart

Package: `@az-digital/components-quickstart`.

## What it is / Best for

Drupal Single Directory Components (SDC) for Arizona Quickstart profiles. Use it for components that need to be installed in, discovered by, and rendered through a Drupal Quickstart site.

## Install / use

Until a package release is documented, use the package from a checkout that includes it. Run `npm install` from the repository root, build the package CSS, then copy the component directory into the `az_quickstart` profile's `components` directory. A site using the profile can render a component by its namespace:

```twig
{% include 'az_quickstart:button' with {
  text: 'Apply to Arizona',
  href: '/apply',
} only %}
```

Components may depend on the Arizona Bootstrap CSS library provided by `az_barrio`; check the component metadata before using one. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50) for release planning.

## How it consumes tokens

Author component styles from `token(...)` references and component tokens under `az.component.<name>.*`. The build script produces CSS with resolved `var()` chains and fallback values because Quickstart pages do not load the repository's `tokens.css`. Do not edit generated CSS in place; rebuild it from its source stylesheet.

## Contribute to it

### File layout and naming

- Keep each SDC in `components/<component>/` with `<component>.component.yml`, `<component>.twig`, `<component>.css`, and `<component>.src.css` when token source CSS is needed.
- Use Drupal's snake_case variable names in templates and maintain the shared component behavior while documenting platform-specific prop names.
- Keep Twig compatible with both twig.js in Storybook and Drupal Twig: avoid JavaScript-only expressions such as arrow functions and verify every filter/function against both environments.
- Update the Storybook story so the **Code** panel shows the Drupal Twig include, not only the rendered preview.

### Build and lint

Run `npm run build -w @az-digital/components-quickstart` to generate CSS from token sources. Wire the package build into the root `build:all` command when it is integrated; add linting and a corresponding script when the package has lintable source.

### Platform-specific limits

Storybook uses twig.js and is not a substitute for Drupal verification. Check SDC metadata, Drupal Twig compatibility, profile namespace, attributes, and required libraries in a real Arizona Quickstart site. Avoid Twig features unavailable to twig.js if the same template must render in both environments.

## Verification

- [ ] Run the package CSS build and inspect the generated output.
- [ ] Check the component renders in Storybook and its **Code** panel shows the include snippet.
- [ ] In a real Quickstart site, confirm the SDC is discovered under `az_quickstart:<component>`.
- [ ] Confirm required libraries such as `az_barrio/arizona-bootstrap-css` resolve and Drupal renders the template like twig.js.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
