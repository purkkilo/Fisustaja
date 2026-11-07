<template>
  <!-- /signing -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <Timedate />

    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <error-list :errors="errors"></error-list>
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row class="justify-center">
              <v-col>
                <h1 style="margin: 30px">{{ $t("signing") }}</h1>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>

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
        <v-tab value="signing">{{ $t("signing") }}</v-tab>
        <v-tab value="signees">{{ $t("signees-signed") }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <!-- Signing tab -->
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
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
                    v-bind:class="{ 'text-white': store.getTheme }"
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
                        :label="$t('boat-number')"
                        v-model="boat_number"
                        append-icon="mdi-plus"
                        maxlength="6"
                        @click:append="
                          boat_number > 0 ? boat_number++ : (boat_number = 1)
                        "
                        prepend-icon="mdi-minus"
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
                      <v-btn
                        block
                        color="blue"
                        @click="searchFromCup"
                        size="large"
                        ><v-icon>find_replace</v-icon
                        >{{ $t("button.search-cup") }}</v-btn
                      >
                    </v-col>

                    <v-col
                      md="2"
                      :offset-md="cup ? 2 : 4"
                      style="margin-top: 20px"
                    >
                      <v-btn
                        block
                        color="indigo"
                        @click="searchSelected"
                        size="large"
                        ><v-icon>mdi-magnify</v-icon
                        >{{ $t("button.search-signees") }}</v-btn
                      >
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col md="5" offset-md="3" class="input-fields">
                      <v-text-field
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
                        <template v-slot:chip="{ item, props }">
                          <v-chip v-bind="props">
                            <v-avatar class="bg-accent text-white" start>{{
                              String(item).slice(0, 1).toUpperCase()
                            }}</v-avatar>
                            {{ item }}
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
                            'text-white': store.getTheme,
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
                            tile
                            color="red"
                            @click="deleteSignee(false, selected_id)"
                            :disabled="!found"
                            :loading="refreshing"
                            size="large"
                            ><v-icon>mdi-delete</v-icon
                            >{{ $t("button.delete-signee") }}</v-btn
                          >
                        </v-col>
                        <v-col md="4" style="margin-top: 20px">
                          <v-btn
                            tile
                            color="yellow"
                            @click="clearInputs"
                            :loading="refreshing"
                            size="large"
                            ><v-icon>backspace-reverse-outline</v-icon
                            >{{ $t("button.clear") }}</v-btn
                          >
                        </v-col>
                        <v-col md="4" style="margin-top: 20px">
                          <v-btn
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
                            size="large"
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
                          'text-white': store.getTheme,
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
                        block
                        color="blue-darken-4"
                        @click="refreshCompetition(competition_id)"
                        class="text-white"
                        size="large"
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
              <h2 v-bind:class="{ 'text-white': store.getTheme }">
                {{ $t("fetching") }}...
              </h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
        </v-window-item>
        <v-window-item
          v-bind:class="{
            inputarea: !store.getTheme,
            'inputarea-dark': store.getTheme,
          }"
          :value="'signees'"
        >
          <v-row style="margin-top: 10px; margin-bottom: 10px">
            <v-col>
              <v-row>
                <v-col md="10" offset-md="1">
                  <v-card>
                    <v-card-title class="d-flex flex-wrap align-center">
                      <p class="flow-text">{{ $t("signees-signed") }}</p>
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            style="margin: 0px 0px 20px 5px"
                            >mdi-chat-question-outline</v-icon
                          >
                        </template>
                        <span>{{ $t("info-table-click") }}</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="search"
                        append-inner-icon="mdi-magnify"
                        :label="$t('search-signee')"
                        single-line
                        hide-details
                      ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      @click:row="rowClick"
                      :headers="tableHeaders(headers)"
                      :items="signees"
                      :search="search"
                    >
                      <template
                        v-for="(h, index) in headers"
                        v-slot:[`header.${h.value}`]="{ column: header }"
                      >
                        <span> {{ $t(header.text) }}</span>
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
        </v-window-item>
      </v-window>
    </v-container>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </div>
