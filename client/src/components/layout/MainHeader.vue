<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      app
      color="white"
      :dark="updateSwitch"
      v-bind:class="{
        'grey darken-4': $store.getters.getTheme,
        'blue lighten-2': !$store.getters.getTheme,
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

      <router-link to="/login"
        ><v-btn
          outlined
          rounded
          color="green darken-3"
          style="margin-right: 20px"
          ><v-icon>mdi-login</v-icon>{{ $t("nav.login") }}</v-btn
        ></router-link
      >
      <router-link to="/"
        ><v-btn outlined rounded><v-icon>mdi-home</v-icon></v-btn></router-link
      >
      <template v-slot:extension v-if="isPublicPage">
        <sub-navigation :items="public_items" :type="type"></sub-navigation>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :dark="$store.getters.getTheme"
      v-bind:class="{
        'grey darken-4': $store.getters.getTheme,
        'blue lighten-2': !$store.getters.getTheme,
      }"
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
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
            <v-switch v-model="updateSwitch" color="indigo darken-3"></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ $t("nav.theme") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-card>
</template>

<script>
import NotificationBar from "../NotificationBar.vue";
import SubNavigation from "./SubNavigation.vue";

export default {
  components: {
    SubNavigation,
    NotificationBar,
  },
  name: "Header",
  data() {
    return {
      user: null,
      drawer: null,
      updateSwitch: this.$store.getters.getTheme,
      items: [
        { title: "nav.home", route: "/", icon: "mdi-home", color: "white" },
        {
          title: "nav.login",
          route: "/login",
          icon: "mdi-login",
          color: "green darken-1",
        },
      ],
      snackbar: false,
      text: "",
      isPublicPage: false,
      type: "public",
      public_pages: ["/public-results", "/public-cups"],
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
    };
  },
  mounted() {},
  watch: {
    $route(to) {
      if (this.public_pages.includes(to.path)) {
        this.isPublicPage = true;
      } else {
        this.isPublicPage = false;
      }
    },
    updateSwitch(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
      localStorage.setItem(
        "preferences",
        JSON.stringify({ isDark: newValue, lang: "fi" })
      );
    },
  },
  computed: {
    isHome() {
      return {
        active: this.$route.name === "Home",
      };
    },
    isLogin() {
      return {
        active: this.$route.name === "login",
      };
    },
    isRegister() {
      return {
        active: this.$route.name === "register",
      };
    },
  },
  methods: {
    openDrawer() {
      this.drawer = !this.drawer;
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
