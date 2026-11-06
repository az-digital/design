export type LibraryManifest = {
  adapter?: string;
  codeLanguage: string;
  key: string;
  readme: string;
  ref?: string;
  status: 'preview' | 'supported';
  stylesheets?: string[];
  title: string;
};

export type DiscoveredLibrary = Omit<LibraryManifest, 'stylesheets'> & {
  adapterFile?: string;
  packageDir: string;
  packageName: string;
  stylesheets: string[];
};

export type ConfigureLibrariesOptions = {
  default?: string;
  disable?: string[];
  order?: string[];
  overrides?: Record<string, Partial<LibraryManifest>>;
};

export function discoverLibraries(projectDir: string): DiscoveredLibrary[];

export function configureLibraries(
  discovered: DiscoveredLibrary[],
  options?: ConfigureLibrariesOptions,
): {
  libraries: DiscoveredLibrary[];
  defaultLibrary?: string;
};
