<template>
  <!-- /register-comp: create a new competition step by step -->
  <div class="fs-page create">
    <PageHead
      :title="$t('comp.create')"
      :eyebrow="$t('dashboard.new-competition')"
      tone="signing"
    >
      <template #actions>
        <v-btn
          v-if="prevRoute?.name"
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="router.push({ path: prevRoute.path })"
          >{{ $t("button.return-back") }}</v-btn
        >
      </template>
    </PageHead>

    <div class="create__layout">
      <nav :aria-label="$t('create-page.steps')" class="fs-panel create__steps">
        <ol>
          <li v-for="(step, index) in steps" :key="step.value">
            <button
              type="button"
              class="create__step"
              :class="{ 'create__step--on': tab === step.value }"
              :aria-current="tab === step.value ? 'step' : undefined"
              :disabled="!step.enabled"
              @click="tab = step.value"
            >
              <span
                aria-hidden="true"
                class="create__badge"
                :class="{ 'create__badge--done': step.done }"
              >
                <v-icon v-if="step.done" icon="mdi-check" size="16" />
                <template v-else>{{ index + 1 }}</template>
              </span>
              <span class="create__step-text">
                <span class="create__step-label">{{ step.label }}</span>
                <span class="fs-muted create__step-state">{{
                  step.done
                    ? $t("create-page.done")
                    : tab === step.value
                      ? $t("create-page.current")
                      : ""
                }}</span>
              </span>
            </button>
          </li>
        </ol>
      </nav>

      <div class="create__content">
        <ErrorList :errors="errors" />

        <!-- 1. Basic info -->
        <FsSection
          v-if="tab === 'basic-info'"
          tone="signing"
          icon="mdi-card-text-outline"
          :title="`1. ${$t('basic-info')}`"
        >
          <v-skeleton-loader v-if="loading" type="paragraph" />
          <template v-else>
            <LockedNotice v-if="locked.basic" />
            <div class="pair">
              <v-text-field
                v-model="name"
                :label="$t('comp.is') + ' ' + $t('name')"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
                :disabled="locked.basic"
                autofocus
              />
              <v-text-field
                v-model="locality"
                :label="$t('locality')"
                :maxlength="40"
                :counter="40"
                :rules="rules.text"
                :disabled="locked.basic"
              />
            </div>

            <DateTimeFields
              v-model:start-date="startDate"
              v-model:end-date="endDate"
              v-model:start-time="startTime"
              v-model:end-time="endTime"
              :disabled="locked.basic"
            />

            <YesNoField
              v-model="isTeamCompetition"
              :label="`${$t('is-there')} ${$t('comp.is-team')}?`"
              :disabled="locked.basic"
            />
            <YesNoField
              v-model="isCupCompetition"
              :label="$t('does-it-belong') + '?'"
              :disabled="locked.basic"
            />

            <div v-if="isCupCompetition" class="create__cup">
              <template v-if="cups.length">
                <div class="d-flex align-center flex-wrap ga-3">
                  <v-select
                    v-model="cup"
                    :items="cups"
                    item-title="select"
                    item-value="_id"
                    :label="`${$t('choose')} ${$t('cup.normal')}`"
                    :disabled="locked.basic"
                    return-object
                    hide-details="auto"
                    class="flex-grow-1"
                  />
                  <v-btn
                    variant="text"
                    color="signing"
                    prepend-icon="mdi-plus"
                    to="/dashboard"
                    >{{ $t("dashboard.new-cup") }}</v-btn
                  >
                </div>
                <div class="pair">
                  <NumberStepper
                    v-model="participationPoints"
                    :label="$t('participation-points')"
                    :maxlength="6"
                    :disabled="locked.basic"
                  />
                  <NumberStepper
                    v-model="pointsMultiplier"
                    :label="$t('overview-page.cup-multiplier')"
                    :step="0.5"
                    :min="1"
                    :maxlength="3"
                    decimal
                    :disabled="locked.basic"
                  />
                </div>
                <PlacementPointsEditor
                  v-model="placementPoints"
                  :disabled="locked.basic"
                />
              </template>
              <v-alert v-else type="info" variant="tonal">
                {{ $t("create-competition.no-cups-created") }}
                <template #append>
                  <v-btn variant="text" to="/dashboard">{{
                    $t("dashboard.new-cup")
                  }}</v-btn>
                </template>
              </v-alert>
            </div>

            <StepButtons
              :locked="locked.basic"
              :show-back="false"
              @unlock="unlock('basic')"
              @validate="validateBasicInfo"
              @next="tab = 'fishes'"
            />
          </template>
        </FsSection>

        <!-- 2. Fish species -->
        <FsSection
          v-else-if="tab === 'fishes'"
          tone="weighing"
          icon="mdi-fish"
          :title="`2. ${$t('fish-species')}`"
        >
          <LockedNotice v-if="locked.species" />
          <span class="fs-muted">{{ $t("fish-species-choose") }}</span>
          <FishSpeciesPicker v-model="species" :disabled="locked.species" />
          <StepButtons
            :locked="locked.species"
            @back="tab = 'basic-info'"
            @unlock="unlock('species')"
            @validate="validateSpecies"
            @next="tab = 'points'"
          />
        </FsSection>

        <!-- 3. Multipliers and minimum sizes -->
        <FsSection
          v-else-if="tab === 'points'"
          tone="weighing"
          icon="mdi-scale"
          :title="`3. ${$t('create-page.specs')}`"
        >
          <LockedNotice v-if="locked.specs" />
          <span class="fs-muted">{{
            $t("create-competition.multiplier-title")
          }}</span>
          <FishSpecsTable v-model="fishSpecs" :disabled="locked.specs" />
          <StepButtons
            v-if="fishSpecs.length"
            :locked="locked.specs"
            @back="tab = 'fishes'"
            @unlock="unlock('specs')"
            @validate="validateSpecs"
            @next="tab = 'summary'"
          />
        </FsSection>

        <!-- 4. Summary -->
        <FsSection
          v-else-if="tab === 'summary' && basicInfo"
          tone="results"
          icon="mdi-check-decagram-outline"
          :title="`4. ${$t('overview')}`"
        >
          <CompetitionSummary :info="basicInfo" :fishes="completedFishSpecs" />
          <div class="d-flex flex-wrap align-center ga-3 pt-2">
            <v-btn
              variant="text"
              size="large"
              prepend-icon="mdi-arrow-left"
              @click="tab = 'points'"
              >{{ $t("back") }}</v-btn
            >
            <v-spacer />
            <v-btn
              v-if="canSubmit"
              color="signing"
              size="large"
              prepend-icon="mdi-check"
              :loading="saving"
              @click="save"
              >{{ $t("create-competition.submit-button") }}</v-btn
            >
          </div>
        </FsSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { usePreviousRoute } from "@/composables/usePreviousRoute";
