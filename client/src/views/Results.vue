<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Tulokset</h1></div>
      </div>
      <div class="row">

        <div class="col s4">
          <router-link to="/weighting">
            <a class="waves-effect waves-light blue darken-2 btn"
              ><i class="material-icons left">fitness_center</i>Punnitus</a
            >
          </router-link>
        </div>

        <div class="col s4">
          <router-link to="/overview">
          <a class="waves-effect waves-light btn"
            ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a
          >
          </router-link>
        </div>

        <div class="col s4" v-if="results.length || team_results.length || biggest_fishes_results.length || biggest_amounts_results">
          <a v-on:click="saveAllAsPDF" class="waves-effect waves-light blue darken-4 btn-large"
            ><i class="material-icons left">picture_as_pdf</i>Lataa kaikki taulukot</a
          >
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s2">
              <a class="active" href="#stats">Tilastoja</a>
            </li>
            <li class="tab col s2">
              <a href="#normal-competition">Normaalikilpailu</a>
            </li>
            <li v-if="isTeamCompetition" class="tab col s2">
              <a href="#team-competition">Tiimikilpailu</a>
            </li>
            <li v-else class="tab col s2 disabled">
              <a href="#team-competition">Ei Tiimikilpailua</a>
            </li>
            <li class="tab col s3">
              <a href="#biggest-fishes">Suurimmat Kalat</a>
            </li>
            <li class="tab col s3">
              <a href="#biggest-fish-amounts">Suurimmat Kalasaaliit</a>
            </li>
          </ul>
        </div>
        <div id="stats" class="col s12 inputarea">
          <div class="section row" style="margin-bottom: 50px;">
            <div class="col s6">
              <canvas id="fishesChart"></canvas>
            </div>
            <div class="col s6">
              <canvas id="signeesChart"></canvas>
            </div>
            <div class="divider black" style="margin:20px"></div>
          </div>
          <div class="section" v-if="competition">
              <div class="fishes_summary row">
                <div class="col s8 push-s2">
                  <table
                    id ="fish-weights-table"
                    class="striped highlight centered responsive-table"
                  >
                    <thead>
                      <tr>
                        <th>Kalalaji</th>
                        <th>Pistekerroin</th>
                        <th>Alamitta</th>
                        <th>Punnittu</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(fish, index) in calculated_fish_weights"
                        :key="index"
                      >
                        <th style="border:1px solid black;" scope="row">
                          {{ fish.name }}
                        </th>
                        <td style="border:1px solid black;">
                          x {{ fish.multiplier }}
                        </td>
                        <td style="border:1px solid black;">
                          {{ fish.minsize }} cm
                        </td>
                        <td style="border:1px solid black;">
                          {{ fish.weights }} g
                        </td>
                      </tr>
                      <tr>
                        <th scope="row"></th>
                        <th></th>
                        <th style="border:1px solid black;">
                          Saalista yhteensä
                        </th>
                        <td style="border:1px solid black;">
                          {{
                            Math.round(
                              (calculated_total_weights /
                                1000 +
                                Number.EPSILON) *
                                100
                            ) / 100
                          }}
                          kg
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style="margin:30px"></div>
              <div class="row">
                <table
                  id ="misc-table"
                  class="striped centered responsive-table highlight col s8 push-s2"
                >
                  <tr>
                    <th style="border:1px solid black;" class="center-align">
                      <b>Ilmoittautuneita yhteensä</b>
                    </th>
                    <td style="border:1px solid black;" class="center-align">
                      {{ signees.length }} venettä
                    </td>
                  </tr>
                  <tr>
                    <th style="border:1px solid black;" class="center-align">
                      <b>Saalista saanut</b>
                    </th>
                    <td style="border:1px solid black;" class="center-align"><!--TODO pyöristykset-->
                      {{ Math.round($store.getters.getPointSignees.length/competition.signees.length*100*100)/100 }}% ({{ $store.getters.getPointSignees.length }} / {{ signees.length }})
                    
                    </td>
                  </tr>
                </table>
              </div>
          </div>
          <div class="row">
            <a v-on:click ="saveStatsAsPDF(`Tilastoja`)" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
        <div id="normal-competition" class="col s12 inputarea active">
          <div class="section" >
            <div class="row" v-if="results.length">
              <table
                id="normal-table"
                class="highlight centered responsive-table tablearea"
              >
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Sijoitus</th>
                    <th>Nro</th>
                    <th>Kapteeni</th>
                    <th>Paikkakunta</th>
                    <th>Tulos</th>
                    <th>Cup sij. pisteet</th>
                    <th>Cup osal. pisteet</th>
                    <th>Cup pisteet yht.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in results" :key="index">
                    <th class="center-align" style="border:1px solid black">
                      {{ signee.placement }}.
                    </th>
                    <td style="border:1px solid black">
                      {{ signee.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.captain_name }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.locality }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.total_points }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.cup_placement_points }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.cup_participation_points }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.cup_points_total }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p v-if="!loading" class="flow-text">Ei tuloksia, vielä...</p>
              <div v-else>
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </div>
            </div>
          </div>
          <div class="row" v-if="results.length">
            <a v-on:click ="saveAsPDF(`Normaalikilpailun tulokset`, '#normal-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
        <div id="team-competition" class="col s12 inputarea" v-if="isTeamCompetition">
          <div class="section">
            <div class="row" v-if="team_results.length">
              <table
                id="team-table"
                class="highlight centered responsive-table tablearea"
              >
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Sijoitus</th>
                    <th>Tiimi</th>
                    <th>Jäsen 1</th>
                    <th>Jäsen 2</th>
                    <th>Jäsen 3</th>
                    <th>Pisteet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(team, index) in team_results" :key="index">
                    <th class="center-align" style="border:1px solid black">
                      {{ index + 1 }}.
                    </th>
                    <td style="border:1px solid black">{{ team.name }}</td>
                    <td style="border:1px solid black">
                      {{ team.captain_name_1 }}
                    </td>
                    <td style="border:1px solid black">
                      {{ team.captain_name_2 }}
                    </td>
                    <td style="border:1px solid black">
                      {{ team.captain_name_3 }}
                    </td>
                    <td style="border:1px solid black">{{ team.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p v-if="!loading" class="flow-text">Ei tuloksia, vielä...</p>
              <div v-else>
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </div>
            </div>
          </div>
          <div class="row" v-if="team_results.length">
            <a v-on:click ="saveAsPDF(`Tiimikilpailun tulokset`, '#team-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
        <div id="biggest-fishes" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <div class="col s3 push-s4">
                <v-select
                  class="flow-text title"
                  label="name"
                  placeholder="Valitse näytettävä kalalaji"
                  v-on:input= "calculateBiggestFishes"
                  v-model="selected_biggest_fish"
                  :options="fish_names"
                />
              </div>
            </div>
            <div class="row" v-if="biggest_fishes_results.length">
              <table
                id="biggest-fishes-table"
                class="highlight centered responsive-table tablearea"
              >
                <caption v-if="results_found_fishes" class="center-align flow-text">
                  Suurimmat kalat ({{ selected_biggest_fish }} {{ results_found_fishes }})
                </caption>
                <caption v-else class="center-align flow-text">
                  Suurimmat kalat ({{ selected_biggest_fish }})
                </caption>
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th v-if="selected_biggest_fish == 'Voittajat'">Kalalaji</th>
                    <th v-else>Sijoitus</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(fish, index) in biggest_fishes_results" :key="index">
                    <th v-if="selected_biggest_fish == 'Voittajat'" class="center-align" style="border:1px solid black">
                      {{ fish.name }}
                    </th>
                    <th v-else class="center-align" style="border:1px solid black">
                      {{ index+1 }}.
                    </th>
                    <td style="border:1px solid black">
                      {{ fish.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ fish.captain_name }}
                    </td>
                    <td style="border:1px solid black">{{ fish.weight }} g</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p v-if="!loading" class="flow-text">Ei tuloksia, vielä...</p>
              <div v-else>
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </div>
            </div>
          </div>
          <div class="row" v-if="biggest_fishes_results.length">
            <a v-on:click ="saveAsPDF(`Suurimmat kalat`, '#biggest-fishes-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
        <div id="biggest-fish-amounts" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <div class="col s3 push-s4">
                <v-select
                  class="flow-text title"
                  label="name"
                  placeholder="Valitse näytettävä kalalaji"
                  v-model="selected_biggest_amount"
                  v-on:input="calculateBiggestAmounts"
                  :options="fish_names"
                />
              </div>
            </div>
            <div class="row" v-if="biggest_amounts_results.length">
              <table
                id="biggest-amounts-table"
                class="highlight centered responsive-table tablearea"
              >
                <caption v-if="results_found_amounts" class="center-align flow-text">
                  Suurimmat kalasaaliit ({{ selected_biggest_amount }} {{ results_found_amounts }})
                </caption>
                <caption v-else class="center-align flow-text">
                  Suurimmat kalasaaliit ({{ selected_biggest_amount }})
                </caption>
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th v-if="selected_biggest_amount == 'Voittajat'">Kalalaji</th>
                    <th v-else>Sijoitus</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(result, index) in biggest_amounts_results"
                    :key="index"
                  >
                    <th v-if="selected_biggest_amount == 'Voittajat'" class="center-align" style="border:1px solid black">
                      {{ result.name }}
                    </th>
                    <th v-else class="center-align" style="border:1px solid black">
                      {{ index+1 }}.
                    </th>
                    <td style="border:1px solid black">
                      {{ result.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ result.captain_name }}
                    </td>
                    <td style="border:1px solid black">
                      {{ result.weight }} g
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p v-if="!loading" class="flow-text">Ei tuloksia, vielä...</p>
              <div v-else>
                <h2>Päivitetään tuloksia tietokannasta...</h2>
                <ProgressBarQuery />
              </div>
            </div>
          </div>
          <div class="row" v-if="biggest_amounts_results.length">
            <a v-on:click ="saveAsPDF(`Suurimmat kalasaaliit`, '#biggest-amounts-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
      </div>
      <div v-if="competition" class="row">
        <a v-if="!loading" v-on:click="refreshCompetition(competition._id)" class="waves-effect waves-light grey darken-4 btn-large">
          <i class="material-icons left">update</i>Päivitä tulokset
        </a>
        <div v-else>
          <h2>Päivitetään tuloksia tietokannasta...</h2>
          <ProgressBarQuery />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Timedate from "../components/layout/Timedate";
import M from "materialize-css";
import { options_picker } from "../i18n";
import "vue-select/dist/vue-select.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import CompetitionService from "../CompetitionService";
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import Chart from 'chart.js';
import 'chartjs-plugin-labels';

export default {
  name: "Results",
  components: {
    Timedate,
    ProgressBarQuery
  },
  data() {
    return {
      loading: false,
      signees: [],
      fish_names: [],
      results: [],
      team_results: [],
      biggest_fishes: {},
      biggest_fishes_results: [],
      selected_biggest_fish: null,
      biggest_amounts: {},
      biggest_amounts_results: [],
      selected_biggest_amount: null,
      results_found_fishes: "",
      results_found_amounts: "",
      competition: null,
      isTeamCompetition: true,
      calculated_total_weights: null,
      calculated_fish_weights: null,
    };
  },
  mounted() {
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var tabs = document.querySelectorAll(".tabs");
    var instance = M.Tabs.init(tabs, options_picker);
    /* eslint-enable no-unused-vars */
    var elem = document.querySelectorAll(".tabs")[0];
    this.tabs = M.Tabs.getInstance(elem);
    this.checkLogin();
    if(localStorage.getItem('competition') != null) {
      let competition_id = localStorage.getItem('competition');
      this.refreshCompetition(competition_id);
    }
  },
  methods: {
     async refreshCompetition(competition_id) {
      this.loading = true;
      this.fish_names = [];
      try {
        let competitions = await CompetitionService.getCompetition(competition_id);
        if(competitions.length){
            this.competition = competitions[0];
            this.$store.commit('refreshCompetition', this.competition);
            this.isTeamCompetition = this.$store.getters.isTeamCompetition;
            this.signees = this.$store.getters.getResultSignees;
            this.biggest_fishes = this.$store.getters.getBiggestFishes;
            this.biggest_amounts = this.$store.getters.getBiggestAmounts;
            this.calculateTotalWeights();
            this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
            let temp_fish_names = this.$store.getters.getCompetitionFishes;
            this.fish_names.push("Voittajat");
            temp_fish_names.forEach(fish => {
              this.fish_names.push(fish.name);
            });
            this.selected_biggest_amount = this.selected_biggest_fish = "Voittajat";
            this.calculateAll();
            this.drawCharts();
        }
        else {
          this.signees = [];
          this.biggest_fishes = [];
          this.biggest_amounts = [];
          console.log("No competition found on database...");
        }
        this.loading = false;
      } catch(err) {
        this.loading = false;
        console.log(err.message);
      }
    },
    drawCharts: function() {
        let temp_names = [...this.fish_names];
        temp_names.shift();
        let temp_weights = [];
        let colors = [];
        this.calculated_fish_weights.forEach(fish => {
          temp_weights.push(fish.weights);
          colors.push(fish.color);
        });

        let signee_data = [];
        let point_signees = this.$store.getters.getPointSignees.length
        let no_points_signees = this.signees.length - point_signees;
        signee_data.push(point_signees);
        signee_data.push(no_points_signees);

        const fishes_chart_data = {
            type: 'doughnut',
            data: {
              labels: temp_names,
              datasets: [
                {
                  label: "Paino (g)",
                  backgroundColor: colors,
                  data: temp_weights
                }
              ]
            },
            options: {
              plugins:{
                  labels: {
                    render: function (args) {
                      return args.value + ' g';
                    },
                    fontSize: 14,
                    fontStyle: 'bold',
                    fontColor: '#000',
                    fontFamily: '"Lucida Console", Monaco, monospace'
                  }
              },
              title: {
                display: true,
                text: 'Kaloja saatu yhteensä',
                fontSize: 28
              }
            }
        };
        
        const signee_chart_data = {
            type: 'pie',
            data: {
              labels: ['Kyllä', 'Ei saalista'],
              datasets: [
                {
                  label: "Lukumäärä (kpl)",
                  backgroundColor: ["#7fbf7f","#ff7f7f"],
                  data: signee_data
                }
              ]
            },
            options: {
              plugins:{
                  labels: {
                    render: 'percentage',
                    fontSize: 14,
                    fontStyle: 'bold',
                    fontColor: '#000',
                    fontFamily: '"Lucida Console", Monaco, monospace'
                  }
              },
              title: {
                display: true,
                text: 'Saalista saaneita',
                fontSize: 28
              }
            }
        };
        /* eslint-disable no-unused-vars */
        var fishes_ctx = document.getElementById('fishesChart').getContext('2d');
        var fishesChart = new Chart(fishes_ctx, fishes_chart_data);
        var signees_ctx = document.getElementById('signeesChart').getContext('2d');
        var signeesChart = new Chart(signees_ctx, signee_chart_data);
        /* eslint-disable no-unused-vars */
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
    onlyUnique: function(value, index, self) {
      return self.indexOf(value) === index;
    },
    calculateAll: function() {
      this.calculateNormalResults();
      if(this.isTeamCompetition){
        this.calculateTeamResults();
      }
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
    },
    calculateNormalResults: function() {
      const competition = this.competition;
      const cup_points_multiplier = competition.cup_points_multiplier;
      let cup_placement_points = competition.cup_placement_points;
      const cup_participation_points = competition.cup_participation_points;
      let last_points = 0;
      let tied_competitors = 0;
      let placement = 1;
      let cup_temp_points;
      let cup_points_total;

      this.results = [];
      this.signees.forEach((signee) => {
        cup_points_total = 0;
        // First competitor
        if (!this.results.length) {
          if(signee.total_points == 0) {cup_placement_points = 0;}
          cup_points_total = (cup_placement_points + cup_participation_points) * cup_points_multiplier;
        }
        // If not first competitor and has points
        else {
          // Tied points
          if(signee.total_points == last_points) {
            placement -= 1;
            tied_competitors += 1;
          }
          // If no tie, add tied_competitors amount of placements
          else {
              placement += tied_competitors;
          }
          // If competitor has no points === no fishes
          if (signee.total_points == 0){
            cup_placement_points = 0;
            cup_points_total = cup_participation_points * cup_points_multiplier;
            if(signee.total_points === last_points){
              tied_competitors += 1;
            }
          }

          if(cup_placement_points <= 20 && signee.total_points !== 0) {
            // If the points differ from last competitor, deduct placement points
            if(signee.total_points !== last_points) {
              cup_placement_points -= 2 * (tied_competitors + 1);
              tied_competitors = 0;
            }
          }
          else if (cup_placement_points <= 0) {
            cup_placement_points = 0;
            tied_competitors = 0;
          }
          else {
            if (signee.total_points !== last_points && signee.total_points !== 0) {
              cup_placement_points -= 2 * (tied_competitors + 1);
              tied_competitors = 0;
            }
          }

          if (cup_placement_points > 0) {
            cup_temp_points = cup_placement_points + cup_participation_points;
            cup_points_total = cup_temp_points * cup_points_multiplier;
          }
          else {
            cup_points_total = cup_participation_points * cup_points_multiplier;
          }

        }

        this.results.push({
          placement: placement,
          boat_number: signee.boat_number,
          captain_name: signee.captain_name,
          locality: signee.locality,
          total_points: signee.total_points,
          cup_placement_points: cup_placement_points,
          cup_participation_points: cup_participation_points,
          cup_points_total: cup_points_total,
        });
        last_points = signee.total_points;

        if (tied_competitors){
          placement += tied_competitors;
        }
        else {
          placement++;
        }          
        

      });
    },

    // TODO update all the results with some time interval
    calculateTeamResults: function() {
      var team_names = [];

      // Get all the team names
      this.signees.forEach((signee) => {
        if (signee.team !== "-" && signee.team !== null) {
          team_names.push(signee.team);
        }
      });
      // Only unique ones needed
      team_names = [...new Set(team_names)];

      // Get all the members of each team and add up their points
      team_names.forEach((team_name) => {
        let team = this.signees.filter((signee) => signee.team == team_name);
        let team_points = 0;
        let members = [];

        team.forEach((member) => {
          members.push(member.captain_name);
          team_points += member.total_points;
        });

        if (members.length === 1) {
          members.push("-");
          members.push("-");
        }
        if (members.length === 2) {
          members.push("-");
        }
        this.team_results.push({
          name: team_name,
          captain_name_1: members[0],
          captain_name_2: members[1],
          captain_name_3: members[2],
          points: team_points,
        });
      });
    },
    async calculateTotalWeights() {
      let finished_boats = this.$store.getters.getFinishedSignees;
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let competition = this.$store.getters.getCompetition;
      competition.total_weights = 0;
      // For each boat, get every fish weight and add them to competition_fishes and total_weights in competition
      // For statistics
      // First reset
      for (let i = 0; i < competition_fishes.length; i++) {
        competition_fishes[i].weights = 0;
      }
      //Then add
      finished_boats.forEach((element) => {
        for (let i = 0; i < competition_fishes.length; i++) {
          let fish_weights = element.weights.find(
            (fish) => competition_fishes[i].name == fish.name
          ).weights;
          competition_fishes[i].weights += parseInt(fish_weights);
          competition.total_weights += parseInt(fish_weights);
        }
      });
      this.calculated_fish_weights = competition_fishes;

      try {
        this.competition = competition;
        this.$store.commit('refreshCompetition', this.competition);
        await CompetitionService.updateCompetition(this.competition._id, this.competition);
        console.log("Updated to database!");

      } catch (err) {
        console.log(err.message);
        this.calculated_fish_weights = null;
      }
    },
    sortDict: function(fishes) {
        if(fishes){
          let all_results = [];
          let temp_results = [];
          this.fish_names.forEach(name => {
              if(name !== "Voittajat") {
                if(fishes[name]){
                  temp_results = fishes[name].sort(function compare(a,b) {
                      return parseInt(b.weight) - parseInt(a.weight);
                  });
                  fishes[name] = temp_results;
                  //Now it's sorted so first element is fine
                  all_results.push({name: name, boat_number: temp_results[0].boat_number, captain_name: temp_results[0].captain_name, weight: temp_results[0].weight});
                }
              }
          });

          return fishes, all_results
        }
        else {
          return {}, []
        }
    },
    calculateBiggestFishes: function(){
      let fishes = this.biggest_fishes;
      this.results_found_fishes = null;

      if(!this.selected_biggest_fish) {
        this.selected_biggest_fish = "Voittajat";
      }
      if(this.selected_biggest_fish === "Voittajat") {
        this.biggest_fishes, this.biggest_fishes_results = this.sortDict(fishes);
      }
      else {
        let fish_results = [];
        if(fishes[this.selected_biggest_fish]){
          fish_results = fishes[this.selected_biggest_fish].sort(function compare(a,b) {
              return parseInt(b.weight) - parseInt(a.weight);
          })
          this.results_found_amounts = "";
        }
        else {
          this.results_found_fishes = "- Ei tuloksia";
        }
        this.biggest_fishes_results = fish_results;
      }
    },
    calculateBiggestAmounts: function(){
      let fishes = this.biggest_amounts;
      this.results_found_amount = "";
      if(!this.selected_biggest_amount) {
        this.selected_biggest_amount = "Voittajat";
      }
      if(this.selected_biggest_amount === "Voittajat") {
        this.biggest_amounts, this.biggest_amounts_results = this.sortDict(fishes);
      }
      else {
        let fish_results = [];
        if(fishes[this.selected_biggest_amount]){
          fish_results = fishes[this.selected_biggest_amount].sort(function compare(a,b) {
              return parseInt(b.weight) - parseInt(a.weight);
          })
          this.results_found_amounts = "";
        }
        else {
          this.results_found_amount = "- Ei tuloksia";
        }
        
        this.biggest_amounts_results = fish_results;
      }

    },
    replaceAll: function(string, search, replace) {
      return string.split(search).join(replace);
    },
  // Convert the charts and the tables to pdf
    saveAsPDF: function (competition_type, table_id) {
      this.competition.start_date = moment(this.competition.start_date);
      let temp_start_date = `${this.competition.start_date.date()}.${this.competition.start_date.month()+1}.${this.competition.start_date.year()}`;
      let doc = new jsPDF();
      const title = `${this.competition.name} - ${competition_type}`
      doc.text(100,10, title, {align: "center"});
      doc.autoTable({
        html: table_id,
        styles: {halign : 'center'},
        margin: {top: 20},
      })
      
      doc.save(`${this.replaceAll(this.competition.name, ' ', '_')}_${this.replaceAll(temp_start_date, ".", "-")}_${this.replaceAll(competition_type, " ","_")}.pdf`);
    },
    saveStatsAsPDF: function (competition_type) {
      this.competition.start_date = moment(this.competition.start_date);
      let temp_start_date = `${this.competition.start_date.date()}.${this.competition.start_date.month()+1}.${this.competition.start_date.year()}`;
      let doc = new jsPDF();
      const title = `${this.competition.name} (${temp_start_date}) - ${competition_type}`
      doc.text(100, 10, title, {align: "center"});

      var fishesImg = document.getElementById('fishesChart').toDataURL("image/png", 1.0);
      var signeeImg = document.getElementById('signeesChart').toDataURL("image/png", 1.0);
      doc.addImage(fishesImg, 'PNG', -10,20,150,75);
      doc.addImage(signeeImg, 'PNG', 70,20,150,75);
    
      doc.autoTable({
          html: '#fish-weights-table',
          styles: {halign : 'center'},
          margin: {top: 110},
      });
      doc.autoTable({
          html: '#misc-table',
          styles: {halign : 'center'},
          margin: {top: 160},
      }); 


      doc.save(`${this.replaceAll(this.competition.name, ' ', '_')}_${this.replaceAll(temp_start_date, ".", "-")}_${this.replaceAll(competition_type, " ","_")}.pdf`);
    },
    saveAllAsPDF: function () {
      this.competition.start_date = moment(this.competition.start_date);
      this.competition.end_date = moment(this.competition.end_date);
      let temp_start_date = `${this.competition.start_date.date()}.${this.competition.start_date.month()+1}.${this.competition.start_date.year()}`;
      let temp_end_date = `${this.competition.end_date.date()}.${this.competition.end_date.month()+1}.${this.competition.end_date.year()}`
      let doc = new jsPDF();
      const title = `${this.competition.name}, ${temp_start_date} - ${temp_end_date}`;
      const time = `Klo. ${this.competition.start_time} - ${this.competition.end_time}`;
      doc.text(100, 10, title, {align: "center"});
      doc.text(100, 20, time, {align: "center"});
      doc.text(100,35, "Normaalikilpailun tulokset", {align: "center"});
      doc.autoTable({
        html: '#normal-table',
        styles: {halign : 'center', border:"1"},
        margin: {top: 40},
      });
      if(this.isTeamCompetition) {
          doc.addPage();
          doc.text(100, 10, "Tiimikilpailun tulokset", {align: "center"});
          if(this.team_results.length){
            doc.autoTable({
              html: '#team-table',
              styles: {halign : 'center'},
              margin: {top: 20},
            });
          }
          else {
            doc.text(100,20, "Ei tuloksia");
          }

      }

      doc.addPage();
      doc.text(100, 10, "Suurimmat kalat" + ` (${this.selected_biggest_fish})`, {align: "center"});
      if(this.biggest_fishes_results.length){
          doc.autoTable({
            html: '#biggest-fishes-table',
            styles: {halign : 'center'},
            margin: {top: 20},
          });   
      }
      else {
          doc.text(100,20, "Ei tuloksia");
      }
      doc.addPage();
      doc.text(100, 10, "Suurimmat kalasaaliit" + ` (${this.selected_biggest_amount})`, {align: "center"});

      if(this.biggest_amounts_results.length){
        console.log(this.biggest_amounts_results)
          doc.autoTable({
              html: '#biggest-amounts-table',
              styles: {halign : 'center'},
              margin: {top: 20},
          });     
      }
      else {
          doc.text(100,20, "Ei tuloksia");
      }

      doc.addPage();

      var fishesImg = document.getElementById('fishesChart').toDataURL("image/png", 1.0);
      var signeeImg = document.getElementById('signeesChart').toDataURL("image/png", 1.0);
      doc.addImage(fishesImg, 'PNG', -10,20,150,75);
      doc.addImage(signeeImg, 'PNG', 70,20,150,75);
      doc.autoTable({
          html: '#fish-weights-table',
          styles: {halign : 'center'},
          margin: {top: 100},
      });  
      doc.autoTable({
          html: '#misc-table',
          styles: {halign : 'center'},
          margin: {top: 150},
      }); 
      

      doc.save(`${this.replaceAll(this.competition.name, ' ', '_')}_${this.replaceAll(temp_start_date, ".", "-")}_kaikki_tulokset.pdf`);
    },
  },
};
</script>

<style scoped>

li.disabled{
  background: grey;
}
</style>