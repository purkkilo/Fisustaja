<template>
  <!-- Clickable table of boats (leaderboard / still on water) -->
  <v-card>
    <v-card-title class="d-flex flex-wrap align-center">
      <p class="text-body-large">{{ title }}</p>
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" style="margin: 0 0 20px 5px"
            >mdi-chat-question-outline</v-icon
          >
        </template>
        <span>{{ $t("info-table-click") }}</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-inner-icon="mdi-magnify"
        :label="$t('search-boat')"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="translatedHeaders"
      :items="items"
      :search="search"
      :loading="loading"
      @click:row="(event, { item }) => emit('select', item)"
    >
      <template v-slot:[`item.placement`]="{ item }">
        <v-chip
          :color="placementColor(item.placement)"
          :variant="store.isDark ? 'outlined' : 'flat'"
          >{{ item.placement }}.</v-chip
        >
      </template>
      <template v-slot:[`item.total_points`]="{ item }">
        <v-chip
          :color="item.total_points > 0 ? 'indigo-lighten-2' : 'grey'"
          variant="flat"
          >{{ item.total_points.toLocaleString() }}</v-chip
        >
      </template>
      <template v-slot:[`item.boat_number`]="{ item }">
        <v-chip>{{ item.boat_number }}.</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from "@/store";

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  // [{ key, title }] where title is a translation key
  columns: { type: Array, required: true },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(["select"]);

const { t } = useI18n();
const store = useMainStore();
const search = ref("");

const translatedHeaders = computed(() =>
  props.columns.map((c) => ({ ...c, title: t(c.title) })),
);

function placementColor(placement) {
  if (placement > 30) return "red";
  if (placement > 20) return "orange";
  if (placement > 5) return "yellow";
  return "green";
}
</script>
