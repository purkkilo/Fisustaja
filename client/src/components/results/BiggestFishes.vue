<template>
  <div>
    <v-row v-if="biggest_fishes_results.length">
      <v-col md="10" offset-md="1" style="margin-bottom: 40px">
        <v-card :dark="$store.getters.getTheme">
          <v-card-title>
            <p class="flow-text">
              Suurimmat kalat ({{ selected_biggest_fish }})
            </p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_fishes"
              append-icon="mdi-magnify"
              label="Hae kilpailijaa"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="biggest_fishes_results"
            :search="search_fishes"
          >
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :outlined="$store.getters.getTheme"
                :color="getColor(item.placement)"
                >{{ item.placement }}.</v-chip
              >
            </template>
            <template v-slot:[`item.name`]="{ item }">
              {{ item.name }}
            </template>
            <template v-slot:[`item.weight`]="{ item }">
              {{ item.weight.toLocaleString() }}
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="!loading">
        <p
          class="flow-text"
          v-bind:class="{
            'white--text': $store.getters.getTheme,
          }"
        >
          Ei tuloksia, vielä...
        </p>
      </v-col>
      <v-col v-else>
        <h2 class="white--text">Päivitetään tuloksia tietokannasta...</h2>
        <ProgressBarQuery />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getColorPoints, getColor } from "@/shared";

export default {
  name: "BiggestFishes",
  components: {},
  props: [
    "loading",
    "fish_names",
    "selected_biggest_fish",
    "biggest_fishes_results",
    "search_fishes",
    "headers",
  ],
  data() {
    return {};
  },
  created() {
    this.getColorPoints = getColorPoints;
    this.getColor = getColor;
  },
  methods: {},
};
</script>
<style scoped></style>
