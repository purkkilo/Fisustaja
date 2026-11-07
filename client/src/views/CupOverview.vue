<template>
  <!-- /cup-overview: manage a cup, its competitions and signees -->
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-card style="background: transparent" elevation="3" variant="outlined">
      <PdfSettingsDialog
        v-model="pdfDialog"
        v-model:landscape="isLandscape"
        @download="savePdf('Ilmoittautuneet', { isLandscape })"
      />

      <h1 v-if="!loading && cup" class="my-4">
        {{ cup.name }}, {{ cup.year }}
      </h1>
      <h1 v-else class="my-4">{{ $t("downloading") }}...</h1>

      <v-tabs
        slider-color="blue-darken-4"
        v-model="tab"
        bg-color="blue-lighten-2"
        color="blue-darken-4"
        grow
        show-arrows
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        center-active
      >
        <v-tab value="overview">{{ $t("overview") }}</v-tab>
        <v-tab :disabled="!competitions.length" value="points">{{
          $t("point-status")
        }}</v-tab>
        <v-tab :disabled="!competitions.length" value="stats">{{
          $t("general-statistics")
        }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(0, 0, 0, 0.4)">
        <v-window-item value="overview">
          <v-row v-if="loading">
            <v-col>
              <h2 class="text-white">{{ $t("preparing-cup") }}...</h2>
              <ProgressBarQuery />
            </v-col>
          </v-row>
          <p v-else-if="!cup" class="text-body-large pa-6" :class="textClass">
            {{ $t("errors.no-cup-selected") }}
          </p>

          <template v-else>
            <!-- Cup name and year -->
            <v-row style="margin-top: 50px">
              <v-col md="4" offset-md="4">
                <v-text-field
                  v-model="cupName"
                  :label="$t('name')"
                  variant="outlined"
                />
                <v-text-field
                  v-model="cupYear"
                  :label="$t('year')"
                  type="number"
                  maxlength="4"
                  variant="outlined"
                />
                <v-btn
                  color="primary"
                  :loading="saving"
                  @click="saveCupDetails(cupName, cupYear)"
                  class="mt-2"
                  size="large"
                  variant="outlined"
                  ><v-icon>mdi-refresh</v-icon>{{ $t("save") }}</v-btn
                >
              </v-col>
            </v-row>

            <v-row>
              <v-col md="4" offset-md="4">
                <v-select
                  :label="$t('choose-table-view')"
                  :items="['comp.plural', 'signees-signed']"
                  :item-title="(item) => $t(item)"
                  v-model="view"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col md="10" offset-md="1">
                <v-card>
                  <v-card-title class="d-flex flex-wrap align-center">
                    <p class="text-body-large" :class="textClass">{{ $t(view) }}</p>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      append-inner-icon="mdi-magnify"
                      :label="$t('search')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-card-title>

                  <CupCompetitionsTable
                    v-if="view === 'comp.plural'"
                    :competitions="allCompetitions"
                    :search="search"
                    :loading="updating"
                    @toggle-finished="toggleCompetitionFinished"
                    @toggle-public="toggleCompetitionPublic"
                    @open="openCompetition"
                  />

                  <v-data-table
                    v-else
                    id="normal-table"
                    :headers="signeeColumns"
                    :items="signees"
                    :search="search"
                    :loading="saving"
                  >
                    <template v-slot:[`item.modify`]="{ item }">
                      <v-btn
                        color="yellow-darken-2"
                        :disabled="saving"
                        @click.stop="openSigneeDialog(item)"
                        ><v-icon color="black">mdi-account-edit</v-icon></v-btn
                      >
                    </template>
                    <template v-slot:[`item.delete`]="{ item }">
                      <v-btn
                        color="red-darken-2"
                        :disabled="saving"
                        @click.stop="askDeleteSignee(item)"
                        ><v-icon color="black">mdi-delete</v-icon></v-btn
                      >
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>

            <v-row v-if="view === 'signees-signed'" class="justify-center">
              <v-col cols="auto">
                <v-btn :loading="saving" @click="openSigneeDialog(null)"
                  ><v-icon color="green">mdi-plus</v-icon>{{ $t("add") }}</v-btn
                >
              </v-col>
              <v-col cols="auto">
                <v-btn
                  @click="pdfDialog = true"
                  color="red"
                  :disabled="!signees.length"
                  variant="outlined"
                  ><v-icon>mdi-file-pdf-box</v-icon>
                  {{ $t("download-signees") }}</v-btn
                >
              </v-col>
            </v-row>
            <SigneeDialog
              v-model="signeeDialog"
              :signee="editedSignee"
              :next-number="nextBoatNumber()"
              :error="signeeError"
              :saving="saving"
              @save="saveSignee"
            />

            <v-row style="margin: 10px 0">
              <v-col>
                <v-btn
                  rounded="0"
                  color="green-lighten-1"
                  :loading="saving"
                  @click="
                    router.push({
                      path: '/register-comp',
                      query: { cup: cup._id },
                    })
                  "
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-new-comp") }}</v-btn
                >
              </v-col>
              <v-col>
                <v-btn
                  rounded="0"
                  :color="cup.isPublic ? 'grey-darken-4' : 'green-darken-4'"
                  @click="toggleCupPublic"
                  class="text-white"
                  :loading="saving"
                >
                  <template v-if="cup.isPublic">
                    <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
                  </template>
                  <template v-else>
                    <v-icon color="green">mdi-publish</v-icon
                    >{{ $t("button.set-public") }}
                  </template>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-window-item>

        <v-window-item value="points">
          <CupPoints
            v-if="cup"
            :competitions="competitions"
            :allCompetitions="allCompetitions"
            :results="standings"
            :isResults="isResults"
            :loading="loading"
            :selectNumbers="selectNumbers"
            :headers="headers"
            :cup="cup"
            @change="setHeaderLabel"
            @refresh="() => load(cup._id)"
            @calculate="recalculate"
            @save="(options) => savePdf('Tulokset', options)"
            @sort="setShowUnfinished"
          />
        </v-window-item>

        <v-window-item value="stats">
          <CupStats
            v-if="cup && !loading"
            :competitions="competitions"
            :cup="cup"
            :all_signees="allResults"
            :biggest_fishes="biggestFishes"
            :biggest_amounts="biggestAmounts"
            :loading="loading"
          />
        </v-window-item>
      </v-window>
      <NotificationBar v-model:snackbar="snackbar" :text="text" />
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMainStore } from "@/store";
import { confirm } from "@/plugins/alerts";
import { useCupOverview } from "@/composables/useCupOverview";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import PdfSettingsDialog from "../components/PdfSettingsDialog.vue";
import CupPoints from "../components/CupPoints.vue";
import CupStats from "../components/CupStats.vue";
import CupCompetitionsTable from "../components/cup/CupCompetitionsTable.vue";
import SigneeDialog from "../components/cup/SigneeDialog.vue";

