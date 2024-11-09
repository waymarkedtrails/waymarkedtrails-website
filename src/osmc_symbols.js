import './i18n.js';
import { mount } from 'svelte';
import App from './OsmcApp.svelte';

const app = mount(App, {target: document.body});

export default app;
