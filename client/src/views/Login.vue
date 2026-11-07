<template>
  <!-- /login -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
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
      <error-list :errors="errors"></error-list>
      <h1 style="margin: 50px">{{ $t("nav.login") }}</h1>
      <form>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              id="name"
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
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @click:append-inner="showPassword = !showPassword"
              maxlength="40"
              :loading="loading"
              :counter="40"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            />
          </v-col>
        </v-row>
        <v-row v-if="loading">
          <ProgressBarQuery style="margin-bottom: 20px" />
        </v-row>
        <v-row v-else>
          <v-col>
            <v-btn
              id="sbtn"
              tile
              color="white"
              class="text-white"
              @click="handleSubmit"
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
import { nextTick, onMounted, ref } from "vue";
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

// Add error to error array and direct user to it

function showError(error) {
  errors.value.push(error);
  nextTick(() => {
    document.getElementById("error-list").scrollIntoView();
  });
}

// Submit login credentials and confirm user login

async function handleSubmit(e) {
  e.preventDefault();
  errors.value = [];
  if (!name.value) {
    showError("errors.missing-username");
  }
  if (!password.value) {
    showError("errors.missing-password");
  }
  // If no errors in array, proceed to login
  if (!errors.value.length) {
    loading.value = true;
    // user object
    const user = {
      name: name.value,
      email: name.value,
      password: password.value,
    };
    try {
      // Login user  (check 'client\src\UserService.js' and 'server\routes\api\users.js' to see how this works)
      let res = await UserService.loginUser(user);
      if (res.success) {
        store.is_admin = res.is_admin;
        store.logged_in = true;
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
        if (res.status === 401 || res.status === 404) {
          loading.value = false;
          showError("errors.details-not-match");
          return;
        } else {
          loading.value = false;
          showError("errors.something-wrong");
          console.log(res.error, res.status);
        }
      }
    } catch (error) {
      showError("errors.no-user-found");
      //this.$router.push({ path: "/login" });
    }
  }
}

onMounted(() => {
  var input = document.getElementById("password");
  input.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("sbtn").click();
    }
  });
});
</script>
