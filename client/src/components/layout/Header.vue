<template>
  <div>
    <v-app-bar
      :color="store.isDark ? 'grey-darken-4' : 'primary-lighten-1'"
      scroll-behavior="elevate"
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
        ><v-btn rounded variant="outlined"
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
      temporary
      :color="store.isDark ? 'grey-darken-4' : 'primary-lighten-1'"
    >
      <v-list nav class="py-0" density="compact">
        <v-list-item lines="two">
          <template v-slot:prepend
            ><v-avatar>
              <v-icon color="blue-darken-4">mdi-account-circle</v-icon>
            </v-avatar></template
          >

          <v-list-item-title>{{ isUser.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ isUser.email }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item v-if="isCompetitionSet">
          <p class="text-center">{{ $t("nav.header") }}</p>
        </v-list-item>
        <v-list-item v-if="isCompetitionSet" @click="changePage('/overview')">
          <template v-slot:prepend>
            <v-icon>mdi-ferry</v-icon>
          </template>

          <v-list-item-title>{{ store.competition.name }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-if="isCompetitionSet && isCupCompetition"
          @click="changePage('/cup-overview')"
        >
          <template v-slot:prepend>
            <v-icon>mdi-tune</v-icon>
          </template>

          <v-list-item-title>{{
            store.competition.cup_name
          }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
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
            <v-switch
              v-model="isDark"
              :loading="uploading"
              color="indigo-darken-3"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ $t("nav.theme") }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-btn rounded color="red" @click="logout" size="large"
            ><v-icon>mdi-logout</v-icon>{{ $t("nav.logout") }}</v-btn
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <notification-bar v-model:snackbar="snackbar" :text="text"></notification-bar>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useMainStore } from "@/store";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import UserService from "../../services/UserService";
import NotificationBar from "../NotificationBar.vue";
import SubNavigation from "./SubNavigation.vue";

defineOptions({ name: "Header" });
const store = useMainStore();
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const user = ref(null);
const items = ref([]);
const preferences = ref(JSON.parse(localStorage.getItem("preferences")));
const isDark = ref(true);
const drawer = ref(null);
const uploading = ref(false);
const snackbar = ref(false);
const text = ref("");
const isCompetitionPage = ref(false);
const isPublicPage = ref(false);
const competition_pages = ref([
  "/overview",
  "/comp-settings",
  "/signing",
  "/weighting",
  "/results",
]);
const public_pages = ref(["/public-results", "/public-cups"]);
const bottom_navigation_items = ref([]);
const type = ref("public");
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
const competition_items = ref([
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
]);

const isOverviewPage = computed(() => {
  return {
    active: route.name === "Overview",
  };
});

const isCupPage = computed(() => {
  return {
    active: route.name === "CupOverview",
  };
});

const isUser = computed(() => {
  if (localStorage.getItem("user") != null) {
    return JSON.parse(localStorage.getItem("user"));
  } else {
    return { name: "", email: "" };
  }
});

const isUserLoggedIn = computed(() => {
  return store.isLoggedIn;
});

const isAdmin = computed(() => {
  return store.isAdmin;
});

const isCompetitionSet = computed(() => {
  if (store.competition) {
    return true;
  } else {
    return false;
  }
});

const isCupCompetition = computed(
  () => !!store.competition?.isCupCompetition,
);

watch(
  () => route.fullPath,
  () => {
    const to = route;
    setSubNavigation(to);
  },
);

watch(isDark, (newValue) => {
  store.isDark = newValue;
  localStorage.setItem(
    "preferences",
    JSON.stringify({ isDark: newValue, lang: locale.value }),
  );
});

function openDrawer() {
  drawer.value = !drawer.value;
}

function setSubNavigation(route) {
  if (competition_pages.value.includes(route.path)) {
    isCompetitionPage.value = true;
    bottom_navigation_items.value = competition_items.value;
    type.value = "competition";
  } else {
    isCompetitionPage.value = false;
  }

  if (public_pages.value.includes(route.path)) {
    isPublicPage.value = true;
    bottom_navigation_items.value = public_items.value;
    type.value = "public";
  } else {
    isPublicPage.value = false;
  }
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

async function logout() {
  await UserService.logoutUser().then(() => {
    // Do something with the module.
    store.logged_in = false;
    store.is_admin = false;
    if (route.path !== "/") router.push({ path: "/" });
    store.refreshCompetition(null);
    user.value = null;
    text.value = "notification.logout-success";
    snackbar.value = true;
    localStorage.removeItem("user");
  });
}

function setLocale() {
  locale.value === "en" ? (locale.value = "fi") : (locale.value = "en");

  let preferences = JSON.parse(localStorage.getItem("preferences"));
  preferences.lang = locale.value;
  localStorage.setItem("preferences", JSON.stringify(preferences));
}

// Runs when the component is created
{
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const isAdmin = JSON.parse(localStorage.getItem("auth"));
    store.isDark = preferences.value.isDark;
    isDark.value = preferences.value.isDark;
    if (isAdmin) {
      items.value = [
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
          color: "green-darken-1",
        },
        {
          title: "nav.public-comps",
          route: "/public-results",
          icon: "mdi-format-list-numbered",
          color: "green-darken-1",
        },
        {
          title: "nav.public-cups",
          route: "/public-cups",
          icon: "mdi-medal",
          color: "yellow-darken-1",
        },
      ];
    } else {
      items.value = [
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

  setSubNavigation(route);
}
</script>

<style scoped></style>
