<template>
  <!-- /results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-dialog v-model="pdfDialog" width="500">
      <v-card>
        <v-card-title>{{ $t("settings") }} </v-card-title>
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

    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-row>
        <v-col>
          <v-card
            style="background: transparent"
            elevation="3"
            variant="outlined"
          >
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-row class="justify-center">
                  <v-col>
                    <h1 style="margin: 30px">{{ $t("results") }}</h1>
                  </v-col>
                </v-row>
                <v-row class="justify-center align-center">
                  <v-col cols="4">
                    <v-switch
                      :loading="loading"
                      v-model="intervalSwitch"
                      color="orange-darken-3"
                      :label="$t('button.auto-download')"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row
                  class="justify-center align-center"
                  style="padding-bottom: 20px"
                  v-if="
                    normal_points.length ||
                    team_results.length ||
                    biggest_fishes_results.length ||
                    biggest_amounts_results.length
                  "
                >
                  <v-col>
                    <v-dialog
                      v-model="dialog_print"
                      scrollable
                      max-width="300px"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="red-lighten-2"
                          :loading="loading"
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
                        <v-card-title>{{ $t("choose-download") }}</v-card-title>
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
                              color="yellow-darken-3"
                              @click="dialog_print = false"
                              variant="outlined"
                              >{{ $t("close") }}</v-btn
                            >
                          </v-col>
                          <v-col>
                            <v-btn
                              color="green-lighten-1"
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
              </v-col>
            </v-row>
          </v-card>
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
        <!-- Tilastoja -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'stats'"
        >
          <v-row v-if="loading">
            <v-col>
              <h2 class="text-white">{{ $t("loading") }}...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
          <stats
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
                (signees.length && selected_normal === 'signees-signed')
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
            :loading="loading"
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
            :loading="loading"
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
              >
                <template v-slot:item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="['all', 'winners'].includes(item) ? $t(item) : item"
                  />
                </template>
                <template v-slot:selection="{ item }">
                  <span v-if="item === 'all' || item === 'winners'">{{
                    $t(item)
                  }}</span>
                  <span v-else>{{ item }}</span>
                </template></v-select
              >
            </v-col>
            <v-col md="3" offset-md="1" v-if="biggest_fishes_results.length">
              <v-btn
                color="red-lighten-2"
                :loading="loading"
                @click="
                  pdf = '#biggest-fishes-table';
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
          <biggest-fishes
            :biggest_fishes_results="biggest_fishes_results"
            :fish_names="fish_names"
            :loading="loading"
            :headers="biggest_fishes_headers"
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
              >
                <template v-slot:item="{ item, props }">
                  <v-list-item
                    v-bind="props"
                    :title="['all', 'winners'].includes(item) ? $t(item) : item"
                  />
                </template>
                <template v-slot:selection="{ item }">
                  <span v-if="item === 'all' || item === 'winners'">{{
                    $t(item)
                  }}</span>
                  <span v-else>{{ item }}</span>
                </template></v-select
              >
            </v-col>
            <v-col md="3" offset-md="1" v-if="biggest_amounts_results.length">
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
                <v-icon color="red">mdi-file-pdf-box</v-icon>
                {{ $t("download") }} pdf
              </v-btn>
            </v-col>
          </v-row>
          <biggest-amounts
            :biggest_amounts_results="biggest_amounts_results"
            :fish_names="fish_names"
            :headers="biggest_amounts_headers"
            :loading="loading"
            :search_amounts="search_amounts"
            :selected_biggest_amount="selected_biggest_amount"
          ></biggest-amounts>
        </v-window-item>
      </v-window>
      <div v-if="competition">
        <v-card
          style="background: transparent"
          elevation="3"
          variant="outlined"
        >
          <v-row v-if="!loading" style="margin-top: 20px; margin-bottom: 10px">
            <v-col>
              <v-btn
                rounded
                :color="
                  competition.isPublic ? 'grey-darken-4' : 'green-darken-4'
                "
                @click="publishCompetition(competition.isPublic)"
                class="text-white"
                :loading="updating"
                size="large"
              >
                <div v-if="competition.isPublic">
                  <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
                </div>
                <div v-else>
                  <v-icon color="green">mdi-publish</v-icon
                  >{{ $t("button.set-public") }}
                </div>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                rounded
                :color="competition.isFinished ? 'yellow' : 'green-darken-3'"
                @click="endCompetition(competition.isFinished)"
                :loading="updating"
                size="large"
              >
                <span v-if="competition.isFinished" class="text-black">
                  <v-icon color="red-darken-2">mdi-cancel</v-icon
                  >{{ $t("button.set-not-complete") }}
                </span>
                <span v-else>
                  <v-icon color="yellow">mdi-trophy</v-icon
                  >{{ $t("button.set-complete") }}
                </span>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                id="updatebtn"
                rounded
                color="blue-darken-4"
                @click="refreshCompetition(competition._id)"
                class="text-white"
                :loading="updating"
                size="large"
              >
                <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2 class="text-white">{{ $t("refreshing") }}</h2>
            </v-col>
            <ProgressBarQuery />
          </v-row>
        </v-card>
      </div>
    </v-container>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </div>
