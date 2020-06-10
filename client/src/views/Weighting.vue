<template>
  <div class="container">
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Punnitus</h1></div>
      </div>
      <div class="row">
        <router-link to="/signing">
          <div class="col s4">
            <a class="waves-effect waves-light blue btn"
              ><i class="material-icons left">assignment_ind</i>Ilmoittautuminen</a
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
        <router-link to="/results">
          <div class="col s4">
            <a class="waves-effect waves-light green btn"
              ><i class="material-icons left">emoji_events</i>Tulokset</a
            >
          </div>
        </router-link>
      </div>
      <div class="row">
        <div class="col s12">
          <ul class="tabs">
            <li class="tab col s3">
              <a class="active" href="#weighting">Punnitus</a>
            </li>
            <li class="tab col s3"><a href="#situation">Tilannekatsaus</a></li>
            <li class="tab col s3"><a href="#stats">Tilastoja</a></li>
            <li class="tab col s3">
              <a href="#still-on-water">Vielä vesillä</a>
            </li>
          </ul>
        </div>

        <div id="weighting" class="col s12 inputarea">
          <div class="section" v-if="$store.getters.getCompetitionSignees.length">
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
            <div class="row title">
              <div class="row col s12">
                <div class="col s4">
                  <p class="flow-text">Venekunnan numero</p>
                </div>
                <div class="input-field col s4 push-s2">
                  <input
                    id="boat_number_input"
                    v-model="boat_number_input"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    @keypress="isNumber($event)"
                    type="number"
                    maxlength="6"
                    class="validate"
                    step="1"
                    min="0"
                  />
                  <label for="boat_number_input">Numero</label>
                </div>
              </div>
              <div class="row">
                <a
                  class="waves-effect waves-light blue btn black-text col s4 push-s6"
                  v-on:click="fetchFromDatabase(boat_number_input)"
                  ><i class="material-icons left">search</i>Hae numerolla</a
                >
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
                        <div class="col s6 pull-s1 center-align">
                          <input
                            :id="'fish_' + (index + 1) + '_weight'"
                            type="number"
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
              <p v-if="!searched" class="flow-text">Venekuntaa ei valittuna</p>
              <p v-else class="flow-text">
                Numerolla ei löytynyt venekuntaa tietokannasta!
              </p>
            </div>
          </div>
          <div v-else>
            <p class="flow-text">Kilpailussa ei vielä ilmoittautuneita!</p>
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
                v-if="$store.getters.getResultSignees.length"
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
                    v-for="(signee, index) in $store.getters.getResultSignees"
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
              v-if="selected_id && $store.getters.getResultSignees.length"
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
                v-if="$store.getters.getResultSignees.length"
                class="flow-text"
              >
                Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                taulukosta ja painamalla ilmestyvää nappulaa
              </p>
              <h3 v-else class="flow-text">Ei vielä tuloksia!</h3>
            </div>
          </div>
        </div>

        <div id="stats" class="col s12 inputarea">
          <div class="section" style="margin-bottom: 50px;">
            <div class="row center-align">
              <p class="flow-text">Tilastoja</p>
            </div>
          </div>
          <div class="section" v-if="$store.getters.getCompetition">
            <ul class="collapsible">
              <li>
                <div class="collapsible-header">
                  <i class="material-icons">calculate</i>Kertoimet, alamitat,
                  kaloja punnittu yhteensä
                </div>
                <div class="collapsible-body white">
                  <div class="fishes_summary row">
                    <div class="col s8 push-s2">
                      <table
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
                </div>
              </li>
              <li>
                <div class="collapsible-header">
                  <i class="material-icons">bar_chart</i>Muita tilastoja
                </div>
                <div class="collapsible-body white row">
                  <table
                    class="striped centered responsive-table highlight col s8 push-s2"
                  >
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        <b>Veneitä yhteensä:</b>
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ $store.getters.getSignees.length }} venettä
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Saalista saaneita veneitä:
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{ $store.getters.getFinishedSignees.length }} venettä
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Vielä vesillä:
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{
                          $store.getters.getStillOnWaterSignees.length
                        }}
                        venettä
                      </td>
                    </tr>
                    <tr>
                      <th style="border:1px solid black;" class="center-align">
                        Saalista yhteensä:
                      </th>
                      <td style="border:1px solid black;" class="center-align">
                        {{
                          Math.round(
                            (calculated_total_weights / 1000 +
                              Number.EPSILON) *
                              100
                          ) / 100
                        }}
                        kg
                      </td>
                    </tr>
                  </table>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div id="still-on-water" class="col s12 inputarea">
          <div class="section">
            <div class="row center-align">
              <p
                v-if="$store.getters.getStillOnWaterSignees.length"
                class="flow-text"
              >
                Venekunnat, jotka ovat vielä vesillä
              </p>
              <p
                v-else-if="!$store.getters.getCompetitionSignees.length"
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
                v-if="$store.getters.getStillOnWaterSignees.length"
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
                    v-for="(signee, index) in $store.getters
                      .getStillOnWaterSignees"
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
              v-if="selected_id && $store.getters.getStillOnWaterSignees.length"
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
                v-if="$store.getters.getStillOnWaterSignees.length"
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
      notification: null,
    };
  },
  mounted() {
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
    this.calculated_fish_weights = this.calculateTotalWeights();
    this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
  },
  methods: {
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
      this.fetchFromDatabase(temp_boat_number);
    },
    fetchFromDatabase: function(boat_number) {
      this.searched = true;
      this.notification = null;
      this.competition_boat = this.searchBoatNumber(boat_number);
      if (this.competition_boat) {
        //Wait for render
        this.$nextTick(() => this.setInputWeights());
      } else {
        console.log("No such boat in list!");
      }
    },
    async saveToDatabase(reset) {
      let competition_fishes = this.$store.getters.getCompetitionFishes;
      let fish_weights = [];
      let total_weights = 0;
      let total_points = 0;
      let fish_weight = 0;
      let fish_points = 0;
      let fish_name;
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
          total_weights += fish_weight;
          total_points += fish_points;
        }
      }
      this.competition_boat.weights = fish_weights;
      this.competition_boat.total_weights = total_weights;
      this.competition_boat.total_points = total_points;

      this.$store.commit("replaceSignee", this.competition_boat);
      let comp = this.$store.getters.getCompetition;
      comp.signees = this.$store.getters.getSignees;
      if (this.$store.getters.getStillOnWaterSignees.length) {
        comp.state = "Punnitus";
      } else {
        comp.state = "Kaikki punnittu";
      }
      this.$store.commit("refreshCompetition", comp);
      try {
        this.loading = true;
        await CompetitionService.updateCompetition(comp._id, comp);
        console.log("Updated to database!");
        this.notification = `Tiedot päivitetty tietokantaan!`;
        this.loading = false;
        this.searched = false;
        this.competition_boat = null;
        this.calculated_fish_weights = this.calculateTotalWeights();
        this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
      } catch (err) {
        console.log(err.message);
      }
    },
    clearInputs: function() {
      M.toast({ html: "Todo: Pyyhi inputit..." });
      for (
        let i = 1;
        i < this.$store.getters.getCompetitionFishes.length + 1;
        i++
      ) {
        document.getElementById(`fish_${i}_weight`).value = 0;
      }
      this.competition_boat = null;
      this.boat_number_input = null;
      this.searched = false;
    },
  },
};
</script>
