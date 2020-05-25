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
          <div class="col s12 center-align"><h1>{{ competition.competition_name }}</h1></div>
      </div>
      <div class="divider"></div>
      <div class="section inputarea">
        <div class="col s12 center-align">
          <h4>Infoa</h4>
          <div>{{competition}}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="section">
        <div class="row">
          <router-link to="/comp-settings">
            <div class="col s3 center-align"><a class="waves-effect waves-light blue lighten-1 btn-large" ><i class="material-icons left">tune</i>Määritykset</a></div>
          </router-link>
          <router-link to="/signing">
            <div class="col s3 center-align"><a class="waves-effect waves-light blue lighten-1 btn-large" ><i class="material-icons left">edit</i>Ilmoita</a></div>
          </router-link>
          <router-link to="/weighting">
            <div class="col s3 center-align"><a class="waves-effect waves-light blue lighten-1 btn-large"><i class="material-icons left">fitness_center</i>Punnitus</a></div>
          </router-link>
          <router-link to="/results">
            <div class="col s3 center-align"><a class="waves-effect waves-light blue lighten-1 btn-large"><i class="material-icons left">emoji_events</i>Tulokset</a></div>
          </router-link>            
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
    async created() {
      if (this.$store.state.competition){
        this.competition = this.$store.state.competition
        // When selecting from fetched list, the _id is already there, no need to fetch again
        if(this.$store.state.competition._id){
          console.log(`this.competition._id = ${this.competition._id}`);
          this.competition = this.$store.state.competition;
        }
        else {
          console.log(`else`);
          this.loading = true;
          this.errors = [];
          try {
            this.competitions = await CompetitionService.getCompetitions();
          } catch(err) {
            this.loading = false;
            this.errors.push(err);
          }

          if(this.competitions.length){
              // To get the _id, if you just created the competition in RegisterComp
              console.log(`TODO! Get _id somehow better than this...`);
              this.competition = this.competitions[this.competitions.length - 1];
              //Store to vuex
              this.$store.state.competition = this.competition;
              this.loading = false;
              if(!this.competition){
                  this.competition = {"competition_name": "Kilpailua ei löytynyt..."};
              }
    
          }
          else {
            this.loading = false;
            this.competition = {"competition_name": "Kilpailuja ei tietokannassa"};
          }

        }
      }
      else {
          this.competition = {"competition_name": "'this.$store.state.competition' tyhjä"};
      }
    },
    mounted() {

    },
    methods: {
      
    },
}
</script>