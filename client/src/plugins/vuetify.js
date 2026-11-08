import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import "../styles/vuetify-compat.css";
import "../styles/app.css";

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

// Redesign (design canvas "Fisustaja redesign"): lake palette with one
// colour per race-day step: signing = reed green, weighing = lake blue,
// results = amber.
const field = { variant: "outlined", color: "primary", rounded: "lg" };

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
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#F6F8F7",
          surface: "#FFFFFF",
          primary: "#2A74A0",
          secondary: "#13344A",
          accent: "#4F7A42",
          error: "#B3261E",
          info: "#2A74A0",
          success: "#4F7A42",
          warning: "#C98A1E",
          // race-day steps
          signing: "#4F7A42",
          "signing-soft": "#E3EEDD",
          weighing: "#2A74A0",
          "weighing-soft": "#DCEAF2",
          results: "#A5561A",
          "results-soft": "#FBF0DC",
          amber: "#F2C46D",
          lake: "#13344A",
          sidebar: "#0F2A3C",
          muted: "#55656E",
        },
        variables: {
          "border-color": "#13344A",
          "border-opacity": 0.14,
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#0E1A22",
          surface: "#15252F",
          primary: "#5AA7D6",
          secondary: "#9FC3DA",
          accent: "#8BC27A",
          error: "#F2B8B5",
          info: "#5AA7D6",
          success: "#8BC27A",
          warning: "#F2C46D",
          signing: "#8BC27A",
          "signing-soft": "#22351E",
          weighing: "#5AA7D6",
          "weighing-soft": "#16344A",
          results: "#F2C46D",
          "results-soft": "#3A2B12",
          amber: "#F2C46D",
          lake: "#0B1C26",
          sidebar: "#091620",
          muted: "#9FB4C1",
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
    VBtn: { rounded: "lg", class: "text-none font-weight-bold" },
    VCard: { rounded: "xl", elevation: 0, border: true },
    VChip: { rounded: "pill" },
    VDataTable: { hover: true },
    VDialog: { maxWidth: 640 },
  },
});
