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
        ><v-btn text outlined rounded color="green"
          ><v-icon>mdi-login</v-icon>{{ $t("nav.login") }}</v-btn
        ></router-link
      >
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
export default {
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
      timeout: 5000,
    };
  },
  mounted() {},
  watch: {
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
        this.text = "Olet jo tällä sivulla!";
        this.snackbar = true;
      }
    },
    setLocale() {
      this.$i18n.locale === "en"
        ? (this.$i18n.locale = "fi")
        : (this.$i18n.locale = "en");

      this.$vuetify.lang.current = this.$i18n.locale;
    },
  },
};
</script>

<style scoped></style>
