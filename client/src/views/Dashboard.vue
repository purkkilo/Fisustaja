<template>
  <!-- /dashboard: today's competition first, then all competitions and cups -->
  <div class="fs-page dash">
    <header class="dash__head">
      <div class="dash__greeting">
        <span class="fs-muted">{{ todayText }}</span>
        <h1>{{ greeting }}</h1>
      </div>
      <v-text-field
        v-model="search"
        :label="$t('dashboard.search')"
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        hide-details
        clearable
        class="dash__search"
      />
      <v-btn
        to="/register-comp"
        color="signing"
        size="large"
        prepend-icon="mdi-plus"
        >{{ $t("dashboard.new-competition") }}</v-btn
      >
    </header>

    <v-alert v-if="error" type="error" variant="tonal">{{ $t(error) }}</v-alert>

    <v-skeleton-loader
      v-if="loading && !competitions.length"
      type="article"
      class="fs-panel"
    />
    <TodayCard
      v-else-if="today"
      :competition="today"
      :signees="todaySignees"
      @open="(path) => openCompetition(today, path)"
    />
    <section v-else class="fs-panel dash__empty">
      <div>
        <span class="fs-eyebrow text-signing">{{ $t("dashboard.today") }}</span>
        <h2>{{ $t("dashboard.no-today") }}</h2>
        <span v-if="upcoming" class="fs-muted">
          {{ $t("dashboard.next") }}: <strong>{{ upcoming.name }}</strong
          >,
          {{ formatDate(upcoming.start_date) }}
        </span>
      </div>
      <v-btn
        v-if="upcoming"
        color="weighing"
        variant="outlined"
        @click="openCompetition(upcoming)"
        >{{ $t("dashboard.open") }}</v-btn
      >
    </section>

    <div class="dash__grid">
      <CompetitionsTable
        class="dash__comps"
        :competitions="competitions"
        :search="search || ''"
        :loading="loading"
        @open="(c) => openCompetition(c)"
      />

      <section aria-labelledby="cups-title" class="dash__cups">
        <div class="d-flex align-center justify-space-between ga-3">
          <h2 id="cups-title">{{ $t("dashboard.cups") }}</h2>
          <v-btn
            variant="text"
            color="signing"
            prepend-icon="mdi-plus"
            @click="cupDialog = true"
            >{{ $t("dashboard.new-cup") }}</v-btn
          >
        </div>
        <CupCard
          v-for="cup in cups"
          :key="cup._id"
          :cup="cup"
          :progress="cupProgress[cup._id]"
          @open="openCup"
        />
        <p v-if="!loading && !cups.length" class="fs-muted">
          {{ $t("dashboard.no-cups") }}
        </p>
      </section>
    </div>

    <CreateCupDialog v-model="cupDialog" :saving="savingCup" @save="saveCup" />
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";
import { useDashboard } from "@/composables/useDashboard";
import TodayCard from "../components/dashboard/TodayCard.vue";
import CompetitionsTable from "../components/dashboard/CompetitionsTable.vue";
import CupCard from "../components/dashboard/CupCard.vue";
import CreateCupDialog from "../components/dashboard/CreateCupDialog.vue";
import NotificationBar from "../components/NotificationBar.vue";

defineOptions({ name: "Dashboard" });
const store = useMainStore();
const { t, locale } = useI18n();

const {
  loading,
  savingCup,
  error,
  competitions,
  cups,
  today,
  upcoming,
  todaySignees,
  cupProgress,
  load,
  openCompetition,
  openCup,
  createCup,
} = useDashboard();

const search = ref("");
const cupDialog = ref(false);
const snackbar = ref(false);
const text = ref("");

const lang = computed(() => (locale.value === "fi" ? "fi-FI" : "en-GB"));
const formatDate = (d) => new Date(d).toLocaleDateString(lang.value);
const todayText = computed(() =>
  new Date().toLocaleDateString(lang.value, {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }),
);
const greeting = computed(() => {
  const hour = new Date().getHours();
  const key =
    hour < 10
      ? "dashboard.greeting-morning"
      : hour < 18
        ? "dashboard.greeting-day"
        : "dashboard.greeting-evening";
  const first = (store.user?.name || "").split(/\s+/)[0];
  return first ? `${t(key)}, ${first}` : t(key);
});

async function saveCup(form) {
  const created = await createCup(form);
  if (!created) return;
  cupDialog.value = false;
  text.value = "dashboard.cup-created";
  snackbar.value = false;
  requestAnimationFrame(() => (snackbar.value = true));
}

onMounted(() => {
  // the dashboard is "outside" any competition or cup
  store.refreshCompetition(null);
  localStorage.removeItem("competition");
  store.refreshCup(null);
  localStorage.removeItem("cup");
  load();
});
</script>

<style scoped>
.dash {
  max-width: 1240px;
}
.dash__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
.dash__greeting {
  display: flex;
  flex-direction: column;
  flex: 1 1 260px;
}
.dash__greeting span::first-letter {
  text-transform: uppercase;
}
.dash__greeting h1 {
  margin: 0;
  font-size: 30px;
}
.dash__search {
  flex: 0 1 320px;
  min-width: 220px;
}
.dash__empty {
  padding: 28px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-radius: 20px;
}
.dash__empty h2 {
  margin: 4px 0;
  font-size: 28px;
}
.dash__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.dash__comps {
  flex: 2 1 560px;
  min-width: 0;
}
.dash__cups {
  flex: 1 1 300px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dash__cups h2 {
  margin: 0;
  font-size: 22px;
}
</style>
