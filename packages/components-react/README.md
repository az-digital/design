# React Bootstrap

Package: `@az-digital/components-react`.

## What it is / Best for

React components implementing Arizona Digital patterns, with `react-bootstrap` used where it provides the required interactive behavior. Use it in React applications that need component APIs, React composition, and framework-level interaction.

## Install / use

Until a package release is documented, use the package from a checkout that includes it: run `npm install` from the repository root, then import from the public component subpath. For example:

```tsx
import { Button } from '@az-digital/components-react/Button';

export function Example() {
  return <Button href="/apply">Apply to Arizona</Button>;
}
```

The package declares React and React DOM as peer dependencies. Load the Arizona Bootstrap styles and design-token CSS required by the components. Do not assume the package has been published to a registry; see [issue #50](https://github.com/az-digital/design/issues/50) for release planning.

## How it consumes tokens

Use component tokens under `az.component.<name>.*` for component-specific styling and import the generated token CSS in the consuming application. Component implementations should refer to token variables, not copy resolved values. Keep implementation-specific token gaps documented rather than inventing a token.

## Contribute to it

### File layout and naming

- Put each component in `src/components/<Component>/`, with its implementation and a barrel `index.ts`; export public components from `src/index.ts`.
- Use PascalCase component names and keep prop behavior aligned with shared Storybook args and other in-scope implementations.
- Preserve per-component entry points so components that do not need client-side behavior can remain server-safe.
- Add or update the corresponding Storybook story and docs under `packages/storybook/stories/Primary/Components/`.

### Build and lint

Run `npm run build -w @az-digital/components-react`, `npm run lint -w @az-digital/components-react`, and `npm run typecheck -w @az-digital/components-react`. Wire the package build into the root `build:all` command when the package is integrated.

### Platform-specific limits

React props should follow React conventions and may not map one-to-one to raw HTML attributes or Drupal's snake_case variables. Use `react-bootstrap` only where it supplies the needed behavior; keep Arizona-specific variants and limitations explicit. Components that do not have a React implementation should be documented as such rather than represented by a nonfunctional substitute.

## Verification

- [ ] Run the package build, lint, and typecheck scripts.
- [ ] Check server/client boundaries for components with hooks or browser-only behavior.
- [ ] Exercise keyboard and pointer interactions, including React Bootstrap behavior, in Storybook.
- [ ] Verify the rendered component with the consuming application's Arizona Bootstrap and token styles.
- [ ] Follow the shared [component contribution and definition-of-done checklist](../storybook/stories/Primary/Components/Contributing.mdx).
