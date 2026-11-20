import { resolve } from 'node:path';
import { readBuildInfo } from './node/buildInfo.ts';

export const managerHead = async (head, options) => {
  const buildInfo = readBuildInfo(resolve(options.configDir, '../../..'));
  const script = `<script>globalThis.AZ_DESIGN_BUILD = ${JSON.stringify(buildInfo).replace(/</g, '\\u003c')};</script>`;
  return `${head}\n${script}`;
};
