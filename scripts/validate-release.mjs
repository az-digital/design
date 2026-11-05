// Run by the Release workflow after it sets every package's version from the
// workflow input. package.json files on main have no "version", so this checks
// that each one was set to RELEASE_VERSION and that every package npm will
// publish is in the @az-digital scope.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const expectedVersion = process.env.RELEASE_VERSION;
if (!expectedVersion) {
  throw new Error('Set RELEASE_VERSION to the version being released');
}

const root = JSON.parse(readFileSync('package.json', 'utf8'));
const workspaceOutput = execFileSync(
  'npm',
  ['pkg', 'get', 'name', 'version', 'private', '--workspaces', '--json'],
  { encoding: 'utf8' },
);
const workspaces = Object.values(JSON.parse(workspaceOutput));

for (const pkg of [root, ...workspaces]) {
  if (pkg.version !== expectedVersion) {
    throw new Error(`${pkg.name} version ${pkg.version ?? '(missing)'} must be ${expectedVersion}`);
  }
}

const publishableWorkspaces = workspaces.filter((pkg) => !pkg.private);
const packages = publishableWorkspaces.filter((pkg) => pkg.name?.startsWith('@az-digital/'));

if (packages.length !== publishableWorkspaces.length) {
  throw new Error('All non-private workspaces must use the @az-digital scope');
}

if (packages.length === 0) {
  throw new Error('No publishable @az-digital workspaces were found');
}

console.log(`Validated ${packages.length} publishable workspaces at ${expectedVersion}: ${packages.map((pkg) => pkg.name).join(', ')}`);
