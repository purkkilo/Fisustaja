import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import fi from "vuetify/lib/locale/fi";
import en from "vuetify/lib/locale/en";

export default new Vuetify({
  lang: {
    locales: { en, fi },
    current: "fi",
  },
});
