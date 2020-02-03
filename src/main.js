import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Import the Auth0 configuration
let domain = process.env.VUE_APP_CLIENT_DOMAIN;
let clientId = process.env.VUE_APP_CLIENT_ID;
let audience = process.env.VUE_APP_AUDIENCE;
console.log(process.env, {domain, clientId})

// Import the plugin here
import { Auth0Plugin } from "@/plugins/auth";

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.config.productionTip = false;
//Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
