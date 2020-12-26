import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./i18n/en.json'));
register('de', () => import('./i18n/de.json'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
});
