<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Punnitus</h1></div>
      </div>
      <div class="row">
          <div class="col s4">
            <router-link to="/signing">
              <a class="waves-effect waves-light blue btn"
                ><i class="material-icons left">assignment_ind</i>Ilmoittautuminen</a
              >
            </router-link>
          </div>

          <div class="col s4">
            <router-link to="/overview">
              <a class="waves-effect waves-light btn">
                <i class="material-icons left">info</i>Kilpailun yleisnäkymä
              </a>
            </router-link>
          </div>

          <div class="col s4">
            <router-link to="/results"><a class="waves-effect waves-light green btn"
              ><i class="material-icons left">emoji_events</i>Tulokset</a
              >
            </router-link>
          </div>

      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s4">
              <a class="active" href="#weighting">Punnitus</a>
            </li>
            <!--TODO fix placements -->
            <li class="tab col s4"><a href="#situation">Tilannekatsaus</a></li>
            <li class="tab col s4">
              <a href="#still-on-water">Vielä vesillä</a>
            </li>
          </ul>
        </div>

        <div id="weighting" class="col s12 inputarea">
          <div v-if="!loading_site">
            <div class="section" v-if="signees.length">
              <div class="row center-align">
                <p class="flow-text">Punnitus</p>
              </div>
              <div v-if="notification" class="section center-align">
                <p
                  class="flow-text green lighten-1 center-align"
                  id="notification"
                >
                  {{ notification }}
                </p>
              </div>
              <div v-if="!loading" class="row title">
                <div class="row ">
                  <div class="col s4">
                    <p class="flow-text">Venekunnan numero</p>
                  </div>
                  <div class="input-field col s4 push-s2 ">
                    <v-select
                      class="flow-text title"
                      label="boat_number"
                      placeholder="Valitse tai hae veneen numero"
                      v-model="boat_number_input"
                      v-on:input="fetchFromDatabase(boat_number_input ? boat_number_input.boat_number : -1)"
                      :options="sortedArray"
                    />
                  </div>
                </div>
              </div>

              <div v-if="competition_boat" class="row center-align">
                <p class="flow-text">Venekunta</p>

                <div class="row">
                  <div class="col s4 center-align">
                    <p class="flow-text">({{ competition_boat.boat_number }})</p>
                  </div>
                  <div class="col s4 center-align">
                    <p class="flow-text">{{ competition_boat.captain_name }}</p>
                  </div>
                  <div class="col s4 center-align">
                    <p class="flow-text">
                      {{ competition_boat.temp_captain_name }}
                    </p>
                  </div>
                </div>
                <div class="row center-align">
                  <a
                    class="col s4 push-s4 waves-effect waves-light yellow btn black-text"
                    v-on:click="clearInputs"
                    ><i class="material-icons left">backspace</i>Peruuta
                    valinta</a
                  >
                </div>
                <div class="divider black"></div>
                <div class="section">
                  <div class="" id="fishes">
                    <ul
                      id="fish_weights"
                      v-if="$store.getters.getCompetitionFishes.length"
                    >
                      <li>
                        <div class="section row valign-wrapper">
                          <div class="col s3">
                            <span
                              class="flow-text"
                            >Suurin kala?</span
                            >
                          </div>
                          <div class="col s3">
                            <v-select
                              class="flow-text title"
                              label="name"
                              placeholder="Valitse kalalaji painamalla"
                              v-model="selected_fish"
                              :options="competition_fishes"
                            />
                          </div>
                          <div class="col s3 title">
                            <input
                              v-model="biggest_fish"
                              id="biggest_fish"
                              type="number"
                              @paste.prevent
                              @keypress="isNumber($event)"
                              value="0"
                              step="5"
                              min="0"
                            />
                            <label for="biggest_fish">Syötä paino grammoina</label>
                          </div>

                          <div class="col s3">
                            <a
                              v-if="selected_fish && biggest_fish"
                              class="waves-effect waves-light green lighten-2 btn-large black-text"
                              v-on:click="saveBiggestFish"
                              ><i class="material-icons left">add_box</i>Lisää kilpailuun
                            </a>
                          </div>

                        </div>
                        <div class="divider black"></div>
                      </li>
                      <li
                        v-for="(fish, index) in $store.getters
                          .getCompetitionFishes"
                        :key="fish.name"
                      >
                        <div class="section row">
                          <div class="col s6 center-align">
                            <span class="flow-text">{{ index + 1 }}. </span
                            ><span
                              class="flow-text"
                              :id="'fish_' + (index + 1) + '_name'"
                              >{{ fish.name }}</span
                            >
                          </div>
                          <div class="col s6 pull-s1 center-align title">
                            <input
                              :id="'fish_' + (index + 1) + '_weight'"
                              type="number"
                              @paste.prevent
                              @keypress="isNumber($event)"
                              value="0"
                              step="5"
                              min="0"
                            />
                            <label :for="'fish_' + (index + 1) + '_weight'"
                              >Paino grammoina</label
                            >
                          </div>
                        </div>
                        <div class="divider black"></div>
                      </li>
                    </ul>
                  </div>

                  <div v-if="!loading" class="section center-align">
                    <div class="col s1"></div>
                    <a
                      class="col s4 waves-effect waves-light red btn-large black-text"
                      v-on:click="saveToDatabase(true)"
                      ><i class="material-icons left">delete_forever</i>Nollaa
                      kilpailijan pisteet</a
                    >
                    <div class="col s2"></div>
                    <a
                      class="col s4 waves-effect waves-light green btn-large black-text"
                      v-on:click="saveToDatabase(false)"
                      ><i class="material-icons left">check</i>Tallenna</a
                    >
                    <div class="col s1"></div>
                  </div>
                  <div v-else>
                    <p class="flow-text">Päivitetään tiedot tietokantaan...</p>
                    <ProgressBarQuery />
                  </div>
                </div>
              </div>
              <div v-else class="center-align">
                <p v-if="loading"></p>
                <p v-else-if="!searched" class="flow-text">Venekuntaa ei valittuna</p>
                <p v-else class="flow-text">
                  Numerolla ei löytynyt venekuntaa tietokannasta!
                </p>
              </div>
            </div>
            <div v-else>
              <p class="flow-text">Kilpailussa ei vielä ilmoittautuneita!</p>
            </div>
          </div>
          <div v-if="loading_site">
            <h2>Haetaan veneitä...</h2>
            <ProgressBarQuery />        
          </div>
        </div>

        <div id="situation" class="col s12 inputarea">
          <div class="section">
            <div class="row center-align">
              <p class="flow-text">Tilannekatsaus</p>
            </div>

            <div class="col s12 center-align">
              <table
                id="situation-table"
                class="highlight centered responsive-table fixed_header tablearea"
                v-if="result_signees.length"
              >
                <thead>
                  <tr>
                    <th>Sijoitus</th>
                    <th>Numero</th>
                    <th>Kapteeni</th>
                    <th>Pisteet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    @click="selectRow(signee.id, signee.boat_number)"
                    :class="{ selected: selected_id == signee.id }"
                    v-for="(signee, index) in result_signees"
                    :key="index"
                  >
                    <th class="center-align" style="border:1px solid black">
                      {{ index + 1 }}
                    </th>
                    <td style="border:1px solid black">
                      {{ signee.boat_number }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.captain_name }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.total_points }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="selected_id && result_signees.length"
              class="section inputarea"
            >
              <div class="col s12 center-align">
                <a
                  class="waves-effect waves-light blue btn"
                  v-on:click="searchSelected"
                  ><i class="material-icons left">info</i>Siirry punnitukseen</a
                >
              </div>
            </div>
            <div v-else class="section inputarea center-align">
              <p
                v-if="result_signees.length"
                class="flow-text"
              >
                Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                taulukosta ja painamalla ilmestyvää nappulaa
              </p>
              <h3 v-else class="flow-text">Ei vielä tuloksia!</h3>
            </div>
          </div>
        </div>

        <div id="still-on-water" class="col s12 inputarea">
          <div class="section">
            <div class="row center-align">
              <p
                v-if="still_on_water.length"
                class="flow-text"
              >
                Venekunnat, jotka ovat vielä vesillä
              </p>
              <p
                v-else-if="!signees.length"
                class="flow-text"
              >
                Kilpailussa ei vielä ilmoittautuneita!
              </p>
              <p v-else class="flow-text">
                Kaikki venekunnat palanneet maaliin!
              </p>
            </div>
            <div class="col s12 center-align">
              <table
                id="on-water-table"
                class="highlight centered responsive-table fixed_header tablearea"
                v-if="still_on_water.length"
              >
                <thead>
                  <tr>
                    <th>Nro.</th>
                    <th>Kapteeni</th>
                    <th>Varakapteeni</th>
                    <th>Lähtöpaikka</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    @click="selectRow(signee.id, signee.boat_number)"
                    :class="{ selected: selected_id == signee.id }"
                    v-for="(signee, index) in still_on_water"
                    :key="index"
                  >
                    <th class="center-align" style="border:1px solid black">
                      {{ signee.boat_number }} ({{ signee.id }})
                    </th>
                    <td style="border:1px solid black">
                      {{ signee.captain_name }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.temp_captain_name }}
                    </td>
                    <td style="border:1px solid black">
                      {{ signee.starting_place }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="selected_id && still_on_water.length"
              class="section inputarea"
            >
              <div class="col s12 center-align">
                <a
                  class="waves-effect waves-light blue btn"
                  v-on:click="searchSelected"
                  ><i class="material-icons left">info</i>Siirry punnitukseen</a
                >
              </div>
            </div>
            <div v-else class="section inputarea center-align">
              <p
                v-if="still_on_water.length"
                class="flow-text"
              >
                Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                taulukosta ja painamalla ilmestyvää nappulaa
              </p>
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
import CompetitionService from "../CompetitionService";
import ProgressBarQuery from "../components/layout/ProgressBarQuery";
import "vue-select/dist/vue-select.css";

export default {
  name: "Weighting",
  components: {
    Timedate,
    ProgressBarQuery,
  },
  data() {
    return {
      boat_number_input: null,
      competition_boat: null,
      calculated_total_weights: null,
      calculated_fish_weights: null,
      searched: false,
      selected_id: null,
      selected_boat_number: null,
      loading: false,
      loading_site: true,
      notification: null,
      biggest_fish: null,
      selected_fish: null,
      competition_fishes: [],
      biggest_fishes: {},
      biggest_amounts: {},
      signees: [],
      result_signees: [],
      still_on_water: [],
    };
  },
  computed: {
    sortedArray(){
        return [...this.signees].sort((a, b) => a.boat_number - b.boat_number );
    }
  },
  mounted() {
    this.checkLogin();
    //Init materialize elements
    M.AutoInit();
    /* eslint-disable no-unused-vars */
    var tabs = document.querySelectorAll(".tabs");
    var instance = M.Tabs.init(tabs, options_picker);

    var collabs = document.querySelectorAll(".collapsible");
    var instances2 = M.Collapsible.init(collabs, options_picker);
    /* eslint-enable no-unused-vars */
    var elem = document.querySelectorAll(".tabs")[0];
    this.tabs = M.Tabs.getInstance(elem);
    if(localStorage.getItem('competition') != null) {
        let competition_id = localStorage.getItem('competition');
        this.refreshCompetition(competition_id);
    }
  },
  methods: {
    async refreshCompetition(competition_id) {
      this.loading_site = true;
      try {
        let competitions = await CompetitionService.getCompetition(competition_id);
        this.loading_site = false;
        if(competitions.length){
            this.$store.commit('refreshCompetition', competitions[0]);
            this.competition_fishes = this.$store.getters.getCompetitionFishes;
            this.signees = this.$store.getters.getCompetitionSignees;
            this.result_signees = this.$store.getters.getResultSignees;
            this.still_on_water = this.$store.getters.getStillOnWaterSignees;
        }
        else {
          console.log("No competition found on database...");
        }
      } catch(err) {
        this.loading_site = false;
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
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        if (charCode == 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    },
    searchBoatNumber: function(boat_number) {
      var search_boat_number = parseInt(boat_number);
      return this.$store.getters.getSigneeByBoatNumber(search_boat_number);
    },
    selectRow: function(id, boat_number) {
      if (id == this.selected_id) {
        this.selected_id = null;
        this.selected_boat_number = null;
      } else {
        this.selected_id = id;
        this.selected_boat_number = boat_number;
      }
    },
    setInputWeights: function() {
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      for (let i = 1; i < competition_fishes.length + 1; i++) {
        let fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
        let fish_weights = this.competition_boat.weights.find(
          (fish) => fish.name === fish_name
        ).weights;
        document.getElementById(`fish_${i}_weight`).value = fish_weights;
      }
    },
    calculateTotalWeights: function() {
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

      return competition_fishes
    },
    searchSelected: function() {
      this.tabs.select("weighting");
      let temp_boat_number = this.selected_boat_number;
      this.selected_id = null;
      this.selected_boat_number = null;
      this.boat_number_input = temp_boat_number;
      this.fetchFromDatabase(temp_boat_number);
    },
    fetchFromDatabase: function(boat_number) {
      if(boat_number !== -1) {
        this.searched = true;
        this.notification = null;
        this.competition_boat = this.searchBoatNumber(boat_number);
        if (this.competition_boat) {
          //Wait for render
          this.$nextTick(() => this.setInputWeights());
        } else {
          console.log("No such boat in list!");
        }
      }
      else {
          this.clearInputs();
      }
    },

    async saveBiggestFish() {
      let fish = {name: this.selected_fish.name, boat_number: this.boat_number_input.boat_number, captain_name:this.boat_number_input.captain_name , weight: this.biggest_fish};
      this.$store.commit("addBiggestFish", fish);
      this.biggest_fishes = this.$store.getters.getBiggestFishes;
      this.selected_fish = null,
      this.biggest_fish = null;
      let comp = this.$store.getters.getCompetition;
      comp.biggest_fishes = this.biggest_fishes;
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        await CompetitionService.updateCompetition(comp._id, comp);
        console.log("Updated to database!");
        this.notification = `Tiedot päivitetty tietokantaan!`;
        this.loading = false;
      } catch (err) {
        console.log(err.message);
      }
      M.toast({ html: "Isoin kala tallennettu listaan!" });
    },
    async saveToDatabase(reset) {
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let fish_weights = [];
      let total_weights = 0;
      let total_points = 0;
      let fish_weight = 0;
      let fish_points = 0;
      let fish_name;

      //if biggest fish not yet saved
      if(this.selected_fish && this.biggest_fish) {
        this.saveBiggestFish();
      }
      //if reset == true, reset current weights to 0, otherwise update weights from inputs
      if (reset) {
        this.competition_boat.returned = false;
        for (let i = 1; i < competition_fishes.length + 1; i++) {
          fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
        }
      } else {
        this.competition_boat.returned = true;
        for (let i = 1; i < competition_fishes.length + 1; i++) {
          fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
          fish_weight = parseInt(
            document.getElementById(`fish_${i}_weight`).value
          );
          let points_multiplier = competition_fishes.find(
            (fish) => fish.name === fish_name
          ).multiplier;
          fish_points = fish_weight * points_multiplier;
          fish_weights.push({
            name: fish_name,
            weights: fish_weight,
            points: fish_points,
          });
          let fish = {name: fish_name, boat_number: this.competition_boat.boat_number, captain_name:this.competition_boat.captain_name , weight: fish_weight};
          this.$store.commit("addBiggestAmount", fish);
          total_weights += fish_weight;
          total_points += fish_points;
        }
      }
      this.competition_boat.weights = fish_weights;
      this.competition_boat.total_weights = total_weights;
      this.competition_boat.total_points = total_points;

      this.$store.commit("replaceSignee", this.competition_boat);
      let comp = this.$store.getters.getCompetition;
      comp.signees = this.$store.getters.getCompetitionSignees;
      comp.biggest_fishes = this.$store.getters.getBiggestFishes;
      this.signees = comp.signees;

      if (this.still_on_water.length) {
        comp.state = "Punnitus";
      } else {
        comp.state = "Kaikki maalissa";
      }
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        await CompetitionService.updateCompetition(comp._id, comp);
        console.log("Updated to database!");
        this.notification = `Tiedot päivitetty tietokantaan!`;
        this.loading = false;
        this.searched = false;
        this.selected_boat_number = this.competition_boat.boat_number+1;
        this.competition_boat = null;
        this.calculated_fish_weights = this.calculateTotalWeights();
        this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
        this.result_signees = this.$store.getters.getResultSignees;
        this.still_on_water = this.$store.getters.getStillOnWaterSignees;
      } catch (err) {
        console.log(err.message);
      }
    },
    clearInputs: function() {
      M.toast({ html: "Pyyhitään inputit ja valinnat..." });
      for (
        let i = 1;
        i < this.$store.getters.getCompetitionFishes.length + 1;
        i++
      ) {
        document.getElementById(`fish_${i}_weight`).value = 0;
      }
      this.competition_boat = null;
      this.boat_number_input = null;
      this.selected_fish = null;
      this.biggest_fish = null;
      this.searched = false;
    },
  },
};
</script>
