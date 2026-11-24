# @az-digital/storybook

The private Storybook used to review the design system and its component
implementations. See the [repository README](../../README.md) for setup,
scripts, token builds and contribution guidance.

## How it fits together

- `.storybook/main.ts` configures the addons, story discovery and asset builds.
  `.storybook/preview.ts` loads design tokens and Arizona Bootstrap's patched
  Sass for the preview; `preview-head.html` loads its fonts.
- `stories/` contains the component stories and documentation. Component
  stories use `componentStories` from the
  [libraries addon](../storybook-addon-libraries/README.md): the addon discovers
  each library's `azDesign.library` manifest and adapter, draws the chosen
  library and supplies its Code panel.
- `src/` contains site-specific helpers and tests. The
  [tokens addon](../storybook-addon-tokens/README.md) supplies token docs and
  the Tokens tab; [contracts](../contracts/README.md) supply design decisions
  as data.

## Design contract tests

Each local library configures its fixtures and part mappings on its existing
Storybook adapter. When a component story runs as a test, its design contract
check uses the libraries addon's adapters, renders through the same adapter as
the story, and compares each registered implementation allowed by the story's
`lib:*` tags with the contract in Chromium. It reports implementations without
tests or design contracts and libraries hosted in another Storybook. It does
not report components a library doesn't implement. The
[libraries addon guide](../storybook-addon-libraries/README.md#library-registration-and-design-contract-tests)
describes the adapter fixtures and the addon's lifecycle, per-story statuses,
and results panel. This package supplies the repository's contract data and
browser-checking engine. The
[testing library guide](../design-contract-testing/README.md) explains the results.

The test result is attached to the component story that was tested. The
**Design contracts** panel shows only the selected library's results; use the
Library switch to inspect another implementation. The sidebar status indicator
follows that selection. Locally, run component tests in Storybook's testing
widget to check the stories. The review site shows the published CI results
for that build without rerunning tests; use **Design contracts** in a component
docs page's toolbar to open its story results. From the
repository root, `npm run test:design-contracts` runs those checks in Chromium
(`-- --verbose` shows all findings; `npm run --silent test:design-contracts -- --json`
returns every case and result entry). CI also uses
`-- --storybook-report=<file>` to write per-story results and publishes the
file as `design-contract-results.json` alongside the review site's Storybook
build. Other static builds show no published results unless that file is
provided. Drift and missing coverage are reported
without blocking CI, but a broken test setup fails. `npm run test:storybook`
also runs the component stories and their contract checks.
Design contract tests complement, rather than replace, accessibility, behavior and
target-platform testing.
