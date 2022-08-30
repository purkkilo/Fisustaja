<template>
  <div>
    <!-- Save as pdf button, is disabled if there are no results -->
    <v-row style="padding-top: 50px">
      <v-col md="3" offset-md="8">
        <v-btn
          large
          outlined
          color="red lighten-2"
          :dark="$store.getters.getTheme"
          :loading="loading"
          @click="
            $emit('dialog', {
              pdf: 'Tilastoja',
              pdfDialog: true,
            })
          "
          :disabled="!biggest_amounts.length"
          style="margin-bottom: 20px"
        >
          <v-icon color="red">mdi-file-pdf-box</v-icon> Lataa pdf</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="competition">
      <v-col>
        <v-row
          style="min-height: 400px"
          v-if="competition.normal_points.length"
        >
          <v-col sm="12" md="5" offset-md="1" style="margin-bottom: 50px">
            <div v-if="fishes_chart_data">
              <v-hover v-slot="{ hover }">
                <v-card
                  :dark="$store.getters.getTheme"
                  :elevation="hover ? 20 : 5"
                  :class="{ 'on-hover': hover }"
                  style="padding: 20px"
                >
                  <v-card-title
                    ><h4 class="headline mb-1">
                      {{ fishes_chart_title }}
                    </h4></v-card-title
                  >
                  <doughnut-chart
                    :chart-data="fishes_chart_data"
                    chart-id="fishes_chart"
                    v-bind:title="fishes_chart_title"
                  />
                </v-card>
              </v-hover>
            </div>
          </v-col>
          <v-col sm="12" md="5">
            <div v-if="signee_chart_data">
              <v-hover v-slot="{ hover }">
                <v-card
                  :dark="$store.getters.getTheme"
                  :elevation="hover ? 20 : 5"
                  :class="{ 'on-hover': hover }"
                  style="padding: 20px"
                >
                  <v-card-title
                    ><h4 class="headline mb-1">
                      {{ signee_chart_title }}
                    </h4></v-card-title
                  >
                  <pie-chart
                    :chart-data="signee_chart_data"
                    chart-id="signee_chart"
                    v-bind:title="signee_chart_title"
                  />
                </v-card>
              </v-hover>
            </div>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col md="12">
            <p
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
            >
              Ei tuloksia, vielä...
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="competition">
      <v-col md="8" offset-md="2">
        <v-row>
          <v-col>
            <v-hover v-slot="{ hover }">
              <v-card
                :dark="$store.getters.getTheme"
                :elevation="hover ? 20 : 5"
                :class="{ 'on-hover': hover }"
                style="padding: 20px"
              >
                <v-card-title class="text-center"
                  ><p class="display-1">Kalalajien määritykset</p></v-card-title
                >
                <v-list outlined>
                  <div v-for="(fish, index) in calculated_weights" :key="index">
                    <v-list-item>
                      <v-list-item-title>{{ fish.name }}</v-list-item-title>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle
                        :class="
                          getMultiplierTextColor(fish.multiplier) + '--text'
                        "
                      >
                        <b> x {{ fish.multiplier }}</b>
                      </v-list-item-subtitle>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="blue--text">
                        <span
                          ><b>{{ fish.minsize }} cm</b></span
                        >
                      </v-list-item-subtitle>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="green--text">
                        <b>
                          {{
                            fish.weights
                              ? Math.round(
                                  (fish.weights / 1000 + Number.EPSILON) * 100
                                ) / 100
                              : 0
                          }}
                          kg
                        </b>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                  </div>
                  <v-list-item>
                    <v-list-item-title> Saalista yhteensä </v-list-item-title>
                    <v-list-item-subtitle>
                      <h4 class="green--text">
                        <b
                          >{{
                            Math.round(
                              (calculated_total / 1000 + Number.EPSILON) * 100
                            ) / 100
                          }}
                          kg</b
                        >
                      </h4></v-list-item-subtitle
                    >
                  </v-list-item>
                </v-list>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-hover v-slot="{ hover }">
              <v-card
                :dark="$store.getters.getTheme"
                :elevation="hover ? 20 : 5"
                :class="{ 'on-hover': hover }"
                style="padding: 20px"
              >
                <v-card-title class="text-center"
                  ><p class="display-1">Yleisiä tilastoja</p></v-card-title
                >
                <v-list outlined>
                  <v-list-item>
                    <v-list-item-title
                      ><b>Cup pistekerroin</b></v-list-item-title
                    >
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle
                      :class="
                        getMultiplierTextColor(
                          competition.cup_points_multiplier
                        ) + '--text'
                      "
                    >
                      <b>x {{ competition.cup_points_multiplier }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-title>
                      <b>Ilmoittautuneita yhteensä</b>
                    </v-list-item-title>
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle class="green--text">
                      <b>{{ signees.length }} venettä</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-title>
                      <b>Saalista saaneita</b>
                    </v-list-item-title>
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle
                      v-if="$store.getters.getPointSignees.length"
                      class="green--text"
                    >
                      <b
                        >{{
                          Math.round(
                            ($store.getters.getPointSignees.length /
                              competition.signees.length) *
                              100 *
                              100
                          ) / 100
                        }}% ({{ $store.getters.getPointSignees.length }} /
                        {{ signees.length }})</b
                      >
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="red-text" v-else
                      ><b>0% (0/0)</b></v-list-item-subtitle
                    >
                  </v-list-item>
                </v-list>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import PieChart from "@/components/PieChart";
import DoughnutChart from "@/components/DoughnutChart.vue";
import { getMultiplierTextColor } from "@/shared";

export default {
  name: "Stats",
  components: {
    PieChart,
    DoughnutChart,
  },
  props: [
    "competition",
    "signees",
    "loading",
    "biggest_amounts",
    "fishes_chart_title",
    "fishes_chart_data",
    "signee_chart_title",
    "signee_chart_data",
    "calculated_weights",
    "calculated_total",
  ],
  data() {
    return {};
  },
  created() {
    this.getMultiplierTextColor = getMultiplierTextColor;
  },
  methods: {},
};
</script>
<style scoped></style>
