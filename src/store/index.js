import Vue from 'vue'
import Vuex from 'vuex'
import authModule from './modules/auth.js';
import snackbarModule from './modules/snackbar.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth: authModule,
        snackbar: snackbarModule,
    }
});
