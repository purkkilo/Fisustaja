<template>
  <!-- Main file for the application -->
  <!-- html and js autoinjects to here (on index.html in server) -->
  <v-app id="app" style="background: rgba(0, 0, 0, 0)">
    <!-- Sizes your content based upon application components -->
    <!-- If using vue-router -->
    <Header v-if="store.logged_in" />
    <MainHeader v-else />

    <v-main>
      <router-view></router-view>
    </v-main>
    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
    <Footer />
  </v-app>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useTheme } from "vuetify";
import Footer from "./components/layout/Footer.vue";
import UserService from "./services/UserService";
import Header from "./components/layout/Header.vue";
import MainHeader from "./components/layout/MainHeader.vue";
import NotificationBar from "./components/NotificationBar.vue";

defineOptions({ name: "App" });
const store = useMainStore();
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const theme = useTheme();

const snackbar = ref(false);
const text = ref("errors.session-expired");

// Vuetify 3+ switches the theme for the whole app

watch(
  () => store.isDark,
  (isDark) => {
    theme.change(isDark ? "dark" : "light");
  },
  { immediate: true },
);

function parseJwt(token) {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Runs when the component is created
let preferences = JSON.parse(localStorage.getItem("preferences"));
if (!preferences) {
  localStorage.setItem(
    "preferences",
    JSON.stringify({ isDark: false, lang: "en" }),
  );
} else {
  store.isDark = preferences.isDark;
  locale.value = preferences.lang;
}

onMounted(async () => {
  // Vue Router 4+: the first navigation is async, wait for it before reading $route
  await router.isReady();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = JSON.parse(localStorage.getItem("auth"));
  if (user) {
    const token = localStorage.getItem("jwt");
    if (token) {
      const jwtPayload = parseJwt(token);
      if (jwtPayload) {
        if (jwtPayload.exp < Date.now() / 1000) {
          // token expired
          await UserService.logoutUser().then(() => {
            snackbar.value = true;
            store.logged_in = false;
            store.is_admin = false;
            if (route.meta.requiresAuth) {
              router.push({ path: "/login" });
            }
          });
        } else {
          let res = await UserService.refreshToken(user, isAdmin);
          if (res.success) {
            store.is_admin = res.is_admin;
            store.logged_in = true;
          }
        }
      }
    }
  }
});
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
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
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
.v-tab.v-btn--disabled {
  background: grey;
}
.v-tab--selected {
  background: rgb(65, 141, 255);
}

.v-theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0.699) !important;
}

.v-theme--dark.v-divider {
  border-color: rgba(219, 219, 219, 0.705) !important;
}

.v-theme--light.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgb(236, 244, 255);
}
.v-theme--light.v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgb(186, 210, 255);
}
.v-theme--dark.v-data-table tbody tr:nth-of-type(even) {
  background-color: rgb(5, 6, 19);
}
.v-theme--dark.v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgb(21, 25, 34);
}

.v-theme--dark.v-data-table thead tr {
  background-color: rgb(30, 30, 30);
}

.v-theme--light.v-data-table thead tr {
  background-color: rgb(255, 255, 255);
}

.v-theme--light.v-data-table tbody tr:hover {
  background-color: rgb(184, 193, 211) !important;
}

.strokeme {
  color: white;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
