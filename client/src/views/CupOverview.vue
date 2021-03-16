<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header style="margin-bottom:60px" />
    <v-row class="valign-wrapper">
      <v-col md="3">
        <v-btn
          v-if="competition"
          rounded
          color="yellow"
          @click="$router.push({ path: '/overview' })"
        >
          <i class="material-icons left">history</i>Takaisin kilpailuun
        </v-btn>
      </v-col>
      <v-col md="6">
        <h1>Cupin Yleisnäkymä</h1>
      </v-col>
      <v-col md="3"> </v-col>
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
      <v-tab href="#stats" :disabled="!competitions.length">Tilastoja</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item
        :value="'overview'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row v-if="loading">
          <v-col>
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Valmistellaan Cuppia...
            </h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-if="cup">
            <h1
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              {{ cup.name }}, {{ cup.year }}
            </h1>
          </v-col>
          <v-col v-else>
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Ei kuppia valittuna
            </p>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length">
          <v-col md="4" offset-md="4">
            <v-select
              :dark="$store.getters.getTheme"
              :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
              label="Valitse näytettävät tiedot"
              outlined
              :items="select_table"
              @input="selectTableData"
              v-model="selected"
            />
          </v-col>
        </v-row>
        <v-row v-if="competitions.length">
          <v-col md="10" offset-md="1">
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Kilpailut
                </p>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search_comp"
                  append-icon="mdi-magnify"
                  label="Hae kilpailua"
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
                          item.isFinished ? 'green lighten-2' : 'red lighten-2'
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
                        >{{ item.isPublic ? "Julkinen" : "Salainen" }}</v-chip
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
                          >Muokkaa käyttäjän (Nro {{ item.boat_number }}) Cup
                          tietoja</span
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <div v-if="errors.length">
                            <ul
                              class="collection with-header"
                              style="border:1px solid red;"
                            >
                              <li
                                class="collection-header"
                                style="background: rgba(0,0,0,0);"
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
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competitions.length">
          <v-col style="margin-top:20px">
            <v-btn
              tile
              color="blue lighten-1"
              :loading="publishing"
              @click="changePage('/register-comp')"
              ><i class="material-icons left">add_circle_outline</i>Luo uusi
              kilpailu!</v-btn
            >
          </v-col>
          <v-col style="margin-top:20px">
            <v-btn
              @click="saveAsPDF(`Ilmoittautuneet`)"
              large
              outlined
              :dark="$store.getters.getTheme"
              :loading="publishing"
              ><v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa lista
              kilpailijoista</v-btn
            >
          </v-col>
          <v-col style="margin-top:20px">
            <v-btn
              large
              tile
              :color="cup.isPublic ? 'grey darken-4' : 'green darken-4'"
              @click="publishCup(cup.isPublic)"
              class="white--text"
              :loading="publishing"
            >
              <div v-if="cup.isPublic">
                <v-icon>mdi-incognito</v-icon> Aseta cup salaiseksi
              </div>
              <div v-else>
                <v-icon color="green">mdi-publish</v-icon> Aseta cup julkiseksi
              </div>
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-if="!loading && !competitions.length">
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Ei kilpailuja!
            </h2>
            <router-link to="/register-comp">
              <v-btn tile color="blue lighten-1"
                ><i class="material-icons left">add_circle_outline</i>Luo
                kilpailu!</v-btn
              >
            </router-link>
          </v-col>
          <v-col v-if="error">
            <h2
              class="error"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              {{ error }}
            </h2>
          </v-col>

          <v-col v-if="loading">
            <h2
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Ladataan kilpailuja...
            </h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'points'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col>
            <v-row v-if="results.length">
              <v-col>
                <h1
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Cupin kokonaispisteet
                </h1>
              </v-col>
            </v-row>
            <v-row
              v-if="results.length"
              v-bind:class="{
                inputarea: !$store.getters.getTheme,
                'inputarea-dark': $store.getters.getTheme,
              }"
              style="padding-top:25px;"
            >
              <v-col class="d-flex" md="4">
                <v-select
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                  :dark="$store.getters.getTheme"
                  :items="header_options"
                  label="Kilpailun otsikko"
                  outlined
                  v-model="header_selection"
                  @input="changeHeaders"
                ></v-select>
              </v-col>
              <v-col class="d-flex" md="4">
                <v-select
                  :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                  :dark="$store.getters.getTheme"
                  :items="select_numbers"
                  label="Cup sijoittumispisteisiin vaikuttavien kilpailujen määrä"
                  outlined
                  v-model="selected_competitions"
                  @input="calculateAll(competitions, selected_competitions)"
                ></v-select>
              </v-col>
              <v-col md="4">
                <v-btn
                  large
                  outlined
                  :dark="$store.getters.getTheme"
                  @click="saveAsPDF(`Tulokset`)"
                  :loading="loading"
                >
                  <v-icon color="red">mdi-file-pdf-outline</v-icon> Lataa pdf
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="results.length && not_finished_count > 0">
              <v-col>
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  *Punaisella merkityt kilpailut ovat vielä kesken! ({{
                    not_finished_count
                  }}
                  kpl)
                </p>
              </v-col>
            </v-row>
            <v-row v-if="isResults">
              <v-col>
                <v-card :dark="$store.getters.getTheme">
                  <v-card-title>
                    <p class="flow-text">Cupin kokonaispisteet</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Hae kilpailijaa"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="headers"
                    :items="results"
                    :search="search"
                    :loading="loading"
                  >
                    <template
                      v-for="(h, index) in headers"
                      v-slot:[`header.${h.value}`]="{ header }"
                    >
                      <span
                        v-if="header.highlight"
                        :key="index"
                        class="strokeme"
                        v-bind:class="{
                          'red-text': header.isFinished,
                          'green-text': !header.isFinished,
                        }"
                      >
                        {{ header.text }}
                      </span>
                      <span v-else :key="index">{{ header.text }}</span>
                    </template>
                    <template v-slot:[`item.final_placement`]="{ item }">
                      <v-chip
                        :outlined="$store.getters.getTheme"
                        :color="getColor(item.final_placement)"
                        >{{ item.final_placement }}.</v-chip
                      >
                    </template>
                    <template
                      v-for="(c, index) in competitions.length"
                      v-slot:[`item.cup_results[${c}].points`]="{ item }"
                    >
                      <div v-if="item.cup_results[c]" v-bind:key="c">
                        <span
                          class="strokeme"
                          v-if="
                            item.cup_results[c].points ===
                              competitions[index].cup_participation_points
                          "
                          >{{ item.cup_results[c].points }}p ({{
                            item.cup_results[c].placement
                          }}.)</span
                        >
                        <span
                          class="strokeme"
                          v-else
                          :class="
                            `font-weight-bold text-outline  ${getColor(
                              item.cup_results[c].placement
                            )}-text`
                          "
                          >{{ item.cup_results[c].points }}p ({{
                            item.cup_results[c].placement
                          }}.)</span
                        >
                      </div>
                      <span v-else v-bind:key="c">
                        -
                      </span>
                    </template>
                    <template v-slot:[`item.final_cup_points`]="{ item }">
                      <span class="indigo-text"
                        >{{ item.final_cup_points }}p</span
                      >
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Kilpailuissa ei vielä tuloksia!
                </h2>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length && cup">
              <v-col v-if="loading">
                <p
                  class="flow-text"
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Päivitetään tuloksia...
                </p>
              </v-col>
            </v-row>
            <v-row v-if="competitions.length && cup">
              <v-col>
                <v-btn
                  id="updatebtn"
                  large
                  tile
                  :loading="loading"
                  :disabled="!isResults"
                  color="blue darken-4"
                  @click="refreshCup(cup.id)"
                  class="white--text"
                >
                  <i class="material-icons left">update</i>Päivitä cupin
                  tulokset
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <h2
                  v-bind:class="{
                    'white--text': $store.getters.getTheme,
                  }"
                >
                  Ei kilpailuja rekisteröitynä!
                </h2>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'stats'"
        v-bind:class="{
          'container-transparent': !$store.getters.getTheme,
          'container-transparent-dark': $store.getters.getTheme,
        }"
      >
        <v-row>
          <v-col><h1>Tilastoja (Coming soon...)</h1></v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2>Contenttia</h2>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import CupService from "../CupService";
