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
          <v-tab value="cupbiggestfishes">{{ $t("biggest-fishes") }}</v-tab>
          <v-tab value="cupsignees">{{ $t("signees-signed") }}</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-window v-model="stats_tab" style="background: rgba(0, 0, 0, 0.4)">
      <v-window-item
        :value="'cupfishes'"
        :class="{
          inputarea: !store.isDark,
          'inputarea-dark': store.isDark,
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
                <p class="text-body-large">
                  {{ $t("biggest-amounts") }} ({{ $t("total-big") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="total-amounts-table"
                :headers="headers_cup_fishes_total"
                :items="cup_fishes_total"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="h in headers_cup_fishes_total"
                  :key="h.key"
                  v-slot:[`header.${h.key}`]="{ column: header }"
                >
                  <span> {{ $t(header.title) }}</span>
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
                <p class="text-body-large">
                  {{ $t("biggest-amounts") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="comp-amounts-table"
                :headers="headers_cup_fishes_competition"
                :items="cup_fishes_competition"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="h in headers_cup_fishes_competition"
                  :key="h.key"
                  v-slot:[`header.${h.key}`]="{ column: header }"
                >
                  <span> {{ $t(header.title) }}</span>
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
        :class="{
          inputarea: !store.isDark,
          'inputarea-dark': store.isDark,
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
                <p class="text-body-large">
                  {{ $t("cup.is") }} {{ $t("biggest-fishes") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="normal-table"
                :headers="headers_cup_biggest_fishes"
                :items="cup_biggest_fishes"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="h in headers_cup_biggest_fishes"
                  :key="h.key"
                  v-slot:[`header.${h.key}`]="{ column: header }"
                >
                  <span> {{ $t(header.title) }}</span>
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
                <p class="text-body-large">
                  {{ $t("cup.is") }} {{ $t("biggest-amounts") }}
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="cup-biggest-amounts"
                :headers="headers_cup_biggest_amounts"
                :items="cup_biggest_amounts"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="h in headers_cup_biggest_amounts"
                  :key="h.key"
                  v-slot:[`header.${h.key}`]="{ column: header }"
                >
                  <span> {{ $t(header.title) }}</span>
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
        :class="{
          inputarea: !store.isDark,
          'inputarea-dark': store.isDark,
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
                <p class="text-body-large">
                  {{ $t("total-signees") }} ({{ $t("comp.by") }})
                </p>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                id="competition-signee-amount-table"
                :headers="headers_cup_signees"
                :items="cup_signees"
                :loading="loading"
                item-value="index"
              >
                <template
                  v-for="h in headers_cup_signees"
                  :key="h.key"
                  v-slot:[`header.${h.key}`]="{ column: header }"
                >
                  <span> {{ $t(header.title) }}</span>
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
import { useMainStore } from "@/store";
import { useCupStats } from "@/composables/useCupStats";
import BarChart from "../components/BarChart.vue";

const store = useMainStore();
defineOptions({ name: "CupStats" });
const props = defineProps({
  competitions: { type: Array, default: () => [] },
  cup: { type: Object, default: null },
  all_signees: { type: Array, default: () => [] },
  biggest_fishes: { type: Array, default: () => [] },
  biggest_amounts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const {
  stats_tab,
  showTables,
  showCharts,
  headers_cup_fishes_total,
  headers_cup_fishes_competition,
  headers_cup_signees,
  headers_cup_biggest_fishes,
  headers_cup_biggest_amounts,
  cup_fishes_total,
  cup_fishes_competition,
  cup_biggest_fishes,
  cup_biggest_amounts,
  cup_signees,
  total_fishes_chart_data,
  competition_fishes_chart_data,
  cup_biggest_fishes_chart_data,
  cup_biggest_amounts_chart_data,
  cup_signees_chart_data,
} = useCupStats(props);
</script>
<style scoped></style>
