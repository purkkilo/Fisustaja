<template>
  <!-- Dark band on every competition page: which competition, its state,
       the countdown and the race-day steps in order. -->
  <header v-if="competition" class="fs-comp-header">
    <nav :aria-label="$t('shell.breadcrumb')" class="fs-comp-header__crumbs">
      <router-link to="/dashboard">{{ $t("shell.home") }}</router-link>
      <span aria-hidden="true">/</span>
      <span>{{ competition.name }}</span>
    </nav>

    <div class="fs-comp-header__row">
      <div class="fs-comp-header__title">
        <div class="d-flex align-center flex-wrap ga-3">
          <h1>{{ competition.name }}</h1>
          <span class="fs-comp-header__status">
            <span aria-hidden="true" class="fs-comp-header__dot"></span>
            {{ $t(status.label) }}
          </span>
        </div>
        <span class="fs-comp-header__meta">{{ meta }}</span>
      </div>
      <div v-if="clock" class="fs-comp-header__clock">
        <span
          v-if="clock.text"
          class="fs-display fs-num fs-comp-header__time"
          >{{ clock.text }}</span
        >
        <span class="fs-comp-header__clock-label">{{
          $t(clock.labelKey)
        }}</span>
      </div>
    </div>

    <nav :aria-label="$t('shell.steps')" class="fs-comp-header__tabs">
      <router-link
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="fs-comp-header__tab"
        :class="{
          'fs-comp-header__tab--active': tab.active,
          'fs-comp-header__tab--push': tab.push,
        }"
        :aria-current="tab.active ? 'page' : undefined"
      >
        <span
          v-if="tab.badge"
          aria-hidden="true"
          class="fs-comp-header__badge"
          :class="tab.badgeClass"
          >{{ tab.badge }}</span
        >
        <v-icon v-if="tab.icon" :icon="tab.icon" size="18" />
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count"
          class="fs-comp-header__count"
          :class="tab.countClass"
          >{{ tab.count }}</span
        >
      </router-link>
    </nav>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useMainStore } from "@/store";
import CompetitionService from "@/services/CompetitionService";
import { useCompetitionClock } from "@/composables/useCompetitionClock";
import { competitionStatus } from "@/utils/competitionStatus";

const store = useMainStore();
const route = useRoute();
const { t, locale } = useI18n();

// Pages load the competition into the store; until they do, use our own copy
const fetched = ref(null);
const competition = computed(() => store.competition ?? fetched.value);
const { now, clock } = useCompetitionClock(competition);

onMounted(async () => {
  if (store.competition) return;
  const stored = JSON.parse(localStorage.getItem("competition") || "null");
  if (!stored?._id) return;
  try {
    fetched.value = await CompetitionService.getById(stored._id);
  } catch (err) {
    console.error(err.message);
  }
});

const status = computed(() => competitionStatus(competition.value, now.value));

const meta = computed(() => {
  const c = competition.value;
  const start = new Date(c.start_date);
  const end = new Date(c.end_date);
  const lang = locale.value === "fi" ? "fi-FI" : "en-GB";
  const time = (d) =>
    d.toLocaleTimeString(lang, { hour: "numeric", minute: "2-digit" });
  const day = start.toLocaleDateString(lang, {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
  return [
    c.locality,
    `${day} ${time(start)}–${time(end)}`,
    c.isCupCompetition ? c.cup_name : null,
  ]
    .filter(Boolean)
    .join(" · ");
});

// counts only once the page has loaded the signees
const signees = computed(() =>
  Array.isArray(store.competition?.signees) ? store.competition.signees : null,
);
const onWater = computed(
  () => signees.value?.filter((s) => !s.returned).length ?? 0,
);
const signingDone = computed(() =>
  ["weighing", "all-returned", "finished"].includes(status.value.key),
);

const tabs = computed(() =>
  [
    { to: "/overview", label: t("steps.overview") },
    {
      to: "/signing",
      label: t("steps.signing"),
      badge: signingDone.value ? "✓" : "1",
      badgeClass: "bg-signing",
      count: signees.value ? String(signees.value.length) : "",
      countClass: "fs-comp-header__count--plain",
    },
    {
      to: "/weighting",
      label: t("steps.weighing"),
      badge: "2",
      badgeClass: "bg-weighing",
      count:
        signees.value && onWater.value
          ? t("steps.on-water", { n: onWater.value })
          : "",
      countClass: "bg-weighing",
    },
    {
      to: "/results",
      label: t("steps.results"),
      badge: "3",
      badgeClass: "fs-comp-header__badge--ring",
    },
    {
      to: "/comp-settings",
      label: t("steps.settings"),
      icon: "mdi-tune-variant",
      push: true,
    },
  ].map((tab) => ({ ...tab, active: route.path === tab.to })),
);
</script>

<style scoped>
.fs-comp-header {
  background: rgb(var(--v-theme-lake));
  color: #ffffff;
  padding: 18px 40px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (max-width: 700px) {
  .fs-comp-header {
    padding: 16px 16px 0;
  }
}
.fs-comp-header__crumbs {
  display: flex;
  gap: 6px;
  font-size: 14px;
  color: #a9becb;
}
.fs-comp-header__crumbs a {
  color: #c3d5e0;
  text-decoration: none;
}
.fs-comp-header__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.fs-comp-header__title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 320px;
}
.fs-comp-header__title h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.15;
}
.fs-comp-header__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f2c46d;
  color: #3b2604;
  font-size: 13px;
  font-weight: 700;
}
.fs-comp-header__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b2604;
}
.fs-comp-header__meta {
  color: #c3d5e0;
  font-size: 14px;
}
.fs-comp-header__clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.fs-comp-header__time {
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
}
.fs-comp-header__clock-label {
  font-size: 13px;
  color: #c3d5e0;
}
.fs-comp-header__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: flex-end;
}
.fs-comp-header__tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 16px;
  border-radius: 12px 12px 0 0;
  color: #d3e0e8;
  font-weight: 600;
  text-decoration: none;
}
.fs-comp-header__tab:hover {
  background: rgba(255, 255, 255, 0.08);
}
.fs-comp-header__tab--active,
.fs-comp-header__tab--active:hover {
  height: 52px;
  padding: 0 20px;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  font-weight: 700;
}
.fs-comp-header__tab--push {
  margin-left: auto;
}
.fs-comp-header__badge {
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
.fs-comp-header__badge--ring {
  border: 2px solid #f2c46d;
  color: #f2c46d;
}
.fs-comp-header__tab--active .fs-comp-header__badge--ring {
  border-color: rgb(var(--v-theme-results));
  color: rgb(var(--v-theme-results));
}
.fs-comp-header__count {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 13px;
}
.fs-comp-header__count--plain {
  background: #1f4a63;
  color: #d3e0e8;
}
.fs-comp-header__tab--active .fs-comp-header__count--plain {
  background: rgb(var(--v-theme-signing-soft));
  color: rgb(var(--v-theme-on-background));
}
</style>
