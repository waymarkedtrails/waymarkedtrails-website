import WMTConfig from '../../theme.js';

export function json_loader(done, error, base_url = WMTConfig.API_URL) {
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
                        } else {
                            error(response.statusText);
                        }
                    }
                })
                .catch(error);
        },
        abort : function() { ++current; }
    };
}
