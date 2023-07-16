import { API_URL } from '../config.js';

export function json_loader(done, error, base_url = API_URL) {
    let current = 0;
    return {
        load : function(url, params) {
            let my_request = ++current;
            let urlobj = new URL(base_url + url);
            urlobj.search = new URLSearchParams(params).toString();
            fetch(urlobj)
                .then(function(response) {
                    if (my_request == current) {
                        if (response.ok) {
                            response.json().then(done);
                        } else if (response.status == 404) {
                            error('error.object_not_found');
                        } else {
                            error('error.load_error');
                        }
                    }
                })
                .catch(function(e) { error('error.load_error'); });
        },
        abort : function() { ++current; }
    };
}
