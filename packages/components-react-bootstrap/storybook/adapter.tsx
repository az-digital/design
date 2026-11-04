// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. Each component mounts into the container with its own
// React root, so the addon needs no React of its own to show it.
import { createElement } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import type { ComponentAdapter, LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { Accordion, ArizonaHeader, Nav, Tabs } from '../src';
import type { AccordionProps, ArizonaHeaderProps, NavProps, TabsProps } from '../src';

/** Mounts `component` into the container and unmounts it when the addon clears the container. */
const mount =
  <Props extends object>(component: ComponentType<Props>) =>
  (props: Props, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(createElement(component, props));
    return () => root.unmount();
  };

/** JSX for the props that differ from their defaults, so the snippet stays readable. */
const jsx = (name: string, flags: string[], items?: unknown) => {
  const props = [...flags, ...(items === undefined ? [] : [`items={${JSON.stringify(items, null, 2)}}`])];
  return `<${name}${props.length > 0 ? ` ${props.join(' ')}` : ''} />`;
};

const accordion: ComponentAdapter<AccordionProps> = {
  render: mount(Accordion),
  source: (props) =>
    jsx(
      'Accordion',
      [props.id && props.id !== 'accordion' && `id="${props.id}"`, props.flush && 'flush', props.alwaysOpen && 'alwaysOpen', props.anchors && 'anchors'].filter(
        (flag): flag is string => Boolean(flag),
      ),
      props.items,
    ),
};

const brandHeader: ComponentAdapter<ArizonaHeaderProps> = {
  render: mount(ArizonaHeader),
  source: (props) => {
    const flags = [
      props.variant && props.variant !== 'blue' && `variant="${props.variant}"`,
      props.fixedOnMobile && 'fixedOnMobile',
      props.id && props.id !== 'header_arizona' && `id="${props.id}"`,
      props.headerButtons && 'headerButtons',
    ].filter((flag): flag is string => Boolean(flag));
    return `<ArizonaHeader${flags.length > 0 ? ` ${flags.join(' ')}` : ''} />`;
  },
};

const nav: ComponentAdapter<NavProps> = {
  render: mount(Nav),
  source: (props) =>
    jsx(
      'Nav',
      [props.variant && `variant="${props.variant}"`, props.vertical && 'vertical', props.fill && 'fill', props.justify && 'justify'].filter(
        (flag): flag is string => Boolean(flag),
      ),
      props.items,
    ),
};

const tabs: ComponentAdapter<TabsProps> = {
  render: mount(Tabs),
  source: (props) =>
    jsx(
      'Tabs',
      [
        props.id && props.id !== 'tabs' && `id="${props.id}"`,
        props.variant && props.variant !== 'tabs' && `variant="${props.variant}"`,
        props.defaultActiveIndex && `defaultActiveIndex={${props.defaultActiveIndex}}`,
        props.vertical && 'vertical',
        props.fill && 'fill',
        props.justify && 'justify',
      ].filter((flag): flag is string => Boolean(flag)),
      props.items,
    ),
};

export default { components: { accordion, 'brand-header': brandHeader, nav, tabs } } satisfies LibraryAdapter;
