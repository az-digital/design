// Type for the build-time token data the preset's Vite plugin serves.
import type { TokensData } from './store';

declare module 'virtual:az-design-tokens' {
  const data: TokensData;
  export default data;
}
