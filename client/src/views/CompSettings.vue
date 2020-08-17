<template>
  <!-- /comp-settings -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate style="margin-top:0" />

    <v-row>
      <v-col md="6" offset-md="3" style="margin-top:20px">
        <router-link to="/overview">
          <v-btn large rounded color="primary"
            ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</v-btn
          >
        </router-link>
      </v-col>

      <v-col md="3" style="margin-top:20px">
        <router-link to="/signing">
          <v-btn large rounded color="blue" class="white--text"
            ><i class="material-icons left">edit</i>Ilmoittautuminen</v-btn
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
      <v-tab href="#show-settings">Määritykset</v-tab>
      <v-tab href="#change-settings" :disabled="loading"
        >Muuta määrityksiä</v-tab
      >
    </v-tabs>

    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item :value="'show-settings'">
        <div class="container-transparent">
          <div class="section">
            <div class="col s12 center-align">
              <h1>Kilpailun määritykset</h1>
            </div>
          </div>
          <!-- if this.loading === false, meaning app isn't loading competition data from database -->
          <v-row v-if="!loading" id="settings-info" class="inputarea">
            <v-col>
              <v-row>
                <v-col>
                  <h3>
                    Perustiedot
                  </h3>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="10" offset-md="1" class="scroll_table">
                  <table class="striped centered responsive-table highlight">
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Kilpailu
                      </th>
                      <!-- competition.name would be this.competition.name if referenced on javascript etc. -->
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.name }} ({{ competition.locality }})
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Cup
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_name }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Voittajan Cup sijoittumispisteet
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_placement_points }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Kilpailijoiden Cup osallistumispisteet
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_participation_points }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Kilpailun pistekerroin
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        x {{ competition.cup_points_multiplier }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Onko kilpailu julkinen
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.isPublic ? "Kyllä" : "Ei" }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Aloituspäivä
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ formatted_start_date }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Lopetuspäivämäärä
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ formatted_end_date }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Kilpailuaika
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.start_time }} -
                        {{ competition.end_time }}
                      </td>
                    </tr>
                  </table>
                </v-col>
              </v-row>
              <v-row style="margin-top:70px;margin-bottom:0">
                <v-col md="10" offset-md="1">
                  <h3>Kalojen määritykset</h3>
                </v-col>
              </v-row>
              <v-row class="fishes_summary">
                <v-col md="10" offset-md="1" class="scroll_table">
                  <table
                    class="striped highlight centered responsive-table table_header"
                  >
                    <thead>
                      <tr>
                        <th>Kalalaji</th>
                        <th>Pistekerroin</th>
                        <th>Alamitta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- for every fish in this.fish_specs, show info for that fish -->
                      <tr v-for="(fish, index) in fish_specs" :key="index">
                        <th style="border:1px solid black;" scope="row">
                          {{ fish.name }}
                        </th>
                        <td style="border:1px solid black;">
                          x {{ fish.multiplier }}
                        </td>
                        <td style="border:1px solid black;">
                          {{ fish.minsize }} cm
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="4" offset-md="4" style="margin-top:20px">
                  <v-btn
                    block
                    color="red"
                    @click="deleteCompetition(competition._id, false)"
                    ><i class="material-icons left">delete_forever</i>Poista
                    Kilpailu</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2>Haetaan määrityksiä...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
      <v-tab-item :value="'change-settings'">
        <div class="container-transparent">
          <div id="errordiv" v-if="errors.length">
            <ul class="collection with-header" style="border:1px solid red;">
              <li class="collection-header" style="background: rgba(0,0,0,0);">
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
                <p class="flow-text">{{ index + 1 }}. {{ error }}</p>
              </li>
            </ul>
          </div>
          <v-row>
            <v-col>
              <h1>Muuta määrityksiä</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="center-align flow-text black--text">
                Kilpailun perustiedot
              </p>
              <p
                v-if="basic_info_validated"
                class="flow-text yellow lighten-1 center-align"
              >
                Tiedot lukittuna, paina "Muuta tietoja" jos haluat varmasti
                muokata tietoja
              </p>
            </v-col>
          </v-row>
          <v-row v-if="!loading">
            <v-col md="12">
              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-text-field
                    label="Kilpailun nimi"
                    v-model="name"
                    :maxlength="max_input"
                    :disabled="basic_info_validated"
                    :rules="rules"
                    :counter="max_input"
                  />
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-text-field
                    label="Paikkakunta"
                    v-model="locality"
                    :maxlength="max_input"
                    :disabled="basic_info_validated"
                    :rules="rules"
                    :counter="max_input"
                  />
                </v-col>
              </v-row>

              <v-row v-if="cup.name">
                <v-col md="3">
                  <p class="center-align flow-text black--text">
                    Valitse Cup
                  </p>
                </v-col>
                <v-col class="d-flex" md="6">
                  <v-select
                    v-model="cup"
                    :items="cups"
                    item-text="select"
                    item-value="_id"
                    :hint="`${cup.name} (${cup.year})`"
                    :disabled="basic_info_validated"
                    outlined
                    return-object
                    single-line
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <h2>Haetaan cuppeja...</h2>
                  <ProgressBarQuery />
                </v-col>
              </v-row>
              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-text-field
                    label="Kilpailun voittajan cup sijoittumispisteet"
                    v-model="cup_placement_points"
                    append-outer-icon="add"
                    maxlength="6"
                    @click:append-outer="
                      cup_placement_points >= 0
                        ? cup_placement_points++
                        : (cup_placement_points = 1)
                    "
                    prepend-icon="remove"
                    @click:prepend="
                      cup_placement_points >= 1
                        ? cup_placement_points--
                        : (cup_placement_points = 0)
                    "
                    @paste.prevent
                    :counter="6"
                    @keypress="isNumber($event, true)"
                    :rules="number_rules"
                    :disabled="basic_info_validated"
                  />
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-text-field
                    label="Kilpailun cup osallistumispisteet"
                    v-model="cup_participation_points"
                    append-outer-icon="add"
                    maxlength="6"
                    @click:append-outer="
                      cup_participation_points >= 0
                        ? cup_participation_points++
                        : (cup_participation_points = 1)
                    "
                    prepend-icon="remove"
                    @click:prepend="
                      cup_participation_points >= 1
                        ? cup_participation_points--
                        : (cup_participation_points = 0)
                    "
                    @paste.prevent
                    :counter="6"
                    @keypress="isNumber($event, true)"
                    :rules="number_rules"
                    :disabled="basic_info_validated"
                  />
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-text-field
                    label="Cup pistekerroin"
                    v-model="cup_points_multiplier"
                    append-outer-icon="add"
                    maxlength="3"
                    @click:append-outer="
                      cup_points_multiplier >= 1
                        ? (cup_points_multiplier += 0.5)
                        : (cup_points_multiplier = 1)
                    "
                    prepend-icon="remove"
                    @click:prepend="
                      cup_points_multiplier >= 1.5
                        ? (cup_points_multiplier -= 0.5)
                        : (cup_points_multiplier = 1)
                    "
                    @paste.prevent
                    :counter="3"
                    @keypress="isNumber($event, true)"
                    :rules="number_rules"
                    :disabled="basic_info_validated"
                  />
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col md="6" offset-md="3" class="input-fields">
                  <v-col>
                    <span class="flow-text black-text"
                      >Onko Tiimikilpailua?</span
                    >
                  </v-col>
                  <v-col offset-md="4">
                    <v-radio-group
                      v-model="team_competition"
                      row
                      :disabled="basic_info_validated"
                    >
                      <v-radio label="Kyllä" value="Kyllä"></v-radio>
                      <v-radio label="Ei" value="Ei"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col cols="12" md="5">
                  <v-row align="center">
                    <span class="flow-text black-text col s6"
                      >Kilpailun Aloituspäivä</span
                    >
                  </v-row>
                  <v-row align="center">
                    <v-date-picker
                      style="height:480px"
                      v-model="start_date"
                      full-width
                      elevation="15"
                      locale="fi"
                      class="mt-4"
                      :disabled="basic_info_validated"
                    ></v-date-picker>
                  </v-row>
                </v-col>
                <v-col
                  cols="12"
                  md="5"
                  offset-md="2"
                  style="margin-bottom:50px"
                >
                  <v-row align="center">
                    <span class="flow-text black-text col s6"
                      >Kilpailun Lopetuspäivä</span
                    >
                  </v-row>
                  <v-row>
                    <v-date-picker
                      style="height:480px"
                      v-model="end_date"
                      full-width
                      elevation="15"
                      locale="fi"
                      class="mt-4"
                      :disabled="basic_info_validated"
                    ></v-date-picker>
                  </v-row>
                </v-col>
              </v-row>

              <v-row v-if="competition">
                <v-col cols="12" md="5">
                  <v-row align="center">
                    <v-col>
                      <span class="flow-text black-text"
                        >Kilpailun alkamismisaika</span
                      >
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col>
                      <v-time-picker
                        v-model="start_time"
                        format="24hr"
                        full-width
                        scrollable
                        elevation="15"
                        :disabled="basic_info_validated"
                      ></v-time-picker>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="5" offset-md="1">
                  <v-row align="center">
                    <v-col md="12" offset-md="2">
                      <span class="flow-text black-text"
                        >Kilpailun loppumisaika</span
                      >
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col md="12" offset-md="2">
                      <v-time-picker
                        v-model="end_time"
                        format="24hr"
                        full-width
                        scrollable
                        elevation="15"
                        :disabled="basic_info_validated"
                      ></v-time-picker>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="fishes_summary">
                <v-col md="10" offset-md="1">
                  <table
                    class="striped highlight centered responsive-table table_header"
                  >
                    <thead>
                      <tr>
                        <th>Kalalaji</th>
                        <th>Pistekerroin</th>
                        <th>Alamitta</th>
                        <th v-if="!basic_info_validated">Poista?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- for every fish in this.fish_specs, show info for that fish -->
                      <tr v-for="(input, index) in inputs" :key="index">
                        <th style="border:1px solid black;" scope="row">
                          <v-text-field
                            label="Nimi"
                            v-model="input.name"
                            :disabled="basic_info_validated"
                            :rules="rules"
                            :counter="max_input"
                          />
                        </th>
                        <td style="border:1px solid black;">
                          <v-text-field
                            label="Kerroin"
                            v-model="input.multiplier"
                            maxlength="4"
                            append-outer-icon="add"
                            @click:append-outer="
                              parseInt(input.multiplier) >= 1
                                ? (input.multiplier += 0.5)
                                : (input.multiplier = 1)
                            "
                            prepend-icon="remove"
                            @click:prepend="
                              input.multiplier >= 1.5
                                ? (input.multiplier -= 0.5)
                                : (input.multiplier = 1)
                            "
                            @paste.prevent
                            :counter="3"
                            @keypress="isNumber($event, true)"
                            :rules="number_rules"
                            :disabled="basic_info_validated"
                          />
                        </td>
                        <td style="border:1px solid black;">
                          <v-text-field
                            label="Alamitta (cm)"
                            v-model="input.minsize"
                            :maxlength="10"
                            :disabled="basic_info_validated"
                            :rules="rules"
                            :counter="10"
                          />
                        </td>
                        <td
                          style="border:1px solid black;"
                          v-if="!basic_info_validated"
                        >
                          <v-btn
                            large
                            color="red darken-4"
                            class="white--text"
                            :disabled="basic_info_validated"
                            @click="
                              deleteFish(index, input.original_name, false)
                            "
                            ><i class="material-icons left">remove_circle</i
                            >Poista</v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
              <v-row v-if="!basic_info_validated">
                <v-col>
                  <v-btn large color="green darken-4" @click="addInput"
                    ><i class="material-icons left">add_box</i>Lisää kala</v-btn
                  >
                </v-col>
              </v-row>

              <v-row v-if="!basic_info_validated">
                <v-col md="6" v-if="competition">
                  <v-btn large color="yellow" @click="setOriginalValues"
                    ><i class="material-icons left">check</i>Peruuta
                    muutokset</v-btn
                  >
                </v-col>
                <v-col md="6" v-if="competition">
                  <v-btn large color="green" @click="checkBasicInformation"
                    ><i class="material-icons left">check</i>Tallenna
                    muutokset</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-row v-if="basic_info_validated">
              <v-col style="margin-top:20px">
                <v-btn
                  large
                  tile
                  color="grey"
                  @click="basic_info_validated = false"
                  ><i class="material-icons left">settings</i>Muuta
                  tietoja</v-btn
                >
              </v-col>
            </v-row>
          </v-row>
          <v-row v-else>
            <v-col>
              <h2>Päivitetään tietoja...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import moment from "moment";
