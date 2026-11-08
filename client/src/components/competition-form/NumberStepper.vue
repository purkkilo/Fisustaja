<template>
  <!-- Number field with - / + buttons -->
  <v-text-field
    :label="label"
    :model-value="modelValue"
    :maxlength="maxlength"
    :rules="rules.number"
    :disabled="disabled"
    inputmode="decimal"
    hide-details="auto"
    class="stepper"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @keypress="onlyNumbers"
    @paste.prevent
  >
    <template #prepend-inner>
      <v-btn
        icon="mdi-minus"
        size="small"
        variant="text"
        density="comfortable"
        :aria-label="`${label} −${step}`"
        :disabled="disabled"
        @click="change(-step)"
      />
    </template>
    <template #append-inner>
      <v-btn
        icon="mdi-plus"
        size="small"
        variant="text"
        density="comfortable"
        :aria-label="`${label} +${step}`"
        :disabled="disabled"
        @click="change(step)"
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { useRules } from "@/composables/useRules";

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  label: { type: String, default: "" },
  step: { type: Number, default: 1 },
  min: { type: Number, default: 0 },
  maxlength: { type: Number, default: 6 },
  // allow one decimal point
  decimal: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);
const rules = useRules();

function change(delta) {
  const current = Number(props.modelValue) || 0;
  emit("update:modelValue", Math.max(props.min, current + delta));
}

function onlyNumbers(event) {
  const char = event.key;
  if (/^\d$/.test(char)) return;
  if (props.decimal && char === "." && !event.target.value.includes("."))
    return;
  if (char.length === 1) event.preventDefault();
}
</script>

<style scoped>
.stepper :deep(input) {
  text-align: center;
  font-weight: 700;
}
</style>
