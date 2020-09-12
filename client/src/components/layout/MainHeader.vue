<template>
  <div>
    <header class="header">
      <div class="navbar-fixed">
        <nav>
          <div
            class="nav-wrapper"
            v-bind:class="{
              'grey darken-4': $store.getters.getTheme,
              'blue lighten-2': !$store.getters.getTheme,
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
            <ul class="right hide-on-med-and-down">
              <li style="margin-right:20px">
                <v-switch
                  v-model="updateSwitch"
                  :dark="updateSwitch"
                  color="indigo darken-3"
                  label="Tumma teema"
                ></v-switch>
              </li>
              <li v-bind:class="isHome">
                <router-link to="/"
                  ><a class="white-text"
                    ><i class="material-icons left">home</i>Kotisivu</a
                  ></router-link
                >
              </li>
              <li v-bind:class="isLogin">
                <router-link to="/login"
                  ><a class="white-text"
                    ><i class="material-icons left">play_circle_filled</i
                    >Kirjaudu</a
                  ></router-link
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
      :dark="$store.getters.getTheme"
      temporary
      :src="
        $store.getters.getTheme
          ? 'https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg'
          : 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg'
      "
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
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="updateSwitch" color="purple"></v-switch>
          </v-list-item-action>
          <v-list-item-title>Tumma teema</v-list-item-title>
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
      drawer: null,
      updateSwitch: this.$store.getters.getTheme,
      items: [
        { title: "Kotisivu", route: "/", icon: "home" },
        { title: "Kirjaudu", route: "/login", icon: "play_circle_filled" },
      ],
    };
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
  },
  watch: {
    updateSwitch(newValue) {
      //called whenever isDark switch changes
      this.$store.state.isDark = newValue;
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
    openDrawer: function() {
      location.href = "#app";
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
  },
};
</script>

<style scoped></style>
