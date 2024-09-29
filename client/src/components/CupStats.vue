<template>
  <div>
    <v-row>
      <v-col><h1>Tilastoja</h1></v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card :dark="$store.getters.getTheme">
          <v-row align="center" justify="center">
            <v-col cols="3">
              <v-checkbox
                v-model="showTables"
                label="Näytä taulukot"
                :disabled="!competitions.length"
                color="indigo darken-3"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
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
          <v-tab href="#cupfishes">Kalasaaliit</v-tab>
          <v-tab href="#cupbiggestfishes">Suurimmat kalat</v-tab>
          <v-tab href="#cupsignees">Kilpailijat</v-tab>
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
              <v-card-title> Cupin kalasaaliit (Total) </v-card-title>
              <bar-chart
                :chart-data="total_fishes_chart_data"
                chart-id="total_fishes_signee_chart"
                v-bind:title="'Cupin kalasaaliit (Total)'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competition_fishes_chart_data">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title> Cupin kalasaaliit (Kilpailuittain) </v-card-title>
              <bar-chart
                :chart-data="competition_fishes_chart_data"
                chart-id="competition_fishes_signee_chart"
                v-bind:title="'Cupin kalasaaliit (Kilpailuittain)'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_fishes_competition.length && showTables">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Cupin kalasaaliit (Kilpailuittain)</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_fishes_competition"
                :items="cup_fishes_competition"
                :loading="loading"
              >
                <template v-slot:[`item.weights`]="{ item }">
                  <v-chip
                    >{{ (item.weights / 100).toLocaleString() }} kg</v-chip
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_fishes_total.length && showTables">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Cupin kalasaaliit (Total)</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_fishes_total"
                :items="cup_fishes_total"
                :loading="loading"
              >
                <template v-slot:[`item.weights`]="{ item }">
                  <v-chip
                    >{{ (item.weights / 100).toLocaleString() }} kg</v-chip
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
              <v-card-title> Cupin suurimmat kalat </v-card-title>
              <bar-chart
                :chart-data="cup_biggest_fishes_chart_data"
                chart-id="cup_biggest_fishes_chart"
                v-bind:title="'Cupin suurimmat kalat'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="competition_fishes_chart_data && showCharts">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title> Cupin suurimmat kalasaaliit </v-card-title>
              <bar-chart
                :chart-data="cup_biggest_amounts_chart_data"
                chart-id="cup_biggest_amounts_chart"
                v-bind:title="'Cupin suurimmat kalasaaliit'"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="cup_biggest_fishes.length && showTables">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Cupin suurimmat kalat</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_biggest_fishes"
                :items="cup_biggest_fishes"
                :loading="loading"
              >
                <template v-slot:[`item.weight`]="{ item }">
                  <v-chip>{{ item.weight.toLocaleString() }} g</v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_biggest_amounts.length && showTables">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Cupin suurimmat kalasaaliit</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_biggest_amounts"
                :items="cup_biggest_amounts"
                :loading="loading"
              >
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
        <v-row v-if="cup"
          ><v-col offset-md="4" md="5">
            <v-card :dark="$store.getters.getTheme">
              <v-card-title v-if="cup.signees">
                <v-icon color="blue darken-2">mdi-account-group</v-icon>
                Yhteensä ilmoittautuneita {{ cup.signees.length }} kpl
              </v-card-title>
            </v-card>
          </v-col></v-row
        >
        <v-row v-if="cup_signees_chart_data && showCharts">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title> Kilpailujen osallistujamäärät </v-card-title>
              <bar-chart
                :chart-data="cup_signees_chart_data"
                chart-id="cup_signees_chart"
                v-bind:title="'Kilpailujen osallistujamäärät'"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="cup_signees.length && showTables">
          <v-col>
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">Kilpailujen osallistujamäärät</p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_signees"
                :items="cup_signees"
                :loading="loading"
              >
                <template v-slot:[`item.signees`]="{ item }">
                  <v-chip>{{ item.signees.toLocaleString() }} kpl</v-chip>
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
  props: ["competitions", "cup", "loading"],
  data() {
    return {
      showTables: false,
      showCharts: true,
      headers_cup_fishes_total: [
        { text: "Kalan nimi", value: "name" },
        { text: "Määrä", value: "weights" },
      ],
      headers_cup_fishes_competition: [
        { text: "Kalan nimi", value: "name" },
        { text: "Kilpailu", value: "comp_name" },
        { text: "Määrä", value: "weights" },
      ],
      headers_cup_signees: [
        { text: "Kilpailu", value: "comp_name" },
        { text: "Määrä", value: "signees" },
      ],
      headers_cup_biggest_fishes: [
        { text: "Kilp.nro", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Kilpailu", value: "comp_name" },
        { text: "Kala", value: "fish_name" },
        { text: "Paino", value: "weight" },
      ],
      headers_cup_biggest_amounts: [
        { text: "Kilp.nro", value: "boat_number" },
        { text: "Kippari", value: "captain_name" },
        { text: "Kilpailu", value: "comp_name" },
        { text: "Kala", value: "fish_name" },
        { text: "Paino", value: "weight" },
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
      let all_signees = [];
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
      this.competitions.forEach((competition) => {
        competition.fishes.forEach((fish) => {
          if (fish.weights > 0) {
            this.cup_fishes_competition.push({
              name: fish.name,
              comp_name: competition.name,
              weights: fish.weights,
            });

            let found_fish = all_fishes.findIndex((f) => f.name === fish.name);
            if (found_fish > -1) {
              all_fishes[found_fish].weights += fish.weights;
            } else {
              all_fishes.push({ name: fish.name, weights: fish.weights });
            }
          }
        });

        all_signees.push({
          comp_name: competition.name,
          signees: competition.signees.length,
        });

        for (const fish in competition.biggest_fishes) {
          let fishes = competition.biggest_fishes[fish].sort(
            shared.sortBy("weight", false)
          );
          if (fishes.length) {
            if (fishes[0].weight > 0) {
              all_biggest_fishes.push({
                boat_number: fishes[0].boat_number,
                captain_name: fishes[0].captain_name,
                comp_name: competition.name,
                fish_name: fish,
                weight: fishes[0].weight,
              });
            }
          }
        }

        for (const fish in competition.biggest_amounts) {
          let fishes = competition.biggest_amounts[fish].sort(
            shared.sortBy("weight", false)
          );

          if (fishes.length) {
            if (fishes[0].weight > 0) {
              all_biggest_amounts.push({
                boat_number: fishes[0].boat_number,
                captain_name: fishes[0].captain_name,
                comp_name: competition.name,
                fish_name: fish,
                weight: fishes[0].weight,
              });
            }
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
            label: "Määrä",
            backgroundColor: shared.getRandomColors(all_data.length), // Green and red
            data: all_data, // Data
          },
        ],
      };

      this.cup_fishes_competition = this.cup_fishes_competition.sort(
        shared.sortBy("weights", false)
      );
      this.cup_fishes_competition.forEach((fish) => {
        competition_labels.push(`${fish.name} (${fish.comp_name})`);
        competition_data.push(fish.weights);
      });
      this.competition_fishes_chart_data = {
        labels: competition_labels,
        datasets: [
          {
            label: "Määrä",
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
          `${item.fish_name}, Vene (${item.boat_number})`
        );
        all_biggest_fishes_data.push(item.weight);
      });
      this.cup_biggest_fishes_chart_data = {
        labels: all_biggest_fishes_labels,
        datasets: [
          {
            label: "Paino",
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
          `${item.fish_name} | Venekunta nro. (${item.boat_number})`
        );
        all_biggest_amounts_data.push(item.weight);
      });
      this.cup_biggest_amounts_chart_data = {
        labels: all_biggest_amounts_labels,
        datasets: [
          {
            label: "Paino",
            backgroundColor: shared.getRandomColors(
              all_biggest_amounts_data.length
            ), // Green and red
            data: all_biggest_amounts_data, // Data
          },
        ],
      };

      // Data for Kilpailijat tab
      this.cup_signees = all_signees.sort(shared.sortBy("signees", false));
      this.cup_signees.forEach((item) => {
        all_signees_labels.push(item.comp_name);
        all_signees_data.push(item.signees);
      });

      this.cup_signees_chart_data = {
        labels: all_signees_labels,
        datasets: [
          {
            label: "Kilpailijamäärä",
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
