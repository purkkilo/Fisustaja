<template>
  <!-- Number field with - / + buttons -->
  <v-text-field
    :label="label"
    :model-value="modelValue"
    :maxlength="maxlength"
    :counter="maxlength"
    :rules="rules.number"
    :disabled="disabled"
    prepend-icon="mdi-minus"
    append-icon="mdi-plus"
    @update:model-value="(v) => emit('update:modelValue', v)"
    @click:prepend="change(-step)"
    @click:append="change(step)"
    @keypress="onlyNumbers"
    @paste.prevent
  />
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
