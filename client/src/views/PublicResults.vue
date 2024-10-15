<template>
  <!-- /public-results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-card
        style="background: transparent"
        elevation="10"
        outlined
        :dark="$store.getters.getTheme"
      >
        <v-row>
          <v-dialog v-model="pdfDialog" width="500">
            <v-card :dark="$store.getters.getTheme">
              <v-card-title> Pdf Asetukset </v-card-title>
              <v-card-text>
                <v-checkbox
                  label="Pfd Vaakatasossa"
                  v-model="isLandscape"
                ></v-checkbox>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn color="yellow" text @click="pdfDialog = false">
                  Peruuta
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="
                    pdfDialog = false;
                    pdfWrapper();
                  "
                >
                  Lataa
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col md="6" offset-md="3">
                <h1>Kilpailujen tuloksia</h1>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length" class="scroll_table">
              <v-col md="6" offset-md="3">
                <!-- TODO add v-autocompelete, but so that it popsup the keyboad on mobile only when pressing search button? -->
                <v-autocomplete
                  dark
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                  v-model="selected_competition"
                  :items="competitions"
                  item-text="select"
                  item-value="_id"
                  label="Valitse näytettävä kilpailu"
                  :loading="loading"
                  outlined
                  @input="pickCompetition"
                  return-object
                  single-line
                >
                  <template v-slot:item="data">
                    <v-list-item-icon>
                      <v-icon v-if="data.item.isFinished" color="green"
                        >mdi-trophy</v-icon
                      >
                      <v-icon v-else color="yellow">mdi-trophy</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        ><span>{{
                          data.item.name + ", " + data.item.locality
                        }}</span></v-list-item-title
                      >
                      <v-list-item-subtitle
                        class="green--text"
                        v-if="data.item.isCupCompetition"
                        ><span>{{
                          data.item.cup_name +
                          " (" +
                          getYear(data.item.start_date) +
                          ")"
                        }}</span></v-list-item-subtitle
                      >
                      <v-list-item-subtitle class="blue--text"
                        ><span>{{
                          formatDateToLocaleDateString(data.item.start_date)
                        }}</span></v-list-item-subtitle
                      >
                      <v-list-item-subtitle v-if="!data.item.isFinished"
                        >Kesken!</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2 class="white--text">Ei kilpailuja saatavilla</h2>
              </v-col></v-row
            >
            <v-row
              align="center"
              justify="center"
              style="margin-bottom: 20px"
              v-if="selected_competition && competitions.length"
            >
              <v-col>
                <v-btn
                  large
                  outlined
                  color="yellow"
                  @click="cancelSelection"
                  :disabled="!competition"
                  class="black--text"
                >
                  <v-icon>mdi-cancel</v-icon>Peruuta valinta
                </v-btn>
              </v-col>
              <v-col>
                <v-dialog v-model="dialog" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      :dark="$store.getters.getTheme"
                      large
                      color="red lighten-2"
                      outlined
                      :loading="loading_competition"
                      :disabled="
                        !biggest_amounts_results.length || !competition
                      "
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa kaikki
                      tulokset
                    </v-btn>
                  </template>
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-text style="margin-top: 20px">
                      <h1>PDF Asetukset</h1>
                      <v-checkbox
                        label="Pfd Vaakatasossa"
                        v-model="isLandscape"
                      ></v-checkbox
                    ></v-card-text>
                    <v-card-title>Valitse mitä lataus sisältää</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px; width: 100%">
                      <v-checkbox
                        v-model="selected_print"
                        label="Tilastoja"
                        :disabled="!biggest_amounts_results.length"
                        color="indigo darken-3"
                        value="stats"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        label="Normaalikilpailun tulokset"
                        color="indigo darken-3"
                        value="normal"
                      ></v-checkbox>
                      <v-checkbox
                        v-if="isTeamCompetition"
                        :disabled="!team_results.length"
                        v-model="selected_print"
                        label="Tiimikilpailun tulokset"
                        color="indigo darken-3"
                        value="team"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        label="Suurimmat kalat ja kalasaaliit (Kaikki kalat samassa taulukossa)"
                        color="indigo darken-3"
                        value="all_biggest"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_fishes_results.length"
                        label="Suurimmat yksittäiset kalat (Kalalajeittain taulukossa)"
                        color="indigo darken-3"
                        value="biggest_fishes"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="!biggest_amounts_results.length"
                        label="Suurimmat kalasaaliit (Kalalajeittain taulukossa)"
                        color="indigo darken-3"
                        value="biggest_amounts"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="selected_print"
                        :disabled="
                          !biggest_amounts_results.length &&
                          !biggest_amounts_results.length
                        "
                        label="Suurimmat yksittäiset kalat / kalasaaliit (Voittajat)"
                        color="indigo darken-3"
                        value="biggest_winners"
                      ></v-checkbox>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-col>
                        <v-btn
                          outlined
                          color="red darken-4"
                          text
                          @click="dialog = false"
                          >Sulje</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          outlined
                          color="green darken-4"
                          text
                          @click="choosePrints"
                          >Lataa</v-btn
                        >
                      </v-col>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <!-- Tabs -->
            <v-tabs
              v-model="tab"
              background-color="blue lighten-2"
              color="blue darken-4"
              grow
              show-arrows
              next-icon="mdi-arrow-right-bold-box-outline"
              prev-icon="mdi-arrow-left-bold-box-outline"
              center-active
              v-if="selected_competition && competitions.length"
            >
              <v-tabs-slider color="blue darken-4"></v-tabs-slider>
              <v-tab href="#stats">Tilastoja</v-tab>
              <v-tab
                href="#normal-competition"
                :disabled="!selected_competition"
                >Normaalikilpailu</v-tab
              >
              <v-tab
                v-if="isTeamCompetition"
                href="#team-competition"
                :disabled="!selected_competition"
                >Tiimikilpailu</v-tab
              >
              <v-tab href="#biggest-fishes" :disabled="!selected_competition"
                >Suurimmat Kalat</v-tab
              >
              <v-tab
                href="#biggest-fish-amounts"
                :disabled="!selected_competition"
                >Suurimmat Kalasaaliit</v-tab
              >
            </v-tabs>
            <v-row v-if="loading" style="margin: 50px">
              <v-col>
                <h2 class="white--text">Haetaan kilpailuja...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-tabs-items
              v-model="tab"
              style="background: rgba(0, 0, 0, 0.4)"
              v-if="!loading && selected_competition"
            >
              <!-- Tilastoja -->
              <v-tab-item
                v-bind:class="{
                  inputarea: !$store.getters.getTheme,
                  'inputarea-dark': $store.getters.getTheme,
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
              </v-tab-item>
              <!-- Normaalikilpailu -->
              <v-tab-item
                v-bind:class="{
                  inputarea: !$store.getters.getTheme,
                  'inputarea-dark': $store.getters.getTheme,
                }"
                :value="'normal-competition'"
              >
                <v-row style="margin-top: 40px">
                  <v-col md="4" offset-md="4">
                    <v-select
                      dark
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                      label="Valitse näytettävät tulokset"
                      outlined
                      :items="normal_options"
                      @input="switchNormalResults"
                      v-model="selected_normal"
                    />
                  </v-col>
                  <v-col
                    v-if="
                      normal_points.length ||
                      (signees.length && selected_normal === 'Ilmoittautuneet')
                    "
                    md="3"
                  >
                    <v-btn
                      large
                      outlined
                      color="red lighten-2"
                      :dark="$store.getters.getTheme"
                      :loading="loading"
                      @click="
                        pdf = '#normal-table';
                        pdfDialog = true;
                      "
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon>
                      Lataa pdf
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
                ></normal-comp>
              </v-tab-item>
              <!-- Tiimikilpailu -->
              <v-tab-item
                v-bind:class="{
                  inputarea: !$store.getters.getTheme,
                  'inputarea-dark': $store.getters.getTheme,
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
              </v-tab-item>

              <!-- Suurimmat kalat -->
              <v-tab-item
                v-bind:class="{
                  inputarea: !$store.getters.getTheme,
                  'inputarea-dark': $store.getters.getTheme,
                }"
                :value="'biggest-fishes'"
              >
                <v-row style="padding-top: 50px">
                  <v-col md="3" offset-md="4">
                    <v-select
                      dark
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                      label="Valitse näytettävät tulokset"
                      outlined
                      @input="switchBiggestFishes"
                      v-model="selected_biggest_fish"
                      :items="fish_names"
                    />
                  </v-col>
                  <v-col
                    md="3"
                    offset-md="1"
                    v-if="biggest_fishes_results.length"
                  >
                    <v-btn
                      large
                      outlined
                      color="red lighten-2"
                      dark
                      :loading="loading_competition"
                      @click="
                        pdf = '#biggest-fishes-table';
                        pdfDialog = true;
                      "
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf
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
              </v-tab-item>

              <!-- Suurimmat kalasaaliit -->
              <v-tab-item
                v-bind:class="{
                  inputarea: !$store.getters.getTheme,
                  'inputarea-dark': $store.getters.getTheme,
                }"
                :value="'biggest-fish-amounts'"
              >
                <v-row style="padding-top: 50px">
                  <v-col md="3" offset-md="4">
                    <v-select
                      :dark="$store.getters.getTheme"
                      :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                      label="Valitse näytettävät tulokset"
                      outlined
                      @input="switchBiggestAmounts"
                      v-model="selected_biggest_amount"
                      :items="fish_amount_names"
                    />
                  </v-col>
                  <v-col
                    md="3"
                    offset-md="1"
                    v-if="biggest_amounts_results.length"
                  >
                    <v-btn
                      large
                      outlined
                      color="red lighten-2"
                      :loading="loading"
                      @click="
                        pdf = '#biggest-amounts-table';
                        pdfDialog = true;
                      "
                      :disabled="!biggest_amounts_results.length"
                    >
                      <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf
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
              </v-tab-item>
            </v-tabs-items>
            <div v-if="competition" style="margin: 20px">
              <v-row v-if="!loading_competition">
                <v-col>
                  <v-btn
                    id="updatebtn"
                    large
                    tile
                    :loading="loading_competition"
                    color="blue darken-4"
                    @click="refreshCompetition(true, competition)"
                    class="white--text"
                  >
                    <v-icon>mdi-update</v-icon>Päivitä tulokset
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <h2 class="white--text">
                    Päivitetään tuloksia tietokannasta...
                  </h2>
                  <ProgressBarQuery />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-card>
    </v-container>
  </div>
