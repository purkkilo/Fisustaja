<template>
  <div>
    <v-row style="margin-top: 10px">
      <v-col
        ><h1>{{ $t("general-statistics") }}</h1></v-col
      >
    </v-row>
    <v-row>
      <v-col>
        <v-tabs
          slider-color="green-darken-4"
          v-model="stats_tab"
          bg-color="blue-lighten-3"
          color="blue-darken-4"
          grow
          show-arrows
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          center-active
        >
          <v-tab value="cupfishes">{{ $t("fishes") }}</v-tab>
          <v-tab value="cupbiggestfishes">{{ $t("fishes") }}</v-tab>
          <v-tab value="cupsignees">{{ $t("signees-signed") }}</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-window v-model="stats_tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-window-item
        :value="'cupfishes'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row v-if="total_fishes_chart_data">
          <v-col>
            <v-card>
              <v-card-title>
                {{ $t("biggest-amounts") }} ({{ $t("total-big") }})
              </v-card-title>
              <bar-chart
                :chart-data="total_fishes_chart_data"
                chart-id="total_fishes_signee_chart"
                :title="$t('biggest-amounts') + ' (' + $t('total-big') + ')'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_fishes_total.length && showTables">
          <v-col>
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center">
                <p class="flow-text">
                  {{ $t("biggest-amounts") }} ({{ $t("total-big") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="total-amounts-table"
                :headers="tableHeaders(headers_cup_fishes_total)"
                :items="cup_fishes_total"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="(h, index) in headers_cup_fishes_total"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.weights`]="{ item }">
                  <v-chip
                    >{{ (item.weights / 1000).toLocaleString() }} kg</v-chip
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competition_fishes_chart_data">
          <v-col>
            <v-card>
              <v-card-title>
                {{ $t("biggest-amounts") }} ({{ $t("comp.by") }})
              </v-card-title>
              <bar-chart
                :chart-data="competition_fishes_chart_data"
                chart-id="competition_fishes_signee_chart"
                :title="$t('biggest-amounts') + ' (' + $t('comp.by') + ')'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_fishes_competition.length && showTables">
          <v-col>
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center">
                <p class="flow-text">
                  {{ $t("biggest-amounts") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="comp-amounts-table"
                :headers="tableHeaders(headers_cup_fishes_competition)"
                :items="cup_fishes_competition"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="(h, index) in headers_cup_fishes_competition"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.weights`]="{ item }">
                  <v-chip
                    >{{ (item.weights / 1000).toLocaleString() }} kg</v-chip
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item
        :value="'cupbiggestfishes'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row
          v-if="
            cup_biggest_fishes.length &&
            competition_fishes_chart_data &&
            showCharts
          "
        >
          <v-col>
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center"
                >{{ $t("cup.is") }} {{ $t("biggest-fishes") }}</v-card-title
              >
              <bar-chart
                :chart-data="cup_biggest_fishes_chart_data"
                chart-id="cup_biggest_fishes_chart"
                v-bind:title="$t('cup.is') + ' ' + $t('biggest-fishes')"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_biggest_fishes.length && showTables">
          <v-col>
            <v-card>
              <v-card-title>
                <p class="flow-text">
                  {{ $t("cup.is") }} {{ $t("biggest-fishes") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="tableHeaders(headers_cup_biggest_fishes)"
                :items="cup_biggest_fishes"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="(h, index) in headers_cup_biggest_fishes"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.weight`]="{ item }">
                  <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competition_fishes_chart_data && showCharts">
          <v-col>
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center"
                >{{ $t("cup.is") }} {{ $t("biggest-amounts") }}</v-card-title
              >
              <bar-chart
                :chart-data="cup_biggest_amounts_chart_data"
                chart-id="cup_biggest_amounts_chart"
                v-bind:title="$t('cup.is') + ' ' + $t('biggest-amounts')"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_biggest_amounts.length && showTables">
          <v-col>
            <v-card>
              <v-card-title>
                <p class="flow-text">
                  {{ $t("cup.is") }} {{ $t("biggest-amounts") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="cup-biggest-amounts"
                :headers="tableHeaders(headers_cup_biggest_amounts)"
                :items="cup_biggest_amounts"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="(h, index) in headers_cup_biggest_amounts"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.weight`]="{ item }">
                  <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item
        :value="'cupsignees'"
        v-bind:class="{
          inputarea: !store.getTheme,
          'inputarea-dark': store.getTheme,
        }"
      >
        <v-row class="justify-center" v-if="cup" style="margin-top: 10px">
          <v-card>
            <v-card-title v-if="cup.signees">
              <v-icon color="blue-darken-2">mdi-account-group</v-icon>
              {{ $t("total-signees") }}: {{ cup.signees.length }}
            </v-card-title>
          </v-card>
        </v-row>
        <v-row v-if="cup_signees_chart_data && showCharts">
          <v-col>
            <v-card>
              <v-card-title>
                {{ $t("total-signees") }} ({{ $t("comp.by") }})
              </v-card-title>
              <bar-chart
                :chart-data="cup_signees_chart_data"
                chart-id="cup_signees_chart"
                v-bind:title="$t('total-signees') + ' (' + $t('comp.by') + ')'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_signees.length && showTables">
          <v-col>
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center">
                <p class="flow-text">
                  {{ $t("total-signees") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="competition-signee-amount-table"
                :headers="tableHeaders(headers_cup_signees)"
                :items="cup_signees"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="(h, index) in headers_cup_signees"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.signees`]="{ item }">
                  <v-chip>{{ item.signees.toLocaleString() }}</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </div>
</template>
<script setup>
import { tableHeaders } from "@/utils/tableHeaders";
import { useMainStore } from "@/store";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import BarChart from "../components/BarChart.vue";
import { getRandomColors } from "@/utils/colors";
import { sortBy } from "@/utils/format";

const store = useMainStore();
defineOptions({ name: "CupStats" });
const props = defineProps([
  "competitions",
  "cup",
  "all_signees",
  "biggest_fishes",
  "biggest_amounts",
  "loading",
]);
const { t } = useI18n();

const showTables = ref(true);
const showCharts = ref(true);
const headers_cup_fishes_total = ref([
  { text: "fish", value: "name" },
  { text: "amount", value: "weights" },
]);
const headers_cup_fishes_competition = ref([
  { text: "fish", value: "name" },
  { text: "comp.normal", value: "competition_name" },
  { text: "amount", value: "weights" },
]);
const headers_cup_signees = ref([
  { text: "comp.normal", value: "competition_name" },
  { text: "amount", value: "signees" },
]);
const headers_cup_biggest_fishes = ref([
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "comp.normal", value: "competition_name" },
  { text: "fish", value: "fish_name" },
  { text: "weight", value: "weight" },
]);
const headers_cup_biggest_amounts = ref([
  { text: "boat-number", value: "boat_number" },
  { text: "captain-name", value: "captain_name" },
  { text: "comp.normal", value: "competition_name" },
  { text: "fish", value: "fish_name" },
  { text: "weight", value: "weight" },
]);
const stats_tab = ref(null);
const cup_fishes_total = ref([]);
const cup_fishes_competition = ref([]);
const cup_biggest_fishes = ref([]);
const cup_biggest_amounts = ref([]);
const cup_signees = ref([]);
const total_fishes_chart_data = ref(null);
const competition_fishes_chart_data = ref(null);
const cup_biggest_fishes_chart_data = ref(null);
const cup_biggest_amounts_chart_data = ref(null);
const cup_signees_chart_data = ref(null);

function calculateCupStatistics() {
  let all_fishes = [];
  let competition_signees_count = [];
  let all_signees_labels = [];
  let all_biggest_fishes = [];
  let all_biggest_amounts = [];
  let all_biggest_fishes_labels = [];
  let all_biggest_amounts_labels = [];
  let all_biggest_fishes_data = [];
  let all_biggest_amounts_data = [];
  let all_signees_data = [];
  let all_labels = [];
  let all_data = [];
  let competition_labels = [];
  let competition_data = [];
  let cup_fishes = [];
  props.competitions.forEach((competition) => {
    let comp_signees = props.all_signees.filter(
      (s) => s.competition_id === competition._id,
    );
    comp_signees.forEach((s) => {
      s.fishes.forEach((fish) => {
        let fish_name = competition.fishes.find((f) => f.id === fish.id).name;
        if (fish.weights > 0) {
          let found_fish = all_fishes.findIndex(
            (f) => f.name.toUpperCase() === fish_name.toUpperCase(),
          );
          if (found_fish > -1) {
            all_fishes[found_fish].weights += fish.weights;
          } else {
            all_fishes.push({
              id: found_fish,
              name: fish_name,
              weights: fish.weights,
            });
          }
        }

        let comp_fish = cup_fishes_competition.value.find(
          (f) => f.comp_id === competition._id && f.id === fish.id,
        );
        const fish_weight = Number.isInteger(fish.weights) ? fish.weights : 0;
        if (comp_fish) {
          comp_fish.weights += fish_weight;
          console.log(
            "comp_fish",
            comp_fish.name,
            comp_fish.id,
            comp_fish.weights,
          );
          console.log("fish", fish_name, fish.id, fish.weights);
        } else {
          cup_fishes_competition.value.push({
            id: fish.id,
            name: fish_name,
            competition_name: competition.name,
            comp_id: competition._id,
            weights: fish_weight,
          });
        }
      });
    });

    competition_signees_count.push({
      competition_name: competition.name,
      signees: props.all_signees.filter(
        (c) => c.competition_id === competition._id,
      ).length,
    });

    competition.fishes.forEach((fish) => {
      cup_fishes.push(fish.name);
    });
  });

  cup_fishes = Array.from(new Set(cup_fishes));

  cup_fishes.forEach((name) => {
    let fishes = props.biggest_fishes.filter((f) => f.name === name);

    if (fishes.length) {
      if (fishes[0].weight > 0) {
        let competition = props.competitions.find(
          (c) => c._id === fishes[0].competition_id,
        );
        all_biggest_fishes.push({
          id: fishes[0].id,
          boat_number: fishes[0].boat_number,
          captain_name: fishes[0].captain_name,
          competition_name: competition.name,
          fish_name: name,
          weight: fishes[0].weight,
        });
      }
    }

    fishes = props.biggest_amounts.filter((f) => f.name === name);
    if (fishes.length) {
      if (fishes[0].weight > 0) {
        all_biggest_amounts.push({
          boat_number: fishes[0].boat_number,
          captain_name: fishes[0].captain_name,
          competition_name: fishes[0].competition_name,
          fish_name: name,
          weight: fishes[0].weight,
        });
      }
    }
  });

  // Data for Kalasaaliit tab
  cup_fishes_total.value = all_fishes.sort(sortBy("weights", false));
  cup_fishes_total.value.forEach((fish) => {
    all_labels.push(fish.name);
    all_data.push(fish.weights);
  });
  total_fishes_chart_data.value = {
    labels: all_labels,
    datasets: [
      {
        label: "Weights",
        backgroundColor: getRandomColors(all_data.length), // Green and red
        data: all_data, // Data
      },
    ],
  };

  cup_fishes_competition.value = cup_fishes_competition.value.sort(
    sortBy("weights", false),
  );

  cup_fishes_competition.value.forEach((fish) => {
    if (fish.weights) {
      competition_labels.push(`${fish.name} (${fish.competition_name})`);
      competition_data.push(fish.weights);
    }
  });
  competition_fishes_chart_data.value = {
    labels: competition_labels,
    datasets: [
      {
        label: "Weights",
        backgroundColor: getRandomColors(competition_data.length), // Green and red
        data: competition_data, // Data
      },
    ],
  };

  // Data for Suurimmat kalat tab
  cup_biggest_fishes.value = all_biggest_fishes.sort(sortBy("weight", false));
  cup_biggest_fishes.value.forEach((item) => {
    all_biggest_fishes_labels.push(
      `${item.fish_name} (${item.boat_number}), ${item.competition_name}`,
    );
    all_biggest_fishes_data.push(item.weight);
  });
  cup_biggest_fishes_chart_data.value = {
    labels: all_biggest_fishes_labels,
    datasets: [
      {
        label: "Weights",
        backgroundColor: getRandomColors(all_biggest_fishes_data.length), // Green and red
        data: all_biggest_fishes_data, // Data
      },
    ],
  };

  // Data for Suurimmat kalat tab
  cup_biggest_amounts.value = all_biggest_amounts.sort(sortBy("weight", false));

  cup_biggest_amounts.value.forEach((item) => {
    all_biggest_amounts_labels.push(
      `${item.fish_name} (${item.boat_number}), ${item.competition_name}`,
    );
    all_biggest_amounts_data.push(item.weight);
  });
  cup_biggest_amounts_chart_data.value = {
    labels: all_biggest_amounts_labels,
    datasets: [
      {
        label: "Weights",
        backgroundColor: getRandomColors(all_biggest_amounts_data.length), // Green and red
        data: all_biggest_amounts_data, // Data
      },
    ],
  };

  // Data for Kilpailijat tab
  cup_signees.value = competition_signees_count.sort(sortBy("signees", false));
  cup_signees.value.forEach((item) => {
    all_signees_labels.push(item.competition_name);
    all_signees_data.push(item.signees);
  });

  cup_signees_chart_data.value = {
    labels: all_signees_labels,
    datasets: [
      {
        label: t("amount"),
        backgroundColor: getRandomColors(all_signees_data.length), // Green and red
        data: all_signees_data, // Data
      },
    ],
  };
}

onMounted(() => {
  calculateCupStatistics();
});
</script>
<style scoped></style>
