import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement, useEffect } from 'react';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { useArgs } from 'storybook/preview-api';
import { Button } from '@az-digital/components-react';
import { renderButton } from '@az-digital/components-html';
// Registers <az-button>.
import '@az-digital/components-web';
import renderQuickstartButton from '@az-digital/components-quickstart/components/button/button.twig';
// The CSS Quickstart attaches with the component; same rules as the Storybook shim, with token fallbacks.
import '@az-digital/components-quickstart/components/button/button.css';
import type { ImplementationKey, Implementations } from '../../../implementations';
import { renderImplementation } from '../../../implementations';
import type { ButtonState } from '../../../TokenStatePreview';
import { TokenStatePreview } from '../../../TokenStatePreview';
import { resolveValue } from '@az-digital/storybook-addon-tokens';

// `background` is presentation-only (see `DocsControls`/`DocsControlsPreview`) — it wraps
// the rendered button in a page-background class, it isn't a real Button prop, so it's
// never passed through to `implementations`.
type ButtonArgs = Parameters<typeof renderButton>[0] & { text?: string; background?: string };

/**
 * `parameters.tokens` lists for the Tokens addon panel. Every Button shares
 * its structural tokens (label font, padding, border width/radius, disabled,
 * sizes). On light surfaces each style adds the focus-visible ring and its own
 * color group. Stories whose colors come from the surface they sit on
 * (white-text-red on AZ red, rain on AZ blue, ...) have no color tokens yet —
 * including the ring, which Arizona Bootstrap switches to white on those
 * surfaces — so they list only the structural ones.
 */
const STRUCTURAL_BUTTON_TOKENS = [
  'az.component.button.label.',
  'az.component.button.padding.',
  'az.component.button.border.',
  'az.component.button.disabled.',
  'az.component.button.size.',
];
const SOLID_BUTTON_TOKENS = [...STRUCTURAL_BUTTON_TOKENS, 'az.component.button.focus-visible.', 'az.component.button.solid.'];
const OUTLINE_BUTTON_TOKENS = [...STRUCTURAL_BUTTON_TOKENS, 'az.component.button.focus-visible.', 'az.component.button.outline.'];

/**
 * Figma designs for the Design tab (@storybook/addon-designs). Every story links
 * to its variants in the master "Buttons" component set of the AZ Digital UX
 * Design System file (Master Components - DO NOT EDIT), one per state the story
 * previews: Default, Hover, and Focus.
 */
const FIGMA_FILE = 'https://www.figma.com/design/IzegZqsNTeUar61NGRfIjw/AZ-Digital-UX-Design-System';
const figmaNode = (nodeId: string, name: string) => ({ type: 'figma' as const, name, url: `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}` });
const figmaStates = (defaultId: string, hoverId: string, focusId: string) => [
  figmaNode(defaultId, 'Default'),
  figmaNode(hoverId, 'Hover'),
  figmaNode(focusId, 'Focus'),
];
const BUTTON_DESIGNS = {
  set: figmaNode('2017:6282', 'Buttons (all variants)'),
  solidRed: figmaStates('2017:6281', '2019:6293', '2546:1534'),
  solidRedLarge: figmaStates('2017:6283', '2019:6295', '2546:1538'),
  outlineRed: figmaStates('2384:1115', '2384:1124', '2583:1556'),
  outlineRedLarge: figmaStates('2384:1118', '2384:1127', '2585:1563'),
  solidWhiteOnRed: figmaStates('2411:3552', '2411:3555', '2585:1578'),
  outlineWhiteOnRed: figmaStates('2411:3602', '2411:3605', '2585:1581'),
  solidRain: figmaStates('2411:2263', '2411:2266', '2585:1566'),
  outlineRain: figmaStates('2411:3509', '2411:3512', '2585:1569'),
  solidWhiteOnArroyoBlue: figmaStates('2423:3659', '2423:3664', '2588:1590'),
  outlineWhiteOnArroyoBlue: figmaStates('2423:3698', '2423:3700', '2588:1596'),
};

/**
 * Default/Hover/Focus-visible shown side by side, each recreating that
 * state's look directly from its own resolved token — not a live
 * `:hover`/`:focus-visible` test (there's no way to make all three
 * genuinely true at once across separate instances). Per the Figma Buttons
 * component, a focused solid button keeps its resting fill (see
 * `packages/tokens/AGENTS.md`); focus-visible adds the ring, the one property
 * exclusive to it.
 */
