import type { Meta, StoryObj } from '@storybook/react-vite';
import { componentStories } from '@az-digital/storybook-addon-libraries';
import type { AccordionProps } from '@az-digital/components-html';

const meta = {
  title: 'Primary/Components/Containers/Accordions',
  tags: ['lib:html', 'lib:react'],
  ...componentStories('accordion', { props: (args: AccordionProps): AccordionProps => args }),
  argTypes: {
    items: { control: 'object' },
    flush: { control: 'boolean' },
    alwaysOpen: { control: 'boolean' },
    anchors: { control: 'boolean' },
  },
  args: {
    id: 'accordion-example',
    items: [
      { title: 'Accordion Item #1', content: "This is the first item's accordion body.", defaultOpen: true },
      { title: 'Accordion Item #2', content: "This is the second item's accordion body." },
      { title: 'Accordion Item #3', content: "This is the third item's accordion body." },
    ],
    flush: false,
    alwaysOpen: false,
  },
} satisfies Meta<AccordionProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Mirrors Arizona Bootstrap's own "Example" — https://digital.arizona.edu/arizona-bootstrap/5.2/components/accordion/.
 * Only one item open at a time; opening an item collapses whichever sibling was open.
 */
export const Default: Story = {};

/** Removes borders/rounded corners to render edge-to-edge with its parent container. */
export const Flush: Story = {
  args: { id: 'accordion-flush-example', flush: true },
};

/** Omits `data-bs-parent` grouping so multiple items can stay open at the same time. */
export const AlwaysOpen: Story = {
  args: {
    id: 'accordion-always-open-example',
    alwaysOpen: true,
    items: [
      { title: 'Accordion Item #1', content: "This is the first item's accordion body.", defaultOpen: true },
      { title: 'Accordion Item #2', content: "This is the second item's accordion body." },
      { title: 'Accordion Item #3', content: "This is the third item's accordion body." },
    ],
  },
};

/**
 * Adds a "Copy link" control to each item. `alwaysOpen` here on purpose,
 * matching Arizona Bootstrap's own docs recommendation — with `data-bs-parent`
 * grouping, opening a linked item also collapses its sibling, which can read
 * as a stutter on a fresh page load. Click "Copy link" on any item, or load
 * this story with `#accordion-anchor-example-heading-1` (etc.) in the URL
 * hash to see the deep-link open+scroll behavior.
 */
export const Anchored: Story = {
  args: {
    id: 'accordion-anchor-example',
    alwaysOpen: true,
    anchors: true,
    items: [
      { title: 'Accordion Item #1', content: "This is the first item's accordion body.", defaultOpen: true },
      { title: 'Accordion Item #2', content: "This is the second item's accordion body." },
      { title: 'Accordion Item #3', content: "This is the third item's accordion body." },
    ],
  },
};
