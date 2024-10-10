<template>
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-card
      style="background: transparent; padding: 20px"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <v-row>
        <v-col md="12">
          <h1 class="text-center">Sivua ei löytynyt</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <h3>Takaisin kotisivulle</h3>
          <v-btn outlined color="red" @click="$router.push({ path: '/' })"
            ><v-icon>mdi-home</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
"use strict";
export default {
  name: "Notfound",
  data() {
    return {
      prevRoute: null,
      message: null,
      type: "Bugi",
      type_options: ["Bugi", "Ehdotus", "Muu"],
      loading: false,
      error: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
};
</script>
