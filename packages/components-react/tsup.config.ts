import { defineConfig } from 'tsup';

export default defineConfig({
  // One entry per component (plus the barrel) rather than a single bundled
  // entry — "use client" only works as a Server/Client boundary marker on a
  // per-file basis. Bundling every component into one physical file (the old
  // config) meant Accordion/Tabs's "use client" couldn't isolate anything:
  // Next.js's RSC compiler saw one file containing everyone's code and
  // client-tainted the whole thing, so importing even the hook-free Button
  // from the barrel forced a Client Component boundary. Splitting the build
  // lets Button/Nav (no hooks, no react-bootstrap) stay genuinely server-safe
  // via their own subpath export, while the barrel still bundles everything
  // together for convenience and remains client-tainted as a whole — see
  // each package's own README/docs for which to use where.
  entry: {
    index: 'src/index.ts',
    Button: 'src/components/Button/index.ts',
    Accordion: 'src/components/Accordion/index.ts',
    Tabs: 'src/components/Tabs/index.ts',
    Nav: 'src/components/Nav/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
