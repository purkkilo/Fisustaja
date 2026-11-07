import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import alerts from "./plugins/alerts";
import { useMainStore } from "./store";
import { tableHeaders } from "./utils/tableHeaders";

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
app.use(alerts);

app.config.globalProperties.$http = axios;
app.config.globalProperties.$tableHeaders = tableHeaders;
// Components keep using this.$store / $store in templates, now backed by Pinia
app.config.globalProperties.$store = useMainStore(pinia);

app.mount("#app");
