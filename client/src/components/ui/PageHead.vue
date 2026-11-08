<template>
  <!-- Page title row: small coloured eyebrow, big title, actions on the right -->
  <header class="page-head">
    <div class="page-head__title">
      <span v-if="eyebrow" class="fs-eyebrow" :class="`text-${tone}`">{{
        eyebrow
      }}</span>
      <div class="d-flex align-center flex-wrap ga-3">
        <h1>{{ title }}</h1>
        <slot name="badges" />
      </div>
      <span v-if="subtitle" class="fs-muted">{{ subtitle }}</span>
    </div>
    <div v-if="$slots.actions" class="page-head__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  // theme colour of the eyebrow: signing, weighing, results, muted...
  tone: { type: String, default: "weighing" },
});
</script>

<style scoped>
.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
}
.page-head__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 320px;
  min-width: 0;
}
.page-head__title h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.15;
}
.page-head__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
