import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { TabsProps } from '@az-digital/components-html';

const meta = {
  title: 'Primary/Components/Containers/Tabs',
  tags: ['lib:html', 'lib:react'],
  ...componentStories('tabs', { props: (args: TabsProps): TabsProps => args }),
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
} satisfies Meta<TabsProps>;

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
 * markup with no tab-content panels at all — see Tabs.mdx.
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
