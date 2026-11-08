<template>
  <!-- Cup statistics: catch, biggest fishes and signees, as charts and tables -->
  <div class="cstats">
    <PillTabs
      v-model="view"
      :items="views"
      :label="$t('general-statistics')"
      tone="results"
    />

    <!-- How the standings developed -->
    <template v-if="view === 'progress'">
      <FsSection
        v-if="progress.boats.length && competitions.length > 1"
        icon="mdi-chart-line"
        :title="$t('stats-page.progress')"
      >
        <p class="cstats__lead fs-muted">
          {{
            $t("stats-page.progress-lead", {
              n: progress.boats.length,
            })
          }}
        </p>
        <FsChart
          chart-id="cup_progress_chart"
          :config="progressConfig"
          :label="$t('stats-page.progress')"
          :height="380"
        />
      </FsSection>
      <p v-else class="fs-muted">{{ $t("stats-page.progress-needs-two") }}</p>
    </template>

    <!-- Catch totals -->
    <template v-else-if="view === 'fishes'">
      <FsSection
        v-if="byCompetition.species.length"
        icon="mdi-chart-bar-stacked"
        :title="$t('stats-page.by-competition')"
      >
        <p class="cstats__lead fs-muted">
          {{ $t("stats-page.by-competition-lead") }}
        </p>
        <FsChart
          chart-id="cup_catch_chart"
          :config="byCompetitionConfig"
          :label="$t('stats-page.by-competition')"
          :height="340"
        />
      </FsSection>
      <div class="cstats__grid">
        <FsSection
          v-if="total_fishes_chart_data"
          :title="`${$t('biggest-amounts')} (${$t('total-big')})`"
          icon="mdi-chart-bar"
        >
          <bar-chart
            :chart-data="total_fishes_chart_data"
            chart-id="total_fishes_signee_chart"
            :title="$t('biggest-amounts') + ' (' + $t('total-big') + ')'"
            :height="320"
          />
        </FsSection>
        <FsSection
          v-if="cup_fishes_total.length && showTables"
          :title="`${$t('biggest-amounts')} (${$t('total-big')})`"
          icon="mdi-table"
          flush
        >
          <v-data-table
            :headers="translated(headers_cup_fishes_total)"
            :items="cup_fishes_total"
            :loading="loading"
            item-value="index"
            density="comfortable"
          >
            <template #[`item.weights`]="{ item }">
              <span class="fs-num font-weight-bold"
                >{{ (item.weights / 1000).toLocaleString() }} kg</span
              >
            </template>
          </v-data-table>
        </FsSection>
      </div>
      <div class="cstats__grid">
        <FsSection
          v-if="competition_fishes_chart_data"
          :title="`${$t('biggest-amounts')} (${$t('comp.by')})`"
          icon="mdi-chart-bar"
        >
          <bar-chart
            :chart-data="competition_fishes_chart_data"
            chart-id="competition_fishes_signee_chart"
            :title="$t('biggest-amounts') + ' (' + $t('comp.by') + ')'"
            :height="320"
          />
        </FsSection>
        <FsSection
          v-if="cup_fishes_competition.length && showTables"
          :title="`${$t('biggest-amounts')} (${$t('comp.by')})`"
          icon="mdi-table"
          flush
        >
          <v-data-table
            :headers="translated(headers_cup_fishes_competition)"
            :items="cup_fishes_competition"
            :loading="loading"
            item-value="index"
            density="comfortable"
          >
            <template #[`item.weights`]="{ item }">
              <span class="fs-num font-weight-bold"
                >{{ (item.weights / 1000).toLocaleString() }} kg</span
              >
            </template>
          </v-data-table>
        </FsSection>
      </div>
    </template>

    <!-- Biggest fishes and amounts -->
    <template v-else-if="view === 'biggest'">
      <div class="cstats__grid">
        <FsSection
          v-if="cup_biggest_fishes_chart_data && showCharts"
          :title="`${$t('cup.is')} ${$t('biggest-fishes')}`"
          icon="mdi-chart-bar"
        >
          <bar-chart
            :chart-data="cup_biggest_fishes_chart_data"
            chart-id="cup_biggest_fishes_chart"
            :title="$t('cup.is') + ' ' + $t('biggest-fishes')"
            :height="320"
          />
        </FsSection>
        <FsSection
          v-if="cup_biggest_fishes.length && showTables"
          :title="`${$t('cup.is')} ${$t('biggest-fishes')}`"
          icon="mdi-table"
          flush
        >
          <v-data-table
            :headers="translated(headers_cup_biggest_fishes)"
            :items="cup_biggest_fishes"
            :loading="loading"
            item-value="index"
            density="comfortable"
          >
            <template #[`item.weight`]="{ item }">
              <span class="fs-num font-weight-bold"
                >{{ item.weight.toLocaleString() }} g</span
              >
            </template>
          </v-data-table>
        </FsSection>
      </div>
      <div class="cstats__grid">
        <FsSection
          v-if="cup_biggest_amounts_chart_data && showCharts"
          :title="`${$t('cup.is')} ${$t('biggest-amounts')}`"
          icon="mdi-chart-bar"
        >
          <bar-chart
            :chart-data="cup_biggest_amounts_chart_data"
            chart-id="cup_biggest_amounts_chart"
            :title="$t('cup.is') + ' ' + $t('biggest-amounts')"
            :height="320"
          />
        </FsSection>
        <FsSection
          v-if="cup_biggest_amounts.length && showTables"
          :title="`${$t('cup.is')} ${$t('biggest-amounts')}`"
          icon="mdi-table"
          flush
        >
          <v-data-table
            :headers="translated(headers_cup_biggest_amounts)"
            :items="cup_biggest_amounts"
            :loading="loading"
            item-value="index"
            density="comfortable"
          >
            <template #[`item.weight`]="{ item }">
              <span class="fs-num font-weight-bold"
                >{{ item.weight.toLocaleString() }} g</span
              >
            </template>
          </v-data-table>
        </FsSection>
      </div>
      <p
        v-if="!cup_biggest_fishes.length && !cup_biggest_amounts.length"
        class="fs-muted"
      >
        {{ $t("no-results") }}
      </p>
    </template>

    <!-- Signees -->
    <template v-else-if="view === 'signees'">
      <div v-if="cup?.signees" class="cstats__tiles">
        <StatTile
          tone="signing"
          icon="mdi-account-group"
          :label="$t('total-signees')"
          :value="cup.signees.length"
        />
      </div>
      <div class="cstats__grid">
        <FsSection
          v-if="cup_signees_chart_data && showCharts"
          :title="`${$t('total-signees')} (${$t('comp.by')})`"
          icon="mdi-chart-bar"
        >
          <bar-chart
            :chart-data="cup_signees_chart_data"
            chart-id="cup_signees_chart"
            :title="$t('total-signees') + ' (' + $t('comp.by') + ')'"
            :height="320"
          />
        </FsSection>
        <FsSection
          v-if="cup_signees.length && showTables"
          :title="`${$t('total-signees')} (${$t('comp.by')})`"
          icon="mdi-table"
          flush
        >
          <v-data-table
            :headers="translated(headers_cup_signees)"
            :items="cup_signees"
            :loading="loading"
            item-value="index"
            density="comfortable"
          >
            <template #[`item.signees`]="{ item }">
              <span class="fs-num font-weight-bold">{{
                item.signees.toLocaleString()
              }}</span>
            </template>
          </v-data-table>
        </FsSection>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useCupStats } from "@/composables/useCupStats";
