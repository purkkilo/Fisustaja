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
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
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
        </div>
        <div id="normal-competition" class="col s12 inputarea">
          <div class="section">
            <div class="row">
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
          </div>
        </div>
        <div id="team-competition" class="col s12 inputarea">
          <div class="section">
            <div class="row">
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
          </div>
        </div>
        <div id="biggest-fishes" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table
                id="biggest-fishes-table"
                class="highlight centered responsive-table tablearea"
              >
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Kalalaji</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signee, index) in biggest_fishes" :key="index">
                    <th class="center-align" style="border:1px solid black">
                      Todo
                    </th>
                    <td style="border:1px solid black">
                      {{ signee.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.captain_name }}
                    </td>
                    <td style="border:1px solid black">Todo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="biggest-fish-amounts" class="col s12 inputarea">
          <div class="section">
            <div class="row">
              <table
                id="biggest-amounts-table"
                class="highlight centered responsive-table tablearea"
              >
                <thead style="background: rgb(0, 1, 34);color:#fff;">
                  <tr>
                    <th>Kalalaji</th>
                    <th>Veneen nro</th>
                    <th>Kapteeni</th>
                    <th>Paino</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(signee, index) in biggest_fish_amounts"
                    :key="index"
                  >
                    <th class="center-align" style="border:1px solid black">
                      Todo
                    </th>
                    <td style="border:1px solid black">
                      {{ signee.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.captain_name }}
                    </td>
                    <td style="border:1px solid black">Todo</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default {
  name: "Results",
  components: {
    Timedate,
  },
  data() {
    return {
      results: [],
      team_results: [],
      biggest_fishes: [],
      biggest_fish_amounts: [],
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
    this.calculateTeamResults();
    this.calculateNormalResults();
  },
  methods: {
    onlyUnique: function(value, index, self) {
      return self.indexOf(value) === index;
    },

    calculateNormalResults: function() {
      const result_signees = this.$store.getters.getResultSignees;
      const competition = this.$store.getters.getCompetition;
      const cup_points_multiplier = competition.cup_points_multiplier;
      let cup_placement_points = competition.cup_placement_points;
      const cup_participation_points = competition.cup_participation_points;
      let last_points = null;
      let tied_competitors = 0;
      let placement = 1;
      let cup_temp_points;
      let cup_points_total;

      this.results = [];
      result_signees.forEach((signee) => {
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

      /*
                      <th class="center-align" style="border:1px solid black">{{ signee.placement }}</th>  
                      <td style="border:1px solid black">{{ signee.boat_number }}</td> 
                      <td style="border:1px solid black">{{ signee.captain_name }}</td>
                      <td style="border:1px solid black">{{ signee.locality }}</td>
                      <td style="border:1px solid black">{{ signee.total_points }}</td>
                      <td style="border:1px solid black">{{ signee.cup_placement_points }}</td>
                      <td style="border:1px solid black">{{ signee.cup_participation_points}}</td>
                      <td style="border:1px solid black">{{ signee.cup_points_total }}</td>
        */
    },

    // TODO update all the results with some time interval
    calculateTeamResults: function() {
      const result_signees = this.$store.getters.getResultSignees;
      var team_names = [];

      // Get all the team names
      result_signees.forEach((signee) => {
        if (signee.team !== "-" && signee.team !== null) {
          team_names.push(signee.team);
        }
      });
      // Only unique ones needed
      team_names = [...new Set(team_names)];

      // Get all the members of each team and add up their points
      team_names.forEach((team_name) => {
        let team = result_signees.filter((signee) => signee.team == team_name);
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
  },
};
</script>
