<template>
  <!-- /register -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <v-row>
      <v-col>
        <v-card
          max-width="800px"
          style="padding: 30px; margin: auto"
          :dark="$store.getters.getTheme"
          v-bind:class="{
            'container-transparent': !$store.getters.getTheme,
            'container-transparent-dark': $store.getters.getTheme,
          }"
        >
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
                  label="Käyttäjänimi"
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
                  label="Sähköpostiosoite"
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
                  label="Salasana"
                  id="password"
                  @paste.prevent
                  v-model="password"
                  name="password"
                  type="password"
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
                  label="Salasanan vahvistus"
                  id="password_confirmation"
                  @paste.prevent
                  v-model="password_confirmation"
                  name="password_confirmation"
                  type="password"
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
                  >Salasanat täsmäävät! <v-icon>mdi-check-outline</v-icon></span
                >
              </v-col>
            </v-row>
            <!-- If password and password confirmation differs from each other-->
            <v-row v-else>
              <!-- if both inputs have text, show this-->
              <v-col v-if="password && password_confirmation">
                <span class="flow-text red-text"
                  >Salasanat ei täsmää! <v-icon>mdi-alert-circle</v-icon></span
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
                  >Admin?</span
                >
                <v-radio-group v-model="is_admin" row>
                  <v-radio label="Kyllä" value="Yes"></v-radio>
                  <v-radio label="Ei" value="No"></v-radio>
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
                  <v-icon>mdi-account-plus</v-icon>Rekisteröidy
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </v-card>
      </v-col>
    </v-row>
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
import UserService from "../UserService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";

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
      timeout: 5000,
    };
  },
  components: {
    ProgressBarQuery,
  },
  mounted() {
    // Press button by enter key when focusing password_confirmation input
    var input = document.getElementById("password_confirmation");
    input.addEventListener("keyup", function (event) {
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
    showError: function (error) {
      this.errors.push(error);
      location.href = "#";
      location.href = "#app";
    },
    // Submit register credentials and confirm user login
    async handleSubmit(e) {
      this.loading = true;
      e.preventDefault();
      this.errors = [];
      //TODO check if it's really an email adress
      if (!this.email) {
        this.showError("Syötä sähköposti!");
      }
      if (!this.password) {
        this.showError("Syötä salasana!");
      }
      if (!this.name) {
        this.showError("Syötä nimi!");
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
            this.showError("Käyttäjä rekisteröity!");
          } else {
            if (res.error.msg === "Email is already in use!") {
              this.showError("Sähköposti on jo käytössä!");
            } else if (res.error.msg === "Username is already taken!") {
              this.showError("Käyttäjänimi on jo käytössä!");
            } else {
              this.showError("Jokin meni pieleen... yritä uudelleen!");
              console.log(res.error);
            }
          }
        } else {
          // IF there are errors left
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.showError("Salasanat eivät vastaa toisiaan!");
      }
    },
  },
};
</script>
