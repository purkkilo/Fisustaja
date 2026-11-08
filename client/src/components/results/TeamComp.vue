<template>
  <v-data-table
    :headers="columns"
    :items="team_results"
    :search="search"
    :loading="loading"
    density="comfortable"
  >
    <template #[`item.placement`]="{ item }">
      <PlacementBadge :placement="item.placement" />
    </template>
    <template #[`item.name`]="{ item }">
      <span class="font-weight-bold">{{ item.name }}</span>
    </template>
    <template #[`item.points`]="{ item }">
      <span class="font-weight-bold fs-num">{{ item.points }} p</span>
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

defineOptions({ name: "TeamComp" });
const props = defineProps({
  loading: Boolean,
  headers: { type: Array, default: () => [] },
  search: { type: String, default: "" },
  team_results: { type: Array, default: () => [] },
});
const { t } = useI18n();
const columns = computed(() =>
  props.headers.map((h) => ({ ...h, title: t(h.title) })),
);
</script>
