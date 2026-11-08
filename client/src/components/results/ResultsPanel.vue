<template>
  <!-- A results table in an amber-headed panel, with optional sub-views,
       search and PDF download -->
  <section class="fs-panel rpanel" :aria-labelledby="titleId">
    <div class="rpanel__head">
      <h2 :id="titleId">{{ title }}</h2>
      <slot name="head" />
    </div>
    <div v-if="options.length || searchable || pdf" class="rpanel__tools">
      <v-chip-group
        v-if="options.length"
        :model-value="selected"
        mandatory
        selected-class="rpanel__chip--on"
        @update:model-value="(v) => emit('update:selected', v)"
      >
        <v-chip
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          variant="outlined"
          class="font-weight-bold"
          >{{ option.label }}</v-chip
        >
      </v-chip-group>
      <v-spacer />
      <v-text-field
        v-if="searchable"
        v-model="search"
        :label="$t('search-boat')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        clearable
        class="rpanel__search"
      />
      <v-btn
        v-if="pdf"
        variant="outlined"
        color="results"
        prepend-icon="mdi-file-pdf-box"
        @click="emit('pdf')"
        >PDF</v-btn
      >
    </div>
    <div class="rpanel__body">
      <slot :search="search || ''" />
    </div>
  </section>
</template>

<script setup>
import { ref, useId } from "vue";

defineProps({
  title: { type: String, required: true },
  // sub-views: [{ value, label }]
  options: { type: Array, default: () => [] },
  selected: { type: [String, Number], default: null },
  searchable: Boolean,
  pdf: Boolean,
});
const emit = defineEmits(["update:selected", "pdf"]);
const search = ref("");
const titleId = useId();
</script>

<style scoped>
.rpanel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.rpanel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
}
.rpanel__head h2 {
  margin: 0;
  font-size: 20px;
}
.rpanel__tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 24px 0;
}
.rpanel__search {
  flex: 0 1 260px;
  min-width: 180px;
}
.rpanel__body {
  padding: 4px 24px 16px;
}
.rpanel :deep(.rpanel__chip--on) {
  background: rgb(var(--v-theme-amber));
  color: #3b2604;
  border-color: transparent;
}
</style>
