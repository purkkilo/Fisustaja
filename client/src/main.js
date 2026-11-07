import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";

// Set up axios for api calls
const token = localStorage.getItem("jwt");
if (token) {
  axios.defaults.headers.common["Authorization"] = token;
}

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vuetify);

app.mount("#app");
