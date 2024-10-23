<template>
  <div>
    <v-row v-if="biggest_amounts_results.length">
      <v-col md="10" offset-md="1" style="margin-bottom: 40px">
        <v-card :dark="$store.getters.getTheme">
          <v-card-title>
            <p
              class="flow-text"
              v-if="
                selected_biggest_amount === 'all' ||
                selected_biggest_amount === 'winners'
              "
            >
              {{ $t("biggest-amounts") }} ({{ $t(selected_biggest_amount) }})
            </p>
            <p class="flow-text" v-else>
              {{ $t("biggest-amounts") }} ({{ selected_biggest_amount }})
            </p>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search_amounts"
              append-icon="mdi-magnify"
              :label="$t('search-boat')"
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
            <template
              v-for="(h, index) in headers"
              v-slot:[`header.${h.value}`]="{ header }"
            >
              <span :key="index"> {{ $t(header.text) }}</span>
            </template>
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
          {{ $t("no-results") }}
        </p>
      </v-col>
      <v-col v-else>
        <h2 class="white--text">{{ $t("refreshing") }}...</h2>
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
    "search_amounts",
    "headers",
  ],
  created() {
    this.getColorPoints = getColorPoints;
    this.getColor = getColor;
  },
};
</script>
<style scoped></style>
