import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Nav } from '@az-digital/components-react';
import { renderNav } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

type NavArgs = Parameters<typeof renderNav>[0];

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: NavArgs) => {
  const props: string[] = [];

  if (args.variant) props.push(`variant="${args.variant}"`);
  if (args.vertical) props.push('vertical');
  if (args.fill) props.push('fill');
  if (args.justify) props.push('justify');

  const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
  const itemsString = JSON.stringify(args.items, null, 2);

  return `<Nav${propsString} items={${itemsString}} />`;
};

const implementations: Implementations<NavArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderNav(args) }} />,
    source: (args) => renderNav(args),
  },
  react: {
    render: (args) => createElement(Nav, args),
    source: asReactCode,
  },
};

function NavStory(args: NavArgs, context: StoryContext) {
  return renderImplementation('Nav', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; NavStory itself also takes a `context` param, which Meta<T> doesn't expect
function NavArgsShape(_args: NavArgs) {
  return null;
}

const meta = {
  title: 'Components/Nav',
  // Set only so react-docgen can attach Nav's prop table to this story file's
  // documentation — see the equivalent comment in button.stories.tsx for why this
  // must stay a bare reference to the imported `Nav`.
  component: Nav,
  render: NavStory,
  argTypes: {
    items: { control: 'object' },
    variant: { control: 'radio', options: [undefined, 'tabs', 'pills', 'underline', 'utility'] },
    vertical: { control: 'boolean' },
    fill: { control: 'boolean' },
    justify: { control: 'boolean' },
  },
  args: {
    items: [
      { label: 'Active', href: '#', active: true },
      { label: 'Link', href: '#' },
      { label: 'Link', href: '#' },
      { label: 'Disabled', disabled: true },
    ],
  },
  parameters: {
    implementations,
    // Every story here relies on the meta-level custom `render`, so Storybook's
    // default ('auto') Code-panel behavior would fall back to static story source
    // instead of running `docs.source.transform` — see the equivalent comment in
    // button.stories.tsx. 'dynamic' forces the Code panel through the transform.
    docs: { source: { type: 'dynamic' } },
  },
} satisfies Omit<Meta<typeof NavArgsShape>, 'component'> & { component?: typeof Nav };

export default meta;
type Story = StoryObj<typeof meta>;

/** Mirrors Arizona Bootstrap's own "Base nav" example — the bare, unstyled `.nav`. */
export const Default: Story = {};

/** `.nav-pills`. */
export const Pills: Story = {
  args: { variant: 'pills' },
};

/** `.nav.flex-column` — stacks items in a column. */
export const Vertical: Story = {
  args: { vertical: true },
};

/**
 * Confirmed Arizona-custom in the real docs ("Custom Arizona Bootstrap
 * Styling"). Nested items only render one level of `<ul>` deeper than their
 * parent `<li>` — this story nests three levels to match Arizona Bootstrap's
 * own "Vertical Pills" example.
 */
export const VerticalPills: Story = {
  args: {
    variant: 'pills',
    vertical: true,
    items: [
      { label: 'Link', href: '#' },
      {
        label: 'Link with sub-items',
        href: '#',
        items: [
          { label: 'Sub-item', href: '#' },
          {
            label: 'Active sub-item',
            href: '#',
            active: true,
            items: [
              { label: 'Third-level item', href: '#' },
              { label: 'Third-level item', href: '#' },
            ],
          },
          { label: 'Sub-item', href: '#' },
        ],
      },
      { label: 'Link', href: '#' },
      { label: 'Disabled', disabled: true },
    ],
  },
};

/** Confirmed Arizona-custom in the real docs — a muted appearance for secondary/utility links. */
export const UtilityLinks: Story = {
  args: { variant: 'utility' },
};

/** `.nav-fill` — proportionately fills the available width; item widths vary with content. */
export const Fill: Story = {
  args: {
    variant: 'pills',
    fill: true,
    items: [
      { label: 'Active', href: '#', active: true },
      { label: 'Much longer nav link', href: '#' },
      { label: 'Link', href: '#' },
      { label: 'Disabled', disabled: true },
    ],
  },
};

/** `.nav-justified` — every item is forced to the same width. */
export const Justified: Story = {
  args: {
    variant: 'pills',
    justify: true,
    items: [
      { label: 'Active', href: '#', active: true },
      { label: 'Much longer nav link', href: '#' },
      { label: 'Link', href: '#' },
      { label: 'Disabled', disabled: true },
    ],
  },
};
