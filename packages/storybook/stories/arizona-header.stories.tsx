import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { createElement } from 'react';
import { ArizonaHeader } from '@az-digital/components-react';
import { renderArizonaHeader } from '@az-digital/components-html';
import type { ArizonaHeaderProps } from '@az-digital/components-html';
import type { Implementations } from './implementations';
import { renderImplementation } from './implementations';

// Not `Parameters<typeof renderArizonaHeader>[0]` (the pattern most stories use) —
// renderArizonaHeader's default parameter value (`= {}`) makes that resolve to
// `ArizonaHeaderProps | undefined`, which Storybook's own story-args types reject
// outright (same issue as Card's story — see the comment there).
type ArizonaHeaderArgs = ArizonaHeaderProps;

/** JSX shown in the docs code panel when Implementation is set to React. */
const asReactCode = (args: ArizonaHeaderArgs) => {
  const props: string[] = [];

  if (args.variant && args.variant !== 'blue') props.push(`variant="${args.variant}"`);
  if (args.fixedOnMobile) props.push('fixedOnMobile');
  if (args.id && args.id !== 'header_arizona') props.push(`id="${args.id}"`);

  const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';

  return `<ArizonaHeader${propsString} />`;
};

const implementations: Implementations<ArizonaHeaderArgs> = {
  html: {
    render: (args) => <div dangerouslySetInnerHTML={{ __html: renderArizonaHeader(args) }} />,
    source: (args) => renderArizonaHeader(args),
  },
  react: {
    render: (args) => createElement(ArizonaHeader, args),
    source: asReactCode,
  },
};

function ArizonaHeaderStory(args: ArizonaHeaderArgs, context: StoryContext) {
  return renderImplementation('ArizonaHeader', implementations, args, context);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- args-only stand-in for Meta<T>'s generic; ArizonaHeaderStory itself also takes a `context` param, which Meta<T> doesn't expect
function ArizonaHeaderArgsShape(_args: ArizonaHeaderArgs) {
  return null;
}

const meta = {
  title: 'Components/ArizonaHeader',
  // Set only so react-docgen can attach ArizonaHeader's prop table to this story file's
  // documentation — see the equivalent comment in button.stories.tsx for why this
  // must stay a bare reference to the imported `ArizonaHeader`.
  component: ArizonaHeader,
  render: ArizonaHeaderStory,
  argTypes: {
    variant: { control: 'radio', options: ['blue', 'red'] },
    fixedOnMobile: { control: 'boolean' },
  },
  parameters: {
    implementations,
    // Every story here relies on the meta-level custom `render`, so Storybook's
    // default ('auto') Code-panel behavior would fall back to static story source
    // instead of running `docs.source.transform` — see the equivalent comment in
    // button.stories.tsx. 'dynamic' forces the Code panel through the transform.
    docs: { source: { type: 'dynamic' } },
  },
} satisfies Omit<Meta<typeof ArizonaHeaderArgsShape>, 'component'> & { component?: typeof ArizonaHeader };

export default meta;
type Story = StoryObj<typeof meta>;

/** Mirrors Arizona Bootstrap's own "University header with wordmark logo" example — the current, recommended variant. */
export const Default: Story = {};

/** The original red header. Still real and demonstrated in the docs, but marked there for future deprecation. */
export const OriginalRedHeader: Story = {
  args: { variant: 'red', id: 'header_arizona_2' },
};
