<template>
  <!-- if there are errors, show this div -->
  <v-card id="error-list" elevation="5" v-if="errors.length">
    <v-alert type="error"> {{ $t("errors.fix-text") }}: </v-alert>
    <v-list>
      <v-list-item v-for="(error, index) in errors" :key="index">
        <template v-slot:prepend>
          <v-icon color="red">mdi-alert-circle</v-icon>
        </template>

        <v-list-item-title>{{ $t(error) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineOptions({ name: "ErrorList" });
defineProps({
  errors: { type: Array, default: () => [] },
});
</script>
<style scoped></style>
