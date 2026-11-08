<template>
  <!-- A panel with a heading. `tone` colours the heading band with a
       race-day step colour; "plain" keeps it white with a divider. -->
  <section class="fs-panel fs-section" :aria-labelledby="titleId">
    <div class="fs-section__head" :class="`fs-section__head--${tone}`">
      <div class="d-flex align-center ga-2 min-w-0">
        <v-icon v-if="icon" :icon="icon" size="22" />
        <h2 :id="titleId">{{ title }}</h2>
        <slot name="badges" />
      </div>
      <div v-if="$slots.actions" class="fs-section__actions">
        <slot name="actions" />
      </div>
    </div>
    <div class="fs-section__body" :class="{ 'fs-section__body--flush': flush }">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { useId } from "vue";

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: "" },
  // plain | signing | weighing | results | lake | danger
  tone: { type: String, default: "plain" },
  // no padding around the body (tables that run edge to edge)
  flush: Boolean,
});
const titleId = useId();
</script>

<style scoped>
.fs-section {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.fs-section__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  min-height: 60px;
  box-sizing: border-box;
}
.fs-section__head h2 {
  margin: 0;
  font-size: 20px;
}
.fs-section__head--plain {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.fs-section__head--signing {
  background: rgb(var(--v-theme-signing-soft));
}
.fs-section__head--weighing {
  background: rgb(var(--v-theme-weighing-soft));
}
.fs-section__head--results {
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
}
.fs-section__head--lake {
  background: rgb(var(--v-theme-lake));
  color: #ffffff;
}
.fs-section__head--danger {
  background: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
}
.fs-section__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.fs-section__body {
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.fs-section__body--flush {
  padding: 0 0 8px;
  gap: 0;
}
.min-w-0 {
  min-width: 0;
}
</style>
