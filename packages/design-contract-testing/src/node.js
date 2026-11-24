// Loads the published contracts and the token output that match them, for a test
// that runs in Node (a Playwright spec, a script). It reads what's installed:
// `@az-digital/contracts` and `@az-digital/tokens`, resolved from `from` (the
// project's own folder by default), so a project pins the versions it checks
// against in its own package.json.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const json = (path) => JSON.parse(readFileSync(path, 'utf8'));

/**
 * The installed contracts, their rows and matching token CSS. Refuses a token
 * source different from the one used to build the installed contracts.
 */
export function loadContracts({ from = process.cwd() } = {}) {
  const require = createRequire(join(from, 'noop.js'));
  const contractsDist = require.resolve('@az-digital/contracts/dist/contracts.json');
  const rows = json(contractsDist);
  const manifest = json(require.resolve('@az-digital/contracts/dist/manifest.json'));
  const contractsPackage = json(require.resolve('@az-digital/contracts/package.json'));
  const tokensPackage = json(require.resolve('@az-digital/tokens/package.json'));
  const tokensHash = createHash('sha256').update(readFileSync(require.resolve('@az-digital/tokens/tokens.json'))).digest('hex');
  if (tokensHash !== manifest.tokensHash) {
    throw new Error(`@az-digital/tokens ${tokensPackage.version ?? '(unversioned)'} isn't the release @az-digital/contracts ${contractsPackage.version ?? '(unversioned)'} was built with. Pin the two to the same release in package.json.`);
  }

  return {
    data: {
      rows,
      defaults: Object.fromEntries(Object.entries(manifest.contracts).map(([id, contract]) => [id, contract.variantDefaults])),
      variants: Object.fromEntries(Object.entries(manifest.contracts).map(([id, contract]) => [id, contract.variants])),
    },
    manifest,
    tokens: readFileSync(require.resolve('@az-digital/tokens/dist/tokens.css'), 'utf8'),
    versions: { contracts: contractsPackage.version ?? 'unversioned', tokens: tokensPackage.version ?? 'unversioned' },
  };
}
