<template>
  <!-- Points multiplier and minimum size for each fish species -->
  <div class="spec-table">
    <p v-if="!specs.length" class="fs-muted">
      {{ $t("errors.no-fish-selected") }}
    </p>
    <div
      v-else
      class="spec-table__row spec-table__row--head"
      aria-hidden="true"
    >
      <span>{{ $t("fish") }}</span>
      <span>{{ $t("multiplier") }}</span>
      <span>{{ $t("min-size") }} (cm)</span>
    </div>
    <div
      v-for="(fish, index) in specs"
      :key="fish.name"
      class="spec-table__row"
    >
      <span class="spec-table__name">
        <span class="spec-table__index fs-num">{{ index + 1 }}</span>
        {{ fish.name }}
      </span>
      <NumberStepper
        v-model="fish.multiplier"
        :label="`${fish.name}: ${$t('multiplier')}`"
        :step="0.5"
        :min="1"
        :maxlength="4"
        decimal
        :disabled="disabled"
      />
      <v-text-field
        v-model="fish.minsize"
        :label="`${fish.name}: ${$t('min-size')}`"
        :maxlength="40"
        :rules="rules.text"
        :disabled="disabled"
        density="comfortable"
        hide-details="auto"
        @paste.prevent
      />
    </div>
  </div>
</template>

<script setup>
import { useRules } from "@/composables/useRules";
import NumberStepper from "./NumberStepper.vue";

// [{ name, multiplier, minsize }], edited in place
const specs = defineModel({ type: Array, required: true });
defineProps({ disabled: { type: Boolean, default: false } });

const rules = useRules();
</script>

<style scoped>
.spec-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.spec-table__row {
  display: grid;
  grid-template-columns: minmax(140px, 1.2fr) minmax(160px, 1fr) minmax(
      120px,
      1fr
    );
  align-items: center;
  gap: 12px;
}
.spec-table__row--head {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--v-theme-muted));
}
.spec-table__name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}
.spec-table__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgb(var(--v-theme-weighing-soft));
  font-size: 13px;
}
@media (max-width: 600px) {
  .spec-table__row {
    grid-template-columns: minmax(0, 1fr);
  }
  .spec-table__row--head {
    display: none;
  }
}
</style>
