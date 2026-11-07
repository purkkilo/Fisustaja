<template>
  <!-- Yes / no question as radio buttons -->
  <v-row class="justify-center align-center">
    <v-col cols="6" class="input-fields">
      <span class="text-white">{{ label }}</span>
      <v-radio-group
        v-model="value"
        :disabled="disabled"
        inline
        class="justify-center"
      >
        <v-radio :label="$t('yes')" :value="true"></v-radio>
        <v-radio :label="$t('no')" :value="false"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script setup>
const value = defineModel({ type: Boolean, default: false });
defineProps({
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
});
</script>
