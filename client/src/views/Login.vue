<template>
  <!-- /login -->
  <div class="fs-page auth">
    <div class="fs-panel auth__card">
      <aside class="auth__brand" aria-hidden="true">
        <FishLogo :size="56" />
        <span class="fs-display auth__name">Fisustaja</span>
        <span class="auth__tagline">{{ $t("auth-page.tagline") }}</span>
      </aside>

      <form class="auth__form" novalidate @submit.prevent="handleSubmit">
        <h1>{{ $t("nav.login") }}</h1>
        <v-alert
          v-if="errors.length"
          type="error"
          variant="tonal"
          density="comfortable"
        >
          <div v-for="error in errors" :key="error">{{ $t(error) }}</div>
        </v-alert>
        <v-text-field
          v-model="name"
          :label="$t('username')"
          autocomplete="username"
          maxlength="40"
          prepend-inner-icon="mdi-account-outline"
          hide-details="auto"
          autofocus
        />
        <v-text-field
          v-model="password"
          :label="$t('password')"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          maxlength="40"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          hide-details="auto"
          @click:append-inner="showPassword = !showPassword"
        />
        <v-btn
          type="submit"
          color="weighing"
          size="large"
          block
          prepend-icon="mdi-login"
          :loading="loading"
          >{{ $t("nav.login") }}</v-btn
        >
        <router-link to="/" class="auth__back">
          <v-icon icon="mdi-arrow-left" size="16" />
          {{ $t("auth-page.to-public") }}
        </router-link>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import UserService from "../services/UserService";
import FishLogo from "../components/layout/FishLogo.vue";

defineOptions({ name: "Login" });
const store = useMainStore();
const router = useRouter();
const route = useRoute();

const errors = ref([]);
const name = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);

// only same-site paths, so a crafted link can't send the user elsewhere
function safeRedirect(redirect) {
  return typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
    ? redirect
    : "/dashboard";
}

async function handleSubmit() {
  if (loading.value) return;
  errors.value = [];
  if (!name.value) errors.value.push("errors.missing-username");
  if (!password.value) errors.value.push("errors.missing-password");
  if (errors.value.length) return;

  loading.value = true;
  try {
    const res = await UserService.loginUser({
      name: name.value,
      email: name.value,
      password: password.value,
    });
    if (res.success) {
      store.setSession(res.user);
      router.push(safeRedirect(route.query.redirect));
    } else if (res.status === 429) {
      errors.value.push("errors.too-many-attempts");
    } else if (res.status === 401 || res.status === 404) {
      errors.value.push("errors.details-not-match");
    } else {
      errors.value.push("errors.something-wrong");
      console.log(res.error, res.status);
    }
  } catch {
    errors.value.push("errors.no-user-found");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth {
  min-height: calc(100vh - 160px);
  align-items: center;
  justify-content: center;
}
.auth__card {
  display: flex;
  width: 100%;
  max-width: 820px;
  overflow: hidden;
  border-radius: 22px;
}
.auth__brand {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 40px;
  background:
    radial-gradient(
      120% 80% at 0% 100%,
      rgba(42, 116, 160, 0.55),
      transparent 60%
    ),
    #13344a;
  color: #ffffff;
}
.auth__name {
  font-size: 34px;
  line-height: 1.1;
}
.auth__tagline {
  font-size: 16px;
  opacity: 0.85;
  max-width: 260px;
}
.auth__form {
  flex: 1 1 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px;
}
.auth__form h1 {
  margin: 0 0 4px;
  font-size: 28px;
}
.auth__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: center;
  color: rgb(var(--v-theme-muted));
  font-weight: 600;
  text-decoration: none;
}
.auth__back:hover {
  text-decoration: underline;
}
@media (max-width: 700px) {
  .auth__brand {
    display: none;
  }
  .auth__form {
    padding: 28px 22px;
  }
}
</style>
