<template>
  <!-- /register: an admin adds a user -->
  <div class="fs-page register">
    <PageHead
      :title="$t('shell.register-user')"
      :eyebrow="$t('shell.admin')"
      tone="muted"
    >
      <template #actions>
        <v-btn to="/admin" variant="text" prepend-icon="mdi-arrow-left">{{
          $t("shell.admin")
        }}</v-btn>
      </template>
    </PageHead>

    <FsSection
      class="register__form"
      tone="signing"
      icon="mdi-account-plus-outline"
      :title="$t('register-page.new-user')"
    >
      <form
        class="d-flex flex-column ga-4"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <ErrorList :errors="errors" />
        <v-text-field
          v-model="name"
          :label="$t('username')"
          name="name"
          autocomplete="off"
          maxlength="40"
          :counter="40"
          hide-details="auto"
          autofocus
        />
        <v-text-field
          v-model="email"
          :label="$t('email')"
          name="email"
          type="email"
          autocomplete="off"
          maxlength="40"
          :counter="40"
          hide-details="auto"
        />
        <div class="pair">
          <v-text-field
            v-model="password"
            :label="$t('password')"
            name="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            maxlength="40"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            hide-details="auto"
            @click:append-inner="showPassword = !showPassword"
          />
          <v-text-field
            v-model="password_confirmation"
            :label="$t('password') + ' ' + $t('confirmation')"
            name="password_confirmation"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            maxlength="40"
            hide-details="auto"
            @paste.prevent
          />
        </div>
        <span
          v-if="password && password_confirmation"
          class="register__match"
          :class="passwordsMatch ? 'text-signing' : 'text-error'"
          role="status"
        >
          <v-icon
            :icon="passwordsMatch ? 'mdi-check-circle' : 'mdi-alert-circle'"
            size="18"
          />
          {{
            passwordsMatch
              ? $t("notification.passwords-matching")
              : $t("notification.passwords-not-matching")
          }}
        </span>
        <v-switch
          v-model="isAdmin"
          :label="$t('register-page.is-admin')"
          color="results"
          inset
          hide-details
        />
        <div class="d-flex justify-end">
          <v-btn
            type="submit"
            color="signing"
            size="large"
            prepend-icon="mdi-account-plus"
            :loading="loading"
            :disabled="!passwordsMatch"
            >{{ $t("register") }}</v-btn
          >
        </div>
      </form>
    </FsSection>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "../services/UserService";
import ErrorList from "../components/ErrorList.vue";
import PageHead from "../components/ui/PageHead.vue";
import FsSection from "../components/ui/FsSection.vue";

defineOptions({ name: "Register" });
const router = useRouter();

const errors = ref([]);
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const isAdmin = ref(false);
const loading = ref(false);
// the admin usually needs to pass the password on, so show it
const showPassword = ref(true);

const passwordsMatch = computed(
  () =>
    password.value.length > 0 && password.value === password_confirmation.value,
);

function showError(error) {
  errors.value.push(error);
  nextTick(() => document.getElementById("error-list")?.scrollIntoView());
}

async function handleSubmit() {
  if (loading.value) return;
  errors.value = [];
  if (!name.value) showError("errors.missing-name");
  if (!email.value) showError("errors.missing-email");
  if (!password.value) showError("errors.missing-password");
  else if (!passwordsMatch.value)
    showError("notification.passwords-not-matching");
  if (errors.value.length) return;

  loading.value = true;
  try {
    const res = await UserService.insertUser({
      name: name.value,
      email: email.value,
      password: password.value,
      is_admin: isAdmin.value,
    });
    if (res.success) {
      router.push({ path: "/admin" });
    } else if (res.error?.msg === "Email is already in use!") {
      showError("errors.email-used");
    } else if (res.error?.msg === "Username is already taken!") {
      showError("errors.name-used");
    } else {
      showError("errors.something-wrong");
      console.log(res.error);
    }
  } catch (err) {
    showError("errors.something-wrong");
    console.log(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register {
  max-width: 760px;
}
.pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 600px) {
  .pair {
    grid-template-columns: minmax(0, 1fr);
  }
}
.register__match {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
</style>
