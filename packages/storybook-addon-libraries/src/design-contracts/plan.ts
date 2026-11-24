import type { Library } from '../types';
import type { ComponentContract, PlannedLibraryTest } from './types';

/** Include omitted axes as well as each explicit option, to test actual defaults. */
export function variantCases(variants: Record<string, string[]>): Record<string, string>[] {
  return Object.entries(variants).reduce<Record<string, string>[]>(
    (cases, [axis, options]) => cases.flatMap((previous) => [
      previous,
      ...options.map((option) => ({ ...previous, [axis]: option })),
    ]),
    [{}],
  );
}

/**
 * Plan one component story's tests from the registered adapters and shared
 * contract data. A story's `lib:*` tags limit the libraries, as they do for the canvas.
 */
export function planComponentTests(
  libraries: Library[],
  contracts: Record<string, ComponentContract>,
  component: string,
  tagged?: string[],
): PlannedLibraryTest[] {
  if (!libraries.length) throw new Error('No component libraries are registered with Storybook.');
  const contract = Object.hasOwn(contracts, component) ? contracts[component] : undefined;
  const plan: PlannedLibraryTest[] = [];
  for (const library of libraries) {
    if (tagged && !tagged.includes(library.key)) continue;
    if (library.ref) {
      plan.push({ kind: 'external', library });
      continue;
    }
    if (!library.adapter?.components) throw new Error(`${library.key} has no component adapter.`);
    const adapter = Object.hasOwn(library.adapter.components, component) ? library.adapter.components[component] : undefined;
    if (!adapter) continue;
    if (!contract) plan.push({ kind: 'no-contract', library });
    else if (!adapter.designContractTest) plan.push({ kind: 'untested', library });
    else plan.push({ kind: 'test', library, adapter, contract });
  }
  return plan;
}
