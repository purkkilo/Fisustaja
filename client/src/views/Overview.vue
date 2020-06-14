<template>
  <div class="container">
    <Timedate />
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header">
        <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
        <li class="collection-item flow-text" id="error" v-for="(error,index) in errors" v-bind:key="index">{{ index+1}}. {{ error }}</li>
      </ul>
    </div>
    <div v-if="!loading" class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Yleisnäkymä</h1></div>
      </div>
        <div class="row">
          <router-link to="/comp-settings">
            <div class="col s3"><a class="waves-effect waves-light grey btn" ><i class="material-icons left">tune</i>Määritykset</a></div>
          </router-link>
          <router-link to="/signing">
            <div class="col s3"><a class="waves-effect waves-light blue btn" ><i class="material-icons left">edit</i>Ilmoittautuminen</a></div>
          </router-link>
          <router-link to="/weighting">
            <div class="col s3"><a class="waves-effect waves-light blue darken-2 btn"><i class="material-icons left">fitness_center</i>Punnitus</a></div>
          </router-link>
          <router-link to="/results">
            <div class="col s3"><a class="waves-effect waves-light green btn"><i class="material-icons left">emoji_events</i>Tulokset</a></div>
          </router-link>            
        </div>
      <div class="divider"></div>
      <div class="section inputarea">
        <div class="col s12">
          <h4>Kilpailun nimi: {{ competition.name }}</h4>
          <h4>Tila: {{ competition.state }}</h4>
          <div><b>Todo:</b> Statseja, saadut kalat, kilpailun tilanne, kaavioita jne.</div>
          <div><b>Data:</b> {{ competition }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2>Valmistellaan kilpailua...</h2>
      <ProgressBarQuery />
    </div>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';
import CompetitionService from '../CompetitionService';
import ProgressBarQuery from '../components/layout/ProgressBarQuery';

export default {
    name: 'Overview',
    components: {
      Timedate,
      ProgressBarQuery
    },
    data() {
        return {
          competition: null,
          loading: false,
          competitions: [],
          errors: [],
        }
    },
    created() {
      if (this.$store.getters.getCompetition){
        this.competition = this.$store.getters.getCompetition;
      }
      else {
        this.competition = null;
      }
    },
    async mounted() {
      if (this.$store.getters.getCompetition){
        this.competition = this.$store.getters.getCompetition;
        // When selecting from fetched list, the _id is already there, no need to fetch again
        if(this.$store.getters.getCompetitionId){
          this.competition = this.$store.getters.getCompetition;
        }
        else {
          this.loading = true;
          this.errors = [];
          try {
            this.competitions = await CompetitionService.getCompetitions();
          } catch(err) {
            this.loading = false;
            this.errors.push(err);
          }

          if(this.competitions.length){
              // Selecting based on created competition_id
              this.competition = this.competitions.find(item => item.competition_id === this.$store.getters.getCreatedCompetitionID);
              //Store to vuex
              this.$store.state.competition = this.competition;
              this.loading = false;
              if(!this.competition){
                  this.competition = {"name": "Kilpailua ei löytynyt..."};
              }
    
          }
          else {
            this.loading = false;
            this.competition = {"name": "Kilpailuja ei tietokannassa"};
          }

        }
      }
      else {
          this.competition = {"name": "'this.$store.state.competition' tyhjä"};
      }
    },
    methods: {
      
    },
}
</script>