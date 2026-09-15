import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { Accordion } from '@az-digital/components-react';
import { renderAccordion } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

type AccordionArgs = Parameters<typeof renderAccordion>[0];

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: AccordionArgs) => {
  const props: string[] = [];

  if (args.id && args.id !== 'accordion') props.push(`id="${args.id}"`);
  if (args.flush) props.push('flush');
  if (args.alwaysOpen) props.push('alwaysOpen');

  const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
  const itemsString = JSON.stringify(args.items, null, 2);

  return `<Accordion${propsString} items={${itemsString}} />`;
};

const implementations: Implementations<AccordionArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderAccordion(args) }} />,
    source: (args) => renderAccordion(args),
  },
  react: {
    render: (args) => createElement(Accordion, args),
    source: asReactCode,
  },
};

function AccordionStory(args: AccordionArgs, context: StoryContext) {
  return renderImplementation('Accordion', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; AccordionStory itself also takes a `context` param, which Meta<T> doesn't expect
function AccordionArgsShape(_args: AccordionArgs) {
  return null;
}

const meta = {
  title: 'Components/Accordion',
  // Set only so react-docgen can attach Accordion's prop table to this story file's
  // documentation — see the equivalent comment in button.stories.tsx for why this
  // must stay a bare reference to the imported `Accordion`.
  component: Accordion,
  render: AccordionStory,
  argTypes: {
    items: { control: 'object' },
    flush: { control: 'boolean' },
    alwaysOpen: { control: 'boolean' },
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
  parameters: {
    implementations,
    // Every story here relies on the meta-level custom `render`, so Storybook's
    // default ('auto') Code-panel behavior would fall back to static story source
    // instead of running `docs.source.transform` — see the equivalent comment in
    // button.stories.tsx. 'dynamic' forces the Code panel through the transform.
    docs: { source: { type: 'dynamic' } },
  },
} satisfies Omit<Meta<typeof AccordionArgsShape>, 'component'> & { component?: typeof Accordion };

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
