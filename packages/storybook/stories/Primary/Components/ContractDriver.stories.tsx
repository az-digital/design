import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { createDriver } from './designContractTest';

const meta = {
  title: 'Primary/Components/Design contract driver',
  tags: ['!dev', '!autodocs'],
  render: () => <button type="button">Driver test</button>,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PressedState: Story = {
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const button = canvasElement.querySelector('button');
    const driver = await createDriver(button ?? undefined);
    if (!button || !driver?.press || !driver.release || !driver.unhover) throw new Error('The contract driver is unavailable.');
    await driver.unhover();
    await driver.press(button);
    try {
      await expect(button.matches(':active')).toBe(true);
    } finally {
      await driver.release();
    }
  },
};

export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    if (import.meta.env.MODE !== 'test') return;
    const button = canvasElement.querySelector('button');
    const driver = await createDriver(button ?? undefined);
    if (!button || !driver?.press || !driver.release || !driver.keyboardFocus) throw new Error('The contract driver is unavailable.');
    await driver.press(button);
    await driver.release();
    await driver.keyboardFocus(button);
    await expect(button.matches(':focus-visible')).toBe(true);
  },
};
