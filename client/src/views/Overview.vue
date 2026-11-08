<template>
  <!-- /overview: the selected competition at a glance -->
  <div class="fs-page overview">
    <v-alert v-if="!competitionId" type="info" variant="tonal">
      {{ $t("overview-page.not-selected") }}
      <template #append>
        <v-btn to="/dashboard" variant="text">{{ $t("shell.home") }}</v-btn>
      </template>
    </v-alert>
    <v-alert v-else-if="error" type="error" variant="tonal">{{
      $t(error)
    }}</v-alert>

    <template v-if="competition">
      <PageHead
        :title="competition.name"
        :eyebrow="$t('overview')"
        :subtitle="when"
        tone="weighing"
      >
        <template #badges>
          <StatusChip :status="status" />
        </template>
        <template #actions>
          <v-btn
            to="/comp-settings"
            variant="outlined"
            prepend-icon="mdi-cog-outline"
            >{{ $t("overview-page.edit-settings") }}</v-btn
          >
        </template>
      </PageHead>

      <div class="overview__steps">
        <StatTile
          tone="signing"
          icon="mdi-clipboard-account-outline"
          :label="$t('steps.signing')"
          :value="summary.boats"
          :unit="$t('dashboard.boats')"
          :note="$t('overview-page.signed-up')"
          :active="step === 'signing'"
          :loading="loading && !results"
          to="/signing"
        />
        <StatTile
          tone="weighing"
          icon="mdi-scale"
          :label="$t('steps.weighing')"
          :value="`${summary.returned} / ${summary.boats}`"
          :progress="summary.returnedPct"
          :note="
            summary.onWater
              ? $t('dashboard.on-water', { n: summary.onWater })
              : $t('dashboard.none-on-water')
          "
          :active="step === 'weighing'"
          :loading="loading && !results"
          to="/weighting"
        />
        <StatTile
          tone="results"
          icon="mdi-trophy-outline"
          :label="$t('steps.results')"
          :value="formatKg(summary.totalWeight, lang)"
          unit="kg"
          :note="
            competition.isPublic
              ? $t('dashboard.results-public')
              : $t('dashboard.results-hidden')
          "
          :active="step === 'results'"
          :loading="loading && !results"
          to="/results"
        />
      </div>

      <div class="overview__grid">
        <FsSection
          class="overview__catch"
          icon="mdi-fish"
          :title="$t('overview-page.catch')"
        >
          <template #actions>
            <span v-if="summary.boats" class="fs-muted font-weight-bold">{{
              $t("overview-page.with-fish", {
                pct: summary.withFishPct,
                n: summary.withFish,
                total: summary.boats,
              })
            }}</span>
          </template>

          <p v-if="!summary.totalWeight" class="fs-muted">
            {{ $t("overview-page.no-catch") }}
          </p>
          <ul class="catch-list">
            <li v-for="fish in summary.species" :key="fish.name">
              <span
                aria-hidden="true"
                class="catch-list__dot"
                :style="{ background: fish.color || 'currentColor' }"
              ></span>
              <div class="catch-list__name">
                <strong>{{ fish.name }}</strong>
                <span class="fs-muted">
                  × {{ fish.multiplier }} ·
                  {{ $t("overview-page.min-size", { cm: fish.minsize }) }}
                </span>
              </div>
              <div aria-hidden="true" class="catch-list__bar">
                <div
                  :style="{
                    width: fish.share + '%',
                    background: fish.color || 'rgb(var(--v-theme-weighing))',
                  }"
                ></div>
              </div>
              <span class="fs-num catch-list__kg"
                >{{ formatKg(fish.weight, lang) }} kg</span
              >
            </li>
          </ul>
        </FsSection>

        <FsSection
          class="overview__details"
          icon="mdi-information-outline"
          :title="$t('overview-page.details')"
        >
          <dl class="details">
            <div>
              <dt>{{ $t("overview-page.when") }}</dt>
              <dd>{{ when }}</dd>
            </div>
            <div>
              <dt>{{ $t("overview-page.where") }}</dt>
              <dd>{{ competition.locality || "–" }}</dd>
            </div>
            <div>
              <dt>{{ $t("cup.normal") }}</dt>
              <dd>
                {{
                  competition.isCupCompetition
                    ? competition.cup_name
                    : $t("overview-page.no-cup")
                }}
              </dd>
            </div>
            <template v-if="competition.isCupCompetition">
              <div>
                <dt>{{ $t("overview-page.cup-multiplier") }}</dt>
                <dd>× {{ competition.cup_points_multiplier }}</dd>
              </div>
              <div>
                <dt>{{ $t("participation-points") }}</dt>
                <dd>{{ competition.cup_participation_points }}</dd>
              </div>
            </template>
            <div>
              <dt>{{ $t("overview-page.team") }}</dt>
              <dd>
                {{ competition.isTeamCompetition ? $t("yes") : $t("no") }}
              </dd>
            </div>
            <div>
              <dt>{{ $t("status") }}</dt>
              <dd class="d-flex flex-wrap ga-2">
                <StatusChip :status="status" />
                <v-chip
                  size="small"
                  variant="tonal"
                  :color="competition.isPublic ? 'signing' : undefined"
                  :prepend-icon="
                    competition.isPublic ? 'mdi-earth' : 'mdi-lock-outline'
                  "
                  >{{
                    competition.isPublic
                      ? $t("dashboard.public")
                      : $t("dashboard.private")
                  }}</v-chip
                >
              </dd>
            </div>
          </dl>
          <v-btn
            to="/comp-settings"
            variant="outlined"
            prepend-icon="mdi-cog-outline"
            >{{ $t("overview-page.edit-settings") }}</v-btn
          >
        </FsSection>
      </div>
    </template>
    <v-skeleton-loader
      v-else-if="loading"
      type="heading, table"
      class="fs-panel"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService.js";
