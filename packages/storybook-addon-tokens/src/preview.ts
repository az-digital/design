// Preview annotation (added by the preset): hands the token data to the
// Tokens tab, which runs in Storybook's manager and can't load it itself.
import { addons } from 'storybook/preview-api';
import { DATA_EVENT, REQUEST_EVENT } from './constants';
import data from './preview-data';

addons.ready().then((channel) => {
  channel.on(REQUEST_EVENT, () => channel.emit(DATA_EVENT, data));
  channel.emit(DATA_EVENT, data);
});
