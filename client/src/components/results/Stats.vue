<template>
  <!-- Statistics view of the results: key numbers, charts, fish specs -->
  <div v-if="competition" class="stats">
    <div class="stats__tiles">
      <StatTile
        v-for="tile in tiles"
        :key="tile.key"
        :tone="tile.tone"
        :icon="TILE_ICONS[tile.key]"
        :label="$t(tile.label)"
        :value="tile.value"
        :unit="tile.unit || ''"
        :progress="tile.progress ?? null"
        :note="tile.note || ''"
      />
    </div>

    <template v-if="hasCatch">
      <div class="stats__charts">
        <FsSection icon="mdi-fish" :title="$t('stats-page.species')">
          <p class="stats__lead fs-muted">
            {{ $t("stats-page.species-lead") }}
          </p>
          <FsChart
            chart-id="species_chart"
            :config="speciesConfig"
            :label="$t('stats-page.species')"
            :height="Math.max(160, species.length * 44 + 70)"
          />
        </FsSection>
        <FsSection icon="mdi-podium" :title="$t('stats-page.top-boats')">
          <p class="stats__lead fs-muted">
            {{ $t("stats-page.top-boats-lead") }}
          </p>
          <FsChart
            chart-id="top_boats_chart"
            :config="topBoatsConfig"
            :label="$t('stats-page.top-boats')"
            :height="Math.max(200, topBoats.boats.length * 36 + 110)"
          />
        </FsSection>
      </div>
      <div class="stats__charts">
        <FsSection icon="mdi-chart-bar" :title="$t('stats-page.spread')">
          <p class="stats__lead fs-muted">
            {{ $t("stats-page.spread-lead") }}
          </p>
          <FsChart
            chart-id="points_spread_chart"
            :config="spreadConfig"
            :label="$t('stats-page.spread')"
            :height="280"
          />
        </FsSection>
        <FsSection
          v-if="biggest.length"
          icon="mdi-trophy-outline"
          :title="$t('stats-page.biggest')"
        >
          <p class="stats__lead fs-muted">
            {{ $t("stats-page.biggest-lead") }}
          </p>
          <FsChart
            chart-id="biggest_fish_chart"
            :config="biggestConfig"
            :label="$t('stats-page.biggest')"
            :height="Math.max(180, biggest.length * 56 + 70)"
          />
        </FsSection>
      </div>
      <FsSection
        v-if="timeline.length > 1"
        icon="mdi-clock-outline"
        :title="$t('stats-page.timeline')"
      >
        <p class="stats__lead fs-muted">{{ $t("stats-page.timeline-lead") }}</p>
        <FsChart
          chart-id="catch_timeline_chart"
          :config="timelineConfig"
          :label="$t('stats-page.timeline')"
          :height="260"
        />
      </FsSection>
    </template>
    <p v-else class="fs-muted">{{ $t("no-results") }}</p>

    <FsSection icon="mdi-fish" :title="$t('fish-specs')" flush>
      <template #actions>
        <v-btn
          variant="outlined"
          color="results"
          prepend-icon="mdi-file-pdf-box"
          :loading="loading"
          :disabled="!biggest_amounts.length"
          @click="emit('dialog', { pdf: 'Tilastoja', pdfDialog: true })"
          >PDF</v-btn
        >
      </template>
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>{{ $t("fish") }}</th>
            <th class="text-end">{{ $t("multiplier") }}</th>
            <th class="text-end">{{ $t("min-size") }}</th>
            <th class="text-end">{{ $t("amount") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fish, index) in competition.fishes" :key="index">
            <td>
              <span class="d-inline-flex align-center ga-2">
                <span
                  aria-hidden="true"
                  class="stats__dot"
                  :style="{ background: fish.color || 'currentColor' }"
                ></span>
                <strong>{{ fish.name }}</strong>
              </span>
            </td>
            <td class="text-end fs-num">× {{ fish.multiplier }}</td>
            <td class="text-end fs-num">{{ fish.minsize }} cm</td>
            <td class="text-end fs-num font-weight-bold">
              {{ kg(fish.weights) }} kg
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3">{{ $t("total-amount") }}</th>
            <th class="text-end fs-num">
              {{ kg(competition.total_weights) }} kg
            </th>
          </tr>
        </tfoot>
      </v-table>
    </FsSection>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import FsSection from "../ui/FsSection.vue";
import StatTile from "../ui/StatTile.vue";
import FsChart from "../charts/FsChart.vue";
import { useChartPalette } from "@/composables/useChartPalette";
import {
  biggestFishBySpecies,
  catchTimeline,
  pointsHistogram,
  speciesPoints,
  statsSummary,
  topBoatsBySpecies,
} from "@/utils/competitionStats";
import {
  biggestFishChart,
  catchTimelineChart,
  pointsSpreadChart,
  speciesChart,
  topBoatsChart,
} from "@/utils/chartConfigs";

defineOptions({ name: "Stats" });
const props = defineProps({
  competition: { type: Object, default: null },
  // signees with their fishes, total_points and placement
  signees: { type: Array, default: () => [] },
  hasGottenFishCount: { type: Number, default: 0 },
  // every biggest-fish entry: { name, weight, boat_number, captain_name }
  biggest_fishes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  biggest_amounts: { type: [Object, Array], default: () => ({}) },
});
const emit = defineEmits(["dialog"]);

const { t, locale } = useI18n();
const palette = useChartPalette();
const env = computed(() => ({
  palette: palette.value,
  t,
  lang: locale.value === "fi" ? "fi-FI" : "en-GB",
}));

const TILE_ICONS = {
  boats: "mdi-sail-boat",
  "got-fish": "mdi-fish",
  total: "mdi-weight-kilogram",
  cup: "mdi-medal-outline",
};
// the same numbers as the PDF's tiles, formatted for the language
const tiles = computed(() =>
  statsSummary(
    props.competition,
    props.signees,
    props.hasGottenFishCount,
    env.value.lang,
  ),
);

const kg = (grams) =>
  (
    Math.round(((Number(grams) || 0) / 1000 + Number.EPSILON) * 100) / 100
  ).toLocaleString(env.value.lang);
const hasCatch = computed(() => props.hasGottenFishCount > 0);

const species = computed(() => speciesPoints(props.competition, props.signees));
const topBoats = computed(() =>
  topBoatsBySpecies(props.competition, props.signees, 10),
);
const spread = computed(() =>
  pointsHistogram(props.signees.map((s) => s.total_points)),
);
const biggest = computed(() =>
  biggestFishBySpecies(props.competition, props.biggest_fishes),
);
const timeline = computed(() => catchTimeline(props.signees));

const speciesConfig = computed(() => speciesChart(species.value, env.value));
const topBoatsConfig = computed(() => topBoatsChart(topBoats.value, env.value));
const spreadConfig = computed(() => pointsSpreadChart(spread.value, env.value));
const biggestConfig = computed(() =>
  biggestFishChart(biggest.value, env.value),
);
const timelineConfig = computed(() =>
  catchTimelineChart(timeline.value, env.value),
);
</script>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.stats__tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
}
.stats__charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
  align-items: start;
}
@media (max-width: 440px) {
  .stats__charts {
    grid-template-columns: minmax(0, 1fr);
  }
}
.stats__lead {
  margin: 0;
  font-size: 14px;
}
.stats__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
