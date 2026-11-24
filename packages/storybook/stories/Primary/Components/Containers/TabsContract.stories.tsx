import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { renderTabs } from '@az-digital/components-html';
import { checkContract } from '../contractCheck';

// Checks Arizona Bootstrap's underline tabs against the tabs contract, in each
// of a tab's states. It's a test, so it stays out of the sidebar and the docs.

const serifMarkup = renderTabs({
  tabs: [
    { label: 'Current', current: true },
    { label: 'At rest' },
    { label: 'Disabled', disabled: true },
  ],
});

const sansSerifMarkup = renderTabs({
  typeface: 'sans-serif',
  tabs: [
    { label: 'Current', current: true },
    { label: 'At rest' },
  ],
});

// A tab row's checkable (non-disabled) tabs, against the contract's default
// anatomy plus state.current for whichever tab is marked .active, and
// whatever typeface options this row's typeface calls for.
async function checkTabs(list: HTMLElement, typefaceOptions: string[] = []) {
  const tabs = [...list.querySelectorAll<HTMLElement>('.nav-link')];
  const checkable = tabs.filter((tab) => !tab.classList.contains('disabled'));

  // checkContract reads the resting rows, hover rows (really hovered, since
  // .nav.nav-underline .nav-link:hover sets color directly rather than a
  // resting CSS variable), and focus-visible rows, so the contract's
  // disabled state isn't one it can check. The disabled tab is checked
  // against the contract's disabled rows separately instead of being passed
  // through here, where it would be compared with the resting look it's
  // meant to differ from.
  //
  // Checked one tab at a time, not with Promise.all: real hover moves one
  // shared pointer, so two tabs hovering concurrently race each other.
  const mismatches: string[] = [];
  for (const tab of checkable) {
    // The root's rule and the list's gap are read from the list itself;
    // each tab and its label are read from its link, whose text is the
    // label, and whose focus-visible ring is read from itself, not the
    // shared root.
    mismatches.push(
      ...(await checkContract(
        { parts: { root: list, list, tab, 'tab.label': tab }, focus: tab, hover: 'real' },
        'tabs',
        [...typefaceOptions, ...(tab.classList.contains('active') ? ['state.current'] : [])],
      )),
    );
  }

  return { tabs, mismatches };
}

const meta = {
  title: 'Primary/Components/Containers/Tabs contract check',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const UnderlineTabs: Story = {
  render: () => <div dangerouslySetInnerHTML={{ __html: serifMarkup }} />,
  play: async ({ canvasElement }) => {
    await document.fonts.ready;
    const list = canvasElement.querySelector<HTMLElement>('ul.nav-underline');
    await expect(list).not.toBeNull();
    if (!list) return;

    const { tabs, mismatches } = await checkTabs(list);
    await expect(tabs).toHaveLength(3);
    await expect(mismatches).toEqual([]);

    // The disabled state, which checkContract doesn't cover: a Gray 600 label
    // and no underline of its own.
    const disabled = tabs.find((tab) => tab.classList.contains('disabled'));
    await expect(disabled).toBeDefined();
    if (!disabled) return;
    const style = getComputedStyle(disabled);
    await expect(style.color).toBe('rgb(108, 117, 125)');
    await expect(style.borderBottomWidth).toBe('0px');
  },
};

export const UnderlineTabsSansSerif: Story = {
  render: () => <div dangerouslySetInnerHTML={{ __html: sansSerifMarkup }} />,
  play: async ({ canvasElement }) => {
    await document.fonts.ready;
    const list = canvasElement.querySelector<HTMLElement>('ul.nav-underline');
    await expect(list).not.toBeNull();
    if (!list) return;

    const { tabs, mismatches } = await checkTabs(list, ['typeface.sans-serif']);
    await expect(tabs).toHaveLength(2);
    await expect(mismatches).toEqual([]);
  },
};
