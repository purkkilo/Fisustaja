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
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import CompetitionService from '../CompetitionService';


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
          errors: [],
        }
    },
    created() {
      if(localStorage.getItem('competition') != null) {
          let competition_id = localStorage.getItem('competition');
          this.refreshCompetition(competition_id);
      }
      else {
        console.log("No competition in localstorage!");
      }
    },
    mounted() {
      this.checkLogin();
      if(localStorage.getItem('competition') != null) {
          let competition_id = localStorage.getItem('competition');
          this.refreshCompetition(competition_id);
      }
      else {
        console.log("No competition in localstorage!");
      }
    },
    methods: {
        async refreshCompetition(competition_id) {
          this.loading = true;
          this.errors = [];
          try {
            let competitions = await CompetitionService.getCompetition(competition_id);
            if(competitions.length){
                this.competition = competitions[0];
                this.$store.commit('refreshCompetition', competitions[0]);
            }
            else {
                this.competition = {"name": "Kilpailua ei löytynyt tietokannasta..."};
            }
            this.loading = false;
          } catch(err) {
            this.loading = false;
            console.log(err.message);
          }
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