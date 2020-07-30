import Vue from 'vue'
import App from './App.vue'
import 'materialize-css/dist/css/materialize.min.css'
import router from './router'
import store from './store'
import VueSimpleAlert from "vue-simple-alert";
import vuetify from './plugins/vuetify'; //Breaks layout as is, needs styling
import vSelect from "vue-select";

Vue.component("vue-select", vSelect);
Vue.use(VueSimpleAlert);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
