import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";
import vuetify from "./plugins/vuetify";
import { setupAuthInterceptor } from "./services/http";
import { useMainStore } from "./store";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vuetify);

const store = useMainStore();
setupAuthInterceptor({
  onUnauthorized: () => {
    store.clearSession();
    if (router.currentRoute.value.meta?.requiresAuth) {
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }
  },
});

app.mount("#app");
