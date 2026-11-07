<template>
  <div>
    <v-row v-if="biggest_amounts_results.length">
      <v-col md="10" offset-md="1" style="margin-bottom: 40px">
        <v-card>
          <v-card-title class="d-flex flex-wrap align-center">
            <p
              class="text-body-large"
              v-if="
                selected_biggest_amount === 'all' ||
                selected_biggest_amount === 'winners'
              "
            >
              {{ $t("biggest-amounts") }} ({{ $t(selected_biggest_amount) }})
            </p>
            <p class="text-body-large" v-else>
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
            :headers="headers"
            :items="biggest_amounts_results"
            :search="searchText"
            :loading="loading"
          >
            <template
              v-for="h in headers"
              :key="h.key"
              v-slot:[`header.${h.key}`]="{ column: header }"
            >
              <span> {{ $t(header.title) }}</span>
            </template>
            <template v-slot:[`item.placement`]="{ item }">
              <v-chip
                :color="getColor(item.placement)"
                :variant="store.isDark ? 'outlined' : 'flat'"
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
          class="text-body-large"
          :class="{
            'text-white': store.isDark,
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
import { useMainStore } from "@/store";
import { ref } from "vue";
import { getColorPoints, getColor } from "@/utils/colors";

const store = useMainStore();
defineOptions({ name: "BiggestAmounts" });
const props = defineProps({
  loading: { type: Boolean, default: false },
  fish_names: { type: Array, default: () => [] },
  selected_biggest_amount: { type: String, default: "" },
  biggest_amounts_results: { type: Array, default: () => [] },
  search_amounts: { type: String, default: "" },
  headers: { type: Array, default: () => [] },
});

const searchText = ref(props.search_amounts || "");

// Runs when the component is created
</script>
<style scoped></style>
