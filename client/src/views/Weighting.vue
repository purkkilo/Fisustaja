<template>
  <!-- /weighting -->  
  <!-- html and js autoinjects to App.vue (and therefore on public/index.html) -->
  <v-container>
    <Header />
    <Timedate />
    <div class="container-transparent">
      <div class="section">
        <div class="col s12 center-align"><h1>Punnitus</h1></div>
      </div>
      <!-- Navigation to other competition pages -->

      <v-row>
        <v-col order="first">
          <router-link to="/signing">
            <v-btn large rounded color="blue" class="white--text"><i class="material-icons left">edit</i>Ilmoittautuminen</v-btn>
          </router-link>
        </v-col>
        <v-col>
          <router-link to="/overview">
            <v-btn large rounded color="primary"><i class="material-icons left">info</i>Kilpailun yleisnäkymä</v-btn>
          </router-link>
        </v-col> 
        <v-col  order="last">
          <router-link to="/results">
            <v-btn large rounded color="green" class="white--text"><i class="material-icons left">emoji_events</i>Tulokset</v-btn>
          </router-link>
        </v-col>
      </v-row>


      <!-- Tabs -->
      <v-tabs
        v-model="tab"
        background-color="blue lighten-2"
        color="basil"
        grow
      >
        <v-tabs-slider color="blue darken-4"></v-tabs-slider>
        <v-tab href="#weighting">Punnitus</v-tab>
        <v-tab href="#situation">Tilannekatsaus</v-tab>
        <v-tab href="#onwater">Vielä vesillä</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="background: rgba(0,0,0,0.4);">
        <!-- "Punnitus" tab --> 
        <v-tab-item class="inputarea" :value="'weighting'">
          <v-row v-if="!loading_site">
            <v-col>
              <v-row v-if="signees.length">
                <v-col>
                  <v-row>
                    <v-col>
                      <p class="flow-text center">Punnitus</p>
                    </v-col>
                  </v-row>
                  <v-row v-if="notification">
                    <v-col>
                      <v-alert type="success">
                        {{ notification }}
                      </v-alert>  
                    </v-col>
                  </v-row>
                  <v-row v-if="!loading">
                    <v-col class="input-fields" md="6" offset-md="3" style="padding:20px;">
                      <v-col md="6">
                        <p class="flow-text">Venekunnan numero</p>
                      </v-col>
                      <v-col class="d-flex" md="6">
                        <vue-select
                          class="flow-text input-fields"
                          label="boat_number"
                          placeholder="Valitse tai hae veneen numero"
                          v-model="boat_number_input"
                          v-on:input="fetchFromDatabase(boat_number_input ? boat_number_input.boat_number : -1)"
                          :options="sortedArray"
                        />
                      </v-col>
                                        
                    </v-col>
                  </v-row>

                  <v-row v-if="competition_boat">
                    <v-col md="8" offset-md="2">
                      <v-row class="title">
                        <v-col md="12">
                          <p class="flow-text">Valitun venekunnan tiedot</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Venekunnan numero</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Kapteeni</p>
                        </v-col>
                        <v-col md="4">
                          <p class="flow-text">Varakapteeni</p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">({{ competition_boat.boat_number }})</p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">{{ competition_boat.captain_name }}</p>
                        </v-col>
                        <v-col md="4" class="input-fields">
                          <p class="flow-text">
                            {{ competition_boat.temp_captain_name }}
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col md="4" offset-md="4">
                          <v-btn large block color="yellow" @click="clearInputs"><i class="material-icons left">backspace</i>Peruuta valinta</v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col md="12" style="margin:50px 50px">
                      <v-divider class="black"></v-divider>
                    </v-col>
                    <v-col md="10" offset-md="1">
                      <v-col>
                          <ul
                            id="fish_weights"
                            v-if="$store.getters.getCompetitionFishes.length"
                          >
                            <li>
                              <v-row v-if="!loading_fish">
                                <v-col md="3">
                                  <span
                                    class="flow-text"
                                  >Suurin kala?</span
                                  >
                                </v-col>                       
                                <v-col md="3" class="input-fields">
                                  <vue-select
                                    class="flow-text"
                                    label="name"
                                    placeholder="Valitse kalalaji painamalla"
                                    v-model="selected_fish"
                                    :options="competition_fishes"
                                  />
                                </v-col>                         
                                <v-col class="input-fields" md="3">
                                  <v-text-field
                                    label="Paino grammoina"
                                    v-model="biggest_fish"
                                    type="number"
                                    @paste.prevent
                                    @keypress="isNumber($event)"
                                    value="0"
                                    step="50"
                                    min="0"
                                    :rules="number_rules"
                                    :loading="loading_fish"
                                  />
                                </v-col>                              
                                <v-col md="3" >
                                  <v-btn v-if="selected_fish && biggest_fish" large tile color="green" @click="saveBiggestFish"><i class="material-icons left">add_box</i>Lisää kilpailuun</v-btn>
                                </v-col>
                              </v-row>
                              <v-row v-else>
                                <p class="flow-text">Lisätään kala tietokantaan...</p>
                                <ProgressBarQuery />
                              </v-row>
                              <v-row>
                                <v-col md="12">
                                  <v-divider class="black"></v-divider>
                                </v-col>
                              </v-row>
                            </li>
                            <li
                              v-for="(fish, index) in $store.getters
                                .getCompetitionFishes"
                              :key="fish.name"
                            >
                              <v-row>
                                <v-col md="6">
                                  <span class="flow-text">{{ index + 1 }}. </span
                                  ><span
                                    class="flow-text"
                                    :id="'fish_' + (index + 1) + '_name'"
                                    >{{ fish.name }}</span
                                  >
                                </v-col>
                                <v-col md="6" class="input-fields">
                                  <v-text-field
                                    label="Paino grammoina"
                                    :id="'fish_' + (index + 1) + '_weight'"
                                    type="number"
                                    @paste.prevent
                                    @keypress="isNumber($event)"
                                    value="0"
                                    step="50"
                                    min="0"
                                    :rules="number_rules"
                                    :loading="loading_fish"
                                  />
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col md="12">
                                  <v-divider class="black"></v-divider>
                                </v-col>
                              </v-row>
                            </li>
                          </ul>
                        <v-row v-if="!loading">
                          <v-col>
                            <v-btn large tile color="red" @click="saveToDatabase(true)"><i class="material-icons left">delete_forever</i>Nollaa</v-btn>
                          </v-col>
                          <v-col>
                            <v-btn large tile color="green" @click="saveToDatabase(false)"><i class="material-icons left">check</i>Tallenna</v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col>
                            <p class="flow-text">Päivitetään tiedot tietokantaan...</p>
                            <ProgressBarQuery />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <v-alert v-if="loading" type="info">
                      </v-alert>
                      <v-alert v-if="!searched" type="warning">
                        Venekuntaa ei valittuna
                      </v-alert>
                      <v-alert v-else type="error">
                        Numerolla ei löytynyt venekuntaa tietokannasta!
                      </v-alert>
                    </v-col>
                  </v-row >
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col>
                  <p class="flow-text">Kilpailussa ei vielä ilmoittautuneita!</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="loading_site">
            <v-col>
              <h2>Haetaan veneitä...</h2>
              <ProgressBarQuery />     
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Tilannekatsaus" tab --> 
        <v-tab-item class="inputarea" :value="'situation'">
          <v-row>
            <v-col>
              <v-row style="margin-top:20px">
                <v-col md="8" offset-md="2">
                  <p class="flow-text">Tilannekatsaus</p>
                </v-col>               
              </v-row>

              <v-row>
                <v-col md="8" offset-md="2" class="scroll_table">
                    <table
                      id="situation-table"
                      class="highlight centered responsive-table table_header tablearea"
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
                        <th v-if="signee.total_points > 0" class="center-align" style="border:1px solid black">
                          {{ index + 1 }}.
                        </th>
                        <th v-else class="center-align" style="border:1px solid black">
                          -
                        </th>
                        <td style="border:1px solid black">
                          ({{ signee.boat_number }})
                        </td>
                        <td style="border:1px solid black">
                          {{ signee.captain_name }}
                        </td>
                        <td style="border:1px solid black">
                          {{ signee.total_points.toLocaleString() }} p
                        </td>
                      </tr>
                    </tbody>
                  </table>  
                </v-col>
              </v-row>
              <v-row
                v-if="selected_id && result_signees.length"
              >
                <v-col md="8" offset-md="2" style="margin-top:30px;margin-bottom:30px">
                  <v-btn large tile color="blue" @click="searchSelected"><i class="material-icons left">assignment_return</i>Siirry punnitukseen</v-btn>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col md="8" offset-md="2" style="margin-top:30px;margin-bottom:30px">
                  <p
                    v-if="result_signees.length"
                    class="flow-text"
                  >
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <h3 v-else class="flow-text">Ei vielä tuloksia!</h3>
                </v-col>
              </v-row> 
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- "Vielä vesillä" tab -->
        <v-tab-item class="inputarea" :value="'onwater'">
          <v-row>
            <v-col>
              <v-row>
                <v-col md="8" offset-md="2" class="input-fields" style="margin-top:100px;">
                  <p
                    v-if="still_on_water.length"
                    class="flow-text"
                  >
                    Venekunnat, jotka ovat vielä vesillä
                  </p>
                  <p
                    v-else-if="!signees.length"
                    class="flow-text red--text"
                  >
                    Kilpailussa ei vielä ilmoittautuneita!
                  </p>
                  <p v-else class="flow-text green--text">
                    Kaikki venekunnat palanneet maaliin!
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="8" offset-md="2" class="scroll_table">
                  <table
                    id="on-water-table"
                    class="highlight centered responsive-table table_header tablearea"
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
                          ({{ signee.boat_number }})
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
                </v-col>
              </v-row>
              <v-row
                v-if="selected_id && still_on_water.length"
              >
                <v-col md="8" offset-md="2" style="margin-top:30px;margin-bottom:30px">
                  <v-btn large tile color="blue" @click="searchSelected"><i class="material-icons left">assignment_return</i>Siirry punnitukseen</v-btn>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col md="8" offset-md="2" style="margin-top:30px;margin-bottom:30px">
                  <p
                    v-if="still_on_water.length"
                    class="flow-text"
                  >
                    Voit siirtyä punnitukseen myös klikkaamalla haluamaasi riviä
                    taulukosta ja painamalla ilmestyvää nappulaa
                  </p>
                  <v-btn v-if="still_on_water.length" large tile color="grey darken-4" class="white--text" @click="allFinished" :loading="loading"><i class="material-icons left">check_circle_outline</i>Kaikki saapuneet maaliin</v-btn>
                </v-col>
              </v-row>
            </v-col>        
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>
<script>
    "use strict"
    import Timedate from "../components/layout/Timedate";
    import Header from "../components/layout/Header";
    import M from "materialize-css";
    import { options_picker } from "../i18n";
    import CompetitionService from "../CompetitionService";
    import ProgressBarQuery from "../components/layout/ProgressBarQuery";
    import "vue-select/dist/vue-select.css";

    export default {
      name: "Weighting",
      components: {
        Timedate,
        Header,
        ProgressBarQuery,
      },
      data() {
        return {
          tab: null,
          boat_number_input: null,
          competition_boat: null,
          calculated_total_weights: null,
          calculated_fish_weights: null,
          searched: false,
          selected_id: null,
          selected_boat_number: null,
          loading: false,
          loading_fish: false,
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
          number_rules: [
            value => !isNaN((value || '')) || 'Ei ole numero!',
            value =>  (value || '') >= 0  || 'Numeron pitää olla positiivinen!',
          ],
        };
      },
      computed: {
        // Keep array sorted based on boat number in "Punnitus" tab
        sortedArray(){
            return [...this.signees].sort((a, b) => a.boat_number - b.boat_number );
        }
      },
      mounted() {
        this.checkLogin();
        //Init materialize elements
        M.AutoInit();
        /* eslint-disable no-unused-vars */
        var collabs = document.querySelectorAll(".collapsible");
        var instances2 = M.Collapsible.init(collabs, options_picker);
        /* eslint-enable no-unused-vars */
        if(localStorage.getItem('competition') != null) {
            let competition_id = localStorage.getItem('competition');
            this.refreshCompetition(competition_id);
        }

        // Focus on top of the page when changing pages
        location.href = "#";
        location.href = "#app";
      },
      methods: {
        // Fetch competition from database, and update variables
        async refreshCompetition(competition_id) {
          this.loading_site = true;
          try {
            let competitions = await CompetitionService.getCompetition(competition_id);
            this.loading_site = false;
            if(competitions.length){
              // Update to vuex, Assing variables and arrays from vuex (see client/store/index.js)
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
        // "Kaikki päässeet maaliin" button pressed
        async allFinished() {
          // Mark all signees as returned
          this.signees.forEach(signee => {
            signee.returned = true;
          });
          // Update signees array to database/vuex
          let comp = this.$store.getters.getCompetition;
          comp.signees = this.signees;
          this.$store.commit("refreshCompetition", comp);
          try {
            this.loading = true;
            await CompetitionService.updateCompetition(comp._id, comp);
            this.loading = false;
            this.still_on_water = this.$store.getters.getStillOnWaterSignees;
            M.toast({ html: "Kaikki kilpailijat merkattu maaliin saapuneeksi!" });
          } catch (err) {
            console.log(err.message);
          }
        },
        // Check if input value is number, and only accept numbers to inputs
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
        // Fetch signee from vuex based on boat number
        // Check client\src\store\index.js for implementation
        searchBoatNumber: function(boat_number) {
            return this.$store.getters.getSigneeByBoatNumber(parseInt(boat_number));
        },
        // Select row from table, if selected --> unselect
        // selected_id bound to selected css class (on App.vue)
        selectRow: function(id, boat_number) {
          if (id == this.selected_id) {
            this.selected_id = null;
            this.selected_boat_number = null;
          } else {
            this.selected_id = id;
            this.selected_boat_number = boat_number;
          }
        },
        // Set input weights for each fish for the signee
        setInputWeights: function() {
          let competition_fishes = this.$store.getters.getCompetitionFishes;
          // Loop trhough all the competition fishes
          for (let i = 1; i < competition_fishes.length + 1; i++) {
            let fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
            // find the fish weights based on the fish_name, from signees weights array
            let fish_weights = this.competition_boat.weights.find(
              (fish) => fish.name === fish_name
            ).weights;
            // Assign the value to input
            document.getElementById(`fish_${i}_weight`).value = fish_weights;
          }
        },
        // Search signee from database when selected from table
        searchSelected: function() {
          // Change tab to "Punnitus" and fetch
          this.tab = "weighting";
          let temp_boat_number = this.selected_boat_number;
          this.selected_id = null;
          this.selected_boat_number = null;
          this.fetchFromDatabase(temp_boat_number);
        },

        fetchFromDatabase: function(boat_number) {
          // If boat_number_input is empty, boat_number = -1
          // If boat_number selected on input
          if(boat_number !== -1) {
            this.searched = true;
            this.notification = null;
            this.competition_boat = this.searchBoatNumber(boat_number);
            if (this.competition_boat) {
              //Wait for render to set weights to inputs
              this.$nextTick(() => this.setInputWeights());
              this.boat_number_input = this.competition_boat;
            } else {
              console.log("No such boat in list!");
            }
          }
          else {
              // No boat selected, clear inputs
              this.clearInputs();
          }
        },

        // Save biggest fish to database
        async saveBiggestFish() {
          // If name for biggest fish, boat number and weight for biggest fish all have been selected
          if(this.selected_fish.name && this.boat_number_input && this.biggest_fish){
            // Create fish object
            let fish = {name: this.selected_fish.name, boat_number: this.boat_number_input.boat_number, captain_name:this.boat_number_input.captain_name , weight: this.biggest_fish};
            this.$store.commit("addBiggestFish", fish);
            this.biggest_fishes = this.$store.getters.getBiggestFishes;
            // Create competition object and update it to database
            let comp = this.$store.getters.getCompetition;
            comp.biggest_fishes = this.biggest_fishes;
            this.$store.commit("refreshCompetition", comp);
            try {
              this.loading_fish = true;
              await CompetitionService.updateCompetition(comp._id, comp);
              this.notification = `Tiedot päivitetty tietokantaan!`;
              this.loading_fish = false;
              this.selected_fish = null,
              this.biggest_fish = null;
            } catch (err) {
              console.log(err.message);
            }
            M.toast({ html: "Isoin kala tallennettu listaan!" });
          }
          else {
            console.log("Jokin input tyhjänä:");
            let fish = {name: this.selected_fish.name, boat_number: this.boat_number_input.boat_number, captain_name:this.boat_number_input.captain_name , weight: this.biggest_fish};
            console.log(fish);
          }

        },
        // Save all weights to database
        async saveToDatabase(reset) {
          let competition_fishes = this.$store.getters.getCompetitionFishes;
          let fish_weights = [];
          let total_weights = 0;
          let total_points = 0;
          let fish_weight = 0;
          let fish_points = 0;
          let fish_name;
          this.biggest_fishes = this.$store.getters.getBiggestFishes;

          // if biggest fish not yet saved, save it
          if(this.selected_fish && this.boat_number_input && this.biggest_fish){
            let fish = {name: this.selected_fish.name, boat_number: this.boat_number_input.boat_number, captain_name:this.boat_number_input.captain_name , weight: this.biggest_fish};
            this.$store.commit("addBiggestFish", fish);
            this.biggest_fishes = this.$store.getters.getBiggestFishes;
            this.selected_fish = null,
            this.biggest_fish = null;
          }
          //if reset == true, reset current weights to 0, otherwise update weights from inputs
          if (reset) {
            this.competition_boat.returned = false;
            // For every fish, reset weights/points and add them to array
            for (let i = 1; i < competition_fishes.length + 1; i++) {
              fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
              fish_weights.push({
                name: fish_name,
                weights: fish_weight,
                points: fish_points,
              });
              // If there are biggest fishes in competition
              if(this.biggest_fishes) {
                // If there are biggest fishes from certain fish_name
                if(this.biggest_fishes[fish_name]) {
                  // Check if signee has biggest fish there
                  let index = this.biggest_fishes[fish_name].findIndex(item => {
                    return (parseInt(this.boat_number_input.boat_number) === parseInt(item.boat_number));
                  });
                  // If fish found, delete it
                  if (index > -1) {
                    this.biggest_fishes[fish_name].splice(index, 1);
                  }
                }
              }
              // If there are fish amounts in competition
              if(this.biggest_amounts) {
                // If there are fish amounts from certain fish_name
                if(this.biggest_amounts[fish_name]) {
                  // Check if signee has biggest fish there
                  let index = this.biggest_amounts[fish_name].findIndex(item => {
                    return (parseInt(this.boat_number_input.boat_number) === parseInt(item.boat_number));
                  });
                  if (index > -1) {
                    // If fish found, delete it
                    this.biggest_amounts[fish_name].splice(index, 1);
                  }
                }
              }
            }

          }
          // Don't reset points, add new values
          else {
            this.competition_boat.returned = true;
            // For every fish, get values from inputs
            for (let i = 1; i < competition_fishes.length + 1; i++) {
              fish_name = document.getElementById(`fish_${i}_name`).innerHTML;
              fish_weight = parseInt(
                document.getElementById(`fish_${i}_weight`).value
              );
              // Get points multiplier for this certain fish for points calculation
              let points_multiplier = competition_fishes.find(
                (fish) => fish.name === fish_name
              ).multiplier;
              fish_points = fish_weight * points_multiplier;
              // Add fish object to array
              fish_weights.push({
                name: fish_name,
                weights: fish_weight,
                points: fish_points,
              });
              // Create biggest fish amount object and store to vuex
              let fish = {name: fish_name, boat_number: this.competition_boat.boat_number, captain_name:this.competition_boat.captain_name , weight: fish_weight};
              this.$store.commit("addBiggestAmount", fish);
              this.biggest_amounts = this.$store.getters.getBiggestAmounts;
              total_weights += fish_weight;
              total_points += fish_points;
            }
          }

          this.competition_boat.weights = fish_weights;
          this.competition_boat.total_weights = total_weights;
          this.competition_boat.total_points = total_points;
          // If there is signee with save number, replace in vuex
          // Check implementation from 'client\src\store\index.js'
          this.$store.commit("replaceSignee", this.competition_boat);
          let comp = this.$store.getters.getCompetition;
          // Get signees from vuex
          comp.signees = this.$store.getters.getCompetitionSignees;
          comp.biggest_fishes = this.biggest_fishes;
          comp.biggest_amounts = this.biggest_amounts;

          // Update competition state
          if (this.still_on_water.length) {
            comp.state = "Punnitus";
          } else {
            comp.state = "Kaikki maalissa";
          }
          // Refresh to vuex
          this.$store.commit("refreshCompetition", comp);
          try {
            this.loading = true;
            this.loading_fish = true;
            await CompetitionService.updateCompetition(comp._id, comp);
            this.notification = `Tiedot päivitetty tietokantaan!`;
            this.loading = false;
            this.loading_fish = false;
            this.searched = false;
            // Update values for next signee
            this.selected_boat_number = this.competition_boat.boat_number + 1;
            this.competition_boat = null;
            this.signees = comp.signees;
            this.calculated_total_weights = this.$store.getters.getCompetitionTotalWeights;
            this.result_signees = this.$store.getters.getResultSignees;
            this.still_on_water = this.$store.getters.getStillOnWaterSignees;
          } catch (err) {
            console.log(err.message);
          }
        },
        // Clear all inputs and selections
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
