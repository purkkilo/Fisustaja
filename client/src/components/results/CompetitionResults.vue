<template>
  <!-- Results of one competition: statistics, normal/team results and the
       biggest fishes/amounts, with PDF export. Used by /results and /public-results. -->
  <div>
    <!-- Settings for a single-table PDF -->
    <v-dialog v-model="pdfDialog" width="500">
      <v-card>
        <v-card-title>{{ $t("settings") }}</v-card-title>
        <v-card-text>
          <v-checkbox
            :label="$t('pdf-landscape')"
            v-model="isLandscape"
          ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="yellow" @click="pdfDialog = false" variant="text">
            {{ $t("cancel") }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="
              pdfDialog = false;
              savePdf();
            "
            variant="text"
          >
            {{ $t("download") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Download several tables at once -->
    <v-row
      class="justify-center align-center"
      style="padding-bottom: 20px"
      v-if="hasResults"
    >
      <v-col>
        <v-dialog v-model="printDialog" scrollable max-width="300px">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              color="red-lighten-2"
              :loading="loading"
              :disabled="!biggest_amounts_results.length || !competition"
              size="large"
              variant="outlined"
            >
              <v-icon color="red">mdi-file-pdf-box</v-icon
              >{{ $t("download-all-results") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-text style="margin-top: 20px">
              <h1>{{ $t("settings") }}</h1>
              <v-checkbox
                :label="$t('pdf-landscape')"
                v-model="isLandscape"
              ></v-checkbox>
            </v-card-text>
            <v-card-title>{{ $t("choose-download") }}</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 300px; width: 100%">
              <v-checkbox
                v-for="option in printOptions"
                :key="option.value"
                v-model="selected_print"
                :label="$t(option.label)"
                :disabled="option.disabled"
                color="indigo-darken-3"
                :value="option.value"
              ></v-checkbox>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-col>
                <v-btn
                  color="yellow-darken-3"
                  @click="printDialog = false"
                  variant="outlined"
                  >{{ $t("close") }}</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  color="green-lighten-1"
                  @click="
                    printDialog = false;
                    saveSelectedPdfs();
                  "
                  variant="outlined"
                  >{{ $t("download") }}</v-btn
                >
              </v-col>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-tabs
      slider-color="blue-darken-4"
      v-model="tab"
      bg-color="blue-lighten-2"
      color="blue-darken-4"
      grow
      show-arrows
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      center-active
    >
      <v-tab :disabled="loading" value="stats">{{ $t("statistics") }}</v-tab>
      <v-tab :disabled="loading" value="normal-competition">{{
        $t("normal-comp")
      }}</v-tab>
      <v-tab
        v-if="isTeamCompetition"
        :disabled="loading"
        value="team-competition"
        >{{ $t("team-comp") }}</v-tab
      >
      <v-tab
        :disabled="loading || !biggest_fishes.length"
        value="biggest-fishes"
        >{{ $t("biggest-fish") }}</v-tab
      >
      <v-tab
        :disabled="loading || !biggest_amounts_results.length"
        value="biggest-fish-amounts"
        >{{ $t("biggest-amounts") }}</v-tab
      >
    </v-tabs>

    <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-window-item :class="panelClass" value="stats">
        <v-row v-if="loading">
          <v-col>
            <h2 class="text-white">{{ $t("loading") }}...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
        <Stats
          v-if="!loading && competition"
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
      </v-window-item>

      <v-window-item :class="panelClass" value="normal-competition">
        <v-row style="margin-top: 40px">
          <v-col md="4" offset-md="4">
            <v-select
              :label="$t('choose-table-view')"
              :items="normal_options"
              :item-title="(item) => $t(item)"
              v-model="selected_normal"
              @update:model-value="switchNormalResults"
              variant="outlined"
            />
          </v-col>
          <v-col
            v-if="
              normal_points.length ||
              (signees.length && selected_normal === 'signees-signed')
            "
            md="3"
          >
            <PdfButton :loading="loading" @click="openPdf('#normal-table')" />
          </v-col>
        </v-row>
        <NormalComp
          :loading="loading"
          search=""
          :headers="headers"
          :results="results"
          :normal_points="normal_points"
          :selected_normal="selected_normal"
          :fish_names="table_fish_names"
        />
      </v-window-item>

      <v-window-item
        v-if="isTeamCompetition"
        :class="panelClass"
        value="team-competition"
      >
        <TeamComp
          :team_results="team_results"
          :loading="loading"
          search_team=""
          :headers="team_headers"
          @dialog="openPdfDialog"
        />
      </v-window-item>

      <v-window-item :class="panelClass" value="biggest-fishes">
        <v-row style="padding-top: 50px">
          <v-col md="3" offset-md="4">
            <v-select
              :label="$t('choose-table-view')"
              v-model="selected_biggest_fish"
              @update:model-value="switchBiggestFishes"
              :items="fish_names"
              :item-title="optionLabel"
              variant="outlined"
            />
          </v-col>
          <v-col md="3" offset-md="1" v-if="biggest_fishes_results.length">
            <PdfButton
              :loading="loading"
              @click="openPdf('#biggest-fishes-table')"
            />
          </v-col>
        </v-row>
        <BiggestFishes
          :biggest_fishes_results="biggest_fishes_results"
          :fish_names="fish_names"
          :loading="loading"
          :headers="biggest_fishes_headers"
          search_fishes=""
          :selected_biggest_fish="selected_biggest_fish"
        />
      </v-window-item>

      <v-window-item :class="panelClass" value="biggest-fish-amounts">
        <v-row style="padding-top: 50px">
          <v-col md="3" offset-md="4">
            <v-select
              :label="$t('choose-table-view')"
              v-model="selected_biggest_amount"
              @update:model-value="switchBiggestAmounts"
              :items="fish_amount_names"
              :item-title="optionLabel"
              variant="outlined"
            />
          </v-col>
          <v-col md="3" offset-md="1" v-if="biggest_amounts_results.length">
            <PdfButton
              :loading="loading"
              @click="openPdf('#biggest-amounts-table')"
            />
          </v-col>
        </v-row>
        <BiggestAmounts
          :biggest_amounts_results="biggest_amounts_results"
          :fish_names="fish_names"
          :headers="biggest_amounts_headers"
          :loading="loading"
          search_amounts=""
          :selected_biggest_amount="selected_biggest_amount"
        />
      </v-window-item>
    </v-window>

    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useMainStore } from "@/store";
import { useCompetitionResults } from "@/composables/useCompetitionResults";
import ProgressBarQuery from "../layout/ProgressBarQuery.vue";
import NotificationBar from "../NotificationBar.vue";
import PdfButton from "../PdfButton.vue";
import Stats from "./Stats.vue";
import NormalComp from "./NormalComp.vue";
import TeamComp from "./TeamComp.vue";
import BiggestFishes from "./BiggestFishes.vue";
import BiggestAmounts from "./BiggestAmounts.vue";

const props = defineProps({
  // _id of the competition to show; changing it loads the new competition
  competitionId: { type: String, default: null },
  // Public page: only public data is requested (works without a login)
  publicOnly: Boolean,
});
const emit = defineEmits(["loaded"]);

const store = useMainStore();
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

const panelClass = computed(() =>
  store.isDark ? "inputarea-dark" : "inputarea",
);

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

// Stats and TeamComp ask for the PDF dialog with { pdf, pdfDialog }
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
