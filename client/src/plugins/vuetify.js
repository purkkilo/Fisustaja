import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "../styles/vuetify-compat.css";

import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { en, fi } from "vuetify/locale";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";

import i18n from "../i18n";

// Vuetify's own texts (pagination, "No data available"...) follow the vue-i18n locale
i18n.global.mergeLocaleMessage("en", { $vuetify: en });
i18n.global.mergeLocaleMessage("fi", { $vuetify: fi });

const preferences = JSON.parse(localStorage.getItem("preferences") || "{}");

// Vuetify 2 defaults that the app was designed around
const field = { variant: "underlined", color: "primary" };

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  // Keep Vuetify 2/3 breakpoints so the existing md/lg/xl layouts stay the same
  display: {
    thresholds: {
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  theme: {
    defaultTheme: preferences.isDark ? "dark" : "light",
    variations: {
      colors: ["primary", "secondary", "accent"],
      lighten: 3,
      darken: 3,
    },
    themes: {
      light: {
        colors: {
          // Vuetify 2 default palette
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
      dark: {
        colors: {
          primary: "#2196F3",
          secondary: "#424242",
          accent: "#FF4081",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
    },
  },
  defaults: {
    VTextField: field,
    VSelect: field,
    VAutocomplete: field,
    VCombobox: field,
    VTextarea: field,
    VDataTable: { hover: true },
  },
});
