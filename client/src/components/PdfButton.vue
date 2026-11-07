<template>
  <!-- "Download pdf" button used next to every results table -->
  <v-btn
    color="red-lighten-2"
    :loading="loading"
    :disabled="disabled"
    size="large"
    variant="outlined"
    @click="emit('click')"
  >
    <v-icon color="red">mdi-file-pdf-box</v-icon>
    <slot>{{ $t("download") }} pdf</slot>
  </v-btn>
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["click"]);
</script>
