import { addons } from 'storybook/manager-api';
import { colorSchemeQuery, getAzTheme } from './azTheme';

const updateTheme = () => addons.setConfig({ theme: getAzTheme() });

updateTheme();
globalThis.matchMedia(colorSchemeQuery).addEventListener('change', updateTheme);
