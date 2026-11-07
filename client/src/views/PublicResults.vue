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
      <v-card
        style="background: transparent"
        elevation="3"
        variant="outlined"
      >
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
            <v-tabs slider-color="blue-darken-4"
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
                  inputarea: !$store.getTheme,
                  'inputarea-dark': $store.getTheme,
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
                  inputarea: !$store.getTheme,
                  'inputarea-dark': $store.getTheme,
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
                  inputarea: !$store.getTheme,
                  'inputarea-dark': $store.getTheme,
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
                  inputarea: !$store.getTheme,
                  'inputarea-dark': $store.getTheme,
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
                  inputarea: !$store.getTheme,
                  'inputarea-dark': $store.getTheme,
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
<script>
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
  initChartData,
  saveAllAsPDF,
  saveAsPDF,
  saveStatsAsPDF,
  resizeChartForPDF,
  formatDateToLocaleDateString,
  getYear,
} from "../shared";
import NotificationBar from "../components/NotificationBar.vue";

export default {
  name: "PublicResults",
  components: {
    ProgressBarQuery,
    Stats,
    TeamComp,
    NormalComp,
    BiggestFishes,
    BiggestAmounts,
    NotificationBar,
  },
  data() {
    return {
      pdfDialog: false,
      pdf: null,
      isLandscape: false,
      competitions: [],
      competition: null,
      selected_competition: null,
      loading: false,
      loading_competition: false,
      tab: null,
      signees: [],
      fish_names: [],
      fish_amount_names: [],
      table_fish_names: [],
      results: [],
      normal_points: [],
      normal_weights: [],
      team_results: [],
      biggest_fishes: {},
      biggest_fishes_results: [],
      selected_biggest_fish: null,
      biggest_amounts: {},
      biggest_amounts_results: [],
      selected_biggest_amount: null,
      results_found_fishes: "",
      results_found_amounts: "",
      isTeamCompetition: false,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      selected_normal: null,
      fishes_chart: null,
      signees_chart: null,
      normal_options: ["fishes", "points", "signees-signed"],
      headers: [],
      biggest_fishes_headers: [],
      biggest_amounts_headers: [],
      normal_headers: [
        { text: "placement", value: "placement" },
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
        { text: "temp-captain-name", value: "temp_captain_name" },
        { text: "locality", value: "locality" },
        { text: "points", value: "total_points" },
      ],
      cup_headers: [
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
      ],
      weight_headers: [],
      signee_headers: [],
      team_headers: [
        { text: "placement", value: "placement" },
        { text: "team", value: "name" },
        { text: "name", value: "captain_name_1" },
        { text: "name", value: "captain_name_2" },
        { text: "name", value: "captain_name_3" },
        { text: "points", value: "points" },
      ],
      search: "",
      search_team: "",
      search_fishes: "",
      search_amounts: "",
      selected_print: [],
      dialog: false,
      signee_chart_data: null,
      fishes_chart_data: null,
      fishes_chart_title: null,
      signee_chart_title: null,
      snackbar: false,
      text: "",

      hasGottenFishCount: 0,
    };
  },
  created() {},
  async mounted() {
    /* eslint-disable no-unused-vars */
    try {
      this.loading = true;
      // Query competitions that are public
      const query = { isPublic: true };
      this.competitions = await CompetitionService.getCompetitions(query);
      if (this.competitions.length) {
        this.competitions.forEach((competition) => {
          competition.start_date = new Date(competition.start_date);
          competition.end_date = new Date(competition.end_date);
          competition.select = `${
            competition.name
          }, ${formatDateToLocaleDateString(competition.start_date)} (${
            competition.cup_name ? competition.cup_name : ""
          })`;
        });
        // Sort them based on start_date so the oldest competitions are the last
        this.competitions.sort((a, b) => {
          return a.start_date < b.start_date;
        });
      } else {
        this.signees = [];
        this.biggest_fishes = [];
        this.biggest_amounts = [];
      }
    } catch (error) {
      console.error(error.message);
    }
    this.loading = false;
  },

  methods: {
    getYear: getYear,
    formatDateToLocaleDateString: formatDateToLocaleDateString,
    pdfWrapper() {
      let comp_type = "";
      let selected = "";

      if (this.pdf === "Tilastoja") {
        resizeChartForPDF();
        saveStatsAsPDF(
          this.pdf,
          this.isLandscape ? "landscape" : "portrait",
          this.competition,
          this.signees,
          this.hasGottenFishCount
        );
      } else {
        if (this.pdf === "#normal-table") {
          comp_type = `${this.$t("normal-results")} (${this.$t(
            this.selected_normal
          )})`;
        }
        if (this.pdf === "#team-table") {
          comp_type = `${this.$t("team-results")}`;
        }
        if (this.pdf === "#biggest-fishes-table") {
          selected =
            this.selected_biggest_fish === "all" ||
            this.selected_biggest_fish === "winners"
              ? this.$t(this.selected_biggest_fish)
              : this.selected_biggest_fish;
          comp_type = `${this.$t("biggest-fishes")} (${selected})`;
        }
        if (this.pdf === "#biggest-amounts-table") {
          selected =
            this.selected_biggest_amount === "all" ||
            this.selected_biggest_amount === "winners"
              ? this.$t(this.selected_biggest_amount)
              : this.selected_biggest_amount;
          comp_type = `${this.$t("biggest-amounts")} (${selected})`;
        }

        saveAsPDF(
          comp_type,
          this.pdf,
          this.isLandscape ? "landscape" : "portrait",
          this.competition,
          this.signees,
          this.selected_normal,
          this.selected_biggest_fish,
          this.selected_biggest_amount,
          this.normal_points,
          this.normal_weights,
          this.biggest_fishes_results,
          this.biggest_amounts_results,
          this.team_results,
          this.table_fish_names
        );
      }
    },
    choosePrints() {
      this.dialog = false;
      if (this.selected_print.length) {
        let results = saveAllAsPDF(
          this.tab,
          this.isLandscape ? "landscape" : "portrait",
          this.text,
          this.snackbar,
          this.selected_biggest_fish,
          this.selected_biggest_amount,
          this.selected_print,
          this.competition,
          this.signees,
          this.hasGottenFishCount,
          this.biggest_fishes,
          this.biggest_amounts,
          this.normal_points,
          this.normal_weights,
          this.team_results,
          this.table_fish_names
        );
        this.tab = results.tab;
        this.text = results.text;
        this.snackbar = results.snackbar;
      }
    },
    cancelSelection() {
      this.competition = null;
      this.selected_competition = null;
    },
    // "Wrapper" to calculate all the results at once
    calculateAll() {
      let results = calculateNormalResults(this.competition, this.signees);
      this.signees = results.signees.sort(
        (a, b) => a.boat_number - b.boat_number
      );
      this.normal_points = results.normal_points;
      this.normal_weights = results.normal_weights;

      this.switchNormalResults();
      this.switchBiggestFishes();
      this.switchBiggestAmounts();
    },
    // Switch table headers and columns based on this.selected_normal value (v-select)
    switchNormalResults() {
      // If "Pisteet" selected in v-select, update headers and this.results (table data)
      if (!this.selected_normal) this.selected_normal = "fishes";
      if (this.selected_normal === "points") {
        this.results = this.normal_points;
        if (this.competition.isCupCompetition) {
          this.headers = this.cup_headers;
        } else {
          this.headers = this.normal_headers;
        }
      }
      // If "Kalat" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "fishes") {
        this.headers = this.weight_headers;
        this.results = this.normal_weights;
      }
      if (this.selected_normal === "signees-signed") {
        this.headers = this.signee_headers;
        this.results = this.signees;
      }
    },
    switchBiggestFishes() {
      let results = calculateBiggestFishes(
        this.biggest_fishes,
        this.table_fish_names,
        this.selected_biggest_fish
      );
      this.selected_biggest_fish = results.selected_fish;
      this.biggest_fishes_headers = results.header;
      this.biggest_fishes_results = results.results;
    },
    switchBiggestAmounts() {
      let results = calculateBiggestAmounts(
        this.biggest_amounts,
        this.selected_biggest_amount,
        this.table_fish_names
      );
      this.selected_biggest_amount = results.selected_amount;
      this.biggest_amounts_headers = results.header;
      this.biggest_amounts_results = results.results;
    },
    // Fetch competition from database, and update all the arrays
    async refreshCompetition(reload, comp) {
      if (comp) {
        this.loading_competition = true;
        // Load from database
        if (reload) {
          //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.competition = comp;
          // Else update and calculate from picked competition
          this.fish_names = []; // Fish names, including "Voittajat"
          this.fish_amount_names = [];
          this.table_fish_names = []; // only fish names

          this.fish_names.push("Kaikki");
          this.fish_amount_names.push("Kaikki");
          this.weight_headers = [
            { text: "Sijoitus", value: "placement" },
            { text: "Kilp. numero", value: "boat_number" },
            { text: "Kippari", value: "captain_name" },
          ];
          this.competition.fishes.forEach((fish) => {
            fish.weights = 0;
            this.fish_names.push(fish.name);
            this.fish_amount_names.push(fish.name);
            this.table_fish_names.push(fish.name);
            this.weight_headers.push({
              text: fish.name,
              value: String(fish.id),
            });
          });
          this.fish_names.push("Voittajat");
          this.fish_amount_names.push("Voittajat");
          this.weight_headers.push({ text: "Tulos", value: "total_points" });

          await FishService.getFishes({ competition_id: this.competition._id })
            .then((r) => {
              this.biggest_fishes = r;
            })
            .catch((e) => {
              console.log(e);
            });

          // Get results === signees
          await ResultService.getResults({
            competition_id: this.competition._id,
          })
            .then((results) => {
              this.competition.total_weights = 0;
              this.hasGottenFishCount = 0;
              results.forEach((result) => {
                result.total_points = 0;
                if (result.fishes.length) {
                  result.fishes.forEach((f) => {
                    if (f.weights > 0) {
                      let fish = this.competition.fishes.find(
                        (cf) => cf.id === f.id
                      );
                      result.total_points += f.weights * fish.multiplier;
                      this.competition.total_weights += f.weights;
                      fish.weights += f.weights;
                      if (this.biggest_amounts[fish.name]) {
                        this.biggest_amounts[fish.name].push({
                          boat_number: result.boat_number,
                          captain_name: result.captain_name,
                          weight: f.weights,
                        });
                      } else {
                        this.biggest_amounts[fish.name] = [
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
                  this.competition.fishes.forEach((cf) => {
                    result.fishes.push({
                      id: cf.id,
                      name: cf.name,
                      weights: "-",
                    });
                  });
                }

                if (result.total_points > 0) {
                  this.hasGottenFishCount++;
                }
              });

              this.signees = results;
              this.calculateAll();
            })
            .catch((e) => {
              console.log(e);
            });
        }

        this.selected_print = [];
        this.signee_headers = [
          { text: "boat-number", value: "boat_number" },
          { text: "captain-name", value: "captain_name" },
          { text: "temp-captain-name", value: "temp_captain_name" },
          { text: "locality", value: "locality" },
          { text: "starting-place", value: "starting_place" },
        ];
        let placement = 1;
        try {
          if (this.competition.isTeamCompetition) {
            this.signee_headers.push({ text: "team", value: "team" });
            this.team_results = this.competition.team_results;
            let last_points = -1;
            let last_placement = -1;
            this.team_results.forEach((team) => {
              if (last_points === team.points) {
                team.placement = last_placement;
              } else {
                team.placement = last_placement = placement;
                last_points = team.points;
              }
              placement++;
            });
          }

          if (this.fishes_chart && this.signees_chart) {
            this.fishes_chart.destroy();
            this.signees_chart.destroy();
          }
          this.$nextTick(() => {
            let charts = initChartData(
              this.competition.fishes,
              this.table_fish_names,
              this.hasGottenFishCount,
              this.signees.length,
              this.$i18n.locale
            );

            this.fishes_chart_title = charts.fishes_chart.title;
            this.fishes_chart_data = charts.fishes_chart.data;
            this.signee_chart_title = charts.signee_chart.title;
            this.signee_chart_data = charts.signee_chart.data;
          });

          if (reload) {
            this.text = "notification.info-up-to-date";
            this.snackbar = true;
          }
        } catch (err) {
          console.error(err);
        }

        this.loading_competition = false;
      }
    },
    pickCompetition() {
      if (this.selected_competition) {
        this.competition = this.selected_competition;
        this.refreshCompetition(true, this.competition);
      }
    },
  },
};
</script>
