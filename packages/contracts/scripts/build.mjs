// Checks the component contracts (contracts/*.contract.json) against the
// tokens, writes dist/contracts.json for docs tables, and generates a CSS and a
// Sass variable for each of a component's own values.
//
// A contract records one component's anatomy, independent of any platform: its
// parts, and what sets each part's design properties in its resting look, its
// states and its breakpoints. A property either references a token in
// tokens.json (a brand color or a shared decision) or holds the component's own
// value, written like a DTCG token. Own values become variables named after
// where they sit: brand-header › logo › sm › width is --az-brand-header-logo-sm-width.
//
// The build refuses, naming the problem, when a contract:
// - doesn't match contract.schema.json,
// - references a token that isn't in tokens.json,
// - leaves one of its component's own tokens (az.component.<id>.*) unused, so
//   the contract and the tokens can't drift apart, or
// - generates a variable name that another value or a token already uses.
//
// It also reports component tokens that only point at another token, which the
// contract could reference directly: wiring belongs in the contract.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const root = new URL('../', import.meta.url);
const read = (url) => JSON.parse(readFileSync(url, 'utf8'));
const validate = new Ajv2020({ allErrors: true }).compile(read(new URL('contract.schema.json', root)));

// Every token in tokens.json, by path.
const tokens = new Map();
const collect = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    tokens.set(path.join('.'), node);
    return;
  }
  for (const [key, child] of Object.entries(node ?? {})) if (!key.startsWith('$')) collect(child, [...path, key]);
};
collect(read(new URL('../tokens/tokens.json', root)), []);

// A value as CSS and Sass write it.
const format = ({ $type: type, $value: value }) => {
  if (type === 'dimension' || type === 'duration') return `${value.value}${value.unit}`;
  if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`;
  return String(value);
};

const files = readdirSync(new URL('contracts/', root)).filter((file) => file.endsWith('.contract.json')).sort();
const problems = [];
const notes = [];
const rows = [];
const variables = new Map(); // generated name -> where it came from
const tokenVariables = new Set([...tokens.keys()].map((path) => path.replaceAll('.', '-')));

for (const file of files) {
  const contract = read(new URL(`contracts/${file}`, root));

  if (!validate(contract)) {
    for (const error of validate.errors) {
      const where = error.instancePath.replace(/^\/anatomy\//, '').replaceAll('/', ' › ') || 'contract';
      problems.push(`${file}: ${where} ${error.message}`);
    }
    continue;
  }

  const used = new Set();
  const walk = (part, partPath) => {
    const add = (group, condition, kind) => {
      for (const [property, value] of Object.entries(group ?? {})) {
        const where = [...partPath, condition, property].filter(Boolean).join(' › ') || 'root';
        const row = { contract: contract.id, part: partPath.join('.') || 'root', kind, condition: condition ?? null, property };
        if (typeof value === 'object') {
          const name = ['az', contract.id, ...partPath, condition, ...property.split('.')].filter(Boolean).join('-');
          if (variables.has(name) || tokenVariables.has(name)) {
            problems.push(`${file}: ${where} would generate --${name}, the same variable as ${variables.get(name) ?? 'a token in tokens.json'}`);
            continue;
          }
          variables.set(name, `${file}: ${where}`);
          rows.push({ ...row, token: null, type: value.$type, value: format(value), description: value.$description, variable: name });
          continue;
        }
        const token = value.slice(1, -1);
        if (!tokens.has(token)) {
          problems.push(`${file}: ${where} references {${token}}, which isn't a token`);
          continue;
        }
        used.add(token);
        rows.push({ ...row, token });
      }
    };
    add(part.tokens, null, 'default');
    for (const [state, group] of Object.entries(part.states ?? {})) add(group, state, 'state');
    for (const [breakpoint, group] of Object.entries(part.breakpoints ?? {})) add(group, breakpoint, 'breakpoint');
    for (const [name, child] of Object.entries(part.parts ?? {})) walk(child, [...partPath, name]);
  };
  walk(contract.anatomy.root, []);

  const prefix = `az.component.${contract.id}.`;
  for (const [path, token] of tokens) {
    if (!path.startsWith(prefix) || used.has(path)) continue;
    const alias = typeof token.$value === 'string' && token.$value.startsWith('{') ? token.$value.slice(1, -1) : null;
    if (alias) {
      notes.push(`${file}: ${path} only points at ${token.$value}; the contract can reference that directly, so the token can go`);
    } else {
      problems.push(`${file}: ${path} isn't used by the contract`);
    }
  }
}

for (const note of notes) console.log(`Note: ${note}`);
if (problems.length) {
  console.error(`Contracts refused:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  process.exit(1);
}

const dist = new URL('dist/', root);
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
writeFileSync(new URL('contracts.json', dist), `${JSON.stringify(rows, null, 2)}\n`);

const own = rows.filter((row) => row.variable);
writeFileSync(new URL('contracts.css', dist), `:root {\n${own.map((row) => `  --${row.variable}: ${row.value}; /** ${row.description} */`).join('\n')}\n}\n`);
writeFileSync(new URL('contracts.scss', dist), `${own.map((row) => `$${row.variable}: ${row.value}; // ${row.description}`).join('\n')}\n`);
console.log(`Checked ${files.length} contract${files.length === 1 ? '' : 's'}: ${rows.length} properties, every reference resolves, ${own.length} values generated as variables.`);
