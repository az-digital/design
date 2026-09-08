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
