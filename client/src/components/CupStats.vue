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
          v-model="stats_tab"
          background-color="blue lighten-3"
          color="blue darken-4"
          grow
          show-arrows
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          center-active
        >
          <v-tabs-slider color="green darken-4"></v-tabs-slider>
          <v-tab href="#cupfishes">{{ $t("fishes") }}</v-tab>
          <v-tab href="#cupbiggestfishes">{{ $t("fishes") }}</v-tab>
          <v-tab href="#cupsignees">{{ $t("signees-signed") }}</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-tabs-items v-model="stats_tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-tab-item
        :value="'cupfishes'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row v-if="total_fishes_chart_data">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("biggest-amounts") }} ({{ $t("total-big") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="total-amounts-table"
                :headers="headers_cup_fishes_total"
                :items="cup_fishes_total"
                :loading="loading"
                item-key="index"
              >
                <template
                  v-for="(h, index) in headers_cup_fishes_total"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index"> {{ $t(header.text) }}</span>
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
            <v-card :dark="$store.getters.getTheme">
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("biggest-amounts") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="comp-amounts-table"
                :headers="headers_cup_fishes_competition"
                :items="cup_fishes_competition"
                :loading="loading"
                item-key="index"
              >
                <template
                  v-for="(h, index) in headers_cup_fishes_competition"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index"> {{ $t(header.text) }}</span>
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
      </v-tab-item>
      <v-tab-item
        :value="'cupbiggestfishes'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("cup.is") }} {{ $t("biggest-fishes") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_biggest_fishes"
                :items="cup_biggest_fishes"
                :loading="loading"
                item-key="index"
              >
                <template
                  v-for="(h, index) in headers_cup_biggest_fishes"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index"> {{ $t(header.text) }}</span>
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("cup.is") }} {{ $t("biggest-amounts") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="cup-biggest-amounts"
                :headers="headers_cup_biggest_amounts"
                :items="cup_biggest_amounts"
                :loading="loading"
                item-key="index"
              >
                <template
                  v-for="(h, index) in headers_cup_biggest_amounts"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index"> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.weight`]="{ item }">
                  <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item
        :value="'cupsignees'"
        v-bind:class="{
          inputarea: !$store.getters.getTheme,
          'inputarea-dark': $store.getters.getTheme,
        }"
      >
        <v-row v-if="cup" justify="center" style="margin-top: 10px">
          <v-card :dark="$store.getters.getTheme">
            <v-card-title v-if="cup.signees">
              <v-icon color="blue darken-2">mdi-account-group</v-icon>
              {{ $t("total-signees") }}: {{ cup.signees.length }}
            </v-card-title>
          </v-card>
        </v-row>
        <v-row v-if="cup_signees_chart_data && showCharts">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
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
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("total-signees") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="competition-signee-amount-table"
                :headers="headers_cup_signees"
                :items="cup_signees"
                :loading="loading"
                item-key="index"
              >
                <template
                  v-for="(h, index) in headers_cup_signees"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index"> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.signees`]="{ item }">
                  <v-chip>{{ item.signees.toLocaleString() }}</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import BarChart from "../components/BarChart";
import shared from "@/shared";
export default {
  name: "CupStats",
  components: {
    BarChart,
  },
  props: [
    "competitions",
    "cup",
    "all_signees",
    "biggest_fishes",
    "biggest_amounts",
    "loading",
  ],
  data() {
    return {
      showTables: true,
      showCharts: true,
      headers_cup_fishes_total: [
        { text: "fish", value: "name" },
        { text: "amount", value: "weights" },
      ],
      headers_cup_fishes_competition: [
        { text: "fish", value: "name" },
        { text: "comp.normal", value: "competition_name" },
        { text: "amount", value: "weights" },
      ],
      headers_cup_signees: [
        { text: "comp.normal", value: "competition_name" },
        { text: "amount", value: "signees" },
      ],
      headers_cup_biggest_fishes: [
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
        { text: "comp.normal", value: "competition_name" },
        { text: "fish", value: "fish_name" },
        { text: "weight", value: "weight" },
      ],
      headers_cup_biggest_amounts: [
        { text: "boat-number", value: "boat_number" },
        { text: "captain-name", value: "captain_name" },
        { text: "comp.normal", value: "competition_name" },
        { text: "fish", value: "fish_name" },
        { text: "weight", value: "weight" },
      ],
      stats_tab: null,
      cup_fishes_total: [],
      cup_fishes_competition: [],
      cup_biggest_fishes: [],
      cup_biggest_amounts: [],
      cup_signees: [],
      total_fishes_chart_data: null,
      competition_fishes_chart_data: null,
      cup_biggest_fishes_chart_data: null,
      cup_biggest_amounts_chart_data: null,
      cup_signees_chart_data: null,
    };
  },
  mounted() {
    this.calculateCupStatistics();
  },
  methods: {
    calculateCupStatistics() {
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
      this.competitions.forEach((competition) => {
        let comp_signees = this.all_signees.filter(
          (s) => s.competition_id === competition._id
        );
        comp_signees.forEach((s) => {
          s.fishes.forEach((fish) => {
            let fish_name = competition.fishes.find(
              (f) => f.id === fish.id
            ).name;
            if (fish.weights > 0) {
              let found_fish = all_fishes.findIndex(
                (f) => f.name.toUpperCase() === fish_name.toUpperCase()
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

            let comp_fish = this.cup_fishes_competition.find(
              (f) => f.comp_id === competition._id && f.id === fish.id
            );
            if (comp_fish) {
              comp_fish.weights += Number.isInteger(fish.weights)
                ? fish.weights
                : 0;
            } else {
              this.cup_fishes_competition.push({
                id: fish.id,
                name: fish_name,
                competition_name: competition.name,
                comp_id: competition._id,
                weights: fish.weights,
              });
            }
          });
        });

        competition_signees_count.push({
          competition_name: competition.name,
          signees: this.all_signees.filter(
            (c) => c.competition_id === competition._id
          ).length,
        });

        competition.fishes.forEach((fish) => {
          cup_fishes.push(fish.name);
        });
      });

      cup_fishes = Array.from(new Set(cup_fishes));

      cup_fishes.forEach((name) => {
        let fishes = this.biggest_fishes.filter((f) => f.name === name);

        if (fishes.length) {
          if (fishes[0].weight > 0) {
            let competition = this.competitions.find(
              (c) => c._id === fishes[0].competition_id
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

        fishes = this.biggest_amounts.filter((f) => f.name === name);
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
      this.cup_fishes_total = all_fishes.sort(shared.sortBy("weights", false));
      this.cup_fishes_total.forEach((fish) => {
        all_labels.push(fish.name);
        all_data.push(fish.weights);
      });
      this.total_fishes_chart_data = {
        labels: all_labels,
        datasets: [
          {
            label: "Weights",
            backgroundColor: shared.getRandomColors(all_data.length), // Green and red
            data: all_data, // Data
          },
        ],
      };

      this.cup_fishes_competition = this.cup_fishes_competition.sort(
        shared.sortBy("weights", false)
      );

      this.cup_fishes_competition.forEach((fish) => {
        if (fish.weights) {
          competition_labels.push(`${fish.name} (${fish.competition_name})`);
          competition_data.push(fish.weights);
        }
      });
      this.competition_fishes_chart_data = {
        labels: competition_labels,
        datasets: [
          {
            label: "Weights",
            backgroundColor: shared.getRandomColors(competition_data.length), // Green and red
            data: competition_data, // Data
          },
        ],
      };

      // Data for Suurimmat kalat tab
      this.cup_biggest_fishes = all_biggest_fishes.sort(
        shared.sortBy("weight", false)
      );
      this.cup_biggest_fishes.forEach((item) => {
        all_biggest_fishes_labels.push(
          `${item.fish_name} (${item.boat_number}), ${item.competition_name}`
        );
        all_biggest_fishes_data.push(item.weight);
      });
      this.cup_biggest_fishes_chart_data = {
        labels: all_biggest_fishes_labels,
        datasets: [
          {
            label: "Weights",
            backgroundColor: shared.getRandomColors(
              all_biggest_fishes_data.length
            ), // Green and red
            data: all_biggest_fishes_data, // Data
          },
        ],
      };

      // Data for Suurimmat kalat tab
      this.cup_biggest_amounts = all_biggest_amounts.sort(
        shared.sortBy("weight", false)
      );

      this.cup_biggest_amounts.forEach((item) => {
        all_biggest_amounts_labels.push(
          `${item.fish_name} (${item.boat_number}), ${item.competition_name}`
        );
        all_biggest_amounts_data.push(item.weight);
      });
      this.cup_biggest_amounts_chart_data = {
        labels: all_biggest_amounts_labels,
        datasets: [
          {
            label: "Weights",
            backgroundColor: shared.getRandomColors(
              all_biggest_amounts_data.length
            ), // Green and red
            data: all_biggest_amounts_data, // Data
          },
        ],
      };

      // Data for Kilpailijat tab
      this.cup_signees = competition_signees_count.sort(
        shared.sortBy("signees", false)
      );
      this.cup_signees.forEach((item) => {
        all_signees_labels.push(item.competition_name);
        all_signees_data.push(item.signees);
      });

      this.cup_signees_chart_data = {
        labels: all_signees_labels,
        datasets: [
          {
            label: this.$t("amount"),
            backgroundColor: shared.getRandomColors(all_signees_data.length), // Green and red
            data: all_signees_data, // Data
          },
        ],
      };
    },
  },
};
</script>
<style scoped></style>
