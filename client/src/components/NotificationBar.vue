<template>
  <v-snackbar v-model="snackbar" :timeout="timeout">
    {{ $t(text) }}
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";

defineOptions({ name: "NotificationBar" });
defineProps(["text"]);
const snackbar = defineModel("snackbar", { type: Boolean, default: false });

const timeout = ref(4000);
</script>
