<template>
  <!-- /comp-settings: view and edit the current competition's settings -->
  <div class="fs-page settings">
    <PageHead
      :title="editing ? $t('modify-settings') : $t('settings-page.title')"
      :eyebrow="$t('steps.settings')"
      tone="muted"
    >
      <template #actions>
        <v-btn
          v-if="!editing"
          :disabled="!competition"
          variant="outlined"
          prepend-icon="mdi-pencil"
          @click="startEditing"
          >{{ $t("modify-info") }}</v-btn
        >
      </template>
    </PageHead>

    <v-alert v-if="!competitionId" type="info" variant="tonal">
      {{ $t("overview-page.not-selected") }}
    </v-alert>
    <v-skeleton-loader
      v-else-if="loading && !competition"
      type="heading, list-item-three-line, list-item-three-line"
      class="fs-panel"
    />

    <!-- Saved settings -->
    <div v-else-if="competition && !editing" class="settings__grid">
      <FsSection
        class="settings__main"
        icon="mdi-information-outline"
        :title="$t('settings-page.info')"
      >
        <CompetitionSummary
          :info="competition"
          :fishes="competition.fishes || []"
        />
      </FsSection>

      <div class="settings__side">
        <FsSection
          icon="mdi-earth"
          tone="results"
          :title="$t('settings-page.publishing')"
        >
          <div class="toggle">
            <v-switch
              :model-value="!!competition.isPublic"
              :label="$t('settings-page.public-label')"
              :loading="updating"
              :disabled="updating"
              color="signing"
              inset
              hide-details
              @update:model-value="togglePublic"
            />
            <span class="fs-muted">{{ $t("settings-page.public-help") }}</span>
          </div>
          <div class="toggle">
            <v-switch
              :model-value="!!competition.isFinished"
              :label="$t('settings-page.finished-label')"
              :loading="updating"
              :disabled="updating"
              color="results"
              inset
              hide-details
              @update:model-value="toggleFinished"
            />
            <span class="fs-muted">{{
              $t("settings-page.finished-help")
            }}</span>
          </div>
        </FsSection>

        <FsSection
          icon="mdi-alert-outline"
          tone="danger"
          :title="$t('button.delete-comp')"
        >
          <span class="fs-muted">{{ $t("settings-page.delete-help") }}</span>
          <v-btn
            color="error"
            variant="outlined"
            prepend-icon="mdi-delete-forever-outline"
            :loading="updating"
            @click="askDelete"
            >{{ $t("button.delete-comp") }}</v-btn
          >
        </FsSection>
      </div>
    </div>

    <!-- Edit form -->
    <form
      v-else-if="competition && editing"
      class="settings__form"
      @submit.prevent="saveSettings"
    >
      <ErrorList :errors="errors" />

      <FsSection
        icon="mdi-card-text-outline"
        tone="signing"
        :title="$t('basic-info')"
      >
        <div class="pair">
          <v-text-field
            v-model="name"
            :label="$t('comp.is') + ' ' + $t('name')"
            :maxlength="40"
            :counter="40"
            :rules="rules.text"
          />
          <v-text-field
            v-model="locality"
            :label="$t('locality')"
            :maxlength="40"
            :counter="40"
            :rules="rules.text"
          />
        </div>
        <YesNoField
          v-model="isTeamCompetition"
          :label="`${$t('is-there')} ${$t('comp.is-team')}?`"
        />
      </FsSection>

      <FsSection icon="mdi-clock-outline" :title="$t('settings-page.time')">
        <DateTimeFields
          v-model:start-date="startDate"
          v-model:end-date="endDate"
          v-model:start-time="startTime"
          v-model:end-time="endTime"
        />
      </FsSection>

      <FsSection icon="mdi-medal-outline" :title="$t('cup.normal')">
        <YesNoField
          v-model="isCupCompetition"
          :label="$t('does-it-belong') + '?'"
        />
        <template v-if="isCupCompetition">
          <v-select
            v-model="cup"
            :items="cups"
            item-title="select"
            item-value="_id"
            :label="`${$t('choose')} ${$t('cup.normal')}`"
            return-object
            hide-details="auto"
          />
          <div class="pair">
            <NumberStepper
              v-model="participationPoints"
              :label="$t('participation-points')"
              :maxlength="6"
            />
            <NumberStepper
              v-model="pointsMultiplier"
              :label="$t('overview-page.cup-multiplier')"
              :step="0.5"
              :min="1"
              :maxlength="3"
              decimal
            />
          </div>
          <PlacementPointsEditor v-model="placementPoints" />
        </template>
      </FsSection>

      <FsSection icon="mdi-fish" :title="$t('fish-species')">
        <FishSpecsEditor v-model="fishes" @add="addFish" @remove="removeFish" />
      </FsSection>

      <div class="settings__bar">
        <v-btn variant="text" size="large" @click="cancelEditing">{{
          $t("cancel")
        }}</v-btn>
        <v-btn
          type="submit"
          color="signing"
          size="large"
          prepend-icon="mdi-check"
          :loading="loading"
          >{{ $t("save") }}</v-btn
        >
      </div>
    </form>

    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { confirm } from "@/plugins/alerts";
import { useRules } from "@/composables/useRules";
import { useCompetitionSettings } from "@/composables/useCompetitionSettings";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";
import PageHead from "../components/ui/PageHead.vue";
import FsSection from "../components/ui/FsSection.vue";
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
const competitionId = stored?._id ?? null;
if (competitionId) load(competitionId);
</script>

<style scoped>
.settings {
  max-width: 1240px;
}
.settings__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}
.settings__main {
  flex: 2 1 520px;
}
.settings__side {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}
.toggle {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.toggle .fs-muted {
  font-size: 14px;
  padding-left: 4px;
}
.toggle :deep(.v-label) {
  opacity: 1;
  font-weight: 600;
}
.settings__form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
}
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 600px) {
  .pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
/* Save / cancel stay in view while scrolling a long form */
.settings__bar {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 14px 24px;
  border-radius: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.06);
}
</style>
