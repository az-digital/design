// Preview annotation (loaded by Storybook from this package's `./preview`
// export): declares the `library` global, shows the selected library's source
// in the Code panel, and loads the selected library's stylesheets.
import type { DecoratorFunction, ProjectAnnotations, Renderer } from 'storybook/internal/types';
import { GLOBAL, PARAMETER } from './constants';
import { defaultLibrary, getLibrary, libraries, taggedLibraries } from './registry';
import type { LibrariesParameter, LibrarySummary } from './types';

const STYLESHEET_ATTRIBUTE = 'data-az-library-stylesheet';

/**
 * Loads the selected library's stylesheets and removes the ones this addon
 * added for another library. A stylesheet the page already loads some other
 * way (for example in preview-head.html) is left alone.
 */
function loadLibraryStylesheets(key: unknown) {
  const wanted = new Set(getLibrary(key)?.stylesheets ?? []);
  for (const link of document.querySelectorAll<HTMLLinkElement>(`link[${STYLESHEET_ATTRIBUTE}]`)) {
    if (!wanted.has(link.getAttribute('href') ?? '')) link.remove();
  }
  for (const href of wanted) {
    if ([...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].some((link) => link.getAttribute('href') === href)) continue;
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
    link.setAttribute(STYLESHEET_ATTRIBUTE, '');
    document.head.append(link);
  }
}

const withLibraryStylesheets: DecoratorFunction = (Story, context) => {
  loadLibraryStylesheets(context.globals[GLOBAL]);
  return Story();
};

/** The Code panel's source: the selected library's code for the story's args. */
function librarySource(code: string, context: { globals: Record<string, unknown>; args: Record<string, unknown>; parameters: Record<string, unknown>; tags?: string[] }) {
  const parameter = context.parameters[PARAMETER] as LibrariesParameter | undefined;
  if (!parameter) return code;
  const library = getLibrary(context.globals[GLOBAL]);
  if (!library) return code;
  const tagged = taggedLibraries(context.tags);
  const adapter = library.adapter?.components[parameter.component];
  if (library.ref) return `<!-- ${library.title} renders in its own Storybook: ${library.ref} -->`;
  if (!adapter || (tagged && !tagged.includes(library.key))) return `<!-- ${library.title} doesn't have this component yet. -->`;
  return adapter.source(parameter.props(context.args));
}

const summaries: LibrarySummary[] = libraries.map(({ key, title, status, ref }) => ({ key, title, status, ref }));

const preview: ProjectAnnotations<Renderer> = {
  initialGlobals: defaultLibrary ? { [GLOBAL]: defaultLibrary } : {},
  globalTypes: {
    // No `toolbar` key: the addon's own Library tool draws the menu, since it
    // needs each story's `lib:*` tags. The tool reads `libraries` from here.
    [GLOBAL]: { description: 'Component library', libraries: summaries } as never,
  },
  decorators: [withLibraryStylesheets],
  parameters: {
    docs: {
      source: { transform: librarySource },
    },
  },
};

export default preview;
