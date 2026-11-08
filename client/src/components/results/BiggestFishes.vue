<template>
  <v-data-table
    :headers="columns"
    :items="biggest_fishes_results"
    :search="search"
    :loading="loading"
    :items-per-page="25"
    density="comfortable"
  >
    <template #[`item.placement`]="{ item }">
      <PlacementBadge :placement="item.placement" />
    </template>
    <template #[`item.captain_name`]="{ item }">
      <span class="font-weight-bold">{{ item.captain_name }}</span>
    </template>
    <template #[`item.weight`]="{ item }">
      <span class="font-weight-bold fs-num"
        >{{ Number(item.weight).toLocaleString("fi-FI") }} g</span
      >
    </template>
    <template #no-data>
      <span class="fs-muted">{{ $t("no-results") }}</span>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PlacementBadge from "./PlacementBadge.vue";

defineOptions({ name: "BiggestFishes" });
const props = defineProps({
  loading: Boolean,
  headers: { type: Array, default: () => [] },
  search: { type: String, default: "" },
  biggest_fishes_results: { type: Array, default: () => [] },
});
const { t } = useI18n();
const columns = computed(() =>
  props.headers.map((h) => ({ ...h, title: t(h.title) })),
);
</script>