import { competitionSummary, formatKg } from "@/utils/overview";
import { activeStep, competitionStatus } from "@/utils/competitionStatus";
import FsSection from "../components/ui/FsSection.vue";
import PageHead from "../components/ui/PageHead.vue";
import StatTile from "../components/ui/StatTile.vue";
import StatusChip from "../components/StatusChip.vue";

defineOptions({ name: "Overview" });
const store = useMainStore();
const { locale } = useI18n();

const stored = JSON.parse(localStorage.getItem("competition") || "null");
const competitionId = stored?._id ?? null;

const competition = ref(null);
const results = ref(null);
const loading = ref(false);
const error = ref("");

const lang = computed(() => (locale.value === "fi" ? "fi-FI" : "en-GB"));
const summary = computed(() =>
  competitionSummary(competition.value, results.value),
);
const status = computed(() => competitionStatus(competition.value));
const step = computed(() => activeStep(status.value.key));

const when = computed(() => {
  const c = competition.value;
  const start = new Date(c.start_date);
  const end = new Date(c.end_date);
  const date = (d) => d.toLocaleDateString(lang.value);
  const time = (d) =>
    d.toLocaleTimeString(lang.value, { hour: "numeric", minute: "2-digit" });
  return start.toDateString() === end.toDateString()
    ? `${date(start)} ${time(start)}–${time(end)}`
    : `${date(start)} ${time(start)} – ${date(end)} ${time(end)}`;
});

async function load(id) {
  loading.value = true;
  error.value = "";
  try {
    const found = await CompetitionService.getById(id);
    const list = await ResultService.list({ competition_id: found._id });
    found.signees = list;
    competition.value = found;
    results.value = list;
    store.refreshCompetition(found);
    if (found.cup_id) localStorage.setItem("cup", found.cup_id);
  } catch (err) {
    console.error(err.response?.data?.error || err.message);
    error.value = "overview-page.load-failed";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (competitionId) load(competitionId);
});
</script>

<style scoped>
.overview {
  max-width: 1320px;
}
.overview__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 800px) {
  .overview__steps {
    grid-template-columns: minmax(0, 1fr);
  }
}
.overview__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.overview__catch {
  flex: 2 1 520px;
}
.overview__details {
  flex: 1 1 300px;
}
.catch-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.catch-list li {
  display: grid;
  grid-template-columns: 14px minmax(140px, 1.2fr) minmax(80px, 2fr) 90px;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.catch-list li:last-child {
  border-bottom: 0;
}
.catch-list__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.catch-list__name {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.catch-list__name .fs-muted {
  font-size: 13px;
}
.catch-list__bar {
  height: 10px;
  border-radius: 999px;
  background: rgba(var(--v-border-color), 0.08);
  overflow: hidden;
}
.catch-list__bar > div {
  height: 100%;
  border-radius: 999px;
}
.catch-list__kg {
  text-align: right;
  font-weight: 700;
}
.details {
  margin: 0;
  display: flex;
  flex-direction: column;
}
.details > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.details dt {
  color: rgb(var(--v-theme-muted));
  font-weight: 600;
}
.details dd {
  margin: 0;
  text-align: right;
  font-weight: 600;
}
</style>
