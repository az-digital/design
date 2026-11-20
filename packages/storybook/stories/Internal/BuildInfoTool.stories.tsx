import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { convert, ThemeProvider, themes } from 'storybook/theming';
import { BuildInfoTool } from '../../.storybook/BuildInfoTool';
import type { BuildInfo } from '../../.storybook/buildInfo.ts';

const repositoryUrl = 'https://github.com/az-digital/design';
const sha = 'a'.repeat(40);
const release: BuildInfo = {
  kind: 'release',
  version: '1.2.3',
  tag: 'v1.2.3',
  commit: sha,
  commitOnGitHub: true,
  sourceRef: 'v1.2.3',
  repositoryUrl,
  packages: [{ name: '@az-digital/tokens', url: `${repositoryUrl}/pkgs/npm/tokens` }],
  libraries: [{ key: 'html', title: 'Arizona Bootstrap', path: 'packages/components-html/storybook/adapter.ts' }],
};

const meta = {
  title: 'Internal/Build information',
  component: BuildInfoTool,
  tags: ['!dev', '!autodocs'],
  decorators: [(Story) => <ThemeProvider theme={convert(themes.normal)}><Story /></ThemeProvider>],
  args: {
    build: release,
    importPath: './stories/Primary/Components/Buttons/Button.mdx',
    storiesImports: ['./stories/Primary/Components/Buttons/Button.stories.tsx'],
    tags: ['lib:html'],
  },
} satisfies Meta<typeof BuildInfoTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Release: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Design system build: Release v1.2.3' });
    await userEvent.click(trigger);
    await expect(page.getByText('Stable release.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Page source' })).toHaveAttribute(
      'href', `${repositoryUrl}/blob/v1.2.3/packages/storybook/stories/Primary/Components/Buttons/Button.mdx`,
    );
    await expect(page.getByRole('link', { name: 'Arizona Bootstrap adapter' })).toHaveAttribute(
      'href', `${repositoryUrl}/blob/v1.2.3/packages/components-html/storybook/adapter.ts`,
    );
    await expect(page.getByRole('link', { name: '@az-digital/tokens' })).toHaveAttribute(
      'href', `${repositoryUrl}/pkgs/npm/tokens`,
    );
    await userEvent.keyboard('{Escape}');
    await expect(page.queryByRole('dialog', { name: 'Design system build' })).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};

export const Prerelease: Story = {
  args: { build: { ...release, kind: 'prerelease', version: '2.0.0-beta.1', tag: 'v2.0.0-beta.1', sourceRef: 'v2.0.0-beta.1' } },
};

export const PullRequest: Story = {
  args: {
    build: { ...release, kind: 'preview', version: undefined, tag: undefined, branch: 'feature/button', pullRequest: 166, sourceRef: sha },
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Design system build: Preview PR #166' }));
    await expect(page.getByText('Unreleased review build.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Page source' })).toHaveAttribute(
      'href', `${repositoryUrl}/blob/${sha}/packages/storybook/stories/Primary/Components/Buttons/Button.mdx`,
    );
    await expect(page.queryByRole('link', { name: '@az-digital/tokens' })).not.toBeInTheDocument();
  },
};

export const Local: Story = {
  args: {
    build: { ...release, kind: 'local', version: undefined, tag: undefined, branch: 'feature', commitOnGitHub: false, uncommittedChanges: true, sourceRef: 'main' },
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Design system build: Local Development' }));
    await expect(page.getByText('Source links point to main, which may differ from this local build.')).toBeVisible();
    await expect(page.getByText('aaaaaaa (uncommitted changes)')).toBeVisible();
  },
};

export const MissingRevision: Story = {
  args: { build: { ...release, kind: 'preview', version: undefined, tag: undefined, commit: undefined, commitOnGitHub: false, sourceRef: undefined } },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Design system build: Preview Unknown revision' }));
    await expect(page.getByText('The source revision is unavailable for this build.')).toBeVisible();
    await expect(page.queryByRole('link', { name: 'Page source' })).not.toBeInTheDocument();
  },
};
