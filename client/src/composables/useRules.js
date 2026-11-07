import { useI18n } from "vue-i18n";

/** Translated Vuetify validation rules for form fields. */
export function useRules({ maxLength = 40 } = {}) {
  const { t } = useI18n();
  const required = (v) => !!v || v === 0 || t("rules.no-empty");
  const max = (v) => String(v ?? "").length <= maxLength || t("rules.max-len");
  const number = (v) => !isNaN(v ?? "") || t("rules.not-number");
  const positive = (v) => (Number(v) || 0) >= 0 || t("rules.must-be-positive");
  return {
    text: [required, max],
    number: [required, number, positive],
    optionalNumber: [number, positive],
  };
}
