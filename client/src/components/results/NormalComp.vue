<template>
  <div>
    <v-row>
      <v-col
        md="10"
        offset-md="1"
        style="padding-top: 50px; padding-bottom: 20px"
      >
        <v-row
          v-if="
            normal_points.length ||
            (results.length && selected_normal === 'signees-signed')
          "
        >
          <v-col md="12">
            <v-card>
              <v-card-title class="d-flex flex-wrap align-center">
                <p class="flow-text">
                  {{ $t("normal-comp") }} ({{ $t(selected_normal) }})
                </p>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchText"
                  append-inner-icon="mdi-magnify"
                  :label="$t('search-boat')"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="tableHeaders(headers)"
                :items="results"
                :search="searchText"
              >
                <template
                  v-for="(h, index) in headers"
                  v-slot:[`header.${h.value}`]="{ column: header }"
                >
                  <span v-if="fish_names.includes(header.text)">
                    {{ header.text }}</span
                  >
                  <span v-else> {{ $t(header.text) }}</span>
                </template>
                <template v-slot:[`item.placement`]="{ item }">
                  <v-chip
                    :color="getColor(item.placement)"
                    :variant="store.getTheme ? 'outlined' : 'flat'"
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
                  <v-tooltip color="primary" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        :color="getColorPoints(item.cup_points_total)"
                        variant="flat"
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
                'text-white': store.getTheme,
              }"
            >
              {{ $t("no-results") }}...
            </p>
          </v-col>
          <v-col v-else>
            <h2 class="text-white">{{ $t("refreshing") }}...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import ProgressBarQuery from "../layout/ProgressBarQuery.vue";
import { tableHeaders } from "@/utils/tableHeaders";
import { useMainStore } from "@/store";
import { ref } from "vue";
import { getColorPoints, getColor } from "@/utils/colors";

const store = useMainStore();
defineOptions({ name: "NormalComp" });
const props = defineProps([
  "loading",
  "headers",
  "search",
  "results",
  "selected_normal",
  "normal_points",
  "fish_names",
]);

const searchText = ref(props.search || "");

// Runs when the component is created
</script>
<style scoped></style>
