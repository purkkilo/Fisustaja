<template>
  <!-- The user's competitions; a row opens that competition -->
  <section aria-labelledby="comps-title" class="fs-panel comps">
    <div class="d-flex align-center justify-space-between ga-3">
      <h2 id="comps-title">{{ $t("dashboard.competitions") }}</h2>
      <span class="fs-muted fs-num">{{ competitions.length }}</span>
    </div>
    <v-data-table
      :headers="headers"
      :items="competitions"
      :search="search"
      :loading="loading"
      :items-per-page="8"
      item-value="_id"
      hover
      density="comfortable"
      @click:row="(event, { item }) => emit('open', item)"
    >
      <template #[`item.name`]="{ item }">
        <div class="py-2">
          <div class="font-weight-bold">{{ item.name }}</div>
          <div class="fs-muted text-body-small">{{ item.locality }}</div>
        </div>
      </template>
      <template #[`item.start_date`]="{ item }">
        <span class="fs-num">{{ formatDate(item.start_date) }}</span>
      </template>
      <template #[`item.cup_name`]="{ item }">
        <span v-if="item.isCupCompetition">{{ item.cup_name }}</span>
        <span v-else class="fs-muted">–</span>
      </template>
      <template #[`item.status`]="{ item }">
        <StatusChip :status="competitionStatus(item)" />
      </template>
      <template #no-data>
        <span class="fs-muted">{{ $t("dashboard.no-competitions") }}</span>
      </template>
    </v-data-table>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import StatusChip from "../StatusChip.vue";
import { competitionStatus } from "@/utils/competitionStatus";

defineProps({
  competitions: { type: Array, default: () => [] },
  search: { type: String, default: "" },
  loading: Boolean,
});
const emit = defineEmits(["open"]);
const { t, locale } = useI18n();

const headers = computed(() => [
  { key: "name", title: t("dashboard.col-competition") },
  { key: "start_date", title: t("dashboard.col-date") },
  { key: "cup_name", title: t("dashboard.col-cup") },
  { key: "status", title: t("dashboard.col-status"), sortable: false },
]);

const formatDate = (d) =>
  new Date(d).toLocaleDateString(locale.value === "fi" ? "fi-FI" : "en-GB");
</script>

<style scoped>
.comps {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comps h2 {
  margin: 0;
  font-size: 22px;
}
.comps :deep(tbody tr) {
  cursor: pointer;
}
</style>
