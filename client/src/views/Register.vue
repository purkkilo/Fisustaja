<template>
  <!-- /register -->
  <v-container
    :class="{
      mobile: $vuetify.display.width < 800,
      browser: $vuetify.display.width >= 800,
      wide: $vuetify.display.width >= 1200,
    }"
  >
    <v-card
      style="background: transparent; padding: 20px"
      elevation="3"
      variant="outlined"
    >
      <ErrorList :errors="errors" />
      <v-row>
        <v-col>
          <h1 style="margin: 30px">Register</h1>
        </v-col>
      </v-row>
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :label="$t('username')"
              @paste.prevent
              v-model="name"
              name="name"
              type="text"
              maxlength="40"
              :loading="loading"
              :counter="40"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :label="$t('email')"
              @paste.prevent
              v-model="email"
              name="email"
              type="email"
              maxlength="40"
              :loading="loading"
              :counter="40"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :label="$t('password')"
              @paste.prevent
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              maxlength="40"
              :loading="loading"
              :counter="40"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :label="$t('password') + ' ' + $t('confirmation')"
              @paste.prevent
              v-model="password_confirmation"
              name="password_confirmation"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              maxlength="40"
              :loading="loading"
              :counter="40"
              @keyup.enter="handleSubmit"
            />
          </v-col>
        </v-row>
        <v-row v-if="password && password === password_confirmation">
          <v-col>
            <span
              class="text-body-large"
              :class="{ 'text-white': store.isDark }"
              >{{ $t("notification.passwords-matching") }}
              <v-icon>mdi-check-outline</v-icon></span
            >
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col v-if="password && password_confirmation">
            <span class="text-body-large text-red"
              >{{ $t("notification.passwords-not-matching") }}
              <v-icon>mdi-alert-circle</v-icon></span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <span
              class="text-body-large"
              :class="{ 'text-white': store.isDark }"
              >{{ $t("nav.admin") }}?</span
            >
            <v-radio-group v-model="is_admin" inline>
              <v-radio :label="$t('yes')" value="Yes"></v-radio>
              <v-radio :label="$t('no')" value="No"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <ProgressBarQuery v-if="loading" style="margin-bottom: 20px" />
        <v-row v-else>
          <v-col>
            <v-btn
              type="submit"
              rounded="0"
              color="blue-darken-4"
              class="text-white"
              :disabled="
                password.length === 0 || password !== password_confirmation
              "
              size="large"
            >
              <v-icon>mdi-account-plus</v-icon>{{ $t("register") }}
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>

    <NotificationBar v-model:snackbar="snackbar" :text="text" />
  </v-container>
</template>
<script setup>
import { useMainStore } from "@/store";
import { nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "../services/UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

const store = useMainStore();
const router = useRouter();

const errors = ref([]);
const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const is_admin = ref("No");
const loading = ref(false);
const snackbar = ref(false);
const text = ref("");
const showPassword = ref(true);

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    document.getElementById("error-list")?.scrollIntoView();
  });
}

async function handleSubmit(e) {
  e?.preventDefault?.();
  loading.value = true;
  errors.value = [];
  if (!email.value) {
    showError("errors.missing-email");
  }
  if (!password.value) {
    showError("errors.missing-password");
  }
  if (!name.value) {
    showError("errors.missing-name");
  }
  if (
    password.value === password_confirmation.value &&
    password.value.length > 0
  ) {
    if (!errors.value.length) {
      const user = {
        name: name.value,
        email: email.value,
        password: password.value,
        is_admin: is_admin.value === "Yes",
      };
      try {
        const res = await UserService.insertUser(user);
        loading.value = false;
        if (res.success) {
          router.push({ path: "/login" });
        } else if (res.error?.msg === "Email is already in use!") {
          showError("errors.email-used");
        } else if (res.error?.msg === "Username is already taken!") {
          showError("errors.name-used");
        } else {
          showError("errors.something-wrong");
          console.log(res.error);
        }
      } catch (err) {
        loading.value = false;
        showError("errors.something-wrong");
        console.log(err);
      }
    } else {
      loading.value = false;
    }
  } else {
    loading.value = false;
    showError("notification.passwords-not-matching");
  }
}
</script>