</template>
<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { nextTick, onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { alert, confirm } from "@/plugins/alerts";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService.js";
import CupService from "../services/CupService";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import { capitalize_words, isNumber } from "@/utils/format";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

defineOptions({ name: "Signing" });
const store = useMainStore();

const dialog = ref(false);
const errors = ref([]);
const tab = ref(null);
const boat_number = ref(null);
const starting_place = ref(null);
const captain_name = ref(null);
const temp_captain_name = ref(null);
const locality = ref(null);
const team = ref(null);
const selected_id = ref(null);
const selected_row = ref(null);
const new_signee = ref(null);
const notification = ref(null);
const loading = ref(false);
const refreshing = ref(false);
const loading_site = ref(false);
const competition_id = ref(null);
const signees = ref([]);
const headers = ref([
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "temp-captain-name", value: "temp_captain_name" },
  { text: "locality-team", value: "locality" },
]);
const search = ref("");
const cup = ref(null);
const teams = ref([]);
const maxlength = ref(40);
const isTeamCompetition = ref(false);
const number_rules = ref([
  (value) => !isNaN(value || "") || "Ei ole numero!",
  (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
]);
const timer_refresh = ref(null);
const interval = ref(60000);
const snackbar = ref(false);
const text = ref("");
const found = ref(false);
const notification_info = ref(null);
const results = ref(null);

// Select row from table, if selected --> unselect
// selected_id bound to selected css class (on App.vue)
// Vuetify 3+: (event, { item, internalItem, index })

function rowClick(event, row) {
  const item = row.item;
  selected_id.value = item._id;
  selected_row.value = row;
  searchSelected();
}

// Fetch competition from database, and update variables

async function refreshCompetition(competition_id) {
  refreshing.value = true;
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
          signees.value = r.sort((a, b) => a.boat_number - b.boat_number);
        })
        .catch((e) => {
          console.log(e);
        });
      // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
      store.refreshCompetition(competition);
      isTeamCompetition.value = store.isTeamCompetition;

      teams.value = store.getTeams;
      // Get max values and assign them
      if (signees.value.length) {
        boat_number.value =
          Math.max.apply(
            Math,
            signees.value.map(function (o) {
              return o.boat_number;
            }),
          ) + 1;
      } else {
        // Otherwise init with 1
        boat_number.value = 1;
      }

      if (competition.isCupCompetition) {
        cup.value = await CupService.getCups({
          _id: competition.cup_id,
        });
      }
    } else {
      console.log("No competition found on database...");
    }
  } catch (err) {
    console.log(err.message);
  }
  loading_site.value = false;
  refreshing.value = false;
}

// Clear all selections and inputs and errors

function clearInputs() {
  boat_number.value = null;
  starting_place.value = null;
  captain_name.value = null;
  temp_captain_name.value = null;
  locality.value = null;
  team.value = null;
  errors.value = [];
  found.value = false;
  notification.value = "";
}

// Handle overwriting user data based on user answer

function overwriteSignee(signee, overwrite) {
  // User chose to overwrite data
  if (overwrite) {
    // Remove old data
    store.removeSignee(signee);
    // Replace the old existing signee info with new info, without changing the id
    signee.boat_number = parseInt(boat_number.value);
    signee.starting_place = starting_place.value;
    signee.captain_name = capitalize_words(captain_name.value);
    signee.temp_captain_name = capitalize_words(temp_captain_name.value);
    signee.locality = capitalize_words(locality.value);
    signee.team = team.value;
    // Shorten team name if over 40 characters
    if (team.value.length > 40) {
      let temp_team = team.value;
      temp_team = temp_team.slice(0, 40);
      team.value = temp_team; // Set the name back, shortened
      showError(
        "Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin)!",
      );
    } else {
      //If the array doensn't have the team name already, add it
      if (teams.value.indexOf(team.value) == -1) {
        teams.value.push(team.value);
        store.setTeams(teams.value);
      }
      // Save signee to database and clear inputs
      saveToDatabase(signee, true);
      clearInputs();
      notification.value = "notification.replaced";
    }
  }
  // Don't overwrite, add to new place
  else {
    notification.value = "notification.boat-number-moved";
    boat_number.value =
      Math.max.apply(
        Math,
        signees.value.map(function (o) {
          return o.boat_number;
        }),
      ) + 1;
  }
}

// If user selected from input/table, search from array and assing values to inputs

function searchSelected() {
  notification.value = null;
  errors.value = [];
  // Searched from Signing tab, from button
  if (tab.value === "signing") {
    if (boat_number.value) {
      let found_signee = searchBoatNumber(boat_number.value);
      // If signee found
      if (found_signee) {
        found.value = true;
        notification.value = `notification.found-from-cup`;
        selected_id.value = found_signee._id;
        boat_number.value = found_signee.boat_number;
        starting_place.value = found_signee.starting_place;
        captain_name.value = found_signee.captain_name;
        temp_captain_name.value = found_signee.temp_captain_name;
        locality.value = found_signee.locality;
        team.value = found_signee.team;
      } else {
        // Nothing found
        let temp_boat_number = boat_number.value;
        clearInputs();
        boat_number.value = temp_boat_number;
        notification.value = "notification.no-signee-found";
        selected_id.value = null;
      }
    } else {
      notification.value = `notification.empty-boat-number`;
    }
  } else {
    // Searched from Signees tab (this.tab === 'signees'), from table
    if (selected_id.value) {
      var found_signee = signees.value.find((s) => selected_id.value === s._id);

      if (found_signee) {
        notification.value = `notification.found-from-cup`;
        boat_number.value = found_signee.boat_number;
        starting_place.value = found_signee.starting_place;
        captain_name.value = found_signee.captain_name;
        temp_captain_name.value = found_signee.temp_captain_name;
        locality.value = found_signee.locality;
        team.value = found_signee.team;
        tab.value = "signing";
      } else {
        // Nothing found
        let temp_boat_number = boat_number.value;
        clearInputs();
        boat_number.value = temp_boat_number;
        notification.value = "notification.no-signee-found";
        selected_id.value = null;
        notification_info.value = "";
      }
    }
  }
}

