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
import M from "materialize-css";
import { options_picker } from "../i18n";
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
      type: null,
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
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var tabs = document.querySelectorAll(".tabs");
    var instance = M.Tabs.init(tabs, options_picker);

    var collabs = document.querySelectorAll(".collapsible");
    var instances2 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    // Set "Bugi" to v-select as initial value
    this.type = this.type_options[0];
    //Check if user is logged in has admin status, update header
    this.checkLogin();

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
  },
};
</script>
