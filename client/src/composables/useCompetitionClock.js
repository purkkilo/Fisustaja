// A ticking countdown for a competition (to its start, then to its end).
import { computed, onBeforeUnmount, ref, toValue } from "vue";
import { useI18n } from "vue-i18n";
import { competitionClock } from "@/utils/competitionStatus";

/**
 * @param competition a ref or getter returning the competition
 * @returns {{ now: Ref<Date>, clock: ComputedRef<{phase, labelKey, text} | null> }}
 */
export function useCompetitionClock(competition) {
  const { t } = useI18n();
  const now = ref(new Date());
  const timer = setInterval(() => (now.value = new Date()), 15000);
  onBeforeUnmount(() => clearInterval(timer));

  const clock = computed(() => {
    const c = toValue(competition);
    if (!c?.start_date || !c?.end_date) return null;
    return competitionClock(c, now.value, t("timer.day-unit"));
  });
  return { now, clock };
}