import CompetitionService from "../CompetitionService";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "CupOverview",
  components: {
    ProgressBarQuery: () => import("../components/layout/ProgressBarQuery"),
    Header: () => import("../components/layout/Header"),
  },
  data() {
    return {
      dialog_clock: false,
      dialog_signee: {},
      cup: null,
      competitions: [],
      signees: [],
      headers: [],
      select_table: ["Kilpailut", "Ilmoittautuneet"],
      selected: "Kilpailut",
      selected_headers: [],
      selected_items: [],
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
      ],

      results: [],
      isResults: false,
      loading: false,
      publishing: false,
      updating: false,
      select_numbers: [],
      header_options: ["Paikkakunta", "Kilpailun nimi"],
      header_selection: "Paikkakunta",
      selected_competitions: 0,
      tab: null,
      search: "",
      search_comp: "",
      not_finished_count: 0,
      competition: null,
      error: null,
      errors: [],
      new_locality: null,
      new_captain_name: null,
      new_temp_captain_name: null,
      isSimpleMode: true,
    };
  },
  created() {},
  mounted() {
    this.competition = localStorage.getItem("competition");
    //Check if user is logged in has admin status, update header
    this.checkLogin();
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
    async publishCup(isPublic) {
      this.cup.isPublic = !isPublic;

      try {
        //TODO update only this one variable (competition.normal_points) to database, not the whole competition
        this.$store.state.cup = this.cup;
        this.publishing = true;
        const newvalues = {
          $set: { isPublic: this.cup.isPublic },
        };
        await CupService.updateValues(this.cup.id, newvalues);
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
    changePage: function(path) {
      this.$router.push({
        path: path,
        query: { cup: localStorage.getItem("cup") },
      });
    },
    selectTableData: function() {
      if (this.selected === "Kilpailut") {
        this.selected_items = this.competitions;
        this.selected_headers = this.headers_comp;
      } else {
        this.selected_items = this.signees;
        this.selected_headers = this.headers_signees;
      }
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
          signee.captain_name = this.capitalize_words(signee.captain_name);
        }

        if (!new_temp_captain_name) {
          new_temp_captain_name = signee.temp_captain_name = "-";
        } else {
          signee.temp_captain_name = this.capitalize_words(
            signee.temp_captain_name
          );
        }
        if (!new_locality) {
          this.errors.push("Seura/Paikkakunta puuttuu!");
        } else {
          signee.locality = this.capitalize_words(signee.locality);
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
            this.$store.state.cup = this.cup;
            this.publishing = true;
            const new_signees = [...this.signees];
            // No need to have this variable in database
            new_signees.forEach((signee) => {
              delete signee.dialog;
            });
            const newvalues = {
              $set: { signees: this.signees },
            };
            await CupService.updateValues(this.cup.id, newvalues)
              .then(() => {
                // Update names to "points" table
                this.calculateAll(
                  this.competitions,
                  this.selected_competitions
                );
                this.$set(this.dialog_signee, signee.boat_number, false);
                M.toast({ html: "Kilpailijan tiedot päivitetty!" });
              })
              .catch((err) => {
                M.toast({
                  html:
                    "Virhe kilpailijan tietojen päivityksessä... Yritä uudelleen!",
                });
                console.log(err);
              });
            this.publishing = false;
          } else {
            // Nothing modified -> do nothing
            M.toast({
              html: "Kaikki tiedot ovat samoja kuin aikaisemmin, poistutaan...",
            });
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
    // Capitalize all the words in given string. Takes account all the characters like "-", "'" etc.
    capitalize_words: function(str) {
      return str.replace(
        /(?:^|\s|['`‘’.-])[^\x60^\x7B-\xDF](?!(\s|$))/g,
        function(txt) {
          return txt.toUpperCase();
        }
      );
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    calculateAll: function(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      this.limiting = true;
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
              found_signee.points_compare.push(signee.cup_points_total); // For comparing
              found_signee.cup_results[competition.key_name] = {
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
              signee.captain_name = cup_signee.captain_name;
              signee.temp_captain_name = cup_signee.temp_captain_name;
              signee.locality = cup_signee.locality;
              // Initialize variables and add first points
              signee.cup_results = [];
              // Array for comparing points with limit
              signee.points_compare = [];
              signee.points_compare.push(signee.cup_points_total); // For comparing
              signee.cup_results[competition.key_name] = {
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
            parseInt(b.cup_results["Total"]) - parseInt(a.cup_results["Total"])
          );
        });
        this.changeHeaders();

        let final_placement = 1;
        let last_points = -1;
        let last_placement = -1;
        this.results.forEach((signee) => {
          if (last_points === signee.cup_results["Total"]) {
            signee.final_placement = last_placement;
          } else {
            signee.final_placement = final_placement;
            last_points = signee.cup_results["Total"];
            last_placement = signee.final_placement;
          }
          signee.final_cup_points = signee.cup_results["Total"];
          final_placement++;
        });
        this.limiting = false;
      }
    },
    limitCompetitions: function(results, limit) {
      limit = limit < 0 ? 0 : limit; // Make sure limit is at least 1

      results.forEach((signee) => {
        // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
        if (this.competitions.length >= limit) {
          // sort the array that points are compared to
          // so first "limit" amount of competitions are only taken into account
          signee.points_compare.sort(function compare(a, b) {
            return parseInt(b) - parseInt(a);
          });
          // Initialize total points to 0
          signee.cup_results["Total"] = 0;
          let counter = 0; // counter for competitions that have same points as the limit
          // Check each competition
          this.competitions.forEach((competition) => {
            // If signee has points for this competition
            if (signee.cup_results[competition.key_name]) {
              // If signee's points are less than the limit points from the array
              // check which placement the points would have from array, and pair it with points, the signee.placement isn't accurate anymore if competitions are limited

              signee.cup_results[
                competition.key_name
              ].placement = competition.normal_points.find(
                (result) => result.boat_number === signee.boat_number
              ).placement;

              if (
                signee.cup_results[competition.key_name].points <
                signee.points_compare[limit]
              ) {
                // Give signee only participation points
                signee.cup_results[competition.key_name].points =
                  competition.cup_participation_points;
              }
              // If the competition points are same as the limit
              if (
                signee.cup_results[competition.key_name].points ===
                signee.points_compare[limit]
              ) {
                if (counter !== 1) {
                  // Points are greater than the limit points, give full points
                  signee.cup_results[competition.key_name].points =
                    competition.cup_participation_points;
                }
                counter++;
              }
            }
          });
        }

        // Add all the limited points to total points
        signee.cup_results.forEach((element) => {
          signee.cup_results["Total"] += element.points;
        });
      });
      // Return sorted results
      return results;
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
            this.competitions = await CompetitionService.getCompetitions({
              cup_id: cup_id,
            });
            // Convert dates to moment objects
            let counter = 1;
            this.competitions.forEach((competition) => {
              this.select_numbers.push(counter);
              competition.start_date = this.$moment(competition.start_date);
              competition.end_date = this.$moment(competition.end_date);
              // Index for competition
              competition.key_name = counter;
              counter++;
            });
            this.competitions.sort((a, b) => {
              return b.start_date.isBefore(a.start_date);
            });
            this.signees = this.cup.signees.sort(
              (a, b) => a.boat_number - b.boat_number
            );
            this.signees.forEach((signee) => {
              signee.dialog = false;
            });
            this.selected_competitions = this.competitions.length;
            this.calculateAll(this.competitions, this.selected_competitions);
            this.selectTableData();
            M.toast({ html: "Tiedot ajantasalla!" });
          } catch (error) {
            console.error(error);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        this.$store.state.isDark = user.preferences.isDark;
        this.$store.state.lang = user.preferences.lang;
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
    pickCompetition: function(competition) {
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
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getMultiplierColor(multiplier) {
      if (multiplier > 1) return "red";
      if (multiplier === 1) return "green";
      else return "grey";
    },
    replaceAllChars: function(text, obj) {
      return [...text]
        .map((each) => {
          for (const o in obj) {
            each == o ? (each = obj[o]) : o;
          }
          return each;
        })
        .join("");
    },
    changeHeaders: function() {
      this.headers = [];
      this.headers.push({
        text: "Sijoitus",
        highlight: false,
        align: "center",
        value: "final_placement",
      });
      this.headers.push({
        text: "Kilp. Nro",
        align: "center",
        highlight: false,
        value: "boat_number",
      });
      this.headers.push({
        text: "Kippari",
        align: "center",
        highlight: false,
        value: "captain_name",
      });
      this.headers.push({
        text: "Paikkakunta",
        align: "center",
        highlight: false,
        value: "locality",
      });
      this.not_finished_count = 0;
      this.competitions.forEach((competition) => {
        // Keep track if there are unfinished competitions
        if (!competition.isFinished) {
          this.not_finished_count++;
        }
        // Dynamic headers, because competition names change
        if (this.header_selection === "Paikkakunta") {
          // Check if there are competitions with same locality, if so, add identifier
          let found_headers = this.headers.filter((header) => {
            return competition.locality === header.text;
          });
          if (found_headers.length) {
            let new_header_text = ` ${
              competition.locality
            } #${found_headers.length + 1}`;
            this.headers.push({
              text: new_header_text,
              align: "center",
              highlight: true,
              isFinished: !competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          } else {
            this.headers.push({
              text: competition.locality,
              align: "center",
              highlight: true,
              isFinished: !competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          }
        } else {
          this.headers.push({
            text: competition.name,
            align: "center",
            highlight: true,
            isFinished: !competition.isFinished,
            value: `cup_results[${competition.key_name}].points`,
          });
        }
      });
      this.headers.push({
        text: "Yhteensä",
        align: "center",
        highlight: false,
        value: "final_cup_points",
      });
    },
    // For naming the pdf, replace certain characters
    replaceAll: function(string, search, replace) {
      return string.split(search).join(replace);
    },
    dictToArray: function(dict, type) {
      const temp_arr = Object.entries(dict);
      const arr = [];
      let boat_number = 1;
      let missing_numbers = false;
      temp_arr.forEach((element) => {
        let values = Object.values(element[1]);
        if (type === 1) {
          values[0] = String(values[11]) + ".";
          let cup_results = values[9];
          values[1] = "(" + String(values[1]) + ")";
          values[3] = values[4];
          let counter = 4;
          this.competitions.forEach((competition) => {
            if (cup_results[competition.key_name]) {
              values[counter] = `${
                cup_results[competition.key_name].points
              }p (${cup_results[competition.key_name].placement}.)`;
            } else {
              values[counter] = "-";
            }
            counter++;
          });
          values[counter] = `${cup_results["Total"]}p`;
        }
        if (type === 2) {
          if (values[0] > boat_number) {
            // values[0] is bigger than the next boat_number should be, so there is a gap
            missing_numbers = true;
            for (let i of range(boat_number, values[0])) {
              // When the i reaches the value boat_number should be, add the next real row
              if (i === values[0]) {
                values[0] = String(values[0]);
                missing_numbers = false;
                // Else just push empty rows until then
              } else {
                boat_number++;
                arr.push([String(i) + "*", "", "", ""]);
              }
            }
          } else {
            values[0] = String(values[0]);
          }
        }

        // If there are gaps in boat_numbers --> 1, 2, 4, 5, 7, etc.
        if (!missing_numbers) {
          boat_number++;
          arr.push(values);
        }
      });
      return arr;
    },
    // Convert the charts and the tables to pdf
    saveAsPDF: function(table_title) {
      // Format dates for easier reding
      // PDF creation
      let doc;
      if (this.competitions.length > 4 && table_title === "Tulokset") {
        doc = new jsPDF("landscape");
      } else {
        doc = new jsPDF();
      }

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
      const formatted_date = `${start_date.date()}.${start_date.month() +
        1}.${start_date.year()}`;
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
        if (unfinished_competitions === 0) {
          sub_title = `Tulokset ${formatted_date}`;
        } else {
          sub_title = `Tilanne ${formatted_date}, ${last_competition_string}  (${unfinished_competitions} kpl kilpailuja kesken)`;
        }
        doc.text(13, 30, sub_title, { align: "left" });
        doc.text(
          13,
          40,
          table_title +
            ` (${this.selected_competitions}/${this.competitions.length} parasta kilpailua otettu huomioon)`,
          { align: "left" }
        );
        this.headers.forEach((header) => {
          columns.push(header.text);
        });
        rows = this.dictToArray(this.results, 1);
        startY = 45;
      } else {
        if (unfinished_competitions === 0) {
          sub_title = `Cuppiin ilmoittautuneet ${this.cup.year}`;
        } else {
          sub_title = `Cupin kilpailijat ${formatted_date} ${last_competition_string}`;
        }
        doc.text(13, 30, sub_title, { align: "left" });
        doc.setFontSize(8);
        /*
        doc.text(
          100,
          30,
          "*Tyhjät rivit = numerolla ei vielä cupissa käytyjä kilpailuja",
          { align: "center" }
        );
        */
        columns = ["Kilp. numero", "Kippari", "Varakippari", "Paikkakunta"];
        this.signees = this.cup.signees.sort(
          (a, b) => a.boat_number - b.boat_number
        );
        rows = this.dictToArray(this.signees, 2);
        /* eslint-disable no-unused-vars */
        // Just add some empty rows for new signees
        let last_number = Number(rows[rows.length - 1][0]) + 1;
        for (let i of range(last_number, last_number + 6)) {
          rows.push([" ", "", "", ""]);
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
          lineColor: "100",
          lineWidth: ".25",
        },
        columnStyles: { text: { cellwidth: "auto" } },
        headStyles: { text: { cellwidth: "wrap" } },
        theme: "striped",
        pageBreak: "auto",
        tableWidth: "auto",
        startY: startY,
        margin: { top: 20 },
      });

      // Save the pdf

      doc.save(
        `${this.cup.year}_${this.replaceAll("Cup", " ", "")}_${this.replaceAll(
          this.capitalize_words(table_title),
          " ",
          ""
        )}.pdf`
      );
    },
  },
};

function* range(start, end) {
  yield start;
  if (start === end) return;
  yield* range(start + 1, end);
}
</script>
