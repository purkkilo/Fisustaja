<template>
  <!-- New cup: name, year and optionally how many best results count -->
  <v-dialog v-model="open" max-width="520">
    <v-card :title="$t('cup.create')">
      <v-card-text class="d-flex flex-column ga-2">
        <v-text-field
          v-model="form.name"
          :label="$t('cup.normal') + ' ' + $t('name')"
          :maxlength="40"
          counter="40"
          autofocus
        />
        <v-select v-model="form.year" :items="years" :label="$t('year')" />
        <v-checkbox
          v-model="form.limited"
          :label="$t('dashboard.set') + ' ' + $t('dashboard.meaningfull-comps')"
          hide-details
          color="signing"
        />
        <NumberStepper
          v-if="form.limited"
          v-model="form.limit"
          :label="$t('dashboard.meaningfull-comps')"
          :min="1"
          :maxlength="3"
        />
        <ErrorList :errors="errors" />
      </v-card-text>
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="open = false">{{ $t("cancel") }}</v-btn>
        <v-btn
          color="signing"
          variant="flat"
          prepend-icon="mdi-check"
          :loading="saving"
          @click="submit"
          >{{ $t("cup.create") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import NumberStepper from "../competition-form/NumberStepper.vue";
import ErrorList from "../ErrorList.vue";

const open = defineModel({ type: Boolean, default: false });
defineProps({ saving: Boolean });
const emit = defineEmits(["save"]);

const thisYear = new Date().getFullYear();
const years = Array.from({ length: thisYear + 2 - 2000 }, (_, i) =>
  String(thisYear + 1 - i),
);

const form = reactive({
  name: "",
  year: String(thisYear),
  limited: false,
  limit: 4,
});
const errors = ref([]);

watch(open, (isOpen) => {
  if (!isOpen) return;
  Object.assign(form, {
    name: "",
    year: String(thisYear),
    limited: false,
    limit: 4,
  });
  errors.value = [];
});

function submit() {
  errors.value = [];
  if (!form.name.trim()) errors.value.push("errors.missing-cup-name");
  if (!form.year) errors.value.push("errors.missing-cup-year");
  if (form.limited && !(Number(form.limit) > 0)) {
    errors.value.push("errors.missing-meaningfull-comps");
  }
  if (errors.value.length) return;
  emit("save", {
    name: form.name,
    year: form.year,
    limit: form.limited ? Number(form.limit) : null,
  });
}
</script>
