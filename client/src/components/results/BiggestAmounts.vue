<template>
  <div>
    <v-row v-if="biggest_amounts_results.length">
      <v-col md="10" offset-md="1" style="margin-bottom: 40px">
        <v-card>
          <v-card-title class="d-flex flex-wrap align-center">
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
              v-model="searchText"
              append-inner-icon="mdi-magnify"
              :label="$t('search-boat')"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="tableHeaders(headers)"
            :items="biggest_amounts_results"
            :search="searchText"
            :loading="loading"
          >
            <template
              v-for="(h, index) in headers"
              v-slot:[`header.${h.value}`]="{ column: header }"
            >
              <span> {{ $t(header.text) }}</span>
            </template>
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :color="getColor(item.placement)"
                :variant="store.getTheme ? 'outlined' : 'flat'"
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
            'text-white': store.getTheme,
          }"
        >
          {{ $t("no-results") }}
        </p>
      </v-col>
      <v-col v-else>
        <h2 class="text-white">{{ $t("refreshing") }}...</h2>
        <ProgressBarQuery />
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
defineOptions({ name: "BiggestAmounts" });
const props = defineProps([
  "loading",
  "fish_names",
  "selected_biggest_amount",
  "biggest_amounts_results",
  "search_amounts",
  "headers",
]);

const searchText = ref(props.search_amounts || "");

// Runs when the component is created
</script>
<style scoped></style>
