import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueSimpleAlert from "vue-simple-alert";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import vSelect from "vue-select";
import axios from "axios";
import i18n from './i18n'

Vue.component("vue-select", vSelect);
Vue.use(VueSimpleAlert);
Vue.config.productionTip = false;

// Set up axios for api calls
Vue.prototype.$http = axios;
const token = localStorage.getItem("jwt");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount("#app");
