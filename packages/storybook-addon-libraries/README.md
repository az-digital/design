# @az-digital/storybook-addon-libraries

One set of component stories, rendered by whichever component library a reviewer picks.

The design system has component libraries, including Arizona Bootstrap markup and preview Web Components. This addon provides their Storybook registration, rendering interface, and story-associated design contract test UI. A library joins Storybook by describing itself in its own `package.json` and exporting an adapter; stories describe each component once and need not branch on the library.

## What you get

- **Library toolbar.** A menu that switches every component story between the registered libraries. The choice is a global, so it's kept in the URL (`?globals=library:web`) and shared links open on the same library. The menu says which libraries the current component doesn't have and labels `preview` libraries.
- **Code panel source.** The **Code** panel and docs **Show code** show the selected library's real usage for the current controls, not the story's JSX.
- **Placeholders.** Selecting a library a component doesn't have shows a placeholder with a link to contribute it, instead of breaking.
- **Stylesheets.** Each library's stylesheets load while it's selected.
- **Sidebar filtering.** Each component story carries a `lib:<key>` tag per library, so Storybook's built-in tag filter can show one library's components.

## Add a library

A library is any package, in this workspace or a dependency of the Storybook project, whose `package.json` has an `azDesign.library` manifest. Storybook finds it on startup; there's nothing to register by hand. (Restart Storybook after adding a package.)

### 1. Manifest

```json
{
  "name": "@az-digital/components-html",
  "exports": {
    ".": "./src/index.ts",
    "./storybook": "./storybook/adapter.ts"
  },
  "azDesign": {
    "library": {
      "key": "html",
      "title": "Arizona Bootstrap",
      "status": "supported",
      "codeLanguage": "html",
      "readme": "./README.md",
      "stylesheets": [],
      "adapter": "./storybook"
    }
  }
}
```

<table>
  <thead>
    <tr><th>Field</th><th>Required</th><th>Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><code>key</code></td><td>Yes</td><td>Short id for the global and tags: lowercase letters, digits and hyphens.</td></tr>
    <tr><td><code>title</code></td><td>Yes</td><td>Name shown in the toolbar.</td></tr>
    <tr><td><code>status</code></td><td>Yes</td><td><code>preview</code> until the library is verified on its target platform, then <code>supported</code>.</td></tr>
    <tr><td><code>codeLanguage</code></td><td>Yes</td><td>Language of the code the adapter's <code>source</code> returns, such as <code>html</code>, <code>jsx</code> or <code>twig</code>.</td></tr>
    <tr><td><code>readme</code></td><td>Yes</td><td>The library's README, relative to <code>package.json</code>, with the standard sections below. The Components Overview shows it.</td></tr>
    <tr><td><code>stylesheets</code></td><td>No</td><td>Stylesheets the library needs: absolute URLs, or paths relative to <code>package.json</code>. A stylesheet the page already loads isn't added twice.</td></tr>
    <tr><td><code>adapter</code></td><td>One of these</td><td>The subpath export of the library's Storybook adapter, such as <code>./storybook</code>.</td></tr>
    <tr><td><code>ref</code></td><td>One of these</td><td>The URL of a Storybook rendered by the library's own platform, for a library that can't render in this one. The toolbar still lists it, and its placeholder links there.</td></tr>
  </tbody>
</table>

[`library.schema.json`](./library.schema.json) is the JSON Schema for the manifest. Storybook refuses to start with an invalid manifest or two libraries sharing a key, including keys changed by `overrides`. A manifest saved with an error while Storybook runs is logged, and the last valid libraries stay until it's fixed. In the Arizona Digital design repository, `npm run test:storybook` checks every manifest and adapter.

The field is `azDesign`, not `storybook`, because Storybook Composition already uses `storybook` in `package.json`. The manifest doesn't list components: the adapter does.

### 2. Adapter

The adapter is the library's `./storybook` export. For each component, keyed by its contract id, it says how to draw it and what code a site would write:

```ts
import type { LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { defineAzButton } from '../src/az-button';
import { renderAzButton } from '../src/markup';

export default {
  components: {
    button: {
      render: (props) => {
        defineAzButton();
        return renderAzButton(props);
      },
      source: (props) => renderAzButton(props),
    },
  },
} satisfies LibraryAdapter;
```

