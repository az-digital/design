// Preview-only: loads the build-time token data into the store. Imported by
// the package entry and the preview annotation, so the data is set before any
// doc block or story reads it.
// @ts-expect-error -- served at build time by this addon's Vite plugin (src/node/vite-plugin.js); it has no file on disk to type.
import collected from 'virtual:az-design-tokens';
import { setTokensData, type TokensData } from './store';

const data = collected as TokensData;
setTokensData(data);

export default data;
