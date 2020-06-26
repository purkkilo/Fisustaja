<template>
  <div class="container">
    <Timedate />
    <div id="errordiv" v-if="errors.length">
      <ul class="collection with-header">
        <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
        <li class="collection-item" id="error" v-for="(error,index) in errors" v-bind:key="index">{{ index+1}}. {{ error }}</li>
      </ul>
    </div>

    <div class="container-transparent">
      <div class="section">
          <div class="col s12 center-align"><h1>Ilmoittautuminen</h1></div>
      </div>
      <div class="row">
          <div class="col s4">
          <router-link to="/comp-settings">
            <a class="waves-effect waves-light grey btn" ><i class="material-icons left">tune</i>Määritykset</a>
          </router-link></div>

          <div class="col s4">
            <router-link to="/overview"><a class="waves-effect waves-light btn"
              ><i class="material-icons left">info</i>Kilpailun yleisnäkymä</a
              >
            </router-link>
          </div>

          <div class="col s4">
            <router-link to="/weighting"><a class="waves-effect waves-light blue darken-2 btn"
              ><i class="material-icons left">fitness_center</i>Punnitus</a
              >
            </router-link>
          </div>

      </div>

      <div class="row">
        <ul class="tabs">
          <li class="tab col s6" id="signing-tab"><a class="active" href="#signing">Ilmoittautuminen</a></li>
          <li class="tab col s6" id="signees-tab"><a href="#signees-div">Ilmoittautuneet</a></li>
        </ul>
      </div>

      <div id="signing" class="col s12 inputarea">
        <div v-if="!loading_site">
          <div class="section center-align">
            <p class="flow-text">Ilmoittautuminen</p>
          </div>

          <div v-if="notification" class="section center-align">
            <p class="flow-text green lighten-1 center-align" id="notification">{{ notification }}</p>
          </div>
          <div v-if="old_info" class="section center-align">

            <div id="old-info-container col s6">
              <h3>Numeron ({{ old_info.boat_number }}.) Vanhat tiedot</h3>
              <p class="flow-text"><b>Kapteeni:</b> {{ old_info.captain_name }}</p>
              <p class="flow-text"><b>Varakapteeni:</b> {{ old_info.temp_captain_name }}</p>
              <p class="flow-text"><b>Seura/Paikkakunta:</b> {{ old_info.locality }}</p>
              <p class="flow-text"><b>Lähtöpaikka:</b> {{ old_info.starting_place }}</p> 
              <p v-if="isTeamCompetition" class="flow-text"><b>Joukkue:</b> {{ old_info.team }}</p>           
            </div>
            <div class="divider black"></div>
            <div id="new-info-container col s6">
              <h3>Numeron ({{ boat_number }}.) Uudet tiedot</h3>
              <p class="flow-text"><b>Kapteeni:</b> {{ captain_name }}</p>
              <p class="flow-text"><b>Varakapteeni:</b> {{ temp_captain_name }}</p>
              <p class="flow-text"><b>Seura/Paikkakunta:</b> {{ locality }}</p>
              <p class="flow-text"><b>Lähtöpaikka:</b> {{ starting_place }}</p> 
              <p v-if="isTeamCompetition" class="flow-text"><b>Joukkue:</b> {{ team }}</p>  
            </div>
            <div class="row">
              <a v-on:click="overwriteSignee(old_info, false)" class="waves-effect waves-light yellow btn black-text col s4 push-s1"><i class="material-icons left">backspace</i>Peruuta</a>
              <a v-on:click="overwriteSignee(old_info, true)" class="waves-effect waves-light green btn col s4 push-s3"><i class="material-icons left">check</i>Päällekirjoita</a>
            </div>
            <div class="divider black" style="margin-bottom:20px"></div>
          </div>
          <div v-if="!old_info" id="signing-inputs" class="row">
              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <input
                    id="boat_number"
                    v-model="boat_number"
                    @paste.prevent
                    @keypress="isNumber($event)"
                    name="boat_number"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    type = "number"
                    maxlength = "6"
                    min="1"
                    step="1"
                    class="validate"
                  >
                  <label for="boat_number" class="flow-text black-text">Venekunnan numero</label>
                </div>
                <div class="col s12" style="margin-top: 20px;">
                  <a class="waves-effect waves-light blue btn col s4 push-s4" v-on:click="searchSelected"><i class="material-icons left">info</i>Hae numerolla</a>
                </div>
                
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <input
                    id="captain_name"
                    v-model="captain_name"
                    type="text"
                    class="validate"
                    maxlength="40"
                  >
                  <label for="captain_name" class="flow-text black-text">Kapteeni</label>
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <input
                    id="temp_captain_name"
                    v-model="temp_captain_name"
                    placeholder="Ei pakollinen"
                    type="text"
                    class="validate"
                    maxlength="40"
                  >
                  <label for="temp_captain_name" class="flow-text black-text">Varakapteeni</label>
                </div>
              </div>

              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <input
                    id="locality"
                    v-model="locality"
                    type="text"
                    class="validate"
                    maxlength="40"
                  >
                  <label for="locality" class="flow-text black-text">Seura/Paikkakunta</label>
                </div>
              </div>


              <div class="row">
                <div class="input-fields col s8 push-s2">
                  <input
                    id="starting_place"
                    v-model="starting_place"
                    name="starting_place"
                    placeholder="Ei pakollinen"
                    type="text"
                    class="validate"
                    maxlength="40"
                  >
                  <label for="starting_place" class="flow-text black-text">Lähtöpaikka</label>
                </div>
              </div>

              <div class="row" v-if="isTeamCompetition">
                <div class="input-fields col s8 push-s2">
                  <v-select
                    class="flow-text title"
                    taggable
                    placeholder="Valitse, tai kirjoita tiimin nimi"
                    v-model="team"
                    :options="teams"
                  />
                  <span class="flow-text black-text">Joukkue</span>
                </div>
              </div>
            </div>
            <div v-if="!old_info" class="row center-align">
              <div v-if="loading">
                <p class="flow-text">Päivitetään tiedot tietokantaan...</p>
                <ProgressBarQuery />
              </div>
              <div v-else>
                <a v-on:click="clearInputs" class="waves-effect waves-light yellow black-text btn-large col s4 offset-s2"><i class="material-icons left">backspace</i>Pyyhi Kentät</a>
                <a v-on:click="validateInfo" class="waves-effect waves-light green black-text btn-large col s3 offset-s1"><i class="material-icons right">save_alt</i>Tallenna</a>
              </div>
            </div>
        </div>
        <div v-else>
          <h2>Haetaan veneitä...</h2>
          <ProgressBarQuery />        
        </div>
      </div>
      <div id="signees-div" class="col s12">
        <div class="center-align col s4 inputarea">
          <p class="flow-text">Ilmoittautuneita yhteensä: <b>{{ signees.length }}</b></p>
        </div>
        <div>
          <table id="signees-table" class="highlight centered responsive-table fixed_header tablearea" v-if="signees.length">
            <thead>
              <tr>
                <th>Nro.</th>
                <th>Kapteeni</th>
                <th>Varakapteeni</th>
                <th>Seura/Paikkakunta</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="selectRow(signee.id)" :class="{ selected : selected_id == signee.id }" v-for="(signee, index) in signees" :key="index">
                  <th class="center-align" style="border:1px solid black">{{ signee.boat_number }} ({{ signee.id }})</th>  
                  <td style="border:1px solid black">{{ signee.captain_name }}</td> 
                  <td style="border:1px solid black">{{ signee.temp_captain_name }}</td>
                  <td style="border:1px solid black">{{ signee.locality }}</td>   
              </tr>
              </tbody>
          </table>
        </div>
        <div v-if="selected_id" class="section inputarea">
          <div class="col s12 center-align"><a class="waves-effect waves-light blue btn" v-on:click="searchSelected"><i class="material-icons left">info</i>Näytä valitun ilmoittautumistiedot</a></div>
        </div>
        <div v-else class="section inputarea center-align">
          <p v-if="signees.length" class="flow-text">Voit katsella venekunnan tietoja myös klikkaamalla haluamaasi riviä taulukosta ja painamalla ilmestyvää nappulaa</p>
          <h3 v-else class="center-align">Ei ilmoittautuneita!</h3>
        </div>
      </div>
      
    </div>
  </div>
