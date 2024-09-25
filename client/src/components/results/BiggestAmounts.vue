<template>
  <div>
    <v-row v-if="biggest_amounts_results.length">
      <v-col md="10" offset-md="1" style="margin-bottom: 40px">
        <v-card :dark="$store.getters.getTheme">
          <v-card-title>
            <p v-if="results_found_amounts" class="flow-text">
              Suurimmat kalasaaliit ({{ selected_biggest_amount }}
              {{ results_found_amounts }})
            </p>
            <p v-else class="flow-text">
              Suurimmat kalasaaliit ({{ selected_biggest_amount }})
            </p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_amounts"
              append-icon="mdi-magnify"
              label="Hae kilpailijaa"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="biggest_amounts_results"
            :search="search_amounts"
            :loading="loading"
          >
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :outlined="$store.getters.getTheme"
                :color="getColor(item.placement)"
                >{{ item.placement }}.</v-chip
              >
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <v-chip>{{ item.name }}</v-chip>
            </template>
            <template v-slot:[`item.weight`]="{ item }">
              <v-chip>{{ item.weight.toLocaleString() }}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="!loading" md="8" offset-md="2">
        <p
          class="flow-text"
          v-bind:class="{
            'white--text': $store.getters.getTheme,
          }"
        >
          Ei tuloksia, vielä...
        </p>
      </v-col>
      <v-col v-else md="8" offset-md="2">
        <h2 class="white--text">Päivitetään tuloksia tietokannasta...</h2>
        <ProgressBarQuery />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getColorPoints, getColor } from "@/shared";

export default {
  name: "BiggestAmounts",
  components: {},
  props: [
    "loading",
    "fish_names",
    "selected_biggest_amount",
    "biggest_amounts_results",
    "results_found_amounts",
    "search_amounts",
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
