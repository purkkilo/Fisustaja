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
      <v-btn
        style="margin-right: 20px"
        class="locale-switcher"
        @click="setLocale"
      >
        🌐 {{ $i18n.locale }}
      </v-btn>
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
            <p class="text-center">{{ $t("nav.header") }}</p>
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
          v-if="isCompetitionSet && isCupCompetition"
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
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
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
          <v-list-item-title>{{ $t("nav.theme") }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-btn large rounded color="red" @click="logout"
              ><v-icon>mdi-logout</v-icon>{{ $t("nav.logout") }}</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-card>
</template>

<script>
import UserService from "../../services/UserService";
import NotificationBar from "../NotificationBar.vue";
import SubNavigation from "./SubNavigation.vue";
export default {
  name: "Header",
  components: {
    SubNavigation,
    NotificationBar,
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
          text: "home.comp",
          icon: "mdi-seal",
          path: "/public-results",
        },
        {
          text: "home.cup",
          icon: "mdi-trophy",
          path: "/public-cups",
        },
      ],
      competition_items: [
        {
          text: "overview",
          icon: "mdi-magnify-expand",
          path: "/overview",
        },
        {
          text: "settings",
          icon: "mdi-tune",
          path: "/comp-settings",
        },
        {
          text: "signing",
          icon: "mdi-draw",
          path: "/signing",
        },
        {
          text: "weighting",
          icon: "mdi-dumbbell",
          path: "/weighting",
        },
        {
          text: "results",
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
            title: "nav.dashboard",
            route: "/dashboard",
            icon: "mdi-view-dashboard",
            color: "white",
          },
          {
            title: "nav.admin",
            route: "/admin",
            icon: "mdi-shield-crown",
            color: "red",
          },
          {
            title: "nav.register-user",
            route: "/register",
            icon: "mdi-account-plus",
            color: "green darken-1",
          },
          {
            title: "nav.public-comps",
            route: "/public-results",
            icon: "mdi-format-list-numbered",
            color: "green darken-1",
          },
          {
            title: "nav.public-cups",
            route: "/public-cups",
            icon: "mdi-medal",
            color: "yellow darken-1",
          },
        ];
      } else {
        this.items = [
          { title: "nav.dashboard", route: "/dashboard", icon: "dashboard" },
          {
            title: "nav.public-comps",
            route: "/public-results",
            icon: "mdi-format-list-numbered",
          },
          {
            title: "nav.public-cups",
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
    isCupCompetition() {
      if (this.$store.getters.getCompetition.isCupCompetition) {
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
      localStorage.setItem(
        "preferences",
        JSON.stringify({ isDark: newValue, lang: "fi" })
      );
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
        this.text = "errors.already-here";
        this.snackbar = true;
      }
    },
    async logout() {
      await UserService.logoutUser().then(() => {
        // Do something with the module.
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
        if (this.$router.currentRoute.path !== "/")
          this.$router.push({ path: "/" });
        this.$store.commit("refreshCompetition", null);
        this.user = null;
        this.text = "notification.logout-success";
        this.snackbar = true;
        localStorage.removeItem("user");
      });
    },
    setLocale() {
      this.$i18n.locale === "en"
        ? (this.$i18n.locale = "fi")
        : (this.$i18n.locale = "en");

      this.$vuetify.lang.current = this.$i18n.locale;
      let preferences = JSON.parse(localStorage.getItem("preferences"));
      preferences.lang = this.$i18n.locale;
      localStorage.setItem("preferences", JSON.stringify(preferences));
    },
  },
};
</script>

<style scoped></style>
