import { defineConfig } from 'vite';

// Two builds from one config:
// - default: ES modules for npm, one file per component plus the barrel, with
//   `lit` left external so apps share one copy.
// - `--mode cdn`: one self-registering, minified file with lit bundled in, for
//   a plain <script type="module"> tag with no build step.
export default defineConfig(({ mode }) =>
  mode === 'cdn'
    ? {
        build: {
          emptyOutDir: false,
          lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: () => 'az-components.min.js',
          },
        },
      }
    : {
        build: {
          minify: false,
          lib: {
            entry: {
              index: 'src/index.ts',
              'az-button': 'src/button/az-button.ts',
              'az-arizona-header': 'src/arizona-header/az-arizona-header.ts',
            },
            formats: ['es'],
          },
          rollupOptions: {
            external: [/^lit(\/|$)/],
          },
        },
      },
);
