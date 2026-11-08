# React Bootstrap

Package: `@az-digital/components-react-bootstrap`.

## What it is / Best for

React components implementing Arizona Digital patterns, with `react-bootstrap` used where it provides the required interactive behavior. Use it in React applications that need component APIs, React composition, and framework-level interaction.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import from the public component subpath. For example:

```tsx
import { Button } from '@az-digital/components-react-bootstrap/Button';

export function Example() {
  return <Button href="/apply">Apply to Arizona</Button>;
}
```

The package declares React and React DOM as peer dependencies. Load the Arizona Bootstrap styles and design-token CSS required by the components. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50) for release planning.

The Button defaults to an anchor; pass `htmlTag="button"` for an action. Its `style` and `color` props select the Arizona Bootstrap classes, and its `size` prop accepts `sm` or `lg`.

The Arizona Header's optional Search and Menu buttons are presentational; applications must provide their own behavior.

The card variants are available from `@az-digital/components-react-bootstrap/Cards` or individual subpaths such as `@az-digital/components-react-bootstrap/Card`. The plain `Card` accepts rich-text HTML through its `body` prop; sanitize that HTML before passing it to the component.

## How it consumes design tokens

Use the design tokens referenced by a component's contract for shared decisions, and import the generated token CSS in the consuming application. Keep component-specific values, such as sizes and timings, in the contract rather than creating `az.component.*` tokens. Implementations should refer to token variables, not copy resolved values.

## Contribute to it

### File layout and naming

- Put each component in `src/components/<Component>/`, with its implementation and a barrel `index.ts`; export public components from `src/index.ts`.
- Use PascalCase component names and keep prop behavior aligned with shared Storybook args and other in-scope implementations.
- Preserve per-component entry points so components that do not need client-side behavior can remain server-safe.
- Add or update the corresponding Storybook story and docs under `packages/storybook/stories/Primary/Components/`.

### Build and lint

Run `npm run build -w @az-digital/components-react-bootstrap`, `npm run lint -w @az-digital/components-react-bootstrap`, and `npm run typecheck -w @az-digital/components-react-bootstrap`. Wire the package build into the root `build:all` command when the package is integrated.

### Platform-specific limits

React props should follow React conventions and may not map one-to-one to raw HTML attributes. Use `react-bootstrap` only where it supplies the needed behavior; keep Arizona-specific variants and limitations explicit. Components that do not have a React implementation should be documented as such rather than represented by a nonfunctional substitute.

## Verification

- [ ] Run the package build, lint, and typecheck scripts.
- [ ] Check server/client boundaries for components with hooks or browser-only behavior.
- [ ] Exercise keyboard and pointer interactions, including React Bootstrap behavior, in Storybook.
- [ ] Verify the rendered component with the consuming application's Arizona Bootstrap and token styles.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
