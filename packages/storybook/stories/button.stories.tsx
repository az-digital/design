import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Button } from '@az-digital/components-react';
import { renderButton } from '@az-digital/components-web';

type ButtonArgs = Parameters<typeof renderButton>[0] & { text?: string };

/** `@az-digital/components-web` reference markup, rendered as raw HTML. */
function ButtonHtml(args: ButtonArgs) {
  return <div dangerouslySetInnerHTML={{ __html: renderButton(args) }} />;
}

/**
 * Renders the HTML or React implementation depending on the toolbar's
 * Implementation switcher. Branching here (rather than in a decorator) keeps
 * Storybook's auto source-capture in sync too, since it re-invokes this same
 * render function with the current globals to generate the docs code panel.
 */
function ButtonStory(args: ButtonArgs, context: StoryContext) {
  if (context.globals.implementation === 'react') {
    return createElement(
      Button,
      {
        htmlTag: args.htmlTag,
        href: args.href,
        style: args.style,
        color: args.color,
        size: args.size,
        disabled: args.disabled,
        active: args.active,
      },
      args.text,
    );
  }

  return <ButtonHtml {...args} />;
}

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
    // Matches the toolbar's Implementation switcher: HTML shows the generated
    // markup, React shows the equivalent JSX. Kept in sync with live control
    // changes via `.storybook/preview.ts`'s `docs.source.transform`.
    htmlSource: (args: ButtonArgs) => renderButton(args),
    reactSource: asReactCode,
  },
} satisfies Meta<typeof ButtonArgsShape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { style: 'outline' },
};

export const Blue: Story = {
  args: { color: 'blue' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
