<template>
    <!-- /feedback -->  
    <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
    <div class="container">
      <Header />
      <Timedate/>
      <div class="container-transparent" style="margin-top:100px">
      <div v-if="error" class="row">
        {{error}}
      </div>

      <div class="section" id="send-feedback">
        <v-row>
          <v-col>
            <v-btn large rounded color="yellow" @click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</v-btn>
          </v-col>
        </v-row>
        <h1>Lähetä palautetta</h1>
        <p class="flow-text title black-text">Ilmoita bugeista, kehitysehdotuksista jne jne.</p>
        <v-container fluid>
          <v-row>
              <v-col class="d-flex" md="4" offset-md="4" >
                <v-select
                  item-color="blue"
                  v-model="type"
                  :items="type_options"
                  label="Palautteen tyyppi"
                  outlined
                ></v-select>
              </v-col>
          </v-row>
        </v-container>
          <v-row>
            <v-col md="8" offset-md="2">
              <div class="inputarea">
                <textarea maxlength="800" style="min-height:200px;padding:10px" class="flow-text" v-model="message" placeholder="Palaute tähän"></textarea>
              </div>
            </v-col>
          </v-row>
        <v-container>
          <v-row>
            <v-col md="4" offset-md="4">
              <v-btn block color="grey darken-2" @click="sendFeedback" :loading="loading"><i class="material-icons left">note_add</i>Lähetä palaute</v-btn>
            </v-col>
          </v-row>          
        </v-container>
      </div>
    </div>
  </div>
</template>
<script>
    "use strict";
    import M from "materialize-css";
    import { options_picker } from "../i18n";
    import "vue-select/dist/vue-select.css";
    import FeedbackService from '../FeedbackService';
    import Timedate from '../components/layout/Timedate';
    import Header from "../components/layout/Header";

    export default {
        name: 'Feedback',
        components: {
          Timedate,
          Header
        },
        data() {
            return {
              message: null,
              type: null,
              type_options: ["Bugi", "Ehdotus", "Muu"],
              loading: false,
              error: null,
            }
        },
      created() {
      },
        mounted() {
          //Init materialize elements
          M.AutoInit();
          /* eslint-disable no-unused-vars */
          var tabs = document.querySelectorAll(".tabs");
          var instance = M.Tabs.init(tabs, options_picker);

          var collabs = document.querySelectorAll(".collapsible");
          var instances2 = M.Collapsible.init(collabs, options_picker);
          /* eslint-enable no-unused-vars */
          // Set "Bugi" to vue-select as initial value
          this.type = this.type_options[0];
          //Check if user is logged in has admin status, update header
          this.checkLogin();
        },
        methods: {
          async sendFeedback() {
            // If type not set
            if(!this.type){
              this.type = "-";
            }

            if(this.message) {
              if(this.message.length >= 5) {
                  // Feedback object
                  const feedback = {type: this.type, message: this.message};
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
              }
              else {
                M.toast({ html: "Kirjoita vähintään 5 merkkiä pitkä palaute!" });
              }
            }
            else {
              M.toast({ html: "Kirjoita vähintään 5 merkkiä pitkä palaute!" });
            }
          },
          //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
          checkLogin: function() {
              // If login token present --> user is logged in
              if(localStorage.getItem('jwt') != null){
                  this.$store.state.logged_in = true;
                  let user = JSON.parse(localStorage.getItem('user'));
                  // Check if user is admin
                  // NOTE safer way to check this than use localstorage?
                  user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
              }
              else {
                  //Not logger in, so not admin either
                  this.$store.state.logged_in = false;
                  this.$store.state.is_admin = false;
              }
          },
        },
    }
</script>