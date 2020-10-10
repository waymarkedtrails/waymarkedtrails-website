export function WindowHash(page, params = new Map()) {
    var obj = {};

    obj.set_page = function(page_name) {
        page = page_name;
    };

    obj.get_page = function() {
        return page;
    }

    obj.get_params = function() {
        return params;
    }

    obj.with_param = function(k, f) {
        if (params.has(k)) {
            f(params.get(k));
        }
    }

    obj.set_param = function(k, v) {
        params.set(k, v);
    };

    obj.clear = function() {
        params.clear();
    };

    let to_str = function() {
        let h = '#' + page;

        if (params.size > 0) {
            let delim = '?';
            for (const k of params.keys()) {
                h += delim + encodeURI(k) + '=' + encodeURI(params.get(k));
                delim = '&';
            }
        }

        return h;
    };

    obj.replace_history = function() {
        window.history.replaceState(window.history.state, document.title, to_str());
    };

    obj.push_history = function() {
        window.history.pushState({}, '', to_str());
    };

    if (typeof page !== 'undefined') {
        return obj;
    }

    if (!window.location.hash) {
        page = '';
        return obj;
    }

    let parts = window.location.hash.substr(1).split('?', 2);
    page = parts[0];

    if (parts.length > 1) {
        parts[1].split('&').forEach(function(param) {
            let kv = param.split('=');
            if (kv.length == 2) {
                params.set(decodeURI(kv[0]), decodeURI(kv[1]));
            }
        });
    }

    return obj;
};
