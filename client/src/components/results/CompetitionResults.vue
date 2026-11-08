<template>
  <!-- Results of one competition, used by /results and /public-results:
       view switch + actions, provisional banner, podium and the tables. -->
  <div class="cresults">
    <div class="cresults__bar">
      <div
        role="group"
        :aria-label="$t('results-page.views')"
        class="cresults__views"
      >
        <button
          v-for="view in views"
          :key="view.value"
          type="button"
          class="cresults__view"
          :class="{ 'cresults__view--on': tab === view.value }"
          :aria-pressed="tab === view.value"
          :disabled="loading && !competition"
          @click="tab = view.value"
        >
          {{ view.label }}
        </button>
      </div>
      <div class="cresults__actions">
        <slot name="actions" :competition="competition" :loading="loading" />
        <v-btn
          color="results"
          prepend-icon="mdi-file-pdf-box"
          :disabled="!hasResults || !competition"
          @click="printDialog = true"
          >{{ $t("download-all-results") }}</v-btn
        >
      </div>
    </div>

    <div v-if="provisional" role="status" class="cresults__banner">
      <v-icon icon="mdi-clock-outline" />
      {{ $t("results-page.provisional", { n: onWater }) }}
    </div>

    <v-skeleton-loader
      v-if="loading && !competition"
      type="table"
      class="fs-panel"
    />
    <template v-else-if="competition">
      <ResultsPodium
        v-if="tab === 'normal-competition' && podium.length"
        :rows="podium"
      />

      <div class="cresults__main">
        <ResultsPanel
          v-if="tab === 'normal-competition'"
          class="cresults__table"
          :title="$t('results-page.leaderboard')"
          :options="normalOptions"
          :selected="selected_normal"
          searchable
          :pdf="!!results.length"
          @update:selected="
            (v) => {
              selected_normal = v;
              switchNormalResults();
            }
          "
          @pdf="openPdf('#normal-table')"
        >
          <template #default="{ search }">
            <NormalComp
              :loading="loading"
              :search="search"
              :headers="headers"
              :results="results"
              :fish_names="table_fish_names"
            />
            <p class="fs-muted text-body-small mt-2">
              {{ $t("results-page.points-help") }}
            </p>
          </template>
        </ResultsPanel>

        <ResultsPanel
          v-else-if="tab === 'team-competition'"
          class="cresults__table"
          :title="$t('team-comp')"
          searchable
          :pdf="!!team_results.length"
          @pdf="openPdf('#team-table')"
        >
          <template #default="{ search }">
            <TeamComp
              :loading="loading"
              :search="search"
              :headers="team_headers"
              :team_results="team_results"
            />
          </template>
        </ResultsPanel>

        <ResultsPanel
          v-else-if="tab === 'biggest-fishes'"
          class="cresults__table"
          :title="$t('biggest-fish')"
          :options="fishOptions(fish_names)"
          :selected="selected_biggest_fish"
          searchable
          :pdf="!!biggest_fishes_results.length"
          @update:selected="
            (v) => {
              selected_biggest_fish = v;
              switchBiggestFishes();
            }
          "
          @pdf="openPdf('#biggest-fishes-table')"
        >
          <template #default="{ search }">
            <BiggestFishes
              :loading="loading"
              :search="search"
              :headers="biggest_fishes_headers"
              :biggest_fishes_results="biggest_fishes_results"
            />
          </template>
        </ResultsPanel>

        <ResultsPanel
          v-else-if="tab === 'biggest-fish-amounts'"
          class="cresults__table"
          :title="$t('biggest-amounts')"
          :options="fishOptions(fish_amount_names)"
          :selected="selected_biggest_amount"
          searchable
          :pdf="!!biggest_amounts_results.length"
          @update:selected="
            (v) => {
              selected_biggest_amount = v;
              switchBiggestAmounts();
            }
          "
          @pdf="openPdf('#biggest-amounts-table')"
        >
          <template #default="{ search }">
            <BiggestAmounts
              :loading="loading"
              :search="search"
              :headers="biggest_amounts_headers"
              :biggest_amounts_results="biggest_amounts_results"
            />
          </template>
        </ResultsPanel>

        <ResultsPanel
          v-else-if="tab === 'stats'"
          class="cresults__table"
          :title="$t('statistics')"
        >
          <Stats
            :competition="competition"
            :normal_points="normal_points"
            :hasGottenFishCount="hasGottenFishCount"
            :signees="signees"
            :loading="loading"
            :biggest_amounts="biggest_amounts_results"
            :fishes_chart_title="fishes_chart_title"
            :fishes_chart_data="fishes_chart_data"
            :signee_chart_title="signee_chart_title"
            :signee_chart_data="signee_chart_data"
            @dialog="openPdfDialog"
          />
        </ResultsPanel>

        <aside
          v-if="tab === 'normal-competition' && biggestPerSpecies.length"
          aria-labelledby="biggest-title"
          class="fs-panel cresults__biggest"
        >
          <h2 id="biggest-title">{{ $t("biggest-fishes") }}</h2>
          <div
            v-for="fish in biggestPerSpecies"
            :key="fish.name"
            class="cresults__fish"
          >
            <span class="fs-eyebrow cresults__species">{{ fish.name }}</span>
            <span class="fs-display fs-num cresults__weight"
              >{{ format(fish.weight) }} g</span
            >
            <span class="text-body-small"
              >{{ fish.captain_name }},
              {{ $t("results-page.boat", { n: fish.boat_number }) }}</span
            >
          </div>
        </aside>
      </div>
    </template>

    <!-- one table as PDF -->
    <v-dialog v-model="pdfDialog" max-width="420">
      <v-card :title="$t('settings')">
        <v-card-text>
          <v-checkbox
            v-model="isLandscape"
            :label="$t('pdf-landscape')"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="pdfDialog = false">{{
            $t("cancel")
          }}</v-btn>
          <v-btn
            color="results"
            variant="flat"
            @click="
              pdfDialog = false;
              savePdf();
            "
            >{{ $t("download") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- several tables as PDF -->
    <v-dialog v-model="printDialog" max-width="440" scrollable>
      <v-card :title="$t('choose-download')">
        <v-card-text>
          <v-checkbox
            v-model="isLandscape"
            :label="$t('pdf-landscape')"
            hide-details
          />
          <v-divider class="my-2" />
          <v-checkbox
            v-for="option in printOptions"
            :key="option.value"
            v-model="selected_print"
            :label="$t(option.label)"
            :disabled="option.disabled"
            :value="option.value"
            color="results"
            hide-details
            density="compact"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="printDialog = false">{{
            $t("close")
          }}</v-btn>
          <v-btn
            color="results"
            variant="flat"
            :disabled="!selected_print.length"
            @click="
              printDialog = false;
              saveSelectedPdfs();
            "
            >{{ $t("download") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCompetitionResults } from "@/composables/useCompetitionResults";
import NotificationBar from "../NotificationBar.vue";
import Stats from "./Stats.vue";
import NormalComp from "./NormalComp.vue";
import TeamComp from "./TeamComp.vue";
import BiggestFishes from "./BiggestFishes.vue";
import BiggestAmounts from "./BiggestAmounts.vue";
import ResultsPanel from "./ResultsPanel.vue";
import ResultsPodium from "./ResultsPodium.vue";

const props = defineProps({
  // _id of the competition to show; changing it loads the new competition
  competitionId: { type: String, default: null },
  // Public page: only public data is requested (works without a login)
  publicOnly: Boolean,
});
const emit = defineEmits(["loaded"]);
const { t } = useI18n();

const {
  loading,
  competition,
  signees,
  hasGottenFishCount,
  tab,
  hasResults,
  isTeamCompetition,
  fish_names,
  fish_amount_names,
  table_fish_names,
  normal_options,
  selected_normal,
  normal_points,
  results,
  headers,
  team_results,
  team_headers,
  biggest_fishes,
  biggest_fishes_results,
  biggest_fishes_headers,
  selected_biggest_fish,
  biggest_amounts_results,
  biggest_amounts_headers,
  selected_biggest_amount,
  fishes_chart_title,
  fishes_chart_data,
  signee_chart_title,
  signee_chart_data,
  snackbar,
  text,
  pdf,
  isLandscape,
  selected_print,
  load,
  clear,
  switchNormalResults,
  switchBiggestFishes,
  switchBiggestAmounts,
  optionLabel,
  savePdf,
  saveSelectedPdfs,
} = useCompetitionResults({ publicOnly: props.publicOnly });

const pdfDialog = ref(false);
const printDialog = ref(false);

const views = computed(() => [
  { value: "normal-competition", label: t("results-page.leaderboard") },
  ...(isTeamCompetition.value
    ? [{ value: "team-competition", label: t("team-comp") }]
    : []),
  { value: "biggest-fishes", label: t("biggest-fish") },
  { value: "biggest-fish-amounts", label: t("biggest-amounts") },
  { value: "stats", label: t("statistics") },
]);
const normalOptions = computed(() =>
  normal_options.map((value) => ({ value, label: t(value) })),
);
const fishOptions = (names) =>
  names.map((value) => ({ value, label: optionLabel(value) }));

const onWater = computed(() => signees.value.filter((s) => !s.returned).length);
const provisional = computed(
  () =>
    !!competition.value && !competition.value.isFinished && onWater.value > 0,
);
const podium = computed(() =>
  normal_points.value.filter((r) => Number(r.total_points) > 0).slice(0, 3),
);
/** The heaviest single fish of each species. */
const biggestPerSpecies = computed(() => {
  const best = new Map();
  for (const fish of biggest_fishes.value) {
    const current = best.get(fish.name);
    if (!current || Number(fish.weight) > Number(current.weight)) {
      best.set(fish.name, fish);
    }
  }
  return [...best.values()];
});
const format = (n) => Number(n).toLocaleString("fi-FI");

const printOptions = computed(() => {
  const noAmounts = !biggest_amounts_results.value.length;
  const noFishes = !biggest_fishes_results.value.length;
  return [
    { value: "stats", label: "statistics", disabled: noAmounts },
    { value: "normal", label: "normal-results", disabled: noAmounts },
    ...(isTeamCompetition.value
      ? [
          {
            value: "team",
            label: "team-results",
            disabled: !team_results.value.length,
          },
        ]
      : []),
    { value: "all_biggest", label: "download-amounts", disabled: noAmounts },
    {
      value: "biggest_fishes",
      label: "download-biggest-fishes",
      disabled: noFishes,
    },
    {
      value: "biggest_amounts",
      label: "download-amounts-by-fish",
      disabled: noAmounts,
    },
    {
      value: "biggest_winners",
      label: "download-fish-winners",
      disabled: noFishes && noAmounts,
    },
  ];
});

function openPdf(table) {
  pdf.value = table;
  pdfDialog.value = true;
}

// Stats asks for the PDF dialog with { pdf, pdfDialog }
function openPdfDialog(options) {
  pdf.value = options.pdf;
  pdfDialog.value = options.pdfDialog;
}

async function refresh() {
  await load(props.competitionId);
  if (competition.value) emit("loaded", competition.value);
}

watch(
  () => props.competitionId,
  (id) => (id ? refresh() : clear()),
  { immediate: true },
);

defineExpose({ refresh, competition, loading });
</script>

<style scoped>
.cresults {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cresults__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.cresults__views {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(var(--v-border-color), 0.08);
}
.cresults__view {
  height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.cresults__view--on {
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
  font-weight: 700;
}
.cresults__actions {
  margin-left: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.cresults__banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgb(var(--v-theme-results-soft));
  font-weight: 600;
}
.cresults__main {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.cresults__table {
  flex: 3 1 640px;
  min-width: 0;
}
.cresults__biggest {
  flex: 1 1 260px;
  min-width: 0;
  overflow: hidden;
}
.cresults__biggest h2 {
  margin: 0;
  padding: 14px 20px;
  font-size: 19px;
  background: rgb(var(--v-theme-results-soft));
}
.cresults__fish {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 20px;
  padding: 14px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.cresults__fish:first-of-type {
  border-top: 0;
}
.cresults__species {
  color: rgb(var(--v-theme-results));
}
.cresults__weight {
  font-size: 26px;
}
</style>
