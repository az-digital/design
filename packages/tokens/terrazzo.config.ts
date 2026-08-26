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
      'core/valid-color': 'warn',
      'core/valid-dimension': 'warn',
      'core/valid-font-family': 'warn',
      'core/valid-font-weight': 'warn',
      'core/valid-duration': 'warn',
      'core/valid-cubic-bezier': 'warn',
      'core/valid-number': 'warn',
      'core/valid-link': 'warn',
      'core/valid-boolean': 'warn',
      'core/valid-string': 'warn',
      'core/valid-stroke-style': 'warn',
      'core/valid-border': 'warn',
      'core/valid-transition': 'warn',
      'core/valid-shadow': 'warn',
      'core/valid-gradient': 'warn',
      'core/valid-typography': 'warn',
      'core/consistent-naming': 'warn'
    }
  }
});
