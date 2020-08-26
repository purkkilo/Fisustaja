<template>
  <!-- /weighting -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate style="margin-top:0" />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Punnitus</h1></div>
      </div>
      <!-- Navigation to other competition pages -->

      <v-row>
        <v-col order="first" style="margin-top:20px">
          <router-link to="/signing">
            <v-btn large rounded color="blue" class="white--text"
              ><i class="material-icons left">edit</i>Ilmoittautuminen</v-btn
            >
          </router-link>
        </v-col>
        <v-col style="margin-top:20px">
          <router-link to="/overview">
            <v-btn large rounded color="primary"
              ><i class="material-icons left">info</i>Kilpailun
              yleisnäkymä</v-btn
            >
          </router-link>
        </v-col>
        <v-col order="last" style="margin-top:20px">
          <router-link to="/results">
            <v-btn large rounded color="green" class="white--text"
              ><i class="material-icons left">emoji_events</i>Tulokset</v-btn
            >
          </router-link>
        </v-col>
      </v-row>

      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="basil"
        grow
        show-arrows
      >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#weighting">Punnitus</v-tab>
        <v-tab href="#situation">Tilannekatsaus</v-tab>
        <v-tab href="#onwater">Vielä vesillä</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
        <!-- "Punnitus" tab -->
        <v-tab-item class="inputarea" :value="'weighting'">
          <v-row v-if="!loading_site">
            <v-col>
              <v-row v-if="signees.length">
                <v-col>
                  <v-row>
                    <v-col>
                      <p class="flow-text center">Punnitus</p>
                    </v-col>
                  </v-row>
                  <v-row v-if="notification">
                    <v-col>
                      <v-alert type="success">
                        {{ notification }}
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="!loading">
                    <v-col
                      class="input-fields"
                      md="6"
                      offset-md="3"
                      style="padding:20px;"
                    >
                      <v-col md="6">
                        <p class="flow-text">Venekunnan numero</p>
                      </v-col>
                      <v-col class="d-flex" md="6">
                        <vue-select
                          class="flow-text input-fields"
                          label="boat_number"
                          placeholder="Valitse tai hae veneen numero"
                          v-model="boat_number_input"
                          @input="
                            fetchFromDatabase(
                              boat_number_input
                                ? boat_number_input.boat_number
                                : -1
                            )
                          "
                          :options="sortedArray"
                        />
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row v-if="!competition_boat">
                    <v-col>
                      <v-alert v-if="loading" type="info"> </v-alert>
                      <v-alert v-if="!searched" type="warning">
                        Venekuntaa ei valittuna
                      </v-alert>
                      <v-alert v-else type="error">
                        Numerolla ei löytynyt venekuntaa tietokannasta!
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row v-if="competition_boat">
                    <v-col md="8" offset-md="2">
                      <v-row class="title">
                        <v-col md="12">
                          <p class="flow-text">Valitun venekunnan tiedot</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Venekunnan numero</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Kippari</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Varakippari</p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">
                            ({{ competition_boat.boat_number }})
                          </p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">
                            {{ competition_boat.captain_name }}
                          </p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">
                            {{ competition_boat.temp_captain_name }}
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col md="4" offset-md="4">
                          <v-btn large block color="yellow" @click="clearInputs"
                            ><i class="material-icons left">backspace</i>Peruuta
                            valinta</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col md="12" style="margin:50px 50px">
                      <v-divider class="black"></v-divider>
                    </v-col>
                    <v-col md="10" offset-md="1">
                      <v-col>
                        <ul
                          id="fish_weights"
                          v-if="$store.getters.getCompetitionFishes.length"
                        >
                          <li>
                            <v-row v-if="!loading_fish">
                              <v-col md="3">
                                <span class="flow-text">Suurin kala?</span>
                              </v-col>
                              <v-col md="3" class="input-fields">
                                <vue-select
                                  class="flow-text"
                                  label="name"
                                  placeholder="Valitse kalalaji painamalla"
                                  v-model="selected_fish"
                                  :options="competition_fishes"
                                />
                              </v-col>
                              <v-col class="input-fields" md="3">
                                <v-text-field
                                  label="Paino grammoina"
                                  v-model="biggest_fish"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  value="0"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                />
                              </v-col>
                              <v-col md="3">
                                <v-btn
                                  v-if="selected_fish && biggest_fish"
                                  large
                                  tile
                                  color="green"
                                  @click="saveBiggestFish"
                                  ><i class="material-icons left">add_box</i
                                  >Lisää kilpailuun</v-btn
                                >
                              </v-col>
                            </v-row>
                            <v-row v-else>
                              <p class="flow-text">
                                Lisätään kala tietokantaan...
                              </p>
                              <ProgressBarQuery />
                            </v-row>
                            <v-row>
                              <v-col md="12">
                                <v-divider class="black"></v-divider>
                              </v-col>
                            </v-row>
                          </li>
                          <li v-for="(input, index) in inputs" :key="index">
                            <v-row>
                              <v-col md="6">
                                <span class="flow-text">{{ index + 1 }}. </span
                                ><span class="flow-text">{{ input.name }}</span>
                              </v-col>
                              <v-col md="4" class="input-fields">
                                <v-text-field
                                  label="Paino grammoina"
                                  v-model="input.value"
                                  type="number"
                                  @paste.prevent
                                  @keypress="isNumber($event)"
                                  value="0"
                                  step="50"
                                  min="0"
                                  :rules="number_rules"
                                  :loading="loading_fish"
                                />
                              </v-col>
                              <v-col md="2">
                                <v-dialog
                                  v-model="input.dialog"
                                  persistent
                                  max-width="600px"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      color="primary"
                                      dark
                                      v-bind="attrs"
                                      v-on="on"
                                      ><i class="material-icons left">add</i
                                      >Plussaa</v-btn
                                    >
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline"
                                        >Yhteenlaske summat</span
                                      >
                                    </v-card-title>
                                    <v-card-text>
                                      <v-row>
                                        <v-col md="6" offset-md="3">
                                          <v-text-field
                                            label="Alkuperäinen arvo"
                                            :value="input.value"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col md="6 " offset-md="3">
                                          <v-text-field
                                            v-model="input.addition"
                                            label="Lisättävä arvo"
                                            type="number"
                                            @paste.prevent
                                            @keypress="isNumber($event)"
                                            step="50"
                                            min="0"
                                            single-line
                                            outlined
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col
                                          md="6"
                                          offset-md="3"
                                          class="title"
                                        >
                                          <v-text-field
                                            :value="
                                              parseInt(input.value) +
                                                parseInt(
                                                  input.addition
                                                    ? input.addition
                                                    : 0
                                                )
                                            "
                                            label="Summa"
                                            disabled
                                          ></v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        outlined
                                        color="red darken-1"
                                        @click="
                                          input.addition = null;
                                          input.dialog = false;
                                        "
                                        >Peruuta</v-btn
                                      >
                                      <v-btn
                                        outlined
                                        color="green darken-1"
                                        @click="
                                          input.value =
                                            parseInt(input.value) +
                                            parseInt(
                                              input.addition
                                                ? input.addition
                                                : 0
                                            );
                                          input.dialog = false;
                                          input.addition = 0;
                                        "
                                        >Tallenna</v-btn
                                      >
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col md="12">
                                <v-divider class="black"></v-divider>
                              </v-col>
                            </v-row>
                          </li>
                        </ul>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-btn
                              large
                              tile
                              color="red"
                              @click="saveToDatabase(true)"
                              :loading="refreshing"
                              ><i class="material-icons left">delete_forever</i
                              >Nollaa</v-btn
                            >
                          </v-col>
                          <v-col>
                            <p class="flow-text" v-if="refreshing">
                              Synkronoidaan tietokannan kanssa...
                            </p>
                          </v-col>
                          <v-col>
                            <v-btn
                              large
                              tile
                              color="green"
                              @click="saveToDatabase(false)"
                              :loading="refreshing"
                              ><i class="material-icons left">check</i
                              >Tallenna</v-btn
                            >
                          </v-col>
                        </v-row>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-btn
                              id="updatebtn"
                              large
                              tile
                              color="blue darken-4"
                              @click="refreshCompetition(competition_id)"
                              class="white--text"
                            >
                              <i class="material-icons left">update</i>Päivitä
                              kilpailun tiedot
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col>
                            <p class="flow-text">
                              Päivitetään tiedot tietokantaan...
                            </p>
                            <ProgressBarQuery />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <p class="flow-text">
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2>Haetaan veneitä...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Tilannekatsaus" tab -->
        <v-tab-item class="inputarea" :value="'situation'">
          <v-row>
            <v-col>
              <v-row>
                <v-col md="8" offset-md="2" style="margin-top:20px;">
                  <v-card :dark="updateSwitch">
                    <v-card-title>
                      <p class="flow-text">Tilannekatsaus</p>
                      <v-spacer></v-spacer>
                      <v-switch
                        v-model="updateSwitch"
                        class="black--text"
                        color="indigo darken-3"
                        append-icon="mdi-weather-night"
                        prepend-icon="mdi-weather-sunny"
                      ></v-switch>
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
                      @click:row="rowClick"
                      :headers="headers"
                      :items="sortedCompetition"
                      :search="search"
                    >
                      <template v-slot:[`item.placement`]="{ item }">
                        <v-chip
                          :outlined="updateSwitch"
                          :color="getColor(item.placement)"
                          >{{ item.placement }}.</v-chip
                        >
                      </template>
                      <template v-slot:[`item.total_points`]="{ item }">
                        <v-chip :color="getColorPoints(item.total_points)"
                          >{{ item.total_points.toLocaleString() }} p</v-chip
                        >
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="selected_id && result_signees.length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top:30px;margin-bottom:30px"
                >
                  <v-btn large tile color="blue" @click="searchSelected"
                    ><i class="material-icons left">assignment_return</i>Siirry
                    punnitukseen</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top:30px;margin-bottom:30px"
                >
                  <p v-if="result_signees.length" class="flow-text">
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <h3 v-else class="flow-text">Ei vielä tuloksia!</h3>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Vielä vesillä" tab -->
        <v-tab-item class="inputarea" :value="'onwater'">
          <v-row>
            <v-col>
              <v-row>
                <v-col
                  md="8"
                  offset-md="2"
                  class="input-fields"
                  style="margin-top:100px;"
                >
                  <p v-if="!signees.length" class="flow-text red--text">
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                  <p
                    v-if="!still_on_water.length"
                    class="flow-text green--text"
                  >
                    Kaikki venekunnat palanneet maaliin!
                  </p>
                </v-col>
              </v-row>
              <v-row v-if="still_on_water.length">
                <v-col md="8" offset-md="2">
                  <v-card :dark="updateSwitch">
                    <v-card-title>
                      <p class="flow-text">
                        Venekunnat, jotka ovat vielä vesillä
                      </p>
                      <v-spacer></v-spacer>
                      <v-switch
                        v-model="updateSwitch"
                        class="black--text"
                        color="indigo darken-3"
                        append-icon="mdi-weather-night"
                        prepend-icon="mdi-weather-sunny"
                      ></v-switch>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search_on_water"
                        append-icon="mdi-magnify"
                        label="Hae kilpailijaa"
                        single-line
                        hide-details
                      ></v-text-field>
                      ></v-card-title
                    >

                    <v-data-table
                      @click:row="rowClick"
                      :headers="headers_on_water"
                      :items="still_on_water"
                      :search="search_on_water"
                      :loading="loading"
                    >
                      <template v-slot:[`item.boat_number`]="{ item }">
                        <v-chip>{{ item.boat_number }}.</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-if="selected_id && still_on_water.length">
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top:30px;margin-bottom:30px"
                >
                  <v-btn large tile color="blue" @click="searchSelected"
                    ><i class="material-icons left">assignment_return</i>Siirry
                    punnitukseen</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col
                  md="8"
                  offset-md="2"
                  style="margin-top:30px;margin-bottom:30px"
                >
                  <p v-if="still_on_water.length" class="flow-text">
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <v-btn
                    v-if="still_on_water.length"
                    large
                    tile
                    color="grey darken-4"
                    class="white--text"
                    @click="allFinished"
                    :loading="loading"
                    ><i class="material-icons left">check_circle_outline</i
                    >Kaikki saapuneet maaliin</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import { options_picker } from "../i18n";
