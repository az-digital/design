// Runs in Node (Storybook's server), never in the browser.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { configureLibraries, discoverLibraries } from './discover.js';

export const VIRTUAL_ID = 'virtual:az-design-libraries';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/** The browser-facing fields of a library, with its README's text; Node paths stay on the server. */
const publicFields = ({ key, title, status, codeLanguage, packageName, ref, readme }) => ({
  key,
  title,
  status,
  codeLanguage,
  packageName,
  ref,
  readme: readme ? readFileSync(readme, 'utf8') : undefined,
});

/**
 * Serves the registered libraries to the preview as `virtual:az-design-libraries`:
 * each library's public manifest fields, its adapter module and its stylesheet
 * URLs. Re-discovers them (then reloads the preview) when a library's
 * package.json or README changes. A newly added library package needs a restart.
 */
export function librariesPlugin({ projectDir, options }) {
  let configured;
  const discover = () => {
    configured = configureLibraries(discoverLibraries(projectDir), options);
    return configured;
  };

  return {
    name: 'az-design-libraries',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined;
      const { libraries, defaultLibrary } = configured ?? discover();
      const imports = [];
      const entries = libraries.map((library, index) => {
        const adapter = library.adapterFile ? `adapter${index}` : 'undefined';
        if (library.adapterFile) imports.push(`import ${adapter} from ${JSON.stringify(library.adapterFile)};`);
        const stylesheets = library.stylesheets.map((sheet, sheetIndex) => {
          if (/^https?:\/\//.test(sheet)) return JSON.stringify(sheet);
          const name = `stylesheet${index}_${sheetIndex}`;
          imports.push(`import ${name} from ${JSON.stringify(`${sheet}?url`)};`);
          return name;
        });
        return `{ ...${JSON.stringify(publicFields(library))}, stylesheets: [${stylesheets.join(', ')}], adapter: ${adapter} }`;
      });
      return [...imports, `export const libraries = [${entries.join(',\n')}];`, `export const defaultLibrary = ${JSON.stringify(defaultLibrary)};`].join('\n');
    },
    configureServer(server) {
      discover();
      const manifests = () => configured.libraries.flatMap((library) => [join(library.packageDir, 'package.json'), library.readme].filter(Boolean));
      server.watcher.add(manifests());
      server.watcher.on('change', (file) => {
        if (!manifests().includes(file)) return;
        discover();
        const module = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
