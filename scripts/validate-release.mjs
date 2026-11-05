import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = JSON.parse(readFileSync('package.json', 'utf8'));
if (!root.version || root.version === '0.0.0') {
  throw new Error('A release version must be prepared before publishing');
}

const workspaceOutput = execFileSync(
  'npm',
  ['pkg', 'get', 'name', 'version', 'private', '--workspaces', '--json'],
  { encoding: 'utf8' },
);
const workspaces = Object.values(JSON.parse(workspaceOutput));
const publishableWorkspaces = workspaces.filter((pkg) => !pkg.private);
const packages = publishableWorkspaces.filter((pkg) => pkg.name?.startsWith('@az-digital/'));

if (packages.length !== publishableWorkspaces.length) {
  throw new Error('All non-private workspaces must use the @az-digital scope');
}

if (packages.length === 0) {
  throw new Error('No publishable @az-digital workspaces were found');
}

for (const pkg of workspaces) {
  if (!pkg.version || pkg.version !== root.version) {
    throw new Error(`${pkg.name} version ${pkg.version ?? '(missing)'} must match root package.json version ${root.version}`);
  }
}

const expectedVersion = process.env.RELEASE_VERSION ?? root.version;
if (expectedVersion !== root.version) {
  throw new Error(`Requested version ${expectedVersion} must match root package.json version ${root.version}`);
}

if (process.env.RELEASE_TAG && process.env.RELEASE_TAG !== `v${root.version}`) {
  throw new Error(`Release tag ${process.env.RELEASE_TAG} must be v${root.version}`);
}

if (process.env.RELEASE_PRERELEASE !== undefined) {
  const isPrerelease = root.version.split('+', 1)[0].includes('-');
  if (String(isPrerelease) !== process.env.RELEASE_PRERELEASE) {
    throw new Error(`Version ${root.version} prerelease status must match the GitHub release prerelease flag`);
  }
}

console.log(`Validated ${packages.length} publishable workspaces at ${root.version}: ${packages.map((pkg) => pkg.name).join(', ')}`);
