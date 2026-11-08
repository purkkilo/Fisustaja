<template>
  <!-- One key number: label, big value, optional note and progress bar -->
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to || undefined"
    class="stat-tile"
    :class="[`stat-tile--${tone}`, { 'stat-tile--active': active }]"
    :aria-current="active ? 'step' : undefined"
  >
    <span class="stat-tile__label">
      <v-icon v-if="icon" :icon="icon" size="18" />
      {{ label }}
    </span>
    <span class="fs-display fs-num stat-tile__value">
      <v-progress-circular v-if="loading" indeterminate size="22" width="3" />
      <template v-else>
        {{ value }}
        <span v-if="unit" class="stat-tile__unit">{{ unit }}</span>
      </template>
    </span>
    <div v-if="progress !== null" aria-hidden="true" class="stat-tile__bar">
      <div :style="{ width: Math.min(100, Math.max(0, progress)) + '%' }"></div>
    </div>
    <span v-if="note" class="stat-tile__note">{{ note }}</span>
    <v-icon
      v-if="to"
      class="stat-tile__go"
      icon="mdi-arrow-right"
      size="20"
      aria-hidden="true"
    />
  </component>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: "–" },
  unit: { type: String, default: "" },
  note: { type: String, default: "" },
  icon: { type: String, default: "" },
  // signing | weighing | results | plain
  tone: { type: String, default: "plain" },
  // 0-100, or null for no bar
  progress: { type: Number, default: null },
  // router link target: makes the whole tile clickable
  to: { type: String, default: "" },
  // the step that needs attention: dark outline
  active: Boolean,
  loading: Boolean,
});
</script>

<style scoped>
.stat-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  min-width: 0;
}
.stat-tile--plain {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.stat-tile--signing {
  background: rgb(var(--v-theme-signing-soft));
  --tile-strong: var(--v-theme-signing);
}
.stat-tile--weighing {
  background: rgb(var(--v-theme-weighing-soft));
  --tile-strong: var(--v-theme-weighing);
}
.stat-tile--results {
  background: rgb(var(--v-theme-results-soft));
  --tile-strong: var(--v-theme-results);
}
.stat-tile--active {
  outline: 2px solid rgb(var(--v-theme-on-surface));
  outline-offset: -2px;
}
a.stat-tile:hover {
  filter: brightness(0.97);
}
a.stat-tile:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.stat-tile__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  padding-right: 24px;
}
.stat-tile__value {
  font-size: 30px;
  line-height: 1.1;
}
.stat-tile__unit {
  font-family: var(--fs-font);
  font-size: 15px;
  font-weight: 500;
}
.stat-tile__note {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-muted));
}
.stat-tile__bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(var(--tile-strong, var(--v-theme-primary)), 0.22);
  overflow: hidden;
}
.stat-tile__bar > div {
  height: 100%;
  background: rgb(var(--tile-strong, var(--v-theme-primary)));
}
.stat-tile__go {
  position: absolute;
  top: 18px;
  right: 18px;
  opacity: 0.7;
}
</style>
