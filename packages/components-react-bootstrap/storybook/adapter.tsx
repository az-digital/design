// Storybook adapter: how @az-digital/storybook-addon-libraries draws this
// library's components. Each component mounts into the container with its own
// React root, so the addon needs no React of its own to show it.
import { createElement } from 'react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import type { ComponentAdapter, LibraryAdapter } from '@az-digital/storybook-addon-libraries';
import { Accordion, ArizonaHeader, Button, CallToActionCard, Card, IconCard, ImageCard, LinkCard, Nav, QuickLinksCard, Tabs, TitleOnImageCard } from '../src';
import type { AccordionProps, ArizonaHeaderProps, ButtonProps, CallToActionCardProps, CardProps, IconCardProps, ImageCardProps, LinkCardProps, NavProps, QuickLinksCardProps, TabsProps, TitleOnImageCardProps } from '../src';

/** Mounts `component` into the container and unmounts it when the addon clears the container. */
const mount =
  <Props extends object>(component: ComponentType<Props>) =>
  (props: Props, container: HTMLElement) => {
    const element = document.createElement('div');
    container.append(element);
    const root = createRoot(element);
    root.render(createElement(component, props));
    return () => queueMicrotask(() => root.unmount());
  };

/** JSX for the props that differ from their defaults, so the snippet stays readable. */
const jsx = (name: string, flags: string[], items?: unknown) => {
  const props = [...flags, ...(items === undefined ? [] : [`items={${JSON.stringify(items, null, 2)}}`])];
  return `<${name}${props.length > 0 ? ` ${props.join(' ')}` : ''} />`;
};

const cardSource = (name: string, props: object) => {
  const attributes = Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`);
  return `<${name}${attributes.length ? ` ${attributes.join(' ')}` : ''} />`;
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

const buttonColors = {
  red: { color: 'red', style: 'solid' },
  'outline-red': { color: 'red', style: 'outline' },
  blue: { color: 'blue', style: 'solid' },
  'outline-blue': { color: 'blue', style: 'outline' },
  rain: { color: 'rain', style: 'solid' },
  'outline-rain': { color: 'rain', style: 'outline' },
  'white-text-red': { color: 'white-text-red', style: 'solid' },
  'white-text-blue': { color: 'white-text-blue', style: 'solid' },
  'outline-white': { color: 'white', style: 'outline' },
} as const satisfies Record<string, Pick<ButtonProps, 'color' | 'style'>>;

type SharedButtonProps = {
  label: string;
  color?: keyof typeof buttonColors;
  size?: 'small' | 'large';
};

const buttonProps = ({ label, color = 'red', size }: SharedButtonProps): ButtonProps => ({
  ...buttonColors[color],
  htmlTag: 'button',
  size: size === 'small' ? 'sm' : size === 'large' ? 'lg' : undefined,
  children: label,
});

const button: ComponentAdapter<SharedButtonProps> = {
  render: (props, container) => mount(Button)(buttonProps(props), container),
  source: (props) => {
    const { color, style, size, children } = buttonProps(props);
    const attributes = [
      'htmlTag="button"',
      color !== 'red' && `color=${JSON.stringify(color)}`,
      style !== 'solid' && `style=${JSON.stringify(style)}`,
      size && `size=${JSON.stringify(size)}`,
    ].filter(Boolean);
    return `<Button ${attributes.join(' ')}>{${JSON.stringify(children)}}</Button>`;
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

export default {
  components: {
    accordion,
    'brand-header': brandHeader,
    button,
    card: { render: mount(Card), source: (props: CardProps) => cardSource('Card', props) },
    'link-card': { render: mount(LinkCard), source: (props: LinkCardProps) => cardSource('LinkCard', props) },
    'icon-card': { render: mount(IconCard), source: (props: IconCardProps) => cardSource('IconCard', props) },
    'image-card': { render: mount(ImageCard), source: (props: ImageCardProps) => cardSource('ImageCard', props) },
    'title-on-image-card': { render: mount(TitleOnImageCard), source: (props: TitleOnImageCardProps) => cardSource('TitleOnImageCard', props) },
    'quick-links-card': { render: mount(QuickLinksCard), source: (props: QuickLinksCardProps) => cardSource('QuickLinksCard', props) },
    'call-to-action-card': { render: mount(CallToActionCard), source: (props: CallToActionCardProps) => cardSource('CallToActionCard', props) },
    nav,
    tabs,
  },
} satisfies LibraryAdapter;
