<template>
  <!-- Starting page, / -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-row>
      <v-col align-self="center">
        <v-row align="center">
          <v-col>
            <v-avatar size="200">
              <img alt="user" src="https://i.imgur.com/2WcI49A.png" />
            </v-avatar>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <h1 class="ml-3">Fisustaja</h1>
            <p class="white--text"></p>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <div v-for="(link, i) in links" :key="i">
          <v-hover v-slot="{ hover }">
            <v-card
              :key="i"
              :dark="$store.getters.getTheme"
              tile
              outlined
              :elevation="hover ? 10 : 2"
              style="background: transparent; margin-top: 100px"
            >
              <v-card-title
                >{{ link.text }}<v-spacer></v-spacer>
                <v-icon x-large right> {{ link.icon }}</v-icon></v-card-title
              >

              <v-card-actions>
                <v-spacer></v-spacer>
                <router-link :to="link.path">
                  <v-btn text outlined> Siirry </v-btn>
                </router-link>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
"use strict";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      updateSwitch: this.$store.getters.getTheme,
      items: [
        {
          text: "Cuppien tuloksia",
          icon: "mdi-trophy",
          path: "/public-cups",
          image: "@/assets/cup.jpg",
        },
        {
          text: "Kilpailujen tuloksia ",
          icon: "mdi-seal",
          path: "/public-results",
          image: "@/assets/competition.jpg",
        },
      ],
      links: [],
      logged_in: false,
    };
  },
  watch: {
    updateSwitch(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
    },
    "$store.state.logged_in"(newValue) {
      if (newValue) {
        this.links = [
          ...this.items,
          {
            text: "Dashboard",
            icon: "mdi-view-dashboard",
            path: "/dashboard",
          },
        ];
      } else {
        this.links = this.items;
      }
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
    this.links = this.items;
    if (this.$store.state.logged_in) {
      this.links = [
        ...this.items,
        {
          text: "Dashboard",
          icon: "mdi-view-dashboard",
          path: "/dashboard",
        },
      ];
    }
  },
  methods: {},
};
</script>

<style></style>