import CompetitionService from "../CompetitionService";
import "vue-select/dist/vue-select.css";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  name: "Weighting",
  components: {
    Timedate,
    Header,
    ProgressBarQuery,
  },
  data() {
    return {
      tab: null,
      competition_id: null,
      boat_number_input: null,
      competition_boat: null,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      searched: false,
      selected_id: null,
      selected_boat_number: null,
      loading: false,
      refreshing: false,
      loading_fish: false,
      loading_site: true,
      notification: null,
      biggest_fish: null,
      selected_fish: null,
      competition_fishes: [],
      biggest_fishes: {},
      biggest_amounts: {},
      signees: [],
      result_signees: [],
      headers: [
        { text: "Sijoitus", value: "placement" },
        { text: "Kilp. Numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Pisteet", value: "total_points" },
      ],
      headers_on_water: [
        { text: "Kilp. Numero", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Varakippari", value: "temp_captain_name" },
        { text: "Lähtöpaikka", value: "starting_place" },
      ],
      search_on_water: "",
      search: "",
      updateSwitch: true,
      still_on_water: [],
      number_rules: [
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      timer_refresh: null,
      interval: 60000,
      inputs: [],
    };
  },
  computed: {
    // Keep array sorted based on boat number in "Punnitus" tab
    sortedArray() {
      return [...this.signees].sort((a, b) => a.boat_number - b.boat_number);
    },
    sortedCompetition() {
      let signees = [...this.signees].sort(
        (a, b) => b.total_points - a.total_points
      );
      let placement = 1;
      let last_points = -1;
      let last_placement = -1;
      signees.forEach((signee) => {
        if (last_points === signee.total_points) {
          signee.placement = last_placement;
        } else {
          signee.placement = placement;
          last_points = signee.total_points;
          last_placement = signee.placement;
        }
        placement++;
      });
      return signees;
    },
  },
  created() {
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.competition_id = competition["id"];
      this.loading_site = true;
      this.refreshCompetition(this.competition_id);
      /*
      this.timer_refresh = setInterval(
        () => this.refreshCompetition(competition_id),
        this.interval
      );
      */
    }
  },
  mounted() {
    this.checkLogin();
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var collabs = document.querySelectorAll(".collapsible");
    var instances2 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    if (!this.competition_id) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.competition_id = competition["id"];
      this.loading_site = true;
      this.refreshCompetition(this.competition_id);
    }
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  beforeDestroy() {
    // Clear timer
    //clearInterval(this.timer_refresh);
  },
  methods: {
    // Fetch competition from database, and update variables
    async refreshCompetition(competition_id) {
      this.refreshing = true;
      try {
        let competitions = await CompetitionService.getCompetition(
          competition_id
        );
        if (competitions.length) {
          // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
          let comp = competitions[0];
          let normal_results = this.calculateNormalResults(comp);
          comp.normal_points = normal_results.normal_points;
          comp.normal_weights = normal_results.normal_weights;
          this.$store.commit("refreshCompetition", comp);
          this.competition_fishes = this.$store.getters.getCompetitionFishes;
          this.signees = this.$store.getters.getCompetitionSignees;
          let placement = 1;
          let last_points = -1;
          let last_placement = -1;
          this.signees.forEach((signee) => {
            if (last_points === signee.total_points) {
              signee.placement = last_placement;
            } else {
              signee.placement = placement;
              last_points = signee.total_points;
              last_placement = signee.placement;
            }
            placement++;
          });
          this.result_signees = this.$store.getters.getResultSignees;
          this.still_on_water = this.$store.getters.getStillOnWaterSignees;
          this.competition_fishes.forEach((fish) => {
            this.inputs.push({
              name: fish.name,
              value: 0,
              dialog: false,
              addition: null,
            });
          });
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.log(err);
      }
      this.loading_site = false;
      this.refreshing = false;
    },
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
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
    // "Kaikki päässeet maaliin" button pressed
    async allFinished() {
      // Mark all signees as returned
      this.signees.forEach((signee) => {
        signee.returned = true;
      });
      // Update signees array to database/vuex
      let comp = this.$store.getters.getCompetition;
      let normal_results = this.calculateNormalResults(comp);
      let normal_points = normal_results.normal_points;
      let normal_weights = normal_results.normal_weights;
      // Get signees from vuex
      comp.normal_points = normal_points;
      comp.normal_weights = normal_weights;
      comp.signees = this.signees;
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        await CompetitionService.updateCompetition(comp._id, comp);
        this.loading = false;
        this.still_on_water = this.$store.getters.getStillOnWaterSignees;
        M.toast({ html: "Kaikki kilpailijat merkattu maaliin saapuneeksi!" });
      } catch (err) {
        console.log(err.message);
      }
    },
    // Check if input value is number, and only accept numbers to inputs
    isNumber: function(evt) {
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
    // Fetch signee from vuex based on boat number
    // Check client\src\store\index.js for implementation
    searchBoatNumber: function(boat_number) {
      return this.$store.getters.getSigneeByBoatNumber(parseInt(boat_number));
    },
    getColor(placement) {
      if (placement > 30) return "red";
      if (placement > 20) return "orange";
      else if (placement > 5) return "yellow";
      else return "green";
    },
    getColorPoints(points) {
      if (points > 0) return "indigo";
      else return "grey";
    },
    // Select row from table, if selected --> unselect
    // selected_id bound to selected css class (on App.vue)
    rowClick: function(item, row) {
      if (item.id == this.selected_id) {
        this.selected_id = null;
        this.selected_boat_number = null;
        row.select(false);
      } else {
        if (this.selected_row) {
          this.selected_row.select(false);
        }
        this.selected_id = item.id;
        this.selected_boat_number = item.boat_number;
        row.select(true);
        this.selected_row = row;
      }
    },
    // Set input weights for each fish for the signee
    setInputWeights: function() {
      // Loop trhough all the competition fishes
      this.inputs.forEach((input) => {
        let fish_name = input.name;
        // find the fish weights based on the fish_name, from signees weights array
        let fish_weights = this.competition_boat.weights.find(
          (fish) => fish.name === fish_name
        ).weights;
        // Assign the value to input
        input.value = fish_weights;
      });
    },
    // Search signee from database when selected from table
    searchSelected: function() {
      // Change tab to "Punnitus" and fetch
      this.tab = "weighting";
      this.fetchFromDatabase(this.selected_boat_number);
    },

    fetchFromDatabase: function(boat_number) {
      this.selected_id = null;
      this.selected_boat_number = null;
      // If boat_number_input is empty, boat_number = -1
      // If boat_number selected on input
      if (boat_number !== -1) {
        this.searched = true;
        this.notification = null;
        this.competition_boat = this.searchBoatNumber(boat_number);
        if (this.competition_boat) {
          //Wait for render to set weights to inputs
          this.$nextTick(() => this.setInputWeights());
          this.boat_number_input = this.competition_boat;
        } else {
          console.log("No such boat in list!");
        }
      } else {
        // No boat selected, clear inputs
        this.clearInputs();
      }
    },

    // Save biggest fish to database
    async saveBiggestFish() {
      // If name for biggest fish, boat number and weight for biggest fish all have been selected
      if (
        this.selected_fish.name &&
        this.boat_number_input &&
        this.biggest_fish
      ) {
        // Create fish object
        let fish = {
          name: this.selected_fish.name,
          boat_number: this.boat_number_input.boat_number,
          captain_name: this.boat_number_input.captain_name,
          weight: this.biggest_fish,
        };
        this.$store.commit("addBiggestFish", fish);
        this.biggest_fishes = this.$store.getters.getBiggestFishes;
        // Create competition object and update it to database
        let comp = this.$store.getters.getCompetition;
        comp.biggest_fishes = this.biggest_fishes;
        this.$store.commit("refreshCompetition", comp);
        try {
          this.loading_fish = true;
          await CompetitionService.updateCompetition(comp._id, comp);
          this.notification = `Tiedot päivitetty tietokantaan!`;
          this.loading_fish = false;
          (this.selected_fish = null), (this.biggest_fish = null);
        } catch (err) {
          console.log(err.message);
        }
        M.toast({ html: "Isoin kala tallennettu listaan!" });
      } else {
        console.log("Jokin input tyhjänä:");
        let fish = {
          name: this.selected_fish.name,
          boat_number: this.boat_number_input.boat_number,
          captain_name: this.boat_number_input.captain_name,
          weight: this.biggest_fish,
        };
        console.log(fish);
      }
    },
    // Save all weights to database
    async saveToDatabase(reset) {
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let fish_weights = [];
      let total_weights = 0;
      let total_points = 0;
      let fish_weight = 0;
      let fish_points = 0;
      let fish_name;
      this.biggest_fishes = this.$store.getters.getBiggestFishes;

      // if biggest fish not yet saved, save it
      if (this.selected_fish && this.boat_number_input && this.biggest_fish) {
        let fish = {
          name: this.selected_fish.name,
          boat_number: this.boat_number_input.boat_number,
          captain_name: this.boat_number_input.captain_name,
          weight: this.biggest_fish,
        };
        this.$store.commit("addBiggestFish", fish);
        this.biggest_fishes = this.$store.getters.getBiggestFishes;
        (this.selected_fish = null), (this.biggest_fish = null);
      }
      //if reset == true, reset current weights to 0, otherwise update weights from inputs
      if (reset) {
        this.competition_boat.returned = false;
        // For every fish, reset weights/points and add them to array
        this.inputs.forEach((input) => {
          fish_name = input.name;
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
          // If there are biggest fishes in competition
          if (this.biggest_fishes) {
            // If there are biggest fishes from certain fish_name
            if (this.biggest_fishes[fish_name]) {
              // Check if signee has biggest fish there
              let index = this.biggest_fishes[fish_name].findIndex((item) => {
                return (
                  parseInt(this.boat_number_input.boat_number) ===
                  parseInt(item.boat_number)
                );
              });
              // If fish found, delete it
              if (index > -1) {
                this.biggest_fishes[fish_name].splice(index, 1);
              }
            }
          }
          // If there are fish amounts in competition
          if (this.biggest_amounts) {
            // If there are fish amounts from certain fish_name
            if (this.biggest_amounts[fish_name]) {
              // Check if signee has biggest fish there
              let index = this.biggest_amounts[fish_name].findIndex((item) => {
                return (
                  parseInt(this.boat_number_input.boat_number) ===
                  parseInt(item.boat_number)
                );
              });
              if (index > -1) {
                // If fish found, delete it
                this.biggest_amounts[fish_name].splice(index, 1);
              }
            }
          }
        });
      }
      // Don't reset points, add new values
      else {
        this.competition_boat.returned = true;
        // For every fish, get values from inputs
        this.inputs.forEach((input) => {
          fish_name = input.name;
          fish_weight = parseInt(input.value ? input.value : 0); // If input empty, replace with 0
          // Get points multiplier for this certain fish for points calculation
          let points_multiplier = competition_fishes.find(
            (fish) => fish.name === fish_name
          ).multiplier;
          fish_points = fish_weight * points_multiplier;
          // Add fish object to array
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
          // Create biggest fish amount object and store to vuex
          let fish = {
            name: fish_name,
            boat_number: this.competition_boat.boat_number,
            captain_name: this.competition_boat.captain_name,
            weight: fish_weight,
          };
          this.$store.commit("addBiggestAmount", fish);
          this.biggest_amounts = this.$store.getters.getBiggestAmounts;
          total_weights += fish_weight;
          total_points += fish_points;
        });
      }

      this.competition_boat.weights = fish_weights;
      this.competition_boat.total_weights = total_weights;
      this.competition_boat.total_points = total_points;
      // If there is signee with save number, replace in vuex
      // Check implementation from 'client\src\store\index.js'
      this.$store.commit("replaceSignee", this.competition_boat);
      let comp = this.$store.getters.getCompetition;
      let normal_results = this.calculateNormalResults(comp);
      let normal_points = normal_results.normal_points;
      let normal_weights = normal_results.normal_weights;
      let competition_total_weights = this.calculateTotalWeights();

      // Get signees from vuex
      comp.signees = this.$store.getters.getCompetitionSignees;
      comp.normal_points = normal_points;
      comp.normal_weights = normal_weights;
      if (comp.team_competition) {
        comp.team_results = this.calculateTeamResults();
      }
      comp.biggest_fishes = this.biggest_fishes;
      comp.biggest_amounts = this.biggest_amounts;
      comp.total_weights = competition_total_weights;

      // Update competition state
      if (this.still_on_water.length) {
        comp.state = "Punnitus";
      } else {
        comp.state = "Kaikki maalissa";
      }
      // Refresh to vuex
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        this.loading_fish = true;
        await CompetitionService.updateCompetition(comp._id, comp);
        this.notification = `Tiedot päivitetty tietokantaan!`;
        // Update values for next signee
        this.selected_boat_number = this.competition_boat.boat_number + 1;
        this.boat_number_input = null;
        this.competition_boat = null;
        this.signees = comp.signees;
        this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
        this.result_signees = this.$store.getters.getResultSignees;
        this.still_on_water = this.$store.getters.getStillOnWaterSignees;
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
      this.loading_fish = false;
      this.searched = false;
    },
    // "Normaalikilpailu" results
    calculateNormalResults: function(competition) {
      const cup_points_multiplier = competition.cup_points_multiplier;
      let cup_placement_points = competition.cup_placement_points;
      const cup_participation_points = competition.cup_participation_points;
      let last_points = 0;
      let tied_competitors = 0;
      let placement = 1;
      let counter = 0;
      let cup_points_total;

      let normal_points = [];
      let normal_weights = [];
      this.signees = competition.signees.filter(
        (signee) => signee.returned == true
      );
      this.signees = this.signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
      // For every signee, calculate their cup points and placing
      //TODO rework the structure, seems more complex than it should be
      this.signees.forEach((signee) => {
        cup_points_total = 0;
        // First competitor
        if (!normal_points.length) {
          // If no points --> no placement points
          if (signee.total_points == 0) {
            cup_placement_points = 0;
          }
          // Formula for cup points calculations, cup_points_multiplier only scales the placement points
          last_points = signee.total_points;
          cup_points_total =
            cup_placement_points * cup_points_multiplier +
            cup_participation_points;
        }
        // After first competitor
        else {
          // If competitor has same points as last competitor
          if (signee.total_points == last_points) {
            placement -= 1; // Keep the same placing (adds 1 later)
            tied_competitors += 1; // remember amount of tied competitors for later to deduct more points from next not tied competitor
          }
          // If no tie, add tied_competitors to placement, to give correct placement to next not tied competitor
          else {
            placement += tied_competitors;
          }

          // If no points --> no placement points
          if (signee.total_points == 0) {
            cup_placement_points = 0;
            // if there is a tie on points, increment tied competitors
            if (signee.total_points === last_points) {
              tied_competitors += 1;
            }
          }

          // For the first 6 competitors, deduct 2 points, after the first 5 deductions, deduct 1
          // tied_competitors makes sure that ties are taken into account
          if (counter <= 5) {
            // If there are no ties
            if (
              signee.total_points !== last_points &&
              signee.total_points > 0
            ) {
              cup_placement_points -= 2 * (tied_competitors + 1);
              tied_competitors = 0;
            }
          } else if (cup_placement_points <= 0) {
            // make sure points won't go negative
            cup_placement_points = 0;
            tied_competitors = 0;
          } else {
            // If the points differ from last competitor, deduct placement points
            if (signee.total_points !== last_points) {
              //Normal point calculation
              cup_placement_points -= 1 * (tied_competitors + 1);
              tied_competitors = 0;
            }
          }
        }

        // Calculate total cup points, cup points multiplier only scales the placement points
        if (cup_placement_points > 0) {
          cup_points_total =
            cup_placement_points * cup_points_multiplier +
            cup_participation_points;
        } else {
          cup_points_total = cup_participation_points;
        }

        //For showing cup points, "Pisteet" on v-select
        normal_points.push({
          placement: placement,
          boat_number: signee.boat_number,
          captain_name: signee.captain_name,
          temp_captain_name: signee.temp_captain_name,
          locality: signee.locality,
          total_points: signee.total_points.toLocaleString(),
          cup_placement_points: cup_placement_points * cup_points_multiplier,
          cup_participation_points: cup_participation_points,
          cup_points_total: cup_points_total,
        });

        counter++;

        //For showing fish weights, "Kalat" on v-select
        let temp_dict = {};
        temp_dict.placement = placement;
        temp_dict.boat_number = signee.boat_number;
        temp_dict.captain_name = signee.captain_name;

        // For each fish, get the weight and fish name
        signee.weights.forEach((weights) => {
          let name = weights.name;
          let weight = weights.weights;
          temp_dict[name] = weight;
        });
        temp_dict.total_points = signee.total_points;
        normal_weights.push(temp_dict);
        last_points = signee.total_points;
        // Calculate next placement
        if (tied_competitors > 0) {
          placement += tied_competitors;
        } else {
          placement++;
        }
      });

      let output = {
        normal_points: normal_points,
        normal_weights: normal_weights,
      };

      return output;
    },
    calculateTeamResults: function() {
      var team_names = [];
      let team_results = [];
      // Get all the team names
      this.signees.forEach((signee) => {
        if (signee.team !== "-" && signee.team !== null) {
          team_names.push(signee.team);
        }
      });
      // Only unique ones needed
      team_names = [...new Set(team_names)];

      // Get all the members of each team and add up their points
      team_names.forEach((team_name) => {
        let team = this.signees.filter((signee) => signee.team == team_name);
        let team_points = 0;
        let members = [];

        team.forEach((member) => {
          members.push(member.captain_name);
          team_points += member.total_points;
        });

        // If there aren't 3 members in a team, add "-"'s as members for nicer looking table
        if (members.length === 1) {
          members.push("-");
          members.push("-");
        }
        if (members.length === 2) {
          members.push("-");
        }
        team_results.push({
          name: team_name,
          captain_name_1: members[0],
          captain_name_2: members[1],
          captain_name_3: members[2],
          points: team_points.toLocaleString(),
        });
      });

      return team_results;
    },
    // Calculate total weight of all the fishes in competition
    calculateTotalWeights: function() {
      let finished_boats = this.$store.getters.getFinishedSignees;
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let total_weights = 0;
      // For each boat, get every fish weight and add them to competition_fishes and total_weights in competition
      // For statistics
      // First reset
      for (let i = 0; i < competition_fishes.length; i++) {
        competition_fishes[i].weights = 0;
      }
      //Then add
      finished_boats.forEach((element) => {
        for (let i = 0; i < competition_fishes.length; i++) {
          let fish_weights = element.weights.find(
            (fish) => competition_fishes[i].name == fish.name
          ).weights;
          competition_fishes[i].weights += parseInt(fish_weights);
          //TODO update only this one variable to database, not the whole competition
          total_weights += parseInt(fish_weights);
        }
      });
      return total_weights;
    },
    // Clear all inputs and selections
    clearInputs: function() {
      M.toast({ html: "Pyyhitään inputit ja valinnat..." });
      this.inputs.forEach((input) => {
        input.value = 0;
      });
      this.competition_boat = null;
      this.boat_number_input = null;
      this.selected_fish = null;
      this.biggest_fish = null;
      this.searched = false;
    },
  },
};
</script>
