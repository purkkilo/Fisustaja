<template>
  <!-- Back / modify / continue buttons at the bottom of each wizard step -->
  <div class="step-buttons">
    <v-btn
      v-if="showBack"
      variant="text"
      prepend-icon="mdi-arrow-left"
      size="large"
      @click="emit('back')"
      >{{ $t("back") }}</v-btn
    >
    <v-spacer />
    <v-btn
      v-if="locked"
      variant="outlined"
      prepend-icon="mdi-pencil"
      size="large"
      @click="emit('unlock')"
      >{{ $t("modify-info") }}</v-btn
    >
    <!-- an unlocked step is validated first, a locked one just moves on -->
    <v-btn
      color="signing"
      append-icon="mdi-arrow-right"
      size="large"
      @click="emit(locked ? 'next' : 'validate')"
      >{{ $t("continue") }}</v-btn
    >
  </div>
</template>

<script setup>
defineProps({
  locked: { type: Boolean, default: false },
  showBack: { type: Boolean, default: true },
});
const emit = defineEmits(["back", "unlock", "validate", "next"]);
</script>

<style scoped>
.step-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}
</style>
