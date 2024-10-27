<template>
  <!-- /login -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-card
      style="background: transparent; padding: 20px"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <error-list :errors="errors"></error-list>
      <h1 style="margin: 50px">{{ $t("nav.login") }}</h1>
      <form>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :dark="$store.getters.getTheme"
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
              :dark="$store.getters.getTheme"
              :label="$t('password')"
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              maxlength="40"
              :loading="loading"
              :counter="40"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
              large
              tile
              outlined
              color="white"
              class="white--text"
              @click="handleSubmit"
            >
              <v-icon>mdi-login</v-icon>{{ $t("nav.login") }}
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>
  </v-container>
</template>
<script>
import UserService from "../services/UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import ErrorList from "../components/ErrorList.vue";

export default {
  data() {
    return {
      errors: [],
      name: null,
      password: null,
      loading: false,
      showPassword: false,
    };
  },
  components: {
    ProgressBarQuery,
    ErrorList,
  },
  mounted() {
    var input = document.getElementById("password");
    input.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("sbtn").click();
      }
    });
  },
  methods: {
    // Add error to error array and direct user to it
    showError(error) {
      this.errors.push(error);
      this.$nextTick(() => {
        document.getElementById("error-list").scrollIntoView();
      });
    },
    // Submit login credentials and confirm user login
    async handleSubmit(e) {
      e.preventDefault();
      this.errors = [];
      if (!this.name) {
        this.showError("errors.missing-username");
      }
      if (!this.password) {
        this.showError("errors.missing-password");
      }
      // If no errors in array, proceed to login
      if (!this.errors.length) {
        this.loading = true;
        // user object
        const user = {
          name: this.name,
          email: this.name,
          password: this.password,
        };
        try {
          // Login user  (check 'client\src\UserService.js' and 'server\routes\api\users.js' to see how this works)
          let res = await UserService.loginUser(user);
          if (res.success) {
            this.$store.state.is_admin = res.is_admin;
            this.$store.state.logged_in = true;
            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            }
            // if route.params.nextURL not set, redirect to dashboard
            else {
              this.$router.push({ path: "/dashboard" });
            }
            this.loading = false;
          } else {
            if (res.status === 401 || res.status === 404) {
              this.loading = false;
              this.showError("errors.details-not-match");
              return;
            } else {
              this.loading = false;
              this.showError("errors.something-wrong");
              console.log(res.error, res.status);
            }
          }
        } catch (error) {
          this.showError("errors.no-user-found");
          //this.$router.push({ path: "/login" });
        }
      }
    },
  },
};
</script>
