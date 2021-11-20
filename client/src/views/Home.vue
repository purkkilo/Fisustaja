<template>
  <!-- Starting page, / -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container style="margin-top:70px;width: 70%">
    <Header v-if="$store.state.logged_in" />
    <MainHeader v-else />
    <v-row>
      <!-- TODO Cool starting page... -->
      <v-col>
        <v-card
          v-bind:class="{
            'container-transparent': !$store.getters.getTheme,
            'container-transparent-dark': $store.getters.getTheme,
          }"
        >
          <v-row>
            <v-col>
              <h1 class="ml-3">
                Fisustaja
                <v-avatar size="56">
                  <img alt="user" src="https://i.imgur.com/2WcI49A.png" />
                </v-avatar>
              </h1>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="6">
              <v-card :dark="$store.getters.getTheme">
                <v-img
                  class="white--text align-end"
                  height="400px"
                  src="@/assets/competition.jpg"
                >
                  <v-card-title class="strokeme"
                    >Kilpailujen tuloksia</v-card-title
                  >
                </v-img>
                <router-link to="/public-results">
                  <v-btn
                    class="ma-2"
                    color="primary"
                    :dark="$store.getters.getTheme"
                    text
                    outlined
                    >Tarkastele
                    <v-icon :dark="$store.getters.getTheme">
                      mdi-seal
                    </v-icon>
                  </v-btn>
                </router-link>
              </v-card>
            </v-col>
            <v-col md="6">
              <v-card :dark="$store.getters.getTheme">
                <v-img
                  class="white--text align-end"
                  height="400px"
                  src="@/assets/cup.jpg"
                >
                  <v-card-title class="strokeme">Cuppien tuloksia</v-card-title>
                </v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <router-link to="/public-cups">
                    <v-btn
                      class="ma-2"
                      color="green darken-4"
                      dark
                      text
                      outlined
                    >
                      Tarkastele
                      <v-icon dark right>
                        mdi-trophy
                      </v-icon>
                    </v-btn>
                  </router-link>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
"use strict";
import Header from "../components/layout/Header";
import MainHeader from "../components/layout/MainHeader";

export default {
  name: "Home",
  components: {
    Header,
    MainHeader,
  },
  data() {
    return {
      updateSwitch: this.$store.getters.getTheme,
      items: [
        {
          text: "Järjestä yksittäisiä kalastuskilpailuja",
          icon: "military_tech",
        },
        { text: "Hallinnoi cuppia", icon: "emoji_events" },
      ],
    };
  },
  watch: {
    updateSwitch(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
    },
  },
  computed: {
    getTheme() {
      return this.$store.getters.getTheme;
    },
  },
  mounted() {
    // Set competition in localstorage and vuex to null
    this.$store.commit("refreshCompetition", null);
    localStorage.removeItem("competition");
    this.$store.commit("refreshCup", null);
    localStorage.removeItem("cup");

    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {},
};
</script>

<style></style>
