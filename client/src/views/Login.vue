<template>
  <!-- /login -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div class="container">
    <MainHeader />
    <div class="container-transparent" style="margin-top:100px">
      <v-container>
        <!-- if there are errors, show this div -->
        <div id="errordiv" v-if="errors.length">
          <ul class="collection with-header" style="border:1px solid red;">
            <li class="collection-header" style="background: rgba(0,0,0,0);">
              <v-alert type="error">
                Korjaa seuraavat virheet:
              </v-alert>
            </li>
            <li
              class="collection-item"
              id="error"
              v-for="(error, index) in errors"
              v-bind:key="index"
            >
              <p class="flow-text">{{ index + 1 }}. {{ error }}</p>
            </li>
          </ul>
        </div>
        <h1>Login</h1>
        <form>
          <v-row>
            <v-col md="8" offset-md="2" class="input-fields">
              <v-text-field
                id="email"
                label="Sähköpostiosoite"
                v-model="email"
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
            <ProgressBarQuery style="margin-bottom:20px" />
          </v-row>
          <v-row v-else>
            <v-col>
              <v-btn
                id="sbtn"
                large
                tile
                color="blue darken-4"
                class="white--text"
                @click="handleSubmit"
              >
                <i class="material-icons left">login</i>Kirjaudu
              </v-btn>
            </v-col>
          </v-row>
        </form>
      </v-container>
    </div>
  </div>
</template>
<script>
"use strict";
import M from "materialize-css";
import UserService from "../UserService";
import MainHeader from "../components/layout/MainHeader";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

export default {
  data() {
    return {
      errors: [],
      email: null,
      password: null,
      loading: false,
    };
  },
  components: {
    MainHeader,
    ProgressBarQuery,
  },
  mounted() {
    var input = document.getElementById("password");
    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("sbtn").click();
      }
    });
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    // Add error to error array and direct user to it
    showError: function(error) {
      this.errors.push(error);
      M.toast({ html: error });
      location.href = "#";
      location.href = "#app";
    },
    // Submit login credentials and confirm user login
    async handleSubmit(e) {
      e.preventDefault();
      this.errors = [];
      if (!this.email) {
        this.showError("Syötä sähköposti!");
      }
      if (!this.password) {
        this.showError("Syötä salasana!");
      }
      // If no errors in array, proceed to login
      if (!this.errors.length) {
        this.loading = true;
        // user object
        const user = {
          email: this.email,
          password: this.password,
        };
        try {
          // Login user  (check 'client\src\UserService.js' and 'server\routes\api\users.js' to see how this works)
          await UserService.loginUser(user)
            .then((response) => {
              // Check if user is admin
              let is_admin = JSON.stringify(response.data.user.is_admin);
              this.$store.state.is_admin = is_admin;
              // Set login token (jwt) and user data to localstorage and vuex
              localStorage.setItem(
                "user",
                JSON.stringify({
                  id: response.data.user._id,
                  name: response.data.user.name,
                  email: response.data.user.email,
                  is_admin: response.data.user.is_admin,
                  createdAt: response.data.user.createdAt,
                  preferences: response.data.user.preferences,
                })
              );
              // Set preferences to vuex
              this.$store.state.isDark = response.data.user.preferences.isDark;
              this.$store.state.lang = response.data.user.preferences.lang;
              localStorage.setItem("jwt", response.data.token);
              this.$store.state.logged_in = true;
              if (localStorage.getItem("jwt") != null) {
                this.$emit("loggedIn");
                if (this.$route.params.nextUrl != null) {
                  this.$router.push(this.$route.params.nextUrl);
                }
                // if route.params.nextURL not set, redirect to dashboard
                else {
                  this.$router.push({ path: "/dashboard" });
                }
              }
              this.loading = false;
            })
            .catch((err) => {
              if (err.response.status === 401 || err.response.status === 404) {
                this.loading = false;
                this.showError("Käyttäjänimi tai salasana ei täsmää!");
                return;
              }
              this.loading = false;
              return console.log(err);
            });
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
