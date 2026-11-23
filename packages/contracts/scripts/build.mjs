// Checks the component contracts (contracts/*.contract.json) against the
// tokens, and writes dist/contracts.json for docs tables and contract checks.
//
// A contract records one component's anatomy, independent of any platform: its
// parts, and what sets each part's design properties in its resting look, its
// states and its breakpoints. A property either references a token in
// tokens.json or holds the component's own value, written like a DTCG token.
// Contracts generate nothing for a platform: each implementation writes the
// component's own values its own way, and a contract check compares it with the
// contract.
//
// The build refuses, naming the problem, when a contract:
// - doesn't match contract.schema.json,
// - doesn't match its id to its file name, or duplicates another id,
// - references a token that isn't in tokens.json,
// - leaves one of its component's own tokens (az.component.<id>.*) unused, so
//   the contract and the tokens can't drift apart,
// - has a variant option that changes a part the anatomy doesn't have, or
// - names a variant default that isn't one of its options.
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

// A value written out for docs tables and contract checks.
const format = ({ $type: type, $value: value }) => {
  if (type === 'dimension' || type === 'duration') return `${value.value}${value.unit}`;
  if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`;
  if (type === 'fontFamily') return [value].flat().map((name) => (/\s/.test(name) ? `"${name}"` : name)).join(', ');
  return String(value);
};

const files = readdirSync(new URL('contracts/', root)).filter((file) => file.endsWith('.contract.json')).sort();
const problems = [];
const notes = [];
const rows = [];
const ids = new Map();

for (const file of files) {
  const contract = read(new URL(`contracts/${file}`, root));

  if (typeof contract.id === 'string') {
    if (file !== `${contract.id}.contract.json`) {
      problems.push(`${file}: file name doesn't match id "${contract.id}"`);
    }
    if (ids.has(contract.id)) {
      problems.push(`${file}: id "${contract.id}" duplicates ${ids.get(contract.id)}`);
    } else {
      ids.set(contract.id, file);
    }
  }

  if (!validate(contract)) {
    for (const error of validate.errors) {
      const where = error.instancePath.replace(/^\/anatomy\//, '').replaceAll('/', ' › ') || 'contract';
      problems.push(`${file}: ${where} ${error.message}`);
    }
    continue;
  }

  const used = new Set();
  // variant is { axis, option } for an option's changes, or null for the anatomy itself.
  const walk = (part, partPath, variant = null, base = contract.anatomy.root) => {
    if (!base) {
      problems.push(`${file}: ${variant.axis} › ${variant.option} changes ${partPath.join(' › ')}, which isn't a part of the anatomy`);
      return;
    }
    const add = (group, condition, kind) => {
      for (const [property, value] of Object.entries(group ?? {})) {
        const where = [variant && `${variant.axis} › ${variant.option}`, ...partPath, condition, property].filter(Boolean).join(' › ') || 'root';
        const row = { contract: contract.id, variant: variant && `${variant.axis}.${variant.option}`, part: partPath.join('.') || 'root', kind, condition: condition ?? null, property };
        if (typeof value === 'object') {
          rows.push({ ...row, token: null, type: value.$type, value: format(value), description: value.$description });
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
    for (const [breakpoint, group] of Object.entries(part.breakpoints ?? {})) {
      const token = tokens.get(`az.breakpoint.${breakpoint}`);
      if (!token || token.$type !== 'dimension') {
        problems.push(`${file}: ${partPath.join(' › ') || 'root'} uses breakpoint "${breakpoint}", which has no az.breakpoint.${breakpoint} dimension token`);
        continue;
      }
      add(group, breakpoint, 'breakpoint');
    }
    for (const [name, child] of Object.entries(part.parts ?? {})) walk(child, [...partPath, name], variant, base.parts?.[name] ?? null);
  };
  walk(contract.anatomy.root, []);
  for (const [axis, { default: preset, options }] of Object.entries(contract.variants ?? {})) {
    if (preset && !(preset in options)) problems.push(`${file}: ${axis}'s default, ${preset}, isn't one of its options`);
    for (const [option, { anatomy }] of Object.entries(options)) walk(anatomy.root, [], { axis, option });
  }

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
console.log(`Checked ${files.length} contract${files.length === 1 ? '' : 's'}: ${rows.length} properties, every reference resolves.`);
