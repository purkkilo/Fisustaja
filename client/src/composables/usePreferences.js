// Language and dark theme, remembered in localStorage "preferences".
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";

export function usePreferences() {
  const store = useMainStore();
  const { locale } = useI18n();

  function save() {
    localStorage.setItem(
      "preferences",
      JSON.stringify({ isDark: store.isDark, lang: locale.value }),
    );
  }

  function toggleLocale() {
    locale.value = locale.value === "en" ? "fi" : "en";
    save();
  }

  function toggleDark() {
    store.isDark = !store.isDark;
    save();
  }

  return {
    locale,
    isDark: computed(() => store.isDark),
    toggleLocale,
    toggleDark,
  };
}
