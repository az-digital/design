import { readFileSync } from 'node:fs';
import StyleDictionary from 'style-dictionary';

/**
 * Writes a DTCG duration ({ value: 300, unit: 'ms' }) as a CSS time (300ms).
 * Style Dictionary's own time/seconds transform only matches its legacy `time`
 * type, so without this a duration prints as [object Object].
 */
const durationCss = {
  type: 'value',
  filter: (token) => token.$type === 'duration' && typeof token.$value === 'object' && token.$value !== null,
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
};

/**
 * Writes a percentage primitive (az.percentage.20, a plain number) as a CSS
 * percentage (20%). DTCG has no percentage type, so these are numbers that
 * only the percentage tier turns into percentages.
 */
const percentageCss = {
  type: 'value',
  filter: (token) => token.path[1] === 'percentage' && typeof token.$value === 'number',
  transform: (token) => `${token.$value}%`,
};

/**
 * Writes an asset token (`$type: "asset"`, a file path relative to this
 * package, such as a pattern's SVG) as the file itself, embedded as a CSS
 * data URI, so the output works wherever it's used with no files to host.
 * DTCG has no type for files, so `asset` is this repo's own type.
 */
const assetDataUri = {
  type: 'value',
  filter: (token) => token.$type === 'asset',
  transform: (token) => {
    const svg = readFileSync(new URL(token.$value, import.meta.url), 'utf8')
      .replace(/<\?xml[^>]*>/, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
    // Only what a data URI in url("…") can't hold is escaped: attribute quotes
    // become single quotes, and %, #, < and > are percent-encoded, as are { and }
    // so Style Dictionary doesn't read them as token references.
    const encoded = svg.replace(/"/g, "'").replace(/[%#<>{}]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
    return `url("data:image/svg+xml,${encoded}")`;
  },
};

/** Style Dictionary's own asset/url only wraps the path in url(); asset/data-uri replaces it. */
const withoutAssetUrl = (transforms) => transforms.filter((name) => name !== 'asset/url');

const camelCase = (value) => value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const setNestedValue = (target, path, value) => {
  const [current, ...rest] = path;
  if (!current) return;
  if (rest.length === 0) {
    target[camelCase(current)] = value;
    return;
  }
  target[camelCase(current)] ??= {};
  setNestedValue(target[camelCase(current)], rest, value);
};

const buildCssVariableTree = (dictionary) => {
  const tree = {};
  dictionary.allTokens.forEach((token) => {
    setNestedValue(tree, token.path.slice(1), `var(--${token.path.join('-')})`);
  });
  return tree;
};

/**
 * How each token is referenced from the JavaScript/TypeScript outputs:
 * `az.color.brand.red` for the `az` object those custom formats export. Read by
 * @az-digital/storybook-addon-tokens to show each output's reference; Style
 * Dictionary itself ignores it.
 */
const jsReference = (token) => ['az', ...token.path.slice(1).map(camelCase)].join('.');

const renderType = (value, indent = 0) => {
  const spacing = ' '.repeat(indent);
  const childSpacing = ' '.repeat(indent + 2);
  const entries = Object.entries(value);
  return `{
${entries.map(([key, child]) => `${childSpacing}${JSON.stringify(key)}: ${typeof child === 'string' ? 'string' : renderType(child, indent + 2)}`).join(',\n')}
${spacing}}`;
};

export default {
  source: ['tokens.json'],
  hooks: {
    transforms: {
      'duration/css': durationCss,
      'percentage/css': percentageCss,
      'asset/data-uri': assetDataUri,
    },
    formats: {
      'javascript/variables': ({ dictionary }) => `export const az = ${JSON.stringify(buildCssVariableTree(dictionary), null, 2)};\n`,
      'typescript/declarations': ({ dictionary }) => `export const az: ${renderType(buildCssVariableTree(dictionary))};\n`,
    },
  },
  platforms: {
    css: {
      transforms: [...withoutAssetUrl(StyleDictionary.hooks.transformGroups.css), 'duration/css', 'percentage/css', 'asset/data-uri'],
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            showFileHeader: false,
            // Keep aliases as var() references, so the alias chain from tokens.json
            // survives into the CSS and overriding one variable updates its dependents.
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transforms: [...withoutAssetUrl(StyleDictionary.hooks.transformGroups.scss), 'duration/css', 'percentage/css', 'asset/data-uri'],
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.scss',
          format: 'scss/variables',
          options: {
            showFileHeader: false,
            // Same for Sass: aliases stay as $variable references (Style Dictionary
            // orders them so each is defined before use).
            outputReferences: true,
          },
        },
      ],
    },
    javascript: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.vars.js',
          format: 'javascript/variables',
          options: {
            tokenReference: jsReference,
            // What that export holds for each token: its CSS custom property.
            tokenValue: (token) => `var(--${token.path.join('-')})`,
          },
        },
      ],
    },
    typescript: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.vars.d.ts',
          format: 'typescript/declarations',
          options: {
            tokenReference: jsReference,
          },
        },
      ],
    },
  },
};
