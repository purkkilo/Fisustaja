<template>
  <!-- Add a boat, or edit the one picked from the list -->
  <section aria-labelledby="form-title" class="fs-panel boat-form">
    <div class="boat-form__head">
      <h2 id="form-title">
        {{
          editing
            ? $t("signing-page.edit-boat", { n: editing.boat_number })
            : $t("signing-page.new-boat")
        }}
      </h2>
      <v-btn
        v-if="hasCup"
        variant="outlined"
        color="signing"
        size="small"
        prepend-icon="mdi-trophy-outline"
        @click="emit('search-cup')"
        >{{ $t("signing-page.from-cup") }}</v-btn
      >
    </div>

    <form class="boat-form__body" @submit.prevent="emit('save')">
      <div class="boat-form__number">
        <label for="boat-number" class="font-weight-bold">{{
          $t("boat-number")
        }}</label>
        <div class="d-flex align-center ga-3">
          <input
            id="boat-number"
            v-model.number="form.boat_number"
            inputmode="numeric"
            autocomplete="off"
            class="boat-form__number-input fs-display fs-num"
            :class="{
              'boat-form__number-input--clash': clash.status !== 'free',
            }"
          />
          <span class="fs-muted text-body-small"
            >{{ $t("signing-page.next-free") }}:
            <strong class="fs-num">{{ nextNumber }}</strong></span
          >
        </div>
      </div>

      <!-- a number that's taken is sorted out here, before saving -->
      <div
        v-if="clash.status === 'confirm-replace' && !replacing"
        role="alert"
        class="boat-form__clash"
      >
        <span class="font-weight-bold">{{
          $t("signing-page.number-taken", {
            n: clash.clash.boat_number,
            name: clash.clash.captain_name,
          })
        }}</span>
        <div class="d-flex flex-wrap ga-2">
          <v-btn color="signing" size="small" @click="emit('use-next')">{{
            $t("signing-page.use-number", { n: nextNumber })
          }}</v-btn>
          <v-btn
            variant="outlined"
            size="small"
            @click="emit('edit-existing')"
            >{{
              $t("signing-page.open-boat", { n: clash.clash.boat_number })
            }}</v-btn
          >
          <v-btn
            variant="outlined"
            color="results"
            size="small"
            @click="emit('replace')"
            >{{
              $t("signing-page.replace-boat", { n: clash.clash.boat_number })
            }}</v-btn
          >
        </div>
      </div>
      <v-alert
        v-else-if="replacing"
        type="warning"
        variant="tonal"
        density="compact"
        >{{
          $t("signing-page.replacing", {
            n: clash.clash.boat_number,
            name: clash.clash.captain_name,
          })
        }}</v-alert
      >
      <v-alert
        v-else-if="clash.status === 'blocked'"
        type="error"
        variant="tonal"
        density="compact"
        >{{
          $t("signing-page.number-blocked", { n: clash.clash.boat_number })
        }}</v-alert
      >
      <v-alert
        v-if="notification"
        type="info"
        variant="tonal"
        density="compact"
        >{{ $t(notification) }}</v-alert
      >

      <v-text-field
        v-model="form.captain_name"
        :label="$t('captain-name')"
        :maxlength="TEAM_MAX_LENGTH"
        hide-details="auto"
      />
      <v-text-field
        v-model="form.temp_captain_name"
        :label="
          $t('temp-captain-name') + ' (' + $t('signing-page.optional') + ')'
        "
        :maxlength="TEAM_MAX_LENGTH"
        hide-details="auto"
      />
      <div class="boat-form__pair">
        <v-text-field
          v-model="form.locality"
          :label="$t('locality-team')"
          :maxlength="TEAM_MAX_LENGTH"
          hide-details="auto"
        />
        <v-text-field
          v-model="form.starting_place"
          :label="
            $t('starting-place') + ' (' + $t('signing-page.optional') + ')'
          "
          :maxlength="TEAM_MAX_LENGTH"
          hide-details="auto"
        />
      </div>
      <v-combobox
        v-if="isTeamCompetition"
        v-model="form.team"
        :items="teams"
        :label="$t('choose-or-type-team')"
        :maxlength="TEAM_MAX_LENGTH"
        :counter="TEAM_MAX_LENGTH"
      />

      <div class="d-flex flex-wrap ga-2">
        <v-btn
          type="submit"
          color="signing"
          size="large"
          class="flex-grow-1"
          :loading="saving"
          :disabled="!canSave"
        >
          {{
            editing || replacing
              ? $t("signing-page.save-changes")
              : $t("signing-page.save-boat")
          }}
          <kbd class="boat-form__kbd">Enter</kbd>
        </v-btn>
        <v-btn variant="outlined" size="large" @click="emit('clear')">{{
          $t("button.clear")
        }}</v-btn>
        <v-btn
          v-if="editing"
          variant="text"
          color="error"
          size="large"
          prepend-icon="mdi-delete-outline"
          @click="emit('delete')"
          >{{ $t("button.delete-signee") }}</v-btn
        >
      </div>
    </form>

    <div v-if="recent.length" class="boat-form__recent">
      <span class="fs-eyebrow text-signing">{{
        $t("signing-page.recent")
      }}</span>
      <div
        v-for="boat in recent"
        :key="boat._id"
        class="d-flex justify-space-between ga-2"
      >
        <span
          ><strong class="fs-num">{{ boat.boat_number }}</strong>
          {{ boat.captain_name }}</span
        >
        <span class="fs-muted">{{ boat.locality }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { TEAM_MAX_LENGTH } from "@/utils/signees";

const form = defineModel("form", { type: Object, required: true });
const props = defineProps({
  // the boat being edited, null when adding
  editing: { type: Object, default: null },
  nextNumber: { type: Number, default: 1 },
  // boatNumberClash() result for the typed number
  clash: { type: Object, required: true },
  // the user chose to overwrite the clashing boat
  replacing: Boolean,
  notification: { type: String, default: null },
  recent: { type: Array, default: () => [] },
  teams: { type: Array, default: () => [] },
  isTeamCompetition: Boolean,
  hasCup: Boolean,
  saving: Boolean,
});
const emit = defineEmits([
  "save",
  "clear",
  "delete",
  "search-cup",
  "use-next",
  "replace",
  "edit-existing",
]);

// the temporary captain and starting place are optional
const canSave = computed(
  () =>
    !props.saving &&
    Number(form.value.boat_number) > 0 &&
    !!String(form.value.captain_name ?? "").trim() &&
    !!String(form.value.locality ?? "").trim() &&
    (props.clash.status === "free" || props.replacing),
);
</script>

<style scoped>
.boat-form {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.boat-form__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  background: rgb(var(--v-theme-signing-soft));
}
.boat-form__head h2 {
  margin: 0;
  font-size: 22px;
}
.boat-form__body {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.boat-form__number {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.boat-form__number-input {
  width: 120px;
  height: 56px;
  box-sizing: border-box;
  padding: 0 14px;
  border: 2px solid rgb(var(--v-theme-signing));
  border-radius: 12px;
  font-size: 26px;
  font-weight: 700;
  color: inherit;
  background: rgb(var(--v-theme-surface));
}
.boat-form__number-input:focus {
  outline: 3px solid rgba(var(--v-theme-signing), 0.35);
}
.boat-form__number-input--clash {
  border-color: rgb(var(--v-theme-warning));
}
.boat-form__clash {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgb(var(--v-theme-results-soft));
  border: 2px solid rgba(var(--v-theme-warning), 0.5);
}
.boat-form__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.boat-form__kbd {
  margin-left: 8px;
  padding: 1px 6px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.18);
  font: inherit;
  font-size: 12px;
}
.boat-form__recent {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 16px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}
</style>
