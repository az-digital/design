import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';
import cssInJs from '@terrazzo/plugin-css-in-js';

export default defineConfig({
  tokens: ['tokens.json'],
  plugins: [
    css({ filename: 'tokens.css' }),
    cssInJs({ filename: 'tokens.vars.js' })
  ],
  outDir: './dist/',
  lint: {
    build: { enabled: true },
    rules: {
      'core/valid-color': ['error', { legacyFormat: true, ignoreRanges: false }],
      'core/valid-dimension': ['error', { legacyFormat: true }],
      'core/valid-font-family': 'error',
      'core/valid-font-weight': 'error',
      'core/valid-duration': 'error',
      'core/valid-cubic-bezier': 'error',
      'core/valid-number': 'error',
      'core/valid-link': 'error',
      'core/valid-boolean': 'error',
      'core/valid-string': 'error',
      'core/valid-stroke-style': 'error',
      'core/valid-border': 'error',
      'core/valid-transition': 'error',
      'core/valid-shadow': 'error',
      'core/valid-gradient': 'error',
      'core/valid-typography': 'error',
      'core/consistent-naming': 'warn'
    }
  }
});
