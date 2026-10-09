---
name: design-system-component
description: >-
  Use when adding or changing an Arizona Digital design-system component,
  Storybook story, or implementation package.
---

# Design system component workflow

Human-facing component conventions and completion criteria live in [Components → Contributing](../../../packages/storybook/stories/Primary/Components/Contributing.mdx). Read the README for the target implementation before changing its code:

- [HTML](../../../packages/components-html/README.md)
- [React](../../../packages/components-react/README.md)
- [Web Components](../../../packages/components-web/README.md)
- [Arizona Quickstart](../../../packages/components-quickstart/README.md)

Use Storybook's `write-story` skill before adding a story. Keep shared story args aligned across the implementations in scope, and make sure the **Code** panel shows the selected implementation's real usage. Use Storybook docs and stories as the source of truth for component APIs; do not infer or invent props.

Verify changes in each target platform, not just Storybook. Keep this skill focused on agent workflow; update the human contribution guide or package README when shared conventions change instead of copying those conventions here.
