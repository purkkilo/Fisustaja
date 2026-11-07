<template>
  <!-- Competitions of a cup: toggle finished/public, open a competition -->
  <v-data-table
    :headers="columns"
    :items="competitions"
    :search="search"
    :loading="loading"
  >
    <template v-slot:[`item.start_date`]="{ item }">
      <v-chip color="primary-darken-2" variant="flat">{{
        formatDateToLocaleDateString(item.start_date)
      }}</v-chip>
    </template>
    <template v-slot:[`item.isFinished`]="{ item }">
      <v-tooltip location="end" :text="$t('click-to-change')">
        <template v-slot:activator="{ props }">
          <v-chip
            v-bind="props"
            :color="item.isFinished ? 'green-lighten-2' : 'red-lighten-2'"
            :disabled="loading"
            :variant="chipVariant"
            @click="emit('toggle-finished', item)"
            >{{ item.isFinished ? $t("yes") : $t("no") }}</v-chip
          >
        </template>
      </v-tooltip>
    </template>
    <template v-slot:[`item.isPublic`]="{ item }">
      <v-tooltip location="end" :text="$t('click-to-change')">
        <template v-slot:activator="{ props }">
          <v-chip
            v-bind="props"
            :color="item.isPublic ? 'green-darken-2' : 'red-darken-2'"
            :disabled="loading"
            :variant="chipVariant"
            @click="emit('toggle-public', item)"
            >{{ item.isPublic ? $t("public") : $t("private") }}</v-chip
          >
        </template>
      </v-tooltip>
    </template>
    <template v-slot:[`item.cup_points_multiplier`]="{ item }">
      <v-chip
        :color="getMultiplierColor(item.cup_points_multiplier)"
        :variant="chipVariant"
        >{{ item.cup_points_multiplier }}x</v-chip
      >
    </template>
    <template v-slot:[`item.choose`]="{ item }">
      <v-tooltip location="end" :text="$t('comp.to')">
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
            :disabled="loading"
            @click="emit('open', item)"
            ><v-icon color="black"
              >mdi-arrow-right-bold-box-outline</v-icon
            ></v-btn
          >
        </template>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";
import { formatDateToLocaleDateString } from "@/utils/format";
import { getMultiplierColor } from "@/utils/colors";

defineProps({
  competitions: { type: Array, required: true },
  search: { type: String, default: "" },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["toggle-finished", "toggle-public", "open"]);

const { t } = useI18n();
const store = useMainStore();
const chipVariant = computed(() => (store.isDark ? "outlined" : "flat"));

const columns = computed(() => [
  { key: "start_date", title: t("date") },
  { key: "name", title: t("name") },
  { key: "isFinished", title: t("ended") },
  { key: "isPublic", title: t("publicity") },
  { key: "cup_points_multiplier", title: t("multiplier") },
  { key: "choose", title: t("choose"), sortable: false },
]);
</script>
