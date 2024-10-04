<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      app
      color="white"
      :dark="isDark"
      elevate-on-scroll
      v-bind:class="{
        'grey darken-4': $store.getters.getTheme,
        'primary lighten-1': !$store.getters.getTheme,
      }"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Fisustaja</v-toolbar-title>

      <v-spacer></v-spacer>
      <router-link to="/"
        ><v-btn text outlined rounded
          ><v-icon>mdi-home</v-icon></v-btn
        ></router-link
      >
      <template v-slot:extension v-if="isPublicPage || isCompetitionPage">
        <sub-navigation
          :items="bottom_navigation_items"
          :type="type"
        ></sub-navigation>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :dark="$store.getters.getTheme"
      v-bind:class="{
        'grey darken-4': $store.getters.getTheme,
        'primary lighten-1': !$store.getters.getTheme,
      }"
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon color="blue darken-4">mdi-account-circle</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ isUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ isUser.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item v-if="isCompetitionSet">
          <v-list-item-content>
            <p class="text-center">Kilpailu/Cup navigointi</p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isCompetitionSet" @click="changePage('/overview')">
          <v-list-item-icon>
            <v-icon>directions_boat</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{
              $store.getters.getCompetition.name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isCompetitionSet"
          @click="changePage('/cup-overview')"
        >
          <v-list-item-icon>
            <v-icon>tune</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{
              $store.getters.getCompetition.cup_name
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="changePage(item.route)"
        >
          <v-list-item-icon>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="isDark"
              :loading="uploading"
              color="indigo darken-3"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>Tumma teema</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-btn large rounded color="red" @click="logout"
              ><v-icon>mdi-logout</v-icon>Kirjaudu ulos</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import UserService from "../../services/UserService";
import SubNavigation from "./SubNavigation.vue";
export default {
  name: "Header",
  components: {
    SubNavigation,
  },
  data() {
    return {
      user: null,
      items: [],
      preferences: JSON.parse(localStorage.getItem("preferences")),
      isDark: true,
      drawer: null,
      uploading: false,
      snackbar: false,
      text: "",
      timeout: 5000,
      isCompetitionPage: false,
      isPublicPage: false,
      competition_pages: [
        "/overview",
        "/comp-settings",
        "/signing",
        "/weighting",
        "/results",
      ],
      public_pages: ["/public-results", "/public-cups"],
      bottom_navigation_items: [],
      type: "public",
      public_items: [
        {
          text: "Kilpailujen tuloksia",
          icon: "mdi-seal",
          path: "/public-results",
        },
        {
          text: "Cuppien tuloksia",
          icon: "mdi-trophy",
          path: "/public-cups",
        },
      ],
      competition_items: [
        {
          text: "Yleisnäkymä",
          icon: "mdi-magnify-expand",
          path: "/overview",
        },
        {
          text: "Määritykset",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "Ilmoittautuminen",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "Punnitus",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "Tulokset",
          icon: "mdi-seal",
          path: "/results",
        },
      ],
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const isAdmin = JSON.parse(localStorage.getItem("auth"));
      this.$store.state.isDark = this.preferences.isDark;
      this.isDark = this.preferences.isDark;
      if (isAdmin) {
        this.items = [
          {
            title: "Dashboardiin",
            route: "/dashboard",
            icon: "mdi-view-dashboard",
            color: "white",
          },
          {
            title: "Palaute",
            route: "/feedback",
            icon: "mdi-message-alert",
            color: "yellow darken-1",
          },
          {
            title: "Admin",
            route: "/admin",
            icon: "mdi-shield-crown",
            color: "red",
          },
          {
            title: "Rekisteröi käyttäjä",
            route: "/register",
            icon: "mdi-account-plus",
            color: "green darken-1",
          },
          {
            title: "Julkiset kilpailut",
            route: "/public-results",
            icon: "mdi-format-list-numbered",
            color: "green darken-1",
          },
          {
            title: "Julkiset cupit",
            route: "/public-cups",
            icon: "mdi-medal",
            color: "yellow darken-1",
          },
        ];
      } else {
        this.items = [
          { title: "Dashboardiin", route: "/dashboard", icon: "dashboard" },
          { title: "Palaute", route: "/feedback", icon: "feedback" },
          {
            title: "Rekisteröi käyttäjä",
            route: "/register",
            icon: "mdi-account-plus",
          },
          {
            title: "Julkiset kilpailut",
            route: "/public-results",
            icon: "mdi-format-list-numbered",
          },
          {
            title: "Julkiset cupit",
            route: "/public-cups",
            icon: "mdi-medal",
          },
        ];
      }
    }

    this.setSubNavigation(this.$router.currentRoute);
  },
  computed: {
    isOverviewPage() {
      return {
        active: this.$route.name === "Overview",
      };
    },
    isCupPage() {
      return {
        active: this.$route.name === "CupOverview",
      };
    },
    isUser() {
      if (localStorage.getItem("user") != null) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return { name: "", email: "" };
      }
    },
    isUserLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isCompetitionSet() {
      if (this.$store.getters.getCompetition) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    $route(to) {
      this.setSubNavigation(to);
    },

    isDark(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
      // Update values to database, NOTE no support for language yet but added here already to support it in the future
      this.updatePreferences(newValue, "fi");
    },
  },
  methods: {
    openDrawer() {
      this.drawer = !this.drawer;
    },
    setSubNavigation(route) {
      if (this.competition_pages.includes(route.path)) {
        this.isCompetitionPage = true;
        this.bottom_navigation_items = this.competition_items;
        this.type = "competition";
      } else {
        this.isCompetitionPage = false;
      }

      if (this.public_pages.includes(route.path)) {
        this.isPublicPage = true;
        this.bottom_navigation_items = this.public_items;
        this.type = "public";
      } else {
        this.isPublicPage = false;
      }
    },
    changePage(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        this.text = "Olet jo tällä sivulla!";
        this.snackbar = true;
      }
    },
    updatePreferences(isDark, lang) {
      localStorage.setItem(
        "preferences",
        JSON.stringify({ isDark: isDark, lang: lang })
      );
    },
    async logout() {
      await UserService.logoutUser().then(() => {
        // Do something with the module.
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
        this.$router.push({ path: "/" });
        this.$store.commit("refreshCompetition", null);
        this.user = null;
        this.text = "Kirjattu ulos onnistuneesti!";
        this.snackbar = true;
        localStorage.removeItem("user");
      });
    },
  },
};
</script>

<style scoped></style>
