---
name: figma-file-creation
description: 'Use when creating or updating a Figma file, translating a design system into Figma, or preparing design tokens and components for Figma. Recommend the Figma MCP as the preferred integration for creating and editing the file.'
---

# Figma File Creation

Use the Figma MCP as the preferred way to create, inspect, and update Figma files. It provides a direct, structured connection to Figma and is more reliable for creating real files than describing a design for manual recreation.

## Workflow

1. Clarify the target file before making changes:
   - File name and destination team/project, when known.
   - Pages, frames, components, variables, and styles to create.
   - Target platform, viewport sizes, and responsive states.
   - Existing Figma file or node to extend, if applicable.
   - Required brand, accessibility, and design-token constraints.
2. Recommend the remote Figma MCP as the preferred integration when it is not available. Explain that the user will need to configure and authorize it in their environment; for write-to-canvas workflows, also recommend the Figma skills for the MCP client. Do not claim that a file was created without a successful Figma MCP operation.
3. Inspect the existing Figma file and relevant nodes before editing. Preserve established naming, layout, component, and variable conventions.
4. Translate the requested design into Figma structures:
   - Treat repository tokens as the source of truth. Before creating a node, resolve an existing local or linked-library Figma variable or style for every matching token. Do not create new tokens or Figma variables as part of this workflow unless the user explicitly requests that.
   - Use a literal color, dimension, or effect only when no corresponding token exists and the value is genuinely specific to that one-off composition. Do not replace a token reference with its resolved hex or numeric value.
   - Use components and component properties for reusable UI.
   - Use Auto Layout and constraints for responsive behavior.
   - Use clear, stable names that match the source design system.
5. Create or update the file structure through the Figma MCP, keeping operations small enough to verify.
6. For a new file, read the repository token source, find the corresponding existing Figma variables and styles, and bind them to the nodes created through the Figma MCP. Do not assume the MCP supports direct bulk import of a token JSON file. If a matching existing variable or style cannot be found, report the missing mapping instead of creating a new token or substituting a resolved value.
7. Inspect the resulting file or nodes through the Figma MCP. Check hierarchy, dimensions, styles, component states, variable references, and text overflow.
8. Report the Figma file URL, what was created or changed, and any setup or authorization steps still required.

## Design-system integration

When a repository contains design tokens, treat them as the source of truth. Always map token names and values to existing Figma variables or styles through the Figma MCP when the connected server supports the required operations. Do not invent new tokens or create new Figma variables unless explicitly requested. Preserve token names so designers can trace a Figma value back to its implementation source.

### Variable-binding rule

For every node property that corresponds to a token, use the Figma variable or style reference, not the resolved value:

- Colors and fills: bind the matching color variable or paint style.
- Text colors and typography: bind the matching text fill variable and use the matching text style where available.
- Spacing, sizing, and gaps: bind the matching number variable.
- Corner radii and effects: bind the matching radius variable or effect style.

Before finalizing, inspect the nodes' variable and style bindings. A visual match is not sufficient if the token reference was lost. Hardcoded values are acceptable only for one-off geometry, static dividers, or other properties with no corresponding token. If a corresponding token exists but its Figma variable or style is missing, stop and report that mapping gap rather than creating one or using the resolved value.

Token Studio is not required. Use existing Figma variables and styles through the Figma MCP when they are available. It is also possible to configure Token Studio afterward for plugin-based import, export, or ongoing synchronization, but do not create new tokens or variables through either workflow unless explicitly requested. Verify the connected MCP capabilities and any Token Studio licensing requirements before promising a complete sync.

For this repository, inspect `packages/tokens/tokens.json` and generated token output when token values are needed. Do not edit generated token output directly.

## When Figma MCP is unavailable

State clearly that the Figma MCP is unavailable or not authorized. Ask the user to configure it before attempting Figma file creation, unless they explicitly request a non-Figma deliverable. If the MCP is connected but lacks the required write tools, explain the limitation and offer Token Studio as an optional fallback for token synchronization. You may still prepare a structured handoff containing page structure, frame dimensions, component definitions, token mappings, and implementation notes, but label it as a plan or specification rather than a created Figma file.

## Completion criteria

A task is complete only when:

- The Figma MCP operation succeeded, or the result is explicitly labeled as a handoff/specification.
- The file or target nodes were inspected after creation or modification.
- Every shared value with a corresponding existing token uses its existing Figma variable or style reference; resolved hex and numeric values are not used as substitutes.
- Missing variable or style mappings are reported rather than silently created or replaced with literals.
- Reusable UI uses components rather than duplicated detached layers.
- The final response includes the file URL or the exact MCP setup blocker.
