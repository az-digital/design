import React from 'react';
import { addons, types, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import { BuildInfoTool } from './BuildInfoTool.tsx';
import { colorSchemeQuery, getAzTheme } from './azTheme';

const updateTheme = () => addons.setConfig({ theme: getAzTheme() });

updateTheme();
globalThis.matchMedia(colorSchemeQuery).addEventListener('change', updateTheme);

function BuildInfoManager() {
  const api = useStorybookApi();
  const { storyId, refId } = useStorybookState();
  const entry = storyId && !refId ? api.getData(storyId) : undefined;
  return React.createElement(BuildInfoTool, {
    build: globalThis.AZ_DESIGN_BUILD,
    importPath: entry?.importPath,
    storiesImports: entry?.storiesImports,
    tags: entry?.tags,
  });
}

addons.register('az-design/build-info', () => {
  addons.add('az-design/build-info/tool', {
    type: types.TOOLEXTRA,
    title: 'Design system build',
    match: ({ viewMode, tabId }) => !tabId && (viewMode === 'story' || viewMode === 'docs'),
    render: () => React.createElement(BuildInfoManager),
  });
});
