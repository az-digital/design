# Arizona Bootstrap Playwright pilot

This local pilot reads button markup from an Arizona Bootstrap
checkout's documentation and checks its freshly compiled CSS, independently of
Storybook's patched dependency. It covers the documented button colors and
sizes. It does not replace Arizona Bootstrap's visual-regression tests.

From a design repository checkout, with a separate Arizona Bootstrap checkout
whose `npm run css-compile` has succeeded:

```bash
AZ_BOOTSTRAP_CHECKOUT=/absolute/path/to/arizona-bootstrap \
  npx --workspace @az-digital/design-contract-testing playwright test \
  --config examples/arizona-bootstrap/playwright.contracts.config.mjs
```

The pilot prints drift and attaches the structured results without blocking on
drift; missing markup, invalid contract or token data, and setup errors fail.
Inspect passed, skipped, unsupported and blocked rows before considering a
variant covered. The pilot has not been installed in Arizona Bootstrap or its
CI. External package installation, authentication and CI integration are
deferred until the in-repository workflow and a release are ready.
