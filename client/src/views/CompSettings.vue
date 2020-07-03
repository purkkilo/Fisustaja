<template>
  <div class="container">
    <Header />
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Kilpailun määritykset</h1></div>
      </div>

      <div class="row">

        <div class="col s4 push-s4">
          <router-link to="/overview">
            <a class="waves-effect waves-light btn"
              ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a
            >
          </router-link>
        </div>

        <div class="col s4 push-s4">
          <router-link to="/signing">
            <a class="waves-effect waves-light blue btn" >
              <i class="material-icons left">edit</i>Ilmoittautuminen
            </a>
          </router-link>
        </div>

      </div>

      <div v-if="!loading" id="settings-info" class="section inputarea">
        <div id="summary">
          <div class="basic_summary row section">
            <div class="center-align col s8 push-s2">
              <table class="striped centered responsive-table highlight">
                <caption class="flow-text">
                  Perustiedot
                </caption>
                <tr>
                  <th style="border:1px solid black;">Kilpailu</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.name }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Cup</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.cup_name }}
                  </td>
                </tr>
                    <tr>
                      <th style="border:1px solid black;">Voittajan Cup sijoittumispisteet</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_placement_points }}
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;">Kilpailijoiden Cup osallistumispisteet</th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ competition.cup_participation_points }}
                      </td>
                    </tr>
                <tr>
                  <th style="border:1px solid black;">
                    Kilpailun pistekerroin
                  </th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.cup_points_multiplier }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Aloituspäivä</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ formatted_start_date }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Lopetuspäivämäärä</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ formatted_end_date }}
                  </td>
                </tr>
                <tr>
                  <th style="border:1px solid black;">Kilpailuaika</th>
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.start_time }} -
                    {{ competition.end_time }}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="fishes_summary row">
            <div class="center-align">
              <p class="flow-text">Kalojen määritykset</p>
            </div>
            <div class="col s8 push-s2">
              <table class="striped highlight centered responsive-table">
                <thead>
                  <tr>
                    <th>Kalalaji</th>
                    <th>Pistekerroin</th>
                    <th>Alamitta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fish, index) in fish_specs" :key="index">
                    <th style="border:1px solid black;" scope="row">
                      {{ fish.name }}
                    </th>
                    <td style="border:1px solid black;">
                      x {{ fish.multiplier }}
                    </td>
                    <td style="border:1px solid black;">{{ fish.minsize }} cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="row section center-align">
              <a v-on:click="deleteCompetition(competition._id, false)" class="waves-effect waves-light red btn white-text col s4 push-s4">
                  <i class="material-icons left">delete_forever</i>
                  Poista Kilpailu
              </a>
          </div>
        </div>
      </div>
      <div v-else>
        <h2>Haetaan määrityksiä...</h2>
        <ProgressBarQuery />
      </div>
    </div>
  </div>
</template>
<script>
import M from "materialize-css";
import Timedate from "../components/layout/Timedate";
import Header from "../components/layout/Header";
import moment from 'moment';
import CompetitionService from "../CompetitionService";
import ProgressBarQuery from '../components/layout/ProgressBarQuery';

export default {
  name: "CompSettings",
  components: {
    Timedate,
    ProgressBarQuery,
    Header
  },
  data() {
    return {
      competition: null,
      fish_specs: null,
      start_date: null,
      formatted_start_date: null,
      end_date: null,
      formatted_end_date: null,
      loading: false,
    };
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
      try {
        let competitions = await CompetitionService.getCompetition(competition_id);
        this.loading = false;
        if(competitions.length){
            this.competition = competitions[0];
            this.$store.commit('refreshCompetition', competitions[0]);
            this.fish_specs = this.$store.getters.getCompetitionFishes;
            this.start_date = moment(this.competition.start_date);
            this.end_date = moment(this.competition.end_date);
            this.formatted_start_date = `${this.start_date.date()}.${this.start_date.month()+1}.${this.start_date.year()}`;
            this.formatted_end_date = `${this.end_date.date()}.${this.end_date.month()+1}.${this.end_date.year()}`;
        }
        else {
          console.log("No competition found on database...");
        }
      } catch(err) {
        this.loading = false;
        console.log(err.message);
      }
    },
    async deleteCompetition(id, confirmed) {
        if(confirmed) {
            M.toast({html: "Poistetaan tietokannasta!"});
            try{
                await CompetitionService.deleteCompetition(id);
                this.$store.state.competition = null;
                localStorage.removeItem("competition");
                this.$router.push({path: '/dashboard'});
            } catch(err) {
                this.error = err.message;
            }                
        }
        else {
            this.$confirm("Oletko varma?", "Poista kilpailu", 'question')
            .then((r) => {
                if(r) {
                    this.deleteCompetition(id, r);
                }
            })
            .catch((error) => {
                if(error){
                    console.error(error);
                }
            });
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
};
</script>

