import type { StoryContext } from '@storybook/react-vite';

export async function designContractBeforeEach(context: StoryContext) {
  if (import.meta.env.MODE !== 'test') return;
  const { runDesignContractBeforeEach } = await import('./designContractTestRunner');
  await runDesignContractBeforeEach(context);
}

export async function designContractAfterEach(context: StoryContext) {
  if (import.meta.env.MODE !== 'test') return;
  const { runDesignContractAfterEach } = await import('./designContractTestRunner');
  await runDesignContractAfterEach(context);
}
