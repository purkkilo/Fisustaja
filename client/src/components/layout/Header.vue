<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div class="nav-wrapper blue lighten-2">
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
            <a href="#" data-target="slide-out" class="sidenav-trigger right"
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
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      Lisää sivuja
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="changePage(item.route)"
                    >
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
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
    <ul id="slide-out" class="sidenav background grey darken-4">
      <div v-if="isUserLoggedIn">
        <li v-if="isUser">
          <div class="user-view">
            <div class="background blue darken-4">
              <img src="" />
            </div>
            <span class="white-text name"
              ><i class="material-icons left">account_circle</i></span
            >
            <span class="white-text name">{{ isUser.name }}</span>
            <span class="white-text email">{{ isUser.email }}</span>
          </div>
        </li>
        <li v-bind:class="isDashboardPage" style="margin-top:20px">
          <router-link to="/dashboard"
            ><a class="white-text"
              ><i class="material-icons left">home</i>Dashboardiin</a
            ></router-link
          >
        </li>
        <li
          style="margin-top:20px"
          v-if="isCompetitionSet"
          v-bind:class="isOverviewPage"
        >
          <router-link to="/overview"
            ><a class="white-text"
              ><i class="material-icons left">directions_boat</i>Kilpailuun</a
            ></router-link
          >
        </li>
        <li
          v-if="isCompetitionSet"
          v-bind:class="isCupPage"
          style="margin-top:20px"
        >
          <router-link to="/cup-overview"
            ><a class="white-text"
              ><i class="material-icons left">tune</i>Cuppiin</a
            ></router-link
          >
        </li>
        <li style="margin-top:20px" v-if="isAdmin" v-bind:class="isAdminPage">
          <router-link to="/admin"
            ><a class="white-text"
              ><i class="material-icons left">admin_panel_settings</i>Admin</a
            ></router-link
          >
        </li>
        <li style="margin-top:20px">
          <v-btn large rounded color="red" @click="logout"
            ><i class="material-icons left">power_settings_new</i>Kirjaudu
            ulos</v-btn
          >
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  name: "Header",
  data() {
    return {
      user: null,
      items: [
        { title: "Dashboardiin", route: "/dashboard" },
        { title: "Admin", route: "/admin" },
        { title: "Palaute", route: "/feedback" },
      ],
    };
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
  },
  computed: {
    isDashboardPage() {
      return {
        active: this.$route.name === "dashboard",
      };
    },
    isFeedbackPage() {
      return {
        active: this.$route.name === "Feedback",
      };
    },
    isAdminPage() {
      return {
        active: this.$route.name === "admin",
      };
    },
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
  methods: {
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
    changePage: function(route) {
      if (this.$router.currentRoute.path !== route) {
        this.$router.push(route);
      } else {
        M.toast({ html: "Olet jo tällä sivulla!" });
      }
    },
  },
};
</script>

<style scoped></style>
