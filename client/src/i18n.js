import { createI18n } from "vue-i18n";

// Load every locales/*.json file (replaces webpack's require.context)
function loadLocaleMessages() {
  const locales = import.meta.glob("./locales/*.json", { eager: true });
  const messages = {};
  for (const [path, module] of Object.entries(locales)) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/i);
    if (matched) {
      messages[matched[1]] = module.default;
    }
  }
  return messages;
}

const preferences = JSON.parse(localStorage.getItem("preferences") || "{}");

const i18n = createI18n({
  legacy: false, // Composition mode: the legacy API is removed in vue-i18n 12
  globalInjection: true, // $t, $i18n in templates and Options API components
  locale: preferences.lang || import.meta.env.VITE_I18N_LOCALE || "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || "en",
  messages: loadLocaleMessages(),
  missingWarn: false,
  fallbackWarn: false,
});

/** Translate outside components, e.g. in shared.js */
export const t = (...args) => i18n.global.t(...args);

export default i18n;
