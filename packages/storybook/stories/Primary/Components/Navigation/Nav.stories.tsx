import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { NavProps } from '@az-digital/components-html';

const meta = {
  title: 'Primary/Components/Navigation/Nav',
  tags: ['lib:html', 'lib:react'],
  ...componentStories('nav', { props: (args: NavProps): NavProps => args }),
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
} satisfies Meta<NavProps>;

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
