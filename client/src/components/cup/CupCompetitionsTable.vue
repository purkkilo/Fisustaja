<template>
  <!-- Competitions of a cup: toggle finished/public, open a competition -->
  <v-data-table
    :headers="columns"
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
      <span class="d-flex flex-column py-2">
        <strong>{{ item.name }}</strong>
        <span class="fs-muted text-body-small">{{ item.locality }}</span>
      </span>
    </template>
    <template #[`item.isFinished`]="{ item }">
      <v-switch
        :model-value="!!item.isFinished"
        :aria-label="`${item.name}: ${$t('ended')}`"
        :disabled="loading"
        color="results"
        inset
        hide-details
        density="compact"
        @update:model-value="emit('toggle-finished', item)"
      />
    </template>
    <template #[`item.isPublic`]="{ item }">
      <v-switch
        :model-value="!!item.isPublic"
        :aria-label="`${item.name}: ${$t('public')}`"
        :disabled="loading"
        color="signing"
        inset
        hide-details
        density="compact"
        @update:model-value="emit('toggle-public', item)"
      />
    </template>
    <template #[`item.cup_points_multiplier`]="{ item }">
      <span class="fs-num font-weight-bold"
        >× {{ item.cup_points_multiplier }}</span
      >
    </template>
    <template #[`item.choose`]="{ item }">
      <v-btn
        variant="text"
        color="weighing"
        append-icon="mdi-arrow-right"
        :disabled="loading"
        @click="emit('open', item)"
        >{{ $t("dashboard.open") }}</v-btn
      >
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDateToLocaleDateString } from "@/utils/format";

defineProps({
  competitions: { type: Array, required: true },
  search: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["toggle-finished", "toggle-public", "open"]);

const { t } = useI18n();

const columns = computed(() => [
  { key: "start_date", title: t("date") },
  { key: "name", title: t("name") },
  { key: "isFinished", title: t("ended"), width: 110 },
  { key: "isPublic", title: t("public"), width: 110 },
  { key: "cup_points_multiplier", title: t("multiplier") },
  { key: "choose", title: "", sortable: false, align: "end" },
]);
</script>
