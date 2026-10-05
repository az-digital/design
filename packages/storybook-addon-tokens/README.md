# @az-digital/storybook-addon-tokens

Design tokens are the source of truth, not any one platform's version of them.

This Storybook addon shows your [DTCG](https://www.designtokens.org/) token file as your team designed it: each token's path, type, value, and the chain of aliases it resolves through. It shows each platform's output as a *derivation* of that token, for whichever platforms your [Style Dictionary](https://styledictionary.com/) config builds: CSS custom properties, Sass variables, JavaScript, Swift, Android XML, or your own. No platform's output is treated as the token itself, so nobody reviewing your tokens has to read them in CSS.

Your Style Dictionary config decides which outputs exist. The addon reads it; it doesn't assume any.

## What you get

- **Tokens tab.** An addon panel next to Controls that lists the tokens a story uses. It's opt-in per story, like Controls.
- **Token details.** Click any token to see its resolved value, its description, an **alias tree** (where the value comes from, what else shares it, and what depends on it; click a node to walk the tree), the source file, and every output file Style Dictionary derives from it, with how to reference the token there and the value that file gets.
- **Doc blocks** for MDX pages: `Token`, `TokenTable`, `TokenDisplay`, and `ComponentTokenIndex`, plus data helpers for building your own (for example, brand swatch cards that embed the `Token` pill).

Token values are always shown exactly as your source file writes them. Where an output writes something different (Style Dictionary's color transform re-cases hex, for example, or a dimension transform converts units), the details show both.

## Install

```sh
npm install --save-dev @az-digital/storybook-addon-tokens
```

`style-dictionary` (v4 or later), `storybook` (v10), and `react` are peer dependencies: the addon uses your project's own Style Dictionary, so what it shows is exactly what your build produces.

## Configure

Add the addon to `.storybook/main.ts` and point it at your Style Dictionary config:

```ts
const config: StorybookConfig = {
  addons: [
    {
      name: '@az-digital/storybook-addon-tokens',
      options: {
        // Required: your Style Dictionary config, relative to .storybook/.
        styleDictionary: '../tokens/style-dictionary.config.mjs',
        // Optional: repo-relative file paths are appended to this for links.
        repositoryUrl: 'https://github.com/your-org/your-repo/blob/main/',
      },
    },
  ],
};
```

When Storybook starts (or builds), the addon runs your config's platforms in memory with Style Dictionary's own API. It writes no files. For every output file it records each token's reference and derived value. It re-runs whenever the config or one of its `source` files changes, so token edits show up without restarting Storybook.

### Modes (e.g. dark)

If some tokens change value in a mode, keep those overrides in their own file (one file per mode, the way Figma variable modes import them) and list it under `modes`, with the Storybook globals that select it:

```ts
options: {
  styleDictionary: '../tokens/style-dictionary.config.mjs',
  modes: {
    // Source paths are relative to the Style Dictionary config, like its own `source`.
    dark: { label: 'Dark', source: ['tokens.dark.json'], globals: { theme: 'Dark' } },
  },
},
```

The addon reads each mode with your config's source plus the mode's files layered on top. While Storybook's globals match a mode (here, `@storybook/addon-themes` set to Dark), the Tokens tab, the token details, and the doc blocks show that mode's resolved values and alias tree, and label them with the mode. Outputs still show the base files. `baseModeLabel` names the base values (e.g. `Light`).

For a token whose value differs by mode, the token details list every mode's resolved value, and the alias tree draws where the modes split: each mode's own ancestors, labeled with the mode, joined into the token that switches (marked "changes per mode"), with everything below it shared.

### References for custom formats

For Style Dictionary's built-in formats (`css/variables`, `scss/variables`, `less/variables`, `javascript/es6`, `android/resources`, `ios-swift/*`, …) the addon knows how a token is referenced. A custom format declares it in that file's `options`, next to the code that produces the output:

```js
{
  destination: 'tokens.js',
  format: 'my/custom-format',
  options: {
    // How to reference a token from this file.
    tokenReference: (token) => `tokens.${token.path.join('.')}`,
    // Optional: the value this file holds for the token, if the format writes one.
    tokenValue: (token) => token.$value,
  },
}
```

Style Dictionary ignores these options; only the addon reads them. A built-in format can use them too, to override the default.

## Use it

### The Tokens tab

Declare which token groups a story uses, by dot-path prefix. The tab only appears on stories that do:

```ts
const meta = {
  parameters: {
    tokens: ['az.component.button.', 'az.color.semantic.action.'],
  },
} satisfies Meta;
```

Set it on a story file's meta to cover every story in it, or on a single story to override. `tokens: { disable: true }` hides the tab for one story. (Use `{ disable: true }`, not `false`: Storybook drops falsy parameters before an addon sees them.)

### Doc blocks

```mdx
import { ComponentTokenIndex, TokenDisplay } from '@az-digital/storybook-addon-tokens';

<TokenDisplay prefix="az.color.semantic." layout="table" />

<ComponentTokenIndex />
<ComponentTokenIndex component="button" />
```

- `TokenDisplay`: token pills, or `layout="table"` for one row per token: Token · Type · Alias of · Resolved value.
- `ComponentTokenIndex`: every component's tokens, one collapsed row per component, with search, type filters, and a Style / State grouping switch. `component="button"` shows one component's tokens without the index.

Helpers such as `getTokenDisplayItems(prefix)`, `resolveValue(path)`, and `getTokenArtifacts(path)` are exported for stories that need token values directly, and for site-specific presentations: this repo's brand swatch cards (`packages/storybook/stories/Primary/Foundations/Tokens/ColorSwatchGrid.tsx`) are built from `getTokenDisplayItems` and the `Token` pill rather than shipped in the addon.

## How component tokens are grouped

`ComponentTokenIndex` reads grouping from token paths, so there is nothing to register when a component is added. It expects:

```
<root>.component.<component>.<shared part>.<property>      e.g. az.component.button.padding.x
<root>.component.<component>.<variant>.<part>.<property>   e.g. az.component.button.solid.container.color
<root>.component.<component>.<variant>.<state>.<part>...   e.g. az.component.button.outline.hover.label.color
```

A top-level group counts as a **variant** when it overrides a part the component's root already defines (`solid.label` overrides `label`; `size.sm.padding` overrides `padding`). A token's **state** is the first of `hover`, `focus`, `focus-visible`, `active`, or `disabled` in its path; anything else is the Default state.

## How it works

- **Node side** (`src/preset.js`, `src/node/`): the preset adds a Vite plugin. The plugin loads your Style Dictionary config, has Style Dictionary read every token (its value as written, what it resolves to, and the token it aliases) and each platform's outputs, and serves them to the preview as a virtual module.
- **Preview** (`src/index.ts`, `src/preview.ts`): the doc blocks read that data synchronously. The preview also sends it to the Tokens tab over Storybook's channel.
- **Manager** (`src/manager.tsx`): the Tokens tab, which receives the data from the preview.
