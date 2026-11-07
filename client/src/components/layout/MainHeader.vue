<template>
  <div>
    <v-app-bar :color="store.isDark ? 'grey-darken-4' : 'blue-lighten-2'">
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
          rounded
          color="green-darken-3"
          style="margin-right: 20px"
          variant="outlined"
          ><v-icon>mdi-login</v-icon>{{ $t("nav.login") }}</v-btn
        ></router-link
      >
      <router-link to="/"
        ><v-btn rounded variant="outlined"
          ><v-icon>mdi-home</v-icon></v-btn
        ></router-link
      >
      <template v-slot:extension v-if="isPublicPage">
        <sub-navigation :items="public_items" :type="type"></sub-navigation>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      :color="store.isDark ? 'grey-darken-4' : 'blue-lighten-2'"
    >
      <v-list nav class="py-0" density="compact">
        <v-list-item lines="two">
          <v-list-item-title></v-list-item-title>
          <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="changePage(item.route)"
        >
          <template v-slot:prepend>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </template>

          <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-switch v-model="updateSwitch" color="indigo-darken-3"></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ $t("nav.theme") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <notification-bar v-model:snackbar="snackbar" :text="text"></notification-bar>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import NotificationBar from "../NotificationBar.vue";
import SubNavigation from "./SubNavigation.vue";

defineOptions({ name: "Header" });
const store = useMainStore();
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const user = ref(null);
const drawer = ref(null);
const updateSwitch = ref(store.isDark);
const items = ref([
  { title: "nav.home", route: "/", icon: "mdi-home", color: "white" },
  {
    title: "nav.login",
    route: "/login",
    icon: "mdi-login",
    color: "green-darken-1",
  },
]);
const snackbar = ref(false);
const text = ref("");
const isPublicPage = ref(false);
const type = ref("public");
const public_pages = ref(["/public-results", "/public-cups"]);
const public_items = ref([
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
]);

const isHome = computed(() => {
  return {
    active: route.name === "Home",
  };
});

const isLogin = computed(() => {
  return {
    active: route.name === "login",
  };
});

const isRegister = computed(() => {
  return {
    active: route.name === "register",
  };
});

watch(
  () => route.fullPath,
  () => {
    const to = route;
    if (public_pages.value.includes(to.path)) {
      isPublicPage.value = true;
    } else {
      isPublicPage.value = false;
    }
  },
);

watch(updateSwitch, (newValue) => {
  store.isDark = newValue;
  localStorage.setItem(
    "preferences",
    JSON.stringify({ isDark: newValue, lang: locale.value }),
  );
});

function openDrawer() {
  drawer.value = !drawer.value;
}

function changePage(path) {
  if (route.path !== path) {
    router.push(path);
    drawer.value = !drawer.value;
  } else {
    text.value = "errors.already-here";
    snackbar.value = true;
  }
}

function setLocale() {
  locale.value === "en" ? (locale.value = "fi") : (locale.value = "en");

  let preferences = JSON.parse(localStorage.getItem("preferences"));
  preferences.lang = locale.value;
  localStorage.setItem("preferences", JSON.stringify(preferences));
}

onMounted(() => {});
</script>

<style scoped></style>
