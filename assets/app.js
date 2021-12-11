/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'
import Cookies from 'js-cookie';
import Vue from 'vue';
import VueMeta from 'vue-meta';
Vue.use(VueMeta);
Vue.use(Vuetify);
Vue.use(Cookies);

import Routes from './router';
import Store from './store'
import App from './App';

const app = new Vue({
    vuetify: new Vuetify(),
    el: '#app',
    router: Routes,
    store: Store,
    render: h => h(App),
});

export default app;
