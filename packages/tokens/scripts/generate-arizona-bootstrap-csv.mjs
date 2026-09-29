import fs from 'node:fs';
import path from 'node:path';

const packageDirectory = path.resolve(new URL('..', import.meta.url).pathname);
const tokenFile = path.join(packageDirectory, 'tokens.arizona-bootstrap-5-1.json');
const csvFile = path.join(packageDirectory, 'arizona-bootstrap-5-1.csv');
const sourceUrl = 'https://github.com/az-digital/arizona-bootstrap/blob/main/dist/css/arizona-bootstrap.css';
const tokens = JSON.parse(fs.readFileSync(tokenFile, 'utf8'));

const csvField = (value) => `"${String(value).replaceAll('"', '""')}"`;
const rows = [];

for (const [prefix, group] of Object.entries(tokens)) {
  for (const token of Object.values(group)) {
    const variable = token.$extensions?.cssVariable;
    if (!variable) continue;
    rows.push([
      variable,
      token.$extensions?.currentToken ?? '',
      token.$value,
    ]);
  }
}

const csv = [
  'Arizona Bootstrap 5.1,Current Design Token,Value',
  ...rows.map((row) => row.map(csvField).join(',')),
  '',
].join('\n');

fs.writeFileSync(csvFile, csv);
console.log(`Wrote ${rows.length} rows to ${path.relative(process.cwd(), csvFile)}`);
console.log(`Source: ${sourceUrl}`);
