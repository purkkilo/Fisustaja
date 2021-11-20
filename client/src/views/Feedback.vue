<template>
  <!-- /feedback -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container style="width: 70%">
    <Header />
    <v-row
      v-bind:class="{
        'container-transparent': !$store.getters.getTheme,
        'container-transparent-dark': $store.getters.getTheme,
      }"
    >
      <v-col>
        <v-row v-if="error">
          {{ error }}
        </v-row>

        <div class="section" id="send-feedback">
          <v-row>
            <v-col v-if="prevRoute">
              <v-btn
                v-if="prevRoute.name"
                large
                rounded
                color="yellow"
                @click="$router.push({ path: prevRoute.path })"
                ><i class="material-icons left">history</i>Palaa takaisin</v-btn
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

          <v-row>
            <v-col md="4" offset-md="4">
              <v-btn
                block
                color="grey darken-2"
                @click="sendFeedback"
                :loading="loading"
                ><i class="material-icons left">note_add</i>Lähetä
                palaute</v-btn
              >
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
"use strict";
import M from "materialize-css";
import FeedbackService from "../FeedbackService";
import Header from "../components/layout/Header";

export default {
  name: "Feedback",
  components: {
    Header,
  },
  data() {
    return {
      prevRoute: null,
      message: null,
      type: "Bugi",
      type_options: ["Bugi", "Ehdotus", "Muu"],
      loading: false,
      error: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
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
            await FeedbackService.insertFeedback(feedback);
            M.toast({ html: "Palaute vastaanotettu!" });
          } catch (err) {
            console.error(err.message);
          }
          this.loading = false;
          this.message = null;
        } else {
          M.toast({ html: "Kirjoita vähintään 5 merkkiä pitkä palaute!" });
        }
      } else {
        M.toast({ html: "Kirjoita vähintään 5 merkkiä pitkä palaute!" });
      }
    },
  },
};
</script>
