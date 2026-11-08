<template>
  <!-- "Today": the running competition, its three steps and where to go next -->
  <section aria-labelledby="today-title" class="fs-panel today">
    <div class="today__top">
      <div class="today__title">
        <div class="d-flex align-center flex-wrap ga-3">
          <span class="fs-eyebrow text-signing">{{
            $t("dashboard.today")
          }}</span>
          <StatusChip :status="status" />
        </div>
        <h2 id="today-title">{{ competition.name }}</h2>
        <span class="fs-muted">{{ meta }}</span>
      </div>
      <div v-if="clock" class="today__clock">
        <span class="today__clock-label fs-muted">{{
          $t(clock.labelKey)
        }}</span>
        <span v-if="clock.text" class="fs-display fs-num today__clock-time">{{
          clock.text
        }}</span>
      </div>
    </div>

    <ol :aria-label="$t('shell.steps')" class="today__steps">
      <li
        class="today__step today__step--signing"
        :aria-current="step === 'signing' ? 'step' : undefined"
        :class="{ 'today__step--active': step === 'signing' }"
      >
        <span class="today__step-title">
          <span aria-hidden="true" class="today__badge bg-signing">
            <v-icon v-if="step !== 'signing'" icon="mdi-check" size="16" />
            <template v-else>1</template>
          </span>
          {{ $t("steps.signing") }}
        </span>
        <span class="fs-display fs-num today__big">
          {{ signeeCount ?? "–" }}
          <span class="today__unit">{{ $t("dashboard.boats") }}</span>
        </span>
      </li>

      <li
        class="today__step today__step--weighing"
        :aria-current="step === 'weighing' ? 'step' : undefined"
        :class="{ 'today__step--active': step === 'weighing' }"
      >
        <span class="today__step-title">
          <span aria-hidden="true" class="today__badge bg-weighing">2</span>
          {{ $t("steps.weighing") }}
        </span>
        <div class="d-flex align-center ga-3">
          <span class="fs-display fs-num today__big"
            >{{ returned }} / {{ signeeCount ?? 0 }}</span
          >
          <div aria-hidden="true" class="today__bar">
            <div :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        <span class="today__note">{{
          onWater
            ? $t("dashboard.on-water", { n: onWater })
            : $t("dashboard.none-on-water")
        }}</span>
      </li>

      <li
        class="today__step today__step--results"
        :aria-current="step === 'results' ? 'step' : undefined"
        :class="{ 'today__step--active': step === 'results' }"
      >
        <span class="today__step-title">
          <span aria-hidden="true" class="today__badge today__badge--ring"
            >3</span
          >
          {{ $t("steps.results") }}
        </span>
        <span class="today__note">{{
          competition.isPublic
            ? $t("dashboard.results-public")
            : $t("dashboard.results-hidden")
        }}</span>
      </li>
    </ol>

    <div class="d-flex flex-wrap ga-3">
      <v-btn
        :color="next.color"
        size="large"
        append-icon="mdi-arrow-right"
        @click="emit('open', next.path)"
        >{{ $t(next.label) }}</v-btn
      >
      <v-btn
        variant="outlined"
        color="results"
        size="large"
        @click="emit('open', '/results')"
        >{{ $t("dashboard.leaderboard") }}</v-btn
      >
      <v-btn
        v-if="step !== 'signing'"
        variant="text"
        color="signing"
        size="large"
        @click="emit('open', '/signing')"
        >{{ $t("dashboard.late-signing") }}</v-btn
      >
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import StatusChip from "../StatusChip.vue";
import { useCompetitionClock } from "@/composables/useCompetitionClock";
import { activeStep, competitionStatus } from "@/utils/competitionStatus";

const props = defineProps({
  competition: { type: Object, required: true },
  // results of the competition, null while loading
  signees: { type: Array, default: null },
});
const emit = defineEmits(["open"]);
const { locale } = useI18n();

const { now, clock } = useCompetitionClock(() => props.competition);
const status = computed(() => competitionStatus(props.competition, now.value));

const signeeCount = computed(() => props.signees?.length ?? null);
const returned = computed(
  () => props.signees?.filter((s) => s.returned).length ?? 0,
);
const onWater = computed(() => (signeeCount.value ?? 0) - returned.value);
const progress = computed(() =>
  signeeCount.value
    ? Math.round((returned.value / signeeCount.value) * 100)
    : 0,
);

/** The step that needs attention now. */
const step = computed(() => activeStep(status.value.key));

const next = computed(
  () =>
    ({
      signing: {
        path: "/signing",
        label: "dashboard.continue-signing",
        color: "signing",
      },
      weighing: {
        path: "/weighting",
        label: "dashboard.continue-weighing",
        color: "weighing",
      },
      results: {
        path: "/results",
        label: "dashboard.open-results",
        color: "results",
      },
    })[step.value],
);

const meta = computed(() => {
  const c = props.competition;
  const lang = locale.value === "fi" ? "fi-FI" : "en-GB";
  const time = (d) =>
    new Date(d).toLocaleTimeString(lang, {
      hour: "numeric",
      minute: "2-digit",
    });
  return [
    c.locality,
    `${time(c.start_date)}–${time(c.end_date)}`,
    c.isCupCompetition ? c.cup_name : null,
  ]
    .filter(Boolean)
    .join(" · ");
});
</script>

<style scoped>
.today {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 20px;
}
.today__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}
.today__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 360px;
}
.today__title h2 {
  margin: 0;
  font-size: 38px;
  line-height: 1.1;
}
.today__clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 160px;
}
.today__clock-label {
  font-size: 13px;
  font-weight: 600;
}
.today__clock-time {
  font-size: 48px;
  line-height: 1.05;
}
.today__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 800px) {
  .today__steps {
    grid-template-columns: minmax(0, 1fr);
  }
}
.today__step {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border-radius: 14px;
}
.today__step--signing {
  background: rgb(var(--v-theme-signing-soft));
}
.today__step--weighing {
  background: rgb(var(--v-theme-weighing-soft));
}
.today__step--results {
  background: rgb(var(--v-theme-results-soft));
}
/* the step that needs attention: dark outline */
.today__step--active {
  outline: 2px solid rgb(var(--v-theme-on-surface));
  outline-offset: -2px;
}
.today__step-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.today__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  box-sizing: border-box;
}
.today__badge--ring {
  border: 2px solid rgb(var(--v-theme-results));
  color: rgb(var(--v-theme-results));
}
.today__big {
  font-size: 28px;
}
.today__unit {
  font-family: var(--fs-font);
  font-size: 15px;
  font-weight: 500;
}
.today__bar {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: rgba(var(--v-theme-weighing), 0.25);
  overflow: hidden;
}
.today__bar > div {
  height: 100%;
  background: rgb(var(--v-theme-weighing));
}
.today__note {
  font-size: 14px;
  font-weight: 600;
}
</style>
