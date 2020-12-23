<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div
            class="nav-wrapper"
            v-bind:class="{
              'grey darken-4': isDark,
              'blue lighten-2': !isDark,
            }"
          >
            <router-link to="/"
              ><img
                src="https://i.imgur.com/2WcI49A.png"
                alt=""
                class="circle responsive-img left"
                style="height:55px;width:55px;margin:5px 10px;"
            /></router-link>
            <router-link to="/"
              ><a href="#!" class="brand-logo white-text"
                >Fisustaja</a
              ></router-link
            >
            <a @click.stop="openDrawer" class="sidenav-trigger right"
              ><i class="material-icons">menu</i></a
            >
            <ul class="right hide-on-med-and-down" v-if="isUserLoggedIn">
              <li v-if="isCompetitionSet" v-bind:class="isOverviewPage">
                <router-link to="/overview"
                  ><a class="white-text"
                    ><i class="material-icons left">directions_boat</i
                    >Kilpailuun</a
                  ></router-link
                >
              </li>
              <li v-if="isCompetitionSet" v-bind:class="isCupPage">
                <router-link to="/cup-overview"
                  ><a class="white-text"
                    ><i class="material-icons left">tune</i>Cuppiin</a
                  ></router-link
                >
              </li>
              <li style="margin-right:20px;margin-left:20px">
                <v-menu offset-y rounded="b-xl">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      Lisää
                    </v-btn>
                  </template>
                  <v-list :dark="isDark">
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="changePage(item.route)"
                    >
                      <v-list-item-title
                        ><i class="material-icons left">{{ item.icon }}</i
                        >{{ item.title }}</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-action>
                        <v-switch
                          v-model="isDark"
                          :loading="uploading"
                          color="purple"
                        ></v-switch>
                      </v-list-item-action>
                      <v-list-item-title>Tumma teema</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </li>
              <li>
                <v-btn large rounded color="red" @click="logout"
                  ><i class="material-icons left">power_settings_new</i>Kirjaudu
                  ulos</v-btn
                >
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      :dark="isDark"
      temporary
      :src="
        isDark
          ? 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'
          : 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg'
      "
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <i class="material-icons left">account_circle</i>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ isUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ isUser.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-if="isCompetitionSet" @click="changePage('/overview')">
          <v-list-item-icon>
            <v-icon>directions_boat</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Kilpailuun</v-list-item-title>
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
            <v-list-item-title>Cuppiin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="changePage(item.route)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
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
              color="purple"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>Tumma teema</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-btn large rounded color="red" @click="logout"
              ><i class="material-icons left">power_settings_new</i>Kirjaudu
              ulos</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  name: "Header",
  data() {
    return {
      user: null,
      items: [],
      preferences: JSON.parse(localStorage.getItem("preferences")),
      isDark: true,
      drawer: null,
      uploading: false,
    };
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user["is_admin"];
    this.$store.state.isDark = this.preferences.isDark;
    this.isDark = this.preferences.isDark;
    if (isAdmin) {
      this.items = [
        { title: "Dashboardiin", route: "/dashboard", icon: "dashboard" },
        { title: "Palaute", route: "/feedback", icon: "feedback" },
        { title: "Admin", route: "/admin", icon: "admin_panel_settings" },
        {
          title: "Rekisteröi käyttäjä",
          route: "/register",
          icon: "add_circle_outline",
        },
      ];
    } else {
      this.items = [
        { title: "Dashboardiin", route: "/dashboard", icon: "dashboard" },
        { title: "Palaute", route: "/feedback", icon: "feedback" },
        {
          title: "Rekisteröi käyttäjä",
          route: "/register",
          icon: "add_circle_outline",
        },
      ];
    }
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
      if (localStorage.getItem("jwt") != null) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return null;
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
    isDark(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
      // Update values to database, NOTE no support for language yet but added here already to support it in the future
      this.updatePreferences(newValue, "fi");
    },
  },
  methods: {
    openDrawer: function() {
      location.href = "#";
      this.drawer = !this.drawer;
    },
    changePage: function(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
        this.drawer = !this.drawer;
      } else {
        M.toast({ html: "Olet jo tällä sivulla!" });
      }
    },
    async updatePreferences(isDark, lang) {
      localStorage.setItem(
        "preferences",
        JSON.stringify({ isDark: isDark, lang: lang })
      );
    },
    logout: function() {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      this.$store.state.logged_in = false;
      this.$store.state.is_admin = false;
      this.$router.push({ path: "/" });
      this.$store.commit("refreshCompetition", null);
      this.user = null;
      M.toast({ html: "Kirjattu ulos onnistuneesti!" });
    },
  },
};
</script>

<style scoped></style>