</template>
<script>
import Timedate from '../components/layout/Timedate';
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import M from 'materialize-css';
import { options_picker } from '../i18n';
import CompetitionService from '../CompetitionService';
import "vue-select/dist/vue-select.css";

export default {
    name: 'Signing',
    components: {
      Timedate,
      ProgressBarQuery
    },
    data() {
      return {
          errors: [],
          boat_number: null,
          starting_place: null,
          captain_name: null,
          temp_captain_name: null,
          locality: null,
          team: null,
          selected_id:null,
          id: 1,
          new_signee:null,
          notification: null,
          loading: false,
          loading_site: false,
          old_info: null,
          signees: [],
          teams: [],
          maxlength: 40,
          isTeamCompetition: false,
      }
    },
    created() {
    },
    mounted() {
      this.checkLogin();
      if(localStorage.getItem('competition') != null) {
          let competition_id = localStorage.getItem('competition');
          this.refreshCompetition(competition_id);
      }
      this.initMaterialize();
    },
    methods: {
        async refreshCompetition(competition_id) {
          this.loading_site = true;
          try {
            let competitions = await CompetitionService.getCompetition(competition_id);
            this.loading_site = false;
            if(competitions.length){
                this.$store.commit('refreshCompetition', competitions[0]);
                this.isTeamCompetition = this.$store.getters.isTeamCompetition;
                this.signees =  this.$store.getters.getSignees;
                this.teams = this.$store.getters.getTeams;

                if (this.signees.length) {
                    this.boat_number = Math.max.apply(Math, this.signees.map(function(o) { return o.boat_number; })) + 1;
                    this.id = Math.max.apply(Math, this.signees.map(function(o) { return o.id; })) + 1;
                }
                else {
                  this.boat_number = 1;
                  this.id = 1;
                }   
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
        initMaterialize: function() {
          M.AutoInit();
          /* eslint-disable no-unused-vars */
          var tabs = document.querySelectorAll('.tabs');
          var instance = M.Tabs.init(tabs, options_picker);
          var elem = document.querySelectorAll('.tabs')[0];
          /* eslint-enable no-unused-vars */
          this.tabs = M.Tabs.getInstance(elem);
        },
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
              evt.preventDefault();
            } else {
              if(charCode == 46) {
                evt.preventDefault();
              }
              else {
                return true;
              }
            }
        },
        clearInputs: function() {
            this.boat_number = null;
            this.starting_place = null;
            this.captain_name = null;
            this.temp_captain_name = null;
            this.locality = null;
            this.team = null;
            this.errors = [];
            this.old_info = null;
        },
        overwriteSignee: function(signee, overwrite) {
            overwrite === true ? console.log("Overwrite!") : console.log("Don't overwrite!")
            if(overwrite) {
                // Remove old data
                this.$store.commit("removeSignee", signee);
                // Replace the old existing signee info with new info, without changing the id
                signee.boat_number = parseInt(this.boat_number);
                signee.starting_place = this.starting_place;
                signee.captain_name = this.captain_name;
                signee.temp_captain_name = this.temp_captain_name;
                signee.locality = this.locality;
                signee.team = this.team;
                if (this.team.length > 40) {
                    let temp_team = this.team;
                    temp_team = temp_team.slice(0, 40);
                    this.team = temp_team; // Set the name back, shortened
                    this.showError("Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin)!");
                }
                else {
                  //If the array doensn't have the team name already
                  if(this.teams.indexOf(this.team) == -1) {
                    this.teams.push(this.team);
                    this.$store.commit('setTeams', this.teams);
                  }
                  this.saveToDatabase(signee, true);
                  this.clearInputs();
                  this.boat_number = Math.max.apply(Math, this.signees.map(function(o) { return o.boat_number; })) + 1;
                  this.notification = "Tiedot korvattu uusilla!";
                }

            }
            else {
              this.notification = "Veneen numero asetettu ensimmäiseen vapaaseen paikkaan!";
              this.boat_number = Math.max.apply(Math, this.signees.map(function(o) { return o.boat_number; })) + 1;
              this.old_info = null;
            }
        },
        searchSelected: function() {
            this.notification = null;
            
            //Signing tab
            if(this.tabs.index == 0) {
                if(this.boat_number){
                    let found_signee = this.searchBoatNumber(this.boat_number);

                    if(found_signee){
                        this.notification = `Venekunta löydetty!\n(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
                        this.selected_id = found_signee.id;
                        this.boat_number = found_signee.boat_number;
                        this.starting_place = found_signee.starting_place;
                        this.captain_name = found_signee.captain_name;
                        this.temp_captain_name = found_signee.temp_captain_name;
                        this.locality = found_signee.locality;
                        this.team = found_signee.team;                   
                    }
                    else {
                        let temp_boat_number = this.boat_number;
                        this.clearInputs();
                        this.boat_number = temp_boat_number;
                        this.notification = "Tällä numerolla ei ole vielä ilmoitettu venekuntaa!"
                        this.selected_id = null;
                    }
                }
                else {
                    this.notification = `Syötä venekunnan numero ennen hakemista!`;
                }
            }

            else {
                // Signees tab (tab with this.tab.index = 1)
                if(this.selected_id){
                    let search_id = this.selected_id;
                    if(search_id){
                        var found_signee = this.$store.getters.getSigneeById(search_id);
                        
                        if (found_signee){
                            this.notification = `Venekunnan tiedot:\n(${found_signee.boat_number}) : ${found_signee.captain_name}, ${found_signee.temp_captain_name}`;
                            this.boat_number = found_signee.boat_number;
                            this.starting_place = found_signee.starting_place;
                            this.captain_name = found_signee.captain_name;
                            this.temp_captain_name = found_signee.temp_captain_name;
                            this.locality = found_signee.locality;
                            this.team = found_signee.team; 
                            this.tabs.select('signing');
                        }
                        else {
                            this.clearInputs();
                            this.notification = "Tällä numerolla ei ole vielä ilmoitettu venekuntaa!";
                        }
                    }
                    else {
                        this.errors = [];
                        this.showError("Valitse ilmoittautuneideiden listalta venekunta ennen hakemista!");
                    }
                }
                else {
                    this.errors = [];
                    this.showError("Valitse ilmoittautuneideiden listalta venekunta ennen hakemista!");
                }

            }
        },
        selectRow:function(id){
            if(id == this.selected_id){
                this.selected_id = null;
            }
            else {
                this.selected_id = id;
            }

        },
        searchBoatNumber: function(boat_number) {
            return this.$store.getters.getSigneeByBoatNumber(parseInt(boat_number));
        },
        searchId: function(id) {
            var search_id = parseInt(id);
            return this.$store.getters.getSigneeById(search_id);
        },
        showError: function(error) {
            this.errors.push(error);
            M.toast({html: error});
            location.href = "#";
            location.href = "#app";
        },
        async saveToDatabase(new_signee, replace) {
            //if replace == true, replace existing info, otherwise add new signee
            replace === true ? this.$store.commit('replaceSignee', new_signee) : this.$store.commit('addSignee', new_signee);
            let comp = this.$store.getters.getCompetition;
            this.signees = this.$store.getters.getSignees;
            comp.signees = this.signees;
            comp.state = "Ilmoittautuminen";
            this.$store.commit('refreshCompetition', comp);
            try{
              this.loading = true;
              await CompetitionService.updateCompetition(comp._id, comp);
              console.log("Updated to database!");
              this.loading = false;
            } catch(err) {
              console.log(err.message);
            } 
        },
        // TODO input validation
        validateInfo: function() {
            this.notification = null;
            this.errors = [];

            if (!this.boat_number) {
                this.showError('Venekunnan kilpailunumero puuttuu!');
            }

            if (!this.captain_name) {
                this.showError('Kapteenin nimi puuttuu!');
            }

            if(!this.starting_place) {
                this.starting_place = "-";
            }
            if(!this.team) {
                this.team = "-";
            }
            if (this.team.length > 40) {
              let temp_team = this.team
              temp_team = temp_team.slice(0, 40);
              this.team = temp_team; // Set the name back, shortened
              this.showError("Valitse tiimin nimeksi alle 40 merkkiä pitkä nimi (nimi lyhennetty 40 merkkiin, valittavissa pudotusvalikosta)!");
            }

            if (!this.temp_captain_name) {
                this.temp_captain_name = "-";
            }

            if (!this.locality) {
                this.showError('Seura/Paikkakunta puuttuu!');
            }

            if(!this.errors.length) {
                // If selected on the signees list or with the search button
                if(this.selected_id) {
                  // If id on signees
                  let found_signee = this.searchId(this.selected_id);
                  if (found_signee) {
                      let temp_boat = this.searchBoatNumber(this.boat_number);
                      // If there already exist a boat with same number, but it isn't the same id
                      if(temp_boat && (temp_boat.id != found_signee.id)){
                        console.log("Boat number already exists...");
                        this.old_info = temp_boat;
                      }
                      else {
                          // If there isn't any boats with this boat number
                          found_signee.boat_number = parseInt(this.boat_number);
                          found_signee.starting_place = this.starting_place;
                          found_signee.captain_name = this.captain_name;
                          found_signee.temp_captain_name = this.temp_captain_name;
                          found_signee.locality = this.locality;
                          found_signee.team = this.team;
                          this.new_signee = found_signee;
                          this.saveToDatabase(this.new_signee, true);
                          if(this.teams.indexOf(this.team) == -1) {
                            this.teams.push(this.team);
                            this.$store.commit('setTeams', this.teams);
                          }
                          console.log("Updating info...");
                          M.toast({html: `Päivitetty venekunnan (Nro: ${this.new_signee.boat_number}, Kapteeni: ${this.new_signee.captain_name}) Tiedot!`});
                          this.clearInputs();
                          this.boat_number = Math.max.apply(Math, this.signees.map(function(o) { return o.boat_number; })) + 1;
                          this.id = Math.max.apply(Math, this.signees.map(function(o) { return o.id; })) + 1;
                          this.selected_id = null;
                      }
                  }
                }
                else {
                    // No selected id, so new input
                    let temp_boat = this.searchBoatNumber(this.boat_number)
                    // IF there is boat with same boat number, and somehow with this id
                    if(temp_boat && (temp_boat.id != this.id)){
                      console.log("Boat number already exists...");
                      this.notification =`Numerolla on jo olemassa venekunta, päällekirjoitetaanko?`;
                      this.old_info = temp_boat;
                    }
                    else {
                        // Otherwise create new signee
                        let competition_fishes =  this.$store.getters.getCompetitionFishes;
                        let weights = [];
                        // fish specific points and weights
                        competition_fishes.forEach(element => {
                            let fish = {
                              name: element.name,
                              weights: 0,
                              points: 0,
                            }
                            weights.push(fish);
                        });
                        // Add all the info together and save to database
                        this.new_signee = {
                            id: this.id,
                            boat_number: parseInt(this.boat_number),
                            starting_place: this.starting_place,
                            captain_name: this.captain_name,
                            temp_captain_name: this.temp_captain_name,
                            locality: this.locality,
                            team: this.team,
                            total_points: 0,
                            total_weights: 0,
                            returned: false,
                            weights: weights
                        };
                        this.saveToDatabase(this.new_signee, false);
                        if(this.teams.indexOf(this.team) == -1) {
                          this.teams.push(this.team);
                          this.$store.commit('setTeams', this.teams);
                        }
                        M.toast({html: `Venekunta ilmoitettu kisaan! (Nro: ${this.new_signee.boat_number}, Kapteeni: ${this.new_signee.captain_name})`});
                        this.clearInputs();
                        this.boat_number = Math.max.apply(Math, this.signees.map(function(o) { return o.boat_number; })) + 1;
                        this.id = Math.max.apply(Math, this.signees.map(function(o) { return o.id; })) + 1;
                        this.selected_id = null;
                    }                  
                }

            }


        },
    },
}
</script>

<style>
#old-info-container {
    border: 1px solid black;
}

#new-info-container {
    border: 1px solid black;  
}

</style>