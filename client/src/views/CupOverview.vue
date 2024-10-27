<template>
  <!-- /cup-overview -->
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
        <v-dialog v-model="dialog" width="500">
          <v-card :dark="$store.getters.getTheme">
            <v-card-title> Pdf {{ $t("settings") }} </v-card-title>
            <v-card-text>
              <v-checkbox
                :label="$t('pdf-landscape')"
                v-model="isLandscape"
              ></v-checkbox>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="yellow" text @click="dialog = false">
                Peruuta
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="pdfWrapper(`Ilmoittautuneet`)"
              >
                {{ $t("download") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row justify="center" align="center">
          <v-col v-if="!loading && cup">
            <h1>{{ cup.name }}, {{ cup.year }}</h1>
          </v-col>
          <v-col v-else
            ><h1>{{ $t("downloading") }}..</h1></v-col
          >
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
          <v-tab href="#overview">{{ $t("overview") }}</v-tab>
          <v-tab href="#points" :disabled="!competitions.length">{{
            $t("point-status")
          }}</v-tab>
          <v-tab href="#stats" :disabled="!competitions.length">{{
            $t("general-statistics")
          }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
          <v-tab-item :value="'overview'">
            <v-row v-if="loading">
              <v-col>
                <h2 class="white--text">{{ $t("preparing-cup") }}...</h2>
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
                  {{ $t("errors.no-cup-selected") }}
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
                >
                  <template v-slot:item="{ item }">
                    <span>{{ $t(item) }}</span>
                  </template>
                  <template v-slot:selection="{ item }">
                    <span>{{ $t(item) }}</span>
                  </template></v-select
                >
              </v-col>
            </v-row>
            <v-row justify="center" v-if="selected === 'signees-signed'">
              <v-btn
                @click="dialog = true"
                large
                outlined
                dark
                color="red"
                :loading="publishing || loading"
                :disabled="!cup.signees.length"
                ><v-icon>mdi-file-pdf-box</v-icon>
                {{ $t("download-signees") }}</v-btn
              ></v-row
            >
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
                      {{ $t(selected) }}
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-icon="mdi-magnify"
                      :label="$t('search')"
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
                    <template
                      v-for="(h, index) in selected_headers"
                      v-slot:[`header.${h.value}`]="{ header }"
                    >
                      <span :key="index"> {{ $t(header.text) }}</span>
                    </template>
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary darken-2">{{
                        formatDateToLocaleDateString(item.start_date)
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
                            >{{
                              item.isFinished ? $t("yes") : $t("no")
                            }}</v-chip
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
                              item.isPublic ? $t("public") : $t("private")
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
                        <span>{{ $t("comp.to") }}</span>
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
                              >{{ $t("modify") }} ({{
                                $t("boat-number-short")
                              }}
                              {{ item.boat_number }}) {{ $t("cup.normal") }}
                              {{ $t("information") }}</span
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
                                      {{ $t("errors.fix-text") }}:
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
                                    :label="$t('captain-name') + '*'"
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
                                    :label="$t('temp-captain-name')"
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
                                    :label="$t('locality') + '*'"
                                    maxlength="40"
                                    counter="40"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                              <small>*{{ $t("must-fields") }}</small>
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
            <v-row v-if="!loading && cup && selected == 'signees-signed'">
              <v-col>
                <v-btn
                  @click="createSigneeDialog = true"
                  large
                  outlined
                  dark
                  :loading="publishing || loading"
                  ><v-icon color="green">mdi-plus</v-icon>{{ $t("add") }}</v-btn
                >
                <v-dialog v-model="createSigneeDialog" width="500">
                  <v-card :dark="$store.getters.getTheme">
                    <v-card-title>
                      {{ $t("add") }} {{ $t("signee") }}</v-card-title
                    >
                    <v-card-text>
                      <h3 v-if="signeeError" class="red--text">
                        {{ $t(signeeError) }}
                      </h3>
                      <v-text-field
                        :label="$t('boat-number')"
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
                        :label="$t('captain-name')"
                        v-model="signeeCaptain"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('temp-captain-name')"
                        v-model="signeeTempCaptain"
                      ></v-text-field>
                      <v-text-field
                        :label="$t('locality-team')"
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
                        {{ $t("cancel") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="addSignee">
                        {{ $t("add") }}
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
                  color="green lighten-1"
                  outlined
                  :loading="publishing || loading"
                  @click="changePage('/register-comp')"
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-new-comp") }}</v-btn
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
                    <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
                  </div>
                  <div v-else>
                    <v-icon color="green">mdi-publish</v-icon
                    >{{ $t("button.set-public") }}
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
                  pdfWrapper(`Tulokset`);
                }
              "
              @sort="
                (show) => {
                  showUnfinishedCompetitions = show;
                  setCompetitionData(cup);
                }
              "
            ></cup-points>
          </v-tab-item>
          <v-tab-item :value="'stats'">
            <cup-stats
              :competitions="competitions"
              :cup="cup"
              :all_signees="all_signees"
              :biggest_fishes="biggest_fishes"
              :biggest_amounts="biggest_amounts"
              :loading="loading"
            ></cup-stats>
          </v-tab-item>
        </v-tabs-items>
        <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import CupService from "../services/CupService";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import "jspdf-autotable";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import {
  capitalize_words,
  sortBy,
  getMultiplierColor,
  formatDateToLocaleDateString,
  saveCupAsPDF,
  isNumber,
} from "../shared";
import NotificationBar from "../components/NotificationBar.vue";

export default {
  name: "CupOverview",
  components: {
    ProgressBarQuery: () => import("../components/layout/ProgressBarQuery"),
    CupPoints,
    CupStats,
    NotificationBar,
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
      all_signees: [],
      headers: [],
      select_table: ["comp.plural", "signees-signed"],
      selected: "comp.plural",
      selected_headers: [],
      selected_items: [],
      cup_fishes_competition: [],
      cup_fishes_total: [],
      cup_signees: [],
      biggest_fishes: [],
      biggest_amounts: [],
      total_fishes_chart_data: null,
      competition_fishes_chart_data: null,
      cup_signees_chart_data: null,
      cup_biggest_fishes_chart_data: null,
      cup_biggest_amounts_chart_data: null,
      headers_comp: [
        { text: "date", value: "start_date" },
        { text: "name", value: "name" },
        { text: "ended", value: "isFinished" },
        { text: "publicity", value: "isPublic" },
        { text: "multiplier", value: "cup_points_multiplier" },
        { text: "choose", value: "choose", sortable: false },
      ],
      headers_signees: [
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
        { text: "temp-captain-name", value: "temp_captain_name" },
        { text: "locality-team", value: "locality" },
        { text: "edit", value: "modify", sortable: false },
        { text: "delete", value: "delete", sortable: false },
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
  },
  methods: {
    formatDateToLocaleDateString: formatDateToLocaleDateString,
    getMultiplierColor: getMultiplierColor,
    isNumber: isNumber,
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
        ? (competition.state = "ended")
        : (competition.state = "not-finished");
      const newvalues = {
        $set: {
          isFinished: competition.isFinished,
          state: competition.state,
        },
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
    selectTableData() {
      if (this.selected === "comp.plural") {
        this.selected_items = this.allCompetitions;
        this.selected_headers = this.headers_comp;
      } else {
        this.selected_items = this.signees;
        this.selected_headers = this.headers_signees;
      }
    },
    async deleteSignee(item, confirmed) {
      if (confirmed) {
        let signeeIndex = this.signees.findIndex(
          (o) => o.boat_number === item.boat_number
        );
        this.signees.splice(signeeIndex, 1);
        await this.updateSignees(this.signees);
      } else {
        this.$confirm(
          this.$t("confirm-dialog"),
          this.$t("button.delete-signee"),
          "question"
        )
          .then((r) => {
            if (r) {
              this.deleteSignee(item, r);
            }
          })
          .catch((error) => {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    async addSignee() {
      if (this.signeeNumber < 1 || this.signeeNumber === null) {
        this.signeeError = "errors.missing-number";
      } else if (
        this.signeeCaptain.trim() === "" ||
        this.signeeCaptain === null
      ) {
        this.signeeError = "errors.missing-captain!";
      } else {
        const numberInSignees = this.cup.signees.find(
          (s) => s.boat_number === this.signeeNumber
        );
        if (numberInSignees) {
          this.signeeError = "errors.number-used";
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
          this.text = "notification.updated";
          this.snackbar = true;
        })
        .catch((err) => {
          this.text = "errors.in-saving";
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
          this.errors.push("errors.missing-captain");
        } else {
          signee.captain_name = capitalize_words(signee.captain_name);
        }

        if (!new_temp_captain_name) {
          new_temp_captain_name = signee.temp_captain_name = "-";
        } else {
          signee.temp_captain_name = capitalize_words(signee.temp_captain_name);
        }
        if (!new_locality) {
          this.errors.push("errors.missing-locality");
        } else {
          signee.locality = capitalize_words(signee.locality);
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
      // Convert dates
      this.allCompetitions.forEach((competition, i) => {
        competition.start_date = new Date(competition.start_date);
        competition.end_date = new Date(competition.end_date);
        // Index for competition
        competition.key_name = i + 1;
      });
      this.allCompetitions.sort((a, b) => {
        return b.start_date < a.start_date;
      });
      this.signees = this.cup.signees.sort(sortBy("boat_number", true));
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
    // "Normaalikilpailu" results
    calculateNormalResults(competition, signees) {
      const placement_points = competition.cup_placement_points;
      let cup_placement_points = placement_points[0];
      const cup_participation_points = competition.cup_participation_points;
      let last_points = 0;
      let last_placement = 1;

      let placement = 1;
      let cup_points_total = 0;
      let normal_points = [];
      let normal_weights = [];
      signees = signees.filter((signee) => signee.returned == true);
      signees = signees.sort(function compare(a, b) {
        return parseInt(b.total_points) - parseInt(a.total_points);
      });
      // For every signee, calculate their cup points and placing
      //TODO rework the structure, seems more complex than it should be
      // Placements and points now saved in every competition to cup_placement_points_array, based on placement fetch from there?
      signees.forEach((signee, index) => {
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
        signee.placement = placement;
        // For the data-table
        signee.fishes.forEach((f) => {
          signee[f.id] = f.weights;
        });
        normal_weights.push(signee);

        last_placement = placement;
        last_points = signee.total_points;
      });

      return { normal_points, normal_weights };
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

            this.biggest_fishes = await FishService.getFishes({
              cup_id: cup_id,
            });
            this.biggest_fishes = this.biggest_fishes.sort(
              (a, b) => b.weight - a.weight
            );

            await ResultService.getResults({ cup_id: cup_id })
              .then((r) => {
                r.forEach((s) => {
                  if (s.fishes.length) {
                    s.fishes.forEach((f) => {
                      let comp = this.allCompetitions.find(
                        (c) => c._id === s.competition_id
                      );
                      let fish = comp.fishes.find((cf) => cf.id === f.id);

                      this.biggest_amounts.push({
                        id: fish.id,
                        competition_id: comp._id,
                        competition_name: comp.name,
                        boat_number: s.boat_number,
                        captain_name: s.captain_name,
                        name: fish.name,
                        weight: f.weights,
                      });
                    });
                  }
                });

                this.all_signees = r;
                this.biggest_amounts = this.biggest_amounts.sort(
                  (a, b) => b.weight - a.weight
                );
              })
              .catch((e) => {
                console.log(e);
              })
              .finally(() => {
                this.setCompetitionData(this.cup);
                this.selectTableData();
                this.text = "notification.info-up-to-date";
                this.snackbar = true;
              });
          } catch (error) {
            console.error(error);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
      this.loading = false;
    },
    pickCompetition(competition) {
      // Pick competition for the app to use
      //NOTE Store competition to vuex, redundant?
      this.$store.state.competition = competition;
      // Set competition._id to localstorage for database queries
      localStorage.setItem(
        "competition",
        JSON.stringify({
          _id: competition._id,
          start_date: competition.start_date,
          end_date: competition.end_date,
        })
      );
      // redirect to /overview
      this.$router.push({ path: "/overview" });
    },
    // Calculate all the cup points, and limit the number of races taken into account
    // If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated
    async calculateAll(competitions, limit) {
      let all_results = [];
      this.isResults = false;
      competitions.forEach((competition) => {
        let signees = this.all_signees.filter(
          (s) => s.competition_id === competition._id
        );

        competition.total_weights = 0;
        signees.forEach((s) => {
          s.total_points = 0;
          if (s.fishes.length) {
            s.fishes.forEach((f) => {
              let fish = competition.fishes.find((cf) => cf.id === f.id);
              s.total_points += f.weights * fish.multiplier;
              competition.total_weights += f.weights;
              fish.weights += f.weights;
            });
          } else {
            // Fix for pdf
            competition.fishes.forEach((cf) => {
              s.fishes.push({ id: cf.id, name: cf.name, weights: "-" });
            });
          }
        });
        competition.normal_points = this.calculateNormalResults(
          competition,
          signees
        ).normal_points;
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
                  `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results!`
                );
                alert(
                  `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results!`
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

        all_results.length ? (this.isResults = true) : (this.isResults = false);

        if (all_results.length) {
          // limits the amount of competitions are taken into account in the cup
          all_results = this.limitCompetitions(all_results, limit);
          // Sort the array based on total cup points
          all_results = all_results.sort(function compare(a, b) {
            return (
              parseInt(b.cup_results["total"]) -
              parseInt(a.cup_results["total"])
            );
          });
          this.changeHeaders("locality");

          let final_placement = 1;
          let last_points = -1;
          let last_placement = -1;

          all_results.forEach((signee) => {
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
          this.results = all_results;
        }
      });
    },
    changeHeaders(headerSelection) {
      this.headers = [
        {
          text: "placement",
          highlight: false,
          align: "center",
          translate: true,
          value: "final_placement",
          isFinished: true,
        },
        {
          text: "boat-number",
          align: "center",
          translate: true,
          highlight: false,
          value: "boat_number",
          isFinished: true,
        },
        {
          text: "captain-name",
          align: "center",
          translate: true,
          highlight: false,
          value: "captain_name",
          isFinished: true,
        },
        {
          text: "locality",
          align: "center",
          translate: true,
          highlight: false,
          value: "locality",
          isFinished: true,
        },
      ];

      this.notFinishedCount = 0;
      this.competitions.forEach((competition) => {
        // Keep track if there are unfinished competitions
        if (!competition.isFinished) {
          this.notFinishedCount++;
        }
        // Dynamic headers, because competition names change
        if (headerSelection === "locality") {
          // Check if there are competitions with same locality, if so, add identifier
          let found_headers = this.headers.filter((header) => {
            return competition.locality === header.text;
          });
          if (found_headers.length) {
            let new_header_text = `${competition.locality} #${
              found_headers.length + 1
            }`;
            this.headers.push({
              text: new_header_text,
              align: "center",
              highlight: true,
              translate: false,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          } else {
            this.headers.push({
              text: competition.locality,
              translate: false,
              align: "center",
              highlight: true,
              isFinished: competition.isFinished,
              value: `cup_results[${competition.key_name}].points`,
            });
          }
        } else {
          this.headers.push({
            text: competition.name,
            translate: false,
            align: "center",
            highlight: true,
            isFinished: competition.isFinished,
            value: `cup_results[${competition.key_name}].points`,
          });
        }
      });
      this.headers.push({
        text: "total-big",
        align: "center",
        translate: true,
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
    pdfWrapper(table_title) {
      saveCupAsPDF(
        table_title,
        this.isLandscape,
        this.cup,
        this.competitions,
        this.showUnfinishedCompetitions,
        this.showInfoInPdf,
        this.selectedCompetitions,
        this.headers,
        this.results,
        this.signees
      );
      this.dialog = false;
    },
  },
};
</script>
