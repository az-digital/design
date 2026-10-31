export const ADDON_ID = 'az-digital/tokens';
export const PANEL_ID = `${ADDON_ID}/panel`;
/** Preview → manager: the current token data. */
export const DATA_EVENT = `${ADDON_ID}/data`;
/** Manager → preview: please send the token data (e.g. when the Tokens tab mounts). */
export const REQUEST_EVENT = `${ADDON_ID}/request`;
/** Preview → manager: show this token's details in the Tokens tab (a `Token` pill clicked in story view). */
export const SELECT_EVENT = `${ADDON_ID}/select`;
/** Manager → preview: whether the requested token can be shown in the Tokens tab. */
export const SELECT_RESULT_EVENT = `${ADDON_ID}/select-result`;
