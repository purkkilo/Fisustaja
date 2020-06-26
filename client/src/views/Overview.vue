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
          <h4><b>{{ competition.name }}</b></h4>
          <h4>Päivämäärä: {{ formatted_start_date }} - {{ formatted_end_date }}</h4>
          <h4>Kilpailuaika: <b>{{ competition.start_time }} - {{ competition.end_time }}</b></h4>
          <h4>Tila: <b>{{ competition.state }}</b></h4>
          <h4>Ilmoittautuneita: <b>{{ competition.signees.length }} kpl</b></h4>
          <h4 v-if="competition.signees.length">Vielä vesillä: <b>{{ (competition.signees.length-$store.getters.getFinishedSignees.length)/competition.signees.length*100 }}%</b> ({{ competition.signees.length-$store.getters.getFinishedSignees.length }} / {{ competition.signees.length }})</h4>
          <h4 v-else>Ketään ei vielä vesillä!</h4>
          <h4 v-if="competition.signees.length">Saalista saanut: <b>{{ $store.getters.getPointSignees.length/competition.signees.length*100 }}%</b> ({{ $store.getters.getPointSignees.length }} / {{ competition.signees.length }})</h4>
          <h4>Kalaa saatu yhteensä: <b>{{ competition.total_weights/1000 }} kg</b></h4>
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
import moment from 'moment';

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
          formatted_start_date: null,
          formatted_end_date: null,
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
                let start_date = moment(this.competition.start_date);
                let end_date = moment(this.competition.end_date);
                this.formatted_start_date = `${start_date.date()}.${start_date.month()+1}.${start_date.year()}`;
                this.formatted_end_date = `${end_date.date()}.${end_date.month()+1}.${end_date.year()}`;
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