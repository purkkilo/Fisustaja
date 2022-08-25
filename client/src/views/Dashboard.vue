<template>
  <!-- /dashboard-->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
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

              <v-divider></v-divider>

              <v-row>
                <v-col md="6" style="margin-top: 20px">
                  <router-link to="/register-comp">
                    <v-btn large tile outlined color="blue lighten-1"
                      ><v-icon>mdi-plus-circle</v-icon>Uusi kilpailu</v-btn
                    >
                  </router-link>
                </v-col>

                <v-col md="6" style="margin-top: 20px">
                  <router-link to="/continue">
                    <v-btn large tile outlined color="green lighten-1"
                      ><v-icon>mdi-play-circle</v-icon>Jatka kilpailua</v-btn
                    >
                  </router-link>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
"use strict";

export default {
  name: "Home",
  components: {},
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
    // Get user info form localstorage
    if (localStorage.getItem("user") != null) {
      this.user = JSON.parse(localStorage.getItem("user"));
      let createdAt = this.$moment(this.user.createdAt);
      this.created = `${createdAt.date()}.${
        createdAt.month() + 1
      }.${createdAt.year()}`;
    }

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {},
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
