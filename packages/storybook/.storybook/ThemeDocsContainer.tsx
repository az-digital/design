import { useEffect, useState, type ComponentProps } from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { colorSchemeQuery, getAzTheme } from './azTheme';

export function ThemeDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const [theme, setTheme] = useState(getAzTheme);

  useEffect(() => {
    const preference = window.matchMedia(colorSchemeQuery);
    const updateTheme = () => setTheme(getAzTheme());
    preference.addEventListener('change', updateTheme);
    updateTheme();
    return () => preference.removeEventListener('change', updateTheme);
  }, []);

  return <DocsContainer {...props} theme={theme} />;
}
