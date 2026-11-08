<template>
  <!-- One sidebar for the whole app. Inside a competition it shrinks to
       icons (rail) and expands on hover; on phones it is a drawer. -->
  <v-navigation-drawer
    v-model="open"
    :rail="railed"
    :expand-on-hover="railed"
    :permanent="mdAndUp"
    :temporary="!mdAndUp"
    color="sidebar"
    width="264"
    rail-width="76"
    class="fs-sidebar"
    theme="dark"
  >
    <router-link to="/dashboard" class="fs-sidebar__brand">
      <FishLogo :size="34" />
      <span class="fs-display fs-sidebar__text">Fisustaja</span>
    </router-link>

    <v-list
      nav
      density="comfortable"
      class="fs-sidebar__list"
      :aria-label="$t('shell.menu')"
    >
      <template v-for="section in sections" :key="section.key">
        <v-list-subheader
          v-if="section.heading"
          class="fs-eyebrow fs-sidebar__text"
          >{{ section.heading }}</v-list-subheader
        >
        <v-list-item
          v-for="item in section.items"
          :key="item.key"
          :prepend-icon="item.icon"
          :title="item.title"
          :subtitle="item.subtitle"
          :to="item.to"
          :active="item.active"
          active-class="fs-sidebar__active"
          rounded="lg"
          @click="item.onClick && item.onClick()"
        />
      </template>
    </v-list>

    <template #append>
      <div class="fs-sidebar__user">
        <v-avatar color="signing" size="38" class="font-weight-bold">{{
          initials
        }}</v-avatar>
        <div class="fs-sidebar__text fs-sidebar__who">
          <span class="font-weight-bold">{{ store.user?.name }}</span>
          <span class="fs-sidebar__role">{{
            store.isAdmin ? $t("shell.admin-role") : $t("shell.organizer")
          }}</span>
        </div>
      </div>
      <div class="fs-sidebar__actions fs-sidebar__text">
        <v-btn
          variant="outlined"
          size="small"
          :aria-label="$t('shell.language')"
          @click="toggleLocale"
          >{{ locale.toUpperCase() }}</v-btn
        >
        <v-btn
          variant="outlined"
          size="small"
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          :aria-label="
            isDark ? $t('shell.theme-light') : $t('shell.theme-dark')
          "
          @click="toggleDark"
        />
        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-logout"
          @click="logout"
          >{{ $t("shell.logout") }}</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
  <NotificationBar v-model:snackbar="snackbar" :text="text" />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "@/store";
import { usePreferences } from "@/composables/usePreferences";
import UserService from "@/services/UserService";
import NotificationBar from "../NotificationBar.vue";
import FishLogo from "./FishLogo.vue";

const open = defineModel({ type: Boolean, default: true });
const props = defineProps({
  // shrink to icons (inside a competition)
  rail: Boolean,
});

const store = useMainStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { mdAndUp } = useDisplay();
const { locale, isDark, toggleLocale, toggleDark } = usePreferences();

const snackbar = ref(false);
const text = ref("");

const railed = computed(() => props.rail && mdAndUp.value);

// a drawer on phones, always open on laptops
watch(mdAndUp, (wide) => (open.value = wide), { immediate: true });

const initials = computed(() =>
  (store.user?.name || "?")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
);

function openCup() {
  const cupId = store.competition?.cup_id ?? store.cup?._id;
  if (cupId) localStorage.setItem("cup", cupId);
  router.push("/cup-overview");
}

const sections = computed(() => {
  const competition = store.competition;
  const cupName = competition?.isCupCompetition
    ? competition.cup_name
    : store.cup?.name;
  const work = [
    {
      key: "home",
      icon: "mdi-home-outline",
      title: t("shell.home"),
      to: "/dashboard",
    },
  ];
  if (competition?.name) {
    work.push({
      key: "competition",
      icon: "mdi-flag-outline",
      title: competition.name,
      subtitle: t("shell.current-competition"),
      to: "/overview",
      active: !!route.meta.competition,
    });
  }
  if (cupName) {
    work.push({
      key: "cup",
      icon: "mdi-trophy-outline",
      title: cupName,
      subtitle: t("shell.current-cup"),
      onClick: openCup,
      active: route.path === "/cup-overview",
    });
  }
  work.push({
    key: "new",
    icon: "mdi-plus-circle-outline",
    title: t("shell.new-competition"),
    to: "/register-comp",
  });

  const list = [
    { key: "work", items: work },
    {
      key: "public",
      heading: t("shell.public"),
      items: [
        {
          key: "public-comps",
          icon: "mdi-earth",
          title: t("shell.public-comps"),
          to: "/public-results",
        },
        {
          key: "public-cups",
          icon: "mdi-medal-outline",
          title: t("shell.public-cups"),
          to: "/public-cups",
        },
      ],
    },
  ];
  if (store.isAdmin) {
    list.push({
      key: "admin",
      heading: t("shell.admin"),
      items: [
        {
          key: "admin",
          icon: "mdi-shield-crown-outline",
          title: t("shell.admin"),
          to: "/admin",
        },
        {
          key: "register",
          icon: "mdi-account-plus-outline",
          title: t("shell.register-user"),
          to: "/register",
        },
      ],
    });
  }
  return list;
});

async function logout() {
  await UserService.logoutUser();
  store.clearSession();
  if (route.path !== "/") router.push({ path: "/" });
  text.value = "notification.logout-success";
  snackbar.value = true;
}
</script>

<style scoped>
.fs-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 21px 18px;
  color: #ffffff;
  text-decoration: none;
  font-size: 21px;
  white-space: nowrap;
}
.fs-sidebar__list :deep(.v-list-item) {
  color: #d3e0e8;
  min-height: 46px;
}
.fs-sidebar__list :deep(.v-list-item-subtitle) {
  color: #a9becb;
  opacity: 1;
}
.fs-sidebar__list :deep(.fs-sidebar__active) {
  background: #ffffff;
  color: #0f2a3c;
  font-weight: 700;
}
.fs-sidebar__list :deep(.fs-sidebar__active .v-list-item__overlay) {
  opacity: 0;
}
.fs-sidebar__list :deep(.fs-sidebar__active .v-list-item-subtitle) {
  color: #2c4a5e;
}
.fs-sidebar__list :deep(.v-list-subheader) {
  color: #9fb4c1;
  margin-top: 12px;
}
.fs-sidebar__user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 12px 8px;
  padding: 10px;
  border-radius: 12px;
  background: #183b52;
  white-space: nowrap;
}
.fs-sidebar__who {
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: #ffffff;
}
.fs-sidebar__role {
  font-size: 13px;
  color: #a9becb;
}
.fs-sidebar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 16px;
}
/* collapsed rail: icons only */
.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)
  .fs-sidebar__text {
  display: none;
}
.v-navigation-drawer--rail:not(.v-navigation-drawer--is-hovering)
  .fs-sidebar__user {
  background: transparent;
  padding: 10px 7px;
}
</style>
