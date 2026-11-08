<template>
  <!-- Problems to fix before saving -->
  <v-alert
    v-if="errors.length"
    id="error-list"
    type="error"
    variant="tonal"
    :title="$t('errors.fix-text')"
  >
    <ul class="error-list">
      <li v-for="(error, index) in errors" :key="index">{{ $t(error) }}</li>
    </ul>
  </v-alert>
</template>

<script setup>
defineOptions({ name: "ErrorList" });
defineProps({
  errors: { type: Array, default: () => [] },
});
</script>

<style scoped>
.error-list {
  margin: 4px 0 0;
  padding-left: 18px;
}
</style>
