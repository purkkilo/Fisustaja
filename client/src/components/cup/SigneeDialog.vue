<template>
  <!-- Add a cup signee, or edit one (pass `signee`) -->
  <v-dialog v-model="open" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-headline-small" v-if="signee"
          >{{ $t("modify") }} ({{ $t("boat-number-short") }}
          {{ signee.boat_number }})</span
        >
        <span class="text-headline-small" v-else
          >{{ $t("add") }} {{ $t("signee") }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" class="mb-4">{{
          $t(error)
        }}</v-alert>
        <NumberStepper
          v-if="!signee"
          v-model="form.boat_number"
          :label="$t('boat-number')"
          :min="1"
          :maxlength="6"
        />
        <v-text-field
          v-model="form.captain_name"
          :label="$t('captain-name') + '*'"
          maxlength="40"
          counter="40"
        />
        <v-text-field
          v-model="form.temp_captain_name"
          :label="$t('temp-captain-name')"
          maxlength="40"
          counter="40"
        />
        <v-text-field
          v-model="form.locality"
          :label="$t('locality-team') + (signee ? '*' : '')"
          maxlength="40"
          counter="40"
        />
        <small>*{{ $t("must-fields") }}</small>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="yellow-darken-2"
          :disabled="saving"
          @click="open = false"
          >{{ $t("cancel") }}</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-2"
          :loading="saving"
          @click="emit('save', { ...form })"
          >{{ signee ? $t("save") : $t("add") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, watch } from "vue";
import NumberStepper from "../competition-form/NumberStepper.vue";

const open = defineModel({ type: Boolean, default: false });
const props = defineProps({
  // the signee being edited; null = adding a new one
  signee: { type: Object, default: null },
  // number suggested for a new signee
  nextNumber: { type: Number, default: 1 },
  error: { type: String, default: "" },
  saving: { type: Boolean, default: false },
});
const emit = defineEmits(["save"]);

const form = reactive({
  boat_number: 1,
  captain_name: "",
  temp_captain_name: "",
  locality: "",
});

// Fill the form each time the dialog opens
watch(open, (isOpen) => {
  if (!isOpen) return;
  const s = props.signee;
  form.boat_number = s ? s.boat_number : props.nextNumber;
  form.captain_name = s?.captain_name ?? "";
  form.temp_captain_name =
    s && s.temp_captain_name !== "-" ? s.temp_captain_name : "";
  form.locality = s && s.locality !== "-" ? s.locality : "";
});
</script>
