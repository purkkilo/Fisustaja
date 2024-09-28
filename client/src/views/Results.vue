<template>
  <!-- /results -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
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
    <v-row>
      <v-col>
        <CompetitionNavigation></CompetitionNavigation>
      </v-col>
      <v-col>
        <Timedate />
      </v-col>
    </v-row>

    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-row>
        <v-col>
          <v-card
            style="background: transparent"
            elevation="10"
            outlined
            :dark="$store.getters.getTheme"
          >
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12">
                <v-row justify="center">
                  <v-col>
                    <h1 style="margin: 30px">Tulokset</h1>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="4">
                    <v-switch
                      dark
                      :loading="loading"
                      v-model="intervalSwitch"
                      color="orange darken-3"
                      label="Tulosten automaattinen päivitys 60s välein"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row
                  align="center"
                  justify="center"
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
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          :dark="$store.getters.getTheme"
                          large
                          outlined
                          color="red lighten-2"
                          :loading="loading"
                          :disabled="
                            !biggest_amounts_results.length || !competition
                          "
                        >
                          <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa
                          kaikki tulokset
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
                        <v-card-title
                          >Valitse mitä lataus sisältää</v-card-title
                        >
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
                            label="Suurimmat kalat ja kalasaaliit (Kalalajit samassa taulukossa)"
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
                              !biggest_fishes_results.length &&
                              !biggest_amounts_results.length
                            "
                            label="Suurimmat yksittäiset kalat / kalasaaliit (Voittajat eritelty)"
                            color="indigo darken-3"
                            value="biggest_winners"
                          ></v-checkbox>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-col>
                            <v-btn
                              outlined
                              color="yellow darken-3"
                              @click="dialog_print = false"
                              >Sulje</v-btn
                            >
                          </v-col>
                          <v-col>
                            <v-btn
                              outlined
                              color="green lighten-1"
                              @click="choosePrints"
                              >Lataa</v-btn
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
        v-model="tab"
        background-color="blue lighten-2"
        color="blue darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#stats" :disabled="loading">Tilastoja</v-tab>
        <v-tab href="#normal-competition" :disabled="loading"
          >Normaalikilpailu</v-tab
        >
        <v-tab
          v-if="isTeamCompetition"
          href="#team-competition"
          :disabled="loading"
          >Tiimikilpailu</v-tab
        >
        <v-tab href="#biggest-fishes" :disabled="loading"
          >Suurimmat Kalat</v-tab
        >
        <v-tab href="#biggest-fish-amounts" :disabled="loading"
          >Suurimmat Kalasaaliit</v-tab
        >
      </v-tabs>

      <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- Tilastoja -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'stats'"
        >
          <v-row v-if="loading">
            <v-col>
              <h2 class="white--text">Ladataan tietoja...</h2>
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
            :loading="loading"
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
                @input="calculateBiggestFishes"
                v-model="selected_biggest_fish"
                :items="fish_names"
              />
            </v-col>
            <v-col md="3" offset-md="1" v-if="biggest_fishes_results.length">
              <v-btn
                large
                outlined
                color="red lighten-2"
                dark
                :loading="loading"
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
            :loading="loading"
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
                @input="calculateBiggestAmounts"
                v-model="selected_biggest_amount"
                :items="fish_amount_names"
              />
            </v-col>
            <v-col md="3" offset-md="1" v-if="biggest_amounts_results.length">
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
            :loading="loading"
            :results_found_amounts="results_found_amounts"
            :search_amounts="search_amounts"
            :selected_biggest_amount="selected_biggest_amount"
          ></biggest-amounts>
        </v-tab-item>
      </v-tabs-items>
      <div v-if="competition">
        <v-card
          style="background: transparent"
          elevation="10"
          outlined
          :dark="$store.getters.getTheme"
        >
          <v-row v-if="!loading" style="margin-top: 20px; margin-bottom: 10px">
            <v-col>
              <v-btn
                large
                rounded
                :color="
                  competition.isPublic ? 'grey darken-4' : 'green darken-4'
                "
                @click="publishCompetition(competition.isPublic)"
                class="white--text"
                :loading="updating"
              >
                <div v-if="competition.isPublic">
                  <v-icon>mdi-incognito</v-icon> Aseta kilpailu salaiseksi
                </div>
                <div v-else>
                  <v-icon color="green">mdi-publish</v-icon> Aseta kilpailu
                  julkiseksi
                </div>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                large
                rounded
                :color="competition.isFinished ? 'yellow' : 'green darken-3'"
                @click="endCompetition(competition.isFinished)"
                :loading="updating"
              >
                <span v-if="competition.isFinished" class="black--text">
                  <v-icon color="red darken-2">mdi-cancel</v-icon> Aseta
                  kilpailu keskeneräiseksi
                </span>
                <span v-else>
                  <v-icon color="yellow">mdi-trophy</v-icon> Aseta kilpailu
                  päättyneeksi
                </span>
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                id="updatebtn"
                large
                rounded
                color="blue darken-4"
                @click="refreshCompetition(competition._id)"
                class="white--text"
                :loading="updating"
              >
                <v-icon>mdi-update</v-icon>Päivitä tulokset
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2 class="white--text">Päivitetään...</h2>
            </v-col>
            <ProgressBarQuery />
          </v-row>
        </v-card>
      </div>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
