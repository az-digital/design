import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const packages = [
  {
    name: '@az-digital/tokens',
    files: [
      'package.json',
      'tokens.json',
      'dist/tokens.css',
      'dist/tokens.scss',
      'dist/tokens.vars.js',
      'dist/tokens.vars.d.ts',
    ],
    smokeTest: `
      for (const specifier of [
        '@az-digital/tokens/package.json',
        '@az-digital/tokens/tokens.json',
        '@az-digital/tokens/dist/tokens.css',
        '@az-digital/tokens/dist/tokens.scss',
        '@az-digital/tokens/dist/tokens.vars.js',
        '@az-digital/tokens/dist/tokens.vars.d.ts',
      ]) {
        await readFile(new URL(import.meta.resolve(specifier)));
      }
      const tokens = JSON.parse(await readFile(new URL(import.meta.resolve('@az-digital/tokens/tokens.json'))));
      const css = await readFile(new URL(import.meta.resolve('@az-digital/tokens/dist/tokens.css')), 'utf8');
      const scss = await readFile(new URL(import.meta.resolve('@az-digital/tokens/dist/tokens.scss')), 'utf8');
      const vars = await import('@az-digital/tokens/dist/tokens.vars.js');
      if (!tokens.az || !css.includes('--az-') || !scss.includes('$az-') || !vars.az.color.brand.red) {
        throw new Error('Token package exports or generated files are incomplete');
      }
    `,
  },
  {
    name: '@az-digital/contracts',
    files: [
      'package.json',
      'contract.schema.json',
      'contracts/button.contract.json',
      'dist/contracts.json',
    ],
    smokeTest: `
      for (const specifier of [
        '@az-digital/contracts/package.json',
        '@az-digital/contracts/contract.schema.json',
        '@az-digital/contracts/contracts/button.contract.json',
        '@az-digital/contracts/dist/contracts.json',
      ]) {
        await readFile(new URL(import.meta.resolve(specifier)));
      }
      const schema = JSON.parse(await readFile(new URL(import.meta.resolve('@az-digital/contracts/contract.schema.json'))));
      const button = JSON.parse(await readFile(new URL(import.meta.resolve('@az-digital/contracts/contracts/button.contract.json'))));
      const contracts = JSON.parse(await readFile(new URL(import.meta.resolve('@az-digital/contracts/dist/contracts.json'))));
      if (!schema.$schema || button.id !== 'button' || !contracts.some((entry) => entry.contract === 'button')) {
        throw new Error('Contracts package exports or generated files are incomplete');
      }
    `,
  },
];

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'az-design-package-check-'));

try {
  const tarballs = [];
  for (const pkg of packages) {
    const dryRun = JSON.parse(execFileSync(
      'npm',
      ['pack', `--workspace=${pkg.name}`, '--dry-run', '--json'],
      { encoding: 'utf8' },
    ))[0];
    const packedFiles = new Set(dryRun.files.map((file) => file.path));
    for (const file of pkg.files) {
      if (!packedFiles.has(file)) {
        throw new Error(`${pkg.name} tarball is missing ${file}`);
      }
    }

    const packed = JSON.parse(execFileSync(
      'npm',
      ['pack', `--workspace=${pkg.name}`, '--json', `--pack-destination=${temporaryDirectory}`],
      { encoding: 'utf8' },
    ))[0];
    tarballs.push(join(temporaryDirectory, packed.filename));
    console.log(`Validated packed files for ${pkg.name}`);
  }

  const consumerDirectory = join(temporaryDirectory, 'consumer');
  mkdirSync(consumerDirectory);
  writeFileSync(join(consumerDirectory, 'package.json'), JSON.stringify({
    name: 'az-design-package-consumer-check',
    private: true,
    type: 'module',
  }));
  execFileSync('npm', [
    'install',
    '--prefix', consumerDirectory,
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    ...tarballs,
  ], { stdio: 'inherit' });

  const smokeTest = `
    import { readFile } from 'node:fs/promises';
    ${packages.map((pkg) => pkg.smokeTest).join('\n')}
    console.log('Packed packages resolve and load their expected exports');
  `;
  execFileSync(process.execPath, ['--input-type=module', '--eval', smokeTest], {
    cwd: consumerDirectory,
    stdio: 'inherit',
  });
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