</template>
<script setup>
import {
  defineAsyncComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import Timedate from "../components/layout/Timedate.vue";
import Stats from "../components/results/Stats.vue";
import TeamComp from "../components/results/TeamComp.vue";
import NormalComp from "../components/results/NormalComp.vue";
import BiggestFishes from "../components/results/BiggestFishes.vue";
import BiggestAmounts from "../components/results/BiggestAmounts.vue";
import {
  resizeChartForPDF,
  initChartData,
  changeChartLanguage,
} from "@/utils/charts";
import {
  calculateNormalResults,
  calculateBiggestFishes,
  calculateBiggestAmounts,
} from "@/utils/results";
import { saveAllAsPDF, saveAsPDF, saveStatsAsPDF } from "@/pdf";
import NotificationBar from "../components/NotificationBar.vue";

defineOptions({ name: "Results" });
const store = useMainStore();
const { t, locale } = useI18n();

const dialog_clock = ref(false);
const dialog = ref(false);
const dialog_print = ref(false);
const loading = ref(false);
const updating = ref(false);
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
const competition = ref(null);
const isTeamCompetition = ref(false);
const selected_normal = ref(null);
const fishes_chart = ref(null);
const signees_chart = ref(null);
const timer_refresh = ref(null);
const interval = ref(60000);
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
const intervalSwitch = ref(false);
const signee_chart_data = ref(null);
const fishes_chart_data = ref(null);
const fishes_chart_title = ref(null);
const signee_chart_title = ref(null);
const snackbar = ref(false);
const text = ref("");
const pdf = ref(null);
const pdfDialog = ref(false);
const isLandscape = ref(false);
const hasGottenFishCount = ref(0);

watch(intervalSwitch, (newValue) => {
  //called whenever switch1 changes
  if (newValue) {
    const competition = JSON.parse(localStorage.getItem("competition"));
    const competition_id = competition["_id"];
    timer_refresh.value = setInterval(
      () => refreshCompetition(competition_id),
      interval.value,
    );
    text.value = "notification.auto-update-enabled";
    snackbar.value = true;
  } else {
    clearInterval(timer_refresh.value);
    text.value = "notification.auto-update-disabled";
    snackbar.value = true;
  }
});

watch(locale, (newValue) => {
  if (newValue) {
    let s = snackbar.value.valueOf();
    snackbar.value = false;
    const i18n = changeChartLanguage(newValue);
    nextTick(() => {
      signee_chart_data.value.labels = i18n.signee_labels;
      signee_chart_data.value.datasets[0].label = i18n.signee_dataset_label;
      fishes_chart_data.value.datasets[0].label = i18n.fishes_dataset_label;
      snackbar.value = s;
    });
  }
});

function getMultiplierColor(multiplier) {
  if (multiplier === 1) return "green";
  else if (multiplier > 1 && multiplier < 25) return "orange";
  else return "red";
}

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

// Fetch competition from database, and update all the arrays

async function refreshCompetition(competition_id) {
  loading.value = true;
  fish_names.value = []; // Fish names, including "winners"
  fish_amount_names.value = [];
  table_fish_names.value = []; // only fish names
  signee_headers.value = [
    { text: "boat-number", value: "boat_number" },
    { text: "captain-name", value: "captain_name" },
    { text: "temp-captain-name", value: "temp_captain_name" },
    { text: "locality", value: "locality" },
    { text: "starting-place", value: "starting_place" },
  ];
  let placement = 1;
  try {
    // Query competition with id
    let _competition = await CompetitionService.getCompetitions({
      _id: competition_id,
    });
    // If competition found
    if (_competition) {
      // Pick first result (the array should only have one, since id's are unique)
      competition.value = _competition;
      // Else update and calculate from picked competition
      fish_names.value = []; // Fish names, including "winners"
      fish_amount_names.value = [];
      table_fish_names.value = []; // only fish names

      fish_names.value.push("all");
      fish_amount_names.value.push("all");
      weight_headers.value = [
        { text: "placement", value: "placement" },
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
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
      fish_names.value.push("winners");
      fish_amount_names.value.push("winners");
      weight_headers.value.push({ text: "points", value: "total_points" });
      // Get results === signees
      await ResultService.getResults({ competition_id: _competition._id })
        .then((results) => {
          competition.value.total_weights = 0;
          hasGottenFishCount.value = 0;
          results.forEach((result) => {
            result.total_points = 0;
            if (result.fishes.length) {
              competition.value.fishes.forEach((fish) => {
                let foundFish = result.fishes.find((rf) => rf.id === fish.id);
                if (foundFish) {
                  result.total_points += foundFish.weights * fish.multiplier;
                  competition.value.total_weights += foundFish.weights;
                  fish.weights += foundFish.weights;
                  if (biggest_amounts.value[fish.name]) {
                    biggest_amounts.value[fish.name].push({
                      boat_number: result.boat_number,
                      captain_name: result.captain_name,
                      weight: foundFish.weights,
                    });
                  } else {
                    biggest_amounts.value[fish.name] = [
                      {
                        boat_number: result.boat_number,
                        captain_name: result.captain_name,
                        weight: foundFish.weights,
                      },
                    ];
                  }
                } else {
                  result.fishes.push({
                    id: fish.id,
                    name: fish.name,
                    weights: "-",
                  });
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
        })
        .catch((e) => {
          console.log(e);
        });

      await FishService.getFishes({ competition_id: _competition._id })
        .then((r) => {
          biggest_fishes.value = r;
        })
        .catch((e) => {
          console.log(e);
        });

      calculateAll();

      // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
      store.refreshCompetition(competition.value);

      if (competition.value.isTeamCompetition) {
        signee_headers.value.push({ text: "Tiimi", value: "team" });
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

      text.value = "notification.info-up-to-date";
      snackbar.value = true;
    } else {
      signees.value = [];
      biggest_fishes.value = [];
      biggest_amounts.value = [];
    }
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
  tab.value = "stats";
}

async function publishCompetition(isPublic) {
  competition.value.isPublic = !isPublic;
  const newvalues = {
    $set: { isPublic: competition.value.isPublic },
  };
  updateToDatabase(competition.value, newvalues);
}

async function endCompetition(isFinished) {
  competition.value.isFinished = !isFinished;
  competition.value.isFinished
    ? (competition.value.state = "ended")
    : (competition.value.state = "not-finished");

  const newvalues = {
    $set: {
      isFinished: competition.value.isFinished,
      state: competition.value.state,
    },
  };
  updateToDatabase(competition.value, newvalues);
}

async function updateToDatabase(competition, newvalues) {
  try {
    store.refreshCompetition(competition);
    updating.value = true;
    await CompetitionService.updateValues(competition._id, newvalues);
  } catch (err) {
    console.error(err.message);
  }
  updating.value = false;
}

// "Wrapper" to calculate all the results at once

async function calculateAll() {
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
  // Prevent v-select having no value, would show error
  if (!selected_normal.value) {
    selected_normal.value = "fishes";
  }
  // If "Pisteet" selected in v-select, update headers and this.results (table data)
  if (selected_normal.value === "points") {
    results.value = normal_points.value; // sfdsad
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

// Runs when the component is created
/* eslint-disable no-unused-vars */
if (localStorage.getItem("competition") != null) {
  const competition = JSON.parse(localStorage.getItem("competition"));
  const competition_id = competition["_id"];
  //Update competition every minute
  refreshCompetition(competition_id);
}

onMounted(() => {});

onBeforeUnmount(() => {
  // Clear timer
  clearInterval(timer_refresh.value);
});
</script>
<style scoped></style>
