import { API_URL } from '../config.js';

export function json_load(url, params, signal) {
    let urlobj = new URL(url.startsWith('http') ? url : API_URL + url);
    urlobj.search = new URLSearchParams(params).toString();

    return fetch(urlobj, {signal})
        .catch((e) => {throw new Error('error.load_error'); })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(res.status == 404 ? 'error.object_not_found' : 'error.load_error');
        });
}
