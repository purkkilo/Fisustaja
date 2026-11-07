<template>
  <!-- Normal-flow footer below the page content -->
  <v-footer
    class="flex-grow-0"
    :color="store.isDark ? 'grey-darken-4' : 'primary-lighten-1'"
  >
    <v-row class="justify-center">
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        rounded
        class="my-2"
        variant="text"
      >
        {{ link }}
      </v-btn>
      <v-col
        class="py-4 text-center text-white"
        cols="12"
        v-bind:class="{
          'bg-grey-darken-1': store.isDark,
          'bg-primary-lighten-2': !store.isDark,
        }"
      >
        2018 - {{ new Date().getFullYear() }} —
        <strong>© Jori Kosonen</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import { useMainStore } from "@/store";
import { ref } from "vue";

const store = useMainStore();
defineOptions({ name: "Footer" });

const links = ref(["Work In Progress"]);
</script>
<style scoped></style>
