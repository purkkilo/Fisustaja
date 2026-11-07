<template>
  <!-- /login -->
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
      <ErrorList ref="errorList" :errors="errors" />
      <h1 style="margin: 50px">{{ $t("nav.login") }}</h1>
      <form @submit.prevent="handleSubmit">
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :label="$t('username')"
              v-model="name"
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
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              maxlength="40"
              :loading="loading"
              :counter="40"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @keyup.enter="handleSubmit"
            />
          </v-col>
        </v-row>
        <v-row v-if="loading">
          <ProgressBarQuery style="margin-bottom: 20px" />
        </v-row>
        <v-row v-else>
          <v-col>
            <v-btn
              type="submit"
              rounded="0"
              color="white"
              class="text-white"
              size="large"
              variant="outlined"
            >
              <v-icon>mdi-login</v-icon>{{ $t("nav.login") }}
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>
  </v-container>
</template>
<script setup>
import { nextTick, ref } from "vue";
import { useMainStore } from "@/store";
import { useRouter, useRoute } from "vue-router";
import UserService from "../services/UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery.vue";
import ErrorList from "../components/ErrorList.vue";

const store = useMainStore();
const router = useRouter();
const route = useRoute();

const errors = ref([]);
const name = ref(null);
const password = ref(null);
const loading = ref(false);
const showPassword = ref(false);
const errorList = ref(null);

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    errorList.value?.$el?.scrollIntoView?.();
  });
}

async function handleSubmit(e) {
  e?.preventDefault?.();
  errors.value = [];
  if (!name.value) {
    showError("errors.missing-username");
  }
  if (!password.value) {
    showError("errors.missing-password");
  }
  if (!errors.value.length) {
    loading.value = true;
    const user = {
      name: name.value,
      email: name.value,
      password: password.value,
    };
    try {
      let res = await UserService.loginUser(user);
      if (res.success) {
        store.setSession(res.user);
        const redirect = route.query.redirect;
        if (
          typeof redirect === "string" &&
          redirect.startsWith("/") &&
          !redirect.startsWith("//")
        ) {
          router.push(redirect);
        } else {
          router.push({ path: "/dashboard" });
        }
        loading.value = false;
      } else {
        loading.value = false;
        if (res.status === 429) {
          showError("errors.too-many-attempts");
        } else if (res.status === 401 || res.status === 404) {
          showError("errors.details-not-match");
        } else {
          showError("errors.something-wrong");
          console.log(res.error, res.status);
        }
      }
    } catch {
      loading.value = false;
      showError("errors.no-user-found");
    }
  }
}
</script>
