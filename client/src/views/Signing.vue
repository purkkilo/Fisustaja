<template>
  <!-- /signing -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.breakpoint.width < 800,
        browser: $vuetify.breakpoint.width >= 800,
        wide: $vuetify.breakpoint.width >= 1200,
      }"
    >
      <v-card
        :dark="$store.getters.getTheme"
        id="errordiv"
        elevation="20"
        v-if="errors.length"
      >
        <v-alert type="error"> Korjaa seuraavat virheet: </v-alert>
        <v-list>
          <v-list-item v-for="(error, index) in errors" v-bind:key="index">
            <v-list-item-icon>
              <v-icon color="red">mdi-alert-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ error }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
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
                <h1 style="margin: 30px">{{ $t("signing") }}</h1>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

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
        <v-tab href="#signing">{{ $t("signing") }}</v-tab>
        <v-tab href="#signees">{{ $t("signees-signed") }}</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- Signing tab -->
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'signing'"
        >
          <v-row v-if="!loading_site">
            <v-col style="margin-top: 20px">
              <v-row v-if="notification">
                <v-col md="8" offset-md="2">
                  <v-alert type="info" class="flow-text">
                    {{ $t(notification) }}
                  </v-alert>
                </v-col>
              </v-row>
              <v-row>
                <v-col offset-md="4" md="4">
                  <p
                    class="flow-text"
                    v-bind:class="{ 'white--text': $store.getters.getTheme }"
                  >
                    {{ $t("signees") }} {{ $t("total") }}:
                    <b>{{ signees.length }}</b>
                  </p>
                </v-col>
              </v-row>
              <!-- Inputs -->
              <v-row id="signing-inputs">
                <v-col>
                  <v-row>
                    <v-col md="3" offset-md="4" class="input-fields">
                      <v-text-field
                        :dark="$store.getters.getTheme"
                        :label="$t('boat-number')"
                        v-model="boat_number"
                        append-outer-icon="add"
                        maxlength="6"
                        @click:append-outer="
                          boat_number > 0 ? boat_number++ : (boat_number = 1)
                        "
                        prepend-icon="remove"
                        @click:prepend="
                          boat_number > 1 ? boat_number-- : (boat_number = 1)
                        "
                        @paste.prevent
                        :counter="6"
                        @keypress="isNumber($event, true)"
                        :rules="number_rules"
                        :loading="loading"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      md="2"
                      offset-md="2"
                      style="margin-top: 20px"
                      v-if="cup"
                    >
                      <v-btn large block color="blue" @click="searchFromCup"
                        ><v-icon>find_replace</v-icon
                        >{{ $t("button.search-cup") }}</v-btn
                      >
                    </v-col>

                    <v-col
                      md="2"
                      :offset-md="cup ? 2 : 4"
                      style="margin-top: 20px"
                    >
                      <v-btn large block color="indigo" @click="searchSelected"
                        ><v-icon>mdi-magnify</v-icon
                        >{{ $t("button.search-signees") }}</v-btn
                      >
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-text-field
                        :dark="$store.getters.getTheme"
                        :label="$t('captain-name')"
                        v-model="captain_name"
                        :maxlength="maxlength"
                        :loading="loading"
                        :counter="maxlength"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-text-field
                        :dark="$store.getters.getTheme"
                        :label="$t('temp-captain-name')"
                        v-model="temp_captain_name"
                        :maxlength="maxlength"
                        :loading="loading"
                        :counter="maxlength"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-text-field
                        :dark="$store.getters.getTheme"
                        :label="$t('locality-team')"
                        v-model="locality"
                        id="locality"
                        :maxlength="maxlength"
                        :loading="loading"
                        :counter="maxlength"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-text-field
                        :dark="$store.getters.getTheme"
                        :label="$t('starting-place')"
                        v-model="starting_place"
                        id="starting_place"
                        :maxlength="maxlength"
                        :loading="loading"
                        :counter="maxlength"
                      />
                    </v-col>
                  </v-row>
                  <!-- Ask team only if isTeamCompetition is true -->
                  <v-row v-if="isTeamCompetition">
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-combobox
                        v-model="team"
                        :items="teams"
                        :label="$t('choose-or-type-team')"
                        chips
                        maxlength="40"
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            :key="JSON.stringify(data.item)"
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            :disabled="data.disabled"
                            @click:close="data.parent.selectItem(data.item)"
                          >
                            <v-avatar class="accent white--text" left
                              ><span>{{
                                data.item.slice(0, 1).toUpperCase()
                              }}</span></v-avatar
                            >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-row v-if="loading">
                      <v-col md="12">
                        <p
                          class="flow-text"
                          v-bind:class="{
                            'white--text': $store.getters.getTheme,
                          }"
                        >
                          {{ $t("saving") }}...
                        </p>
                        <ProgressBarQuery />
                      </v-col>
                    </v-row>

                    <v-row v-else style="margin: 40px">
                      <v-row>
                        <v-col md="4" style="margin-top: 20px">
                          <v-btn
                            large
                            tile
                            color="red"
                            @click="deleteSignee(false, selected_id)"
                            :disabled="!found"
                            :loading="refreshing"
                            ><v-icon>mdi-delete</v-icon
                            >{{ $t("button.delete-signee") }}</v-btn
                          >
                        </v-col>
                        <v-col md="4" style="margin-top: 20px">
                          <v-btn
                            large
                            tile
                            color="yellow"
                            @click="clearInputs"
                            :loading="refreshing"
                            ><v-icon>backspace-reverse-outline</v-icon
                            >{{ $t("button.clear") }}</v-btn
                          >
                        </v-col>
                        <v-col md="4" style="margin-top: 20px">
                          <v-btn
                            large
                            tile
                            color="green"
                            @click="validateInfo"
                            :loading="refreshing"
                            :disabled="
                              refreshing ||
                              !boat_number ||
                              !captain_name ||
                              !temp_captain_name
                            "
                            id="sbtn"
                            ><v-icon>mdi-content-save</v-icon
                            >{{ $t("save") }}</v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-row>
                  </v-row>
                  <v-row>
                    <v-col md="6" offset-md="3">
                      <p
                        class="flow-text"
                        v-if="refreshing"
                        v-bind:class="{
                          'white--text': $store.getters.getTheme,
                        }"
                      >
                        {{ $t("updating") }}...
                      </p>
                    </v-col>
                  </v-row>
                  <v-row style="margin-bottom: 20px">
                    <v-col md="4" offset-md="4">
                      <v-btn
                        v-if="competition_id"
                        id="updatebtn"
                        large
                        block
                        color="blue darken-4"
                        @click="refreshCompetition(competition_id)"
                        class="white--text"
                      >
                        <v-icon>mdi-update</v-icon>{{ $t("button.update") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <!-- Show progressbar if loading -->
            <v-col>
              <h2 v-bind:class="{ 'white--text': $store.getters.getTheme }">
                {{ $t("fetching") }}...
              </h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item
          v-bind:class="{
            inputarea: !$store.getters.getTheme,
            'inputarea-dark': $store.getters.getTheme,
          }"
          :value="'signees'"
        >
          <v-row style="margin-top: 10px; margin-bottom: 10px">
            <v-col>
              <v-row>
                <v-col md="10" offset-md="1">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      <p class="flow-text">{{ $t("signees-signed") }}</p>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span>{{ $t("info-table-click") }}</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        :label="$t('search-signee')"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      @click:row="rowClick"
                      :headers="headers"
                      :items="signees"
                      :search="search"
                    >
                      <template
                        v-for="(h, index) in headers"
                        v-slot:[`header.${h.value}`]="{ header }"
                      >
                        <span :key="index"> {{ $t(header.text) }}</span>
                      </template>
                      <template v-slot:[`item.boat_number`]="{ item }">
                        <v-chip>{{ item.boat_number }}</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
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
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService.js";
import CupService from "../services/CupService";
import Timedate from "../components/layout/Timedate";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import { capitalize_words } from "../shared";

export default {
  name: "Signing",
  components: {
    Timedate,
    ProgressBarQuery,
  },
  data() {
    return {
      dialog: false,
      errors: [],
      tab: null,
      boat_number: null,
      starting_place: null,
      captain_name: null,
      temp_captain_name: null,
      locality: null,
      team: null,
      selected_id: null,
      selected_row: null,
      new_signee: null,
      notification: null,
      loading: false,
      refreshing: false,
      loading_site: false,
      competition_id: null,
      signees: [],
      headers: [
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
        { text: "temp-captain-name", value: "temp_captain_name" },
        { text: "locality-team", value: "locality" },
      ],
      search: "",
      cup: null,
      teams: [],
      maxlength: 40,
      isTeamCompetition: false,
      number_rules: [
        (value) => !isNaN(value || "") || "Ei ole numero!",
        (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
      ],
      timer_refresh: null,
      interval: 60000,
      selectedItem: 2,
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
      found: false,
    };
  },
  mounted() {
    if (localStorage.getItem("competition") != null) {
      const competition = JSON.parse(localStorage.getItem("competition"));
      this.competition_id = competition["_id"];
      this.loading_site = true;
      this.refreshCompetition(this.competition_id);
    }
  },
  methods: {
    // Select row from table, if selected --> unselect
    // selected_id bound to selected css class (on App.vue)
    rowClick(item, row) {
      this.selected_id = item._id;
      this.selected_row = row;
      this.searchSelected();
    },
    // Fetch competition from database, and update variables
    async refreshCompetition(competition_id) {
      this.refreshing = true;
      try {
        //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works)
        let competition = await CompetitionService.getCompetitions({
          _id: competition_id,
        });
        if (competition) {
          // Get results === signees
          await ResultService.getResults({ competition_id: competition._id })
            .then((r) => {
              competition.signees = r;
              this.signees = r.sort((a, b) => a.boat_number - b.boat_number);
            })
            .catch((e) => {
              console.log(e);
            });
          // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
          this.$store.commit("refreshCompetition", competition);
          this.isTeamCompetition = this.$store.getters.isTeamCompetition;

          this.teams = this.$store.getters.getTeams;
          // Get max values and assign them
          if (this.signees.length) {
            this.boat_number =
              Math.max.apply(
                Math,
                this.signees.map(function (o) {
                  return o.boat_number;
                })
              ) + 1;
          } else {
            // Otherwise init with 1
            this.boat_number = 1;
          }

          if (competition.isCupCompetition) {
            this.cup = await CupService.getCups({
              _id: competition.cup_id,
            });
          }
        } else {
          console.log("No competition found on database...");
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading_site = false;
      this.refreshing = false;
    },
    // Check if input value is number, and only accept numbers to inputs
    isNumber(evt) {
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
    // Clear all selections and inputs and errors
    clearInputs() {
      this.boat_number = null;
      this.starting_place = null;
      this.captain_name = null;
      this.temp_captain_name = null;
      this.locality = null;
      this.team = null;
      this.errors = [];
      this.found = false;
      this.notification = "";
    },
    // Handle overwriting user data based on user answer
    overwriteSignee(signee, overwrite) {
      // User chose to overwrite data
      if (overwrite) {
        // Remove old data
        this.$store.commit("removeSignee", signee);
        // Replace the old existing signee info with new info, without changing the id
        signee.boat_number = parseInt(this.boat_number);
        signee.starting_place = this.starting_place;
        signee.captain_name = capitalize_words(this.captain_name);
        signee.temp_captain_name = capitalize_words(this.temp_captain_name);
        signee.locality = capitalize_words(this.locality);
        signee.team = this.team;
        // Shorten team name if over 40 characters
        if (this.team.length > 40) {
          let temp_team = this.team;
          temp_team = temp_team.slice(0, 40);
          this.team = temp_team; // Set the name back, shortened
          this.showError(
            "Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin)!"
          );
        } else {
          //If the array doensn't have the team name already, add it
          if (this.teams.indexOf(this.team) == -1) {
            this.teams.push(this.team);
            this.$store.commit("setTeams", this.teams);
          }
          // Save signee to database and clear inputs
          this.saveToDatabase(signee, true);
          this.clearInputs();
          this.notification = "notification.replaced";
        }
      }
      // Don't overwrite, add to new place
      else {
        this.notification = "notification.boat-number-moved";
        this.boat_number =
          Math.max.apply(
            Math,
            this.signees.map(function (o) {
              return o.boat_number;
            })
          ) + 1;
      }
    },
    // If user selected from input/table, search from array and assing values to inputs
    searchSelected() {
      this.notification = null;
      this.errors = [];
      // Searched from Signing tab, from button
      if (this.tab === "signing") {
        if (this.boat_number) {
          let found_signee = this.searchBoatNumber(this.boat_number);
          // If signee found
          if (found_signee) {
            this.found = true;
            this.notification = `(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
            this.selected_id = found_signee._id;
            this.boat_number = found_signee.boat_number;
            this.starting_place = found_signee.starting_place;
            this.captain_name = found_signee.captain_name;
            this.temp_captain_name = found_signee.temp_captain_name;
            this.locality = found_signee.locality;
            this.team = found_signee.team;
          } else {
            // Nothing found
            let temp_boat_number = this.boat_number;
            this.clearInputs();
            this.boat_number = temp_boat_number;
            this.notification = "notification.no-signee-found";
            this.selected_id = null;
          }
        } else {
          this.notification = `notification.empty-boat-number`;
        }
      } else {
        // Searched from Signees tab (this.tab === 'signees'), from table
        if (this.selected_id) {
          var found_signee = this.signees.find(
            (s) => this.selected_id === s._id
          );

          if (found_signee) {
            this.notification = `(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
            this.boat_number = found_signee.boat_number;
            this.starting_place = found_signee.starting_place;
            this.captain_name = found_signee.captain_name;
            this.temp_captain_name = found_signee.temp_captain_name;
            this.locality = found_signee.locality;
            this.team = found_signee.team;
            this.tab = "signing";
          } else {
            // Nothing found
            let temp_boat_number = this.boat_number;
            this.clearInputs();
            this.boat_number = temp_boat_number;
            this.notification = "notification.no-signee-found";
            this.selected_id = null;
          }
        }
      }
    },
    async searchFromCup() {
      this.selected_id = null;
      if (this.boat_number) {
        let found_signee = this.cup.signees.find(
          (signee) => this.boat_number === signee.boat_number
        );
        //If the signee is not found on cup, add it
        if (found_signee) {
          this.notification = "notification.found-from-cup";
          this.captain_name = found_signee.captain_name;
          this.temp_captain_name = found_signee.temp_captain_name;
          this.locality = found_signee.locality;
          this.team = found_signee.team;
          this.starting_place = found_signee.starting_place;

          let f = this.signees.find(
            (s) => s.boat_number === found_signee.boat_number
          );
          if (f) {
            this.found = true;
            this.selected_id = f._id;
          }
        } else {
          // Nothing found
          let temp_boat_number = this.boat_number;
          this.clearInputs();
          this.boat_number = temp_boat_number;
          this.notification = "notification.no-signee-found";
        }
      } else {
        this.notification = "notification.empty-boat-number";
      }
    },
    // Fetch signee from vuex based on boat number
    // Check client\src\store\index.js for implementation
    searchBoatNumber(boat_number) {
      return this.$store.getters.getSigneeByBoatNumber(parseInt(boat_number));
    },
    // Utility function for showing error
    showError(error) {
      this.errors.push(error);
      location.href = "#";
      location.href = "#app";
    },
    // Save signee to database
    async saveToDatabase(new_signee, replace) {
      // if replace == true, replace existing info, otherwise add new signee
      if (replace) this.$store.commit("replaceSignee", new_signee);

      // Create competition object
      let comp = this.$store.getters.getCompetition;
      this.signees = this.results = this.signees;
      // Store to vuex
      comp.signees = this.signees;
      comp.state = "Ilmoittautuminen";

      if (comp.isCupCompetition) {
        let index = this.cup.signees.findIndex(
          (signee) => new_signee.boat_number === signee.boat_number
        );
        //If the signee is not found on cup, add it
        if (index === -1) {
          this.cup.signees.push({
            boat_number: new_signee.boat_number,
            captain_name: new_signee.captain_name,
            temp_captain_name: new_signee.temp_captain_name,
            locality: new_signee.locality,
            competition_id: comp._id,
          });
          // Update signees to cup
          let newvalues = {
            $set: { signees: this.cup.signees },
          };
          await CupService.updateValues(comp.cup_id, newvalues);
        } else {
          // First competition for the signee, so update cup values
          if (this.cup.signees[index].competition_id === comp._id) {
            this.cup.signees[index] = {
              ...new_signee,
              competition_id: comp._id,
            };

            // Update signees to cup
            let newvalues = {
              $set: { signees: this.cup.signees },
            };
            await CupService.updateValues(comp.cup_id, newvalues);
          }
        }
      }

      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        // Add result
        new_signee = {
          ...new_signee,
          competition_id: comp._id,
          cup_id: comp.cup_id,
        };

        if (replace) {
          await ResultService.updateResult(new_signee._id, new_signee);
        } else {
          let res = await ResultService.insertResults([new_signee]);
          new_signee._id = res.data.id;
          this.$store.commit("addSignee", new_signee);
        }

        //await CompetitionService.updateCompetition(comp._id, comp);
        await CompetitionService.updateValues(comp._id, { state: comp.state });
        this.loading = false;

        this.boat_number =
          Math.max.apply(
            Math,
            this.signees.map(function (o) {
              return o.boat_number;
            })
          ) + 1;
      } catch (err) {
        console.error(err.message);
      }
    },
    // Delete signee from vuex and database
    async deleteSignee(confirmed, id) {
      this.errors = [];
      // If id on signees
      let found_signee = this.signees.find((s) => s._id === id);

      if (!confirmed) {
        if (!this.boat_number) {
          this.showError("Venekunnan kilpailunumero puuttuu!");
        }
        if (!this.errors.length) {
          // If selected on the signees list or with the search button
          if (id) {
            if (found_signee) {
              // Ask confirmation
              this.$confirm(
                `Oletko varma että haluat poistaa kilpailijan: (${found_signee.boat_number}), ${found_signee.captain_name}?`,
                "Poista kilpailija",
                "question"
              )
                .then((r) => {
                  if (r) {
                    // Deletion confirmed by user, call function again with confirmed == true
                    this.deleteSignee(r, found_signee._id);
                  }
                })
                .catch((error) => {
                  if (error) {
                    console.error(error);
                  }
                });
            }
          } else {
            // No selected id, so new input
            let temp_boat = this.searchBoatNumber(this.boat_number);
            if (temp_boat) {
              this.$confirm(
                `Oletko varma että haluat poistaa kilpailijan: (${temp_boat.boat_number}), ${temp_boat.captain_name}?`,
                "Poista kilpailija",
                "question"
              )
                .then((r) => {
                  if (r) {
                    // Deletion confirmed by user, call function again with confirmed == true
                    this.deleteSignee(r, temp_boat._id);
                  }
                })
                .catch((error) => {
                  if (error) {
                    console.error(error);
                  }
                });
            }
          }
        }
      }
      // Deletion confirmed, delete signee
      else {
        if (found_signee) {
          // Remove from vuex
          this.$store.commit("removeSignee", found_signee);
          try {
            this.loading = true;
            await ResultService.deleteResult(id).catch((e) => console.log(e));
            this.loading = false;
            this.clearInputs();
            // Update values for next signee
            this.boat_number =
              Math.max.apply(
                Math,
                this.signees.map(function (o) {
                  return o.boat_number;
                })
              ) + 1;
            this.text = `Poistettu (Nro: ${found_signee.boat_number}, Kippari: ${found_signee.captain_name}) Tiedot!`;
            this.snackbar = true;
            location.href = "#";
            location.href = "#signing";
          } catch (err) {
            console.log(err.message);
          }
        } else {
          console.log("Tällä id:llä ei löytynyt kilpailijaa...");
        }
      }
    },
    // TODO serverside input validation
    validateInfo() {
      this.notification = null;
      this.errors = [];

      // Check all the inputs
      if (!this.boat_number) {
        this.showError("Venekunnan kilpailunumero puuttuu!");
      }

      if (!this.captain_name) {
        this.showError("Kipparin nimi puuttuu!");
      } else {
        this.captain_name = capitalize_words(this.captain_name);
      }

      if (!this.temp_captain_name) {
        this.temp_captain_name = "-";
      } else {
        this.temp_captain_name = capitalize_words(this.temp_captain_name);
      }

      if (!this.starting_place) {
        this.starting_place = "-";
      }
      if (!this.team) {
        this.team = "-";
      }

      if (this.team.length > 40) {
        let temp_team = this.team;
        temp_team = temp_team.slice(0, 40);
        this.team = temp_team; // Set the name back, shortened
        this.showError(
          "Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin, valittavissa pudotusvalikosta)!"
        );
      }

      if (!this.locality) {
        this.showError("Seura/Paikkakunta puuttuu!");
      } else {
        this.locality = capitalize_words(this.locality);
      }

      // If no errors, proceed
      if (!this.errors.length) {
        // If selected on the signees list or with the search button
        if (this.selected_id) {
          // If id on signees
          let found_signee = this.signees.find(
            (s) => s._id === this.selected_id
          );
          if (found_signee) {
            // If there already exist a boat with same number, but it isn't the same id
            // If there isn't any boats with this boat number
            found_signee.boat_number = parseInt(this.boat_number);
            found_signee.starting_place = this.starting_place;
            found_signee.captain_name = this.captain_name;
            found_signee.temp_captain_name = this.temp_captain_name;
            found_signee.locality = this.locality;
            found_signee.team = this.team;
            this.new_signee = found_signee;
            // Save to database and vuex
            this.saveToDatabase(this.new_signee, true);
            if (this.teams.indexOf(this.team) == -1) {
              this.teams.push(this.team);
              this.$store.commit("setTeams", this.teams);
            }
            this.text = `Päivitetty venekunnan (Nro: ${this.new_signee.boat_number}, Kippari: ${this.new_signee.captain_name}) Tiedot!`;
            this.snackbar = true;
            this.clearInputs();
            location.href = "#";
            location.href = "#signing";
            // Update values for next signee
            this.boat_number =
              Math.max.apply(
                Math,
                this.signees.map(function (o) {
                  return o.boat_number;
                })
              ) + 1;

            this.selected_id = null;
          }
        } else {
          // Create signee object and save to database/vuex
          this.new_signee = {
            boat_number: parseInt(this.boat_number),
            starting_place: this.starting_place,
            captain_name: this.captain_name,
            temp_captain_name: this.temp_captain_name,
            locality: this.locality,
            team: this.team,
            returned: false,
          };
          this.saveToDatabase(this.new_signee, false);

          if (this.teams.indexOf(this.team) == -1) {
            this.teams.push(this.team);
            this.$store.commit("setTeams", this.teams);
          }
          this.text = `Venekunta ilmoitettu kisaan! (Nro: ${this.new_signee.boat_number}, Kippari: ${this.new_signee.captain_name})`;
          this.snackbar = true;

          this.clearInputs();
          location.href = "#";
          location.href = "#signing";
          // Update values for next signee
          this.boat_number =
            Math.max.apply(
              Math,
              this.signees.map(function (o) {
                return o.boat_number;
              })
            ) + 1;
          this.selected_id = null;
        }
      }
    },
  },
};
</script>
<style>
#old-info-container {
  border: 1px solid black;
}

#new-info-container {
  border: 1px solid black;
}
</style>
