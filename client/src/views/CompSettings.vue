<template>
  <!-- /comp-settings -->  
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Kilpailun määritykset</h1></div>
      </div>

      <v-row>
        <v-col md="6" offset-md="3">
          <router-link to="/overview">
            <v-btn large rounded color="primary"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</v-btn>
          </router-link>
        </v-col>

        <v-col md="3">
          <router-link to="/signing">
            <v-btn large rounded color="blue" class="white--text"><i class="material-icons left" >edit</i>Ilmoittautuminen</v-btn>
          </router-link>
        </v-col>
      </v-row>
      <!-- if this.loading === false, meaning app isn't loading competition data from database --> 
      <v-row v-if="!loading" id="settings-info" class="inputarea">
        <v-col> 
          <v-row>
            <v-col md="10" offset-md="1" class="scroll_table">
              <table class="striped centered responsive-table highlight">
                <caption class="flow-text">
                  Perustiedot
                </caption>
                <tr>
                  <th style="border:1px solid black;">Kilpailu</th>
                  <!-- competition.name would be this.competition.name if referenced on javascript etc. --> 
                  <td style="border:1px solid black;" class="center-align">
                    {{ competition.name }} ({{ competition.locality}})
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
                    x {{ competition.cup_points_multiplier }}
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
            </v-col>
          </v-row>

          <v-row class="fishes_summary">
            <v-col md="10" offset-md="1">
              <p class="flow-text">Kalojen määritykset</p>
            </v-col>
            <v-col md="10" offset-md="1" class="scroll_table">
              <table class="striped highlight centered responsive-table">
                <thead>
                  <tr>
                    <th>Kalalaji</th>
                    <th>Pistekerroin</th>
                    <th>Alamitta</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- for every fish in this.fish_specs, show info for that fish --> 
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
            </v-col>
          </v-row>
          <v-row>
            <v-col md="4" offset-md="4">
              <v-btn block color="red" @click="deleteCompetition(competition._id, false)" class="white--text"><i class="material-icons left">delete_forever</i>Poista Kilpailu</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <h2>Haetaan määrityksiä...</h2>
          <ProgressBarQuery />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
  <script>
    "use strict";
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
        // If localstorage has competition stored, refresh it's data
        if(localStorage.getItem('competition') != null) {
            let competition_id = localStorage.getItem('competition');
            this.refreshCompetition(competition_id);
        }
        else {
          console.log("No competition in localstorage!");
        }
      },
      mounted() {
        // Check login
        this.checkLogin();
        // If localstorage has competition stored, refresh it's data
        if(localStorage.getItem('competition') != null) {
            let competition_id = localStorage.getItem('competition');
            this.refreshCompetition(competition_id);
        }
        else {
          console.log("No competition in localstorage!");
        }
    
        // Focus on top of the page when changing pages
        location.href = "#";
        location.href = "#app";
      },
      methods: {
        //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
        checkLogin: function() {
            // If login token present --> user is logged in
            if(localStorage.getItem('jwt') != null){
                this.$store.state.logged_in = true;
                let user = JSON.parse(localStorage.getItem('user'));
                // Check if user is admin
                //TODO safer way to check this than use localstorage?
                user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
            }
            else {
                //Not logger in, so not admin either
                this.$store.state.logged_in = false;
                this.$store.state.is_admin = false;
            }
        },
        // Update competition data from database
        async refreshCompetition(competition_id) {
          this.loading = true;
          try {
            //Get competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works) 
            let competitions = await CompetitionService.getCompetition(competition_id);
            this.loading = false;
            // IF competition found from database
            if(competitions.length){
                // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
                //TODO make a test for this?
                this.competition = competitions[0];
                // Update to vuex, Assing variables from vuex (see client/store/index.js)
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
            console.error(err.message);
          }
        },
        // Delete competition
        async deleteCompetition(id, confirmed) {
          // If user clicked "OK" on confirmation box
            if(confirmed) {
                M.toast({html: "Poistetaan tietokannasta!"});
                try{
                    //Delete competition from database (check 'client\src\CompetitionService.js' and 'server\routes\api\competition.js' to see how this works) 
                    await CompetitionService.deleteCompetition(id);
                    // Competition deleted, remove it from localstorage and vuex
                    this.$store.state.competition = null;
                    localStorage.removeItem("competition");
                    // Redirect to dashboard
                    this.$router.push({path: '/dashboard'});
                } catch(err) {
                    this.error = err.message;
                }                
            }
            else {
                // demos for this -->  https://constkhi.github.io/vue-simple-alert/
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

      },
    };
</script>

