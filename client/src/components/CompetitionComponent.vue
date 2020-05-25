<template>
  <div class="container">
    <h1>Competitions</h1>
    <div class="row inputarea">
      <label class="col s4 flow-text" for="create-post">Kilpailun nimi</label>
      <input class="col s4" type="text" id="competition_input" v-model="competition_input" placeholder="Nimi!">
      <a class="waves-effect waves-light btn col s4" v-on:click="submitCompetition"><i class="material-icons left">check</i>Lisää kilpailu</a>
    </div>
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
              <th style="border:1px solid black" class="center-align" scope="row">{{ competition.date_of_competition }}</th>  
              <td style="border:1px solid black">{{ competition.competition_name }}</td> 
              <td style="border:1px solid black">{{ competition.cup_name }}</td> 
              <td style="border:1px solid black">{{ competition.state }}</td>
              <td style="border:1px solid black"><a class="waves-effect waves-light btn" v-on:click="pickCompetition"><i class="material-icons left">check</i>Valitse</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="inputarea">
      <h2 v-if="!loading">Ei kilpailuja!</h2>
      <h2 v-else-if="error" class="error">{{ error }}</h2>
      <h2 v-else>Ladataan kilpailuja...</h2>
    </div>
  </div>
</template>

<script>
import CompetitionService from '../CompetitionService';
import M from 'materialize-css';

export default {
  name: 'CompetitionComponent',
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
      this.competitions = await CompetitionService.getCompetitions();
      this.loading = false;
    } catch(err) {
      this.error = err.message;
    }
  },
  mounted () {
    M.AutoInit()
  },
  methods: {
    pickCompetition: function() {
        console.log("Todo: Hae valitun kilpailun tiedot tietokannasta, siirry yleisnäkymään");
    },
    // Nice
    async submitCompetition() {
      M.toast({html: "Lisätään tietokantaan!"});
      this.loading = true;
      this.competitions = [];
      if(this.competition_input) {
        const competition = {
          "competition_name": this.competition_input,
          "cup_name": "Fake Cup 2",
          "cup_multiplier": 1,
          "date_of_competition": "30.09.2029",
          "start_of_competition": "12:00",
          "end_of_competition": "20:00",
          "fishes": [
            {
              "name": "Ahven",
              "minsize": "999",
              "multiplier": "00"
            },
            {
              "name": "Hauki",
              "minsize": "109",
              "multiplier": "550"
            }
          ]
        }
        try{
          await CompetitionService.insertCompetition(competition);
          this.competitions = await CompetitionService.getCompetitions();
          this.loading = false;
        } catch(err) {
          this.error = err.message;
        } 
      }
    },
    async deleteCompetition(id) {
      M.toast({html: "Poistetaan tietokannasta!"});
      this.loading = true;
      try{
        await CompetitionService.deleteCompetition(id);
        this.competitions = await CompetitionService.getCompetitions();
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
