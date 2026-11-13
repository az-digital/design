import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { renderAccordion, renderNav, renderTabs } from '@az-digital/components-html';
import { Accordion, Nav, Tabs } from '@az-digital/components-react-bootstrap';
import { checkContract } from './contractCheck';

const meta = {
  title: 'Primary/Components/Bootstrap baseline contract checks',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function required(root: Element, selector: string): HTMLElement {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Missing ${selector} in contract check`);
  return element;
}

const accordionItems = [{ title: 'Heading', content: 'Content', defaultOpen: true }];
const tabsItems = [{ title: 'Tab', content: 'Content' }];
const navItems = [{ label: 'Link', href: '/' }];

export const AccordionSpacing: Story = {
  render: () => (
    <div>
      <div dangerouslySetInnerHTML={{ __html: renderAccordion({ id: 'html-accordion-check', items: accordionItems }) }} />
      <Accordion id="react-accordion-check" items={accordionItems} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const accordions = canvasElement.querySelectorAll<HTMLElement>('.accordion');
    await expect(accordions).toHaveLength(2);
    for (const root of accordions) {
      await expect(checkContract({
        parts: { root, heading: required(root, '.accordion-button'), body: required(root, '.accordion-body') },
      }, 'accordion')).toEqual([]);
    }
  },
};

export const TabSpacing: Story = {
  render: () => (
    <div>
      <div data-style="default" dangerouslySetInnerHTML={{ __html: renderTabs({ id: 'html-tabs-check', items: tabsItems }) }} />
      <div data-style="default"><Tabs id="react-tabs-check" items={tabsItems} /></div>
      <div data-style="underline" dangerouslySetInnerHTML={{ __html: renderTabs({ id: 'html-underline-tabs-check', items: tabsItems, variant: 'underline' }) }} />
      <div data-style="underline"><Tabs id="react-underline-tabs-check" items={tabsItems} variant="underline" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cases = canvasElement.querySelectorAll<HTMLElement>('[data-style]');
    await expect(cases).toHaveLength(4);
    for (const root of cases) {
      const options = root.dataset.style === 'underline' ? ['style.underline'] : [];
      await expect(checkContract({ parts: { root, tab: required(root, '.nav-link') } }, 'tabs', options)).toEqual([]);
    }
  },
};

export const NavSpacing: Story = {
  render: () => (
    <div>
      <div data-style="default" dangerouslySetInnerHTML={{ __html: renderNav({ items: navItems }) }} />
      <div data-style="default"><Nav items={navItems} /></div>
      <div data-style="underline" dangerouslySetInnerHTML={{ __html: renderNav({ items: navItems, variant: 'underline' }) }} />
      <div data-style="underline"><Nav items={navItems} variant="underline" /></div>
      <div data-style="utility" dangerouslySetInnerHTML={{ __html: renderNav({ items: navItems, variant: 'utility' }) }} />
      <div data-style="utility"><Nav items={navItems} variant="utility" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cases = canvasElement.querySelectorAll<HTMLElement>('[data-style]');
    await expect(cases).toHaveLength(6);
    for (const root of cases) {
      const options = root.dataset.style === 'default' ? [] : [`style.${root.dataset.style}`];
      await expect(checkContract({ parts: { root, link: required(root, '.nav-link') } }, 'nav', options)).toEqual([]);
    }
  },
};
