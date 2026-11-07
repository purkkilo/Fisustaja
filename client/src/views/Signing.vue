<template>
  <!-- /signing: sign boats into the competition -->
  <div>
    <Timedate />

    <v-container
      :class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <ErrorList :errors="errors" />
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <h1 class="ma-8">{{ $t("signing") }}</h1>
      </v-card>

      <v-tabs
        v-model="tab"
        slider-color="blue-darken-4"
        bg-color="blue-lighten-2"
        color="blue-darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tab value="signing">{{ $t("signing") }}</v-tab>
        <v-tab value="signees">{{ $t("signees-signed") }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <v-window-item value="signing" :class="areaClass">
          <v-row v-if="loadingSite">
            <v-col>
              <h2 :class="{ 'text-white': store.getTheme }">
                {{ $t("fetching") }}...
              </h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
          <div v-else class="mt-5">
            <v-row v-if="notification">
              <v-col md="8" offset-md="2">
                <v-alert type="info" class="flow-text">
                  {{ $t(notification) }}
                </v-alert>
              </v-col>
            </v-row>
            <p class="flow-text" :class="{ 'text-white': store.getTheme }">
              {{ $t("signees") }} {{ $t("total") }}:
              <b>{{ signees.length }}</b>
            </p>

            <SigneeForm
              v-model:form="form"
              :teams="teams"
              :is-team-competition="isTeamCompetition"
              :has-cup="!!cup"
              :can-delete="!!selectedId"
              :saving="saving"
              :refreshing="refreshing"
              @search="searchSignees"
              @search-cup="searchCup"
              @clear="resetForm"
              @save="save"
              @delete="remove"
            />

            <p
              v-if="refreshing"
              class="flow-text"
              :class="{ 'text-white': store.getTheme }"
            >
              {{ $t("updating") }}...
            </p>
            <v-row class="mb-5">
              <v-col md="4" offset-md="4">
                <v-btn
                  v-if="competitionId"
                  id="updatebtn"
                  block
                  color="blue-darken-4"
                  class="text-white"
                  size="large"
                  :loading="refreshing"
                  @click="refresh"
                >
                  <v-icon start>mdi-update</v-icon>{{ $t("button.update") }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-window-item>

        <v-window-item value="signees" :class="areaClass">
          <v-row class="my-2">
            <v-col md="10" offset-md="1">
              <SigneesTable
                :signees="signees"
                :loading="refreshing"
                @select="selectSignee"
              />
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
    <NotificationBar :snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { useMainStore } from "@/store";
import { confirm } from "@/plugins/alerts";
import { t } from "@/i18n";
import { useSigning } from "@/composables/useSigning";
import {
  emptySigneeForm,
  normalizeSignee,
  signeeToForm,
} from "@/utils/signees";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
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
  competitionId,
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

const tab = ref("signing");
const form = ref(emptySigneeForm());
// _id of the signee being edited, null when adding a new one
const selectedId = ref(null);
const errors = ref([]);
const notification = ref(null);
const snackbar = ref(false);
const text = ref("");

const areaClass = computed(() =>
  store.getTheme ? "inputarea-dark" : "inputarea",
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
  errors.value = keys.map((key) => t(key));
  nextTick(() =>
    document.getElementById("error-list")?.scrollIntoView({
      behavior: "smooth",
    }),
  );
}

function resetForm() {
  form.value = { ...emptySigneeForm(), boat_number: nextNumber() };
  selectedId.value = null;
  errors.value = [];
  notification.value = null;
}

function fillForm(signee, message) {
  form.value = signeeToForm(signee);
  selectedId.value = signee._id ?? null;
  errors.value = [];
  notification.value = message;
}

// Keep the typed boat number, clear the rest
function notFound() {
  form.value = { ...emptySigneeForm(), boat_number: form.value.boat_number };
  selectedId.value = null;
  notification.value = "notification.no-signee-found";
}

function searchSignees() {
  if (!form.value.boat_number) {
    notification.value = "notification.empty-boat-number";
    return;
  }
  const signee = findByBoatNumber(form.value.boat_number);
  if (signee) fillForm(signee, "notification.boat-found");
  else notFound();
}

function searchCup() {
  if (!form.value.boat_number) {
    notification.value = "notification.empty-boat-number";
    return;
  }
  const fromCup = findFromCup(form.value.boat_number);
  if (!fromCup) return notFound();
  // Already signed into this competition: edit that signee
  const signed = findByBoatNumber(form.value.boat_number);
  fillForm(
    { ...fromCup, starting_place: signed?.starting_place, _id: signed?._id },
    "notification.found-from-cup",
  );
}

function selectSignee(signee) {
  fillForm(signee, "notification.boat-found");
  tab.value = "signing";
}

async function save() {
  const { errors: invalid, signee } = normalizeSignee(form.value);
  if (invalid.length) {
    form.value.team = signee.team;
    return showErrors(invalid);
  }
  errors.value = [];

  let existing = selectedId.value ? findById(selectedId.value) : null;
  const clash = findByBoatNumber(signee.boat_number, existing?._id ?? null);
  if (clash) {
    // Editing a boat onto another boat's number is never allowed
    if (existing) return showErrors(["errors.number-used"]);
    const replace = await ask(
      t("signing-replace-confirm", {
        number: clash.boat_number,
        name: clash.captain_name,
      }),
      t("signee"),
    );
    if (!replace) {
      form.value.boat_number = nextNumber();
      notification.value = "notification.boat-number-moved";
      return;
    }
    existing = clash;
  }

  const saved = await saveSignee(signee, existing);
  if (!saved) return showErrors(["errors.in-saving"]);
  notify(existing ? "boat-updated" : "boat-added");
  resetForm();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function remove() {
  const signee = selectedId.value && findById(selectedId.value);
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
