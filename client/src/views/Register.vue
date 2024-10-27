<template>
  <!-- /register -->
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
      <v-row>
        <v-col>
          <h1 style="margin: 30px">Register</h1>
        </v-col>
      </v-row>
      <form>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :dark="$store.getters.getTheme"
              :label="$t('username')"
              id="name"
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
              :dark="$store.getters.getTheme"
              :label="$t('email')"
              id="email"
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
              :dark="$store.getters.getTheme"
              :label="$t('password')"
              id="password"
              @paste.prevent
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
              :label="$t('password') + ' ' + $t('confirmation')"
              id="password_confirmation"
              @paste.prevent
              v-model="password_confirmation"
              name="password_confirmation"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              maxlength="40"
              :loading="loading"
              :counter="40"
            />
          </v-col>
        </v-row>
        <!-- If user has typed at least one letter to password and password confirmation and both are the same-->
        <v-row v-if="password && password === password_confirmation">
          <v-col>
            <span
              class="flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
              >{{ $t("notification.passwords-matching") }}
              <v-icon>mdi-check-outline</v-icon></span
            >
          </v-col>
        </v-row>
        <!-- If password and password confirmation differs from each other-->
        <v-row v-else>
          <!-- if both inputs have text, show this-->
          <v-col v-if="password && password_confirmation">
            <span class="flow-text red-text"
              >{{ $t("notification.passwords-not-matching") }}
              <v-icon>mdi-alert-circle</v-icon></span
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <span
              class="col s6 flow-text"
              v-bind:class="{
                'white--text': $store.getters.getTheme,
              }"
              >{{ $t("nav.admin") }}?</span
            >
            <v-radio-group v-model="is_admin" row>
              <v-radio :label="$t('yes')" value="Yes"></v-radio>
              <v-radio :label="$t('no')" value="No"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <ProgressBarQuery v-if="loading" style="margin-bottom: 20px" />
        <!-- Button only active if passwords match  -->
        <v-row v-else>
          <v-col>
            <v-btn
              id="sbtn"
              large
              tile
              color="blue darken-4"
              class="white--text"
              @click="handleSubmit"
              :disabled="
                password.length === 0 || password !== password_confirmation
              "
            >
              <v-icon>mdi-account-plus</v-icon>{{ $t("register") }}
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>

    <notification-bar :snackbar="snackbar" :text="text"></notification-bar>
  </v-container>
</template>
<script>
import UserService from "../services/UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import NotificationBar from "../components/NotificationBar.vue";
import ErrorList from "../components/ErrorList.vue";

export default {
  props: ["nextUrl"],
  data() {
    return {
      errors: [],
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: "No",
      loading: false,
      snackbar: false,
      text: "",
      showPassword: true,
    };
  },
  components: {
    ProgressBarQuery,
    NotificationBar,
    ErrorList,
  },
  mounted() {
    // Press button by enter key when focusing password_confirmation input
    var input = document.getElementById("password_confirmation");
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
    // Submit register credentials and confirm user login
    async handleSubmit(e) {
      this.loading = true;
      e.preventDefault();
      this.errors = [];
      //TODO check if it's really an email adress
      if (!this.email) {
        this.showError("errors.missing-email");
      }
      if (!this.password) {
        this.showError("errors.missing-password");
      }
      if (!this.name) {
        this.showError("errors.missing-name");
      }
      if (
        this.password === this.password_confirmation &&
        this.password.length > 0
      ) {
        if (!this.errors.length) {
          const user = {
            name: this.name,
            email: this.email,
            password: this.password,
            is_admin: this.is_admin === "Yes" ? true : false,
          };
          // Add admin to database (check 'client\src\UserServiceService.js' and 'server\routes\api\users.js' to see how this works)
          const res = await UserService.insertUser(user);
          this.loading = false;
          if (res.success) {
            this.$router.push({ path: "/login" });
          } else {
            if (res.error.msg === "Email is already in use!") {
              this.showError("errors.email-used");
            } else if (res.error.msg === "Username is already taken!") {
              this.showError("errors.name-used");
            } else {
              this.showError("errors.something-wrong");
              console.log(res.error);
            }
          }
        } else {
          // IF there are errors left
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.showError("notification.passwords-not-matching");
      }
    },
  },
};
</script>