import { useCompetitionForm } from "@/composables/useCompetitionForm";
import { useRules } from "@/composables/useRules";
import ErrorList from "../components/ErrorList.vue";
import PageHead from "../components/ui/PageHead.vue";
import FsSection from "../components/ui/FsSection.vue";
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

const { t } = useI18n();
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

// a step opens once the step before it has been checked
const steps = computed(() => [
  {
    value: "basic-info",
    label: t("basic-info"),
    done: locked.value.basic,
    enabled: true,
  },
  {
    value: "fishes",
    label: t("fish-species"),
    done: locked.value.species,
    enabled: locked.value.basic,
  },
  {
    value: "points",
    label: t("create-page.specs"),
    done: locked.value.specs,
    enabled: locked.value.species,
  },
  {
    value: "summary",
    label: t("overview"),
    done: false,
    enabled: locked.value.specs,
  },
]);

async function save() {
  if (await submit()) router.push({ path: "/dashboard" });
}

// ?cup=<id> preselects a cup (links from the dashboard)
onMounted(() => loadCups(route.query.cup));
</script>

<style scoped>
.create {
  max-width: 1180px;
}
.create__layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.create__steps {
  flex: 0 0 260px;
  padding: 10px;
  position: sticky;
  top: 16px;
}
.create__steps ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.create__step {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.create__step:hover:not(:disabled) {
  background: rgba(var(--v-border-color), 0.06);
}
.create__step:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
}
.create__step:disabled {
  cursor: default;
  opacity: 0.5;
}
.create__step--on,
.create__step--on:hover:not(:disabled) {
  background: rgb(var(--v-theme-signing-soft));
  outline: 2px solid rgb(var(--v-theme-on-surface));
  outline-offset: -2px;
}
.create__badge {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), 0.4);
  font-weight: 700;
  font-size: 14px;
  box-sizing: border-box;
}
.create__badge--done {
  border-color: transparent;
  background: rgb(var(--v-theme-signing));
  color: rgb(var(--v-theme-on-signing));
}
.create__step-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.create__step-label {
  font-weight: 700;
}
.create__step-state {
  font-size: 13px;
}
.create__content {
  flex: 1 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.create__cup {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(var(--v-border-color), 0.04);
}
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 760px) {
  .create__steps {
    flex: 1 1 100%;
    position: static;
  }
  .create__steps ol {
    flex-direction: row;
    overflow-x: auto;
  }
  .create__step-state {
    display: none;
  }
}
@media (max-width: 600px) {
  .pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
