// Preview annotation (added by the preset): hands the token data to the
// Tokens tab, which runs in Storybook's manager and can't load it itself, and
// follows Storybook's globals to show the matching token mode (e.g. dark).
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { DATA_EVENT, REQUEST_EVENT } from './constants';
import data from './preview-data';
import { modeForGlobals, setActiveMode } from './store';

addons.ready().then((channel) => {
  channel.on(REQUEST_EVENT, () => channel.emit(DATA_EVENT, data));
  channel.emit(DATA_EVENT, data);

  const followGlobals = ({ globals }: { globals: Record<string, unknown> }) => setActiveMode(modeForGlobals(globals));
  channel.on(SET_GLOBALS, followGlobals);
  channel.on(GLOBALS_UPDATED, followGlobals);
});
