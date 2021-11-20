<template>
  <v-container
    style="margin-top:70px;"
    v-bind:class="{
      'container-transparent': !$store.getters.getTheme,
      'container-transparent-dark': $store.getters.getTheme,
    }"
  >
    <Header v-if="$store.state.logged_in" />
    <MainHeader v-else />
    <v-row>
      <v-col md="12">
        <h1 class="text-center">
          Page not found :thinking:
        </h1>
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
  </v-container>
</template>

<script>
"use strict";
import Header from "../components/layout/Header";
import MainHeader from "../components/layout/MainHeader";

export default {
  name: "Notfound",
  components: {
    Header,
    MainHeader,
  },
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
  mounted() {
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {},
};
</script>
