<template>
  <div id="app">
      <div class="container">
      <Timedate />

      <div id="errordiv" v-if="errors.length">
        <ul class="collection with-header">
          <li class="collection-header"><h4>Korjaa seuraavat virheet:</h4></li>
          <li class="collection-item flow-text" id="error" v-for="(error,index) in errors" v-bind:key="index">{{ index+1}}. {{ error }}</li>
        </ul>
      </div>

        <div class="container-transparent">
            <div class="section">
                <div class="col s12 center-align"><h1>Kilpailun luonti</h1></div>
            </div>

            <div class="row">
              <div class="col s12">
                <ul class="tabs">
                  <li class="tab col s3" id="info-tab"><a class="active" href="#basic-info">1. Perustiedot</a></li>
                  <li class="tab col s3 disabled" id="fishes-tab"><a href="#fishes">2. Kilpailun kalalajit</a></li>
                  <li class="tab col s3 disabled" id="points-tab"><a href="#points">3. Pistekertoimet ja alamitat</a></li>
                  <li class="tab col s3 disabled" id="summary-tab"><a href="#summary">4. Yhteenveto</a></li>
                </ul>
              </div>
              <div id="basic-info" class="col s12 inputarea">
                <p class="center-align flow-text">Kilpailun perustiedot</p>
                <p v-if="basic_info_validated" class="flow-text yellow lighten-1 center-align">Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata tietoja</p>
                <div id="basic-inputs" class="row">
                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="competition_name"
                        v-model="competition_name"
                        name="competition_name"
                        type="text"
                        class="validate"
                        maxlength="40"
                      >
                      <label for="competition_name" class="flow-text black-text">Kilpailun nimi</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="cup_name"
                        v-model="cup_name"
                        name="cup_name"
                        type="text"
                        class="validate"
                        maxlength="40"
                      >
                      <label for="cup_name" class="flow-text black-text">Cup nimi</label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="cup_points_multiplier"
                        v-model="cup_points_multiplier"
                        oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                        type = "number"
                        maxlength = "3"
                        class="validate"
                        value=1
                        step=0.1
                        min=0.1
                      >
                      <label for="cup_points_multiplier" class="flow-text black-text">Cup pistekerroin</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="date_of_competition"
                        v-model.lazy="date_of_competition"
                        name="date_of_competition"
                        type="text"
                        class="datepicker validate"
                        maxlength="10"
                      >
                      <label for="date_of_competition" class="flow-text black-text">Päivämäärä</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="start_of_competition"
                        v-model.lazy="start_of_competition"
                        name="time_of_competition"
                        type="text"
                        class="timepicker"
                        maxlength="10"
                      >
                      <label for="start_of_competition" class="flow-text black-text">Kilpailun alkamisaika</label>
                    </div>
                  </div>

                  <div class="row">
                    <div class="input-fields col s8 push-s2">
                      <input
                        id="end_of_competition"
                        v-model.lazy="end_of_competition"
                        name="end_of_competition"
                        type="text"
                        class="timepicker"
                        maxlength="10"
                      >
                      <label for="end_of_competition" class="flow-text black-text">Kilpailun loppumisaika</label>
                    </div>
                  </div>
                  <div class="row">
                    <a v-if="!basic_info_validated" v-on:click="checkBasicInformation" class="col s4 offset-s4 waves-effect waves-light green btn-large"><i class="material-icons left">check</i>Jatka</a>
                  </div>
                </div>
                <div v-if="basic_info_validated" class="row center-align">
                  <a v-on:click="disableInputs(false)" class="waves-effect waves-light grey btn-large col s4 offset-s2"><i class="material-icons left">settings</i>Muuta tietoja</a>
                  <a v-on:click="tabs.select('fishes')" class="waves-effect waves-light green btn-large col s3 offset-s1"><i class="material-icons right">arrow_forward</i>Jatka</a>
                </div>
              </div>
              <div id="fishes" class="col s12 inputarea">
                <p class="flow-text center-align">Kalalajien valitseminen kilpailuun</p>
                <p v-if="fish_species_validated" class="flow-text yellow lighten-1 center-align">Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata tietoja</p>
                <div class="row section" id="fishes_select"  style="height:400px;">
                  <p class="center-align">(Valitse allaolevasta laatikosta, voi myös lisätä oman kalalajin kirjoittamalla)</p>
                  <v-select class="col s10 push-s1 flow-text" taggable multiple push-tags v-model="selected" :options="options" />
                </div>
      
                <div class="divider black"></div>

                <div class="section center-align">
                  <div v-if="!fish_species_validated" class="row">
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light blue lighten-2 btn-large col s4" v-on:click="tabs.select('basic-info')"><i class="material-icons left">arrow_back</i>Takaisin</a>
                    <div class="col s1"></div>
                    <a v-on:click="checkFishSpecies" class="waves-effect waves-light green btn-large col s4"><i class="material-icons left">check</i>Jatka</a>
                  </div>
                  <div v-else class="row">
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light blue lighten-2 btn-large col s2" v-on:click="tabs.select('basic-info')"><i class="material-icons left">arrow_back</i>Takaisin</a>
                    <div class="col s1"></div>
                    <a v-on:click="disableInputs(false)" class="waves-effect waves-light grey btn-large col s3"><i class="material-icons left">settings</i>Muuta tietoja</a>
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light green btn-large col s2" v-on:click="tabs.select('points')"><i class="material-icons right">arrow_forward</i>Jatka</a>
                    <div class="col s1"></div>
                  </div>                  
                </div>
              </div>

              <div id="points" class="col s12 inputarea">
                <p class="flow-text center-align">Syötä kaloille pistekertoimet ja alamitat</p>
                <p v-if="fish_specs_validated" class="flow-text yellow lighten-1 center-align">Tiedot lukittuna, paina "Muuta tietoja" jos haluat vielä muokata tietoja</p>
                <div class="specs" id="select_specs">
                  <ul id="fish_specs" v-if="selected.length">
                    <li id="fish_spec" v-for="(fish, index) in selected" :key="fish">
                      <div class="row">
                        <span class="flow-text" :id="'fish_'+ (index + 1) +'_name'">{{ index+1 }}. {{ fish }}</span>
                      </div>
                      <div class="row input-fields">
                        <div class="col s6 push-s2">
                          <span class="flow-text">Pistekerroin</span>
                        </div>
                        <div class="col s4">
                          <input
                            :id="'fish_' + (index + 1) + '_multiplier'"
                            type="number"
                            class="validate"
                            value=1
                            step=0.1
                            min=0
                          >
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12 input-fields">
                          <div class="col s6 push-s2">
                            <span class="flow-text">Alamitta</span>
                          </div>
                          <div class="col s4">
                            <input
                              :id="'fish_' + (index + 1) + '_minsize'"
                              type="number"
                              class="validate"
                              value=0
                              step=0.1
                              min=0
                            >
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <p v-else class="flow-text center-align">Yhtään kalaa ei ole valittu!</p>
                </div>

                <div class="row section">
                  <div v-if="selected.length && !validated" class="row">
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light blue lighten-2 btn-large col s4" v-on:click="tabs.select('fishes')"><i class="material-icons left">arrow_back</i>Takaisin</a>
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light green btn-large col s4" v-on:click="checkFishSpecs"><i class="material-icons left">check</i>Tarkista tiedot</a>
                  </div>
                  <div v-else class="row">
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light blue lighten-2 btn-large col s2" v-on:click="tabs.select('fishes')"><i class="material-icons left">arrow_back</i>Takaisin</a>
                    <div class="col s1"></div>
                    <a v-on:click="disableInputs(false)" class="waves-effect waves-light grey btn-large col s3"><i class="material-icons left">settings</i>Muuta tietoja</a>
                    <div class="col s1"></div>
                    <a class="waves-effect waves-light green btn-large col s2" v-on:click="tabs.select('summary')"><i class="material-icons right">arrow_forward</i>Jatka</a>
                    <div class="col s1"></div>
                  </div>
                </div>

              </div>

              <div id="summary" class="col s12 inputarea">
                <div v-if="!loading">
                  <div class="basic_summary row section">
                    <div class="center-align col s8 push-s2">
                      <table class="striped centered responsive-table highlight">
                        <caption class="flow-text">Perustiedot</caption>  
                          <tr>
                            <th style="border:1px solid black;">Kilpailu</th>
                            <td style="border:1px solid black;" class="center-align">{{ competition_name }}</td>
                          </tr>
                          <tr>
                            <th style="border:1px solid black;">Cup</th>
                            <td style="border:1px solid black;" class="center-align">{{ cup_name }}</td> 
                          </tr>
                          <tr>
                            <th style="border:1px solid black;">Kilpailun pistekerroin</th>
                            <td style="border:1px solid black;" class="center-align">{{ cup_points_multiplier }}</td>  
                          </tr>
                          <tr>
                            <th style="border:1px solid black;">Järjestetään</th>
                            <td style="border:1px solid black;" class="center-align">{{ date_of_competition }}</td> 
                          </tr>
                          <tr>
                            <th style="border:1px solid black;">Ajankohta</th>
                            <td style="border:1px solid black;" class="center-align">{{ start_of_competition }} - {{ end_of_competition }}</td>  
                          </tr>
                      </table>
                    </div>
                  </div>

                  <div class="fishes_summary section col s8 push-s2">
                    <div class="center-align">
                      <p class="flow-text">Kalojen määritykset</p>
                    </div>
                    <div class="center-align">
                      <table class="striped highlight centered responsive-table">
                        <thead>
                          <tr>
                            <th>Kalalaji</th>
                            <th>Pistekerroin</th>
                            <th>Alamitta</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(fish, index) in completed_fish_specs" :key="index">
                            <th style="border:1px solid black;" scope="row">{{ fish.name  }}</th>  
                            <td style="border:1px solid black;">{{ fish.multiplier }}</td> 
                            <td style="border:1px solid black;">{{ fish.minsize }}</td>  
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="row section">
                      <div class="col s6">
                        <a class="waves-effect waves-light blue lighten-2 btn-large" v-on:click="tabs.select('points')"><i class="material-icons left">arrow_back</i>Takaisin</a>
                      </div>
                      <div v-if="validated" class="col s6">
                        <a class="waves-effect waves-light green lighten-2 btn-large" v-on:click="submitCompetition"><i class="material-icons left">add_circle_outline</i>Luo kilpailu näillä tiedoilla</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <h2>Tallennetaan kilpailua tietokantaan...</h2>
                  <ProgressBarQuery />
                </div>  
              </div>
            </div>
          </div>

        </div>
        
      </div>
