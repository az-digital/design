# @az-digital/storybook-addon-build-info

A private Storybook addon for showing which release, review build, or local
checkout is open, along with links to the source files and published packages.

## What it shows

- Release version and tag, or the pull request and checked-out commit for a review build.
- The source page, story, and component-library adapters for the current entry.
- GitHub Packages pages for each non-private `@az-digital` workspace in a release.
- The repository and its releases.

Release source links use the verified release tag. Review-build source links use
the checked-out commit, not the pull request's moving head branch. Local builds
show their Git branch and commit; source links use `STORYBOOK_GIT_REF` or `main`
and may not represent uncommitted changes.

## Configure

Add the addon to the Storybook `addons` list. It reads release and CI metadata
from the environment and inspects the workspace manifests and registered
component libraries:

```ts
addons: [
  getAbsolutePath('@az-digital/storybook-addon-build-info'),
]
```

The addon expects the repository's Storybook config at
`packages/storybook/.storybook`; it reads the repository root three directories
above that config. It adds the build metadata to the manager page and registers
the **Design system build** toolbar on story and docs pages.

## Development

The toolbar stories and integration tests live in
`packages/storybook/stories/Internal/BuildInfoTool.stories.tsx`. Run
`npm run test:storybook` from the repository root to test all supported build
states.
