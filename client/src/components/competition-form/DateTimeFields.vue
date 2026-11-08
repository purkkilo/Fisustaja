<template>
  <!-- Start/end date and start/end time of a competition -->
  <div class="dt-fields">
    <v-text-field
      type="date"
      :label="$t('starting-date')"
      :model-value="toDateInput(startDate)"
      :disabled="disabled"
      prepend-inner-icon="mdi-calendar-start"
      hide-details="auto"
      @update:model-value="(v) => (startDate = fromDateInput(v))"
    />
    <v-text-field
      type="time"
      :label="$t('starting-time')"
      :model-value="padTime(startTime)"
      :disabled="disabled"
      prepend-inner-icon="mdi-clock-start"
      hide-details="auto"
      @update:model-value="(v) => (startTime = v || null)"
    />
    <v-text-field
      type="date"
      :label="$t('ending-date')"
      :model-value="toDateInput(endDate)"
      :disabled="disabled"
      prepend-inner-icon="mdi-calendar-end"
      hide-details="auto"
      @update:model-value="(v) => (endDate = fromDateInput(v))"
    />
    <v-text-field
      type="time"
      :label="$t('ending-time')"
      :model-value="padTime(endTime)"
      :disabled="disabled"
      prepend-inner-icon="mdi-clock-end"
      hide-details="auto"
      @update:model-value="(v) => (endTime = v || null)"
    />
  </div>
</template>

<script setup>
import { fromDateInput, toDateInput } from "@/utils/competition";

const startDate = defineModel("startDate");
const endDate = defineModel("endDate");
const startTime = defineModel("startTime");
const endTime = defineModel("endTime");
defineProps({ disabled: { type: Boolean, default: false } });

// <input type="time"> wants "08:00"; older competitions may have "8:00"
const padTime = (time) =>
  typeof time === "string" && /^\d:\d\d$/.test(time) ? `0${time}` : time;
</script>

<style scoped>
.dt-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 600px) {
  .dt-fields {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
