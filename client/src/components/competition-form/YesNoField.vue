<template>
  <!-- Yes / no question as a switch -->
  <v-switch
    v-model="value"
    :label="label"
    :disabled="disabled"
    color="signing"
    inset
    hide-details
    density="comfortable"
    class="yes-no"
  />
</template>

<script setup>
const value = defineModel({ type: Boolean, default: false });
defineProps({
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});
</script>

<style scoped>
.yes-no :deep(.v-label) {
  opacity: 1;
  font-weight: 600;
}
</style>