async function searchFromCup() {
  selected_id.value = null;
  // text input so parse to int, never vuetify would have number inputs
  let _boat_number = parseInt(boat_number.value);
  if (!isNaN(_boat_number) && cup.value && cup.value.signees.length) {
    let found_signee = cup.value.signees.find(
      (signee) => _boat_number === signee.boat_number,
    );
    //If the signee is not found on cup, add it
    if (found_signee) {
      notification.value = "notification.found-from-cup";
      captain_name.value = found_signee.captain_name;
      temp_captain_name.value = found_signee.temp_captain_name;
      locality.value = found_signee.locality;
      team.value = found_signee.team;
      starting_place.value = found_signee.starting_place;

      let f = signees.value.find(
        (s) => s.boat_number === found_signee.boat_number,
      );
      if (f) {
        found.value = true;
        selected_id.value = f._id;
      }
    } else {
      // Nothing found
      let temp_boat_number = boat_number.value;
      clearInputs();
      boat_number.value = temp_boat_number;
      notification.value = "notification.no-signee-found";
    }
  } else {
    notification.value = "notification.empty-boat-number";
  }
}

// Fetch signee from vuex based on boat number
// Check client\src\store\index.js for implementation

function searchBoatNumber(boat_number) {
  return store.getSigneeByBoatNumber(parseInt(boat_number));
}

// Add error to error array and direct user to it

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    document.getElementById("error-list").scrollIntoView();
  });
}

// Save signee to database

async function saveToDatabase(new_signee, replace) {
  // if replace == true, replace existing info, otherwise add new signee
  if (replace) store.replaceSignee(new_signee);

  // Create competition object
  let comp = store.getCompetition;
  signees.value = results.value = signees.value;
  // Store to vuex
  comp.signees = signees.value;
  comp.state = "signing";

  if (comp.isCupCompetition) {
    let index = cup.value.signees.findIndex(
      (signee) => new_signee.boat_number === signee.boat_number,
    );
    //If the signee is not found on cup, add it
    if (index === -1) {
      cup.value.signees.push({
        boat_number: new_signee.boat_number,
        captain_name: new_signee.captain_name,
        temp_captain_name: new_signee.temp_captain_name,
        locality: new_signee.locality,
        competition_id: comp._id,
      });
      // Update signees to cup
      let newvalues = {
        $set: { signees: cup.value.signees },
      };
      await CupService.updateValues(comp.cup_id, newvalues);
    } else {
      // First competition for the signee, so update cup values
      if (cup.value.signees[index].competition_id === comp._id) {
        cup.value.signees[index] = {
          ...new_signee,
          competition_id: comp._id,
        };

        // Update signees to cup
        let newvalues = {
          $set: { signees: cup.value.signees },
        };
        await CupService.updateValues(comp.cup_id, newvalues);
      }
    }
  }

  store.refreshCompetition(comp);
  try {
    loading.value = true;
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
      store.addSignee(new_signee);
    }

    //await CompetitionService.updateCompetition(comp._id, comp);
    await CompetitionService.updateValues(comp._id, { state: comp.state });
    loading.value = false;

    boat_number.value =
      Math.max.apply(
        Math,
        signees.value.map(function (o) {
          return o.boat_number;
        }),
      ) + 1;
  } catch (err) {
    console.error(err.message);
  }
}

// Delete signee from vuex and database

