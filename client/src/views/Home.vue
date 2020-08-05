<template>
  <!-- Starting page, / -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container style="margin-top:50px">
    <MainHeader />
    <v-row class="section">
      <v-col>
        <h1>Fisustaja</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- TODO Cool starting page... -->
      <v-col>
        <h4>Sovellus kalastuskilpailujen järjestämistä varten</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col order="first">
        <router-link to="/public-results">
          <v-btn large rounded color="blue darken-4" class="white--text"
            ><i class="material-icons left">emoji_events</i>Kilpailujen
            tuloksia</v-btn
          >
        </router-link>
      </v-col>
      <v-col order="last">
        <router-link to="/public-cups">
          <v-btn large rounded color="green darken-4" class="white--text">
            <i class="material-icons left">emoji_events</i>Cuppien tuloksia
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
"use strict";
import MainHeader from "../components/layout/MainHeader";

export default {
  name: "Home",
  components: {
    MainHeader,
  },
  data() {
    return {};
  },
  mounted() {
    // Check if user is logged in has admin status, update header
    this.checkLogin();
    // Set competition in localstorage and vuex to null
    this.$store.commit("refreshCompetition", null);
    localStorage.removeItem("competition");
    this.$store.commit("refreshCup", null);
    localStorage.removeItem("cup");

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

<style></style>
