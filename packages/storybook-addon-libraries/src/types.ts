/**
 * How one library draws one component. `props` are the component's shared
 * props, which every library receives the same way; the adapter translates
 * them to its own API.
 */
export type ComponentAdapter<Props = any> = {
  /**
   * Draws the component into `container`. Return an HTML string or a DOM
   * node for the addon to insert, or mount into `container` yourself (for a
   * framework with its own renderer) and return a cleanup function that
   * unmounts it; the addon calls it before clearing the container.
   */
  render: (props: Props, container: HTMLElement) => string | Node | (() => void) | void;
  /** The code a site would write for these props, shown in the Code panel. */
  source: (props: Props) => string;
};

/** A library's `./storybook` export: its components, by contract id (e.g. `button`). */
export type LibraryAdapter = {
  components: Record<string, ComponentAdapter>;
};

/** A registered library, as the preview sees it. */
export type Library = {
  key: string;
  title: string;
  status: 'preview' | 'supported';
  codeLanguage: string;
  packageName: string;
  /** URL of the library's own Storybook, when it renders there instead. */
  ref?: string;
  stylesheets: string[];
  /** The text of the library's README. */
  readme?: string;
  adapter?: LibraryAdapter;
};

/** What the Library toolbar needs to know about each library. */
export type LibrarySummary = Pick<Library, 'key' | 'title' | 'status' | 'ref'>;

/** `parameters.azLibraries`: the component a story draws, and how its args become shared props. */
export type LibrariesParameter<Args = any, Props = any> = {
  component: string;
  props: (args: Args) => Props;
};