defineOptions({ name: "CupOverview" });

const { t } = useI18n();
const router = useRouter();
const store = useMainStore();
const {
  loading,
  cup,
  allCompetitions,
  competitions,
  allResults,
  signees,
  biggestFishes,
  biggestAmounts,
  standings,
  headers,
  isResults,
  selectNumbers,
  snackbar,
  text,
  load,
  recalculate,
  setHeaderLabel,
  setShowUnfinished,
  savePdf,
  saving,
  updating,
  signeeError,
  saveCupDetails,
  toggleCupPublic,
  toggleCompetitionPublic,
  toggleCompetitionFinished,
  nextBoatNumber,
  addSignee,
  editSignee,
  deleteSignee,
} = useCupOverview();

const tab = ref("overview");
const view = ref("comp.plural");
const search = ref("");
const pdfDialog = ref(false);
const isLandscape = ref(false);
const cupName = ref("");
const cupYear = ref("");
const signeeDialog = ref(false);
const editedSignee = ref(null);

const textClass = computed(() => ({ "text-white": store.isDark }));
const signeeColumns = computed(() => [
  { key: "boat_number", title: t("boat-number") },
  { key: "captain_name", title: t("captain-name") },
  { key: "temp_captain_name", title: t("temp-captain-name") },
  { key: "locality", title: t("locality-team") },
  { key: "modify", title: t("edit"), sortable: false },
  { key: "delete", title: t("delete"), sortable: false },
]);

watch(cup, (c) => {
  cupName.value = c?.name ?? "";
  cupYear.value = c?.year ?? "";
});

function openSigneeDialog(signee) {
  signeeError.value = "";
  editedSignee.value = signee;
  signeeDialog.value = true;
}

async function saveSignee(form) {
  const ok = editedSignee.value
    ? await editSignee(editedSignee.value, form)
    : await addSignee(form);
  if (ok) signeeDialog.value = false;
}

function askDeleteSignee(signee) {
  confirm(t("confirm-dialog"), t("button.delete-signee"), "question")
    .then(() => deleteSignee(signee))
    .catch(() => {}); // cancelled
}

// Make it the "current competition" and go to its overview
function openCompetition(competition) {
  store.competition = competition;
  localStorage.setItem(
    "competition",
    JSON.stringify({
      _id: competition._id,
      start_date: competition.start_date,
      end_date: competition.end_date,
    }),
  );
  router.push({ path: "/overview" });
}

onMounted(() => {
  const cupId = localStorage.getItem("cup");
  if (cupId) load(cupId);
  else console.log("No cup in localstorage!");
});
</script>