import BarChart from "../components/BarChart.vue";
import FsSection from "./ui/FsSection.vue";
import PillTabs from "./ui/PillTabs.vue";
import StatTile from "./ui/StatTile.vue";
import FsChart from "./charts/FsChart.vue";
import { useChartPalette } from "@/composables/useChartPalette";
import { catchByCompetition, standingsProgress } from "@/utils/cupStats";
import {
  catchByCompetitionChart,
  standingsRaceChart,
} from "@/utils/chartConfigs";

defineOptions({ name: "CupStats" });
const props = defineProps({
  competitions: { type: Array, default: () => [] },
  cup: { type: Object, default: null },
  all_signees: { type: Array, default: () => [] },
  biggest_fishes: { type: Array, default: () => [] },
  biggest_amounts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});
const { t, locale } = useI18n();

const {
  showTables,
  showCharts,
  headers_cup_fishes_total,
  headers_cup_fishes_competition,
  headers_cup_signees,
  headers_cup_biggest_fishes,
  headers_cup_biggest_amounts,
  cup_fishes_total,
  cup_fishes_competition,
  cup_biggest_fishes,
  cup_biggest_amounts,
  cup_signees,
  total_fishes_chart_data,
  competition_fishes_chart_data,
  cup_biggest_fishes_chart_data,
  cup_biggest_amounts_chart_data,
  cup_signees_chart_data,
} = useCupStats(props);

const view = ref("progress");
const views = computed(() => [
  {
    value: "progress",
    label: t("stats-page.progress-tab"),
    icon: "mdi-chart-line",
  },
  { value: "fishes", label: t("fishes"), icon: "mdi-fish" },
  { value: "biggest", label: t("biggest-fishes"), icon: "mdi-trophy-outline" },
  {
    value: "signees",
    label: t("signees-signed"),
    icon: "mdi-account-group-outline",
  },
]);

const palette = useChartPalette();
const env = computed(() => ({
  palette: palette.value,
  t,
  lang: locale.value === "fi" ? "fi-FI" : "en-GB",
}));
// counted the same way as the standings: the cup's "best N" setting
const progress = computed(() =>
  standingsProgress(
    props.competitions,
    props.all_signees,
    props.cup?.signees || [],
    props.cup?.meaningful_competitions || props.competitions.length,
    8,
  ),
);
const byCompetition = computed(() =>
  catchByCompetition(props.competitions, props.all_signees),
);
const progressConfig = computed(() =>
  standingsRaceChart(progress.value, env.value),
);
const byCompetitionConfig = computed(() =>
  catchByCompetitionChart(byCompetition.value, env.value),
);

// the composable's header titles are translation keys
const translated = (headers) =>
  headers.map((h) => ({ ...h, title: t(h.title) }));
</script>

<style scoped>
.cstats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cstats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 20px;
  align-items: start;
}
@media (max-width: 520px) {
  .cstats__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
.cstats__lead {
  margin: 0;
  font-size: 14px;
}
.cstats__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
</style>
