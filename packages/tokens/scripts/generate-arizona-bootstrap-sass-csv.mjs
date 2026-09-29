import fs from 'node:fs';
import path from 'node:path';

const packageDirectory = path.resolve(new URL('..', import.meta.url).pathname);
const tokenFile = path.join(packageDirectory, 'tokens.arizona-bootstrap-5-1-sass.json');
const csvFile = path.join(packageDirectory, 'arizona-bootstrap-5-1-sass.csv');
const tokens = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));

const csvField = (value) => `"${String(value).replaceAll('"', '""')}"`;
const rows = Object.values(tokens.sass).map((token) => [
  token.$extensions.sassVariable,
  token.$extensions.cssVariable ?? '',
  token.$extensions.currentToken ?? '',
  token.$value,
]);

const csv = [
  'Arizona Bootstrap 5.1 Sass variable,CSS custom property,Current Design Token,Value',
  ...rows.map((row) => row.map(csvField).join(',')),
  '',
].join('\n');

fs.writeFileSync(csvFile, csv);
console.log(`Wrote ${rows.length} rows to ${path.relative(process.cwd(), csvFile)}`);
