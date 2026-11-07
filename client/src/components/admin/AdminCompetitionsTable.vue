<template>
  <!-- Every competition in the database -->
  <v-card>
    <v-card-title class="d-flex flex-wrap align-center">
      <p class="flow-text">{{ $t("comp.plural") }}</p>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        :label="$t('search')"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      id="normal-table"
      :headers="headers"
      :items="competitions"
      :search="search"
      :loading="loading"
    >
      <template #[`item.start_date`]="{ item }">
        <v-chip color="primary-darken-2" variant="flat">{{
          formatDateToLocaleDateString(item.start_date)
        }}</v-chip>
      </template>
      <template #[`item.cup_points_multiplier`]="{ item }">
        <v-chip
          v-if="item.isCupCompetition"
          :color="getMultiplierColor(item.cup_points_multiplier)"
          :variant="store.getTheme ? 'outlined' : 'flat'"
          >{{ item.cup_points_multiplier }}x</v-chip
        >
      </template>
      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-tooltip location="start" :text="$t('go-to-competition')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="primary"
                icon="mdi-arrow-right-bold-box-outline"
                size="small"
                @click="emit('open', item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip location="start" :text="$t('button.delete-comp')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                color="red"
                icon="mdi-delete-outline"
                size="small"
                :loading="deleting"
                @click="emit('delete', item)"
              />
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/store";
import { t } from "@/i18n";
import { formatDateToLocaleDateString } from "@/utils/format";
import { getMultiplierColor } from "@/utils/colors";

defineProps({
  competitions: { type: Array, default: () => [] },
  loading: Boolean,
  deleting: Boolean,
});
const emit = defineEmits(["open", "delete"]);
const store = useMainStore();

const search = ref("");
const headers = computed(() => [
  { key: "start_date", title: t("date") },
  { key: "name", title: t("name") },
  { key: "username", title: t("user") },
  { key: "cup_name", title: t("cup.normal") },
  { key: "cup_points_multiplier", title: t("multiplier") },
  { key: "actions", title: "", sortable: false, align: "end" },
]);
</script>
