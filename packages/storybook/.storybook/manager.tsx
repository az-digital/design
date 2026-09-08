import React from 'react';
import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: {
    // A component's own sidebar row only expands/collapses its children by default —
    // clicking it doesn't navigate anywhere, even when one of those children is that
    // component's own docs page. Link the row's label to that docs entry when it
    // exists, so clicking "Button" behaves like clicking its "Docs" child would.
    renderLabel: (item, api) => {
      if (item.type === 'component') {
        const docsId = `${item.id}--docs`;
        if (item.children?.includes(docsId)) {
          return (
            <a
              href={`?path=/docs/${docsId}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                api.selectStory(docsId);
              }}
            >
              {item.name}
            </a>
          );
        }
      }
      return item.name;
    },
  },
});
