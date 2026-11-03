import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import storybook from 'eslint-plugin-storybook';

export default defineConfig(
  {
    ignores: ['storybook-static', 'dist'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
