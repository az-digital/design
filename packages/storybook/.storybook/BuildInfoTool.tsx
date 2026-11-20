// Storybook bundles manager entries with the classic JSX runtime.
import React from 'react';
import { Badge, Button, PopoverProvider } from 'storybook/internal/components';
import { styled } from 'storybook/theming';
import type { BuildInfo } from './buildInfo.ts';

declare global {
  var AZ_DESIGN_BUILD: BuildInfo | undefined;
}

const labels: Record<BuildInfo['kind'], string> = {
  release: 'Release',
  prerelease: 'Prerelease',
  preview: 'Preview',
  local: 'Local',
};

const statuses = {
  release: 'positive',
  prerelease: 'warning',
  preview: 'active',
  local: 'neutral',
} as const;

export function buildLabel(build: BuildInfo) {
  if (build.version) return `v${build.version}`;
  if (build.pullRequest) return `PR #${build.pullRequest}`;
  if (build.kind === 'preview') return build.branch ?? 'Unknown revision';
  return 'Development';
}

function sourceUrl(build: BuildInfo, path: string): string | undefined {
  const parts = path.split('/');
  if (!build.sourceRef || parts.some((part) => !part || part === '.' || part === '..')) return undefined;
  return `${build.repositoryUrl}/blob/${encodeURIComponent(build.sourceRef)}/${parts.map(encodeURIComponent).join('/')}`;
}

function storySourceUrl(build: BuildInfo, importPath?: string): string | undefined {
  if (!importPath?.startsWith('./stories/')) return undefined;
  return sourceUrl(build, `packages/storybook/${importPath.slice(2)}`);
}

const Panel = styled.div(({ theme }) => ({
  padding: 12,
  minWidth: 260,
  maxWidth: 360,
  fontSize: theme.typography.size.s2,
  '& h2, & h3': { margin: '0 0 4px', fontSize: theme.typography.size.s2, fontWeight: theme.typography.weight.bold },
  '& p': { margin: '0 0 8px', color: theme.textMutedColor },
  '& dl': { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', margin: '0 0 8px' },
  '& dt': { color: theme.textMutedColor },
  '& dd': { margin: 0, overflowWrap: 'anywhere' },
  '& ul': { margin: '0 0 8px', paddingLeft: 16 },
  '& a': { color: theme.color.secondary },
}));

type SourceContext = {
  importPath?: string;
  storiesImports?: readonly string[];
  tags?: readonly string[];
};

function BuildDetails({ build, importPath, storiesImports = [], tags = [] }: SourceContext & { build: BuildInfo }) {
  const pageUrl = storySourceUrl(build, importPath);
  const stories = [...new Set(storiesImports)]
    .map((path) => ({ path, url: storySourceUrl(build, path) }))
    .filter((story): story is { path: string; url: string } => Boolean(story.url));
  const libraries = build.libraries
    .filter((library) => tags.includes(`lib:${library.key}`))
    .map((library) => ({ ...library, url: sourceUrl(build, library.path) }))
    .filter((library): library is typeof library & { url: string } => Boolean(library.url));
  const commit = build.commit && (build.commitOnGitHub
    ? <a href={`${build.repositoryUrl}/commit/${build.commit}`} target="_blank" rel="noreferrer">{build.commit.slice(0, 7)}</a>
    : build.commit.slice(0, 7));

  return (
    <Panel>
      <h2>Arizona Digital Design System</h2>
      <p>
        {build.kind === 'release' && 'Stable release.'}
        {build.kind === 'prerelease' && 'Prerelease.'}
        {build.kind === 'preview' && 'Unreleased review build.'}
        {build.kind === 'local' && 'Local development build; it may contain unpublished changes.'}
      </p>
      <dl>
        <dt>Version</dt><dd>{build.version ?? 'Not released'}</dd>
        <dt>Tag</dt><dd>{build.tag
          ? <a href={`${build.repositoryUrl}/releases/tag/${encodeURIComponent(build.tag)}`} target="_blank" rel="noreferrer">{build.tag}</a>
          : 'Not recorded'}</dd>
        <dt>Branch</dt><dd>{build.branch ?? 'Not recorded'}</dd>
        {build.pullRequest && (
          <><dt>Pull request</dt><dd><a href={`${build.repositoryUrl}/pull/${build.pullRequest}`} target="_blank" rel="noreferrer">#{build.pullRequest}</a></dd></>
        )}
        <dt>Commit</dt><dd>{commit ?? 'Unknown'}{build.uncommittedChanges && ' (uncommitted changes)'}</dd>
      </dl>
      {build.kind === 'local' && (
        <p>Source links point to {build.sourceRef}, which may differ from this local build.</p>
      )}
      {!build.sourceRef && <p>The source revision is unavailable for this build.</p>}
      {(pageUrl || stories.length > 0 || libraries.length > 0) && (
        <>
          <h3>Source for this page</h3>
          <ul>
            {pageUrl && <li><a href={pageUrl} target="_blank" rel="noreferrer">Page source</a></li>}
            {stories.map((story) => (
              <li key={story.path}><a href={story.url} target="_blank" rel="noreferrer">Story source: {story.path.split('/').pop()}</a></li>
            ))}
            {libraries.map((library) => (
              <li key={library.key}><a href={library.url} target="_blank" rel="noreferrer">{library.title} adapter</a></li>
            ))}
          </ul>
        </>
      )}
      {build.version && (
        <>
          <h3>Packages for version {build.version}</h3>
          <ul>
            {build.packages.map((pkg) => (
              <li key={pkg.name}><a href={pkg.url} target="_blank" rel="noreferrer">{pkg.name}</a></li>
            ))}
          </ul>
          <p>Package links open their GitHub Packages pages, not a specific version.</p>
        </>
      )}
      <a href={build.repositoryUrl} target="_blank" rel="noreferrer">Repository</a>
      {' · '}
      <a href={`${build.repositoryUrl}/releases`} target="_blank" rel="noreferrer">All releases</a>
    </Panel>
  );
}

export function BuildInfoTool({ build, ...source }: SourceContext & { build?: BuildInfo }) {
  if (!build) return <Button disabled>Build information unavailable</Button>;
  const label = buildLabel(build);

  return (
    <PopoverProvider ariaLabel="Design system build" placement="bottom-end" popover={<BuildDetails build={build} {...source} />}>
      <Button variant="ghost" padding="small" ariaLabel={`Design system build: ${labels[build.kind]} ${label}`}>
        <Badge status={statuses[build.kind]} compact>{labels[build.kind]}</Badge>
        {label}
      </Button>
    </PopoverProvider>
  );
}
