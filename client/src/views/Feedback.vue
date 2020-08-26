<template>
  <!-- /feedback -->
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate style="margin-top:0" />
    <v-row class="container-transparent">
      <v-col>
        <v-row v-if="error">
          {{ error }}
        </v-row>

        <div class="section" id="send-feedback">
          <v-row>
            <v-col>
              <v-btn large rounded color="yellow" @click="$router.go(-3)"
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
                item-color="blue"
                v-model="type"
                :items="type_options"
                label="Palautteen tyyppi"
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="8" offset-md="2" class="grey lighten-2">
              <v-textarea
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
import { options_picker } from "../i18n";
import FeedbackService from "../FeedbackService";

export default {
  name: "Feedback",
  components: {
    Timedate: () => import("../components/layout/Timedate"),
    Header: () => import("../components/layout/Header"),
  },
  data() {
    return {
      message: null,
      type: null,
      type_options: ["Bugi", "Ehdotus", "Muu"],
      loading: false,
      error: null,
    };
  },
  created() {},
  mounted() {
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var tabs = document.querySelectorAll(".tabs");
    var instance = M.Tabs.init(tabs, options_picker);

    var collabs = document.querySelectorAll(".collapsible");
    var instances2 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    // Set "Bugi" to v-select as initial value
    this.type = this.type_options[0];
    //Check if user is logged in has admin status, update header
    this.checkLogin();

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
    //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
    checkLogin: function() {
      // If login token present --> user is logged in
      if (localStorage.getItem("jwt") != null) {
        this.$store.state.logged_in = true;
        let user = JSON.parse(localStorage.getItem("user"));
        // Check if user is admin
        //TODO safer way to check this than use localstorage?
        user.is_admin == true
          ? (this.$store.state.is_admin = true)
          : (this.$store.state.is_admin = false);
      } else {
        //Not logger in, so not admin either
        this.$store.state.logged_in = false;
        this.$store.state.is_admin = false;
      }
    },
  },
};
</script>
