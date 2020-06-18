<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Tulokset</h1></div>
      </div>
      <div class="row">
        <router-link to="/weighting">
          <div class="col s4">
            <a class="waves-effect waves-light blue darken-2 btn"
              ><i class="material-icons left">fitness_center</i>Punnitus</a
            >
          </div>
        </router-link>
        <router-link to="/overview">
          <div class="col s4">
            <a class="waves-effect waves-light btn"
              ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a
            >
          </div>
        </router-link>
        <div class="col s4" v-if="results.length || team_results.length || biggest_fishes_results.length || biggest_amounts_results">
          <a v-on:click="saveAllAsPDF" class="waves-effect waves-light blue darken-4 btn-large"
            ><i class="material-icons left">picture_as_pdf</i>Lataa kaikki taulukot</a
          >
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs" v-if="$store.getters.isTeamCompetition">
            <li class="tab col s3">
              <a class="active" href="#normal-competition">Normaalikilpailu</a>
            </li>
            <li class="tab col s3">
              <a href="#team-competition">Tiimikilpailu</a>
            </li>
            <li class="tab col s3">
              <a href="#biggest-fishes">Suurimmat Kalat</a>
            </li>
            <li class="tab col s3">
              <a href="#biggest-fish-amounts">Suurimmat Kalasaaliit</a>
            </li>
          </ul>
          <ul class="tabs" v-else>
            <li class="tab col s4">
              <a class="active" href="#normal-competition">Normaalikilpailu</a>
            </li>
            <li class="tab col s4">
              <a href="#biggest-fishes">Suurimmat Kalat</a>
            </li>
            <li class="tab col s4">
              <a href="#biggest-fish-amounts">Suurimmat Kalasaaliit</a>
            </li>
          </ul>
        </div>
        <div id="normal-competition" class="col s12 inputarea">
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
                      {{ signee.placement }}
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
              <p class="flow-text">Ei tuloksia, vielä...</p>
            </div>
          </div>
          <div class="row" v-if="results.length">
            <a v-on:click ="saveAsPDF(`Normaalikilpailun tulokset`, '#normal-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
        </div>
        <div id="team-competition" class="col s12 inputarea" v-if="$store.getters.isTeamCompetition">
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
                      {{ index + 1 }}
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
              <p class="flow-text">Ei tuloksia, vielä...</p>
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
                <caption class="center-align flow-text">
                  Suurimmat kalat ({{ selected_biggest_fish }} {{ results_found_fishes }})
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
              <p class="flow-text">Ei tuloksia, vielä...</p>
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
                <caption class="center-align flow-text">
                  Suurimmat kalasaaliit ({{ selected_biggest_amount }} {{ results_found_amounts }})
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
              <p class="flow-text">Ei tuloksia, vielä...</p>
            </div>
          </div>
          <div class="row" v-if="biggest_amounts_results.length">
            <a v-on:click ="saveAsPDF(`Suurimmat kalasaaliit`, '#biggest-amounts-table')" class="waves-effect waves-light blue darken-4 btn col s4 push-s4">
              <i class="material-icons left">picture_as_pdf</i>Lataa pdf
            </a>
          </div>
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

export default {
  name: "Results",
  components: {
    Timedate,
  },
  data() {
    return {
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
    this.fish_names = [];
    if(this.$store.getters.getCompetition) {
      this.competition = this.$store.getters.getCompetition
    }
    if (this.$store.getters.getResultSignees) {
      
      this.signees = this.$store.getters.getResultSignees;
      this.biggest_fishes = this.$store.getters.getBiggestFishes;
      this.biggest_amounts = this.$store.getters.getBiggestAmounts;
      let temp_fish_names = this.$store.getters.getCompetitionFishes;
      this.fish_names.push("Voittajat");
      temp_fish_names.forEach(fish => {
        this.fish_names.push(fish.name);
      });
      this.selected_biggest_amount = this.selected_biggest_fish = "Voittajat";
      this.calculateAll();
    }
    else {
      this.signees = [];
    }
  },
  methods: {
    onlyUnique: function(value, index, self) {
      return self.indexOf(value) === index;
    },
    calculateAll: function() {
      this.calculateTeamResults();
      this.calculateNormalResults();
      this.calculateBiggestFishes();
      this.calculateBiggestAmounts();
    },
    calculateNormalResults: function() {
      const competition = this.competition;
      const cup_points_multiplier = competition.cup_points_multiplier;
      let cup_placement_points = competition.cup_placement_points;
      const cup_participation_points = competition.cup_participation_points;
      let last_points = null;
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
        // If competitor has no points === no fishes
        else if (signee.total_points == 0){
          cup_placement_points = 0;
          cup_points_total = cup_participation_points * cup_points_multiplier;
          tied_competitors += 1;
        }
        // If not first competitor and has points
        else {
          // Tied points
          if(signee.total_points == last_points && this.results.length) {
            placement -= 1;
            tied_competitors += 1;
          }
          // If no tie, add tied_competitors amount of placements
          else {
            placement += tied_competitors;
          }

          if(cup_placement_points <= 20) {
            // If there is the points differ from last competitor, deduct placement points
            if(signee.total_points !== last_points || !this.results.length) {
              cup_placement_points -= 2 * (tied_competitors + 1);
              tied_competitors = 0;
            }
          }
          else if (cup_placement_points <= 0) {
            cup_placement_points = 0;
            tied_competitors = 0;
          }
          else {
            if (signee.total_points !== last_points || this.results.length) {
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

        if (!tied_competitors) {
          placement += 1;
          last_points = signee.total_points;        
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
        styles: {halign : 'center'},
        margin: {top: 40},
      });
      if(this.$store.getters.isTeamCompetition) {
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
            doc.text(10,20, "Ei tuloksia");
          }

      }

      doc.addPage();
      doc.text(100, 10, "Suurimmat kalat" + ` (${this.selected_biggest_fish})`, {align: "center"});
      if(this.biggest_fishes_results){
          doc.autoTable({
            html: '#biggest-fishes-table',
            styles: {halign : 'center'},
            margin: {top: 20},
          });   
      }
      else {
          doc.text(10,20, "Ei tuloksia");
      }
      doc.addPage();
      doc.text(100, 10, "Suurimmat kalasaaliit" + ` (${this.selected_biggest_amount})`, {align: "center"});

      if(this.biggest_amounts_results){
          doc.autoTable({
              html: '#biggest-amounts-table',
              styles: {halign : 'center'},
              margin: {top: 20},
          });     
      }
      else {
          doc.text(10,20, "Ei tuloksia");
      }

      doc.save(`${this.replaceAll(this.competition.name, ' ', '_')}_${this.replaceAll(temp_start_date, ".", "-")}_kaikki_tulokset.pdf`);
    },
  },
};
</script>

