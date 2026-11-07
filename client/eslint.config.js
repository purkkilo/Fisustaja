import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import vuetify from "eslint-plugin-vuetify";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  // Flags leftover Vuetify 2/3 components, props, classes and slots
  ...vuetify.configs["flat/recommended"],
  ...vuetify.configs["flat/recommended-v4"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
