<template>
  <!-- Normal competition: by species, by points (with cup points) or signees -->
  <v-data-table
    :headers="columns"
    :items="results"
    :search="search"
    :loading="loading"
    :items-per-page="25"
    density="comfortable"
  >
    <template #[`item.placement`]="{ item }">
      <PlacementBadge :placement="item.placement" />
    </template>
    <template #[`item.boat_number`]="{ item }">
      <span class="fs-num fs-muted">{{ item.boat_number }}</span>
    </template>
    <template #[`item.captain_name`]="{ item }">
      <span class="font-weight-bold">{{ item.captain_name }}</span>
    </template>
    <template #[`item.total_points`]="{ item }">
      <span class="font-weight-bold fs-num">{{
        Number(item.total_points).toLocaleString("fi-FI")
      }}</span>
    </template>
    <template #[`item.cup_points_total`]="{ item }">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <span v-bind="props" class="cup-points fs-num">{{
            item.cup_points_total
          }}</span>
        </template>
        <span
          >{{ $t("placement-points") }} + {{ $t("participation-points") }}:
          {{ item.cup_placement_points }} +
          {{ item.cup_participation_points }} =
          {{ item.cup_points_total }}</span
        >
      </v-tooltip>
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

defineOptions({ name: "NormalComp" });
const props = defineProps({
  loading: Boolean,
  headers: { type: Array, default: () => [] },
  search: { type: String, default: "" },
  results: { type: Array, default: () => [] },
  // species names are column titles as they are, not translation keys
  fish_names: { type: Array, default: () => [] },
});
const { t } = useI18n();

const columns = computed(() =>
  props.headers.map((h) => ({
    ...h,
    title: props.fish_names.includes(h.title) ? h.title : t(h.title),
    align: h.key === "placement" ? "start" : h.align,
  })),
);
</script>

<style scoped>
.cup-points {
  display: inline-block;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgb(var(--v-theme-signing-soft));
  font-weight: 700;
  text-align: center;
}
</style>