</template>
<script>
"use strict";

import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";

import ProgressBarQuery from "../components/layout/ProgressBarQuery";
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

export default {
  name: "PublicResults",
  components: {
    ProgressBarQuery,
    Stats,
    TeamComp,
    NormalComp,
    BiggestFishes,
    BiggestAmounts,
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
      normal_options: ["Kalat", "Pisteet", "Ilmoittautuneet"],
      headers: [],
      biggest_fishes_headers: [],
      biggest_amounts_headers: [],
      normal_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Paikkakunta", value: "locality" },
        { text: "Tulos", value: "total_points" },
      ],
      cup_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Paikkakunta", value: "locality" },
        { text: "Tulos", value: "total_points" },
        {
          text: "Cup (p)",
          value: "cup_points_total",
        },
      ],
      weight_headers: [],
      signee_headers: [],
      team_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Tiimi", value: "name" },
        { text: "Jäsen 1", value: "captain_name_1" },
        { text: "Jäsen 2", value: "captain_name_2" },
        { text: "Jäsen 3", value: "captain_name_3" },
        { text: "Pisteet", value: "points" },
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
      selectedItem: 0,
      items: [
        {
          text: "Kilpailujen tuloksia",
          icon: "mdi-seal",
          path: "/public-results",
          disabled: true,
        },
        {
          text: "Cuppien tuloksia",
          icon: "mdi-trophy",
          path: "/public-cups",
          disabled: false,
        },
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
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
          comp_type = `Normaalikilpailun tulokset (${this.selected_normal})`;
        }
        if (this.pdf === "#team-table") {
          comp_type = `Tiimikilpailun tulokset`;
        }
        if (this.pdf === "#biggest-fishes-table") {
          comp_type = `Suurimmat kalat (${this.selected_biggest_fish})`;
        }
        if (this.pdf === "#biggest-amounts-table") {
          comp_type = `Suurimmat kalat (${this.selected_biggest_amount})`;
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
      localStorage.removeItem("competition");
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
      if (!this.selected_normal) this.selected_normal = "Kalat";
      if (this.selected_normal === "Pisteet") {
        this.results = this.normal_points;
        if (this.competition.isCupCompetition) {
          this.headers = this.cup_headers;
        } else {
          this.headers = this.normal_headers;
        }
      }
      // If "Kalat" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "Kalat") {
        this.headers = this.weight_headers;
        this.results = this.normal_weights;
      }
      if (this.selected_normal === "Ilmoittautuneet") {
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
                  this.hasGottenFishCount++;
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
              });

              this.signees = results;
              this.calculateAll();

              this.$store.commit("refreshCompetition", this.competition);
              localStorage.setItem(
                "competition",
                JSON.stringify({
                  _id: this.competition._id,
                  start_date: this.competition.start_date,
                  end_date: this.competition.end_date,
                })
              );
            })
            .catch((e) => {
              console.log(e);
            });
        }

        this.selected_print = [];
        this.signee_headers = [
          { text: "Kilp. numero", value: "boat_number" },
          { text: "Kippari", value: "captain_name" },
          { text: "Varakippari", value: "temp_captain_name" },
          { text: "Paikkakunta", value: "locality" },
          { text: "Lähtöpaikka", value: "starting_place" },
        ];
        let placement = 1;
        try {
          if (this.competition.isTeamCompetition) {
            this.signee_headers.push({ text: "Tiimi", value: "team" });
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
              this.signees.length
            );

            this.fishes_chart_title = charts.fishes_chart.title;
            this.fishes_chart_data = charts.fishes_chart.data;
            this.signee_chart_title = charts.signee_chart.title;
            this.signee_chart_data = charts.signee_chart.data;
          });

          if (reload) {
            this.text = "Tiedot ajantasalla!";
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
        this.$store.commit("refreshCompetition", this.selected_competition);
        this.competition = this.selected_competition;
        localStorage.setItem(
          "competition",
          JSON.stringify({
            _id: this.competition._id,
            start_date: this.competition.start_date,
            end_date: this.competition.end_date,
          })
        );
        this.refreshCompetition(true, this.competition);
      }
    },
  },
};
</script>
