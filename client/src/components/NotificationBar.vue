<template>
  <v-snackbar v-model="show" :timeout="timeout">
    {{ $t(text) }}
  </v-snackbar>
</template>

<script>
export default {
  name: "NotificationBar",
  props: ["text", "snackbar"],
  watch: {
    snackbar(newVal) {
      this.show = newVal;
    },
  },
  data() {
    return {
      timeout: 4000,
      show: false,
    };
  },
};
</script>
