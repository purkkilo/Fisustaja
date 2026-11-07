<template>
  <v-snackbar v-model="show" :timeout="timeout">
    {{ $t(text) }}
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

defineOptions({ name: "NotificationBar" });
const props = defineProps(["text", "snackbar"]);

const timeout = ref(4000);
const show = ref(false);

watch(
  () => props.snackbar,
  (newVal) => {
    show.value = newVal;
  },
);
</script>
