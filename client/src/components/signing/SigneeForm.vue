<template>
  <!-- Boat details form of the signing view -->
  <div id="signing-inputs">
    <v-row>
      <v-col md="3" offset-md="4" class="input-fields">
        <NumberStepper
          v-model="form.boat_number"
          :label="$t('boat-number')"
          :min="1"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col v-if="hasCup" md="2" offset-md="2" class="mt-5">
        <v-btn block color="blue" size="large" @click="emit('search-cup')">
          <v-icon start>mdi-find-replace</v-icon>{{ $t("button.search-cup") }}
        </v-btn>
      </v-col>
      <v-col md="2" :offset-md="hasCup ? 2 : 4" class="mt-5">
        <v-btn block color="indigo" size="large" @click="emit('search')">
          <v-icon start>mdi-magnify</v-icon>{{ $t("button.search-signees") }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-for="field in textFields" :key="field.key">
      <v-col md="5" offset-md="3" class="input-fields">
        <v-text-field
          v-model="form[field.key]"
          :label="$t(field.label)"
          :maxlength="TEAM_MAX_LENGTH"
          :counter="TEAM_MAX_LENGTH"
          :loading="saving"
        />
      </v-col>
    </v-row>

    <!-- Team only for team competitions -->
    <v-row v-if="isTeamCompetition">
      <v-col md="5" offset-md="3" class="input-fields">
        <v-combobox
          v-model="form.team"
          :items="teams"
          :label="$t('choose-or-type-team')"
          :maxlength="TEAM_MAX_LENGTH"
          :counter="TEAM_MAX_LENGTH"
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <v-avatar class="bg-accent text-white" size="small">{{
                  String(item.raw ?? item)
                    .slice(0, 1)
                    .toUpperCase()
                }}</v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-combobox>
      </v-col>
    </v-row>

    <v-row v-if="saving">
      <v-col>
        <p class="text-body-large" :class="{ 'text-white': store.isDark }">
          {{ $t("saving") }}...
        </p>
        <ProgressBarQuery />
      </v-col>
    </v-row>
    <v-row v-else class="ma-6" justify="center">
      <v-col md="3" class="mt-5">
        <v-btn
          block
          color="red"
          size="large"
          :disabled="!canDelete || refreshing"
          @click="emit('delete')"
        >
          <v-icon start>mdi-delete</v-icon>{{ $t("button.delete-signee") }}
        </v-btn>
      </v-col>
      <v-col md="3" class="mt-5">
        <v-btn block color="yellow" size="large" @click="emit('clear')">
          <v-icon start>mdi-backspace-reverse-outline</v-icon
          >{{ $t("button.clear") }}
        </v-btn>
      </v-col>
      <v-col md="3" class="mt-5">
        <v-btn
          id="sbtn"
          block
          color="green"
          size="large"
          :loading="refreshing"
          :disabled="!canSave"
          @click="emit('save')"
        >
          <v-icon start>mdi-content-save</v-icon>{{ $t("save") }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/store";
import { TEAM_MAX_LENGTH } from "@/utils/signees";
import NumberStepper from "../competition-form/NumberStepper.vue";
import ProgressBarQuery from "../layout/ProgressBarQuery.vue";

const form = defineModel("form", { type: Object, required: true });
const props = defineProps({
  teams: { type: Array, default: () => [] },
  isTeamCompetition: Boolean,
  hasCup: Boolean,
  canDelete: Boolean,
  saving: Boolean,
  refreshing: Boolean,
});
const emit = defineEmits(["search", "search-cup", "clear", "save", "delete"]);
const store = useMainStore();

const textFields = [
  { key: "captain_name", label: "captain-name" },
  { key: "temp_captain_name", label: "temp-captain-name" },
  { key: "locality", label: "locality-team" },
  { key: "starting_place", label: "starting-place" },
];

// temporary captain is optional: it defaults to "-"
const canSave = computed(
  () =>
    !props.refreshing &&
    !props.saving &&
    Number(form.value.boat_number) > 0 &&
    !!String(form.value.captain_name ?? "").trim() &&
    !!String(form.value.locality ?? "").trim(),
);
</script>
