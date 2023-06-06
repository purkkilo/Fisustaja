<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-row>
      <v-col v-if="prevRoute">
        <v-btn
          v-if="prevRoute.name"
          large
          rounded
          color="yellow"
          @click="$router.push({ path: prevRoute.path })"
          ><v-icon>mdi-keyboard-return</v-icon>Palaa takaisin</v-btn
        >
      </v-col>
    </v-row>
    <v-row style="margin: 20px">
      <v-col>
        <v-btn
          v-if="competition"
          rounded
          color="yellow"
          @click="$router.push({ path: '/overview' })"
        >
          <v-icon>mdi-keyboard-return</v-icon>Takaisin kilpailuun
        </v-btn>
      </v-col>
    </v-row>

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
        <v-dialog v-model="dialog" width="500">
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
              <v-btn color="yellow" text @click="dialog = false">
                Peruuta
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="saveAsPDF(`Ilmoittautuneet`)">
                Lataa
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row justify="center" align="center">
          <v-col v-if="!loading && cup">
            <h1>{{ cup.name }}, {{ cup.year }}</h1>
          </v-col>
          <v-col v-else><h1>Ladataan...</h1></v-col>
        </v-row>
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
          <v-tab href="#overview">Yleisnäkymä</v-tab>
          <v-tab href="#points" :disabled="!competitions.length"
            >Pistetilanne</v-tab
          >
          <v-tab href="#stats" :disabled="!competitions.length"
            >Tilastoja</v-tab
          >
        </v-tabs>
        <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
          <v-tab-item :value="'overview'">
            <v-row v-if="loading">
              <v-col>
                <h2 class="white--text">Valmistellaan Cuppia...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!cup">
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei cuppia valittuna
                </p>
              </v-col>
            </v-row>
            <v-row v-if="!loading && cup" style="margin-top: 50px">
              <v-col md="4" offset-md="4">
                <v-select
                  dark
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                  label="Valitse näytettävät tiedot"
                  outlined
                  :items="select_table"
                  @input="selectTableData"
                  v-model="selected"
                />
              </v-col>
            </v-row>
            <v-row v-if="!loading && cup">
              <v-col md="10" offset-md="1">
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'white--text': $store.getters.getTheme,
                      }"
                    >
                      {{ selected }}
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-icon="mdi-magnify"
                      label="Hae taulukosta"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="selected_headers"
                    :items="selected_items"
                    :search="search_comp"
                    :loading="loading || updating"
                  >
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary darken-2">{{
                        item.start_date.format("DD.MM.YYYY")
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.isFinished`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip
                            v-bind="attrs"
                            v-on="on"
                            :color="
                              item.isFinished
                                ? 'green lighten-2'
                                : 'red lighten-2'
                            "
                            @click="endCompetition(item)"
                            :outlined="$store.getters.getTheme"
                            :disabled="updating"
                            >{{ item.isFinished ? "Kyllä" : "Ei" }}</v-chip
                          >
                        </template>
                        <span>Muuta tila painamalla</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.isPublic`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-chip
                            v-bind="attrs"
                            v-on="on"
                            :outlined="$store.getters.getTheme"
                            :color="
                              item.isPublic ? 'green darken-2' : 'red darken-2'
                            "
                            @click="publishCompetition(item)"
                            :disabled="updating"
                            >{{
                              item.isPublic ? "Julkinen" : "Salainen"
                            }}</v-chip
                          >
                        </template>
                        <span>Muuta tila painamalla</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.cup_points_multiplier`]="{ item }">
                      <v-chip
                        :color="getMultiplierColor(item.cup_points_multiplier)"
                        :outlined="$store.getters.getTheme"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            color="primary"
                            v-bind="attrs"
                            v-on="on"
                            :disabled="updating"
                            @click="pickCompetition(item)"
                            ><v-icon color="black"
                              >mdi-arrow-right-bold-box-outline</v-icon
                            ></v-btn
                          >
                        </template>
                        <span>Siirry kilpailuun</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.modify`]="{ item }">
                      <v-btn
                        color="yellow darken-2"
                        :dark="$store.getters.getTheme"
                        :disabled="loading || publishing"
                        @click.stop="
                          new_captain_name = item.captain_name;
                          new_temp_captain_name = item.temp_captain_name;
                          new_locality = item.locality;
                          $set(dialog_signee, item.boat_number, true);
                        "
                        ><v-icon color="black">mdi-account-edit</v-icon></v-btn
                      >
                      <v-dialog
                        v-model="dialog_signee[item.boat_number]"
                        persistent
                        max-width="600px"
                        :key="item.boat_number"
                      >
                        <v-card :dark="$store.getters.getTheme">
                          <v-card-title>
                            <span class="headline"
                              >Muokkaa käyttäjän (Nro {{ item.boat_number }})
                              Cup tietoja</span
                            >
                          </v-card-title>
                          <v-card-text>
                            <v-container style="width: 70%">
                              <div v-if="errors.length">
                                <ul
                                  class="collection with-header"
                                  style="border: 1px solid red"
                                >
                                  <li
                                    class="collection-header"
                                    style="background: rgba(0, 0, 0, 0)"
                                  >
                                    <v-alert type="error">
                                      Korjaa seuraavat virheet:
                                    </v-alert>
                                  </li>
                                  <li
                                    class="collection-item"
                                    id="error"
                                    v-for="(error, index) in errors"
                                    v-bind:key="index"
                                  >
                                    <p class="flow-text black--text">
                                      {{ index + 1 }}. {{ error }}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <v-row>
                                <v-col cols="12" sm="6" md="10">
                                  <v-text-field
                                    v-model="new_captain_name"
                                    :loading="publishing"
                                    label="Kippari*"
                                    maxlength="40"
                                    counter="40"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="10">
                                  <v-text-field
                                    v-model="new_temp_captain_name"
                                    :loading="publishing"
                                    label="Varakippari"
                                    maxlength="40"
                                    counter="40"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="6" md="10">
                                  <v-text-field
                                    v-model="new_locality"
                                    :loading="publishing"
                                    label="Paikkakunta*"
                                    maxlength="40"
                                    counter="40"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <small>*Pakolliset kentät</small>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn
                              color="yellow darken-2"
                              outlined
                              :loading="publishing"
                              @click.stop="
                                modifySignee(
                                  item,
                                  new_captain_name,
                                  new_temp_captain_name,
                                  new_locality,
                                  false
                                )
                              "
                              >Peruuta</v-btn
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                              color="green darken-2"
                              outlined
                              :loading="publishing"
                              @click.stop="
                                modifySignee(
                                  item,
                                  new_captain_name,
                                  new_temp_captain_name,
                                  new_locality,
                                  true
                                )
                              "
                              >Tallenna</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-btn
                        color="red darken-2"
                        :dark="$store.getters.getTheme"
                        :disabled="loading || publishing"
                        @click.stop="deleteSignee(item)"
                        ><v-icon color="black">mdi-delete</v-icon></v-btn
                      >
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-if="!loading && cup && selected == 'Ilmoittautuneet'">
              <v-col>
                <v-btn
                  @click="createSigneeDialog = true"
                  large
                  outlined
                  dark
                  :loading="publishing || loading"
                  ><v-icon color="green">mdi-plus</v-icon> Lisää
                  ilmoittautunut</v-btn
                >
                <v-dialog v-model="createSigneeDialog" width="500">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title> Lisää ilmoittautunut </v-card-title>
                    <v-card-text>
                      <h3 v-if="signeeError" class="red--text">
                        {{ signeeError }}
                      </h3>
                      <v-text-field
                        label="Kilpailunumero"
                        v-model="signeeNumber"
                        append-outer-icon="add"
                        maxlength="6"
                        @click:append-outer="
                          signeeNumber > 0 ? signeeNumber++ : (signeeNumber = 1)
                        "
                        prepend-icon="remove"
                        @click:prepend="
                          signeeNumber > 1 ? signeeNumber-- : (signeeNumber = 1)
                        "
                        @paste.prevent
                        :counter="6"
                        @keypress="isNumber($event, true)"
                        :rules="number_rules"
                      ></v-text-field>
                      <v-text-field
                        label="Kippari"
                        v-model="signeeCaptain"
                      ></v-text-field>
                      <v-text-field
                        label="Varakippari"
                        v-model="signeeTempCaptain"
                      ></v-text-field>
                      <v-text-field
                        label="Seura/Paikkakunta"
                        v-model="signeeLocality"
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-btn
                        color="yellow"
                        text
                        @click="createSigneeDialog = false"
                      >
                        Peruuta
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="addSignee">
                        Lisää
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
            <v-row
              v-if="!loading && cup"
              style="margin-top: 10px; margin-bottom: 10px"
            >
              <v-col>
                <v-btn
                  tile
                  color="blue lighten-1"
                  :loading="publishing || loading"
                  @click="changePage('/register-comp')"
                  ><v-icon>mdi-plus-circle</v-icon>Luo uusi kilpailu!</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  @click="dialog = true"
                  large
                  outlined
                  dark
                  :loading="publishing || loading"
                  :disabled="!cup.signees.length"
                  ><v-icon color="red">>mdi-file-pdf-box</v-icon> Lataa lista
                  kilpailijoista</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  large
                  tile
                  :color="cup.isPublic ? 'grey darken-4' : 'green darken-4'"
                  @click="publishCup(cup.isPublic)"
                  class="white--text"
                  :loading="publishing || loading"
                >
                  <div v-if="cup.isPublic">
                    <v-icon>mdi-incognito</v-icon> Aseta cup salaiseksi
                  </div>
                  <div v-else>
                    <v-icon color="green">mdi-publish</v-icon> Aseta cup
                    julkiseksi
                  </div>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="error">
              <v-col>
                <h2 class="error white--text">
                  {{ error }}
                </h2>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item :value="'points'">
            <cup-points
              :competitions="competitions"
              :allCompetitions="allCompetitions"
              :results="results"
              :isResults="isResults"
              :loading="loading"
              :selectNumbers="selectNumbers"
              :headers="headers"
              :cup="cup"
              @change="(selection) => changeHeaders(selection)"
              @refresh="(cup) => refreshCup(cup._id)"
              @calculate="
                (selectedCompetitions) =>
                  calculateAll(competitions, selectedCompetitions)
              "
              @save="
                (options) => {
                  selectedCompetitions = options.selectedCompetitions;
                  isLandscape = options.isLandscape;
                  showInfoInPdf = options.showInfoInPdf;
                  saveAsPDF(`Tulokset`);
                }
              "
              @sort="
                (show) => {
                  showUnfinishedCompetitions = show;
                  sortUnfinished();
                }
              "
            ></cup-points>
          </v-tab-item>
          <v-tab-item :value="'stats'">
            <cup-stats
              :competitions="competitions"
              :cup="cup"
              :loading="loading"
            ></cup-stats>
          </v-tab-item>
        </v-tabs-items>
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
import CupService from "../CupService";
import CompetitionService from "../CompetitionService";
import "jspdf-autotable";
import shared from "../shared";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import jsPDF from "jspdf";
export default {
  name: "CupOverview",
  components: {
    ProgressBarQuery: () => import("../components/layout/ProgressBarQuery"),
    CupPoints,
    CupStats,
  },
  data() {
    return {
      prevRoute: null,
      dialog: false,
      createSigneeDialog: false,
      signeeError: "",
      signeeNumber: 1,
      number_rules: [
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      signeeCaptain: "",
      signeeTempCaptain: "",
      signeeLocality: "",
      isLandscape: false,
      dialog_clock: false,
      dialog_signee: {},
      cup: null,
      allCompetitions: [],
      competitions: [],
      signees: [],
      headers: [],
      select_table: ["Kilpailut", "Ilmoittautuneet"],
      selected: "Kilpailut",
      selected_headers: [],
      selected_items: [],
      cup_fishes_competition: [],
      cup_fishes_total: [],
      cup_signees: [],
      cup_biggest_fishes: [],
      cup_biggest_amounts: [],
      total_fishes_chart_data: null,
      competition_fishes_chart_data: null,
      cup_signees_chart_data: null,
      cup_biggest_fishes_chart_data: null,
      cup_biggest_amounts_chart_data: null,
      headers_comp: [
        { text: "Kilpailun Päivämäärä", value: "start_date" },
        { text: "Nimi", value: "name" },
        { text: "Päättynyt", value: "isFinished" },
        { text: "Julkisuus", value: "isPublic" },
        { text: "Pistekerroin", value: "cup_points_multiplier" },
        { text: "Valitse", value: "choose", sortable: false },
      ],
      headers_signees: [
        { text: "Kilp. numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Seura/Paikkakunta", value: "locality" },
        { text: "Muokkaa", value: "modify", sortable: false },
        { text: "Poista", value: "delete", sortable: false },
      ],

      results: [],
      loading: false,
      publishing: false,
      updating: false,
      selectNumbers: [],
      tab: null,
      search_comp: "",
      competition: null,
      error: null,
      errors: [],
      new_locality: null,
      new_captain_name: null,
      new_temp_captain_name: null,
      isSimpleMode: true,
      snackbar: false,
      text: "",
      timeout: 5000,
      isResults: false,
      showInfoInPdf: false,
      showUnfinishedCompetitions: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  created() {},
  mounted() {
    this.competition = localStorage.getItem("competition");
    // IF competition on localstorage
    if (localStorage.getItem("cup") != null) {
      // update from database
      this.refreshCup(localStorage.getItem("cup"));
      this.$store.state.cup = this.cup;
    } else {
      console.log("No cup in localstorage!");
    }

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    sortUnfinished() {
      this.setCompetitionData(this.cup);
    },
    async publishCup(isPublic) {
      this.cup.isPublic = !isPublic;

      try {
        //TODO update only this one variable (competition.normal_points) to database, not the whole competition
        this.$store.state.cup = this.cup;
        this.publishing = true;
        const newValues = {
          $set: { isPublic: this.cup.isPublic },
        };
        await CupService.updateValues(this.cup._id, newValues);
      } catch (err) {
        console.error(err.message);
      }
      this.publishing = false;
    },
    async publishCompetition(competition) {
      competition.isPublic = !competition.isPublic;
      const newvalues = {
        $set: { isPublic: competition.isPublic },
      };
      this.updateToDatabase(competition, newvalues);
    },
    async endCompetition(competition) {
      competition.isFinished = !competition.isFinished;
      competition.isFinished
        ? (competition.state = "Päättynyt")
        : (competition.state = "Kesken");
      const newvalues = {
        $set: { isFinished: competition.isFinished },
      };
      this.updateToDatabase(competition, newvalues);
    },
    async updateToDatabase(competition, newvalues) {
      try {
        this.updating = true;
        await CompetitionService.updateValues(competition._id, newvalues);
      } catch (err) {
        console.error(err.message);
      }
      this.updating = false;
    },
    changePage(path) {
      this.$router.push({
        path: path,
        query: { cup: localStorage.getItem("cup") },
      });
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        if (charCode == 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    },
    selectTableData() {
      if (this.selected === "Kilpailut") {
        this.selected_items = this.allCompetitions;
        this.selected_headers = this.headers_comp;
      } else {
        this.selected_items = this.signees;
        this.selected_headers = this.headers_signees;
      }
    },
    async deleteSignee(item) {
      let signeeIndex = this.signees.findIndex(
        (o) => o.boat_number === item.boat_number
      );
      this.signees.splice(signeeIndex, 1);
      await this.updateSignees(this.signees);
    },
    async addSignee() {
      if (this.signeeNumber < 1 || this.signeeNumber === null) {
        this.signeeError = "Numero puuttuu!";
      } else if (
        this.signeeCaptain.trim() === "" ||
        this.signeeCaptain === null
      ) {
        this.signeeError = "Kapteeni puuttuu!";
      } else {
        const numberInSignees = this.cup.signees.find(
          (s) => s.boat_number === this.signeeNumber
        );
        if (numberInSignees) {
          const largest = Math.max(...this.signees.map((o) => o.boat_number));
          this.signeeError =
            "Numero on jo käytössä! Suurin vapaa numero = " + (largest + 1);
        } else {
          this.signees.push({
            boat_number: this.signeeNumber,
            captain_name: this.signeeCaptain,
            dialog: false,
            locality: this.signeeLocality || "-",
            starting_place: "-",
            temp_captain_name: this.signeeTempCaptain || "-",
          });
          await this.updateSignees(this.signees).finally(() => {
            this.createSigneeDialog = false;
            this.signeeNumber = this.signeeNumber + 1;
            this.signeeCaptain =
              this.signeeTempCaptain =
              this.signeeLocality =
                "";
          });
        }
      }
    },
    async updateSignees(signees) {
      this.$store.state.cup = this.cup;
      this.publishing = true;
      const new_signees = [...signees];
      // No need to have this variable in database
      new_signees.forEach((signee) => {
        delete signee.dialog;
      });
      const newvalues = {
        $set: { signees: new_signees },
      };
      await CupService.updateValues(this.cup._id, newvalues)
        .then(() => {
          this.text = "Kilpailijoiden tiedot päivitetty!";
          this.snackbar = true;
        })
        .catch((err) => {
          this.text =
            "Virhe kilpailijan tietojen päivityksessä... Yritä uudelleen!";
          this.snackbar = true;
          console.log(err);
        });
      this.publishing = false;
    },
    // Function to modify signees' captain, temp_captain or locality
    async modifySignee(
      signee,
      new_captain_name,
      new_temp_captain_name,
      new_locality,
      modify
    ) {
      this.errors = [];
      // If user has pressed "Tallenna" button
      if (modify) {
        // First check that all the inputs are correctly filled
        if (!new_captain_name) {
          this.errors.push("Kipparin nimi puuttuu!");
        } else {
          signee.captain_name = shared.capitalize_words(signee.captain_name);
        }

        if (!new_temp_captain_name) {
          new_temp_captain_name = signee.temp_captain_name = "-";
        } else {
          signee.temp_captain_name = shared.capitalize_words(
            signee.temp_captain_name
          );
        }
        if (!new_locality) {
          this.errors.push("Seura/Paikkakunta puuttuu!");
        } else {
          signee.locality = shared.capitalize_words(signee.locality);
        }
        // No errors left
        if (!this.errors.length) {
          // Check if anything has been modified, if there is something modified -> update to database
          if (
            signee.captain_name !== new_captain_name ||
            signee.temp_captain_name !== new_temp_captain_name ||
            signee.locality !== new_locality
          ) {
            signee.captain_name = new_captain_name;
            signee.temp_captain_name = new_temp_captain_name;
            signee.locality = new_locality;
            await this.updateSignees(this.signees).finally(() => {
              // Update names to "points" table
              this.calculateAll(this.competitions, this.selectedCompetitions);
              this.$set(this.dialog_signee, signee.boat_number, false);
            });
          } else {
            // Nothing modified -> do nothing
            this.text =
              "Kaikki tiedot ovat samoja kuin aikaisemmin, poistutaan...";
            this.snackbar = true;
            this.$set(this.dialog_signee, signee.boat_number, false);
          }
        }
      }
      // If user has pressed "Peruuta" button
      else {
        // Do nothing
        this.$set(this.dialog_signee, signee.boat_number, false);
      }
    },
    setCompetitionData(cup) {
      this.selectNumbers = [];
      // Convert dates to moment objects
      this.allCompetitions.forEach((competition, i) => {
        competition.start_date = this.$moment(competition.start_date);
        competition.end_date = this.$moment(competition.end_date);
        // Index for competition
        competition.key_name = i + 1;
      });
      this.allCompetitions.sort((a, b) => {
        return b.start_date.isBefore(a.start_date);
      });
      this.signees = this.cup.signees.sort(shared.sortBy("boat_number", true));
      this.signees.forEach((signee) => {
        signee.dialog = false;
      });

      this.competitions = [...this.allCompetitions];
      if (!this.showUnfinishedCompetitions) {
        this.competitions = this.competitions.filter((comp) => comp.isFinished);
      }

      this.competitions.forEach((_, i) => {
        this.selectNumbers.push(i + 1);
      });

      if (cup.meaningful_competitions > 0)
        this.selectedCompetitions = cup.meaningful_competitions;
      else this.selectedCompetitions = this.competitions.length;

      this.calculateAll(this.competitions, this.selectedCompetitions);
    },
    async refreshCup(cup_id) {
      this.loading = true;
      try {
        //Get competition from database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
        let cup = await CupService.getCups({
          _id: cup_id,
        });
        // IF competition found from database
        if (cup) {
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.cup = cup;
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCup", this.cup);
          try {
            this.allCompetitions = await CompetitionService.getCompetitions({
              cup_id: cup_id,
            });
            this.setCompetitionData(this.cup);
            this.selectTableData();
            this.text = "Tiedot ajantasalla!";
            this.snackbar = true;
          } catch (error) {
            console.error(error);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },
    pickCompetition: function (competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    calculateAll(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      competitions.forEach((competition) => {
        // Dynamic headers, because competition names change
        //If there are any results in the competition
        if (competition.normal_points.length) {
          //Loop through each competition's results
          competition.normal_points.forEach((signee) => {
            // Get each signee's results from array that has all the results
            let index = all_results.findIndex((item) => {
              return (
                parseInt(signee.boat_number) === parseInt(item.boat_number)
              );
            });

            //If the signee is found there
            if (index > -1) {
              // Get the signee, and add competitions results to array, under the competition.name key
              let found_signee = all_results[index];
              found_signee.cup_results[competition.key_name] = {
                competition: competition._id,
                key_name: competition.key_name,
                points: signee.cup_points_total,
                placement: signee.placement,
              };
              // For tracking total points
              all_results.splice(index, 1, found_signee);
            }
            // Not any points on cup_results yet
            else {
              // Get the data that is stored in the cup's signees array
              let cup_signee = this.signees.find(
                (element) => element.boat_number === signee.boat_number
              );
              if (cup_signee) {
                // Add original names from the first instance
                signee.captain_name = cup_signee.captain_name;
                signee.temp_captain_name = cup_signee.temp_captain_name;
                signee.locality = cup_signee.locality;
              } else {
                // TODO: Figure out a better way to notify
                console.log(
                  `(${signee.boat_number}) - ${signee.captain_name} ei löytynyt cupin ilmoittautumislistalta`
                );
                alert(
                  `(${signee.boat_number}) - ${signee.captain_name} ei löytynyt cupin ilmoittautumislistalta`
                );
              }
              // Initialize variables and add first points
              signee.cup_results = [];
              // Array for comparing points with limit
              signee.cup_results[competition.key_name] = {
                competition: competition._id,
                key_name: competition.key_name,
                points: signee.cup_points_total,
                placement: signee.placement,
              };
              all_results.push(signee);
            }
          });
        }
      });
      if (all_results.length) {
        this.isResults = true;
        // limits the amount of competitions are taken into account in the cup
        all_results = this.limitCompetitions(all_results, limit);
        // Sort the array based on total cup points
        this.results = all_results.sort(function compare(a, b) {
          return (
            parseInt(b.cup_results["total"]) - parseInt(a.cup_results["total"])
          );
        });
        this.changeHeaders("Paikkakunta");

        let final_placement = 1;
        let last_points = -1;
        let last_placement = -1;
        this.results.forEach((signee) => {
          if (last_points === signee.cup_results["total"]) {
            signee.final_placement = last_placement;
          } else {
            signee.final_placement = final_placement;
            last_points = signee.cup_results["total"];
            last_placement = signee.final_placement;
          }
          signee.final_cup_points = signee.cup_results["total"];
          final_placement++;
        });
      }
    },
    changeHeaders(headerSelection) {
      this.headers = [];
      this.headers.push({
        text: "Sijoitus",
        highlight: false,
        align: "center",
        value: "final_placement",
        isFinished: true,
      });
      this.headers.push({
        text: "Kilp. Nro",
        align: "center",
        highlight: false,
        value: "boat_number",
        isFinished: true,
      });
      this.headers.push({
        text: "Kippari",
        align: "center",
        highlight: false,
        value: "captain_name",
        isFinished: true,
      });
      this.headers.push({
        text: "Paikkakunta",
        align: "center",
        highlight: false,
        value: "locality",
        isFinished: true,
      });
      this.notFinishedCount = 0;
      this.competitions.forEach((competition) => {
        // Keep track if there are unfinished competitions
        if (!competition.isFinished) {
          this.notFinishedCount++;
        }
        // Dynamic headers, because competition names change
        if (headerSelection === "Paikkakunta") {
          // Check if there are competitions with same locality, if so, add identifier
          let found_headers = this.headers.filter((header) => {
            return competition.locality === header.text;
          });
          if (found_headers.length) {
            let new_header_text = ` ${competition.locality} #${
              found_headers.length + 1
            }`;
            this.headers.push({
              text: new_header_text,
              align: "center",
              highlight: true,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          } else {
            this.headers.push({
              text: competition.locality,
              align: "center",
              highlight: true,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          }
        } else {
          this.headers.push({
            text: competition.name,
            align: "center",
            highlight: true,
            isFinished: competition.isFinished,
            value: `cup_results[${competition.key_name}].points`,
          });
        }
      });
      this.headers.push({
        text: "Yhteensä",
        align: "center",
        highlight: false,
        value: "final_cup_points",
        isFinished: true,
      });
    },
    limitCompetitions(results, limit) {
      results.forEach((signee) => {
        // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
        if (this.competitions.length >= limit) {
          // Initialize total points to 0
          signee.cup_results["total"] = 0;
          // sort the array that points are compared to
          let temp = [...signee.cup_results];
          temp.sort(function compare(a, b) {
            return parseInt(b.points) - parseInt(a.points);
          });

          // Add all the limited points to total points
          temp.forEach((element, index) => {
            if (element) {
              if (index + 1 <= limit) {
                signee.cup_results["total"] += element.points;
              } else {
                const comp = this.competitions.find(
                  (c) => element.competition === c._id
                );
                signee.cup_results[element.key_name].points =
                  comp.cup_participation_points;
                signee.cup_results["total"] += comp.cup_participation_points;
              }
            }
          });
        }
      });

      // Return sorted results
      return results;
    },

    // Convert the charts and the tables to pdf
    saveAsPDF(table_title) {
      // Format dates for easier reding
      // PDF creation
      let doc = new jsPDF({
        orientation: this.isLandscape ? "landscape" : "portrait",
      });

      // Title
      const title = `${this.cup.name} (${this.cup.year})`;
      let sub_title;
      let columns = [];
      let rows;
      let startY;
      // Find last competition from the array which has finished
      let temp_array = [...this.competitions];
      var index = temp_array
        .slice()
        .reverse()
        .findIndex((competition) => competition.isFinished === true);
      var count = temp_array.length - 1;
      var finalIndex = index >= 0 ? count - index : index;
      const last_competition = temp_array[finalIndex]
        ? temp_array[finalIndex]
        : null;
      let last_competition_string = "";
      let start_date = this.$moment();
      if (last_competition) {
        last_competition_string = `${last_competition.name} (${last_competition.locality})`;
        start_date = this.$moment(last_competition.start_date);
      }
      const formatted_date = `${start_date.date()}.${
        start_date.month() + 1
      }.${start_date.year()}`;
      doc.setFontSize(24);
      doc.text(13, 15, title, { align: "left" });
      doc.line(0, 20, 400, 20);
      doc.setFontSize(14);
      // Table, based on given table_id, and table title based on competition_type
      let finished_competitions = 0;
      let unfinished_competitions = 0;
      this.competitions.forEach((competition) => {
        competition.isFinished
          ? finished_competitions++
          : unfinished_competitions++;
      });
      if (table_title === "Tulokset") {
        if (unfinished_competitions === 0 || !this.showUnfinishedCompetitions) {
          sub_title = `Tulokset ${formatted_date}`;
        } else {
          sub_title = `Tilanne ${formatted_date}, ${last_competition_string}  (${unfinished_competitions} kpl kilpailuja kesken)`;
        }
        doc.text(13, 30, sub_title, { align: "left" });
        if (this.showInfoInPdf) {
          doc.text(
            13,
            40,
            table_title +
              ` (${this.selectedCompetitions}/${this.competitions.length} parasta kilpailua otettu huomioon)`,
            { align: "left" }
          );
        }

        this.headers.forEach((header) => {
          columns.push(header.text);
        });
        rows = shared.cupDictToArray(
          this.results,
          this.competitions,
          "cup_total_points"
        );
        startY = 45;
      } else {
        if (unfinished_competitions === 0) {
          sub_title = `Cuppiin ilmoittautuneet ${this.cup.year}`;
        } else {
          sub_title = `Cupin kilpailijat ${formatted_date} ${last_competition_string}`;
        }
        doc.text(13, 30, sub_title, { align: "left" });
        doc.setFontSize(8);

        columns = ["Kilp. numero", "Kippari", "Varakippari", "Paikkakunta"];
        this.signees = this.cup.signees.sort(
          shared.sortBy("boat_number", true)
        );
        rows = shared.cupDictToArray(
          this.signees,
          this.competitions,
          "signees"
        );
        /* eslint-disable no-unused-vars */
        // Just add some empty rows for new signees
        if (rows.length) {
          let last_number = Number(rows[rows.length - 1][0]) + 1;
          for (let i of shared.range(last_number, last_number + 10)) {
            rows.push([i, "", "", ""]);
          }
        } else {
          // If no signees, just add 20 empty rows
          for (let i of shared.range(1, 20)) {
            rows.push([i, "", "", ""]);
            doc.text(13, 35, "Cupissa ei vielä ilmoittautuneita", {
              align: "left",
            });
          }
        }
        /* eslint-enable no-unused-vars */
        startY = 37;
      }

      doc.autoTable({
        head: [columns],
        body: rows,
        styles: {
          overflow: "linebreak",
          halign: "justify",
          fontSize: "8",
          lineColor: 100,
          lineWidth: 0.25,
        },
        columnStyles: { text: { cellwidth: "auto" } },
        headStyles: { text: { cellwidth: "wrap" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        startY: startY,
        margin: { top: 20 },
      });
      const fileName = `${this.cup.year}_${shared.replaceAll(
        "Cup",
        " ",
        ""
      )}_${shared.replaceAll(
        shared.capitalize_words(table_title),
        " ",
        ""
      )}.pdf`;
      this.dialog = false;
      shared.openPdfOnNewTab(doc, fileName);
    },
    getMultiplierColor: shared.getMultiplierColor,
  },
};
</script>
