<template>
  <div>
    <!-- Save as pdf button, is disabled if there are no results -->
    <v-row style="padding-top: 50px">
      <v-col md="3" offset-md="8">
        <v-btn
          color="red-lighten-2"
          :loading="loading"
          @click="
            $emit('dialog', {
              pdf: 'Tilastoja',
              pdfDialog: true,
            })
          "
          :disabled="!biggest_amounts.length"
          style="margin-bottom: 20px"
          size="large"
          variant="outlined"
        >
          <v-icon color="red">mdi-file-pdf-box</v-icon>
          {{ $t("download") }} pdf</v-btn
        >
      </v-col>
    </v-row>
    <v-row v-if="competition && normal_points">
      <v-col>
        <v-row style="min-height: 400px" v-if="normal_points.length">
          <v-col sm="12" md="5" offset-md="1" style="margin-bottom: 50px">
            <div v-if="fishes_chart_data">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 5 : 2"
                  :class="{ 'on-hover': isHovering }"
                  style="padding: 20px"
                >
                  <v-card-title
                    ><h4 class="text-headline-small mb-1">
                      {{ $t(fishes_chart_title) }}
                    </h4></v-card-title
                  >
                  <doughnut-chart
                    :chart-data="fishes_chart_data"
                    chart-id="fishes_chart"
                    v-bind:title="$t(fishes_chart_title)"
                  />
                </v-card>
              </v-hover>
            </div>
          </v-col>
          <v-col sm="12" md="5">
            <div v-if="signee_chart_data">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  v-bind="props"
                  :elevation="isHovering ? 5 : 2"
                  :class="{ 'on-hover': isHovering }"
                  style="padding: 20px"
                >
                  <v-card-title
                    ><h4 class="text-headline-small mb-1">
                      {{ $t(signee_chart_title) }}
                    </h4></v-card-title
                  >
                  <pie-chart
                    :chart-data="signee_chart_data"
                    chart-id="signee_chart"
                    v-bind:title="$t(signee_chart_title)"
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
                'text-white': store.getTheme,
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
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 5 : 2"
                :class="{ 'on-hover': isHovering }"
                style="padding: 20px"
              >
                <v-card-title class="text-center"
                  ><p class="text-headline-large">
                    {{ $t("fish-specs") }}
                  </p></v-card-title
                >
                <v-list border>
                  <div v-for="(fish, index) in competition.fishes" :key="index">
                    <v-list-item>
                      <v-list-item-title>{{ fish.name }}</v-list-item-title>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle
                        :class="'text-' + getMultiplierTextColor(fish.multiplier)"
                      >
                        <b> x {{ fish.multiplier }}</b>
                      </v-list-item-subtitle>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="text-blue">
                        <span
                          ><b>{{ fish.minsize }} cm</b></span
                        >
                      </v-list-item-subtitle>
                      <v-divider vertical></v-divider>
                      <v-list-item-subtitle class="text-green">
                        <b>
                          {{
                            fish.weights
                              ? Math.round(
                                  (fish.weights / 1000 + Number.EPSILON) * 100,
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
                    <v-list-item-title>{{
                      $t("total-amount")
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <h4 class="text-green">
                        <b
                          >{{
                            Math.round(
                              (competition.total_weights / 1000 +
                                Number.EPSILON) *
                                100,
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
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 5 : 2"
                :class="{ 'on-hover': isHovering }"
                style="padding: 20px; margin-bottom: 20px"
              >
                <v-card-title class="text-center"
                  ><p class="text-headline-large">
                    {{ $t("general-statistics") }}
                  </p></v-card-title
                >
                <v-list border>
                  <v-list-item>
                    <v-list-item-title
                      ><b
                        >{{ $t("cup.normal") }} {{ $t("multiplier") }}</b
                      ></v-list-item-title
                    >
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle
                      :class="
                        'text-' +
                        getMultiplierTextColor(
                          competition.cup_points_multiplier,
                        )
                      "
                    >
                      <b>x {{ competition.cup_points_multiplier }}</b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-title>
                      <b>{{ $t("total-signees") }}</b>
                    </v-list-item-title>
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle class="text-green">
                      <b>{{ signees.length }} </b>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-title>
                      <b>{{ $t("comp-overview.gotten-fish") }}</b>
                    </v-list-item-title>
                    <v-divider vertical></v-divider>
                    <v-list-item-subtitle
                      v-if="hasGottenFishCount"
                      class="text-green"
                    >
                      <b
                        >{{
                          Math.round(
                            (hasGottenFishCount / signees.length) * 100 * 100,
                          ) / 100
                        }}% ({{ hasGottenFishCount }} / {{ signees.length }})</b
                      >
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="text-red" v-else
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
<script setup>
import { useMainStore } from "@/store";
import PieChart from "../PieChart.vue";
import DoughnutChart from "../DoughnutChart.vue";
import { getMultiplierTextColor } from "@/utils/colors";

const store = useMainStore();
defineOptions({ name: "Stats" });
defineProps([
  "competition",
  "normal_points",
  "hasGottenFishCount",
  "signees",
  "loading",
  "biggest_amounts",
  "fishes_chart_title",
  "fishes_chart_data",
  "signee_chart_title",
  "signee_chart_data",
]);
defineEmits(["dialog"]);

// Runs when the component is created
</script>
<style scoped></style>
