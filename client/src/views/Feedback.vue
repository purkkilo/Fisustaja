<template>
    <div class="container">
      <Header />
      <Timedate/>
      <div class="container-transparent" style="margin-top:100px">
      <div v-if="error" class="row">
        {{error}}
      </div>

      <div class="section" id="send-feedback">
        <div class="row">
            <a class="waves-effect waves-light yellow black-text btn col s2 push-s1" v-on:click="$router.go(-1)"><i class="material-icons left">history</i>Palaa takaisin</a>
        </div>
        <h1>Lähetä palautetta</h1>
        <p class="flow-text title black-text">Ilmoita bugeista, kehitysehdotuksista jne jne.</p>
        <div class="row inputarea">
          <span class="flow-text black-text col s4 push-s1">Palautteen tyyppi <br>(valitse tai kirjoita oma): </span>
          <v-select
            class="flow-text col s4 push-s1"
            v-model="type"
            taggable
            push-tags
            :options="type_options"
          />
        </div>
        <div class="inputarea">
          <textarea maxlength="800" style="min-height:200px;" class="flow-text" v-model="message" placeholder="Palaute tähän"></textarea>
        </div>
        <div class="section row">
          <a class="col s4 push-s4 waves-effect waves-light grey darken-2 btn-large" v-on:click="sendFeedback"><i class="material-icons left">note_add</i>Lähetä palaute</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
      this.type = this.type_options[0];
      this.checkLogin();
    },
    methods: {
      async sendFeedback() {

        if(!this.type){
          this.type = "-";
        }
        const feedback = {type: this.type, message: this.message}
        try {
          await FeedbackService.insertFeedback(feedback);
          M.toast({ html: "Palaute vastaanotettu!" });
          this.feedback = await FeedbackService.getFeedback();
        } catch (err) {
          this.errors.push = err.message;
        }
        this.message = null;
      },
      checkLogin: function() {
          if(localStorage.getItem('jwt') != null){
              this.$store.state.logged_in = true;
              let user = JSON.parse(localStorage.getItem('user'));
              user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
          }
          else {
              this.$store.state.logged_in = false;
              this.$store.state.is_admin = false;
          }
      },
    },
}
</script>