<template>
  <!-- Placement: 1st filled amber, 2nd–3rd amber ring, others plain -->
  <span class="place fs-num" :class="look">{{ placement }}</span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  placement: { type: [Number, String], required: true },
});
const look = computed(() => {
  const p = Number(props.placement);
  if (p === 1) return "place--first";
  if (p <= 3) return "place--podium";
  return "";
});
</script>

<style scoped>
.place {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-sizing: border-box;
  font-weight: 700;
}
.place--first {
  background: rgb(var(--v-theme-results));
  color: rgb(var(--v-theme-on-results));
}
.place--podium {
  background: rgb(var(--v-theme-results-soft));
  border: 2px solid rgba(var(--v-theme-results), 0.45);
}
</style>
