import { onBeforeUnmount, toValue, watchEffect } from "vue";

/** Browser tab title "<name> · Fisustaja" while the page is open. */
export function usePageTitle(name) {
  const original = document.title;
  watchEffect(() => {
    const value = toValue(name);
    document.title = value ? `${value} · Fisustaja` : original;
  });
  onBeforeUnmount(() => (document.title = original));
}
