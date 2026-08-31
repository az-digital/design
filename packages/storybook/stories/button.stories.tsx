import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Button } from '@az-digital/components-react';
import { renderButton } from '@az-digital/components-html';
import { TokenTable } from '@unpunnyfuns/swatchbook-addon';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

type ButtonArgs = Parameters<typeof renderButton>[0] & { text?: string };

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
          // 'success' is html-only (see ButtonColor in components-html) and never
          // reaches this branch in practice — successOnlyImplementations has no
          // `react` entry — but narrow here so this stays valid against React's
          // narrower ButtonColor regardless.
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

/** HTML-only: `success` is Bootstrap's stock semantic color, not an Arizona brand color, and components-react's Button doesn't support it yet. */
const successOnlyImplementations: Implementations<ButtonArgs> = {
  html: implementations.html,
};

function ButtonStory(args: ButtonArgs, context: StoryContext) {
  // A story can fully replace which implementations apply via
  // `parameters.implementationsOverride` (see the `Success` story below) —
  // NOT `parameters.implementations` itself, since Storybook deep-merges
  // `parameters` objects, so overriding that same key would merge into the
  // meta-level map instead of replacing it. Falls back to the shared map
  // otherwise. Keep this in sync with the transform in `.storybook/preview.ts`.
  const activeImplementations = (context.parameters.implementationsOverride as Implementations<ButtonArgs> | undefined) ?? implementations;
  return renderImplementation('Button', activeImplementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; ButtonStory itself also takes a `context` param, which Meta<T> doesn't expect
function ButtonArgsShape(_args: ButtonArgs) {
  return null;
}

const meta = {
  title: 'Components/Button',
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
    text: 'Learn More',
  },
  parameters: {
    implementations,
  },
} satisfies Meta<typeof ButtonArgsShape>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The only story with a matching Figma frame so far — "Solid Button Red w/
 * White Background". Other stories (Outline, Blue, Disabled, Success) don't
 * have their own frame yet, so they intentionally have no `design` parameter
 * rather than inheriting this one.
 */
export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/oQrpx1TVKc7b2TIAn1fFb1/Arizona-Bootstrap-Buttons-Spec?node-id=3-2',
    },
  },
};

export const Outline: Story = {
  args: { style: 'outline' },
};

export const Blue: Story = {
  args: { color: 'blue' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * `success` only exists in `@az-digital/components-html` — it's Bootstrap's
 * stock semantic color, not an Arizona brand color, so there's no matching
 * React implementation (or component token) yet. Switching the toolbar's
 * Implementation to React shows the "doesn't have a react implementation
 * yet" placeholder instead of rendering, since this story's `implementations`
 * map only has an `html` entry.
 */
export const Success: Story = {
  args: { color: 'success' },
  parameters: { implementationsOverride: successOnlyImplementations },
};

/**
 * The design tokens Button is built from — `az.component.button.*`. Colors
 * alias to the brand tokens; everything else (padding, font, border,
 * disabled opacity, size overrides) is hard-coded to Arizona Bootstrap's
 * real values, since there's no base/semantic tier for those yet. If
 * Button's props or variants ever change, this list is the place to add or
 * update the corresponding component token.
 */
export const Tokens: Story = {
  render: () => <TokenTable filter="az.component.button.**" />,
};
