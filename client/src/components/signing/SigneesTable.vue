<template>
  <!-- Signed boats; clicking a row opens it in the signing form -->
  <v-card>
    <v-card-title class="d-flex flex-wrap align-center">
      <p class="flow-text">{{ $t("signees-signed") }}</p>
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon v-bind="props" class="ml-1 mb-5"
            >mdi-chat-question-outline</v-icon
          >
        </template>
        <span>{{ $t("info-table-click") }}</span>
      </v-tooltip>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        :label="$t('search-signee')"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="signees"
      :search="search"
      :loading="loading"
      hover
      @click:row="(event, { item }) => emit('select', item)"
    >
      <template #[`item.boat_number`]="{ item }">
        <v-chip>{{ item.boat_number }}</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { t } from "@/i18n";

defineProps({
  signees: { type: Array, default: () => [] },
  loading: Boolean,
});
const emit = defineEmits(["select"]);

const search = ref("");
const headers = computed(() =>
  [
    ["boat_number", "boat-number"],
    ["captain_name", "captain-name"],
    ["temp_captain_name", "temp-captain-name"],
    ["locality", "locality-team"],
    ["starting_place", "starting-place"],
  ].map(([key, title]) => ({ key, title: t(title) })),
);
</script>
