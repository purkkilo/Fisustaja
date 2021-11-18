import Vue from "vue";
import App from "./App.vue";
import "materialize-css/dist/css/materialize.min.css";
import router from "./router";
import store from "./store";
import VueSimpleAlert from "vue-simple-alert";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import vSelect from "vue-select";
import moment from "moment";
import "moment/locale/fi";
import axios from "axios";

Vue.component("vue-select", vSelect);
Vue.use(VueSimpleAlert);
Vue.config.productionTip = false;

moment.locale("fi");
Vue.prototype.$moment = moment;

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
  render: (h) => h(App),
}).$mount("#app");
