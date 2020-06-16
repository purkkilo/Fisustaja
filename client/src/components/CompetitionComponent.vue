<template>
  <div class="container">
    <h1>Kilpailut</h1>
    <div v-if="competitions.length">
      <table id="competitions" class="centered responsive-table tablearea highlight">
        <thead>
          <tr>
            <th>Kilpailun Päivämäärä</th>
            <th>Nimi</th>
            <th>Cup</th>
            <th>Tila</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(competition, index) in competitions"
            v-bind:item = "competition"
            v-bind:index = "index"
            v-bind:key="competition._id"
            v-on:dblclick="deleteCompetition(competition._id)"
          >
              <th style="border:1px solid black" class="center-align" scope="row">{{ `${competition.start_date.date()}.${competition.start_date.month()+1}.${competition.start_date.year()} - ${competition.end_date.date()}.${competition.end_date.month()+1}.${competition.end_date.year()}` }}</th>  
              <td style="border:1px solid black">{{ competition.name }}</td> 
              <td style="border:1px solid black">{{ competition.cup_name }}</td> 
              <td style="border:1px solid black">{{ competition.state }}</td>
              <td style="border:1px solid black"><a class="waves-effect waves-light btn" v-on:click="pickCompetition(competition)"><i class="material-icons left">check</i>Valitse</a></td>
          </tr>
        </tbody>
      </table>
      <h3 class="red-text">Voi poistaa kilpailun tuplaklikkaamalla riviä</h3>
    </div>
    <div v-else>
      <h2 v-if="!loading">Ei kilpailuja!</h2>
      <h2 v-else-if="error" class="error">{{ error }}</h2>
      <div v-else>
        <h2>Ladataan kilpailuja...</h2>
        <ProgressBarQuery />
      </div> 
    </div>
  </div>
</template>

<script>
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import CompetitionService from '../CompetitionService';
import M from 'materialize-css';
import moment from 'moment';

export default {
  name: 'CompetitionComponent',
  components: {
    ProgressBarQuery
  },
  data() {
    return {
      competitions: [],
      error: '',
      competition_input: null,
      loading: false,
    }
  },
  async created() {
    this.loading = true;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user["id"];
      this.competitions = await CompetitionService.getCompetitions(user_id);
      this.competitions.forEach(competition => {
        competition.start_date = moment(competition.start_date);
        competition.end_date = moment(competition.end_date);
      });
      this.loading = false;
    } catch(err) {
      this.error = err.message;
    }
  },
  mounted () {
    M.AutoInit()
  },
  methods: {
    pickCompetition: function(competition) {
        this.$store.state.competition = competition;
        this.$router.push({path: '/overview'});
    },// TEMP!
    async deleteCompetition(id) {
      M.toast({html: "Poistetaan tietokannasta!"});
      this.loading = true;
      try{
        await CompetitionService.deleteCompetition(id);
        const user = JSON.parse(localStorage.getItem('user'));
        const user_id = user["id"];
        this.competitions = await CompetitionService.getCompetitions(user_id);
        this.$store.state.competitions = this.competitions;
        this.loading = false;
      } catch(err) {
        this.error = err.message;
      } 
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app thead {
  background: rgba(255, 255, 255, 0.507);
  color:rgb(0, 0, 0);
}

.error {
  background: rgba(255, 0, 0, 0.377);
  border:2px solid red;
}
</style>
