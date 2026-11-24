# @az-digital/design-contract-testing

A browser testing library for Arizona Digital component design contracts. It
compares rendered parts with design properties and tokens without depending on
Storybook, Vite or Arizona Bootstrap. Contracts remain implementation-independent
data; each implementation supplies its own fixtures and part mappings.

## Tests in the design repository

Each library configures tests on its Storybook adapter, alongside the rendering
it already registers. The [library addon guide](https://github.com/az-digital/design/tree/main/packages/storybook-addon-libraries#library-registration-and-design-contract-tests)
explains fixtures, variant props, part mappings, optional parts and skips.

In a source checkout, run `npm run test:design-contracts` to test the component
stories and their tagged implementations in Chromium. In Storybook, run the
component tests from the testing widget; the selected library's result appears
in the **Design contracts** panel, and the story status follows the Library
switch. Use the CLI report to review all tagged implementations together. The
same checks are included in
`npm run test:storybook`. Drift and missing coverage are reported without
blocking CI; a broken test setup fails.

`npm run test:design-contracts -- --verbose` prints all findings. For a structured
report containing the library inventory and every case's individual entries,
use `npm run --silent test:design-contracts -- --json`. The inventory distinguishes
untested implementations, components without contracts, and libraries hosted
in a separate Storybook for each tested component story. It does not list
components a library doesn't implement or that no component story tests.
The component issue must still identify which implementations and cases are in scope.

## Browser API

`testDesignContract` from `@az-digital/design-contract-testing` accepts contract rows, variant
defaults and options, token CSS or a map of CSS variables, a `target.parts` map,
and a driver for real browser input. It resolves supplied tokens in an isolated
document rather than against the implementation's CSS variables. Without
supplied tokens it uses variables inherited from the page body.

The driver supplies `hover`, `unhover`, `press`, `release`, `keyboardFocus`,
`setViewport` and `restoreViewport`; missing capabilities are reported as
unsupported. Hover, press and viewport tests require their corresponding
restore capabilities before entering those states. The test uses real pointer
and keyboard states and exercises declared breakpoints at the first whole-pixel
viewport at or above the token's width and one pixel below. It restores the
viewport afterward and finishes in-flight CSS transitions before reading values.

The `/playwright` adapter supplies a Playwright driver, and `/node` loads
installed contract and token data. The loader refuses a token source whose hash
differs from the one recorded when the contract output was built; this checks
the source, not a separately edited CSS file. A local Arizona Bootstrap pilot is
included for development; external installation, release and CI integration
have not been established.

## Results and coverage

`result.entries` records each tested or deliberately skipped property with its
part, state or breakpoint, expected source and outcome. `result.counts`
summarizes the entries; `result.ok` is true only if at least one property passed
and none failed, was unsupported, unmapped or blocked. Serialize the result to
retain full coverage, including passes and skips. `formatResult(result)` formats
findings with codes, expected and drawn values where applicable, and an action.
`describeCoverage(result)` gives the counts.

| Status | Meaning |
| --- | --- |
| `passed` | The property was read and matched. |
| `failed` | A value, shape, state or required data did not match or could not be established. |
| `unsupported` | The testing library or driver cannot test this property or state. |
| `unmapped` | A required contract part has no mapped element. |
| `blocked` | The row could not be read until another finding is fixed. |
| `skipped` | The configuration explicitly excludes it, with a reason, or there is nothing to measure (for example a gap with one item). |

`optionalParts: ['icon']` records the rows of an absent optional part as skipped;
it does not skip a mapped part. For a known exception, use
`skip: [{ part: 'label', condition: 'hover', property: 'color', reason: '…' }]`.
Omitted fields match any part, condition or property. Avoid broad skips: they
reduce coverage, and a test with no passes is not conforming.

Finding codes are stable: `AZC001` value mismatch, `AZC002` shape mismatch,
`AZC003` unsupported property, `AZC004` unsupported state, `AZC005` missing
driver, `AZC006` unmapped part, `AZC007` unreachable state or failed state
restoration, and `AZC008` missing/invalid contract or token data. Unsupported
states currently include `focus-within`, `open` and `disabled`. Part
discovery, structure and ordering are outside this test (see
[issue #142](https://github.com/az-digital/design/issues/142)).

The testing library reads the CSS properties supported by
[`src/browser.js`](src/browser.js), including all sides of padding and borders,
common typography, colors, focus outlines/compatible box shadows, gaps,
transitions, dimensions and aspect ratios. An unsupported design property is
reported rather than silently ignored. Computed styles do not prove
accessibility, semantics or visual fidelity; retain those tests and visual
regression tests separately.
