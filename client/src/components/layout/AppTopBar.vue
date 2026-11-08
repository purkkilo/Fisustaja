<template>
  <!-- Top bar: public pages when logged out, and the menu button on phones -->
  <v-app-bar color="sidebar" theme="dark" flat height="64">
    <v-app-bar-nav-icon
      v-if="loggedIn"
      :aria-label="$t('shell.menu')"
      @click="emit('menu')"
    />
    <router-link
      :to="loggedIn ? '/dashboard' : '/'"
      class="fs-topbar__brand"
      :class="{ 'ml-4': !loggedIn }"
    >
      <FishLogo :size="30" />
      <span class="fs-display">Fisustaja</span>
    </router-link>
    <v-spacer />
    <template v-if="!loggedIn">
      <v-btn
        v-if="smAndUp"
        to="/public-results"
        variant="text"
        prepend-icon="mdi-earth"
        >{{ $t("shell.public-comps") }}</v-btn
      >
      <v-btn
        v-if="smAndUp"
        to="/public-cups"
        variant="text"
        prepend-icon="mdi-medal-outline"
        >{{ $t("shell.public-cups") }}</v-btn
      >
    </template>
    <v-btn
      variant="outlined"
      size="small"
      class="mx-2"
      :aria-label="$t('shell.language')"
      @click="toggleLocale"
      >{{ locale.toUpperCase() }}</v-btn
    >
    <v-btn
      v-if="!loggedIn"
      to="/login"
      color="amber"
      variant="flat"
      class="mr-3"
      prepend-icon="mdi-login"
      >{{ $t("nav.login") }}</v-btn
    >
  </v-app-bar>
</template>

<script setup>
import { useDisplay } from "vuetify";
import { usePreferences } from "@/composables/usePreferences";
import FishLogo from "./FishLogo.vue";

defineProps({ loggedIn: Boolean });
const emit = defineEmits(["menu"]);
const { smAndUp } = useDisplay();
const { locale, toggleLocale } = usePreferences();
</script>

<style scoped>
.fs-topbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  text-decoration: none;
  font-size: 20px;
}
</style>