async function deleteSignee(confirmed, id) {
  errors.value = [];
  // If id on signees
  let found_signee = signees.value.find((s) => s._id === id);

  if (!confirmed) {
    if (!boat_number.value) {
      showError("Venekunnan kilpailunumero puuttuu!");
    }
    if (!errors.value.length) {
      // If selected on the signees list or with the search button
      if (id) {
        if (found_signee) {
          // Ask confirmation
          confirm(
            `Oletko varma että haluat poistaa kilpailijan: (${found_signee.boat_number}), ${found_signee.captain_name}?`,
            "Poista kilpailija",
            "question",
          )
            .then((r) => {
              if (r) {
                // Deletion confirmed by user, call function again with confirmed == true
                deleteSignee(r, found_signee._id);
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
        let temp_boat = searchBoatNumber(boat_number.value);
        if (temp_boat) {
          confirm(
            `Oletko varma että haluat poistaa kilpailijan: (${temp_boat.boat_number}), ${temp_boat.captain_name}?`,
            "Poista kilpailija",
            "question",
          )
            .then((r) => {
              if (r) {
                // Deletion confirmed by user, call function again with confirmed == true
                deleteSignee(r, temp_boat._id);
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
      store.removeSignee(found_signee);
      try {
        loading.value = true;
        await ResultService.deleteResult(id).catch((e) => console.log(e));
        loading.value = false;
        clearInputs();
        // Update values for next signee
        boat_number.value =
          Math.max.apply(
            Math,
            signees.value.map(function (o) {
              return o.boat_number;
            }),
          ) + 1;
        text.value = `boat-removed`;
        snackbar.value = true;
        location.href = "#";
        location.href = "#signing";
      } catch (err) {
        console.log(err.message);
      }
    } else {
      console.log("Tällä id:llä ei löytynyt kilpailijaa...");
    }
  }
}

// TODO serverside input validation

function validateInfo() {
  notification.value = null;
  errors.value = [];

  // Check all the inputs
  if (!boat_number.value) {
    showError("Venekunnan kilpailunumero puuttuu!");
  }

  if (!captain_name.value) {
    showError("Kipparin nimi puuttuu!");
  } else {
    captain_name.value = capitalize_words(captain_name.value);
  }

  if (!temp_captain_name.value) {
    temp_captain_name.value = "-";
  } else {
    temp_captain_name.value = capitalize_words(temp_captain_name.value);
  }

  if (!starting_place.value) {
    starting_place.value = "-";
  }
  if (!team.value) {
    team.value = "-";
  }

  if (team.value.length > 40) {
    let temp_team = team.value;
    temp_team = temp_team.slice(0, 40);
    team.value = temp_team; // Set the name back, shortened
    showError(
      "Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin, valittavissa pudotusvalikosta)!",
    );
  }

  if (!locality.value) {
    showError("Seura/Paikkakunta puuttuu!");
  } else {
    locality.value = capitalize_words(locality.value);
  }

  // If no errors, proceed
  if (!errors.value.length) {
    // If selected on the signees list or with the search button
    if (selected_id.value) {
      // If id on signees
      let found_signee = signees.value.find((s) => s._id === selected_id.value);
      if (found_signee) {
        // If there already exist a boat with same number, but it isn't the same id
        // If there isn't any boats with this boat number
        found_signee.boat_number = parseInt(boat_number.value);
        found_signee.starting_place = starting_place.value;
        found_signee.captain_name = captain_name.value;
        found_signee.temp_captain_name = temp_captain_name.value;
        found_signee.locality = locality.value;
        found_signee.team = team.value;
        new_signee.value = found_signee;
        // Save to database and vuex
        saveToDatabase(new_signee.value, true);
        if (teams.value.indexOf(team.value) == -1) {
          teams.value.push(team.value);
          store.setTeams(teams.value);
        }
        text.value = `boat-updated`;
        snackbar.value = true;
        clearInputs();
        location.href = "#";
        location.href = "#signing";
        // Update values for next signee
        boat_number.value =
          Math.max.apply(
            Math,
            signees.value.map(function (o) {
              return o.boat_number;
            }),
          ) + 1;

        selected_id.value = null;
      }
    } else {
      // Create signee object and save to database/vuex
      new_signee.value = {
        boat_number: parseInt(boat_number.value),
        starting_place: starting_place.value,
        captain_name: captain_name.value,
        temp_captain_name: temp_captain_name.value,
        locality: locality.value,
        team: team.value,
        returned: false,
      };
      saveToDatabase(new_signee.value, false);

      if (teams.value.indexOf(team.value) == -1) {
        teams.value.push(team.value);
        store.setTeams(teams.value);
      }

      text.value = `boat-added`;
      snackbar.value = true;

      clearInputs();
      location.href = "#";
      location.href = "#signing";
      // Update values for next signee
      boat_number.value =
        Math.max.apply(
          Math,
          signees.value.map(function (o) {
            return o.boat_number;
          }),
        ) + 1;
      selected_id.value = null;
    }
  }
}

onMounted(() => {
  if (localStorage.getItem("competition") != null) {
    const competition = JSON.parse(localStorage.getItem("competition"));
    competition_id.value = competition["_id"];
    loading_site.value = true;
    refreshCompetition(competition_id.value);
  }
});
</script>
<style>
#old-info-container {
  border: 1px solid black;
}

#new-info-container {
  border: 1px solid black;
}
</style>
