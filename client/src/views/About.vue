<template>
  <div class="about container">
    <Timedate />
    <div v-if="error" class="row">
      {{error}}
    </div>

    <div class="col s12">
      <ul class="tabs">
        <li class="tab col s3">
          <a class="active" href="#send-feedback">Lähetä palautetta</a>
        </li>
        <li class="tab col s3">
          <a href="#feedback">Saatu palaute</a>
        </li>
      </ul>
    </div>

    <div class="section" id="send-feedback">
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
      <div class="section row title">
        <a class="col s4 push-s4 waves-effect waves-light grey btn-large" v-on:click="sendFeedback"><i class="material-icons left">note_add</i>Lähetä palaute</a>
      </div>
    </div>

    <div class="section" id="feedback">
      <h1>Saatu Palaute</h1>
        <div class="" id="feedback" v-if="feedback.length">
          <ul
            id="fish_weights"
          >
            <li
              v-for="(feedback, index) in feedback"
              :key="index"
            >
            
            <div class="col s12 m8 offset-m2 l6 offset-l3">
                <div class="card-panel grey lighten-5 z-depth-1">
                  <p class="flow-text">#{{index+1}} {{feedback.type}} <i class="material-icons">report</i></p>
                  <div class="row valign-wrapper">
                    <div class="col s2">
                      <img src="../assets/logo.png" alt="" class="circle responsive-img"> <!-- notice the "circle" class -->
                    </div>
                    <div class="col s10">
                      <p class="black-text flow-text " style="word-break: break-all;">
                        {{ feedback.message }}
                      </p>
                    </div>
                  </div>
                  <div class="row section center-align">
                    <a v-on:click="deleteFeedback(feedback._id)" class="waves-effect waves-light yellow btn black-text col s4 push-s4">
                      <i class="material-icons left">done_outline</i>
                      Ratkaise
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <div class="title">
            <p class="flow-text">Palautetta ei ole annettu vielä!</p>
          </div>
        </div>

    </div>

  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';
import M from "materialize-css";
import { options_picker } from "../i18n";
import "vue-select/dist/vue-select.css";
import FeedbackService from '../FeedbackService';

export default {
    name: 'About',
    components: {
      Timedate
    },
    data() {
        return {
          message: null,
          type: null,
          type_options: ["Bugi", "Ehdotus", "Muu"],
          loading: false,
          error: null,
          feedback: [],
        }
    },
  async created() {
    this.loading = true;
    try {
      this.feedback = await FeedbackService.getFeedback();
      this.loading = false;
    } catch(err) {
      this.error = err.message;
    }
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
      var elem = document.querySelectorAll(".tabs")[0];
      this.tabs = M.Tabs.getInstance(elem);
      this.type = this.type_options[0];
    },
    methods: {
      async sendFeedback() {
        console.log(this.type);
        console.log(this.message);

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
      async deleteFeedback(id) {
        M.toast({html: "Palaute ratkaistu!"});
        this.loading = true;
        try{
          await FeedbackService.deleteFeedback(id);
          this.feedback = await FeedbackService.getFeedback();
          this.loading = false;
        } catch(err) {
          this.error = err.message;
        } 
      }
    },
}
</script>