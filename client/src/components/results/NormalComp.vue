<template>
  <div>
    <v-row>
      <v-col
        md="10"
        offset-md="1"
        style="padding-top: 50px; padding-bottom: 20px"
      >
        <v-row
          class="row"
          v-if="
            normal_points.length ||
            (results.length && selected_normal === 'signees-signed')
          "
        >
          <v-col md="12">
            <v-card :dark="$store.getters.getTheme">
              <v-card-title>
                <p class="flow-text">
                  {{ $t("normal-comp") }} ({{ $t(selected_normal) }})
                </p>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  :label="$t('search-boat')"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="results"
                :search="search"
              >
                <template
                  v-for="(h, index) in headers"
                  v-slot:[`header.${h.value}`]="{ header }"
                >
                  <span :key="index" v-if="fish_names.includes(header.text)">
                    {{ header.text }}</span
                  >
                  <span :key="index" v-else> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.placement`]="{ item }">
                  <v-chip
                    :outlined="$store.getters.getTheme"
                    :color="getColor(item.placement)"
                    >{{ item.placement }}</v-chip
                  >
                </template>
                <template
                  v-if="selected_normal === 'signees-signed'"
                  v-slot:[`item.boat_number`]="{ item }"
                >
                  <v-chip>{{ item.boat_number }}</v-chip>
                </template>

                <template v-slot:[`item.total_points`]="{ item }">
                  <v-chip>{{ item.total_points.toLocaleString() }}</v-chip>
                </template>
                <template v-slot:[`item.cup_points_total`]="{ item }">
                  <v-tooltip bottom color="primary">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        v-bind="attrs"
                        v-on="on"
                        :color="getColorPoints(item.cup_points_total)"
                        >{{ item.cup_points_total }}</v-chip
                      >
                    </template>
                    <span>
                      <b
                        >{{ $t("placement-points") }} +
                        {{ $t("participation-points") }} =
                        {{ $t("cup.normal") }} {{ $t("points") }}</b
                      >
                      <br />
                      {{ item.cup_placement_points }} +
                      {{ item.cup_participation_points }} =
                      {{ item.cup_points_total }}
                    </span>
                  </v-tooltip>
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
              {{ $t("no-results") }}...
            </p>
          </v-col>
          <v-col v-else>
            <h2 class="white--text">{{ $t("refreshing") }}...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { getColorPoints, getColor } from "@/shared";

export default {
  name: "NormalComp",
  components: {},
  props: [
    "loading",
    "headers",
    "search",
    "results",
    "selected_normal",
    "normal_points",
    "fish_names",
  ],
  created() {
    this.getColorPoints = getColorPoints;
    this.getColor = getColor;
  },
};
</script>
<style scoped></style>
