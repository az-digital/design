import type {} from './virtual';
// Preview-only: loads the build-time token data into the store. Imported by
// the package entry and the preview annotation, so the data is set before any
// doc block or story reads it.
import data from 'virtual:az-design-tokens';
import { setTokensData } from './store';

setTokensData(data);

export default data;
