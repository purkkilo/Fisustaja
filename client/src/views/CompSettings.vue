<template>
  <!-- /comp-settings: view and edit the current competition's settings -->
  <div>
    <Timedate />

    <v-container
      :class="{
        mobile: $vuetify.display.width < 800,
        browser: $vuetify.display.width >= 800,
        wide: $vuetify.display.width >= 1200,
      }"
    >
      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row class="align-center">
          <v-col>
            <h1 style="margin: 30px">{{ $t("settings") }}</h1>
          </v-col>
          <v-col>
            <v-btn
              :disabled="editing || !competition"
              tile
              color="grey"
              @click="startEditing"
              size="large"
              ><v-icon>mdi-cog-transfer</v-icon>{{ $t("modify-info") }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card>

      <v-card style="background: transparent" elevation="3" variant="outlined">
        <v-row v-if="loading" class="justify-center align-center">
          <v-col>
            <h2 class="text-white">{{ $t("loading") }}...</h2>
            <ProgressBarQuery />
          </v-col>
        </v-row>

        <!-- Saved settings -->
        <template v-else-if="competition && !editing">
          <v-row style="margin-top: 20px">
            <v-col md="10" offset-md="1">
              <CompetitionSummary
                :info="competition"
                :fishes="competition.fishes || []"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col style="margin-top: 20px">
              <v-btn
                rounded
                :color="
                  competition.isPublic ? 'grey-darken-4' : 'green-darken-4'
                "
                @click="togglePublic"
                class="text-white"
                :loading="updating"
                size="large"
              >
                <template v-if="competition.isPublic">
                  <v-icon>mdi-incognito</v-icon>{{ $t("button.set-private") }}
                </template>
                <template v-else>
                  <v-icon color="green">mdi-publish</v-icon
                  >{{ $t("button.set-public") }}
                </template>
              </v-btn>
            </v-col>
            <v-col style="margin-top: 20px">
              <v-btn
                rounded
                :color="competition.isFinished ? 'yellow' : 'green-darken-3'"
                @click="toggleFinished"
                :loading="updating"
                size="large"
              >
                <span v-if="competition.isFinished" class="text-black">
                  <v-icon color="red-darken-2">mdi-cancel</v-icon>
                  {{ $t("button.set-not-complete") }}
                </span>
                <span v-else>
                  <v-icon color="yellow">mdi-trophy</v-icon>
                  {{ $t("button.set-complete") }}
                </span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row style="margin-bottom: 20px">
            <v-col md="3" offset-md="4" style="margin-top: 20px">
              <v-btn
                block
                color="red-darken-4"
                class="text-white"
                :loading="updating"
                @click="askDelete"
                ><v-icon color="white">mdi-delete-forever</v-icon
                >{{ $t("button.delete-comp") }}</v-btn
              >
            </v-col>
          </v-row>
        </template>

        <!-- Edit form -->
        <template v-else-if="competition && editing">
          <ErrorList :errors="errors" />
          <h1>{{ $t("modify-settings") }}</h1>

          <v-row class="justify-center">
            <v-col cols="6" class="input-fields">
              <v-text-field
                :label="$t('comp.is') + ' ' + $t('name')"
                v-model="name"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
              />
              <v-text-field
                :label="$t('locality')"
                v-model="locality"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
              />
            </v-col>
          </v-row>

          <YesNoField
            v-model="isCupCompetition"
            :label="$t('does-it-belong') + '?'"
          />
          <template v-if="isCupCompetition">
            <v-row class="justify-center">
              <v-col cols="6" class="input-fields">
                <v-list-subheader class="text-white"
                  >{{ $t("choose") }} {{ $t("cup.normal") }}</v-list-subheader
                >
                <v-select
                  v-model="cup"
                  :items="cups"
                  item-title="select"
                  item-value="_id"
                  return-object
                  single-line
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
            <PlacementPointsEditor v-model="placementPoints" />
            <v-row class="justify-center">
              <v-col cols="6" class="input-fields">
                <NumberStepper
                  v-model="participationPoints"
                  :label="$t('cup.normal') + ' ' + $t('participation-points')"
                  :maxlength="6"
                />
                <NumberStepper
                  v-model="pointsMultiplier"
                  :label="$t('cup.normal') + ' ' + $t('multiplier')"
                  :step="0.5"
                  :min="1"
                  :maxlength="3"
                  decimal
                />
              </v-col>
            </v-row>
          </template>

          <YesNoField
            v-model="isTeamCompetition"
            :label="`${$t('is-there')} ${$t('comp.is-team')}?`"
          />

          <DateTimeFields
            v-model:start-date="startDate"
            v-model:end-date="endDate"
            v-model:start-time="startTime"
            v-model:end-time="endTime"
          />

          <v-row class="justify-center align-center">
            <v-col cols="12" md="10">
              <FishSpecsEditor
                v-model="fishes"
                @add="addFish"
                @remove="removeFish"
              />
            </v-col>
          </v-row>

          <v-row style="margin-bottom: 20px">
            <v-col md="6">
              <v-btn
                color="yellow"
                class="text-black"
                @click="cancelEditing"
                size="large"
                ><v-icon color="red-darken-2">mdi-cancel</v-icon
                >{{ $t("cancel") }}</v-btn
              >
            </v-col>
            <v-col md="6">
              <v-btn color="green" @click="saveSettings" size="large"
                ><v-icon color="green-darken-4">mdi-check-outline</v-icon>
                {{ $t("save") }}</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-card>
      <NotificationBar v-model:snackbar="snackbar" :text="text" />
    </v-container>
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { confirm } from "@/plugins/alerts";
import { useRules } from "@/composables/useRules";
import { useCompetitionSettings } from "@/composables/useCompetitionSettings";
import Timedate from "../components/layout/Timedate.vue";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";
import CompetitionSummary from "../components/competition-form/CompetitionSummary.vue";
import YesNoField from "../components/competition-form/YesNoField.vue";
import NumberStepper from "../components/competition-form/NumberStepper.vue";
import PlacementPointsEditor from "../components/competition-form/PlacementPointsEditor.vue";
import DateTimeFields from "../components/competition-form/DateTimeFields.vue";
import FishSpecsEditor from "../components/competition-form/FishSpecsEditor.vue";

defineOptions({ name: "CompSettings" });

const { t } = useI18n();
const router = useRouter();
const rules = useRules();
const {
  competition,
  loading,
  updating,
  editing,
  errors,
  cups,
  name,
  locality,
  isCupCompetition,
  isTeamCompetition,
  cup,
  participationPoints,
  pointsMultiplier,
  placementPoints,
  startDate,
  endDate,
  startTime,
  endTime,
  fishes,
  load,
  startEditing,
  cancelEditing,
  addFish,
  removeFish,
  save,
  togglePublic,
  toggleFinished,
  remove,
} = useCompetitionSettings();

const snackbar = ref(false);
const text = ref("");
function notify(message) {
  text.value = message;
  snackbar.value = false;
  nextTick(() => (snackbar.value = true));
}

async function saveSettings() {
  if (await save(t)) notify("notification.updated");
}

function askDelete() {
  confirm(t("confirm-dialog"), t("button.delete-comp"), "question")
    .then(async () => {
      notify("notification.deleting");
      if (await remove()) router.push({ path: "/dashboard" });
    })
    .catch(() => {}); // cancelled
}

// The competition being edited is remembered in localStorage
const stored = JSON.parse(localStorage.getItem("competition") || "null");
if (stored?._id) load(stored._id);
else console.log("No competition in localstorage!");
</script>