"use strict";
import CompetitionService from "@/CompetitionService";
import ResultService from "@/ResultService";
import FishService from "../FishService";
import Timedate from "@/components/layout/Timedate";
import CompetitionNavigation from "@/components/layout/CompetitionNavigation.vue";
import Stats from "../components/results/Stats.vue";
import TeamComp from "../components/results/TeamComp.vue";
import NormalComp from "../components/results/NormalComp.vue";
import BiggestFishes from "../components/results/BiggestFishes.vue";
import BiggestAmounts from "../components/results/BiggestAmounts.vue";
import shared from "@/shared";

export default {
  name: "Results",
  components: {
    Timedate,
    ProgressBarQuery: () => require("@/components/layout/ProgressBarQuery"),
    CompetitionNavigation,
    Stats,
    TeamComp,
    NormalComp,
    BiggestFishes,
    BiggestAmounts,
  },
  data() {
    return {
      dialog_clock: false,
      dialog: false,
      dialog_print: false,
      loading: false,
      updating: false,
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
      competition: null,
      isTeamCompetition: false,
      selected_normal: null,
      fishes_chart: null,
      signees_chart: null,
      timer_refresh: null,
      interval: 60000,
      normal_options: ["Pisteet", "Kalat", "Ilmoittautuneet"],
      headers: [],
      biggest_fishes_headers: [],
      biggest_amounts_headers: [],
      normal_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Paikkakunta", value: "locality" },
        { text: "Tulos (p)", value: "total_points" },
        { text: "Cup (p)", value: "cup_points_total" },
      ],
      signee_headers: [],
      team_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Tiimi", value: "name" },
        { text: "Jäsen 1", value: "captain_name_1" },
        { text: "Jäsen 2", value: "captain_name_2" },
        { text: "Jäsen 3", value: "captain_name_3" },
        { text: "Pisteet", value: "points" },
      ],
      winner_headers: [
        { text: "Kalalaji", value: "name" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Paino (g)", value: "weight" },
      ],
      all_fishes_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Kala", value: "name" },
        { text: "Paino (g)", value: "weight" },
      ],
      biggest_headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Paino (g)", value: "weight" },
      ],
      search: "",
      search_team: "",
      search_fishes: "",
      search_amounts: "",
      selected_print: [],
      intervalSwitch: false,
      signee_chart_data: null,
      fishes_chart_data: null,
      fishes_chart_title: null,
      signee_chart_title: null,
      selectedItem: 4,
      items: [
        {
          text: "Yleisnäkymä",
          icon: "mdi-desktop-mac-dashboard",
          path: "/overview",
        },
        {
          text: "Määritykset",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "Ilmoittautuminen",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "Punnitus",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "Tulokset",
          icon: "mdi-seal",
          path: "/results",
        },
      ],
      snackbar: false,
      text: "",
      timeout: 5000,
      pdf: null,
      pdfDialog: false,
      isLandscape: false,
      hasGottenFishCount: 0,
    };
  },
  watch: {
    intervalSwitch(newValue) {
      //called whenever switch1 changes
      if (newValue) {
        const competition = JSON.parse(localStorage.getItem("competition"));
        const competition_id = competition["id"];
        this.timer_refresh = setInterval(
          () => this.refreshCompetition(competition_id),
          this.interval
        );
        this.text = "Automaattinen päivitys käytössä!";
        this.snackbar = true;
      } else {
        clearInterval(this.timer_refresh);
        this.text = "Automaattinen päivitys pois käytöstä!";
        this.snackbar = true;
      }
    },
  },
  created() {
    this.saveAllAsPDF = shared.saveAllAsPDF;
    this.saveStatsAsPDF = shared.saveStatsAsPDF;
    this.saveAsPDF = shared.saveAsPDF;
    this.capitalize_words = shared.capitalize_words;
    this.replaceAll = shared.replaceAll;
    this.formatDate = shared.formatDate;
    this.range = shared.range;
    this.getColorPoints = shared.getColorPoints;
    this.getColor = shared.getColor;
    this.initChartData = shared.initChartData;
    this.sortDict = shared.sortDict;
    /* eslint-disable no-unused-vars */
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      //Update competition every minute
      this.refreshCompetition(competition_id);
    }

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  mounted() {},
  beforeDestroy() {
    // Clear timer
    clearInterval(this.timer_refresh);
  },
  methods: {
    getMultiplierColor(multiplier) {
      if (multiplier === 1) return "green";
      else if (multiplier > 1 && multiplier < 25) return "orange";
      else return "red";
    },
    pdfWrapper() {
      if (this.pdf === "Tilastoja") {
        this.saveStatsAsPDF(
          this.pdf,
          this.isLandscape ? "landscape" : "portrait"
        );
      }
      if (this.pdf === "#normal-table") {
        this.saveAsPDF(
          `Normaalikilpailun tulokset (${this.selected_normal})`,
          this.pdf,
          this.isLandscape ? "landscape" : "portrait"
        );
      }
      if (this.pdf === "#team-table") {
        this.saveAsPDF(
          `Tiimikilpailun tulokset`,
          "#team-table",
          this.isLandscape ? "landscape" : "portrait"
        );
      }
      if (this.pdf === "#biggest-fishes-table") {
        this.saveAsPDF(
          `Suurimmat kalat (${this.selected_biggest_fish})`,
          "#biggest-fishes-table",
          this.isLandscape ? "landscape" : "portrait"
        );
      }
      if (this.pdf === "#biggest-amounts-table") {
        this.saveAsPDF(
          `Suurimmat kalat (${this.selected_biggest_amount})`,
          "#biggest-amounts-table",
          this.isLandscape ? "landscape" : "portrait"
        );
      }
    },
    changePage(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        this.text = "Olet jo tällä sivulla!";
        this.snackbar = true;
      }
    },
    choosePrints() {
      this.dialog = false;
      if (this.selected_print.length) {
        this.saveAllAsPDF(
          this.tab,
          this.isLandscape ? "landscape" : "portrait"
        );
      }
    },
    // Fetch competition from database, and update all the arrays
    async refreshCompetition(competition_id) {
      this.loading = true;
      this.fish_names = []; // Fish names, including "Voittajat"
      this.fish_amount_names = [];
      this.table_fish_names = []; // only fish names
      this.signee_headers = [
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Paikkakunta", value: "locality" },
        { text: "Lähtöpaikka", value: "starting_place" },
      ];
      let placement = 1;
      try {
        // Query competition with id
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        // If competition found
        if (competition) {
          // Pick first result (the array should only have one, since id's are unique)
          this.competition = competition;

          // Get results === signees
          await ResultService.getResults({ competition_id: competition._id })
            .then((r) => {
              this.competition.total_weights = 0;
              this.hasGottenFishCount = 0;
              r.forEach((s) => {
                s.total_points = 0;
                if (s.fishes.length) {
                  this.hasGottenFishCount++;

                  s.fishes.forEach((f) => {
                    let fish = this.competition.fishes.find(
                      (cf) => cf.index === f.index
                    );
                    s.total_points += f.weights * fish.multiplier;
                    this.competition.total_weights += f.weights;
                    fish.weights += f.weights;
                    if (this.biggest_amounts[fish.name]) {
                      this.biggest_amounts[fish.name].push({
                        boat_number: s.boat_number,
                        captain_name: s.captain_name,
                        weight: f.weights,
                      });
                    } else {
                      this.biggest_amounts[fish.name] = [
                        {
                          boat_number: s.boat_number,
                          captain_name: s.captain_name,
                          weight: f.weights,
                        },
                      ];
                    }
                  });
                } else {
                  // Fix for pdf
                  this.competition.fishes.forEach((cf) => {
                    s.fishes.push({ name: cf.name, weights: 0 });
                  });
                }
              });
              this.signees = r;
            })
            .catch((e) => {
              console.log(e);
            });

          this.calculateAll();

          // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", this.competition);
          this.isTeamCompetition = this.$store.getters.isTeamCompetition;

          this.selected_normal = "Pisteet";

          if (this.isTeamCompetition) {
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

          let temp_fish_names = this.$store.getters.getCompetitionFishes;
          this.fish_names.push("Kaikki");
          this.fish_amount_names.push("Kaikki");
          temp_fish_names.forEach((fish) => {
            this.fish_names.push(fish.name);
            this.fish_amount_names.push(fish.name);
            this.table_fish_names.push(fish.name);
          });
          this.fish_names.push("Voittajat");
          this.fish_amount_names.push("Voittajat");

          if (this.fishes_chart && this.signees_chart) {
            this.fishes_chart.destroy();
            this.signees_chart.destroy();
          }

          this.$nextTick(() => {
            let charts = this.initChartData(
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

          if (this.normal_points.length) {
            this.results = this.normal_points;
            this.headers = this.normal_headers;
          } else {
            this.results = this.signees;
            this.headers = this.signee_headers;
            this.selected_normal = "Ilmoittautuneet";
          }
          this.text = "Tiedot ajantasalla!";
          this.snackbar = true;
        } else {
          this.signees = [];
          this.biggest_fishes = [];
          this.biggest_amounts = [];
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.error(err);
      }
      this.loading = false;
      this.tab = "stats";
    },
    async publishCompetition(isPublic) {
      this.competition.isPublic = !isPublic;
      const newvalues = {
        $set: { isPublic: this.competition.isPublic },
      };
      this.updateToDatabase(this.competition, newvalues);
    },
    async endCompetition(isFinished) {
      this.competition.isFinished = !isFinished;
      this.competition.isFinished
        ? (this.competition.state = "Päättynyt")
        : (this.competition.state = "Kesken");

      const newvalues = {
        $set: { isFinished: this.competition.isFinished },
      };
      this.updateToDatabase(this.competition, newvalues);
    },

    async updateToDatabase(competition, newvalues) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.updating = true;
        await CompetitionService.updateValues(competition._id, newvalues);
      } catch (err) {
        console.error(err.message);
      }
      this.updating = false;
    },

    // "Wrapper" to calculate all the results at once
    async calculateAll() {
      this.calculateNormalResults(this.competition);
      this.calculateBiggestFishes(this.competition);
      this.calculateBiggestAmounts();
    },

    // "Normaalikilpailu" results
    calculateNormalResults(competition) {
      const placement_points = competition.cup_placement_points;
      let cup_placement_points = placement_points[0];
      const cup_participation_points = competition.cup_participation_points;
      let last_points = 0;
      let last_placement = 1;

      let placement = 1;
      let cup_points_total = 0;
      let normal_points = [];
      let normal_weights = [];
      this.signees = this.signees.filter((signee) => signee.returned == true);
      this.signees = this.signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
      // For every signee, calculate their cup points and placing
      //TODO rework the structure, seems more complex than it should be
      // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
      this.signees.forEach((signee, index) => {
        // If competitor has same points as last competitor
        if (signee.total_points === last_points) {
          placement = last_placement;
        }
        // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
        else {
          placement = index + 1;
        }

        // Find the placement points according to the placement
        let p = placement_points.find((e) => e.placement === placement);
        // If placement isn't found (placement > than provided placements), or points = 0 (no points from competition)
        if (!p || signee.total_points === 0) {
          cup_placement_points = 0;
        } else {
          cup_placement_points = p.points * competition.cup_points_multiplier;
        }
        // Calculate total cup points, cup points multiplier only scales the placement points
        cup_points_total = cup_placement_points + cup_participation_points;
        //For showing cup points, "Pisteet" on v-select
        normal_points.push({
          placement: placement,
          boat_number: signee.boat_number,
          captain_name: signee.captain_name,
          temp_captain_name: signee.temp_captain_name,
          locality: signee.locality,
          total_points: signee.total_points,
          cup_placement_points: cup_placement_points,
          cup_participation_points: cup_participation_points,
          cup_points_total: cup_points_total,
        });
        //For showing fish weights, "Kalat" on v-select
        let temp_dict = {};
        temp_dict.placement = placement;
        temp_dict.boat_number = signee.boat_number;
        temp_dict.captain_name = signee.captain_name;

        // For each fish, get the weight and fish name
        signee.fishes.forEach((weights) => {
          let name = weights.name;
          let weight = weights.weights;
          temp_dict[name] = weight;
        });
        temp_dict.total_points = signee.total_points;
        normal_weights.push(temp_dict);

        last_placement = placement;
        last_points = signee.total_points;
      });

      this.normal_points = normal_points;
      this.normal_weights = normal_weights;
    },

    // Switch table headers and columns based on this.selected_normal value (v-select)
    switchNormalResults() {
      // Prevent v-select having no value, would show error
      if (!this.selected_normal) {
        this.selected_normal = "Pisteet";
      }
      // If "Pisteet" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "Pisteet") {
        this.headers = this.normal_headers;
        this.results = this.normal_points;
      }
      // If "Kalat" selected in v-select, update headers and this.results (table data)
      if (this.selected_normal === "Kalat") {
        (this.headers = [
          { text: "Sijoitus", value: "placement" },
          { text: "Kilp. numero", value: "boat_number" },
          { text: "Kippari", value: "captain_name" },
        ]),
          (this.results = this.normal_weights);
        // Get fish names and add them to headers
        this.table_fish_names.forEach((name) => {
          this.headers.push({ text: name, value: name });
        });
        this.headers.push({ text: "Tulos (p)", value: "total_points" });
      }
      if (this.selected_normal === "Ilmoittautuneet") {
        this.headers = this.signee_headers;
        this.results = this.signees.sort(
          (a, b) => a.boat_number - b.boat_number
        );
      }
    },
    // Calculate "Suurimmat Kalat"
    async calculateBiggestFishes(competition) {
      // Get results === signees
      await FishService.getFishes({ competition_id: competition._id })
        .then((r) => {
          this.biggest_fishes = r;
        })
        .catch((e) => {
          console.log(e);
        });

      let placement = 1;
      this.results_found_fishes = null;

      // Check v-select value, don't allow it to go null because it shows error
      if (!this.selected_biggest_fish) {
        this.selected_biggest_fish = "Kaikki";
      }
      if (this.selected_biggest_fish === "Voittajat") {
        this.biggest_fishes_headers = this.winner_headers;
        this.biggest_fishes_results = [];
        this.table_fish_names.forEach((n) => {
          let temp_fishes = this.biggest_fishes.filter((f) => f.name === n);
          if (temp_fishes.length) {
            this.biggest_fishes_results.push(
              temp_fishes.sort((a, b) => b.weight - a.weight)[0]
            );
          }
        });
      } else if (this.selected_biggest_fish === "Kaikki") {
        this.biggest_fishes_headers = this.all_fishes_headers;

        if (this.biggest_fishes.length) {
          this.biggest_fishes_results = this.biggest_fishes.sort((a, b) => {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          this.results_found_amounts = "";
        } else {
          this.results_found_fishes = "- Ei tuloksia";
        }

        let last_weight = -1;
        let last_placement = -1;
        this.biggest_fishes_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
      } else {
        this.biggest_fishes_headers = this.biggest_headers;
        // If v-select (this.selected_biggest_fish) not "Voittajat", get fish related results and sort them
        // based on the v-select fish name
        let fish_results = [];
        this.biggest_fishes_results = this.biggest_fishes.filter(
          (f) => f.name === this.selected_biggest_fish
        );

        if (this.biggest_fishes_results.length) {
          this.biggest_fishes_results.sort((a, b) => {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          this.results_found_amounts = "";
        } else {
          this.results_found_fishes = "- Ei tuloksia";
        }
        let last_weight = -1;
        let last_placement = -1;
        this.biggest_fishes_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
      }
    },
    // Calculate "Suurimmat kalasaaliit", works exactly like the calculateBiggestFishes
    //TODO make these 2 to one function
    calculateBiggestAmounts() {
      let fishes = this.biggest_amounts;
      let placement = 1;
      this.results_found_amount = "";
      if (!this.selected_biggest_amount) {
        this.selected_biggest_amount = "Kaikki";
      }
      if (this.selected_biggest_amount === "Voittajat") {
        this.biggest_amounts_headers = this.winner_headers;
        this.biggest_amounts_results = this.sortDict(fishes);
      } else if (this.selected_biggest_amount === "Kaikki") {
        this.biggest_amounts_headers = this.all_fishes_headers;
        // If v-select (this.selected_biggest_fish) not "Voittajat", get fish related results and sort them
        // based on the v-select fish name
        let fish_results = [];
        for (const fish of Object.keys(fishes)) {
          fishes[fish].forEach((result) => {
            result.name = fish;
            let previous = fish_results.find(
              (r) => r.boat_number === result.boat_number
            );
            if (previous) {
              if (previous.weight < result.weight) {
                previous = {
                  ...result,
                  name: fish,
                };
              }
            } else {
              fish_results.push(result);
            }
          });
        }

        if (fish_results.length) {
          fish_results.sort((a, b) => {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          this.results_found_amounts = "";
        } else {
          this.results_found_amount = "- Ei tuloksia";
        }

        let last_weight = -1;
        let last_placement = -1;
        this.biggest_amounts_results = fish_results;
        this.biggest_amounts_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
      } else {
        this.biggest_amounts_headers = this.biggest_headers;
        let fish_results = [];
        if (fishes[this.selected_biggest_amount]) {
          fish_results = fishes[this.selected_biggest_amount].sort((a, b) => {
            return parseInt(b.weight) - parseInt(a.weight);
          });
          fish_results = fish_results.filter(
            (result) => parseInt(result.weight) > 0
          );
          this.results_found_amounts = "";
        } else {
          this.results_found_amount = "- Ei tuloksia";
        }
        let last_weight = -1;
        let last_placement = -1;
        this.biggest_amounts_results = fish_results;
        this.biggest_amounts_results.forEach((result) => {
          if (last_weight === result.weight) {
            result.placement = last_placement;
          } else {
            result.placement = last_placement = placement;
            last_weight = result.weight;
          }
          placement++;
        });
      }
    },
  },
};
</script>
<style scoped></style>
