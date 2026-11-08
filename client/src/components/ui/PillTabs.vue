<template>
  <!-- Segmented view switch: one pill per view, the chosen one filled -->
  <div role="group" :aria-label="label" class="pill-tabs">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="pill-tabs__item"
      :class="{ [`pill-tabs__item--on-${tone}`]: model === item.value }"
      :aria-pressed="model === item.value"
      :disabled="item.disabled"
      @click="model = item.value"
    >
      <v-icon v-if="item.icon" :icon="item.icon" size="18" />
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
const model = defineModel({ type: [String, Number], default: null });
defineProps({
  // [{ value, label, icon?, disabled? }]
  items: { type: Array, required: true },
  // accessible name of the group
  label: { type: String, required: true },
  // colour of the chosen pill: lake (dark navy) | results | signing | weighing
  tone: { type: String, default: "lake" },
});
</script>

<style scoped>
.pill-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(var(--v-border-color), 0.08);
}
.pill-tabs__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.pill-tabs__item:hover:not(:disabled) {
  background: rgba(var(--v-border-color), 0.08);
}
.pill-tabs__item:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 1px;
}
.pill-tabs__item:disabled {
  opacity: 0.45;
  cursor: default;
}
.pill-tabs__item--on-lake,
.pill-tabs__item--on-lake:hover:not(:disabled) {
  background: rgb(var(--v-theme-secondary));
  color: rgb(var(--v-theme-on-secondary));
  font-weight: 700;
}
.pill-tabs__item--on-results,
.pill-tabs__item--on-results:hover:not(:disabled) {
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
  font-weight: 700;
}
.pill-tabs__item--on-signing,
.pill-tabs__item--on-signing:hover:not(:disabled) {
  background: rgb(var(--v-theme-signing));
  color: rgb(var(--v-theme-on-signing));
  font-weight: 700;
}
.pill-tabs__item--on-weighing,
.pill-tabs__item--on-weighing:hover:not(:disabled) {
  background: rgb(var(--v-theme-weighing));
  color: rgb(var(--v-theme-on-weighing));
  font-weight: 700;
}
</style>
