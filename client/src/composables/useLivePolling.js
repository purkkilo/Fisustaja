import { onBeforeUnmount, toValue, watch } from "vue";

/**
 * Calls `refresh` every `intervalMs` while `active` is true.
 * - Skips a round while the browser tab is hidden (phones in a pocket,
 *   background tabs) and catches up as soon as the tab is shown again.
 * - Never runs two refreshes at once.
 *
 * @param {() => Promise<unknown>} refresh
 * @param {{ active: import("vue").MaybeRefOrGetter<boolean>, intervalMs?: number }} options
 */
export function useLivePolling(refresh, { active, intervalMs = 30000 }) {
  let timer = null;
  let running = false;
  let lastRun = 0;

  async function tick() {
    if (running || document.hidden) return;
    running = true;
    try {
      await refresh();
    } finally {
      lastRun = Date.now();
      running = false;
    }
  }

  function start() {
    stop();
    lastRun = Date.now(); // the page has just loaded the results
    timer = setInterval(tick, intervalMs);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function onVisibilityChange() {
    if (timer && !document.hidden && Date.now() - lastRun >= intervalMs) tick();
  }

  watch(
    () => !!toValue(active),
    (on) => (on ? start() : stop()),
    { immediate: true },
  );
  document.addEventListener("visibilitychange", onVisibilityChange);

  onBeforeUnmount(() => {
    stop();
    document.removeEventListener("visibilitychange", onVisibilityChange);
  });
}
