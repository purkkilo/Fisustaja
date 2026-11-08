<template>
  <!-- Signed boats; a row opens that boat in the form -->
  <section aria-labelledby="signed-title" class="fs-panel signed">
    <div class="signed__head">
      <h2 id="signed-title">
        {{ $t("signing-page.signed") }}
        <span class="signed__count fs-num">{{ signees.length }}</span>
      </h2>
      <v-text-field
        v-model="search"
        :label="$t('signing-page.search')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        class="signed__search"
      />
      <v-btn
        variant="outlined"
        :disabled="!signees.length"
        prepend-icon="mdi-file-delimited-outline"
        @click="emit('export')"
        >{{ $t("signing-page.export") }}</v-btn
      >
      <v-btn
        variant="text"
        icon="mdi-refresh"
        :loading="loading"
        :aria-label="$t('button.update')"
        @click="emit('refresh')"
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="signees"
      :search="search || ''"
      :loading="loading"
      :items-per-page="25"
      :row-props="rowProps"
      item-value="_id"
      density="comfortable"
      hover
      @click:row="(event, { item }) => emit('select', item)"
    >
      <template #[`item.boat_number`]="{ item }">
        <span class="signed__number fs-num">{{ item.boat_number }}</span>
      </template>
      <template #[`item.captain_name`]="{ item }">
        <span class="font-weight-bold">{{ item.captain_name }}</span>
      </template>
      <template #no-data>
        <span class="fs-muted">{{ $t("comp-overview.no-signees") }}</span>
      </template>
    </v-data-table>
    <span class="fs-muted text-body-small">{{
      $t("signing-page.row-hint")
    }}</span>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  signees: { type: Array, default: () => [] },
  loading: Boolean,
  isTeamCompetition: Boolean,
  // _id of the boat open in the form
  selectedId: { type: String, default: null },
  // boat number of a boat the form's number clashes with
  clashNumber: { type: [Number, String], default: null },
});
const emit = defineEmits(["select", "export", "refresh"]);
const { t } = useI18n();

const search = ref("");

const headers = computed(() => {
  const list = [
    { key: "boat_number", title: t("signing-page.col-number"), width: 72 },
    { key: "captain_name", title: t("captain-name") },
    { key: "temp_captain_name", title: t("temp-captain-name") },
    { key: "locality", title: t("locality-team") },
    { key: "starting_place", title: t("starting-place") },
  ];
  if (props.isTeamCompetition) list.push({ key: "team", title: t("team") });
  return list;
});

function rowProps({ item }) {
  if (item._id === props.selectedId) return { class: "signed__row--selected" };
  if (
    props.clashNumber != null &&
    Number(item.boat_number) === Number(props.clashNumber)
  ) {
    return { class: "signed__row--clash" };
  }
  return {};
}
</script>

<style scoped>
.signed {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.signed__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.signed__head h2 {
  margin: 0;
  flex: 1 1 200px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
}
.signed__count {
  padding: 2px 12px;
  border-radius: 999px;
  background: rgb(var(--v-theme-signing));
  color: #ffffff;
  font-family: var(--fs-font);
  font-size: 15px;
}
.signed__search {
  flex: 0 1 280px;
  min-width: 200px;
}
.signed__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 30px;
  border-radius: 8px;
  background: rgb(var(--v-theme-signing-soft));
  font-weight: 700;
}
.signed :deep(tbody tr) {
  cursor: pointer;
}
.signed :deep(.signed__row--selected) {
  background: rgb(var(--v-theme-signing-soft));
}
.signed :deep(.signed__row--clash) {
  background: rgb(var(--v-theme-results-soft));
}
</style>
