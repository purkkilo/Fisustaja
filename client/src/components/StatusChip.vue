<template>
  <!-- Competition status in its step colour (see utils/competitionStatus) -->
  <v-chip
    :color="status.color"
    variant="flat"
    size="small"
    class="font-weight-bold"
    >{{ $t(status.label) }}</v-chip
  >
</template>

<script setup>
defineProps({
  // { label, color } from competitionStatus()
  status: { type: Object, required: true },
});
</script>
