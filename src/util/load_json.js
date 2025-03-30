import { API_URL } from '../config.js';
import { get_stored_locale } from '../i18n.js';

export function json_load(url, params, signal) {
    let urlobj = new URL(url.startsWith('http') ? url : API_URL + url);
    urlobj.search = new URLSearchParams(params).toString();

    const options = {signal: signal};
    const current_language = get_stored_locale();
    if (current_language !== null) {
        options.headers = {'Accept-Language': current_language};
    }

    return fetch(urlobj, options)
        .catch((e) => {throw new Error('error.load_error'); })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(res.status == 404 ? 'error.object_not_found' : 'error.load_error');
        });
}
