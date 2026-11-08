<template>
  <!-- Starting page, / -->
  <div class="fs-page home">
    <section class="home__hero">
      <FishLogo :size="72" />
      <div>
        <h1 class="fs-display">Fisustaja</h1>
        <p class="home__lead">{{ $t("home-page.lead") }}</p>
      </div>
    </section>

    <nav :aria-label="$t('shell.menu')" class="home__links">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="home__link"
        :class="`home__link--${link.tone}`"
      >
        <span aria-hidden="true" class="home__icon">
          <v-icon :icon="link.icon" size="26" />
        </span>
        <span class="home__text">
          <strong>{{ $t(link.title) }}</strong>
          <span class="fs-muted">{{ $t(link.text) }}</span>
        </span>
        <v-icon icon="mdi-arrow-right" class="home__go" aria-hidden="true" />
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/store";
import FishLogo from "../components/layout/FishLogo.vue";

defineOptions({ name: "Home" });
const store = useMainStore();

const links = computed(() => [
  store.logged_in
    ? {
        path: "/dashboard",
        icon: "mdi-view-dashboard-outline",
        title: "nav.dashboard",
        text: "home-page.dashboard",
        tone: "signing",
      }
    : {
        path: "/login",
        icon: "mdi-login",
        title: "nav.login",
        text: "home-page.login",
        tone: "signing",
      },
  {
    path: "/public-results",
    icon: "mdi-trophy-outline",
    title: "home.comp",
    text: "home-page.results",
    tone: "results",
  },
  {
    path: "/public-cups",
    icon: "mdi-medal-outline",
    title: "home.cup",
    text: "home-page.cups",
    tone: "weighing",
  },
]);
</script>

<style scoped>
.home {
  max-width: 980px;
  margin: 0 auto;
  padding-top: 64px;
  gap: 40px;
}
.home__hero {
  display: flex;
  align-items: center;
  gap: 24px;
}
.home__hero h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1.05;
}
.home__lead {
  margin: 6px 0 0;
  font-size: 18px;
  color: rgb(var(--v-theme-muted));
  max-width: 560px;
}
.home__links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.home__link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.15s,
    transform 0.15s;
}
.home__link:hover {
  transform: translateY(-2px);
}
.home__link:focus-visible {
  outline: 3px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.home__link--signing:hover {
  border-color: rgb(var(--v-theme-signing));
}
.home__link--results:hover {
  border-color: rgb(var(--v-theme-results));
}
.home__link--weighing:hover {
  border-color: rgb(var(--v-theme-weighing));
}
.home__icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
}
.home__link--signing .home__icon {
  background: rgb(var(--v-theme-signing-soft));
  color: rgb(var(--v-theme-signing));
}
.home__link--results .home__icon {
  background: rgb(var(--v-theme-results-soft));
  color: rgb(var(--v-theme-results));
}
.home__link--weighing .home__icon {
  background: rgb(var(--v-theme-weighing-soft));
  color: rgb(var(--v-theme-weighing));
}
.home__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.35;
}
.home__text strong {
  font-size: 17px;
}
.home__go {
  opacity: 0.6;
}
@media (max-width: 600px) {
  .home {
    padding-top: 24px;
  }
  .home__hero h1 {
    font-size: 38px;
  }
}
</style>
