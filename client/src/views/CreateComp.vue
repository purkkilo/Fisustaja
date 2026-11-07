<template>
  <!-- /register-comp: create a new competition step by step -->
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-row v-if="prevRoute?.name">
      <v-col>
        <v-btn
          rounded
          color="yellow"
          @click="router.push({ path: prevRoute.path })"
          size="large"
          ><v-icon>mdi-keyboard-return</v-icon
          >{{ $t("button.return-back") }}</v-btn
        >
      </v-col>
    </v-row>
    <ErrorList :errors="errors" />

    <v-card style="background: transparent" elevation="3" variant="outlined">
      <h1 style="margin: 30px">{{ $t("comp.is") }} {{ $t("creation") }}</h1>

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
        <v-tab value="basic-info">1. {{ $t("basic-info") }}</v-tab>
        <v-tab :disabled="!locked.basic" value="fishes"
          >2. {{ $t("fish-species") }}</v-tab
        >
        <v-tab :disabled="!locked.species" value="points"
          >3. {{ $t("multipliers") }} {{ $t("and") }} {{ $t("min-sizes") }}
        </v-tab>
        <v-tab :disabled="!locked.specs" value="summary"
          >4. {{ $t("overview") }}</v-tab
        >
      </v-tabs>

      <v-window v-model="tab" style="background: rgba(1, 1, 1, 0.4)">
        <!-- 1. Basic info -->
        <v-window-item value="basic-info">
          <v-container v-if="loading">
            <h2 :class="textClass">{{ $t("loading") }}...</h2>
            <ProgressBarQuery />
          </v-container>
          <v-container v-else>
            <h2 class="text-white">{{ $t("basic-info") }}</h2>
            <LockedNotice v-if="locked.basic" />

            <v-row class="justify-center">
              <v-col cols="6" class="input-fields">
                <v-text-field
                  :label="$t('comp.is') + ' ' + $t('name')"
                  v-model="name"
                  :maxlength="40"
                  :counter="40"
                  :rules="rules.text"
                  :disabled="locked.basic"
                />
                <v-text-field
                  :label="$t('locality')"
                  v-model="locality"
                  :maxlength="40"
                  :counter="40"
                  :rules="rules.text"
                  :disabled="locked.basic"
                />
              </v-col>
            </v-row>

            <YesNoField
              v-model="isCupCompetition"
              :label="$t('does-it-belong') + '?'"
              :disabled="locked.basic"
            />

            <template v-if="isCupCompetition">
              <v-row v-if="cups.length" class="justify-end align-center">
                <v-col cols="6" class="input-fields">
                  <v-list-subheader class="text-white"
                    >{{ $t("choose") }} {{ $t("cup.normal") }}
                  </v-list-subheader>
                  <v-select
                    v-model="cup"
                    :items="cups"
                    item-title="select"
                    item-value="_id"
                    :disabled="locked.basic"
                    return-object
                    single-line
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="3" style="margin-top: 20px">
                  <v-btn
                    tile
                    color="green-lighten-1"
                    to="/dashboard"
                    size="large"
                    variant="outlined"
                    ><v-icon>mdi-plus-circle</v-icon>{{ $t("create") }}
                    {{ $t("new") }} {{ $t("cup.normal") }}</v-btn
                  >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col md="6" offset-md="2" style="margin-top: 20px">
                  <p class="flow-text" :class="textClass">
                    {{ $t("create-competition.no-cups-created") }}
                  </p>
                </v-col>
                <v-col md="2" style="margin-top: 20px">
                  <v-btn tile color="blue-lighten-1" to="/dashboard"
                    ><v-icon>mdi-plus-circle</v-icon>{{ $t("create") }}
                    {{ $t("cup.normal") }}!</v-btn
                  >
                </v-col>
              </v-row>

              <template v-if="cups.length">
                <PlacementPointsEditor
                  v-model="placementPoints"
                  :disabled="locked.basic"
                />
                <v-row class="justify-center">
                  <v-col cols="6" class="input-fields">
                    <NumberStepper
                      v-model="participationPoints"
                      :label="
                        $t('cup.normal') + ' ' + $t('participation-points')
                      "
                      :maxlength="6"
                      :disabled="locked.basic"
                    />
                    <NumberStepper
                      v-model="pointsMultiplier"
                      :label="$t('cup.normal') + ' ' + $t('multiplier')"
                      :step="0.5"
                      :min="1"
                      :maxlength="3"
                      decimal
                      :disabled="locked.basic"
                    />
                  </v-col>
                </v-row>
              </template>
            </template>

            <YesNoField
              v-model="isTeamCompetition"
              :label="`${$t('is-there')} ${$t('comp.is-team')}?`"
              :disabled="locked.basic"
            />

            <DateTimeFields
              v-model:start-date="startDate"
              v-model:end-date="endDate"
              v-model:start-time="startTime"
              v-model:end-time="endTime"
              :disabled="locked.basic"
            />

            <StepButtons
              :locked="locked.basic"
              :show-back="false"
              @unlock="unlock('basic')"
              @validate="validateBasicInfo"
              @next="tab = 'fishes'"
            />
          </v-container>
        </v-window-item>

        <!-- 2. Fish species -->
        <v-window-item :class="panelClass" value="fishes">
          <v-container>
            <LockedNotice v-if="locked.species" />
            <h3 :class="textClass">{{ $t("fish-species-choose") }}</h3>
            <v-row>
              <v-col md="10" offset-md="1">
                <FishSpeciesPicker
                  v-model="species"
                  :disabled="locked.species"
                />
              </v-col>
            </v-row>
            <StepButtons
              :locked="locked.species"
              @back="tab = 'basic-info'"
              @unlock="unlock('species')"
              @validate="validateSpecies"
              @next="tab = 'points'"
            />
          </v-container>
        </v-window-item>

        <!-- 3. Multipliers and minimum sizes -->
        <v-window-item :class="panelClass" value="points">
          <v-container>
            <p class="flow-text" :class="textClass">
              {{ $t("create-competition.multiplier-title") }}
            </p>
            <LockedNotice v-if="locked.specs" />
            <FishSpecsTable v-model="fishSpecs" :disabled="locked.specs" />
            <StepButtons
              v-if="fishSpecs.length"
              :locked="locked.specs"
              @back="tab = 'fishes'"
              @unlock="unlock('specs')"
              @validate="validateSpecs"
              @next="tab = 'summary'"
            />
          </v-container>
        </v-window-item>

        <!-- 4. Summary -->
        <v-window-item v-if="basicInfo" :class="panelClass" value="summary">
          <v-container v-if="saving">
            <h2 :class="textClass">{{ $t("saving") }}...</h2>
            <ProgressBarQuery />
          </v-container>
          <v-container v-else>
            <CompetitionSummary
              :info="basicInfo"
              :fishes="completedFishSpecs"
            />
            <v-row style="margin: 20px 0 10px">
              <v-col md="5" offset-md="1">
                <v-btn
                  tile
                  color="blue-lighten-2"
                  @click="tab = 'points'"
                  size="large"
                  ><v-icon>mdi-keyboard-return</v-icon>{{ $t("back") }}</v-btn
                >
              </v-col>
              <v-col md="5" v-if="canSubmit">
                <v-btn tile color="green" @click="save" size="large"
                  ><v-icon>mdi-plus-circle</v-icon
                  >{{ $t("create-competition.submit-button") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "@/store";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import { useCompetitionForm } from "@/composables/useCompetitionForm";
import { useRules } from "@/composables/useRules";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import ErrorList from "../components/ErrorList.vue";
import NumberStepper from "../components/competition-form/NumberStepper.vue";
import PlacementPointsEditor from "../components/competition-form/PlacementPointsEditor.vue";
import DateTimeFields from "../components/competition-form/DateTimeFields.vue";
import FishSpeciesPicker from "../components/competition-form/FishSpeciesPicker.vue";
import FishSpecsTable from "../components/competition-form/FishSpecsTable.vue";
import CompetitionSummary from "../components/competition-form/CompetitionSummary.vue";
import StepButtons from "../components/competition-form/StepButtons.vue";
import YesNoField from "../components/competition-form/YesNoField.vue";
import LockedNotice from "../components/competition-form/LockedNotice.vue";

defineOptions({ name: "CreateComp" });

const store = useMainStore();
const router = useRouter();
const route = useRoute();
const prevRoute = usePreviousRoute();
const rules = useRules();

const {
  tab,
  errors,
  loading,
  saving,
  locked,
  name,
  locality,
  isCupCompetition,
  isTeamCompetition,
  cups,
  cup,
  participationPoints,
  pointsMultiplier,
  placementPoints,
  startDate,
  endDate,
  startTime,
  endTime,
  basicInfo,
  species,
  fishSpecs,
  completedFishSpecs,
  canSubmit,
  loadCups,
  unlock,
  validateBasicInfo,
  validateSpecies,
  validateSpecs,
  submit,
} = useCompetitionForm();

const panelClass = computed(() =>
  store.getTheme ? "inputarea-dark" : "inputarea",
);
const textClass = computed(() => ({ "text-white": store.getTheme }));

async function save() {
  if (await submit()) router.push({ path: "/dashboard" });
}

// ?cup=<id> preselects a cup (links from the dashboard)
onMounted(() => loadCups(route.query.cup));
</script>
