<template>
  <v-app id="app">
    <AppSidebar v-if="store.logged_in" v-model="drawer" :rail="inCompetition" />
    <AppTopBar
      v-if="!store.logged_in || !mdAndUp"
      :logged-in="store.logged_in"
      @menu="drawer = !drawer"
    />

    <v-main :class="{ 'legacy-view': !route.meta.redesigned }">
      <CompetitionHeader v-if="store.logged_in && inCompetition" />
      <router-view />
      <footer class="fs-footer">
        2018–{{ new Date().getFullYear() }} © Jori Kosonen
      </footer>
    </v-main>
    <notification-bar
      v-model:snackbar="snackbar"
      :text="text"
    ></notification-bar>
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useMainStore } from "@/store";
import AppSidebar from "./components/layout/AppSidebar.vue";
import AppTopBar from "./components/layout/AppTopBar.vue";
import CompetitionHeader from "./components/layout/CompetitionHeader.vue";
import NotificationBar from "./components/NotificationBar.vue";

defineOptions({ name: "App" });
const store = useMainStore();
const route = useRoute();
const { locale } = useI18n();
const theme = useTheme();
const { mdAndUp } = useDisplay();

const drawer = ref(mdAndUp.value);
const snackbar = ref(false);
const text = ref("errors.session-expired");

// competition pages (router meta) get the competition header and a narrow sidebar
const inCompetition = computed(() => !!route.meta.competition);

watch(
  () => store.isDark,
  (isDark) => theme.change(isDark ? "dark" : "light"),
  { immediate: true },
);

const preferences = JSON.parse(localStorage.getItem("preferences") || "null");
if (!preferences) {
  localStorage.setItem(
    "preferences",
    JSON.stringify({ isDark: false, lang: locale.value }),
  );
} else {
  store.isDark = !!preferences.isDark;
  if (preferences.lang) locale.value = preferences.lang;
}
</script>

<style>
.fs-footer {
  padding: 24px 16px 32px;
  text-align: center;
  font-size: 13px;
  color: rgb(var(--v-theme-muted));
}
</style>
