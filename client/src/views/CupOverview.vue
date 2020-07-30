<template>
  <!-- /cup-overview -->  
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <div class="container">
    <Header />
    <Timedate />
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header" style="border:1px solid red;">
        <li class="collection-header" style="background: rgba(0,0,0,0);">
          <v-alert type="error">
            Korjaa seuraavat virheet:
          </v-alert>
        </li>
        <li class="collection-item" id="error" v-for="(error,index) in errors" v-bind:key="index">
          <p class="flow-text">{{ index+1}}. {{ error }}</p>
        </li>
      </ul>
    </div>
    <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="basil"
        grow
    >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#overview">Yleisnäkymä</v-tab>
        <v-tab href="#points" :disabled="!competitions.length">Cup pisteet</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
      <v-tab-item :value="'overview'">
        <v-container>
          <div v-if="!loading" class="container-transparent">
              <v-row class="section">
                <v-col v-if="cup">
                  <h1>{{cup.name}}, {{cup.year}}</h1>
                </v-col>
                <v-col v-else>
                  <p class="flow-text">Ei kuppia valittuna</p>
                </v-col>
              </v-row>
              <v-row v-if="competitions.length">
                <v-col md="10" offset-md="1">
                    <div v-if="competitions.length">
                        <table border=1 id="competitions-table" class="centered responsive-table tablearea highlight">
                            <caption class="flow-text">Cupin kilpailut</caption>
                            <thead class="title">
                            <tr>
                                <th>Kilpailun Päivämäärä</th>
                                <th>Nimi</th>
                                <th>Pistekerroin</th>
                                <th>Tila</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(competition, index) in competitions"
                                    v-bind:item = "competition"
                                    v-bind:index = "index"
                                    v-bind:key="competition._id"
                                >
                                    <th class="center-align" scope="row">{{ `${competition.start_date.date()}.${competition.start_date.month()+1}.${competition.start_date.year()} - ${competition.end_date.date()}.${competition.end_date.month()+1}.${competition.end_date.year()}` }}</th>  
                                    <td>{{ competition.name }}</td> 
                                    <td>x {{ competition.cup_points_multiplier }}</td> 
                                    <td>{{ competition.state }}</td>
                                    <td><v-btn tile color="primary" @click="pickCompetition(competition)"><i class="material-icons left">check</i>Valitse</v-btn></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <div v-if="!loading" class="col s6 center-align">
                            <h2 >Ei kilpailuja!</h2>
                            <router-link to="/register-comp">
                                <v-btn tile color="blue lighten-1"><i class="material-icons left">add_circle_outline</i>Luo kilpailu!</v-btn>
                            </router-link>
                        </div>
                        <h2 v-else-if="error" class="error">{{ error }}</h2>
                        <div v-else>
                            <h2>Ladataan kilpailuja...</h2>
                            <ProgressBarQuery />
                        </div> 
                    </div>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                    <h2 >Ei kilpailuja!</h2>
                    <router-link to="/register-comp">
                        <v-btn tile color="blue lighten-1"><i class="material-icons left">add_circle_outline</i>Luo kilpailu!</v-btn>
                    </router-link>
                </v-col>
              </v-row>
          </div>
          <div v-else>
            <v-row>
              <v-col>
                <h2>Valmistellaan Cuppia...</h2>
                <ProgressBarQuery />
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-tab-item>
      <v-tab-item :value="'points'">
        <v-container>
          <v-row>
            <v-col>
              <h1>Cupin pisteet</h1>
              <v-btn tile color="blue lighten-1" @click="calculateAll"><i class="material-icons left">add_circle_outline</i>Testaa consoliin</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
    "use strict";
    import Timedate from '../components/layout/Timedate';
    import Header from "../components/layout/Header";
    import ProgressBarQuery from '../components/layout/ProgressBarQuery';
    import CupService from '../CupService';
    import CompetitionService from '../CompetitionService';
    import moment from 'moment';

    export default {
        name: 'CupOverview',
        components: {
          Timedate,
          Header,
          ProgressBarQuery
        },
        data() {
            return {
              cup: null,
              competitions: [],
              loading: false,
              errors: [],
              tab: null,
            }
        },
        created() {
          // IF competition on localstorage
          if(localStorage.getItem('cup') != null) {
              // update from database
              this.refreshCup(localStorage.getItem('cup'));
          }
          else {
            console.log("No cup in localstorage!");
          }
        },
        mounted() {
          //Check if user is logged in has admin status, update header
          this.checkLogin();

          // IF competition on localstorage
          if(localStorage.getItem('cup') != null) {
              // update from database
              this.refreshCup(localStorage.getItem('cup'));
              this.$store.state.cup = this.cup;
          }
          else {
            console.log("No cup in localstorage!");
          }
        },
        methods: {
            // fetch/update competition from database
            calculateAll: function() {
              this.competitions.forEach(competition => {
                console.log(competition.results);
              });
            },
            async refreshCup(cup_id) {
              this.loading = true;
              this.errors = [];
              try {
                //Get competition from database (check 'client\src\CupService.js' and 'server\routes\api\cups.js' to see how this works)
                let cups = await CupService.getCup(cup_id);
                // IF competition found from database
                if(cups.length){
                    // Returns an array, get first result (there shouldn't be more than one in any case, since id's are unique)
                    //TODO make a test for this?
                    this.cup = cups[0];
                    // Update to vuex, Assing variables from vuex (see client/store/index.js)
                    this.$store.commit('refreshCup', cups[0]);
                    this.competitions = await CompetitionService.getCupCompetitions(cup_id);
                    // Convert dates to moment objects
                    this.competitions.forEach(competition => {
                        competition.start_date = moment(competition.start_date);
                        competition.end_date = moment(competition.end_date);
                    });
                }
                else {
                    this.cup = {"name": "Kilpailua ei löytynyt tietokannasta..."};
                }
              } catch(err) {
                console.log(err.message);
              }
              this.loading = false;
            },
            //Check if user is logged in has admin status, update values to vuex (Header.vue updates based on these values)
            checkLogin: function() {
                // If login token present --> user is logged in
                if(localStorage.getItem('jwt') != null){
                    this.$store.state.logged_in = true;
                    let user = JSON.parse(localStorage.getItem('user'));
                    // Check if user is admin
                    // NOTE safer way to check this than use localstorage?
                    user.is_admin == true ? this.$store.state.is_admin = true : this.$store.state.is_admin = false;
                }
                else {
                    //Not logger in, so not admin either
                    this.$store.state.logged_in = false;
                    this.$store.state.is_admin = false;
                }
            },
            pickCompetition: function(competition) {
                // Pick competition for the app to use
                //NOTE Store competition to vuex, redundant?
                this.$store.state.competition = competition;
                // Set competition._id to localstorage for database queries
                localStorage.setItem("competition", competition._id);
                // redirect to /overview
                this.$router.push({path: '/overview'});
            },
        },
    }
</script>