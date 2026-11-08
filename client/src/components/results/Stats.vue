<template>
  <!-- Statistics view of the results: key numbers, charts, fish specs -->
  <div v-if="competition" class="stats">
    <div class="stats__tiles">
      <StatTile
        tone="signing"
        icon="mdi-sail-boat"
        :label="$t('total-signees')"
        :value="signees.length"
      />
      <StatTile
        tone="weighing"
        icon="mdi-fish"
        :label="$t('comp-overview.gotten-fish')"
        :value="gotFishPct"
        unit="%"
        :progress="gotFishPct"
        :note="`${hasGottenFishCount} / ${signees.length}`"
      />
      <StatTile
        tone="results"
        icon="mdi-weight-kilogram"
        :label="$t('total-amount')"
        :value="kg(competition.total_weights)"
        unit="kg"
      />
      <StatTile
        v-if="competition.isCupCompetition"
        icon="mdi-medal-outline"
        :label="$t('overview-page.cup-multiplier')"
        :value="`× ${competition.cup_points_multiplier}`"
      />
    </div>

    <div v-if="normal_points.length" class="stats__charts">
      <FsSection
        v-if="fishes_chart_data"
        icon="mdi-chart-donut"
        :title="$t(fishes_chart_title)"
      >
        <doughnut-chart
          :chart-data="fishes_chart_data"
          chart-id="fishes_chart"
          :title="$t(fishes_chart_title)"
          :height="320"
        />
      </FsSection>
      <FsSection
        v-if="signee_chart_data"
        icon="mdi-chart-pie"
        :title="$t(signee_chart_title)"
      >
        <pie-chart
          :chart-data="signee_chart_data"
          chart-id="signee_chart"
          :title="$t(signee_chart_title)"
          :height="320"
        />
      </FsSection>
    </div>
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
import PieChart from "../PieChart.vue";
import DoughnutChart from "../DoughnutChart.vue";
import FsSection from "../ui/FsSection.vue";
import StatTile from "../ui/StatTile.vue";

defineOptions({ name: "Stats" });
const props = defineProps({
  competition: { type: Object, default: null },
  normal_points: { type: Array, default: () => [] },
  hasGottenFishCount: { type: Number, default: 0 },
  signees: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  biggest_amounts: { type: [Object, Array], default: () => ({}) },
  fishes_chart_title: { type: String, default: "" },
  fishes_chart_data: { type: Object, default: null },
  signee_chart_title: { type: String, default: "" },
  signee_chart_data: { type: Object, default: null },
});
const emit = defineEmits(["dialog"]);

const kg = (grams) =>
  grams ? Math.round((grams / 1000 + Number.EPSILON) * 100) / 100 : 0;

const gotFishPct = computed(() =>
  props.signees.length
    ? Math.round((props.hasGottenFishCount / props.signees.length) * 100)
    : 0,
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}
.stats__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
