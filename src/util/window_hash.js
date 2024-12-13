export class WindowHash {
    #page;
    #params;

    #to_str () {
        let h = '#' + this.#page;

        if (this.#params.size > 0) {
            let delim = '?';
            for (const k of this.#params.keys()) {
                h += delim + encodeURI(k) + '=' + encodeURI(this.#params.get(k));
                delim = '&';
            }
        }

        return h;
    }

    constructor (page, params) {
        this.#params = params ?? new Map();

        if (typeof page !== 'undefined') {
            this.#page = page;
        } else if (!window.location.hash) {
            this.#page = '';
        } else {
            const parts = window.location.hash.substr(1).split('?', 2);
            this.#page = parts[0];

            if (parts.length > 1) {
                for (const part of parts[1].split('&')) {
                    const kv = part.split('=');
                    if (kv.length == 2) {
                        this.#params.set(decodeURI(kv[0]), decodeURI(kv[1]));
                    }
                }
            }
        }
    }

    get page() {
        return this.#page;
    }

    get params() {
        return this.#params;
    }

    with_param(key, func) {
        if (this.#params.has(key)) {
            func(this.#params.get(key));
        }
    }

    set_param(k, v) {
        this.#params.set(k, v);
    }

    replace_history() {
        window.history.replaceState(window.history.state, document.title, this.#to_str());
    }

    push_history() {
        window.history.pushState({}, '', this.#to_str());
    }
};
