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
      <!-- if there are errors, show this div -->
      <v-card
        :dark="$store.getters.getTheme"
        id="errordiv"
        elevation="20"
        v-if="errors.length"
      >
        <v-alert type="error"> Korjaa seuraavat virheet: </v-alert>
        <v-list>
          <v-list-item v-for="(error, index) in errors" v-bind:key="index">
            <v-list-item-icon>
              <v-icon color="red">mdi-alert-circle</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ error }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <h1 style="margin: 50px">Login</h1>
      <form>
        <v-row>
          <v-col md="8" offset-md="2" class="input-fields">
            <v-text-field
              :dark="$store.getters.getTheme"
              id="name"
              label="Käyttäjänimi"
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
              label="Salasana"
              id="password"
              v-model="password"
              type="password"
              maxlength="40"
              :loading="loading"
              :counter="40"
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
              <v-icon>mdi-login</v-icon>Kirjaudu
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
"use strict";

import UserService from "../services/UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  data() {
    return {
      errors: [],
      name: null,
      password: null,
      loading: false,
      snackbar: false,
      text: "",
      timeout: 5000,
    };
  },
  components: {
    ProgressBarQuery,
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
      location.href = "#";
      location.href = "#app";
    },
    // Submit login credentials and confirm user login
    async handleSubmit(e) {
      e.preventDefault();
      this.errors = [];
      if (!this.name) {
        this.showError("Syötä Käyttäjänimi!");
      }
      if (!this.password) {
        this.showError("Syötä salasana!");
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
              this.showError("Käyttäjänimi tai salasana ei täsmää!");
              return;
            } else {
              this.loading = false;
              this.showError("Jokin meni vikaan, yritä uudestaan!");
              console.log(res.error, res.status);
            }
          }
        } catch (error) {
          console.log(error);
          this.showError("Näillä tiedoilla ei löytynyt käyttäjää!");
          this.$router.push({ path: "/login" });
        }
      }
    },
  },
};
</script>