- `render(props, container)` returns an HTML string or a DOM node for the addon to insert, or mounts into `container` itself (for a framework with its own renderer, such as React) and returns a cleanup function that unmounts it; the addon calls it before clearing the container. Adapters return DOM, not React elements, so each library renders as itself.
- `source(props)` returns the code a site would write for those props. Make it the same output `render` draws wherever the platform allows.
- `props` are the component's **shared props**, the same for every library and named after its contract (`{ label, color: 'outline-red', size: 'large' }`). The adapter translates them into the library's own API, for example attributes for a custom element.

Keep the adapter importable in Node: register custom elements inside `render`, not at the module's top level.

### 3. README

Every library's README has the standard sections: **What it is / Best for**, **Install / use**, **How it consumes design tokens**, **Contribute to it** and **Verification**. Write it for someone who has the package, not necessarily this repository: use package-relative paths or stable links, and identify any source-checkout-only commands. The Components Overview renders these READMEs.

## Write a component's stories

Spread `componentStories` into the story file's meta, give it the component's contract id and a function from the story's args to the shared props, and list the libraries the component has as `lib:*` tags:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';

const meta = {
  title: 'Primary/Components/Buttons/Button',
  tags: ['lib:html', 'lib:web'],
  ...componentStories('button', {
    props: (args: ButtonArgs) => ({ label: args.Label, color: toContractColor(args), size: toContractSize(args) }),
  }),
  args: { /* … */ },
  argTypes: { /* the shared controls, defined once */ },
} satisfies Meta<ButtonArgs>;
```

- Keep the meta an object literal with literal `title` and `tags`: Storybook reads them from the file without running it.
- Controls can follow Figma's properties; the `props` function translates them into the contract's names once, for every library.
- Decorators are fine (for example a background the component is designed for): the Code panel's source comes from the adapter, not from rendering the story.
- `componentStories` turns on the **Code** panel. On an MDX page, `<Canvas sourceState="hidden">` gives reviewers a **Show code** button that follows the toolbar.
- Pass any other parameters (say a Figma design link) through `componentStories`' `parameters` option — it merges them with its own, including nested `docs`. A meta-level `parameters` after the spread would replace the helper's and hide the Code panel.

## Library registration and design contract tests

The same adapter that draws a component can configure its browser design contract
test. This keeps the fixture and the mapping from contract parts to rendered
elements with the library, not in the shared contract or a separate registry.
For example, an HTML button can add:

```ts
import type { DesignContractTest } from '@az-digital/storybook-addon-libraries';
import type { ButtonProps } from '../src';

const buttonTest: DesignContractTest<ButtonProps> = {
  fixtures: [{
    name: 'button',
    props: (variants) => ({ label: 'Label', ...variants }),
  }],
  target: (container) => {
    const button = container.querySelector('button');
    if (!button) throw new Error('The button fixture did not render a button.');
    return { parts: { root: button, label: button } };
  },
};