</template>

<script>
import M from 'materialize-css';
import "vue-select/dist/vue-select.css";
import Timedate from '../components/layout/Timedate';
import ProgressBarQuery from '../components/layout/ProgressBarQuery';
import { options_picker } from '../i18n';
import CompetitionService from '../CompetitionService';

export default {
    name: 'RegisterComp',
    components: {
        Timedate,
        ProgressBarQuery
    },
    data() {
        return {
            selected: [],
            errors: [],
            options: ['Ahven','Hauki','Kuha','Lohi','Taimen'],
            competition_name: null,
            cup_name: null,
            cup_points_multiplier: null,
            date_of_competition: null,
            start_of_competition: null,
            end_of_competition: null,
            basic_info: null,
            completed_fish_specs: [],
            basic_info_validated: false,
            fish_species_validated: false,
            fish_specs_validated: false,
            validated: false,
            loading: false,
            tabs: null
        }
    },
    mounted () {
        M.AutoInit();
        /* eslint-disable no-unused-vars */
        var tabs = document.querySelectorAll('.tabs');
        var instance = M.Tabs.init(tabs, options_picker);

        var datepicker = document.querySelectorAll('.datepicker');
        var instances = M.Datepicker.init(datepicker, options_picker);

        var timepicker = document.querySelectorAll('.timepicker');
        var instances2 = M.Timepicker.init(timepicker, options_picker);

        var collabs = document.querySelectorAll('.collapsible');
        var instances3 = M.Collapsible.init(collabs, options_picker);
        /* eslint-enable no-unused-vars */
        var elem = document.querySelectorAll('.tabs')[0];
        this.tabs = M.Tabs.getInstance(elem);

  },
    methods: {
        checkBasicInformation: function() {
            this.errors = [];
            this.basic_info_validated = false;
            this.validated = false;
            this.basic_info = {
                competition_name: this.competition_name,
                cup_name: this.cup_name,
                cup_points_multiplier: this.cup_points_multiplier,
                date_of_competition: this.date_of_competition,
                start_of_competition: this.start_of_competition,
                end_of_competition: this.end_of_competition
            };

            if (!this.competition_name) {
                this.errors.push('Kilpailun nimi puuttuu!');
                M.toast({html: 'Kilpailun nimi puuttuu!'});
                location.href = "#";
                location.href = "#app";
            }
            if (!this.cup_name) {
                this.errors.push('Cupin nimi puuttuu!');
                M.toast({html: 'Cupin nimi puuttuu!'});
                location.href = "#";
                location.href = "#app";
            }
            if (!this.cup_points_multiplier) {
                this.errors.push('Kilpailun pistekerroin puuttuu!');
                M.toast({html: 'Kilpailun pistekerroin puuttuu!'});
                location.href = "#";
                location.href = "#app";
            }
            if (!this.date_of_competition) {
                this.errors.push('Päivämäärää ei ole valittu!');
                M.toast({html: 'Päivämäärää ei ole valittu!'});
                location.href = "#";
                location.href = "#app";
            }
            if (!this.start_of_competition) {
                this.errors.push('Kilpailun alkamisnaika puuttuu!');
                M.toast({html: 'Kilpailun alkamisnaika puuttuu!'});
                location.href = "#";
                location.href = "#app";
            }
            if (!this.end_of_competition) {
                this.errors.push('Kilpailun loppumisaika puuttuu!');
                M.toast({html: 'Kilpailun loppumisaika puuttuu!'});
                location.href = "#";
                location.href = "#app";
            }

            if(!this.errors.length) {
                console.log(this.basic_info);
                console.log("Basic info all good!");
                document.getElementById('fishes-tab').classList.remove('disabled');
                this.disableInputs(true);
                this.tabs.select('fishes');
            }

        },
        checkFishSpecies: function() {
            this.errors = [];
            this.fish_species_validated = false;
            this.validated = false;
            if(this.selected.length){
                this.selected = this.selected.sort();
                console.log(this.selected);
                document.getElementById('points-tab').classList.remove('disabled');
                this.disableInputs(true);
                this.tabs.select('points');
            }
            else{
                this.errors.push('Yhtään kalalajia ei ole valittu!');
                M.toast({html: 'Yhtään kalalajia ei ole valittu!'});
                this.fish_species_validated = false;
                location.href = "#";
                location.href = "#app";
            }

        },
        checkFishSpecs: function() {
            this.completed_fish_specs = [];
            for (let i=1; i < this.selected.length+1; i++) {

                let fish_spec = {
                    name: document.getElementById(`fish_${i}_name`).innerHTML.replace(`${i}. `,""),
                    multiplier: document.getElementById(`fish_${i}_multiplier`).value,
                    minsize: document.getElementById(`fish_${i}_minsize`).value,
                    weights: 0,
                };

                if(!fish_spec.multiplier || !fish_spec.minsize){
                    this.errors = [];
                    M.toast({html: `Syötä kalan '${fish_spec.name}' kaikki tiedot! (Pistekerroin = 1, Alamitta = 0 oletusarvot)`});
                    this.errors.push(`Syötä kalan '${fish_spec.name}' kaikki tiedot! (Pistekerroin = 1, Alamitta = 0 oletusarvot)`);
                    location.href = "#";
                    location.href = "#app";
                }
                else {
                    this.completed_fish_specs.push(fish_spec);
                }
            }

            if (!this.errors.length && (this.completed_fish_specs.length == this.selected.length) && (this.completed_fish_specs.length > 0)) {
                this.fish_specs_validated = true;
                
                if (this.basic_info_validated && this.fish_species_validated && this.fish_specs_validated) {
                    console.log("All good!");
                    document.getElementById('summary-tab').classList.remove('disabled');
                    this.disableInputs(true);
                    this.tabs.select('summary');
                }
                else {
                    this.validated = false;
                    this.basic_info_validated == false ? this.errors.push("Tarkista kilpailun perustiedot!") : console.log("Perustiedot kunnossa!");
                    this.fish_specs_validated == false ? this.errors.push("Tarkista kalojen tiedot!") : console.log("Kalojen tiedot kunnossa!");
                    location.href = "#";
                    location.href = "#app";
                }
            }
            else {
                M.toast({html: 'Joitain tietoja puuttuu vielä!'});
                location.href = "#";
                location.href = "#app";
            }
        },
        disableInputs: function(disable){
            console.log(disable);
            if(this.tabs.index == 0) {
                console.log("In tab: 0")
                if(disable){
                    console.log("All basic info inputs disabled!");
                    document.getElementById('basic-inputs').classList.add('disabledbutton');
                    this.basic_info_validated = true;
                }
                else {
                    console.log("All basic info enabled again!");
                    document.getElementById('basic-inputs').classList.remove('disabledbutton');
                    document.getElementById('select_specs').classList.remove('disabledbutton');
                    this.basic_info_validated = false;
                    this.validated = false;
                }
            }
            if(this.tabs.index == 1) {
                console.log("In tab: 1")
                if(disable){
                    console.log("All basic info inputs disabled!");
                    document.getElementById('fishes_select').classList.add('disabledbutton');
                    this.fish_species_validated = true;
                    
                }
                else {
                    console.log("All basic info enabled again!");
                    document.getElementById('fishes_select').classList.remove('disabledbutton');
                    document.getElementById('select_specs').classList.remove('disabledbutton');
                    this.fish_species_validated = false;
                    this.validated = false;
                }
            }
            if(this.tabs.index == 2) {
                console.log("In tab: 2")
                if(disable){
                    console.log("All basic info inputs disabled!");
                    document.getElementById('select_specs').classList.add('disabledbutton');
                    this.fish_specs_validated = true;
                    this.validated = true;
                }
                else {
                    console.log("All basic info enabled again!");
                    document.getElementById('select_specs').classList.remove('disabledbutton');
                    this.fish_specs_validated = false;
                    this.validated = false;
                }
            }
            if(this.tabs.index == 3) {
                console.log("In tab: 3")
            }

        },
        async submitCompetition() {
          // TODO  better input validation
          if(this.validated){
              this.loading = true;
              //temp id to get correct competition from array, even if somehow there is comp with same name etc.
              const comp_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

              const competition = {
                "competition_id": comp_id,
                "competition_name": this.basic_info.competition_name,
                "cup_name": this.basic_info.cup_name,
                "cup_points_multiplier": this.basic_info.cup_points_multiplier,
                "date_of_competition": this.basic_info.date_of_competition,
                "start_of_competition": this.basic_info.start_of_competition,
                "end_of_competition": this.basic_info.end_of_competition,
                "fishes": this.completed_fish_specs,
                "total_weights": 0,
                "signees": [],
                "results": [],
              }
              try{
                await CompetitionService.insertCompetition(competition);
                M.toast({html: 'Kilpailu lisätty tietokantaan!'});
                this.$store.commit('refreshCompetition', competition);
                this.$router.push({path: '/overview'});
              } catch(err) {
                this.errors.push = err.message;
              } 
          }
          else {
            this.errors.push("Not validated somehow?");
          }
          
        },
    }
}
</script>

<style>

</style>
