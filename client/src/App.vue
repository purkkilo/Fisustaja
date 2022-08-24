<template>
  <!-- Main file for the application -->
  <!-- html and js autoinjects to here (on index.html in server) -->
  <v-app id="app" style="background: rgba(0, 0, 0, 0.1)">
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- If using vue-router -->
      <Header v-if="$store.state.logged_in" />
      <MainHeader v-else />
      <router-view></router-view>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
"use strict";
import Footer from "./components/layout/Footer";
import UserService from "./UserService";
import Header from "./components/layout/Header.vue";
import MainHeader from "./components/layout/MainHeader";
export default {
  name: "App",
  data() {
    return {
      snackbar: false,
      text: "Sessio vanhentunut, kirjaudu sisään uudelleen!",
      timeout: 5000,
    };
  },
  components: {
    Footer,
    Header,
    MainHeader,
  },
  created() {
    let preferences = JSON.parse(localStorage.getItem("preferences"));
    if (!preferences) {
      localStorage.setItem(
        "preferences",
        JSON.stringify({ isDark: false, lang: "fi" })
      );
    } else {
      this.$store.state.isDark = preferences.isDark;
      this.$store.state.lang = preferences.lang;
    }
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const token = localStorage.getItem("jwt");
      if (token) {
        const jwtPayload = this.parseJwt(token);
        if (jwtPayload) {
          if (jwtPayload.exp < Date.now() / 1000) {
            // token expired
            await UserService.logoutUser().then(() => {
              this.snackbar = true;
              this.$store.state.logged_in = false;
              this.$store.state.is_admin = false;
              if (this.$router.currentRoute.meta.requiresAuth) {
                this.$router.push({ path: "/login" });
              }
            });
          } else {
            let res = await UserService.refreshToken(user);
            if (res.success) {
              this.$store.state.is_admin = res.is_admin;
              this.$store.state.logged_in = true;
            } else {
              console.log(res.error, res.status, "!!!!");
            }
          }
        } else {
          console.log("parseJwt error");
        }
      }
    }
  },
  methods: {
    parseJwt(token) {
      try {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
          Buffer.from(base64, "base64")
            .toString("ascii")
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        return JSON.parse(jsonPayload);
      } catch {
        return null;
      }
    },
  },
};
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh; /* will cover the 100% of viewport */
  overflow: hidden;
  display: block;
  position: relative; /* height of your footer */
  width: 100%;
}
body {
  display: flex;
  flex-direction: column;
  /*background: url("https://i.imgur.com/uLrR7M1.png");*/
  background: rgb(2, 0, 36);
  background: linear-gradient(
    135deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(0, 0, 105, 1) 14%,
    rgba(0, 212, 255, 1) 100%
  );
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
#app .container-transparent {
  background: rgba(149, 233, 248, 0.4);
  border-radius: 2%;
  border: white 1px solid;
}

#app .container-transparent-dark {
  background: rgba(15, 29, 70, 0.712);
  border-radius: 2%;
  border: white 1px solid;
}

#app h1 {
  -webkit-text-stroke: 1px black;
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
.time {
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.45);
  padding: 5px;
  color: black;
  border: 2px solid white;
}

.time-dark {
  border-radius: 25px;
  background: rgba(15, 29, 70, 0.712);
  padding: 5px;
  color: black;
  border: 2px solid rgb(1, 0, 51);
}

#app .inputarea {
  background: rgba(255, 255, 255, 0.7);
}

#app .inputarea-dark {
  background: rgba(46, 46, 46, 0.856);
}

#app .tablearea {
  background: rgb(156, 215, 255);
  border-radius: 2%;
}
table.highlight > tbody > tr:hover {
  background-color: rgb(0, 153, 255) !important;
  border: 1px solid black;
  cursor: pointer;
}
table.highlight > tr:hover {
  background-color: rgb(0, 153, 255) !important;
  border: 1px solid black;
  cursor: pointer;
}
#app .selected {
  background-color: rgb(0, 114, 19) !important;
  color: white;
  border: 2px solid black;
}
#app li#fish_spec {
  margin: 20px;
  padding: 20px;
  border-radius: 2%;
  border: 1px solid black;
}
#app li#fish_spec:nth-child(odd) {
  background: rgba(88, 103, 129, 0.43);
}
#app .input-fields {
  background: rgba(160, 228, 255, 0.253);
  border-radius: 2%;
  border: 1px solid black;
}
#app .title {
  background: rgba(104, 112, 230, 0.212);
  border-radius: 2%;
  border: 1px solid rgb(0, 0, 61);
}

#app .table_header thead {
  background: rgb(0, 1, 34);
  color: #fff;
}

.blue_th {
  background: rgb(0, 1, 34);
  color: #fff;
}

#app .scroll_table {
  max-height: 500px;
  overflow: auto;
}
.v-tab--disabled {
  background: grey;
}
.v-tab--active {
  background: rgb(65, 141, 255);
}

.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.699) !important;
}

.theme--dark.v-divider {
  border-color: rgba(219, 219, 219, 0.705) !important;
}

.theme--light.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(105, 140, 197, 0.5);
}
.theme--light.v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgba(78, 97, 134, 0.5);
}
.theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgba(6, 8, 19, 0.5);
}
.theme--dark.v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgba(36, 40, 53, 0.5);
}

.theme--dark.v-data-table thead tr {
  background-color: rgba(0, 0, 0, 0.438);
}
.theme--light.v-data-table thead tr {
  background-color: rgba(83, 88, 105, 0.5);
}
.strokeme {
  color: white;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
