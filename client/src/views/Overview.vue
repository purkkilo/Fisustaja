<template>
  <!-- /overview -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div style="padding: 0px">

    <v-container
      :class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <error-list :errors="errors"></error-list>
      <v-card
        v-if="!loading"
        style="background: transparent"
        elevation="3"
        variant="outlined"
      >
        <v-row>
          <v-col>
            <v-card elevation="5" variant="outlined">
              <v-card-title
                ><span class="text-display-medium">
                  {{ competition.name }}
                </span></v-card-title
              >
              <v-list elevation="3" border>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-calendar-today</v-icon>
                  </template>
                  <v-list-item-title>{{ $t("date") }}</v-list-item-title>
                  <v-list-item-subtitle class="text-blue">
                    <b
                      >{{ formatDate(competition.start_date) }} -
                      {{ formatDate(competition.end_date) }}</b
                    >
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-divider></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="green-darken-4">mdi-state-machine</v-icon>
                  </template>
                  <v-list-item-title>{{ $t("status") }}</v-list-item-title>
                  <v-list-item-subtitle
                    :class="{
                      'text-green': competition.state === 'finished',
                      'text-blue': competition.state !== 'finished',
                    }"
                  >
                    <b>{{ $t(competition.state) }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon>mdi-card-account-details-outline</v-icon>
                  </template>
                  <v-list-item-title>{{ $t("signees") }}</v-list-item-title>
                  <v-list-item-subtitle
                    :class="{
                      'text-green': competition.signees.length,
                      'text-red': !competition.signees.length,
                    }"
                  >
                    <b>{{ competition.signees.length }}</b>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="blue-darken-4">mdi-water-alert</v-icon>
                  </template>
                  <v-list-item-title>{{
                    $t("comp-overview.still-on-water")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="competition.signees.length"
                    :class="{
                      'text-green': !competition.signees.filter(
                        (s) => !s.returned,
                      ).length,
                      'text-red': competition.signees.filter((s) => !s.returned)
                        .length,
                    }"
                  >
                    <b>{{ hasNotReturnedPercentage }}%</b>
                    ({{
                      competition.signees.filter((s) => !s.returned).length
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>

                  <v-list-item-subtitle class="text-green" v-else
                    ><b>{{
                      $t("comp-overview.nobody-on-water")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="blue">mdi-fish</v-icon>
                  </template>
                  <v-list-item-title>{{
                    $t("comp-overview.gotten-fish")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    class="text-green"
                    v-if="competition.signees.length"
                  >
                    <b>{{ hasGottenFishPercentage }}%</b> ({{
                      hasGottenFishCount
                    }}
                    / {{ competition.signees.length }})
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-red" v-else
                    ><b>{{
                      $t("comp-overview.no-signees")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="yellow-darken-4">mdi-seal</v-icon>
                  </template>
                  <v-list-item-title>{{
                    $t("comp-overview.fish-amount-total")
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    class="text-green"
                    v-if="competition.signees.length"
                  >
                    <b>{{ competition.total_weights / 1000 }} kg</b>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="text-red" v-else
                    ><b>{{
                      $t("comp-overview.no-signees")
                    }}</b></v-list-item-subtitle
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <div v-else>
        <v-row>
          <v-col>
            <v-card
              style="background: transparent; text-align: center"
              elevation="1"
              variant="outlined"
            >
              <h1 class="text-center">{{ $t("comp.preparing") }}...</h1>
              <ProgressBarQuery />
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useMainStore } from "@/store";
import CompetitionService from "../services/CompetitionService";
import ResultService from "../services/ResultService.js";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import { formatDate } from "@/utils/format";
import ErrorList from "../components/ErrorList.vue";

defineOptions({ name: "Overview" });
const store = useMainStore();

const competition = ref(null);
const loading = ref(false);
const errors = ref([]);
const formatted_start_date = ref(null);
const formatted_end_date = ref(null);
const dialog = ref(false);
const hasNotReturnedPercentage = ref(0);
const hasGottenFishPercentage = ref(0);
const hasGottenFishCount = ref(0);

// fetch/update competition from database

async function refreshCompetition(competition_id) {
  loading.value = true;
  errors.value = [];
  try {
    const _competition = await CompetitionService.getById(competition_id);
    competition.value = _competition;

    const r = await ResultService.list({
      competition_id: _competition._id,
    });
    competition.value.total_weights = 0;
    r.forEach((s) => {
      s.fishes.forEach((f) => {
        competition.value.total_weights += f.weights;
      });
    });
    competition.value.signees = r;
    store.refreshCompetition(competition.value);
    localStorage.setItem("cup", competition.value.cup_id);
    const start_date = new Date(competition.value.start_date);
    const end_date = new Date(competition.value.end_date);
    formatted_start_date.value = `${start_date.getDate()}.${
      start_date.getMonth() + 1
    }.${start_date.getFullYear()}`;
    formatted_end_date.value = `${end_date.getDate()}.${
      end_date.getMonth() + 1
    }.${end_date.getFullYear()}`;

    hasNotReturnedPercentage.value =
      Math.round(
        (competition.value.signees.filter((s) => !s.returned).length /
          competition.value.signees.length) *
          100 *
          100,
      ) / 100;

    hasGottenFishCount.value = 0;
    competition.value.signees.forEach((signee) => {
      if (signee.fishes.length) hasGottenFishCount.value++;
    });

    hasGottenFishPercentage.value =
      Math.round(
        (hasGottenFishCount.value / competition.value.signees.length) *
          100 *
          100,
      ) / 100;
  } catch (err) {
    competition.value = { name: "Kilpailua ei löytynyt tietokannasta..." };
    console.error(err.response?.data?.error || err.message);
  }
  loading.value = false;
}

// Runs when the component is created
// IF competition on localstorage
if (localStorage.getItem("competition") != null) {
  // update from database
  const competition = JSON.parse(localStorage.getItem("competition"));
  const competition_id = competition["_id"];
  refreshCompetition(competition_id);
} else {
  console.log("No competition in localstorage!");
}
</script>