const SOLID_BUTTON_STATES: ButtonState[] = [
  { label: 'Default' },
  { label: 'Hover', css: `& .btn, & az-button::part(control) { background-color: ${resolveValue('az.component.button.solid.hover.container.color')} !important; }` },
  {
    label: 'Focus-visible',
    css: `& .btn, & az-button::part(control) {
      background-color: ${resolveValue('az.component.button.solid.focus.container.color')} !important;
      outline: 2px solid ${resolveValue('az.component.button.focus-visible.ring')} !important;
      outline-offset: 2px;
    }`,
  },
];

/**
 * Same state model as `SOLID_BUTTON_STATES`, from the `outline.*` tokens:
 * an outline button fills on hover/focus, so container, border, and label
 * all change together instead of just the fill.
 *
 * Both state lists also target `az-button::part(control)`: `.btn` can't reach
 * inside the web component's shadow root, but its exposed part can be styled.
 */
const OUTLINE_BUTTON_STATES: ButtonState[] = [
  { label: 'Default' },
  {
    label: 'Hover',
    css: `& .btn, & az-button::part(control) {
      color: ${resolveValue('az.component.button.outline.hover.label.color')} !important;
      background-color: ${resolveValue('az.component.button.outline.hover.container.color')} !important;
      border-color: ${resolveValue('az.component.button.outline.hover.border.color')} !important;
    }`,
  },
  {
    label: 'Focus-visible',
    css: `& .btn, & az-button::part(control) {
      color: ${resolveValue('az.component.button.outline.focus.label.color')} !important;
      background-color: ${resolveValue('az.component.button.outline.focus.container.color')} !important;
      border-color: ${resolveValue('az.component.button.outline.focus.border.color')} !important;
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

/**
 * `<az-button>` shown in the docs code panel when Implementation is set to Web
 * Components. Its API differs from the others in two places (see `AzButton`):
 * `variant` stands in for `style`, and `href` alone picks a link over a button.
 */
const webAttributes = (args: ButtonArgs) => ({
  variant: args.style,
  color: args.color,
  size: args.size,
  href: args.htmlTag === 'button' ? undefined : (args.href ?? '#'),
  disabled: args.disabled,
  active: args.active,
});

const asWebCode = (args: ButtonArgs) => {
  const { variant, color, size, href, disabled, active } = webAttributes(args);
  const attributes: string[] = [];

  if (variant && variant !== 'solid') attributes.push(`variant="${variant}"`);
  if (color && color !== 'red') attributes.push(`color="${color}"`);
  if (size) attributes.push(`size="${size}"`);
  if (href) attributes.push(`href="${href}"`);
  if (disabled) attributes.push('disabled');
  if (active) attributes.push('active');

  const attributesString = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';

  return `<az-button${attributesString}>${args.text ?? 'Learn More'}</az-button>`;
};

/** Props for the `az_quickstart:button` single directory component: the shared API in Drupal's snake_case. */
const quickstartProps = (args: ButtonArgs) => ({
  text: args.text,
  href: args.href,
  style: args.style,
  color: args.color,
  size: args.size,
  html_tag: args.htmlTag,
  disabled: args.disabled,
  active: args.active,
});

/** Twig include shown in the docs code panel when Implementation is set to Arizona Quickstart. */
const asQuickstartCode = (args: ButtonArgs) => {
  const props = quickstartProps(args);
  const defaults: Record<string, unknown> = { style: 'solid', color: 'red', html_tag: 'a', disabled: false, active: false };
  const lines = Object.entries(props)
    .filter(([key, value]) => value !== undefined && value !== '' && value !== defaults[key])
    .map(([key, value]) => `  ${key}: ${typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : value},`);

  return `{% include 'az_quickstart:button' with {\n${lines.join('\n')}\n} only %}`;
};

/** Button has every implementation. A component that only needs some omits the other keys entirely. */
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
  web: {
    render: (args) => createElement('az-button', webAttributes(args), args.text),
    source: asWebCode,
  },
  quickstart: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderQuickstartButton(quickstartProps(args)) }} />,
    source: asQuickstartCode,
  },
};

/**
 * For a story whose approved Figma frame shows a non-white page background:
 * wraps each implementation's Code-panel source in a real utility class
 * (e.g. `bg-cool-gray`, Arizona Bootstrap's class for Cloud) so the copyable example matches what the frame
 * actually needs. A white background isn't shown this way — it's the
 * implicit default a page already has, so noting it in every example would
 * just be noise.
 */
/** Indents every line after the first, for nesting a multi-line snippet (e.g. a Twig include) in a wrapper. */
const indent = (code: string) => code.replace(/\n/g, '\n  ');

function withBackgroundClassSource(bgClass: string, base: Implementations<ButtonArgs>): Implementations<ButtonArgs> {
  const wrapped: Implementations<ButtonArgs> = {};

  for (const key of Object.keys(base) as ImplementationKey[]) {
    const entry = base[key];
    if (!entry) continue;

    wrapped[key] = {
      ...entry,
      source:
        key === 'react'
          ? (args) => `<div className="${bgClass}">\n  ${indent(entry.source(args))}\n</div>`
          : (args) => `<div class="${bgClass}">\n  ${indent(entry.source(args))}\n</div>`,
    };
  }

  return wrapped;
}

/**
 * The button a story's play function focuses. Role queries don't search shadow
 * roots, so with Implementation set to Web Components this finds the
 * `<az-button>` host instead: focusing it delegates to its inner control, and
 * the host then reports focus.
 */
function getButton(canvas: { getAllByRole: (role: string, options: { name: string }) => HTMLElement[] }, canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector<HTMLElement>('az-button') ?? canvas.getAllByRole('button', { name: 'Apply to Arizona' })[0];
}

function ButtonStory(args: ButtonArgs, context: StoryContext) {
  return renderImplementation('Button', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; ButtonStory itself also takes a `context` param, which Meta<T> doesn't expect
function ButtonArgsShape(_args: ButtonArgs) {
  return null;
}

const meta = {
  title: 'Primary/Components/Buttons',
  // Set only so react-docgen can attach Button's prop table to this story file's
  // documentation (see the Storybook MCP addon-mcp component manifest) — rendering
  // itself always goes through `render: ButtonStory` below. Must stay a bare reference
  // to the imported `Button`: the manifest builder statically resolves `meta.component`
  // back to its import declaration, so a cast or local alias here breaks that lookup
  // ("No component import found").
  component: Button,
  render: ButtonStory,
  argTypes: {
    // Every option below must have at least one approved story backing it — `htmlTag` is the
    // one exception: 'a' vs 'button' is a semantic/markup choice with no visual difference, so
    // it isn't a "design decision" a Figma frame would ever distinguish or need to approve.
    htmlTag: { control: 'radio', options: ['a', 'button'] },
    // 'link' removed: no story demonstrates it.
    style: { control: 'radio', options: ['solid', 'outline'] },
    color: { control: 'radio', options: ['red', 'white', 'blue', 'rain'] },
    // 'sm' removed: no story demonstrates a small size, only the Large variants.
    size: { control: 'radio', options: [undefined, 'lg'] },
    // Not a real Button prop (see the `ButtonArgs` comment above) — Storybook infers a
    // control for any arg by default, so this has to be explicitly hidden from the table.
    background: { table: { disable: true } },
  },
  args: {
    htmlTag: 'a',
    style: 'solid',
    color: 'red',
    text: 'Apply to Arizona',
  },
  parameters: {
    implementations,
    // Tokens addon panel (@az-digital/storybook-addon-tokens): solid is the default
    // `style`, so stories list the solid tokens unless they override this.
    tokens: SOLID_BUTTON_TOKENS,
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
 * Powers the Docs page's Controls table only — `tags: ['!dev']` excludes it
 * from the sidebar, so it doesn't clutter the list of real, approved
 * variants below. Controls only produces live updates when bound to the
 * same story the Canvas renders, and a second live `<Canvas>` on this docs
 * page doesn't work correctly in this Storybook version (see
 * `packages/storybook/AGENTS.md`) — so the Docs page's Canvas embeds this
 * story too, not `SolidRedOnWhite` directly, keeping that one fully locked
 * (Controls disabled) on its own page. Default args exactly match
 * `SolidRedOnWhite` (`red`/`solid`/`a`/"Apply to Arizona"), so the Docs page
 * still shows the identical approved combination by default.
 *
 * Exported FIRST, before every other story — confirmed directly (via
 * `anchor--`/`story--` element IDs in the rendered DOM) that this docs
 * page's Canvas always renders the first-exported story regardless of what
 * a `<Canvas><Story of={X}/></Canvas>` block's `of=` points at, the same
 * underlying bug behind the "second Canvas" limitation in
 * `packages/storybook/AGENTS.md`. A separate MCP documentation tool
 * (`az-digital-storybook`) fails to index this file ("Unable to index
 * ./stories/button.mdx") independent of this story's position — confirmed
 * by reverting the reorder and seeing the same error persist — so that
 * error is not a reason to avoid keeping this first.
 */
/**
 * Which backgrounds are offered depends on the selected `color` — only combinations an
 * approved story actually demonstrates. `red` mirrors SolidRedOnWhite/Cloud/Caliche;
 * `rain` mirrors SolidRainOnAzBlue/Azurite. `white`/`blue` have no approved-story
 * background pairing yet, so they only offer the plain white default.
 */
const COLOR_BACKGROUND_OPTIONS: Record<string, { value: string; label: string }[]> = {
  red: [
    { value: 'none', label: 'White' },
    { value: 'bg-cool-gray', label: 'Cloud' },
    { value: 'bg-warm-gray', label: 'Caliche' },
  ],
  rain: [
    { value: 'bg-blue', label: 'Az Blue' },
    { value: 'bg-azurite', label: 'Azurite' },
  ],
};
const DEFAULT_BACKGROUND_OPTIONS = [{ value: 'none', label: 'White' }];

/**
 * Backed by the story's own `background` arg (via Storybook's `useArgs`), not local
 * `useState` — args round-trip through the URL automatically, so a chosen background is
 * part of a shareable link the same way `color`/`style`/etc already are. No `argTypes`
 * entry, so it never shows up as a Controls-table row. Purely presentational otherwise:
 * takes the already-rendered `button` element and plain string props, not the raw
 * Storybook `context` — passing `context` itself through as a prop caused a real "Maximum
 * call stack size exceeded" crash (its internals aren't a plain serializable object).
 */
function DocsControlsPreview({
  button,
  color,
  background,
  onBackgroundChange,
}: {
  button: ReactNode;
  color?: string;
  background: string;
  onBackgroundChange: (value: string) => void;
}) {
  const options = (color && COLOR_BACKGROUND_OPTIONS[color]) || DEFAULT_BACKGROUND_OPTIONS;
  const isValid = options.some((option) => option.value === background);
  const value = isValid ? background : options[0].value;

  useEffect(() => {
    if (!isValid) {
      onBackgroundChange(options[0].value);
    }
  }, [color, background]);

  return (
    <div>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          color: '#666',
        }}
      >
        Background
        <select
          value={value}
          onChange={(event) => onBackgroundChange(event.target.value)}
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: '0.25rem',
            background: '#fff',
            color: '#333',
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      {value === 'none' ? button : (
        <div className={value} style={{ padding: '2rem' }}>
          {button}
        </div>
      )}
    </div>
  );
}

export const DocsControls: Story = {
  tags: ['!dev'],
  args: {
    background: 'none',
  },
  parameters: {
    design: BUTTON_DESIGNS.set,
    controls: { disable: false },
  },
  render: (args, context) => {
    const [, updateArgs] = useArgs<ButtonArgs>();

    return (
      <DocsControlsPreview
        button={renderImplementation('Button', implementations, args, context)}
        color={args.color}
        background={args.background ?? 'none'}
        onBackgroundChange={(value) => updateArgs({ background: value })}
      />
    );
  },
};

/**
 * Mirrors the approved Figma frame "Solid Button Red w/ White Background."
 * This is the only Button story right now: Outline, Blue, and Disabled are
 * all still fully supported by the component, they just don't have an
 * approved Figma frame to mirror yet — add a story back once one does,
 * rather than inventing an unreviewed combination here.
 *
 * On its own story page, renders the button three times — Default, Hover,
 * Focus-visible — side by side (see `TokenStatePreview`), with the full
 * token catalog below. Embedded in the main Docs page's Canvas, renders just
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
    design: BUTTON_DESIGNS.solidRed,
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={SOLID_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    // There are 3 state previews (Default/Hover/Focus-visible) rendered from the same
    // `button` element reused 3 times, so a real Tab/focus check on the first one is
    // representative of the others.
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors the approved Figma frame "Solid Button Red w/ Cool Gray Background"
 * (Cool Gray is Cloud's old name).
 * Same button, same tokens as `SolidRedOnWhite` — nothing about Button's own
 * component tokens changes here. The only difference is the surrounding page
 * background, so this story exists to confirm the button still reads
 * correctly against `az.color.brand.cloud` (#e5eff7), not to introduce any
 * new token.
 */
export const SolidRedOnCloud: Story = {
  parameters: {
    design: BUTTON_DESIGNS.solidRed,
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={SOLID_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

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
 * instead of the base ones. The Tokens panel lists the full
 * `az.component.button.` group, so the base and `size.lg` tokens show
 * together for comparison.
 */
export const SolidRedOnWhiteLarge: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    design: BUTTON_DESIGNS.solidRedLarge,
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={SOLID_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `SolidRedOnWhiteLarge`, on the Cloud background — same
 * relationship as `SolidRedOnCloud` to `SolidRedOnWhite`: only the page
 * background differs, nothing about Button's own tokens changes.
 */
export const SolidRedOnCloudLarge: Story = {
  args: {
    size: 'lg',
  },
  parameters: {
    design: BUTTON_DESIGNS.solidRedLarge,
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={SOLID_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

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
 * classes (`.btn-red`, `.btn-white-text-red`, `.btn-white-text-blue`), not
 * routed through `Button`/`renderButton` since their color values
 * (`white-text-red`, `white-text-blue`) aren't part of that component's
 * typed `color` prop. Caliche is a light surface using plain `.btn-red` /
 * `.btn-outline-red`, so those stories list that style's tokens. The other
 * pairings' colors depend on the surface they sit on, which has no tokens
 * yet, so they list only `STRUCTURAL_BUTTON_TOKENS`.
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
 * to know what color it resolves to. It follows Bootstrap's state model
 * (focus-visible = hover look + ring), sourced from Bootstrap's variables
 * because these variants don't have `az.component.button.*` tokens yet.
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

/**
 * Shown in place of the actual button for stories whose `color` has no CSS
 * yet in Arizona Bootstrap (currently just `rain`) — mirrors
 * `ImplementationPlaceholder` in `implementations.tsx`, which does the same
 * thing for a missing html/react implementation.
 */
function ColorNotImplementedPlaceholder({ color }: { color: string }) {
  return (
    <div style={{ padding: '1rem', border: '1px dashed #999', borderRadius: '0.5rem', maxWidth: '32rem' }}>
      <p style={{ margin: 0 }}>
        Button doesn&rsquo;t have a <code>{color}</code> color implemented yet.
      </p>
    </div>
  );
}

export const SolidRedOnCaliche: Story = {
  parameters: { design: BUTTON_DESIGNS.solidRed, tokens: SOLID_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-warm-gray', 'btn-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-warm-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const SolidWhiteTextRedOnAzRed: Story = {
  parameters: { design: BUTTON_DESIGNS.solidWhiteOnRed, tokens: STRUCTURAL_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-red', 'btn-white-text-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-red" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-white-text-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * `color: 'rain'` — the real `Button`/`renderButton` component, not the
 * `ContextButton` bypass: 'rain' is a real, supported `color` value now,
 * generating `btn-rain`/`btn-outline-rain` directly, so there's no more
 * reason to hardcode a class name here. That CSS doesn't exist yet in
 * Arizona Bootstrap — see the `ButtonColor` doc comment in `Button.tsx`.
 */
export const SolidRainOnAzBlue: Story = {
  args: {
    color: 'rain',
  },
  parameters: {
    design: BUTTON_DESIGNS.solidRain,
    tokens: STRUCTURAL_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-blue', implementations),
  },
  render: (args, context) => {
    if (context.viewMode !== 'story') {
      return renderImplementation('Button', implementations, args, context);
    }

    return (
      <div className="text-bg-blue" style={{ padding: '2rem' }}>
        <ColorNotImplementedPlaceholder color="rain" />
      </div>
    );
  },
};

export const SolidRainOnAzurite: Story = {
  args: {
    color: 'rain',
  },
  parameters: {
    design: BUTTON_DESIGNS.solidRain,
    tokens: STRUCTURAL_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-azurite', implementations),
  },
  render: (args, context) => {
    if (context.viewMode !== 'story') {
      return renderImplementation('Button', implementations, args, context);
    }

    return (
      <div className="text-bg-azurite" style={{ padding: '2rem' }}>
        <ColorNotImplementedPlaceholder color="rain" />
      </div>
    );
  },
};

export const SolidWhiteTextBlueOnArroyoBlue: Story = {
  parameters: { design: BUTTON_DESIGNS.solidWhiteOnArroyoBlue, tokens: STRUCTURAL_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-oasis', 'btn-white-text-blue') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-oasis" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-white-text-blue" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

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
 * the border/text color vs. the fill, so the state preview uses
 * `OUTLINE_BUTTON_STATES` (the `outline.*` tokens) rather than
 * `SOLID_BUTTON_STATES`, which only swaps the fill.
 */
export const OutlineRedOnWhite: Story = {
  args: {
    style: 'outline',
  },
  parameters: {
    design: BUTTON_DESIGNS.outlineRed,
    tokens: OUTLINE_BUTTON_TOKENS,
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={OUTLINE_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `OutlineRedOnWhite` on the Cloud background — same
 * relationship as `SolidRedOnCloud` to `SolidRedOnWhite`.
 */
export const OutlineRedOnCloud: Story = {
  args: {
    style: 'outline',
  },
  parameters: {
    design: BUTTON_DESIGNS.outlineRed,
    tokens: OUTLINE_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={OUTLINE_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

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
  parameters: {
    design: BUTTON_DESIGNS.outlineRedLarge,
    tokens: OUTLINE_BUTTON_TOKENS,
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-white" states={OUTLINE_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

/**
 * Mirrors `OutlineRedOnCloud` at the Large size.
 */
export const OutlineRedOnCloudLarge: Story = {
  args: {
    style: 'outline',
    size: 'lg',
  },
  parameters: {
    design: BUTTON_DESIGNS.outlineRedLarge,
    tokens: OUTLINE_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-cool-gray', implementations),
  },
  render: (args, context) => {
    const button = renderImplementation('Button', implementations, args, context);

    if (context.viewMode !== 'story') {
      return button;
    }

    return (
      <TokenStatePreview pageBackgroundClassName="bg-cool-gray" states={OUTLINE_BUTTON_STATES}>
        {button}
      </TokenStatePreview>
    );
  },
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

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
export const OutlineRedOnCaliche: Story = {
  parameters: { design: BUTTON_DESIGNS.outlineRed, tokens: OUTLINE_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-warm-gray', 'btn-outline-red') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-warm-gray" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-red" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineWhiteOnAzRed: Story = {
  parameters: { design: BUTTON_DESIGNS.outlineWhiteOnRed, tokens: STRUCTURAL_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-red', 'btn-outline-white') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-red" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-white" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};

export const OutlineRainOnAzBlue: Story = {
  args: {
    style: 'outline',
    color: 'rain',
  },
  parameters: {
    design: BUTTON_DESIGNS.outlineRain,
    tokens: STRUCTURAL_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-blue', implementations),
  },
  render: (args, context) => {
    if (context.viewMode !== 'story') {
      return renderImplementation('Button', implementations, args, context);
    }

    return (
      <div className="text-bg-blue" style={{ padding: '2rem' }}>
        <ColorNotImplementedPlaceholder color="rain" />
      </div>
    );
  },
};

export const OutlineRainOnAzurite: Story = {
  args: {
    style: 'outline',
    color: 'rain',
  },
  parameters: {
    design: BUTTON_DESIGNS.outlineRain,
    tokens: STRUCTURAL_BUTTON_TOKENS,
    implementationsOverride: withBackgroundClassSource('bg-azurite', implementations),
  },
  render: (args, context) => {
    if (context.viewMode !== 'story') {
      return renderImplementation('Button', implementations, args, context);
    }

    return (
      <div className="text-bg-azurite" style={{ padding: '2rem' }}>
        <ColorNotImplementedPlaceholder color="rain" />
      </div>
    );
  },
};

export const OutlineWhiteOnArroyoBlue: Story = {
  parameters: { design: BUTTON_DESIGNS.outlineWhiteOnArroyoBlue, tokens: STRUCTURAL_BUTTON_TOKENS, implementationsOverride: contextButtonImplementations('bg-oasis', 'btn-outline-white') },
  render: () => (
    <TokenStatePreview pageBackgroundClassName="bg-oasis" states={GENERIC_BOOTSTRAP_BUTTON_STATES}>
      <ContextButton btnClass="btn-outline-white" />
    </TokenStatePreview>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const button = getButton(canvas, canvasElement);

    await step('Focus: button should receive keyboard focus', async () => {
      button.focus();
      await expect(button).toHaveFocus();
    });

    button.blur();
  },
};
