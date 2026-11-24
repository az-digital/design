# React Bootstrap

Package: `@az-digital/components-react-bootstrap`.

## What it is / Best for

React components implementing Arizona Digital patterns, with `react-bootstrap` used where it provides the required interactive behavior. Use it in React applications that need component APIs, React composition, and framework-level interaction.

## Install / use

This implementation has not been built or published yet. Its installation,
public imports, React peer versions and required styles will be documented
before release; see [issue #50](https://github.com/az-digital/design/issues/50)
for release planning.

## How it consumes design tokens

Use the design tokens referenced by a component's contract for shared decisions, and import the generated token CSS in the consuming application. Keep component-specific values, such as sizes and timings, in the contract rather than creating `az.component.*` tokens. Implementations should refer to token variables, not copy resolved values.

## Contribute to it

### File layout and naming

- Put each component in `src/components/<Component>/`, with its implementation and a barrel `index.ts`; export public components from `src/index.ts`.
- Use PascalCase component names and keep prop behavior aligned with shared Storybook args and other in-scope implementations.
- Preserve per-component entry points so components that do not need client-side behavior can remain server-safe.
- Add or update the corresponding Storybook story and docs.
- When implementing a component, configure its fixtures and part mappings on
  its Storybook adapter. See
  the [library addon guide](https://github.com/az-digital/design/tree/main/packages/storybook-addon-libraries#library-registration-and-design-contract-tests).

### Build and lint

Build, lint and type-check commands will be documented when the implementation exists.

### Platform-specific limits

React props should follow React conventions and may not map one-to-one to raw HTML attributes. Use `react-bootstrap` only where it supplies the needed behavior; keep Arizona-specific variants and limitations explicit. Components that do not have a React implementation should be documented as such rather than represented by a nonfunctional substitute.

## Verification

- [ ] Run the package build, lint, and typecheck scripts.
- [ ] Check server/client boundaries for components with hooks or browser-only behavior.
- [ ] Exercise keyboard and pointer interactions, including React Bootstrap behavior, in Storybook.
- [ ] Verify the rendered component with the consuming application's Arizona Bootstrap and token styles.
- [ ] Run its configured design contract tests and test the implementation in its target React environment.
- [ ] Follow the shared [component contribution and definition-of-done checklist](https://github.com/az-digital/design/blob/main/packages/storybook/stories/Primary/Components/Contributing.mdx).
