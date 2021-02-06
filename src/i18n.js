import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

export const languages = [['en', 'English'],
                          ['de', 'Deutsch']
                         ];

register('en', () => import('./i18n/en.json'));
register('de', () => import('./i18n/de.json'));

let storedLocale = localStorage.getItem('lang');

init({
  fallbackLocale: 'en',
  initialLocale: storedLocale === null ? getLocaleFromNavigator() : storedLocale,
});

export function set_stored_locale(lang) {
    storedLocale = lang;
    if (lang === null) {
        localStorage.removeItem('lang');
        locale.set(getLocaleFromNavigator());
    } else {
        localStorage.setItem('lang', lang);
        locale.set(lang);
    }
}

export function get_stored_locale() {
    return storedLocale;
}