// In the adapter's components.button, alongside render and source:
// designContractTest: buttonTest
```

- Each fixture names the case and supplies shared props from contract variant
  options. The runner tries omitted axes as well as every explicit option
  combination, so the real default is tested too. Translate the options to
  the library's API in `props` when their names differ.
- `target` finds the rendered elements. Map `root` and every applicable
  contract part; use `focus`, `hover` or `press` when the interaction target
  differs from `root`. It can be async, for example to wait for a custom
  element and map elements inside its shadow root.
- Use `prepare(container)` for necessary containing layout, and
  `implementation: { name, file }` to identify where to fix findings.
  A fixture may declare `optionalParts` and narrow `skip` rules with reasons.
  Missing required parts, unsupported properties and unreachable states are
  reported, not silently counted as passes.

The libraries addon owns the Storybook lifecycle integration, per-story
statuses, and **Design contracts** panel. A Storybook project supplies its
contract data and browser-checking engine to `createDesignContractTestRunner`,
then registers the returned `beforeEach` and `afterEach` hooks in preview
annotations. The addon measures before Storybook pauses transitions and attaches
the result in `afterEach`. This keeps contract/token data and browser-checker
setup with the project, while the addon associates checks and results with
component stories.

In the Arizona Digital design repository, each story checks the
implementations named by its `lib:*` tags (or all registered libraries when it
has no such tags). The panel shows only the selected library's latest results;
use the Library switch to inspect another implementation. The story's sidebar
status indicator follows that selection. `npm run test:design-contracts` runs
the same story checks in Chromium and returns their coverage and findings.

An adapter component with no test is **untested**. Components without
contracts and libraries with a `ref` are also reported; components absent
from an adapter are not. The `lib:*` tags define the implementations in scope
for that story's test. Record the agreed implementation scope in the component
issue.

The panel groups cases in **Findings**, **Conforming**, and **Incomplete** tabs.
Counts are cases, not individual checks. A case with both failed and incomplete
checks appears in both tabs; deliberately skipped checks do not make a case
incomplete unless every check was skipped or no check was reported. The panel
tab's badge counts the selected library's nonconforming cases, or shows one
when it has no test or contract. Findings and incomplete checks are shown in a
table by variant, state, property, expected value, and actual value. Expand a
row's details for the full finding and suggested fix.

A story can test only the variant it shows by setting
`parameters.designContracts.variant`, with one option per contract axis, for
example `{ color: 'outline-white' }`. Its panel then shows that variant's
contract rows by part, state, property and value, each with its result and
drawn value; rows that fail or can't be checked are annotated with what was
found and the suggested fix. A link opens the component's docs page for the
full contract. Its badge counts those rows. Without a `variant`, a story tests
every combination of the contract's variants. The test command doesn't repeat a
variant story's cases or summary when a full-matrix story of the same component
has run.

When `@az-digital/storybook-addon-tokens` is also installed, the variant view
uses its token pill component for token values, including its details view and
color swatches. Without that addon, token names show as plain text.

In a static Storybook, the addon loads published results from
`design-contract-results.json` beside `index.html`. The file contains
`{ "version": 1, "stories": { "<story-id>": <ComponentContractReport> } }`;
the Arizona Digital repository's test command can write it. The panel labels
these results as published and reports a missing or invalid file rather than
treating it as a pass. When results are available, the docs toolbar links to
the associated story's results, including stories hidden from the sidebar.
Local test runs continue to show their latest results.

Drift and missing coverage are reported rather than blocking CI; setup errors
fail the run. The library's
`preview`/`supported` status describes the library, not the test's status.
See the [testing library guide](https://github.com/az-digital/design/tree/main/packages/design-contract-testing)
for the result codes and coverage.

## Configure

Add the addon to `.storybook/main.ts`. Every option is optional; they're only this Storybook's choices about libraries that registered themselves:

```ts
{
  name: '@az-digital/storybook-addon-libraries',
  options: {
    order: ['html', 'web'],  // toolbar order; unlisted libraries follow by title
    default: 'html',         // selected when Storybook opens; the first library otherwise
    disable: [],             // discovered libraries to leave out of this Storybook
    overrides: {},           // manifest fields to replace here, by key: { web: { title: 'Custom elements' } }
                             // adapter, readme and stylesheets resolve like the manifest's own, relative to the library's package
  },
}
```

## How it fits Storybook

- The toolbar is Storybook's own `Select`, the component built-in toolbar menus use. It's a custom tool rather than a `globalTypes` toolbar because built-in menus can't see a story's tags.
- The selected library is the `library` global, declared by this addon's preview annotation with `initialGlobals`, the same pattern as `@storybook/addon-themes`.
- Stories render through `render`, not a decorator, because Storybook's docs source capture bypasses decorators. The **Code** panel uses `parameters.docs.source.transform`, which asks the selected adapter for source.
- Libraries are discovered in Node by the preset and served to the preview as a Vite virtual module, `virtual:az-design-libraries`, like the tokens addon's data.

## Layout

<table>
  <thead>
    <tr><th>File</th><th>Runs in</th><th>Does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>src/preset.js</code></td><td>Node</td><td>Adds the Vite plugin with this Storybook's options.</td></tr>
    <tr><td><code>src/node/discover.js</code></td><td>Node</td><td>Finds and validates manifests; applies <code>order</code>, <code>default</code>, <code>disable</code> and <code>overrides</code>.</td></tr>
    <tr><td><code>src/node/vite-plugin.js</code></td><td>Node</td><td>Serves the libraries, their adapters and stylesheet URLs to the preview.</td></tr>
    <tr><td><code>src/preview.ts</code></td><td>Preview</td><td>The <code>library</code> global, the Code panel transform and stylesheet loading.</td></tr>
    <tr><td><code>src/componentStories.tsx</code></td><td>Preview</td><td><code>componentStories</code>, <code>LibraryCanvas</code> and the placeholder.</td></tr>
    <tr><td><code>src/manager.tsx</code></td><td>Manager</td><td>The Library toolbar.</td></tr>
    <tr><td><code>src/design-contracts/</code></td><td>Preview and manager</td><td>Contract test lifecycle, result reporting, sidebar statuses and the Design contracts panel.</td></tr>
  </tbody>
</table>
