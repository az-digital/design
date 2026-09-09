import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { expect } from 'storybook/test';
import { Button } from '@az-digital/components-react';
import { renderButton } from '@az-digital/components-html';
import type { ImplementationKey, Implementations } from './implementations';
import { renderImplementation } from './implementations';
import type { ButtonState } from './TokenStatePreview';
import { TokenStatePreview } from './TokenStatePreview';
import { resolveValue } from './resolveToken';

type ButtonArgs = Parameters<typeof renderButton>[0] & { text?: string };

/**
 * Default/Hover/Focus-visible shown side by side, each recreating that
 * state's look directly from its own resolved token — not a live
 * `:hover`/`:focus-visible` test (there's no way to make all three
 * genuinely true at once across separate instances). Hover and focus-visible
 * share the same container color by design (see `packages/tokens/AGENTS.md`
 * — focus without a visible ring looks identical to hover); focus-visible
 * additionally shows the ring, the one property exclusive to it.
 */
const BUTTON_STATES: ButtonState[] = [
  { label: 'Default' },
  { label: 'Hover', css: `& .btn { background-color: ${resolveValue('az.component.button.hover.color')} !important; }` },
  {
    label: 'Focus-visible',
    css: `& .btn {
      background-color: ${resolveValue('az.component.button.focus.color')} !important;
      outline: 2px solid ${resolveValue('az.component.button.focus-visible.ring')} !important;
      outline-offset: 2px;
    }`,
  },
];

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: ButtonArgs) => {
  const props: string[] = [];

  if (args.htmlTag && args.htmlTag !== 'a') props.push(`htmlTag="${args.htmlTag}"`);
  if (args.href) props.push(`href="${args.href}"`);
  if (args.style && args.style !== 'solid') props.push(`style="${args.style}"`);
  if (args.color && args.color !== 'red') props.push(`color="${args.color}"`);
  if (args.size) props.push(`size="${args.size}"`);
  if (args.disabled) props.push('disabled');
  if (args.active) props.push('active');

  const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<Button${propsString}>${args.text ?? 'Learn More'}</Button>`;
};

/** Button has both implementations. A component that only needs one omits the other key entirely. */
const implementations: Implementations<ButtonArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderButton(args) }} />,
    source: (args) => renderButton(args),
  },
  react: {
    render: (args) =>
      createElement(
        Button,
        {
          htmlTag: args.htmlTag,
          href: args.href,
          style: args.style,
          color: args.color === 'success' ? undefined : args.color,
          size: args.size,
          disabled: args.disabled,
          active: args.active,
        },
        args.text,
      ),
    source: asReactCode,
  },
};

/**
 * For a story whose approved Figma frame shows a non-white page background:
 * wraps each implementation's Code-panel source in a real utility class
 * (e.g. `bg-cool-gray`) so the copyable example matches what the frame
 * actually needs. A white background isn't shown this way — it's the
 * implicit default a page already has, so noting it in every example would
 * just be noise.
 */
function withBackgroundClassSource(bgClass: string, base: Implementations<ButtonArgs>): Implementations<ButtonArgs> {
  const wrapped: Implementations<ButtonArgs> = {};

  for (const key of Object.keys(base) as ImplementationKey[]) {
    const entry = base[key];
    if (!entry) continue;

    wrapped[key] = {
      ...entry,
      source:
        key === 'html'
          ? (args) => `<div class="${bgClass}">\n  ${entry.source(args)}\n</div>`
          : (args) => `<div className="${bgClass}">\n  ${entry.source(args)}\n</div>`,
    };
  }

  return wrapped;
}

function ButtonStory(args: ButtonArgs, context: StoryContext) {
  return renderImplementation('Button', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; ButtonStory itself also takes a `context` param, which Meta<T> doesn't expect
function ButtonArgsShape(_args: ButtonArgs) {
  return null;
}

const meta = {
  title: 'Components/Button',
  // Set only so react-docgen can attach Button's prop table to this story file's
  // documentation (see the Storybook MCP addon-mcp component manifest) — rendering
  // itself always goes through `render: ButtonStory` below. Must stay a bare reference
  // to the imported `Button`: the manifest builder statically resolves `meta.component`
  // back to its import declaration, so a cast or local alias here breaks that lookup
  // ("No component import found").
  component: Button,
  render: ButtonStory,
  argTypes: {
    htmlTag: { control: 'radio', options: ['a', 'button'] },
    style: { control: 'radio', options: ['solid', 'outline', 'link'] },
    color: { control: 'radio', options: ['red', 'blue'] },
    size: { control: 'radio', options: [undefined, 'sm', 'lg'] },
  },
  args: {
    htmlTag: 'a',
    style: 'solid',
    color: 'red',
    text: 'Apply to Arizona',
  },
  parameters: {
    implementations,
    // Button doesn't wire any `action()` argTypes yet, so the Actions tab would only
    // ever be empty here. Remove this once one is actually added to a story.
    actions: { disable: true },
    // This is now a single fixed reference mirroring an approved Figma frame, not a
    // playground — Controls would let you turn it into a combination Figma hasn't
    // approved while the story still claims to be that frame. See the story below.
    controls: { disable: true },
    // Every story here defines its own custom `render`, so Storybook's default
    // ('auto') Code-panel behavior falls back to showing the literal, static story
    // source instead of running `docs.source.transform` below — confirmed directly:
    // the transform's `implementations`/`implementationsOverride` had no effect on
    // the per-story Code tab until this was set. 'dynamic' forces every story's Code
    // panel through the transform instead.
    docs: { source: { type: 'dynamic' } },
  },
  // `component`'s real prop type (no `success`) is narrower than `ButtonArgs` (which,
  // via components-html, also allows the HTML-only `success` color); that's
  // intentional, so it's exempted from this check rather than widened, which would
  // misrepresent Button's actual props.
} satisfies Omit<Meta<typeof ButtonArgsShape>, 'component'> & { component?: typeof Button };

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mirrors the approved Figma frame "Solid Button Red w/ White Background."
 * This is the only Button story right now: Outline, Blue, Disabled, and the
 * HTML-only `success` color are all still fully supported by the component,
 * they just don't have an approved Figma frame to mirror yet — add a story
 * back once one does, rather than inventing an unreviewed combination here.
 *
 * On its own story page, renders the button three times — Default, Hover,
 * Focus-visible — side by side (see `TokenStatePreview`), with the full
 * token table below. Embedded in the main Docs page's Canvas, renders just
 * the plain button — the Docs page lists every Button token statically
 * already, and doesn't need this repeated too.
 *
 * The play function below drives a real Focus (see the Interactions panel)
 * as a basic keyboard-accessibility check — it only verifies that focus
 * actually lands, not any resulting styling. Blurs again afterward so the
 * story settles back to its resting look rather than loading pre-focused.
 */
export const SolidRedOnWhite: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System?node-id=2017-339&t=4ghDRUE8AF5L7RhP-4',
    },
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    // Matched by accessible name, not just role: TokenTable's own per-row copy-to-clipboard
    // controls are also buttons, so a bare getByRole('button') would be ambiguous here.
    // There are 3 state previews (Default/Hover/Focus-visible) rendered from the same
    // `button` element reused 3 times, so this matches all 3 — a real Tab/focus check on
    // any of them is representative of the others.
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors the approved Figma frame "Solid Button Red w/ Cool Gray Background."
 * Same button, same tokens as `SolidRedOnWhite` — nothing about Button's own
 * component tokens changes here. The only difference is the surrounding page
 * background, so this story exists to confirm the button still reads
 * correctly against `az.color.brand.cloud` (#E5EFF7), not to introduce any
 * new token.
 */
export const SolidRedOnCoolGray: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System?node-id=2017-537&t=4ghDRUE8AF5L7RhP-4',
    },
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors the approved Figma frame "Solid Button Large Red w/ White
 * Background." Same tokens as `SolidRedOnWhite` for color/label/border —
 * only `az.component.button.size.lg.padding.*` and `.label.font.size` apply
 * instead of the base ones. `tokenFilter` stays the full wildcard so both
 * the base and `size.lg` tokens show together for comparison.
 */
export const SolidRedOnWhiteLarge: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System?node-id=2017-339&t=4ghDRUE8AF5L7RhP-4',
    },
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `SolidRedOnWhiteLarge`, on the Cool Gray background — same
 * relationship as `SolidRedOnCoolGray` to `SolidRedOnWhite`: only the page
 * background differs, nothing about Button's own tokens changes.
 */
export const SolidRedOnCoolGrayLarge: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System?node-id=2017-537&t=4ghDRUE8AF5L7RhP-4',
    },
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Fixed reference snapshots for the rest of the approved Solid Button /
 * background pairings from the Buttons & Links redlines — real Bootstrap
 * classes (`.btn-red`, `.btn-sky`, `.btn-white-text-red`,
 * `.btn-white-text-blue`), not routed through `Button`/`renderButton` since
 * their color values (`rain`, `white-text-red`, `white-text-blue`) aren't
 * part of that component's typed `color` prop yet. No dedicated
 * `az.component.*` tokens exist for these variants, so `TokenStatePreview`
 * is used without a `tokenFilter` (no token table, just the states).
 */
function ContextButton({ btnClass }: { btnClass: string }) {
  return (
    <a href="#" role="button" className={`btn ${btnClass}`}>
      Apply to Arizona
    </a>
  );
}

/**
 * Without a `parameters.implementations` entry, the docs `source.transform`
 * in `preview.ts` has nothing to read and falls back to dumping the raw
 * story source verbatim in the Code panel — confirmed directly: these
 * stories showed the literal `render: () => <TokenStatePreview ...>` object
 * instead of markup. This gives each one a real, copyable snippet instead,
 * matching what the tokenized stories already get via `implementations`.
 */
function contextButtonImplementations(bgClass: string, btnClass: string): Implementations<Record<string, never>> {
  const render = () => <ContextButton btnClass={btnClass} />;

  return {
    html: {
      render,
      source: () => `<div class="${bgClass}">\n  <a href="#" role="button" class="btn ${btnClass}">Apply to Arizona</a>\n</div>`,
    },
    react: {
      render,
      source: () => `<div className="${bgClass}">\n  <a href="#" role="button" className="btn ${btnClass}">\n    Apply to Arizona\n  </a>\n</div>`,
    },
  };
}

/**
 * Forces each state's look via Bootstrap's own per-button-class CSS custom
 * properties (`--bs-btn-hover-*`, `--az-btn-focus-outline-color`) — never a
 * literal color — so this works for any real `.btn-*` class without needing
 * to know what color it resolves to. Same state model as `BUTTON_STATES`
 * (focus-visible = hover look + ring; plain focus isn't a separate look),
 * just sourced from Bootstrap's variables instead of `az.component.button.*`
 * tokens, since these variants don't have their own tokens.
 */
const GENERIC_BOOTSTRAP_BUTTON_STATES: ButtonState[] = [
  { label: 'Default' },
  {
    label: 'Hover',
    css: `& .btn {
      color: var(--bs-btn-hover-color) !important;
      background-color: var(--bs-btn-hover-bg) !important;
      border-color: var(--bs-btn-hover-border-color) !important;
    }`,
  },
  {
    label: 'Focus-visible',
    css: `& .btn {
      color: var(--bs-btn-hover-color) !important;
      background-color: var(--bs-btn-hover-bg) !important;
      border-color: var(--bs-btn-hover-border-color) !important;
      outline: 2px solid var(--az-btn-focus-outline-color) !important;
      outline-offset: 2px;
    }`,
  },
];

export const SolidRedOnWarmGray: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-warm-gray', 'btn-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-warm-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const SolidWhiteTextRedOnAzRed: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-red', 'btn-white-text-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-red" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-white-text-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const SolidRainOnAzBlue: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-blue', 'btn-sky') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-blue" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-sky" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const SolidRainOnAzurite: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-azurite', 'btn-sky') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-azurite" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-sky" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const SolidWhiteTextBlueOnOasis: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-oasis', 'btn-white-text-blue') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-oasis" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-white-text-blue" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors the approved "Outline Button Red" frame (White Background board).
 * Routed through the real `Button`/`renderButton` component — `style:
 * 'outline'` is already a typed, supported prop, unlike the bootstrap-only
 * color variants above. Outline swaps which token-driven property becomes
 * the border/text color vs. the fill, so `GENERIC_BOOTSTRAP_BUTTON_STATES`
 * (Bootstrap's own `--bs-btn-hover-*` variables) is used for the state
 * preview rather than `BUTTON_STATES`, which assumes the solid style's
 * background-swap behavior specifically.
 */
export const OutlineRedOnWhite: Story = {
  args: {
    style: 'outline',
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={GENERIC_BOOTSTRAP_BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `OutlineRedOnWhite` on the Cool Gray background — same
 * relationship as `SolidRedOnCoolGray` to `SolidRedOnWhite`.
 */
export const OutlineRedOnCoolGray: Story = {
  args: {
    style: 'outline',
  },
  parameters: {
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `OutlineRedOnWhite` at the Large size — same relationship as
 * `SolidRedOnWhiteLarge` to `SolidRedOnWhite`.
 */
export const OutlineRedOnWhiteLarge: Story = {
  args: {
    style: 'outline',
    size: 'lg',
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={GENERIC_BOOTSTRAP_BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `OutlineRedOnCoolGray` at the Large size.
 */
export const OutlineRedOnCoolGrayLarge: Story = {
  args: {
    style: 'outline',
    size: 'lg',
  },
  parameters: {
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES} tokenFilter="az.component.button.**">
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Outline equivalents of the Solid Button / background pairings above —
 * same background set, same "which button color reads on this background"
 * logic, just outline style. Not routed through `Button`/`renderButton` for
 * the same reason as the Solid ones: `rain`/`white` aren't part of its typed
 * `color` prop.
 */
export const OutlineRedOnWarmGray: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-warm-gray', 'btn-outline-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-warm-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineWhiteOnAzRed: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-red', 'btn-outline-white') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-red" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-white" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineRainOnAzBlue: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-blue', 'btn-outline-sky') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-blue" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-sky" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineRainOnAzurite: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-azurite', 'btn-outline-sky') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-azurite" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-sky" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineWhiteOnOasis: Story = {
  parameters: { implementationsOverride: contextButtonImplementations('bg-oasis', 'btn-outline-white') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-oasis" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-white" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, step }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Apply to Arizona' });

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};
