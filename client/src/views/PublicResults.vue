<template>
  <!-- /public-results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row>
          <v-dialog v-model="pdfDialog" width="500">
            <v-card>
              <v-card-title> Pdf Asetukset </v-card-title>
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
                    pdfWrapper();
                  "
                  variant="text"
                >
                  {{ $t("download") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col md="6" offset-md="3">
                <h1>{{ $t("home.comp") }}</h1>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length" class="scroll_table">
              <v-col md="6" offset-md="3">
                <!-- TODO add v-autocompelete, but so that it popsup the keyboad on mobile only when pressing search button? -->
                <v-autocomplete
                  v-model="selected_competition"
                  :items="competitions"
                  item-title="select"
                  item-value="_id"
                  :label="$t('choose-comp')"
                  :loading="loading"
                  @update:model-value="pickCompetition"
                  return-object
                  single-line
                  variant="outlined"
                >
                  <template v-slot:item="data">
                    <v-list-item v-bind="data.props" :title="undefined">
                      <template v-slot:prepend>
                        <v-icon v-if="data.item.isFinished" color="green"
                          >mdi-trophy</v-icon
                        >
                        <v-icon v-else color="yellow">mdi-trophy</v-icon>
                      </template>
                      <v-list-item-title>{{
                        data.item.name + ", " + data.item.locality
                      }}</v-list-item-title>
                      <v-list-item-subtitle
                        class="text-green"
                        v-if="data.item.isCupCompetition"
                        >{{
                          data.item.cup_name +
                          " (" +
                          getYear(data.item.start_date) +
                          ")"
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle class="text-blue">{{
                        formatDateToLocaleDateString(data.item.start_date)
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle v-if="!data.item.isFinished"
                        >{{ $t("not-finished") }}!</v-list-item-subtitle
                      >
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2 class="text-white">
                  {{ $t("no") }} {{ $t("comp.plural") }}
                </h2>
              </v-col></v-row
            >
            <v-row
              class="justify-center align-center"
              style="margin-bottom: 20px"
              v-if="selected_competition && competitions.length"
            >
              <v-col>
                <v-btn
                  color="yellow"
                  @click="cancelSelection"
                  :disabled="!competition"
                  class="text-black"
                  size="large"
                  variant="outlined"
                >
                  <v-icon>mdi-cancel</v-icon>{{ $t("cancel") }}
                </v-btn>
              </v-col>
              <v-col>
                <v-dialog v-model="dialog" scrollable max-width="300px">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red-lighten-2"
                      :loading="loading_competition"
                      :disabled="
                        !biggest_amounts_results.length || !competition
                      "
                      size="large"
                      variant="outlined"
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon
                      >{{ $t("download-all-results") }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text style="margin-top: 20px">
                      <h1>PDF Asetukset</h1>
                      <v-checkbox
                        :label="$t('pdf-landscape')"
                        v-model="isLandscape"
                      ></v-checkbox
                    ></v-card-text>
                    <v-card-title>Valitse mitä lataus sisältää</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px; width: 100%">
                      <v-checkbox
                        v-model="selected_print"
                        :label="$t('statistics')"
                        :disabled="!biggest_amounts_results.length"
                        color="indigo-darken-3"
                        value="stats"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        :label="$t('normal-results')"
                        color="indigo-darken-3"
                        value="normal"
                      ></v-checkbox>
                      <v-checkbox
                        v-if="isTeamCompetition"
                        :disabled="!team_results.length"
                        v-model="selected_print"
                        :label="$t('team-results')"
                        color="indigo-darken-3"
                        value="team"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        :label="$t('download-amounts')"
                        color="indigo-darken-3"
                        value="all_biggest"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_fishes_results.length"
                        :label="$t('download-biggest-fishes')"
                        color="indigo-darken-3"
                        value="biggest_fishes"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        :label="$t('download-amounts-by-fish')"
                        color="indigo-darken-3"
                        value="biggest_amounts"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="
                          !biggest_fishes_results.length &&
                          !biggest_amounts_results.length
                        "
                        :label="$t('download-fish-winners')"
                        color="indigo-darken-3"
                        value="biggest_winners"
                      ></v-checkbox>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-col>
                        <v-btn
                          color="red-darken-4"
                          @click="dialog = false"
                          variant="outlined"
                          >{{ $t("close") }}</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          color="green-darken-4"
                          @click="choosePrints"
                          variant="outlined"
                          >{{ $t("download") }}</v-btn
                        >
                      </v-col>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- Tabs -->
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
              v-if="selected_competition && competitions.length"
            >
              <v-tab value="stats">Tilastoja</v-tab>
              <v-tab
                :disabled="!selected_competition"
                value="normal-competition"
                >{{ $t("normal-comp") }}
              </v-tab>
              <v-tab
                v-if="isTeamCompetition"
                :disabled="!selected_competition"
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
            <v-row v-if="loading" style="margin: 50px">
              <v-col>
                <h2 class="text-white">{{ $t("loading") }}...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-window
              v-model="tab"
              style="background: rgba(0, 0, 0, 0.4)"
              v-if="!loading && selected_competition"
            >
              <!-- Tilastoja -->
              <v-window-item
                v-bind:class="{
                  inputarea: !store.getTheme,
                  'inputarea-dark': store.getTheme,
                }"
                :value="'stats'"
              >
                <stats
                  :competition="competition"
                  :normal_points="normal_points"
                  :hasGottenFishCount="hasGottenFishCount"
                  :signees="signees"
                  :loading="loading_competition"
                  :biggest_amounts="biggest_amounts_results"
                  :calculated_weights="calculated_fish_weights"
                  :calculated_total="calculated_total_weights"
                  :fishes_chart_title="fishes_chart_title"
                  :fishes_chart_data="fishes_chart_data"
                  :signee_chart_title="signee_chart_title"
                  :signee_chart_data="signee_chart_data"
                  @dialog="
                    (options) => {
                      pdf = options.pdf;
                      pdfDialog = options.pdfDialog;
                    }
                  "
                ></stats>
              </v-window-item>
              <!-- Normaalikilpailu -->
              <v-window-item
                v-bind:class="{
                  inputarea: !store.getTheme,
                  'inputarea-dark': store.getTheme,
                }"
                :value="'normal-competition'"
              >
                <v-row style="margin-top: 40px">
                  <v-col md="4" offset-md="4">
                    <v-select
                      :label="$t('choose-table-view')"
                      :items="normal_options"
                      v-model="selected_normal"
                      @update:model-value="switchNormalResults"
                      variant="outlined"
                    >
                      <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props" :title="$t(item)" />
                      </template>
                      <template v-slot:selection="{ item }">
                        <span>{{ $t(item) }}</span>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                    v-if="
                      normal_points.length ||
                      (signees.length && selected_normal === 'Ilmoittautuneet')
                    "
                    md="3"
                  >
                    <v-btn
                      color="red-lighten-2"
                      :loading="loading"
                      @click="
                        pdf = '#normal-table';
                        pdfDialog = true;
                      "
                      size="large"
                      variant="outlined"
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon>
                      {{ $t("download") }} pdf
                    </v-btn>
                  </v-col>
                </v-row>
                <normal-comp
                  :loading="loading_competition"
                  :search="search"
                  :headers="headers"
                  :results="results"
                  :normal_points="normal_points"
                  :selected_normal="selected_normal"
                  :fish_names="table_fish_names"
                ></normal-comp>
              </v-window-item>
              <!-- Tiimikilpailu -->
              <v-window-item
                v-bind:class="{
                  inputarea: !store.getTheme,
                  'inputarea-dark': store.getTheme,
                }"
                :value="'team-competition'"
                v-if="isTeamCompetition"
              >
                <team-comp
                  :team_results="team_results"
                  :loading="loading_competition"
                  :search_team="search_team"
                  :headers="team_headers"
                  @dialog="
                    (options) => {
                      pdf = options.pdf;
                      pdfDialog = options.pdfDialog;
                    }
                  "
                ></team-comp>
              </v-window-item>

              <!-- Suurimmat kalat -->
              <v-window-item
                v-bind:class="{
                  inputarea: !store.getTheme,
                  'inputarea-dark': store.getTheme,
                }"
                :value="'biggest-fishes'"
              >
                <v-row style="padding-top: 50px">
                  <v-col md="3" offset-md="4">
                    <v-select
                      :label="$t('choose-table-view')"
                      v-model="selected_biggest_fish"
                      @update:model-value="switchBiggestFishes"
                      :items="fish_names"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col
                    md="3"
                    offset-md="1"
                    v-if="biggest_fishes_results.length"
                  >
                    <v-btn
                      color="red-lighten-2"
                      :loading="loading_competition"
                      @click="
                        pdf = '#biggest-fishes-table';
                        pdfDialog = true;
                      "
                      size="large"
                      variant="outlined"
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon
                      >{{ $t("download") }} pdf
                    </v-btn>
                  </v-col>
                </v-row>
                <biggest-fishes
                  :biggest_fishes_results="biggest_fishes_results"
                  :fish_names="fish_names"
                  :loading="loading_competition"
                  :headers="biggest_fishes_headers"
                  :results_found_fishes="results_found_fishes"
                  :search_fishes="search_fishes"
                  :selected_biggest_fish="selected_biggest_fish"
                ></biggest-fishes>
              </v-window-item>

              <!-- Suurimmat kalasaaliit -->
              <v-window-item
                v-bind:class="{
                  inputarea: !store.getTheme,
                  'inputarea-dark': store.getTheme,
                }"
                :value="'biggest-fish-amounts'"
              >
                <v-row style="padding-top: 50px">
                  <v-col md="3" offset-md="4">
                    <v-select
                      :label="$t('choose-table-view')"
                      v-model="selected_biggest_amount"
                      @update:model-value="switchBiggestAmounts"
                      :items="fish_amount_names"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col
                    md="3"
                    offset-md="1"
                    v-if="biggest_amounts_results.length"
                  >
                    <v-btn
                      color="red-lighten-2"
                      :loading="loading"
                      @click="
                        pdf = '#biggest-amounts-table';
                        pdfDialog = true;
                      "
                      :disabled="!biggest_amounts_results.length"
                      size="large"
                      variant="outlined"
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon
                      >{{ $t("download") }} pdf
                    </v-btn>
                  </v-col>
                </v-row>
                <biggest-amounts
                  :biggest_amounts_results="biggest_amounts_results"
                  :fish_names="fish_names"
                  :headers="biggest_amounts_headers"
                  :loading="loading_competition"
                  :results_found_amounts="results_found_amounts"
                  :search_amounts="search_amounts"
                  :selected_biggest_amount="selected_biggest_amount"
                ></biggest-amounts>
              </v-window-item>
            </v-window>
            <div v-if="competition" style="margin: 20px">
              <v-row v-if="!loading_competition">
                <v-col>
                  <v-btn
                    id="updatebtn"
                    tile
                    :loading="loading_competition"
                    color="blue-darken-4"
                    @click="refreshCompetition(true, competition)"
                    class="text-white"
                    size="large"
                  >
                    <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <h2 class="text-white">{{ $t("refreshing") }}...</h2>
                  <ProgressBarQuery />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
      </v-card>
    </v-container>
  </div>
</template>
<script setup>
import { useMainStore } from "@/store";
import { nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import Stats from "../components/results/Stats.vue";
import TeamComp from "../components/results/TeamComp.vue";
import NormalComp from "../components/results/NormalComp.vue";
import BiggestFishes from "../components/results/BiggestFishes.vue";
import BiggestAmounts from "../components/results/BiggestAmounts.vue";
import {
  calculateNormalResults,
  calculateBiggestFishes,
  calculateBiggestAmounts,
} from "@/utils/results";
import { initChartData, resizeChartForPDF } from "@/utils/charts";
import { saveAllAsPDF, saveAsPDF, saveStatsAsPDF } from "@/pdf";
import { formatDateToLocaleDateString, getYear } from "@/utils/format";
import NotificationBar from "../components/NotificationBar.vue";

const store = useMainStore();
defineOptions({ name: "PublicResults" });
const { t, locale } = useI18n();

const pdfDialog = ref(false);
const pdf = ref(null);
const isLandscape = ref(false);
const competitions = ref([]);
const competition = ref(null);
const selected_competition = ref(null);
const loading = ref(false);
const loading_competition = ref(false);
const tab = ref(null);
const signees = ref([]);
const fish_names = ref([]);
const fish_amount_names = ref([]);
const table_fish_names = ref([]);
const results = ref([]);
const normal_points = ref([]);
const normal_weights = ref([]);
const team_results = ref([]);
const biggest_fishes = ref({});
const biggest_fishes_results = ref([]);
const selected_biggest_fish = ref(null);
const biggest_amounts = ref({});
const biggest_amounts_results = ref([]);
const selected_biggest_amount = ref(null);
const results_found_fishes = ref("");
const results_found_amounts = ref("");
const isTeamCompetition = ref(false);
const calculated_total_weights = ref(null);
const calculated_fish_weights = ref(null);
const selected_normal = ref(null);
const fishes_chart = ref(null);
const signees_chart = ref(null);
const normal_options = ref(["fishes", "points", "signees-signed"]);
const headers = ref([]);
const biggest_fishes_headers = ref([]);
const biggest_amounts_headers = ref([]);
const normal_headers = ref([
  { text: "placement", value: "placement" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "temp-captain-name", value: "temp_captain_name" },
  { text: "locality", value: "locality" },
  { text: "points", value: "total_points" },
]);
const cup_headers = ref([
  { text: "placement", value: "placement" },
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "temp-captain-name", value: "temp_captain_name" },
  { text: "locality", value: "locality" },
  { text: "points", value: "total_points" },
  {
    text: "cup.normal",
    value: "cup_points_total",
  },
]);
const weight_headers = ref([]);
const signee_headers = ref([]);
const team_headers = ref([
  { text: "placement", value: "placement" },
  { text: "team", value: "name" },
  { text: "name", value: "captain_name_1" },
  { text: "name", value: "captain_name_2" },
  { text: "name", value: "captain_name_3" },
  { text: "points", value: "points" },
]);
const search = ref("");
const search_team = ref("");
const search_fishes = ref("");
const search_amounts = ref("");
const selected_print = ref([]);
const dialog = ref(false);
const signee_chart_data = ref(null);
const fishes_chart_data = ref(null);
const fishes_chart_title = ref(null);
const signee_chart_title = ref(null);
const snackbar = ref(false);
const text = ref("");
const hasGottenFishCount = ref(0);

function pdfWrapper() {
  let comp_type = "";
  let selected = "";

  if (pdf.value === "Tilastoja") {
    resizeChartForPDF();
    saveStatsAsPDF(
      pdf.value,
      isLandscape.value ? "landscape" : "portrait",
      competition.value,
      signees.value,
      hasGottenFishCount.value,
    );
  } else {
    if (pdf.value === "#normal-table") {
      comp_type = `${t("normal-results")} (${t(selected_normal.value)})`;
    }
    if (pdf.value === "#team-table") {
      comp_type = `${t("team-results")}`;
    }
    if (pdf.value === "#biggest-fishes-table") {
      selected =
        selected_biggest_fish.value === "all" ||
        selected_biggest_fish.value === "winners"
          ? t(selected_biggest_fish.value)
          : selected_biggest_fish.value;
      comp_type = `${t("biggest-fishes")} (${selected})`;
    }
    if (pdf.value === "#biggest-amounts-table") {
      selected =
        selected_biggest_amount.value === "all" ||
        selected_biggest_amount.value === "winners"
          ? t(selected_biggest_amount.value)
          : selected_biggest_amount.value;
      comp_type = `${t("biggest-amounts")} (${selected})`;
    }

    saveAsPDF(
      comp_type,
      pdf.value,
      isLandscape.value ? "landscape" : "portrait",
      competition.value,
      signees.value,
      selected_normal.value,
      selected_biggest_fish.value,
      selected_biggest_amount.value,
      normal_points.value,
      normal_weights.value,
      biggest_fishes_results.value,
      biggest_amounts_results.value,
      team_results.value,
      table_fish_names.value,
    );
  }
}

function choosePrints() {
  dialog.value = false;
  if (selected_print.value.length) {
    let results = saveAllAsPDF(
      tab.value,
      isLandscape.value ? "landscape" : "portrait",
      text.value,
      snackbar.value,
      selected_biggest_fish.value,
      selected_biggest_amount.value,
      selected_print.value,
      competition.value,
      signees.value,
      hasGottenFishCount.value,
      biggest_fishes.value,
      biggest_amounts.value,
      normal_points.value,
      normal_weights.value,
      team_results.value,
      table_fish_names.value,
    );
    tab.value = results.tab;
    text.value = results.text;
    snackbar.value = results.snackbar;
  }
}

function cancelSelection() {
  competition.value = null;
  selected_competition.value = null;
}

// "Wrapper" to calculate all the results at once

function calculateAll() {
  let results = calculateNormalResults(competition.value, signees.value);
  signees.value = results.signees.sort((a, b) => a.boat_number - b.boat_number);
  normal_points.value = results.normal_points;
  normal_weights.value = results.normal_weights;

  switchNormalResults();
  switchBiggestFishes();
  switchBiggestAmounts();
}

// Switch table headers and columns based on this.selected_normal value (v-select)

function switchNormalResults() {
  // If "Pisteet" selected in v-select, update headers and this.results (table data)
  if (!selected_normal.value) selected_normal.value = "fishes";
  if (selected_normal.value === "points") {
    results.value = normal_points.value;
    if (competition.value.isCupCompetition) {
      headers.value = cup_headers.value;
    } else {
      headers.value = normal_headers.value;
    }
  }
  // If "Kalat" selected in v-select, update headers and this.results (table data)
  if (selected_normal.value === "fishes") {
    headers.value = weight_headers.value;
    results.value = normal_weights.value;
  }
  if (selected_normal.value === "signees-signed") {
    headers.value = signee_headers.value;
    results.value = signees.value;
  }
}

function switchBiggestFishes() {
  let results = calculateBiggestFishes(
    biggest_fishes.value,
    table_fish_names.value,
    selected_biggest_fish.value,
  );
  selected_biggest_fish.value = results.selected_fish;
  biggest_fishes_headers.value = results.header;
  biggest_fishes_results.value = results.results;
}

function switchBiggestAmounts() {
  let results = calculateBiggestAmounts(
    biggest_amounts.value,
    selected_biggest_amount.value,
    table_fish_names.value,
  );
  selected_biggest_amount.value = results.selected_amount;
  biggest_amounts_headers.value = results.header;
  biggest_amounts_results.value = results.results;
}

// Fetch competition from database, and update all the arrays

async function refreshCompetition(reload, comp) {
  if (comp) {
    loading_competition.value = true;
    // Load from database
    if (reload) {
      //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
      // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
      //TODO make a test for this?
      competition.value = comp;
      // Else update and calculate from picked competition
      fish_names.value = []; // Fish names, including "Voittajat"
      fish_amount_names.value = [];
      table_fish_names.value = []; // only fish names

      fish_names.value.push("Kaikki");
      fish_amount_names.value.push("Kaikki");
      weight_headers.value = [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
      ];
      competition.value.fishes.forEach((fish) => {
        fish.weights = 0;
        fish_names.value.push(fish.name);
        fish_amount_names.value.push(fish.name);
        table_fish_names.value.push(fish.name);
        weight_headers.value.push({
          text: fish.name,
          value: String(fish.id),
        });
      });
      fish_names.value.push("Voittajat");
      fish_amount_names.value.push("Voittajat");
      weight_headers.value.push({ text: "Tulos", value: "total_points" });

      await FishService.getFishes({ competition_id: competition.value._id })
        .then((r) => {
          biggest_fishes.value = r;
        })
        .catch((e) => {
          console.log(e);
        });

      // Get results === signees
      await ResultService.getResults({
        competition_id: competition.value._id,
      })
        .then((results) => {
          competition.value.total_weights = 0;
          hasGottenFishCount.value = 0;
          results.forEach((result) => {
            result.total_points = 0;
            if (result.fishes.length) {
              result.fishes.forEach((f) => {
                if (f.weights > 0) {
                  let fish = competition.value.fishes.find(
                    (cf) => cf.id === f.id,
                  );
                  result.total_points += f.weights * fish.multiplier;
                  competition.value.total_weights += f.weights;
                  fish.weights += f.weights;
                  if (biggest_amounts.value[fish.name]) {
                    biggest_amounts.value[fish.name].push({
                      boat_number: result.boat_number,
                      captain_name: result.captain_name,
                      weight: f.weights,
                    });
                  } else {
                    biggest_amounts.value[fish.name] = [
                      {
                        boat_number: result.boat_number,
                        captain_name: result.captain_name,
                        weight: f.weights,
                      },
                    ];
                  }
                }
              });
            } else {
              // Fix for pdf
              competition.value.fishes.forEach((cf) => {
                result.fishes.push({
                  id: cf.id,
                  name: cf.name,
                  weights: "-",
                });
              });
            }

            if (result.total_points > 0) {
              hasGottenFishCount.value++;
            }
          });

          signees.value = results;
          calculateAll();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    selected_print.value = [];
    signee_headers.value = [
      { text: "boat-number", value: "boat_number" },
      { text: "captain-name", value: "captain_name" },
      { text: "temp-captain-name", value: "temp_captain_name" },
      { text: "locality", value: "locality" },
      { text: "starting-place", value: "starting_place" },
    ];
    let placement = 1;
    try {
      if (competition.value.isTeamCompetition) {
        signee_headers.value.push({ text: "team", value: "team" });
        team_results.value = competition.value.team_results;
        let last_points = -1;
        let last_placement = -1;
        team_results.value.forEach((team) => {
          if (last_points === team.points) {
            team.placement = last_placement;
          } else {
            team.placement = last_placement = placement;
            last_points = team.points;
          }
          placement++;
        });
      }

      if (fishes_chart.value && signees_chart.value) {
        fishes_chart.value.destroy();
        signees_chart.value.destroy();
      }
      nextTick(() => {
        let charts = initChartData(
          competition.value.fishes,
          table_fish_names.value,
          hasGottenFishCount.value,
          signees.value.length,
          locale.value,
        );

        fishes_chart_title.value = charts.fishes_chart.title;
        fishes_chart_data.value = charts.fishes_chart.data;
        signee_chart_title.value = charts.signee_chart.title;
        signee_chart_data.value = charts.signee_chart.data;
      });

      if (reload) {
        text.value = "notification.info-up-to-date";
        snackbar.value = true;
      }
    } catch (err) {
      console.error(err);
    }

    loading_competition.value = false;
  }
}

function pickCompetition() {
  if (selected_competition.value) {
    competition.value = selected_competition.value;
    refreshCompetition(true, competition.value);
  }
}

// Runs when the component is created

onMounted(async () => {
  /* eslint-disable no-unused-vars */
  try {
    loading.value = true;
    // Query competitions that are public
    const query = { isPublic: true };
    competitions.value = await CompetitionService.getCompetitions(query);
    if (competitions.value.length) {
      competitions.value.forEach((competition) => {
        competition.start_date = new Date(competition.start_date);
        competition.end_date = new Date(competition.end_date);
        competition.select = `${
          competition.name
        }, ${formatDateToLocaleDateString(competition.start_date)} (${
          competition.cup_name ? competition.cup_name : ""
        })`;
      });
      // Sort them based on start_date so the oldest competitions are the last
      competitions.value.sort((a, b) => {
        return a.start_date < b.start_date;
      });
    } else {
      signees.value = [];
      biggest_fishes.value = [];
      biggest_amounts.value = [];
    }
  } catch (error) {
    console.error(error.message);
  }
  loading.value = false;
});
</script>
