import { WindowHash } from './util/window_hash.js';

const hash = new WindowHash();

class PageState {
    page = $state(hash.page);
    params = hash.params;

    show_page(page = '', params = []) {
        this.params = new Map(params);
        this.page = page;
    }

    toggle_page(page_name) {
        this.params = new Map();
        if (this.page === page_name) {
            this.page = '';
        } else {
            this.page = page_name;
        }
    }
};

export const page_state = new PageState();
