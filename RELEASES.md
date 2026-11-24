# Releases

> **Draft:** This policy applies to releases from `1.0.0` onward. Other
> compatibility and release-process details are still being decided in
> [issue #50](https://github.com/az-digital/design/issues/50). The Release
> workflow does not yet enforce the CI gate or support pre-publication
> release-note review. Token deprecation metadata and its Storybook display are
> tracked separately in [issue #198](https://github.com/az-digital/design/issues/198).

## What is released

The design system uses one shared version for its published packages and
Storybook. The Release workflow publishes non-private workspaces to GitHub
Packages; these currently include `@az-digital/tokens` and
`@az-digital/contracts`. Private workspaces are not published.

Each release has a `v<version>` Git tag and a versioned Storybook. See
[Published Storybook](README.md#published-storybook) for the release workflow,
package publishing, and documentation URLs.

## Token compatibility

The following token names and published import paths are part of the public API:

- CSS custom properties such as `--az-color-brand-blue` in
  `@az-digital/tokens/dist/tokens.css`.
- Sass variables such as `$az-color-brand-blue` in
  `@az-digital/tokens/dist/tokens.scss`.
- JavaScript token names such as `az.color.brand.blue` in
  `@az-digital/tokens/dist/tokens.vars.js`, and their TypeScript declarations in
  `@az-digital/tokens/dist/tokens.vars.d.ts`.
- DTCG-format source token names in `@az-digital/tokens/tokens.json`.

Removing or renaming one of these token names or paths is a breaking change.
Token values follow the versioning rules below.

The documented source-token structure and a supported way to use source tokens
in Figma are also covered. An incompatible change to either requires a major
release, even if token names and import paths stay the same. No particular
Figma sync plugin is guaranteed.

Documented formats and behavior of generated CSS, Sass, JavaScript, and
TypeScript outputs are also protected. For example, JavaScript token values are
CSS `var(...)` references, not raw values. Incompatible changes require a major
release, subject to the color-token correction exception below.

Except for color-token corrections described below, existing alias relationships
are also part of the public API, both in the source and in outputs that preserve
them. Repointing an existing alias or replacing it with a literal value is a
breaking change, even if its resolved value stays the same.

Token value and alias changes can affect sites using the generated CSS or Sass,
and Figma designs after importing or syncing source tokens. Arizona Bootstrap
does not consume these tokens directly; matching a design change may require a
separate update to its styles.

## Component compatibility

When component implementations are published, their documented APIs and
behavior and documented markup are covered by the compatibility promise. These
include, where applicable, documented properties, attributes, events, slots,
keyboard interactions, and supported customization hooks.

The same promise covers documented markup and tracking hooks published for
copying from Storybook, including Arizona Bootstrap examples. It does not
govern independently released versions of Arizona Bootstrap.

Document and preserve DOM hooks for integrations such as Google Tag Manager
(GTM), including their supported selectors, target elements, and relevant event
behavior. Incompatible changes to documented APIs, behavior, markup, or hooks
are breaking.

Undocumented implementation details, such as internal DOM structure and CSS
classes, are not covered by the compatibility promise; integrations that rely
on them may break. Changes to component appearance still follow the versioning
rules below.

## Contract format compatibility

The published component contract files, schema, and flattened contract data are
not covered by the compatibility promise. Their formats and file paths may
change in any release, so tools that consume them should check compatibility
when updating. Changes to the component designs they describe follow the
versioning rules below.

## Choosing a version

Starting with `1.0.0`, releases follow [Semantic Versioning](https://semver.org/).
Choose the version for the most significant change in the shared release.

Changes only to internal CI, tests, or tooling that do not change published
packages or Storybook do not require a release; they can be included in the
next release. Dependency updates are classified by their impact on design
system consumers, not by the dependency's own version bump.

- **Patch** (`1.2.3` to `1.2.4`): backward-compatible fixes, and
  documentation-only fixes and additions that do not introduce a new
  design-system feature or change a public compatibility promise. Correcting
  an existing color token's value without renaming it is a patch, even if the
  change is visible on sites using the token or changes that token's alias. An
  alias change can affect consumer overrides. Describe the visual change and
  any alias change and its impact in the release notes.
- **Minor** (`1.2.3` to `1.3.0`): backward-compatible new features and other
  additions, such as new components, tokens, or optional component
  capabilities, and deprecations. A non-disruptive refresh of an existing token
  value or a component's default appearance is also a minor change if it
  preserves the other compatibility promises.
- **Major** (`1.2.3` to `2.0.0`): breaking changes, such as a new feature that
  changes an existing API incompatibly, removing a token that consumers use, or
  a token-value change or redesign that substantially disrupts existing designs.
  Describe the impact and migration in the release notes.

Corrections to other token types are patches only when backward compatible. A
substantially disruptive correction, such as one that breaks existing layouts,
requires a major release.

Prereleases are optional for any release, including a major release. A version
with a prerelease suffix, such as `1.3.0-beta.1`, is marked as a prerelease. The
API may change incompatibly between prereleases or before the stable release.
The stable release must still follow the versioning rules above relative to
earlier stable releases.

The workflow publishes prerelease packages with the npm `next` dist-tag;
ordinary releases use `latest`. These npm tags follow the most recent publication
for each tag and can differ from Storybook's version-ordered aliases.

The component examples are informed by [Semantic Versioning for Design System
Components](https://uxdictionary.io/article/semantic-versioning-for-design-system-components-unlocking-predictable-updates).

## Release notes

[GitHub Releases](https://github.com/az-digital/design/releases) is the source of
truth for release history. The root [CHANGELOG.md](CHANGELOG.md) points there.
Highlight new features and packages with consumer-facing changes; a list of
every published package is not required. When applicable, describe breaking
changes, deprecations, migrations, and visual or alias impacts. A maintainer
reviews these highlights before publishing; automation may prepare the draft.

For a pull request with a release impact, apply one label: `patch release`,
`minor release`, or `major release`. If more than one applies, use the
highest-impact label. These labels group generated release notes and help the
maintainer choose the version; they do not determine it automatically. Pull
requests without a release label appear under Other changes.

Issues may use the same labels for an initial assessment; reassess and apply
the appropriate label to the pull request.

## Release readiness

Before publication, the Release workflow must verify that CI's build and
quality checks succeeded for the exact release commit. It also builds the
publishable packages and checks their artifacts.

## Recovering a release

A published package version cannot be republished. If publication stops
partway through and the published packages are correct, complete only the
missing steps using the same version and commit. If a published package needs
correction, use a new version for the corrected release.

Check the affected npm dist-tags during recovery. If only the Storybook
deployment or its dispatch fails, retry it for the existing release instead of
publishing the packages again.

## Figma version identification

Designers should be able to identify one file-wide target design-system version
for a Figma file. Mark the file as mixed or unverified when its tokens and
components do not all match the target or their sources are unknown. How to
record and verify the target, and how to represent unreleased sources, is still
being decided.

## Deprecation and migration

Announce a token's deprecation in a minor release, mark it in machine-readable
token data, and show its deprecated status in Storybook. Keep it available for
the rest of that major version. It may be removed in the next major release;
for example, a token deprecated in `1.2.0` may be removed in `2.0.0`.

Provide migration guidance identifying the deprecated token, its replacement
when available, and the changes consumers need to make. Release notes should
point to that guidance. An agent migration skill may supplement the written
instructions when useful.

## Support

Only the latest minor release of the current major is supported. For example,
after `1.4.0` is released, fixes target `1.4.x`, not `1.3.x`. After `2.0.0`,
the `1.x` line is no longer supported.

Prerelease feedback and bug reports are handled on a best-effort basis; fixes
are not guaranteed.
