<template>
  <!-- /dashboard-->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <v-row
      v-bind:class="{
        'container-transparent': !$store.getters.getTheme,
        'container-transparent-dark': $store.getters.getTheme,
      }"
    >
      <v-col>
        <v-row>
          <v-col>
            <h1>Dashboard</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- if user is found on localstorage (this.user is not null/false) -->
            <div v-if="user">
              <p
                class="flow-text"
                v-bind:class="{
                  'white--text': $store.getters.getTheme,
                }"
              >
                <b>{{ user.name }}</b>
              </p>
              <p
                class="flow-text"
                v-bind:class="{
                  'white--text': $store.getters.getTheme,
                }"
              >
                <b>{{ user.email }}</b>
              </p>
              <p
                class="flow-text"
                v-bind:class="{
                  'white--text': $store.getters.getTheme,
                }"
              >
                <b>Tili luotu: {{ created }}</b>
              </p>
            </div>

            <div class="divider black"></div>
            <div class="section">
              <v-row>
                <v-col md="6" style="margin-top:20px">
                  <router-link to="/register-comp">
                    <v-btn large tile color="blue lighten-1"
                      ><i class="material-icons left">add_circle_outline</i>Uusi
                      kilpailu</v-btn
                    >
                  </router-link>
                </v-col>

                <v-col md="6" style="margin-top:20px">
                  <router-link to="/continue">
                    <v-btn large tile color="green lighten-1"
                      ><i class="material-icons left">play_circle_filled</i
                      >Jatka kilpailua</v-btn
                    >
                  </router-link>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
"use strict";
import Header from "../components/layout/Header";

export default {
  name: "Home",
  components: {
    Header,
  },
  data() {
    return {
      user: null,
      created: null,
    };
  },
  mounted() {
    // Set competition in localstorage and vuex to null
    this.$store.commit("refreshCompetition", null);
    localStorage.removeItem("competition");
    this.$store.commit("refreshCup", null);
    localStorage.removeItem("cup");
    //Check if user is logged in has admin status, update header
    this.checkLogin();
    // Get user info form localstorage
    if (localStorage.getItem("user") != null) {
      this.user = JSON.parse(localStorage.getItem("user"));
      let createdAt = this.$moment(this.user.createdAt);
      this.created = `${createdAt.date()}.${createdAt.month() +
        1}.${createdAt.year()}`;
    }

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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
