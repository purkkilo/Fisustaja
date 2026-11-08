<template>
  <!-- One species of the boat's catch. "+" adds a part weighing for catches
       too heavy for the scale in one go; the parts are summed. -->
  <div class="fish-row">
    <div class="fish-row__name">
      <span class="font-weight-bold">{{ name }}</span>
      <span
        v-if="minsize && minsize !== '0'"
        class="fs-muted text-body-small"
        >{{ $t("weighing-page.min-size", { size: minsize }) }}</span
      >
    </div>
    <span class="fish-row__mult fs-num">× {{ multiplierText }}</span>
    <div class="fish-row__weight">
      <div class="d-flex align-center ga-2">
        <input
          :id="inputId"
          :value="modelValue ?? ''"
          :aria-label="$t('weighing-page.weight-of', { fish: name })"
          inputmode="numeric"
          autocomplete="off"
          class="fish-row__input fs-num"
          :disabled="disabled"
          @input="onType($event.target.value)"
          @keypress="isNumber($event)"
        />
        <v-btn
          icon="mdi-plus"
          variant="tonal"
          color="weighing"
          :disabled="disabled"
          :aria-label="$t('weighing-page.add-part', { fish: name })"
          :title="$t('weighing-page.add-part', { fish: name })"
          @click="adding = !adding"
        />
      </div>
      <div v-if="adding" class="fish-row__part">
        <input
          v-model="part"
          :aria-label="$t('weighing-page.part-weight')"
          :placeholder="$t('weighing-page.part-weight')"
          inputmode="numeric"
          class="fish-row__input fish-row__input--small fs-num"
          @keypress="isNumber($event)"
          @keydown.enter.prevent="addPart"
        />
        <v-btn
          size="small"
          color="weighing"
          :disabled="!(parseInt(part) > 0)"
          @click="addPart"
          >{{ $t("weighing-page.add") }}</v-btn
        >
        <v-btn size="small" variant="text" @click="cancelPart">{{
          $t("cancel")
        }}</v-btn>
      </div>
      <span v-if="parts.length > 1" class="fish-row__parts fs-num">{{
        $t("weighing-page.parts", {
          n: parts.length,
          list: parts.map(format).join(" + "),
        })
      }}</span>
    </div>
    <span class="fish-row__points fs-num">{{ format(points) }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { isNumber } from "@/utils/format";

const props = defineProps({
  modelValue: { type: [Number, String], default: null },
  name: { type: String, required: true },
  multiplier: { type: Number, default: 1 },
  minsize: { type: [Number, String], default: null },
  inputId: { type: String, default: undefined },
  disabled: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const adding = ref(false);
const part = ref("");
// part weighings of this session (only their sum is saved)
const parts = ref([]);

const grams = computed(() => parseInt(props.modelValue) || 0);
const points = computed(() => Math.round(grams.value * props.multiplier));
const multiplierText = computed(() =>
  props.multiplier.toLocaleString("fi-FI", { minimumFractionDigits: 1 }),
);
const format = (n) => Number(n).toLocaleString("fi-FI");

function onType(value) {
  parts.value = []; // typed by hand: the parts no longer add up
  emit("update:modelValue", value === "" ? null : parseInt(value) || 0);
}

function addPart() {
  const addition = parseInt(part.value) || 0;
  if (!addition) return;
  const list = parts.value.length
    ? parts.value
    : grams.value
      ? [grams.value]
      : [];
  parts.value = [...list, addition];
  emit(
    "update:modelValue",
    parts.value.reduce((sum, g) => sum + g, 0),
  );
  cancelPart();
}

function cancelPart() {
  part.value = "";
  adding.value = false;
}
</script>

<style scoped>
.fish-row {
  display: grid;
  grid-template-columns: minmax(110px, 1.2fr) 70px minmax(200px, 2fr) 90px;
  align-items: start;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
@media (max-width: 700px) {
  .fish-row {
    grid-template-columns: 1fr auto;
  }
}
.fish-row__name {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  font-size: 16px;
}
.fish-row__mult {
  align-self: start;
  margin-top: 10px;
  justify-self: start;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgb(var(--v-theme-weighing-soft));
  font-weight: 700;
  font-size: 14px;
}
.fish-row__weight {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fish-row__input {
  width: 150px;
  height: 48px;
  box-sizing: border-box;
  padding: 0 14px;
  border: 2px solid rgba(var(--v-border-color), 0.3);
  border-radius: 10px;
  background: rgb(var(--v-theme-surface));
  color: inherit;
  font: inherit;
  font-size: 19px;
  font-weight: 700;
  text-align: right;
}
.fish-row__input:focus {
  outline: 3px solid rgba(var(--v-theme-weighing), 0.35);
  border-color: rgb(var(--v-theme-weighing));
}
.fish-row__input--small {
  width: 130px;
  height: 40px;
  font-size: 16px;
}
.fish-row__part {
  display: flex;
  align-items: center;
  gap: 6px;
}
.fish-row__parts {
  font-size: 13px;
  color: rgb(var(--v-theme-muted));
}
.fish-row__points {
  padding-top: 10px;
  text-align: right;
  font-weight: 700;
  font-size: 17px;
}
</style>
