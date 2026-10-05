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
    formats: {
      'javascript/variables': ({ dictionary }) => `export const az = ${JSON.stringify(buildCssVariableTree(dictionary), null, 2)};\n`,
      'typescript/declarations': ({ dictionary }) => `export const az: ${renderType(buildCssVariableTree(dictionary))};\n`,
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            // PROOF OF CONCEPT (surface modes): declare every token on each surface
            // ([data-az-surface]) as well as :root. A custom property resolves its
            // var() references where it's declared, so component tokens have to be
            // re-declared inside a dark surface to pick up its semantic values (see
            // scripts/build-modes.mjs). :where() keeps this at zero specificity, so
            // tokens.dark.css's overrides always win.
            selector: ':where(:root, [data-az-surface])',
            showFileHeader: false,
            // Keep aliases as var() references, so the alias chain from tokens.json
            // survives into the CSS and overriding one variable updates its dependents.
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
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
