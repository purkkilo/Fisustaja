<template>
  <!-- /feedback -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container
    v-bind:class="{
      mobile: $vuetify.breakpoint.width < 800,
      browser: $vuetify.breakpoint.width >= 800,
      wide: $vuetify.breakpoint.width >= 1200,
    }"
  >
    <v-card
      style="background: transparent"
      elevation="10"
      outlined
      :dark="$store.getters.getTheme"
    >
      <v-row>
        <v-col>
          <v-row v-if="error">
            {{ error }}
          </v-row>

          <v-row id="send-feedback" style="margin: 20px">
            <v-col v-if="prevRoute">
              <v-btn
                v-if="prevRoute.name"
                large
                rounded
                outlined
                color="yellow"
                @click="$router.push({ path: prevRoute.path })"
                ><v-icon>mdi-keyboard-return</v-icon>Palaa takaisin</v-btn
              >
            </v-col>
          </v-row>
          <h1>Lähetä palautetta</h1>
          <p class="flow-text title black-text">
            Ilmoita bugeista, kehitysehdotuksista jne jne.
          </p>

          <v-row>
            <v-col class="d-flex" md="4" offset-md="4">
              <v-select
                :menu-props="$store.getters.getTheme ? 'dark' : 'light'"
                :dark="$store.getters.getTheme"
                item-color="blue"
                v-model="type"
                :items="type_options"
                label="Palautteen tyyppi"
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              md="8"
              offset-md="2"
              v-bind:class="{
                inputarea: !$store.getters.getTheme,
                'inputarea-dark': $store.getters.getTheme,
              }"
            >
              <v-textarea
                :dark="$store.getters.getTheme"
                v-model="message"
                name="input-7-1"
                filled
                label="Palaute tähän"
                auto-grow
                :value="message"
                maxlength="800"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-row style="margin: 20px">
            <v-col md="4" offset-md="4">
              <v-btn
                block
                large
                outlined
                color="white"
                @click="sendFeedback"
                :loading="loading"
                ><v-icon>mdi-send</v-icon>Lähetä palaute</v-btn
              >
            </v-col>
          </v-row>
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
    </v-card>
  </v-container>
</template>
<script>
"use strict";

import FeedbackService from "../services/FeedbackService";

export default {
  name: "Feedback",
  components: {},
  data() {
    return {
      prevRoute: null,
      message: null,
      type: "Bugi",
      type_options: ["Bugi", "Ehdotus", "Muu"],
      loading: false,
      error: null,
      snackbar: false,
      text: "",
      timeout: 5000,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  mounted() {
    // Focus on top of the page when changing pages
    location.href = "#";
    location.href = "#app";
  },
  methods: {
    async sendFeedback() {
      // If type not set
      if (!this.type) {
        this.type = "-";
      }

      if (this.message) {
        if (this.message.length >= 5) {
          // Feedback object
          const feedback = { type: this.type, message: this.message };
          this.loading = true;
          try {
            // Add object to database
            //Add feedback to database (check 'client\src\FeedbackService.js' and 'server\routes\api\feedback.js' to see how this works)
            await FeedbackService.insertFeedback([feedback])
              .then((f) => {
                console.log(f);
              })
              .catch((e) => {
                console.log(e);
              });
            this.text = "Palaute vastaanotettu!";
            this.snackbar = true;
          } catch (err) {
            console.error(err.message);
          }
          this.loading = false;
          this.message = null;
        } else {
          this.text = "Kirjoita vähintään 5 merkkiä pitkä palaute!";
          this.snackbar = true;
        }
      } else {
        this.text = "Kirjoita vähintään 5 merkkiä pitkä palaute!";
        this.snackbar = true;
      }
    },
  },
};
</script>