import CompetitionService from "../CompetitionService";
import CupService from "../CupService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  name: "CompSettings",
  components: {
    Timedate,
    ProgressBarQuery,
    Header,
  },
  data() {
    return {
      errors: [],
      cups: [],
      cup: {},
      competition: null,
      name: null,
      locality: null,
      cup_placement_points: null,
      cup_participation_points: null,
      cup_points_multiplier: null,
      team_competition: null,
      fish_specs: null,
      start_date: null,
      end_date: null,
      formatted_start_date: null,
      formatted_end_date: null,
      start_time: null,
      end_time: null,
      loading: false,
      loading_cups: false,
      tab: null,
      basic_info_validated: true,
      inputs: [],
      rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) =>
          (value || "").length <= this.max_input || "Enintään 40 merkkiä",
      ],
      number_rules: [
        (value) => !!value || "Kenttä ei voi jäädä tyhjäksi!",
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      max_input: 40,
    };
  },
  created() {
    // Check login
    this.checkLogin();
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      this.refreshCompetition(competition_id);
      this.getCups();
    } else {
      console.log("No competition in localstorage!");
    }
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  mounted() {
    if (!this.competition) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      const competition_id = competition["id"];
      this.refreshCompetition(competition_id);
    }
    if (!this.cups.length) {
      this.getCups();
    }
  },
  methods: {
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
    async getCups() {
      this.loading_cups = true;
      const user = JSON.parse(localStorage.getItem("user"));
      const user_id = user["id"];
      // Get Cups
      try {
        this.cups = await CupService.getCups(user_id);
        if (this.cups.length) {
          this.cups.sort(function compare(a, b) {
            return a.name - b.name;
          });
          this.cups.forEach((cup) => {
            cup.select = `${cup.name} (${cup.year})`;
          });
          let temp_cup = this.cups.find((cup) => {
            return this.competition.cup_name === cup.name;
          });
          temp_cup
            ? (this.cup = temp_cup)
            : console.log("No cup found on competition!");
        }
      } catch (err) {
        this.error = err.message;
      }
      this.loading_cups = false;
    },
    // Update competition data from database
    async refreshCompetition(competition_id) {
      this.loading = true;
      this.inputs = [];
      try {
        //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
        let competitions = await CompetitionService.getCompetition(
          competition_id
        );
        // IF competition found from database
        if (competitions.length) {
          // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
          //TODO make a test for this?
          this.competition = competitions[0];
          // Update to vuex, Assing variables from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", competitions[0]);
          this.fish_specs = this.$store.getters.getCompetitionFishes;
          let temp_start_date = moment(this.competition.start_date);
          let temp_end_date = moment(this.competition.end_date);
          this.formatted_start_date = `${temp_start_date.date()}.${temp_start_date.month() +
            1}.${temp_start_date.year()}`;
          this.formatted_end_date = `${temp_end_date.date()}.${temp_end_date.month() +
            1}.${temp_end_date.year()}`;
          this.setOriginalValues();
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
    },
    //filter other characters out for number inputs
    isNumber: function(evt, isDate) {
      var charToCheckCode = 46; // --> .
      var charToCheck = ".";

      if (!isDate) {
        charToCheckCode = 58; // --> :
        charToCheck = ":";
      }

      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== charToCheckCode
      ) {
        evt.preventDefault();
      } else {
        if (charCode == charToCheckCode) {
          if (evt.target.value.indexOf(charToCheck) >= 0) {
            evt.preventDefault();
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    },
    addInput: function() {
      this.inputs.push({
        name: null,
        multiplier: 1,
        minsize: 0,
        weights: 0,
        color: this.generateRandomColor(),
      });
    },
    deleteFish: function(index, fish_name, confirmed) {
      if (confirmed) {
        try {
          this.inputs.splice(index, 1);
          this.competition.signees.forEach((signee) => {
            if (signee.weights.length) {
              let signee_index = signee.weights.findIndex((fish) => {
                return fish.name === fish_name;
              });
              if (signee_index > -1) {
                // Replace
                signee.weights.splice(signee_index, 1);
              }
            }
          });
        } catch (err) {
          console.error = err.message;
        }
      } else {
        // demos for this -->  https://constkhi.github.io/vue-simple-alert/
        this.$confirm("Oletko varma?", "Poista kala", "question")
          .then((r) => {
            if (r) {
              this.deleteFish(index, fish_name, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    setOriginalValues: function() {
      this.inputs = [];
      this.fish_specs.forEach((fish) => {
        this.inputs.push({
          name: fish.name,
          multiplier: parseInt(fish.multiplier),
          minsize: fish.minsize,
          weights: parseInt(fish.weights),
          color: fish.color,
          original_name: fish.name,
          original_multiplier: parseInt(fish.multiplier),
          original_minsize: fish.minsize,
        });
      });
      this.name = this.competition.name;
      this.locality = this.competition.locality;
      this.cup_participation_points = this.competition.cup_participation_points;
      this.cup_placement_points = this.competition.cup_placement_points;
      this.cup_points_multiplier = this.competition.cup_points_multiplier;
      this.team_competition = this.competition.team_competition
        ? "Kyllä"
        : "Ei";
      this.start_date = new Date(this.competition.start_date)
        .toISOString()
        .substr(0, 10);
      this.end_date = new Date(this.competition.end_date)
        .toISOString()
        .substr(0, 10);
      this.start_time = this.competition.start_time;
      this.end_time = this.competition.end_time;
      this.basic_info_validated = true;
    },
    // Generate random colors for the fish chart in Result.vue (since adding fishes is dynamic)
    //TODO look for 8-15 good colors to add/choose from, maybe with color picker next to fish name
    generateRandomColor: function() {
      var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      return randomColor;
    },
    // Add error to error array and direct user to it
    showError: function(error) {
      this.errors.push(error);
      M.toast({ html: error });
      location.href = "#";
      location.href = "#app";
    },
    // Check competitions basic information (Perustiedot)
    checkBasicInformation: function() {
      this.errors = [];
      this.basic_info_validated = false;
      this.validated = false;
      // Check if the given dates and times are valid with moment
      var isDateValid = moment(this.start_date, "YYYY-M-D", true).isValid();

      var isEndDateValid = moment(this.end_date, "YYYY-M-D", true).isValid();

      var isStartTimeValid = moment(this.start_time, "H:mm", true).isValid();

      var isEndTimeValid = moment(this.end_time, "H:mm", true).isValid();

      // Check other variables
      if (!this.name) {
        this.showError("Kilpailun nimi puuttuu!");
      }

      // Check other variables
      if (!this.locality) {
        this.showError("Kilpailun paikkakunta puuttuu!");
      }

      if (!this.cup._id) {
        this.showError("Cuppia ei valittuna!");
      }
      if (!this.cup_placement_points) {
        this.showError(
          "Määritä kilpailun voittajalle Cup sijoittumispisteet (Voittaja saa pisteet: Sijoittumispisteet + Osallistumispisteet)!"
        );
      }
      if (!this.cup_participation_points) {
        this.showError("Määritä kilpailun Cup osallistumispisteet!");
      }
      if (!this.cup_points_multiplier) {
        this.showError("Kilpailun pistekerroin puuttuu!");
      }
      if (this.cup_points_multiplier < 0.1) {
        this.showError("Kilpailun pistekerroin pitää olla vähintään 0.1!");
      }
      if (!this.start_time || !isStartTimeValid) {
        !this.start_time == true
          ? this.showError("Kilpailun alkamisnaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.start_time
            );
      }
      if (!this.end_time || !isEndTimeValid) {
        !this.end_time == true
          ? this.showError("Kilpailun loppumisaika puuttuu!")
          : this.showError(
              'Syötä aika muodossa "hh:mm" (esim: 13:00). Syötetty aika oli: ' +
                this.end_time
            );
      }
      if (!this.start_date || !isDateValid) {
        !this.start_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      }
      if (!this.end_date || !isEndDateValid) {
        !this.end_date == true
          ? this.showError("Päivämäärää ei ole valittu!")
          : this.showError(
              'Syötä päivämäärä muodossa "PP.KK.VVVV (esim: 06.02.2020)'
            );
      } else {
        let temp_start = moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = moment(this.end_date).format("DD.MM.YYYY");
        // If dates are valid, check that start_date is before end_date
        let start_date = moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        if (end_date.isBefore(start_date, "minutes")) {
          this.showError(
            "Kilpailun päättymispäivämäärä ja kellonaika ei voi olla ennen alkamispäivämäärää!"
          );
        }
      }

      // Check all the inputs
      this.inputs.forEach((input) => {
        if (!input.name) {
          this.showError("Kalan nimi on jäänyt tyhjäksi!");
        }
        if (!input.multiplier) {
          this.showError(
            `${input.name ? input.name : "Kalan"} kerroin on jäänyt tyhjäksi!`
          );
        }
        if (!input.minsize) {
          this.showError(
            `${input.name ? input.name : "Kalan"} alamitta on jäänyt tyhjäksi!`
          );
        }
      });

      // If all inputs validated
      if (!this.errors.length) {
        let temp_start = moment(this.start_date).format("DD.MM.YYYY");
        let temp_end = moment(this.end_date).format("DD.MM.YYYY");
        let start_date = moment(
          `${temp_start} ${this.start_time}`,
          "DD.MM.YYYY HH:mm"
        );
        let end_date = moment(
          `${temp_end} ${this.end_time}`,
          "DD.MM.YYYY HH:mm"
        );

        // Basic info, change all the competition variables with values from inputs
        this.competition.cup_id = this.cup._id;
        this.competition.cup_name = this.cup.name;
        this.competition.name = this.name;
        this.competition.locality = this.locality;
        this.competition.cup_placement_points = Number(
          this.cup_placement_points
        );
        this.competition.cup_participation_points = Number(
          this.cup_participation_points
        );
        this.competition.cup_points_multiplier = Number(
          this.cup_points_multiplier
        );
        this.competition.team_competition =
          this.team_competition === "Ei" ? false : true;
        this.competition.start_date = start_date;
        this.competition.end_date = end_date;
        this.competition.start_time = this.start_time;
        this.competition.end_time = this.end_time;

        // Change values for each signee (so that only the changed variables change), if the name/multiplier/minsize has been changed
        this.competition.signees.forEach((signee) => {
          if (signee.weights.length) {
            this.inputs.forEach((input) => {
              // If one of these input values are changed, handle variable changes to database
              if (
                input.name !== input.original_name ||
                input.multiplier !== input.original_multiplier ||
                input.minsize !== input.original_minsize
              ) {
                let index = signee.weights.findIndex((fish) => {
                  return fish.name === input.original_name;
                });
                if (index > -1) {
                  // Replace name, and calculate points in case the multiplier has been changed
                  signee.weights[index].name = input.name;
                  // Remove old points from total points
                  signee.total_points -= signee.weights[index].points;
                  // Calculate new points
                  signee.weights[index].points =
                    signee.weights[index].weights * input.multiplier;
                  // Add new points
                  signee.total_points += signee.weights[index].points;

                  if (this.competition.normal_weights.length) {
                    // Update signee values on competition.normal_weights
                    let weight_index = this.competition.normal_weights.findIndex(
                      (results) => {
                        return (
                          parseInt(results.boat_number) ===
                          parseInt(signee.boat_number)
                        );
                      }
                    );
                    if (weight_index > -1) {
                      let normal_weight = this.competition.normal_weights[
                        weight_index
                      ];
                      // Assing total_points here too
                      normal_weight.total_points = signee.total_points;
                      // If name has changed, replace old key with new one, so only name changes, not the values apart from total_points
                      if (input.name !== input.original_name) {
                        console.log(input.name, input.original_name);
                        delete Object.assign(normal_weight, {
                          [input.name]: normal_weight[input.original_name],
                        })[input.original_name];
                      }
                    }

                    // Update signee values on competition.normal_points
                    let point_index = this.competition.normal_points.findIndex(
                      (results) => {
                        return (
                          parseInt(results.boat_number) ===
                          parseInt(signee.boat_number)
                        );
                      }
                    );
                    if (point_index > -1) {
                      let normal_point = this.competition.normal_points[
                        point_index
                      ];
                      // Assing total_points here too, so no need to calculate points again
                      normal_point.total_points = signee.total_points;
                    }
                  }
                }
                // New fish, add to signee.weights
                else {
                  signee.weights.push({
                    name: input.name,
                    weights: 0,
                    points: 0,
                  });
                }
              }
            });
          }
        });

        this.inputs.forEach((input) => {
          // Change only the key names for each fish for biggest_fishes and biggest_amounts, if the name has been changed
          if (input.name !== input.original_name) {
            if (this.competition.biggest_fishes[input.original_name]) {
              delete Object.assign(this.competition.biggest_fishes, {
                [input.name]: this.competition.biggest_fishes[
                  input.original_name
                ],
              })[input.original_name];
            }

            if (this.competition.biggest_amounts[input.original_name]) {
              delete Object.assign(this.competition.biggest_amounts, {
                [input.name]: this.competition.biggest_amounts[
                  input.original_name
                ],
              })[input.original_name];
            }

            // Change the original values to current ones, if the variables gets changed in the future
            input.original_name = input.name;
            input.original_multiplier = input.multiplier;
            input.original_minsize = input.minsize;
          }
        });

        //Update to database, calculate current standings and points in case multipliers have been changed
        this.competition.fishes = this.fish_specs = this.inputs;
        let normal_results = this.calculateNormalResults(this.competition);
        this.competition.normal_points = normal_results.normal_points;
        this.competition.normal_weights = normal_results.normal_weights;
        this.updateCompetition(this.competition);
        this.basic_info_validated = true;
      }
    },
    // Update competition to database
    async updateCompetition(competition) {
      try {
        this.$store.commit("refreshCompetition", competition);
        this.loading = true;
        await CompetitionService.updateCompetition(
          competition._id,
          competition
        );
        this.tab = "show-settings";
      } catch (err) {
        console.error(err.message);
      }
      this.loading = false;
      M.toast({
        html:
          "Tiedot päivitetty tietokantaan, sekä tulokset laskettu uusilla arvoilla!",
      });
    },
    // Delete competition
    async deleteCompetition(id, confirmed) {
      // If user clicked "OK" on confirmation box
      if (confirmed) {
        M.toast({ html: "Poistetaan tietokannasta!" });
        try {
          //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
          await CompetitionService.deleteCompetition(id);
          // Competition deleted, remove it from localstorage and vuex
          this.$store.state.competition = null;
          localStorage.removeItem("competition");
          // Redirect to dashboard
          this.$router.push({ path: "/dashboard" });
        } catch (err) {
          this.error = err.message;
        }
      } else {
        // demos for this -->  https://constkhi.github.io/vue-simple-alert/
        this.$confirm("Oletko varma?", "Poista kilpailu", "question")
          .then((r) => {
            if (r) {
              this.deleteCompetition(id, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
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
      this.signees = this.$store.getters.getFinishedSignees;
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
  },
};
</script>
