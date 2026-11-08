<template>
  <!-- Cup points per placement (#1 = 30p, #2 = 28p...) -->
  <div class="ppoints">
    <div class="d-flex align-center flex-wrap ga-2">
      <span class="ppoints__label">{{ $t("placement-points") }}</span>
      <v-spacer />
      <template v-if="!readonly && !disabled">
        <v-btn
          size="small"
          variant="text"
          prepend-icon="mdi-restore"
          @click="restoreDefaults"
          >{{ $t("restore") }}</v-btn
        >
        <v-btn
          size="small"
          variant="text"
          prepend-icon="mdi-minus"
          :disabled="!points.length"
          @click="removeLast"
          >{{ $t("delete") }}</v-btn
        >
        <v-btn
          size="small"
          variant="tonal"
          color="signing"
          prepend-icon="mdi-plus"
          @click="add"
          >{{ $t("add-placement") }}</v-btn
        >
      </template>
    </div>

    <ol class="ppoints__grid">
      <li v-for="(p, index) in points" :key="index" class="ppoints__cell">
        <span class="ppoints__place fs-num">#{{ p.placement }}</span>
        <span v-if="readonly" class="fs-num font-weight-bold"
          >{{ p.points }} p</span
        >
        <input
          v-else
          v-model.number="p.points"
          type="number"
          min="0"
          class="ppoints__input fs-num"
          :aria-label="`#${p.placement} ${$t('points')}`"
          :disabled="disabled"
          @change="sortByPoints"
        />
      </li>
    </ol>
    <span v-if="!readonly && !disabled" class="fs-muted ppoints__hint">
      {{ $t("restore-original-points") }}: #1 = 30, #2 = 28, #3 = 26…
    </span>
  </div>
</template>

<script setup>
import constants from "@/data/constants";

const points = defineModel({ type: Array, required: true });
defineProps({
  disabled: { type: Boolean, default: false },
  // only show the points (summary view)
  readonly: { type: Boolean, default: false },
});

const copy = (value) => JSON.parse(JSON.stringify(value));

function renumber() {
  points.value.forEach((p, i) => (p.placement = i + 1));
}

// keep the list in order: more points = better placement
function sortByPoints() {
  points.value.sort((a, b) => Number(b.points) - Number(a.points));
  renumber();
}

function add() {
  const last = points.value.at(-1);
  points.value.push({
    points: last && last.points > 1 ? last.points - 1 : 1,
    placement: (last?.placement ?? 0) + 1,
  });
}

function removeLast() {
  points.value.pop();
}

function restoreDefaults() {
  points.value = copy(constants.placement_points);
}
</script>

<style scoped>
.ppoints {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ppoints__label {
  font-weight: 700;
}
.ppoints__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}
.ppoints__cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px 6px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}
.ppoints__place {
  font-weight: 700;
  color: rgb(var(--v-theme-muted));
}
.ppoints__input {
  width: 52px;
  height: 32px;
  box-sizing: border-box;
  padding: 0 6px;
  border: 1px solid rgba(var(--v-border-color), 0.3);
  border-radius: 8px;
  text-align: right;
  font: inherit;
  font-weight: 700;
  color: inherit;
  background: transparent;
}
.ppoints__input:focus {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 0;
}
.ppoints__hint {
  font-size: 13px;
}
</style>
