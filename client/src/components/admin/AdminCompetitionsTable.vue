<template>
  <!-- Every competition in the database -->
  <v-data-table
    :headers="headers"
    :items="competitions"
    :search="search"
    :loading="loading"
    density="comfortable"
  >
    <template #[`item.start_date`]="{ item }">
      <span class="fs-num">{{
        formatDateToLocaleDateString(item.start_date)
      }}</span>
    </template>
    <template #[`item.name`]="{ item }">
      <strong>{{ item.name }}</strong>
    </template>
    <template #[`item.cup_points_multiplier`]="{ item }">
      <span v-if="item.isCupCompetition" class="fs-num font-weight-bold"
        >× {{ item.cup_points_multiplier }}</span
      >
    </template>
    <template #[`item.actions`]="{ item }">
      <div class="d-flex ga-1 justify-end">
        <v-btn
          icon="mdi-arrow-right"
          variant="text"
          size="small"
          color="weighing"
          :aria-label="`${$t('go-to-competition')}: ${item.name}`"
          :title="$t('go-to-competition')"
          @click="emit('open', item)"
        />
        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          size="small"
          color="error"
          :aria-label="`${$t('button.delete-comp')}: ${item.name}`"
          :title="$t('button.delete-comp')"
          :loading="deleting"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from "vue";
import { t } from "@/i18n";
import { formatDateToLocaleDateString } from "@/utils/format";

defineProps({
  competitions: { type: Array, default: () => [] },
  search: { type: String, default: "" },
  loading: Boolean,
  deleting: Boolean,
});
const emit = defineEmits(["open", "delete"]);

const headers = computed(() => [
  { key: "start_date", title: t("date") },
  { key: "name", title: t("name") },
  { key: "username", title: t("user") },
  { key: "cup_name", title: t("cup.normal") },
  { key: "cup_points_multiplier", title: t("multiplier") },
  { key: "actions", title: "", sortable: false, align: "end" },
]);
</script>
