import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Tabs } from '@az-digital/components-react';
import { renderTabs } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

type TabsArgs = Parameters<typeof renderTabs>[0];

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: TabsArgs) => {
  const props: string[] = [];

  if (args.id && args.id !== 'tabs') props.push(`id="${args.id}"`);
  if (args.variant && args.variant !== 'tabs') props.push(`variant="${args.variant}"`);
  if (args.defaultActiveIndex) props.push(`defaultActiveIndex={${args.defaultActiveIndex}}`);
  if (args.vertical) props.push('vertical');
  if (args.fill) props.push('fill');
  if (args.justify) props.push('justify');

  const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
  const itemsString = JSON.stringify(args.items, null, 2);

  return `<Tabs${propsString} items={${itemsString}} />`;
};

const implementations: Implementations<TabsArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderTabs(args) }} />,
    source: (args) => renderTabs(args),
  },
  react: {
    render: (args) => createElement(Tabs, args),
    source: asReactCode,
  },
};

function TabsStory(args: TabsArgs, context: StoryContext) {
  return renderImplementation('Tabs', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; TabsStory itself also takes a `context` param, which Meta<T> doesn't expect
function TabsArgsShape(_args: TabsArgs) {
  return null;
}

const meta = {
  title: 'Components/Tabs',
  // Set only so react-docgen can attach Tabs's prop table to this story file's
  // documentation — see the equivalent comment in button.stories.tsx for why this
  // must stay a bare reference to the imported `Tabs`.
  component: Tabs,
  render: TabsStory,
  argTypes: {
    items: { control: 'object' },
    variant: { control: 'radio', options: ['tabs', 'pills', 'underline'] },
    vertical: { control: 'boolean' },
    fill: { control: 'boolean' },
    justify: { control: 'boolean' },
  },
  args: {
    id: 'tabs-example',
    items: [
      { title: 'Home', content: 'This is the Home tab’s content.' },
      { title: 'Profile', content: 'This is the Profile tab’s content.' },
      { title: 'Contact', content: 'This is the Contact tab’s content.' },
      { title: 'Disabled', content: 'This is the Disabled tab’s content.', disabled: true },
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
} satisfies Omit<Meta<typeof TabsArgsShape>, 'component'> & { component?: typeof Tabs };

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mirrors Arizona Bootstrap's own "JavaScript behavior" example —
 * https://digital.arizona.edu/arizona-bootstrap/5.2/components/navs-tabs/.
 */
export const Default: Story = {};

/** `.nav-pills` instead of `.nav-tabs`. */
export const Pills: Story = {
  args: { id: 'tabs-pills-example', variant: 'pills' },
};

/** `.nav-underline` instead of `.nav-tabs`. */
export const Underline: Story = {
  args: { id: 'tabs-underline-example', variant: 'underline' },
};

/**
 * Mirrors Arizona Bootstrap's own vertical-pills JavaScript-behavior example —
 * a `d-flex align-items-start` wrapper, `flex-column` on the tablist, and
 * `aria-orientation="vertical"`. Genuinely upstream Bootstrap behavior (not
 * Arizona-specific), and the same dynamic tabbed component as every story
 * above — just laid out vertically. Not the same thing as the docs' separate
 * "Vertical Pills" example, which is Arizona-custom, static nested nav
 * markup with no tab-content panels at all — see tabs.mdx.
 */
export const Vertical: Story = {
  args: { id: 'tabs-vertical-example', variant: 'pills', vertical: true },
};

/** `.nav-fill` — proportionately fills the available width; item widths vary with content. */
export const Fill: Story = {
  args: {
    id: 'tabs-fill-example',
    variant: 'pills',
    fill: true,
    items: [
      { title: 'Home', content: 'This is the Home tab’s content.' },
      { title: 'A much longer nav link', content: 'This is the second tab’s content.' },
      { title: 'Link', content: 'This is the third tab’s content.' },
      { title: 'Disabled', content: 'This is the Disabled tab’s content.', disabled: true },
    ],
  },
};

/** `.nav-justified` — every item is forced to the same width. */
export const Justified: Story = {
  args: {
    id: 'tabs-justified-example',
    variant: 'pills',
    justify: true,
    items: [
      { title: 'Home', content: 'This is the Home tab’s content.' },
      { title: 'A much longer nav link', content: 'This is the second tab’s content.' },
      { title: 'Link', content: 'This is the third tab’s content.' },
      { title: 'Disabled', content: 'This is the Disabled tab’s content.', disabled: true },
    ],
  },
};
