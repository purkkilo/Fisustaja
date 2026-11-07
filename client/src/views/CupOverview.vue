<template>
  <!-- /cup-overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div>
    <v-container
      v-bind:class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title> Pdf {{ $t("settings") }} </v-card-title>
            <v-card-text>
              <v-checkbox
                :label="$t('pdf-landscape')"
                v-model="isLandscape"
              ></v-checkbox>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="yellow" @click="dialog = false" variant="text">
                Peruuta
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="pdfWrapper(`Ilmoittautuneet`)"
                variant="text"
              >
                {{ $t("download") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row class="justify-center align-center">
          <v-col v-if="!loading && cup">
            <h1>{{ cup.name }}, {{ cup.year }}</h1>
          </v-col>
          <v-col v-else
            ><h1>{{ $t("downloading") }}..</h1></v-col
          >
        </v-row>
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
          <v-tab value="overview">{{ $t("overview") }}</v-tab>
          <v-tab :disabled="!competitions.length" value="points">{{
            $t("point-status")
          }}</v-tab>
          <v-tab :disabled="!competitions.length" value="stats">{{
            $t("general-statistics")
          }}</v-tab>
        </v-tabs>
        <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
          <v-window-item :value="'overview'">
            <v-row v-if="loading">
              <v-col>
                <h2 class="text-white">{{ $t("preparing-cup") }}...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="!cup">
                <p
                  class="flow-text"
                  v-bind:class="{
                    'text-white': store.getTheme,
                  }"
                >
                  {{ $t("errors.no-cup-selected") }}
                </p>
              </v-col>
            </v-row>
            <v-col v-if="!loading && cup" style="margin-top: 50px">
              <!-- Show the cup name and it's year, and ability to change them -->
              <v-row>
                <v-col md="4" offset-md="4">
                  <v-text-field
                    v-model="newCupName"
                    :label="$t('name')"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row style="margin-top: 0px; margin-bottom: 50px">
                <v-col md="4" offset-md="4">
                  <v-text-field
                    v-model="newCupYear"
                    :label="$t('year')"
                    type="number"
                    @keypress="isNumber($event, true)"
                    maxlength="4"
                    variant="outlined"
                  ></v-text-field>
                  <v-btn
                    color="primary"
                    :loading="publishing || loading"
                    @click="updateCupValues"
                    class="mt-2"
                    size="large"
                    variant="outlined"
                  >
                    <v-icon>mdi-refresh</v-icon>
                    {{ $t("save") }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="4" offset-md="4">
                  <v-select
                    label="Valitse näytettävät tiedot"
                    :items="select_table"
                    v-model="selected"
                    @update:model-value="selectTableData"
                    variant="outlined"
                  >
                    <template v-slot:item="{ item, props }">
                      <v-list-item v-bind="props" :title="$t(item)" />
                    </template>
                    <template v-slot:selection="{ item }">
                      <span>{{ $t(item) }}</span>
                    </template></v-select
                  >
                </v-col>
              </v-row>
            </v-col>
            <v-row class="justify-center" v-if="selected === 'signees-signed'">
              <v-btn
                @click="dialog = true"
                color="red"
                :loading="publishing || loading"
                :disabled="!cup.signees.length"
                size="large"
                variant="outlined"
                ><v-icon>mdi-file-pdf-box</v-icon>
                {{ $t("download-signees") }}</v-btn
              ></v-row
            >
            <v-row v-if="!loading && cup">
              <v-col md="10" offset-md="1">
                <v-card>
                  <v-card-title class="d-flex flex-wrap align-center">
                    <p
                      class="flow-text"
                      v-bind:class="{
                        'text-white': store.getTheme,
                      }"
                    >
                      {{ $t(selected) }}
                    </p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search_comp"
                      append-inner-icon="mdi-magnify"
                      :label="$t('search')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>
                  <v-data-table
                    id="normal-table"
                    :headers="tableHeaders(selected_headers)"
                    :items="selected_items"
                    :search="search_comp"
                    :loading="loading || updating"
                  >
                    <template
                      v-for="(h, index) in selected_headers"
                      v-slot:[`header.${h.value}`]="{ column: header }"
                    >
                      <span> {{ $t(header.text) }}</span>
                    </template>
                    <template v-slot:[`item.start_date`]="{ item }">
                      <v-chip color="primary-darken-2" variant="flat">{{
                        formatDateToLocaleDateString(item.start_date)
                      }}</v-chip>
                    </template>
                    <template v-slot:[`item.isFinished`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            :color="
                              item.isFinished
                                ? 'green-lighten-2'
                                : 'red-lighten-2'
                            "
                            @click="endCompetition(item)"
                            :disabled="updating"
                            :variant="store.getTheme ? 'outlined' : 'flat'"
                            >{{
                              item.isFinished ? $t("yes") : $t("no")
                            }}</v-chip
                          >
                        </template>
                        <span>Muuta tila painamalla</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:[`item.isPublic`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-chip
                            v-bind="props"
                            :color="
                              item.isPublic ? 'green-darken-2' : 'red-darken-2'
                            "
                            @click="publishCompetition(item)"
                            :disabled="updating"
                            :variant="store.getTheme ? 'outlined' : 'flat'"
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
                        :variant="store.getTheme ? 'outlined' : 'flat'"
                        >{{ item.cup_points_multiplier }}x</v-chip
                      >
                    </template>
                    <template v-slot:[`item.choose`]="{ item }">
                      <v-tooltip location="end">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            color="primary"
                            v-bind="props"
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
                        color="yellow-darken-2"
                        :disabled="loading || publishing"
                        @click.stop="
                          new_captain_name = item.captain_name;
                          new_temp_captain_name = item.temp_captain_name;
                          new_locality = item.locality;
                          dialog_signee[item.boat_number] = true;
                        "
                        ><v-icon color="black">mdi-account-edit</v-icon></v-btn
                      >
                      <v-dialog
                        v-model="dialog_signee[item.boat_number]"
                        persistent
                        max-width="600px"
                        :key="item.boat_number"
                      >
                        <v-card>
                          <v-card-title>
                            <span class="text-headline-small"
                              >{{ $t("modify") }} ({{ $t("boat-number-short") }}
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
                                    <p class="flow-text text-black">
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
                              color="yellow-darken-2"
                              :loading="publishing"
                              @click.stop="
                                modifySignee(
                                  item,
                                  new_captain_name,
                                  new_temp_captain_name,
                                  new_locality,
                                  false,
                                )
                              "
                              variant="outlined"
                              >Peruuta</v-btn
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                              color="green-darken-2"
                              :loading="publishing"
                              @click.stop="
                                modifySignee(
                                  item,
                                  new_captain_name,
                                  new_temp_captain_name,
                                  new_locality,
                                  true,
                                )
                              "
                              variant="outlined"
                              >Tallenna</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-btn
                        color="red-darken-2"
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
                  :loading="publishing || loading"
                  size="large"
                  variant="outlined"
                  ><v-icon color="green">mdi-plus</v-icon>{{ $t("add") }}</v-btn
                >
                <v-dialog v-model="createSigneeDialog" width="500">
                  <v-card>
                    <v-card-title>
                      {{ $t("add") }} {{ $t("signee") }}</v-card-title
                    >
                    <v-card-text>
                      <h3 v-if="signeeError" class="text-red">
                        {{ $t(signeeError) }}
                      </h3>
                      <v-text-field
                        :label="$t('boat-number')"
                        v-model="signeeNumber"
                        append-icon="mdi-plus"
                        maxlength="6"
                        @click:append="
                          signeeNumber > 0 ? signeeNumber++ : (signeeNumber = 1)
                        "
                        prepend-icon="mdi-minus"
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
                        @click="createSigneeDialog = false"
                        variant="text"
                      >
                        {{ $t("cancel") }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="addSignee" variant="text">
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
                  color="green-lighten-1"
                  :loading="publishing || loading"
                  @click="changePage('/register-comp')"
                  variant="outlined"
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-new-comp") }}</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  tile
                  :color="cup.isPublic ? 'grey-darken-4' : 'green-darken-4'"
                  @click="publishCup(cup.isPublic)"
                  class="text-white"
                  :loading="publishing || loading"
                  size="large"
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
                <h2 class="bg-error text-white">
                  {{ error }}
                </h2>
              </v-col>
            </v-row>
          </v-window-item>
          <v-window-item :value="'points'">
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
          </v-window-item>
          <v-window-item :value="'stats'">
            <cup-stats
              :competitions="competitions"
              :cup="cup"
              :all_signees="all_signees"
              :biggest_fishes="biggest_fishes"
              :biggest_amounts="biggest_amounts"
              :loading="loading"
            ></cup-stats>
          </v-window-item>
        </v-window>
        <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
      </v-card>
    </v-container>
  </div>
</template>
<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { alert, confirm } from "@/plugins/alerts";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import CupService from "../services/CupService";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService";
import FishService from "../services/FishService";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import {
  capitalize_words,
  sortBy,
  formatDateToLocaleDateString,
  isNumber,
} from "@/utils/format";
import { getMultiplierColor } from "@/utils/colors";
import { saveCupAsPDF } from "@/pdf";
import NotificationBar from "../components/NotificationBar.vue";

defineOptions({ name: "CupOverview" });
const store = useMainStore();
const { t } = useI18n();
const router = useRouter();

const prevRoute = usePreviousRoute();
const dialog = ref(false);
const createSigneeDialog = ref(false);
const signeeError = ref("");
const signeeNumber = ref(1);
const number_rules = ref([
  (value) => !isNaN(value || "") || "Ei ole numero!",
  (value) => (value || "") >= 0 || "Numeron pitää olla positiivinen!",
]);
const signeeCaptain = ref("");
const signeeTempCaptain = ref("");
const signeeLocality = ref("");
const isLandscape = ref(false);
const dialog_clock = ref(false);
const dialog_signee = ref({});
const cup = ref(null);
const allCompetitions = ref([]);
const competitions = ref([]);
const signees = ref([]);
const all_signees = ref([]);
const headers = ref([]);
const select_table = ref(["comp.plural", "signees-signed"]);
const selected = ref("comp.plural");
const selected_headers = ref([]);
const selected_items = ref([]);
const cup_fishes_competition = ref([]);
const cup_fishes_total = ref([]);
const cup_signees = ref([]);
const biggest_fishes = ref([]);
const biggest_amounts = ref([]);
const total_fishes_chart_data = ref(null);
const competition_fishes_chart_data = ref(null);
const cup_signees_chart_data = ref(null);
const cup_biggest_fishes_chart_data = ref(null);
const cup_biggest_amounts_chart_data = ref(null);
const headers_comp = ref([
  { text: "date", value: "start_date" },
  { text: "name", value: "name" },
  { text: "ended", value: "isFinished" },
  { text: "publicity", value: "isPublic" },
  { text: "multiplier", value: "cup_points_multiplier" },
  { text: "choose", value: "choose", sortable: false },
]);
const headers_signees = ref([
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "temp-captain-name", value: "temp_captain_name" },
  { text: "locality-team", value: "locality" },
  { text: "edit", value: "modify", sortable: false },
  { text: "delete", value: "delete", sortable: false },
]);
const results = ref([]);
const loading = ref(false);
const publishing = ref(false);
const updating = ref(false);
const selectNumbers = ref([]);
const tab = ref(null);
const search_comp = ref("");
const competition = ref(null);
const error = ref(null);
const errors = ref([]);
const new_locality = ref(null);
const new_captain_name = ref(null);
const new_temp_captain_name = ref(null);
const isSimpleMode = ref(true);
const snackbar = ref(false);
const text = ref("");
const isResults = ref(false);
const showInfoInPdf = ref(false);
const showUnfinishedCompetitions = ref(false);
const selectedCompetitions = ref(null);
const newCupName = ref(null);
const newCupYear = ref(null);
const notFinishedCount = ref(null);

async function updateCupValues() {
  publishing.value = true;
  if (!newCupName.value || !newCupYear.value) {
    text.value = "errors.missing-cup-name-or-year";
    snackbar.value = true;
    publishing.value = false;
  } else if (
    newCupName.value === cup.value.name &&
    newCupYear.value === cup.value.year
  ) {
    text.value = "errors.no-changes-made";
    snackbar.value = true;
    publishing.value = false;
  } else {
    try {
      // Update cup name and year to database
      const newValues = {
        $set: {
          name: newCupName.value,
          year: newCupYear.value,
        },
      };
      await CupService.updateValues(cup.value._id, newValues);
      store.cup.name = cup.value.name = newCupName.value;
      store.cup.year = cup.value.year = newCupYear.value;
      text.value = "notification.updated";
      snackbar.value = true;
    } catch (err) {
      console.error(err.message);
      text.value = "errors.in-saving";
      snackbar.value = true;
    }
    publishing.value = false;
  }
}

async function publishCup(isPublic) {
  cup.value.isPublic = !isPublic;

  try {
    //TODO update only this one variable (competition.normal_points) to database, not the whole competition
    store.cup = cup.value;
    publishing.value = true;
    const newValues = {
      $set: { isPublic: cup.value.isPublic },
    };
    await CupService.updateValues(cup.value._id, newValues);
  } catch (err) {
    console.error(err.message);
  }
  publishing.value = false;
}

async function publishCompetition(competition) {
  competition.isPublic = !competition.isPublic;
  const newvalues = {
    $set: { isPublic: competition.isPublic },
  };
  updateToDatabase(competition, newvalues);
}

async function endCompetition(competition) {
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
  updateToDatabase(competition, newvalues);
}

async function updateToDatabase(competition, newvalues) {
  try {
    updating.value = true;
    await CompetitionService.updateValues(competition._id, newvalues);
  } catch (err) {
    console.error(err.message);
  }
  updating.value = false;
}

function changePage(path) {
  router.push({
    path: path,
    query: { cup: localStorage.getItem("cup") },
  });
}

function selectTableData() {
  if (selected.value === "comp.plural") {
    selected_items.value = allCompetitions.value;
    selected_headers.value = headers_comp.value;
  } else {
    selected_items.value = signees.value;
    selected_headers.value = headers_signees.value;
  }
}

async function deleteSignee(item, confirmed) {
  if (confirmed) {
    let signeeIndex = signees.value.findIndex(
      (o) => o.boat_number === item.boat_number,
    );
    signees.value.splice(signeeIndex, 1);
    await updateSignees(signees.value);
  } else {
    confirm(t("confirm-dialog"), t("button.delete-signee"), "question")
      .then((r) => {
        if (r) {
          deleteSignee(item, r);
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        }
      });
  }
}

async function addSignee() {
  if (signeeNumber.value < 1 || signeeNumber.value === null) {
    signeeError.value = "errors.missing-number";
  } else if (
    signeeCaptain.value.trim() === "" ||
    signeeCaptain.value === null
  ) {
    signeeError.value = "errors.missing-captain!";
  } else {
    const numberInSignees = cup.value.signees.find(
      (s) => s.boat_number === signeeNumber.value,
    );
    if (numberInSignees) {
      signeeError.value = "errors.number-used";
    } else {
      signees.value.push({
        boat_number: signeeNumber.value,
        captain_name: signeeCaptain.value,
        dialog: false,
        locality: signeeLocality.value || "-",
        starting_place: "-",
        temp_captain_name: signeeTempCaptain.value || "-",
      });
      await updateSignees(signees.value).finally(() => {
        createSigneeDialog.value = false;
        signeeNumber.value = signeeNumber.value + 1;
        signeeCaptain.value =
          signeeTempCaptain.value =
          signeeLocality.value =
            "";
      });
    }
  }
}

async function updateSignees(signees) {
  store.cup = cup.value;
  publishing.value = true;
  const new_signees = [...signees];
  // No need to have this variable in database
  new_signees.forEach((signee) => {
    delete signee.dialog;
  });
  const newvalues = {
    $set: { signees: new_signees },
  };
  await CupService.updateValues(cup.value._id, newvalues)
    .then(() => {
      text.value = "notification.updated";
      snackbar.value = true;
    })
    .catch((err) => {
      text.value = "errors.in-saving";
      snackbar.value = true;
      console.log(err);
    });
  publishing.value = false;
}

// Function to modify signees' captain, temp_captain or locality

async function modifySignee(
  signee,
  new_captain_name,
  new_temp_captain_name,
  new_locality,
  modify,
) {
  errors.value = [];
  // If user has pressed "Tallenna" button
  if (modify) {
    // First check that all the inputs are correctly filled
    if (!new_captain_name) {
      errors.value.push("errors.missing-captain");
    } else {
      signee.captain_name = capitalize_words(signee.captain_name);
    }

    if (!new_temp_captain_name) {
      new_temp_captain_name = signee.temp_captain_name = "-";
    } else {
      signee.temp_captain_name = capitalize_words(signee.temp_captain_name);
    }
    if (!new_locality) {
      errors.value.push("errors.missing-locality");
    } else {
      signee.locality = capitalize_words(signee.locality);
    }
    // No errors left
    if (!errors.value.length) {
      // Check if anything has been modified, if there is something modified -> update to database
      if (
        signee.captain_name !== new_captain_name ||
        signee.temp_captain_name !== new_temp_captain_name ||
        signee.locality !== new_locality
      ) {
        signee.captain_name = new_captain_name;
        signee.temp_captain_name = new_temp_captain_name;
        signee.locality = new_locality;
        await updateSignees(signees.value).finally(() => {
          // Update names to "points" table
          calculateAll(competitions.value, selectedCompetitions.value);
          dialog_signee.value[signee.boat_number] = false;
        });
      } else {
        dialog_signee.value[signee.boat_number] = false;
      }
    }
  }
  // If user has pressed "Peruuta" button
  else {
    // Do nothing
    dialog_signee.value[signee.boat_number] = false;
  }
}

function setCompetitionData(_cup) {
  selectNumbers.value = [];
  // Convert dates
  allCompetitions.value.forEach((competition, i) => {
    competition.start_date = new Date(competition.start_date);
    competition.end_date = new Date(competition.end_date);
    // Index for competition
    competition.key_name = i + 1;
  });
  allCompetitions.value.sort((a, b) => {
    return b.start_date < a.start_date;
  });
  signees.value = cup.value.signees.sort(sortBy("boat_number", true));
  signees.value.forEach((signee) => {
    signee.dialog = false;
  });

  competitions.value = [...allCompetitions.value];
  if (!showUnfinishedCompetitions.value) {
    competitions.value = competitions.value.filter((comp) => comp.isFinished);
  }

  competitions.value.forEach((_, i) => {
    selectNumbers.value.push(i + 1);
  });

  if (_cup.meaningful_competitions > 0)
    selectedCompetitions.value = _cup.meaningful_competitions;
  else selectedCompetitions.value = competitions.value.length;

  calculateAll(competitions.value, selectedCompetitions.value);
}

// "Normaalikilpailu" results

function calculateNormalResults(competition, signees) {
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
}

async function refreshCup(cup_id) {
  loading.value = true;
  try {
    //Get competition from database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
    let _cup = await CupService.getCups({
      _id: cup_id,
    });
    // IF competition found from database
    if (_cup) {
      // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
      //TODO make a test for this?
      cup.value = _cup;
      newCupName.value = cup.value.name;
      newCupYear.value = cup.value.year;
      // Update to vuex, Assing variables from vuex (see client/store/index.js)
      store.refreshCup(cup.value);
      try {
        allCompetitions.value = await CompetitionService.getCompetitions({
          cup_id: cup_id,
        });

        biggest_fishes.value = await FishService.getFishes({
          cup_id: cup_id,
        });
        biggest_fishes.value = biggest_fishes.value.sort(
          (a, b) => b.weight - a.weight,
        );

        await ResultService.getResults({ cup_id: cup_id })
          .then((r) => {
            r.forEach((s) => {
              if (s.fishes.length) {
                s.fishes.forEach((f) => {
                  let comp = allCompetitions.value.find(
                    (c) => c._id === s.competition_id,
                  );
                  let fish = comp.fishes.find((cf) => cf.id === f.id);

                  biggest_amounts.value.push({
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

            all_signees.value = r;
            biggest_amounts.value = biggest_amounts.value.sort(
              (a, b) => b.weight - a.weight,
            );
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setCompetitionData(cup.value);
            selectTableData();
            text.value = "notification.info-up-to-date";
            snackbar.value = true;
          });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
  loading.value = false;
}

function pickCompetition(competition) {
  // Pick competition for the app to use
  //NOTE Store competition to vuex, redundant?
  store.competition = competition;
  // Set competition._id to localstorage for database queries
  localStorage.setItem(
    "competition",
    JSON.stringify({
      _id: competition._id,
      start_date: competition.start_date,
      end_date: competition.end_date,
    }),
  );
  // redirect to /overview
  router.push({ path: "/overview" });
}

// Calculate all the cup points, and limit the number of races taken into account
// If limit = 4, 4 races with highest points will be calculated, other races will have 5 points where the signee has participated

async function calculateAll(competitions, limit) {
  let all_results = [];
  isResults.value = false;
  competitions.forEach((competition) => {
    let _signees = all_signees.value.filter(
      (s) => s.competition_id === competition._id,
    );

    competition.total_weights = 0;
    _signees.forEach((s) => {
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
    competition.normal_points = calculateNormalResults(
      competition,
      _signees,
    ).normal_points;
    // Dynamic headers, because competition names change
    //If there are any results in the competition
    if (competition.normal_points.length) {
      //Loop through each competition's results
      competition.normal_points.forEach((signee) => {
        // Get each signee's results from array that has all the results
        let index = all_results.findIndex((item) => {
          return parseInt(signee.boat_number) === parseInt(item.boat_number);
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
          let cup_signee = signees.value.find(
            (element) => element.boat_number === signee.boat_number,
          );
          if (cup_signee) {
            // Add original names from the first instance
            signee.captain_name = cup_signee.captain_name;
            signee.temp_captain_name = cup_signee.temp_captain_name;
            signee.locality = cup_signee.locality;
          } else {
            // TODO: Figure out a better way to notify
            console.log(
              `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results!`,
            );
            alert(
              `(${signee.boat_number}) - ${signee.captain_name} wasn't found on results!`,
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

    all_results.length ? (isResults.value = true) : (isResults.value = false);

    if (all_results.length) {
      // limits the amount of competitions are taken into account in the cup
      all_results = limitCompetitions(all_results, limit);
      // Sort the array based on total cup points
      all_results = all_results.sort(function compare(a, b) {
        return (
          parseInt(b.cup_results["total"]) - parseInt(a.cup_results["total"])
        );
      });
      changeHeaders("locality");

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
      results.value = all_results;
    }
  });
}

function changeHeaders(headerSelection) {
  headers.value = [
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

  notFinishedCount.value = 0;
  competitions.value.forEach((competition) => {
    // Keep track if there are unfinished competitions
    if (!competition.isFinished) {
      notFinishedCount.value++;
    }
    // Dynamic headers, because competition names change
    if (headerSelection === "locality") {
      // Check if there are competitions with same locality, if so, add identifier
      let found_headers = headers.value.filter((header) => {
        return competition.locality === header.text;
      });
      if (found_headers.length) {
        let new_header_text = `${competition.locality} #${
          found_headers.length + 1
        }`;
        headers.value.push({
          text: new_header_text,
          align: "center",
          highlight: true,
          translate: false,
          isFinished: competition.isFinished,
          value: `cup_results[${competition.key_name}].points`,
        });
      } else {
        headers.value.push({
          text: competition.locality,
          translate: false,
          align: "center",
          highlight: true,
          isFinished: competition.isFinished,
          value: `cup_results[${competition.key_name}].points`,
        });
      }
    } else {
      headers.value.push({
        text: competition.name,
        translate: false,
        align: "center",
        highlight: true,
        isFinished: competition.isFinished,
        value: `cup_results[${competition.key_name}].points`,
      });
    }
  });
  headers.value.push({
    text: "total-big",
    align: "center",
    translate: true,
    highlight: false,
    value: "final_cup_points",
    isFinished: true,
  });
}

function limitCompetitions(results, limit) {
  results.forEach((signee) => {
    // If there are more or equal amount of competitions than the limit, limit remaining competitions after the limit
    if (competitions.value.length >= limit) {
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
            const comp = competitions.value.find(
              (c) => element.competition === c._id,
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
}

function pdfWrapper(table_title) {
  saveCupAsPDF(
    table_title,
    isLandscape.value,
    cup.value,
    competitions.value,
    showUnfinishedCompetitions.value,
    showInfoInPdf.value,
    selectedCompetitions.value,
    headers.value,
    results.value,
    signees.value,
  );
  dialog.value = false;
}

onMounted(() => {
  competition.value = localStorage.getItem("competition");
  // IF competition on localstorage
  if (localStorage.getItem("cup") != null) {
    // update from database
    refreshCup(localStorage.getItem("cup"));
    store.cup = cup.value;
  } else {
    console.log("No cup in localstorage!");
  }
});
</script>
