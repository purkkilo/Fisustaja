<template>
  <!-- /signing: the boat list and the add/edit form side by side -->
  <div class="fs-page">
    <ErrorList :errors="errors" />
    <v-skeleton-loader v-if="loadingSite" type="table" class="fs-panel" />
    <div v-else class="signing">
      <SigneesTable
        class="signing__list"
        :signees="signees"
        :loading="refreshing"
        :is-team-competition="isTeamCompetition"
        :selected-id="selectedId"
        :clash-number="clashState.clash?.boat_number ?? null"
        @select="selectSignee"
        @export="exportCsv"
        @refresh="refresh"
      />
      <SigneeForm
        v-model:form="form"
        class="signing__form"
        :editing="editing"
        :next-number="nextNumber()"
        :clash="clashState"
        :replacing="!!replaceTarget"
        :notification="notification"
        :recent="recent"
        :teams="teams"
        :is-team-competition="isTeamCompetition"
        :has-cup="!!cup"
        :saving="saving"
        @save="save"
        @clear="resetForm"
        @delete="remove"
        @search-cup="searchCup"
        @use-next="form.boat_number = nextNumber()"
        @replace="replaceTarget = clashState.clash"
        @edit-existing="fillForm(clashState.clash, null)"
      />
    </div>
    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useMainStore } from "@/store";
import { confirm } from "@/plugins/alerts";
import { t } from "@/i18n";
import { useSigning } from "@/composables/useSigning";
import {
  boatNumberClash,
  emptySigneeForm,
  normalizeSignee,
  signeeToForm,
} from "@/utils/signees";
import { downloadCsv, toCsv } from "@/utils/csv";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";
import SigneeForm from "../components/signing/SigneeForm.vue";
import SigneesTable from "../components/signing/SigneesTable.vue";

defineOptions({ name: "Signing" });
const store = useMainStore();

const {
  loadingSite,
  refreshing,
  saving,
  cup,
  signees,
  teams,
  isTeamCompetition,
  load,
  nextNumber,
  findByBoatNumber,
  findById,
  findFromCup,
  saveSignee,
  deleteSignee,
} = useSigning();

const form = ref(emptySigneeForm());
// _id of the signee being edited, null when adding a new one
const selectedId = ref(null);
// set when the user chose to overwrite the boat that has the typed number
const replaceTarget = ref(null);
const errors = ref([]);
const notification = ref(null);
const snackbar = ref(false);
const text = ref("");

const editing = computed(() =>
  selectedId.value ? findById(selectedId.value) : null,
);
const clashState = computed(() =>
  boatNumberClash(signees.value, form.value.boat_number, selectedId.value),
);
// newest first (the store keeps boats in the order they were added)
const recent = computed(() =>
  [...(store.competition?.signees ?? [])].reverse().slice(0, 3),
);

// a different number cancels a pending "replace"
watch(
  () => form.value.boat_number,
  () => (replaceTarget.value = null),
);

// confirm() rejects on cancel
const ask = (message, title) =>
  confirm(message, title, "question").catch(() => false);

function notify(message) {
  text.value = message;
  snackbar.value = false;
  nextTick(() => (snackbar.value = true));
}

function showErrors(keys) {
  errors.value = keys;
  nextTick(() =>
    document.getElementById("error-list")?.scrollIntoView({
      behavior: "smooth",
    }),
  );
}

function focusNumber() {
  nextTick(() => document.getElementById("boat-number")?.focus());
}

function resetForm() {
  form.value = { ...emptySigneeForm(), boat_number: nextNumber() };
  selectedId.value = null;
  replaceTarget.value = null;
  errors.value = [];
  notification.value = null;
  focusNumber();
}

function fillForm(signee, message) {
  form.value = signeeToForm(signee);
  selectedId.value = signee._id ?? null;
  replaceTarget.value = null;
  errors.value = [];
  notification.value = message;
}

function searchCup() {
  if (!form.value.boat_number) {
    notification.value = "notification.empty-boat-number";
    return;
  }
  const fromCup = findFromCup(form.value.boat_number);
  if (!fromCup) {
    notification.value = "notification.no-signee-found";
    return;
  }
  // Already signed into this competition: edit that signee
  const signed = findByBoatNumber(form.value.boat_number);
  fillForm(
    { ...fromCup, starting_place: signed?.starting_place, _id: signed?._id },
    "notification.found-from-cup",
  );
}

function selectSignee(signee) {
  fillForm(signee, null);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function save() {
  const { errors: invalid, signee } = normalizeSignee(form.value);
  if (invalid.length) {
    form.value.team = signee.team;
    return showErrors(invalid);
  }
  if (clashState.value.status === "blocked") {
    return showErrors(["errors.number-used"]);
  }
  if (clashState.value.status === "confirm-replace" && !replaceTarget.value) {
    return;
  }
  errors.value = [];

  const existing = replaceTarget.value ?? editing.value;
  const saved = await saveSignee(signee, existing);
  if (!saved) return showErrors(["errors.in-saving"]);
  notify(existing ? "boat-updated" : "boat-added");
  resetForm();
}

async function remove() {
  const signee = editing.value;
  if (!signee) return showErrors(["errors.no-boat-selected"]);
  const ok = await ask(
    `${t("signing-delete-confirm")}: (${signee.boat_number}) ${signee.captain_name}?`,
    t("button.delete-signee"),
  );
  if (!ok) return;
  if (await deleteSignee(signee)) {
    notify("boat-removed");
    resetForm();
  } else {
    showErrors(["errors.something-wrong"]);
  }
}

function exportCsv() {
  const columns = [
    { key: "boat_number", title: t("boat-number") },
    { key: "captain_name", title: t("captain-name") },
    { key: "temp_captain_name", title: t("temp-captain-name") },
    { key: "locality", title: t("locality-team") },
    { key: "starting_place", title: t("starting-place") },
  ];
  if (isTeamCompetition.value) columns.push({ key: "team", title: t("team") });
  const name = (store.competition?.name || "kilpailu").replace(
    /[^\p{L}\p{N}]+/gu,
    "-",
  );
  downloadCsv(`${name}-${t("signees")}.csv`, toCsv(signees.value, columns));
}

async function refresh() {
  await load();
  if (!selectedId.value) form.value.boat_number = nextNumber();
}

onMounted(async () => {
  const stored = localStorage.getItem("competition");
  if (!stored) return;
  loadingSite.value = true;
  await load(JSON.parse(stored)._id);
  resetForm();
});
</script>

<style scoped>
.signing {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.signing__list {
  flex: 2 1 560px;
  min-width: 0;
}
.signing__form {
  flex: 1 1 360px;
  min-width: 0;
}
</style>
