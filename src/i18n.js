import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';
import msg_languages from './i18n/messages.js';

export const languages = [['en', 'English'],
                          ['de', 'Deutsch']
                         ];

languages.forEach((item, idx) => {
    if (msg_languages.hasOwnProperty(item[0])) {
        register(item[0], msg_languages[item[0]])
    }
});

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
